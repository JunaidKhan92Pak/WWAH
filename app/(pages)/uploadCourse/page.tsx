"use client";
interface Course {
  [key: string]: string | number | { currency: string; amount: number };
}
import FileButton from "@/components/FileButton";
import { useState } from "react";
import * as XLSX from "xlsx";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    country: string;
    university: string;
    courses: Course[];
  }>({
    country: "",
    university: "",
    courses: [],
  });

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (
        ![
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(selectedFile.type)
      ) {
        setError("Please upload a valid Excel file (.xlsx or .xls).");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    } else {
      setError("No file selected. Please choose a file.");
    }
  };

  // Normalize JSON keys
  const normalizeData = (data: Record<string, string | number>[]) => {
    return data.map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          // ✅ Normalize keys (trim spaces, replace spaces/slashes with underscores, convert to lowercase)
          const normalizedKey = key.trim().replace(/[\s/]+/g, "_").toLowerCase();

          // ✅ Declare normalizedValue only once
          let normalizedValue: string | number | { currency: string; amount: number } = value;

          // ✅ Handle Excel date conversion (if value is a number in Excel date range)
          if (typeof value === "number" && value > 40000 && value < 60000) {
            try {
              const date = XLSX.SSF.parse_date_code(value);
              normalizedValue = new Date(Date.UTC(date.y, date.m - 1, date.d))
                .toISOString()
                .split("T")[0]; // Format as YYYY-MM-DD
            } catch (error) {
              console.error("Excel date conversion failed for:", value, error);
            }
          }

          // ✅ Handle annual tuition fee extraction and normalization
          if (normalizedKey === "annual_tuition_fee") {
            // If the value is a string with a currency symbol (e.g., "$9000" or "€9000")
            if (typeof value === "string") {
              const match = value.match(/([$€£])?([\d,]+)/); // Match optional currency and amount
              if (match) {
                normalizedValue = {
                  currency: match[1] || "$", // Default currency to "$" if not provided
                  amount: parseFloat(match[2].replace(/,/g, "")), // Convert number string to float
                };
              }
            }
            // If the value is a number, treat it as an amount and add the default currency
            else if (typeof value === "number") {
              normalizedValue = {
                currency: "$", // Default to "$" for numbers
                amount: value,
              };
            }
          }

          return [normalizedKey, normalizedValue];
        })
      );
    });
  };

  // Read and process the Excel file
  const handleFileRead = () => {
    if (!file) {
      setError("Please select an Excel file to read.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);
        // Normalize and update parsed data

        const normalizedData = normalizeData(json);

        setParsedData((prev) => ({
          ...prev,
          courses: normalizedData,
        }));
        setError(null);

        // Log parsed courses for debugging
        if (normalizedData.length === 0) {
          setError("The file does not contain any courses.");
        }

      } catch (err) {
        console.error("Error reading file:", err);
        setError("An error occurred while processing the file. Please try again.");
      }
    };

    reader.onerror = () => {
      console.error("File reading failed");
      setError("Failed to read the file. Please try a different file.");
    };
    reader.readAsArrayBuffer(file);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParsedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload data to the server
  const uploadDataToServer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parsedData.university || !parsedData.country || parsedData.courses.length === 0) {
      setError("Please fill all the fields and ensure the file has been parsed.");
      return;
    }

    try {
      // Send the correct data structure
      const payload = {
        country: parsedData.country,
        university: parsedData.university,
        courses: parsedData.courses, // Pass courses as an array
      };

      const response = await fetch("/api/addCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(result.message || "Data uploaded successfully.");
        setParsedData({ country: "", university: "", courses: [] });
        setFile(null);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.message || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      setUploadStatus("An error occurred while uploading data.");
    }
  };


  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Excel File Reader</h1>

      <form onSubmit={uploadDataToServer} className="space-y-4">
        <input
          type="text"
          name="country"
          placeholder="Enter Country"
          value={parsedData.country}
          onChange={handleInputChange}
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="university"
          placeholder="Enter University"
          value={parsedData.university}
          onChange={handleInputChange}
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center justify-center">
          <FileButton handleFile={handleFileRead} />
        </div>
        {/* <button
          type="button"
          onClick={handleFileRead}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Read File
        </button> */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {parsedData.courses.length > 0 && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-bold text-green-700 mb-2">Parsed Data</h2>
            <p><strong>Country:</strong> {parsedData.country}</p>
            <p><strong>University:</strong> {parsedData.university}</p>
            <h3 className="mt-2 text-green-600 font-semibold">Courses:</h3>
            <pre className="bg-gray-100 p-2 rounded-lg text-sm text-gray-800 h-[380px] overflow-auto">
              {JSON.stringify(parsedData.courses, null, 2)}
            </pre>
          </div>
        )}
        {parsedData.courses.length > 0 && (
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mt-4"
          >
            Upload Data to Server
          </button>
        )}
      </form>
      {uploadStatus && <p className="text-center mt-4">{uploadStatus}</p>}
    </div>
  );
}
