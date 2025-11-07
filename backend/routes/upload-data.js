const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const { pool } = require('../config/database');
const router = express.Router();

// Limit uploads to 20 MB to allow larger CSV/XLSX files while still mitigating DOS
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const processCsvData = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim());
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      data.push(record);
    }
  }
  return data;
};

const processExcelData = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  // Read header row
  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values
    .slice(1) // ExcelJS row.values is 1-based and may have undefined at 0
    .map(h => (h === undefined || h === null) ? '' : String(h).trim());

  const data = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const record = {};
    headers.forEach((header, idx) => {
      const cell = row.getCell(idx + 1);
      record[header || `column_${idx+1}`] = cell.value === undefined || cell.value === null ? '' : cell.value;
    });
    data.push(record);
  });

  return data;
};

const analyzeTrendsFromDB = async () => {
  // Get festival trends
  const [festivalRows] = await pool.execute(`
    SELECT festival, product, SUM(quantity) as productQuantity, SUM(quantity * price) as productRevenue
    FROM sales_data 
    WHERE festival IS NOT NULL AND festival != ''
    GROUP BY festival, product
  `);
  
  const festivalTrends = {};
  festivalRows.forEach(row => {
    if (!festivalTrends[row.festival]) {
      festivalTrends[row.festival] = { products: {}, totalRevenue: 0 };
    }
    festivalTrends[row.festival].products[row.product] = {
      quantity: row.productQuantity,
      revenue: row.productRevenue
    };
  });
  
  // Calculate total revenue per festival
  const [festivalTotals] = await pool.execute(`
    SELECT festival, SUM(quantity * price) as totalRevenue
    FROM sales_data 
    WHERE festival IS NOT NULL AND festival != ''
    GROUP BY festival
  `);
  
  festivalTotals.forEach(row => {
    if (festivalTrends[row.festival]) {
      festivalTrends[row.festival].totalRevenue = row.totalRevenue;
    }
  });
  
  // Get product trends
  const [productRows] = await pool.execute(`
    SELECT product, category, SUM(quantity) as totalQuantity, SUM(quantity * price) as totalRevenue
    FROM sales_data 
    GROUP BY product, category
  `);
  
  const productTrends = {};
  productRows.forEach(row => {
    productTrends[row.product] = {
      category: row.category,
      totalQuantity: row.totalQuantity,
      totalRevenue: row.totalRevenue
    };
  });
  
  return { festivalTrends, productTrends };
};

const generatePredictionsFromDB = async (trends) => {
  const predictions = [];
  
  // Clear existing predictions
  await pool.execute('DELETE FROM predictions');
  
  // Generate festival predictions
  for (const [festival, data] of Object.entries(trends.festivalTrends)) {
    const topProducts = Object.entries(data.products)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 3);

    const prediction = {
      type: 'festival',
      festival,
      prediction: `${festival}: Top products - ${topProducts.map(([product, data]) => 
        `${product} (${data.quantity} units)`).join(', ')}`,
      revenue: data.totalRevenue,
      confidence: 85
    };
    
    predictions.push(prediction);
    
    // Store in database
    await pool.execute(
      'INSERT INTO predictions (type, festival, prediction, confidence, revenue) VALUES (?, ?, ?, ?, ?)',
      [prediction.type, prediction.festival, prediction.prediction, prediction.confidence, prediction.revenue]
    );
  }
  
  // Store festival trends
  await pool.execute('DELETE FROM festival_trends');
  for (const [festival, data] of Object.entries(trends.festivalTrends)) {
    const totalQuantity = Object.values(data.products).reduce((sum, p) => sum + p.quantity, 0);
    await pool.execute(
      'INSERT INTO festival_trends (festival, total_revenue, total_quantity) VALUES (?, ?, ?)',
      [festival, data.totalRevenue, totalQuantity]
    );
  }
  
  return predictions;
};

router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('[backend upload] received request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });

    if (req.file) {
      console.log('[backend upload] multer parsed file:', { originalname: req.file.originalname, size: req.file.size });
    } else {
      console.log('[backend upload] multer did not find a file on req.file');
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let data;
    if (req.file.originalname.endsWith('.csv')) {
      const csvText = req.file.buffer.toString('utf-8');
      data = processCsvData(csvText);
    } else if (req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
      data = processExcelData(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Store data in database
    for (const record of data) {
      await pool.execute(
        'INSERT INTO sales_data (date, product, category, quantity, price, festival) VALUES (?, ?, ?, ?, ?, ?)',
        [record.date, record.product, record.category, record.quantity, record.price, record.festival || null]
      );
    }
    
    // Analyze trends from database
    const trends = await analyzeTrendsFromDB();
    const predictions = await generatePredictionsFromDB(trends);

    res.json({
      success: true,
      recordsProcessed: data.length,
      trends,
      predictions,
      summary: {
        totalRecords: data.length,
        festivals: Object.keys(trends.festivalTrends).length,
        products: Object.keys(trends.productTrends).length
      }
    });

  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;