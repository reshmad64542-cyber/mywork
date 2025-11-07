import { NextResponse } from 'next/server';

// Redirect to backend API

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

export async function GET(request) {
  // This route is handled by backend - redirect
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  return NextResponse.json({ error: `Use backend API at ${backendUrl}/api/download-report` }, { status: 400 });
}