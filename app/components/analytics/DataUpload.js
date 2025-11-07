"use client";
import { useState } from "react";

export default function DataUpload({ onDataUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadStatus("Uploading and processing data...");
    
    try {
      setError(null);

      // Use Next.js proxy so uploads are forwarded server-side to backend (avoids CORS)
      const response = await fetch('/api/upload-data', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setUploadStatus(`✅ Successfully processed ${result.recordsProcessed || 0} records`);
        if (onDataUploaded) onDataUploaded(result);
      } else {
        throw new Error(result.error || `Server returned ${response.status}`);
      }
    } catch (error) {
      setUploadStatus(`❌ Upload failed: ${error.message}`);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">📊 Upload Sales Data</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Processing...' : '📁 Choose CSV/Excel File'}
        </label>
        
        <p className="mt-2 text-sm text-gray-600">
          Upload sales data with columns: date, product, category, quantity, price, festival
        </p>
        
        {uploadStatus && (
          <div className="mt-4 p-3 rounded-md bg-gray-50">
            <p className="text-sm">{uploadStatus}</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Expected format:</strong></p>
        <p>• date (YYYY-MM-DD), product, category, quantity, price, festival</p>
        <p>• Festival examples: Diwali, Holi, Christmas, Eid, etc.</p>
      </div>
    </div>
  );
}