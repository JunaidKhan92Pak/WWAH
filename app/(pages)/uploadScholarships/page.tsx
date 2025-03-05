"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setResult("");

        try {
            // Read the file as an ArrayBuffer
            const data = await file.arrayBuffer();

            // Parse the file using XLSX
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // Using the first sheet
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log(jsonData)
            // Send the JSON data to your API endpoint
            const res = await fetch("/api/addScholarship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });
            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
        } catch (error) {
            console.error("Error uploading file:", error);
            setResult("Error uploading file: " + (error instanceof Error ? error.message : "Unknown error"));
        }
        setUploading(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Upload Excel Data for Scholarships</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {result && (
                <pre className="mt-4 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
                    {result}
                </pre>
            )}
        </div>
    );
};

export default ExcelUploader;
