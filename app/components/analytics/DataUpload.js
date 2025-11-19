"use client";

import React, { useState } from "react";

export default function DataUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/upload-data", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (res.ok) {
        alert(`✅ ${data.message} (${data.total} records)`);
        setPreview(data.sample || []);
      } else {
        alert(`❌ Upload failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">📁 Upload Sales Data</h2>
      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 rounded text-white ${
          uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {preview.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Sample Data:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
