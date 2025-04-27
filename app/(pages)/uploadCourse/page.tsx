"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
// import FileButton from "@/components/FileButton";

// Define proper TypeScript interfaces
interface TuitionFee {
    currency: string;
    amount: number;
}

interface Course {
    [key: string]: string | number | TuitionFee | string[] | null | undefined;
    course_id?: string;
    course_title: string;
    course_link?: string;
}

interface ParsedData {
    country: string;
    university: string;
    courses: Course[];
}

interface UploadResult {
    message: string;
    summary?: {
        added: number;
        updated: number;
        skipped: number;
        failed: number;
        total: number;
    };
    details?: {
        added: number[];
        updated: number[];
        skipped: number[];
        failed: { course: string; error: string }[];
    };
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedData>({
        country: "",
        university: "",
        courses: [],
    });
    const [uploadStatus, setUploadStatus] = useState<UploadResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            setUploadStatus(null);
        } else {
            setError("No file selected. Please choose a file.");
        }
    };

    // Process array fields correctly
    const handleArrayFields = (key: string, value: string) => {
        // Fields that should be arrays
        const arrayFields = ['intake', 'start_date'];

        if (arrayFields.includes(key)) {
            if (Array.isArray(value)) {
                return value;
            } else if (typeof value === 'string') {
                // Split by commas or semicolons, trim each value, and filter out empty entries
                return value.split(/[,;]/).map(item => item.trim()).filter(Boolean);
            } else if (value) {
                // If it's not an array or string but has a value, make it a single-item array
                return [String(value)];
            }
            return [];
        }

        return value;
    };

    // Handle tuition fee parsing
    const parseTuitionFee = (value: string | number): TuitionFee => {
        // Default value
        const defaultFee: TuitionFee = { currency: "$", amount: 0 };

        if (typeof value === "string") {
            // Try to match currency symbol and amount
            const currencyMatch: RegExpMatchArray | null = value.match(/^([€£$¥]|USD|CAD|EUR|GBP|AUD|NZD)/i);
            const numberMatch: RegExpMatchArray | null = value.match(/[\d,\.]+/);

            if (numberMatch) {
                const amount: number = parseFloat(numberMatch[0].replace(/,/g, ""));
                let currency: string = "$";

                if (currencyMatch) {
                    switch (currencyMatch[0].toUpperCase()) {
                        case "€":
                        case "EUR":
                            currency = "€";
                            break;
                        case "£":
                        case "GBP":
                            currency = "£";
                            break;
                        case "¥":
                            currency = "¥";
                            break;
                        case "AUD":
                        case "NZD":
                        case "CAD":
                        case "USD":
                        default:
                            currency = "$";
                    }
                }

                return { currency, amount };
            }
        } else if (typeof value === "number" && !isNaN(value)) {
            return { currency: "$", amount: value };
        }

        return defaultFee;
    };

    // Normalize JSON keys
    const normalizeData = (data: Record<string, string | number>[]): Course[] => {

        return data.map((row) => {
            const normalizedRow: Course = { course_title: "" };

            Object.entries(row).forEach(([key, value]) => {
                // Normalize keys (trim spaces, replace spaces/slashes with underscores, convert to lowercase)
                const normalizedKey = key.trim().replace(/[\s/]+/g, "_").toLowerCase();

                // Skip empty values
                if (value === null || value === undefined || value === "") {
                    return;
                }

                // Handle Excel date conversion
                if (typeof value === "number" && value > 40000 && value < 60000) {
                    try {
                        const date = XLSX.SSF.parse_date_code(value);
                        normalizedRow[normalizedKey] = new Date(
                            Date.UTC(date.y, date.m - 1, date.d)
                        ).toISOString().split("T")[0]; // Format as YYYY-MM-DD
                        return;
                    } catch (error) {
                        console.error("Excel date conversion failed for:", value, error);
                    }
                }

                // Special handling for annual_tuition_fee
                if (normalizedKey === "annual_tuition_fee") {
                    normalizedRow[normalizedKey] = parseTuitionFee(value);
                    return;
                }

                // Handle array fields
                normalizedRow[normalizedKey] = handleArrayFields(normalizedKey, String(value));
            });

            // Validate course has a title
            if (!normalizedRow.course_title) {
                console.warn("Course missing title:", normalizedRow);
            }

            return normalizedRow;
        }).filter(course => course.course_title); // Filter out courses without titles
    };

    // Read and process the Excel file
    const handleFileRead = () => {
        if (!file) {
            setError("Please select an Excel file to read.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                // const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
                const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);
                // Normalize and update parsed data
                const normalizedData = normalizeData(json);

                if (normalizedData.length === 0) {
                    setError("The file does not contain any valid courses.");
                    setIsLoading(false);
                    return;
                }

                setParsedData((prev) => ({
                    ...prev,
                    courses: normalizedData,
                }));

                // Try to extract university and country from first row if present
                if (normalizedData.length > 0) {
                    const firstCourse = normalizedData[0];
                    if (firstCourse.universityname && !parsedData.university) {
                        setParsedData(prev => ({ ...prev, university: String(firstCourse.universityname) }));
                    }
                    if (firstCourse.countryname && !parsedData.country) {
                        setParsedData(prev => ({ ...prev, country: String(firstCourse.countryname) }));
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Error reading file:", err);
                setError("An error occurred while processing the file. Please try again.");
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            console.error("File reading failed");
            setError("Failed to read the file. Please try a different file.");
            setIsLoading(false);
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

        if (!parsedData.university.trim()) {
            setError("Please enter the university name.");
            return;
        }

        if (!parsedData.country.trim()) {
            setError("Please enter the country name.");
            return;
        }

        if (parsedData.courses.length === 0) {
            setError("No courses to upload. Please parse a valid Excel file first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                country: parsedData.country.trim(),
                university: parsedData.university.trim(),
                courses: parsedData.courses,
            };

            const response = await fetch("/api/addCourse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const result = await response.json();

            if (response.ok) {
                setUploadStatus(result);

                // Clear form if there were no errors
                if (!result.details?.failed?.length) {
                    setParsedData({ country: "", university: "", courses: [] });
                    setFile(null);
                }
            } else {
                setUploadStatus({
                    message: `Error: ${result.message || "Unknown error occurred."}`,
                    summary: { added: 0, updated: 0, skipped: 0, failed: parsedData.courses.length, total: parsedData.courses.length }
                });
            }
        } catch (error) {
            console.error("Error uploading data:", error);
            setUploadStatus({
                message: "An error occurred while uploading data.",
                summary: { added: 0, updated: 0, skipped: 0, failed: parsedData.courses.length, total: parsedData.courses.length }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Render upload status with more details
    const renderUploadStatus = () => {
        if (!uploadStatus) return null;

        const isError = uploadStatus.message.startsWith("Error");
        const statusClass = isError ? "text-red-600" : "text-green-600";

        return (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <h3 className={`font-bold ${statusClass}`}>{uploadStatus.message}</h3>

                {uploadStatus.summary && (
                    <div className="mt-2">
                        <div className="flex justify-between text-sm">
                            <span>✅ Added: {uploadStatus.summary.added}</span>
                            <span>🔄 Updated: {uploadStatus.summary.updated}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>⏭️ Skipped: {uploadStatus.summary.skipped}</span>
                            <span>❌ Failed: {uploadStatus.summary.failed}</span>
                        </div>
                        <div className="mt-1 text-sm text-center">
                            Total processed: {uploadStatus.summary.total}
                        </div>
                    </div>
                )}

                {(uploadStatus?.details?.failed?.length ?? 0) > 0 && (
                    <div className="mt-2">
                        <details>
                            <summary className="cursor-pointer text-red-500 font-semibold">
                                Show Failed Items ({uploadStatus.details?.failed?.length || 0})
                            </summary>
                            <ul className="mt-1 text-xs text-red-600 list-disc pl-5">
                                {uploadStatus.details?.failed?.map((item, i) => (
                                    <li key={i}>{item.course}: {item.error}</li>
                                ))}
                            </ul>
                        </details>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Course Data Uploader
            </h1>

            <form onSubmit={uploadDataToServer} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            id="country"
                            type="text"
                            name="country"
                            placeholder="Enter Country"
                            value={parsedData.country}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                            University
                        </label>
                        <input
                            id="university"
                            type="text"
                            name="university"
                            placeholder="Enter University"
                            value={parsedData.university}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                        Excel File
                    </label>
                    <input
                        id="file"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="block w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={handleFileRead}
                        disabled={!file || isLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Parse Excel File"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {parsedData.courses.length > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-green-700">Parsed Data</h2>
                            <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded-full">
                                {parsedData.courses.length} courses
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                                <span className="font-semibold">Country:</span> {parsedData.country || "-"}
                            </div>
                            <div>
                                <span className="font-semibold">University:</span> {parsedData.university || "-"}
                            </div>
                        </div>

                        <details>
                            <summary className="cursor-pointer text-green-600 font-semibold text-sm mb-1">
                                Show Course Data
                            </summary>
                            <pre className="bg-gray-100 p-2 rounded-lg text-xs text-gray-800 h-[300px] overflow-auto">
                                {JSON.stringify(parsedData.courses, null, 2)}
                            </pre>
                        </details>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Courses to Server"
                            )}
                        </button>
                    </div>
                )}
            </form>

            {renderUploadStatus()}
        </div>
    );
}