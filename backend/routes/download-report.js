const express = require('express');
const jsPDF = require('jspdf');
const { pool } = require('../config/database');
const router = express.Router();

const generateCSV = (data) => {
  const headers = ['Type', 'Prediction', 'Confidence', 'Revenue', 'Festival/Product'];
  const rows = data.predictions.map(p => [
    p.type,
    p.prediction,
    `${p.confidence}%`,
    p.revenue || 0,
    p.festival || p.product || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
};

const generatePDF = (data) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('E-COMMERCE ANALYTICS REPORT', 20, 20);
  
  // Date
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
  
  let yPos = 50;
  
  // Predictions Section
  doc.setFontSize(16);
  doc.text('PREDICTIONS & INSIGHTS', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  data.predictions.forEach((p, i) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(`${i + 1}. [${p.type.toUpperCase()}] ${p.prediction}`, 20, yPos);
    yPos += 7;
    doc.text(`   Confidence: ${p.confidence}%`, 25, yPos);
    yPos += 5;
    
    if (p.revenue) {
      doc.text(`   Revenue Impact: ₹${p.revenue.toLocaleString()}`, 25, yPos);
      yPos += 5;
    }
    yPos += 5;
  });
  
  // Festival Trends Section
  if (data.trends.festivalTrends && Object.keys(data.trends.festivalTrends).length > 0) {
    yPos += 10;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.text('FESTIVAL TRENDS', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    Object.entries(data.trends.festivalTrends).forEach(([festival, trend]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${festival}: ₹${trend.totalRevenue.toLocaleString()}`, 20, yPos);
      yPos += 7;
    });
  }
  
  return doc.output('arraybuffer');
};

router.get('/', async (req, res) => {
  try {
    const { format } = req.query;
    
    // Fetch data from database
    const [predictions] = await pool.execute('SELECT * FROM predictions ORDER BY created_at DESC');
    const [festivalTrends] = await pool.execute('SELECT * FROM festival_trends ORDER BY total_revenue DESC');
    
    const reportData = {
      predictions: predictions.map(p => ({
        type: p.type,
        festival: p.festival,
        product: p.product,
        prediction: p.prediction,
        confidence: p.confidence,
        revenue: p.revenue
      })),
      trends: {
        festivalTrends: festivalTrends.reduce((acc, trend) => {
          acc[trend.festival] = { totalRevenue: trend.total_revenue };
          return acc;
        }, {})
      }
    };

    let content, contentType, filename;
    
    if (format === 'csv') {
      content = generateCSV(reportData);
      contentType = 'text/csv';
      filename = 'analytics-report.csv';
    } else if (format === 'pdf') {
      content = generatePDF(reportData);
      contentType = 'application/pdf';
      filename = 'analytics-report.pdf';
    } else {
      return res.status(400).json({ error: 'Invalid format' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(content));

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

module.exports = router;