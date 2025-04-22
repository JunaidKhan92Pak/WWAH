"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
            setResult("");
        }
    };

    // Helper function to convert an Excel serial date to a formatted string "Month-YYYY"
    function formatExcelDate(serial: number): string {
        try {
            // Excel's epoch starts at January 1, 1900. Adjust for Excel's bug that treats 1900 as a leap year.
            const jsDate = new Date((serial - 25569) * 86400 * 1000);
            // Format as "Month-YYYY" using locale string options
            const month = jsDate.toLocaleString('en-US', { month: 'long' });
            const year = jsDate.getFullYear();
            return `${month}-${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Unknown Date";
        }
    }

    // Process Excel data to match our schema structure
    const processExcelData = (rawData) => {
        return rawData.map(item => {
            // Format date if it's a number
            if (item["Deadline"] && typeof item["Deadline"] === "number") {
                item["Deadline"] = formatExcelDate(item["Deadline"]);
            }
            // Create structured object that matches our MongoDB schema
            return {
                name: item["Name of Scholarship"]?.trim() || "Unnamed Scholarship",
                hostCountry: item["Host Country"]?.trim() || "Unknown",
                type: item["Scholarship Type"]?.trim() || "Not Specified",
                deadline: item["Deadline"] ? String(item["Deadline"]).trim() : "",
                numberOfScholarships: Number(item["Number of Scholarships"]) || 1,
                overview: item["Scholarship Overview"]?.trim() || "No overview available",
                programs: item["Programs"]?.toString().split(",").map((p: string) => p.trim()) || [],

                // Structure for duration
                duration: {
                    bachelors: item["Duration of the Scholarship 1"]?.trim() || "",
                    masters: item["Duration of the Scholarship 2"]?.trim() || "",
                    phd: item["Duration of the Scholarship 3"]?.trim() || ""
                },

                // Extract all benefits
                benefits: Object.keys(item)
                    .filter(key => key.toLowerCase().startsWith("benefits of scholarship"))
                    .map(key => item[key]?.trim())
                    .filter(Boolean),

                // Extract departments and their details
                applicableDepartments: Object.keys(item)
                    .filter(key => key.toLowerCase().startsWith("applicable department"))
                    .map(key => {
                        const deptNumber = key.match(/\d+/)?.[0];
                        return {
                            name: item[key]?.trim() || "",
                            details: item[`Detail ${deptNumber}`]?.trim() || ""
                        };
                    })
                    .filter(dept => dept.name),

                // Extract eligibility criteria
                eligibilityCriteria: Object.keys(item)
                    .filter(key => key.toLowerCase().startsWith("eligibility criteria") && !key.toLowerCase().includes("detail"))
                    .map(key => {
                        const criterionNumber = key.match(/\d+/)?.[0];
                        return {
                            criterion: item[key]?.trim() || "",
                            details: item[`Eligibility Criteria ${criterionNumber} Detail`]?.trim() ||
                                item[`Eligibility Criteria ${criterionNumber} details`]?.trim() || ""
                        };
                    })
                    .filter(criteria => criteria.criterion),

                // Extract required documents and their details
                requiredDocuments: Object.keys(item)
                    .filter(key => key.toLowerCase().startsWith("required document") && !key.toLowerCase().includes("detail"))
                    .map(key => {
                        const docNumber = key.match(/\d+/)?.[0];
                        return {
                            document: item[key]?.trim() || "",
                            details: item[`Required Document ${docNumber} Detail`]?.trim() || ""
                        };
                    })
                    .filter(doc => doc.document),

                // Extract success chances
                successChances: {
                    academicBackground: item["Success Chances Academic Background"]?.trim() || "",
                    age: item["Success Chances Age"]?.trim() || "",
                    englishProficiency: item["Success Chances English Proficiency"]?.trim() || "",
                    gradesAndCGPA: item["Success Chances Grades and CGPA"]?.trim() || "",
                    nationality: item["Success Chances Nationality"]?.trim() || "",
                    workExperience: item["Success Chances Work Experience"]?.trim() || ""
                },

                minimumRequirements: item["Minimum Requirements"]?.trim() ||
                    item["Min Requirement"]?.trim() || ""
            };
        });
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setResult("");
        setError("");

        try {
            // Read the file as an ArrayBuffer
            const data = await file.arrayBuffer();
            // Parse the file using XLSX
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // Using the first sheet
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                throw new Error("No data found in the Excel file");
            }

            // Log headers for debugging
            if (jsonData.length > 0) {
                console.log("Parsed Headers:");
            }

            // Process the data to match our schema
            const processedData = processExcelData(jsonData);
            console.log("Processed data:", processedData);
            // Send the processed JSON data to your API endpoint
            const res = await fetch("/api/addScholarship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(processedData),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`API returned status: ${res.status}`);
            }

            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(error instanceof Error ? error.message : "Unknown error occurred");
        }

        setUploading(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Upload Excel Data for Scholarships</h1>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">Upload Excel file with scholarship data</p>
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-4">
                    <h3 className="font-bold text-green-700">Upload Successful</h3>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap overflow-auto max-h-96">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ExcelUploader;