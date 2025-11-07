import { NextResponse } from 'next/server';

// Redirect to backend API

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

const processExcelData = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

const analyzeTrendsFromDB = async (connection) => {
  // Get festival trends
  const [festivalRows] = await connection.execute(`
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
  const [festivalTotals] = await connection.execute(`
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
  const [productRows] = await connection.execute(`
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

const generatePredictionsFromDB = async (connection, trends) => {
  const predictions = [];
  
  // Clear existing predictions
  await connection.execute('DELETE FROM predictions');
  
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
    await connection.execute(
      'INSERT INTO predictions (type, festival, prediction, confidence, revenue) VALUES (?, ?, ?, ?, ?)',
      [prediction.type, prediction.festival, prediction.prediction, prediction.confidence, prediction.revenue]
    );
  }
  
  // Store festival trends
  await connection.execute('DELETE FROM festival_trends');
  for (const [festival, data] of Object.entries(trends.festivalTrends)) {
    const totalQuantity = Object.values(data.products).reduce((sum, p) => sum + p.quantity, 0);
    await connection.execute(
      'INSERT INTO festival_trends (festival, total_revenue, total_quantity) VALUES (?, ?, ?)',
      [festival, data.totalRevenue, totalQuantity]
    );
  }
  
  return predictions;
};

export async function POST(request) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  try {
    // Forward the incoming request body (which may be a multipart/form-data stream)
    const contentType = request.headers.get('content-type') || '';

    // Debug
    try { console.log('[upload proxy] forwarding upload to', `${backendUrl}/api/upload-data`, 'content-type:', contentType); } catch (e) {}

    // Prefer streaming the request.body directly (works in Node and Edge runtimes).
    // Fallback to blob() if body isn't a readable stream in this runtime.
    let forwardBody = null;
    if (request.body) {
      forwardBody = request.body;
    } else {
      try {
        const blob = await request.blob();
        forwardBody = blob;
      } catch (e) {
        console.warn('[upload proxy] request.body and blob() both unavailable');
        return NextResponse.json({ error: 'Unable to read upload body' }, { status: 500 });
      }
    }

    const res = await fetch(`${backendUrl}/api/upload-data`, {
      method: 'POST',
      headers: {
        ...(contentType ? { 'content-type': contentType } : {}),
      },
      body: forwardBody,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Upload proxy error:', err);
    return NextResponse.json({ error: 'Failed to forward upload to backend' }, { status: 500 });
  }
}