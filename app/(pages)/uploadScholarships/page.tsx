"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

// Define the structure of each row in your Excel sheet
interface ExcelRow {
  [key: string]: string | number | undefined;
}

// Define the final scholarship structure for MongoDB
interface ScholarshipData {
  name: string;
  hostCountry: string;
  type: string;
  provider: string;
  deadline: string;
  numberOfScholarships: number | string;
  overview: string;
  programs: string[];
  minimumRequirements: string;
  officialLink: string;

  duration: {
    general?: string;
    bachelors?: string;
    masters?: string;
    phd?: string;
  };

  benefits: string[];

  eligibilityCriteria: Array<{
    criterion: string;
    details: string;
  }>;

  requiredDocuments: Array<{
    document: string;
    details: string;
  }>;

  applicationProcess: Array<{
    step: string;
    details: string;
  }>;

  successChances: {
    academicBackground: string;
    age: string;
    englishProficiency: string;
    gradesAndCGPA: string;
    nationality: string;
    workExperience: string;
  };

  applicableDepartments: Array<{
    name: string;
    details: string;
  }>;
}

// Structure for the second file's column-based data
interface ColumnData {
  [key: string]: string[];
}

const ImprovedExcelUploader = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [processedData, setProcessedData] = useState<ScholarshipData[]>([]);
  const [file2Data, setFile2Data] = useState<ColumnData>({});
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>(
    {}
  );
  const [uploadStatus] = useState<string | null>(null);
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [universityImages, setUniversityImages] = useState<{
    [key: string]: string | null;
  }>({});

  const allImages = ["banner", "logo"];
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check if file is an allowed image format (only JPG and PNG)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError(`Unsupported file type: ${file.type} for ${imageType}. Please use JPG or PNG formats only.`);
        e.target.value = ""; // Reset input
        return;
      }

      setImageFiles((prev) => ({ ...prev, [imageType]: file }));
      // Remove from missing images list if it was there
      setMissingImages(prev => prev.filter(img => img !== imageType));
    }
  };
  const handleAllImagesUpload = async () => {
    // Check for missing images
    const missing: string[] = [];
    allImages.forEach(imageType => {
      if (!imageFiles[imageType]) {
        missing.push(imageType);
      }
    });

    // If there are missing images, update state and return
    if (missing.length > 0) {
      setError(`Missing images: ${missing.join(", ")}. Please upload all required images.`);
      return;
    }

    // Set uploading state to true
    setUploading(true);
    try {
      // Continue with upload if all images are present
      const selectedImages = Object.entries(imageFiles).filter(
        ([, file]) => file
      );


      const imagesData: { [key: string]: string } = {};
      await Promise.all(
        selectedImages.map(async ([imageType, file]) => {
          if (!file) return;

          const reader = new FileReader();
          const imageReadPromise = new Promise<void>((resolve, reject) => {
            reader.onloadend = async () => {
              imagesData[imageType] = reader.result as string;
              resolve();
            };
            reader.onerror = reject;
          });

          reader.readAsDataURL(file);
          await imageReadPromise;
        })
      );

      const response = await fetch("/api/addUniversityImges", {
        method: "POST",
        body: JSON.stringify({ images: imagesData, universityName: "Scholarship" }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setUniversityImages(result.imageUrls);
      } else {
        setError(result.error || "Image upload failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred while uploading images: ${error.message}`);
      } else {
        setError(`An error occurred while uploading images: ${String(error)}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile1(e.target.files[0]);
      setError("");
      setResult("");
      setProcessedData([]);
    }
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile2(e.target.files[0]);
      setError("");
      setResult("");
      setFile2Data({});
    }
  };

  // Read and process the second file (column-based format)
  // Alternative simpler approach if the above is too complex
  const processFile2 = async (file: File): Promise<ColumnData> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonArray = XLSX.utils.sheet_to_json(worksheet);

    // Transform row-based to column-based
    const columnData: Record<string, string[]> = {};
    jsonArray.forEach((row) => {
      Object.entries(row as Record<string, unknown>).forEach(([key, value]) => {
        if (!columnData[key]) columnData[key] = [];

        // Handle different value types
        let stringValue: string;
        if (value instanceof Date) {
          // Format date as readable string
          stringValue = value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          });
        } else {
          stringValue = String(value);
        }

        columnData[key].push(stringValue);
      });
    });

    return columnData;
  };
  // Convert Excel serial date to formatted string
  const formatExcelDate = (serial: number): string => {
    try {
      const jsDate = new Date((serial - 25569) * 86400 * 1000);
      const month = jsDate.toLocaleString("en-US", { month: "long" });
      const year = jsDate.getFullYear();
      return `${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return serial.toString();
    }
  };

  // Helper function to safely get string value
  interface GetString {
    (value: string | number | undefined | null): string;
  }

  const getString: GetString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  // Helper function to get number value
  const getNumber = (value: number | string): number => {
    if (value === null || value === undefined || value === "") return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to format grades/CGPA (convert decimals like 0.75 to percentages like 75)
  const formatGradesAndCGPA = (value: string): string => {
    if (value === null || value === undefined || value === "") return "";

    const num = Number(value);
    if (isNaN(num)) return getString(value);

    // If it's a decimal between 0 and 1, convert to percentage
    if (num > 0 && num < 1) {
      return Math.round(num * 100).toString();
    }

    // If it's already a percentage or other format, return as string
    return num.toString();
  };

  // Helper function to extract grouped data (like benefits, eligibility criteria, etc.)
  const extractGroupedData = (
    item: ExcelRow,
    prefix: string,
    detailPrefix?: string
  ): Array<{ key: string; value: string; details?: string }> => {
    const groupedData: Array<{ key: string; value: string; details?: string }> = [];

    Object.keys(item).forEach(key => {
      if (key.toLowerCase().startsWith(prefix.toLowerCase())) {
        const value = getString(item[key]);
        if (value) {
          // Extract number from key for matching details
          const match = key.match(/\d+/);
          const number = match ? match[0] : "";

          let details = "";
          if (detailPrefix && number) {
            // Try multiple possible detail key formats
            const possibleDetailKeys = [
              `${detailPrefix} ${number} Detail`,
              `${detailPrefix} ${number} details`,
              `${detailPrefix}${number} Detail`,
              `${detailPrefix}${number} details`
            ];

            for (const detailKey of possibleDetailKeys) {
              if (item[detailKey]) {
                details = getString(item[detailKey]);
                break;
              }
            }
          }

          groupedData.push({
            key,
            value,
            details
          });
        }
      }
    });

    return groupedData.sort((a, b) => {
      const aNum = a.key.match(/\d+/)?.[0] || "0";
      const bNum = b.key.match(/\d+/)?.[0] || "0";
      return parseInt(aNum) - parseInt(bNum);
    });
  };

  // Merge data from both files
  const mergeDataSources = (scholarshipData: ScholarshipData[], columnData: ColumnData) => {
    return scholarshipData.map((scholarship) => {
      const enhancedScholarship = {
        ...scholarship,
        table: {
          course: columnData["Courses"] || ["Course"] || [],
          create_application: columnData["Create Your Application"] || [],
          deadline: columnData["Deadline"] || [],
          duration: columnData["Duration"] || [],
          entry_requirements: columnData["Entry Requirements"] || [],
          faculty_department: columnData["Faculty/Department"] || [],
          scholarship_type: columnData["Scholarship Type"] || [],
          teaching_language: columnData["Teaching Language"] || [],
          university: columnData["Host University"] || ["University"] || [],
        } // Full table for each (memory intensive!)
      };
      return enhancedScholarship;
    });
  };
  // Process Excel data to match MongoDB schema
  const processExcelData = (rawData: ExcelRow[]): ScholarshipData[] => {
    return rawData.map((item, index) => {
      console.log(`Processing row ${index + 1}:`, item);
      // Handle deadline formatting
      let deadline = getString(item["Deadline"]);
      if (item["Deadline"] && typeof item["Deadline"] === "number") {
        deadline = formatExcelDate(item["Deadline"]);
      }

      // Extract benefits
      const benefitsData = extractGroupedData(item, "Benefits of Scholarship");
      const benefits = benefitsData.map(b => b.value);

      // Extract eligibility criteria with details - handle naming inconsistencies
      const eligibilityCriteria: Array<{ criterion: string; details: string }> = [];

      // First, collect all eligibility criteria entries (not details)
      const eligibilityEntries = Object.keys(item)
        .filter(key =>
          key.toLowerCase().startsWith("eligibility criteria") &&
          !key.toLowerCase().includes("detail")
        )
        .sort((a, b) => {
          const aNum = a.match(/\d+/)?.[0] || "0";
          const bNum = b.match(/\d+/)?.[0] || "0";
          return parseInt(aNum) - parseInt(bNum);
        });

      // Then match each criterion with its corresponding detail
      eligibilityEntries.forEach(key => {
        const criterionValue = getString(item[key]);
        if (criterionValue) {
          const criterionNumber = key.match(/\d+/)?.[0];
          let details = "";

          if (criterionNumber) {
            // Try multiple possible detail key formats
            const possibleDetailKeys = [
              `Eligibility Criteria ${criterionNumber} Detail`,
              `Eligibility Criteria ${criterionNumber} details`,
              `Eligiblity Criteria ${criterionNumber} Detail`, // Handle typo in original data
              `Eligiblity Criteria ${criterionNumber} details`
            ];

            for (const detailKey of possibleDetailKeys) {
              if (item[detailKey]) {
                details = getString(item[detailKey]);
                break;
              }
            }
          }

          eligibilityCriteria.push({
            criterion: criterionValue,
            details: details
          });
        }
      });

      // Extract required documents with details - special handling needed
      const requiredDocuments: Array<{ document: string; details: string }> = [];

      // First, collect all document entries (not details)
      const documentEntries = Object.keys(item)
        .filter(key =>
          key.toLowerCase().startsWith("required document") &&
          !key.toLowerCase().includes("detail")
        )
        .sort((a, b) => {
          const aNum = a.match(/\d+/)?.[0] || "0";
          const bNum = b.match(/\d+/)?.[0] || "0";
          return parseInt(aNum) - parseInt(bNum);
        });

      // Then match each document with its corresponding detail
      documentEntries.forEach(key => {
        const docValue = getString(item[key]);
        if (docValue) {
          const docNumber = key.match(/\d+/)?.[0];
          let details = "";

          if (docNumber) {
            // Try to find the corresponding detail
            const detailKey = `Required Document Detail ${docNumber}`;
            details = getString(item[detailKey]);
          }

          requiredDocuments.push({
            document: docValue,
            details: details
          });
        }
      });

      // Extract application process with details
      const processData = extractGroupedData(
        item,
        "Application Process",
        "Application Process"
      );
      const applicationProcess = processData.map(p => ({
        step: p.value,
        details: p.details || ""
      }));

      // Extract applicable departments
      const deptData = extractGroupedData(
        item,
        "Applicable Department",
        "Detail"
      );
      const applicableDepartments = deptData.map(d => ({
        name: d.value,
        details: d.details || ""
      }));

      // Handle duration - check for multiple duration fields
      const duration: ScholarshipData['duration'] = {};

      // Check for general duration
      const generalDuration = getString(item["Duration of the Scholarship"]);
      if (generalDuration) {
        duration.general = generalDuration;
      }

      // Check for specific program durations
      const mastersDuration = getString(item["Duration of the Scholarship 1"]) ||
        getString(item["Duration of the Scholarship Master"]);
      if (mastersDuration) {
        duration.masters = mastersDuration;
      }

      const bachelorsDuration = getString(item["Duration of the Scholarship 2"]) ||
        getString(item["Duration of the Scholarship Bachelor"]);
      if (bachelorsDuration) {
        duration.bachelors = bachelorsDuration;
      }

      const phdDuration = getString(item["Duration of the Scholarship 3"]) ||
        getString(item["Duration of the Scholarship PhD"]);
      if (phdDuration) {
        duration.phd = phdDuration;
      }

      // Process programs
      const programsString = getString(item["Programs"]);
      const programs = programsString ?
        programsString.split(",").map(p => p.trim()).filter(Boolean) : [];

      // Handle number of scholarships
      let numberOfScholarships: number | string = getString(item["Number of Scholarships"]);
      if (numberOfScholarships === "N/A" || numberOfScholarships === "") {
        numberOfScholarships = "N/A";
      } else {
        const num = getNumber(numberOfScholarships);
        numberOfScholarships = num > 0 ? num : "N/A";
      }

      const scholarshipData: ScholarshipData = {
        name: getString(item["Name of Scholarship"]) || "Unnamed Scholarship",
        hostCountry: getString(item["Host Country"]) || "Unknown",
        type: getString(item["Scholarship Type"]) || "Not Specified",
        provider: getString(item["Scholarship Provider"]) || "Unknown",
        deadline,
        numberOfScholarships,
        overview: getString(item["Scholarship Overview"]) || "No overview available",
        programs,
        minimumRequirements: getString(item["Minimum Requirements"]) ||
          getString(item["Min Requirement"]) || "",
        officialLink: getString(item["Official Link"]) || "",

        duration,
        benefits,
        eligibilityCriteria,
        requiredDocuments,
        applicationProcess,
        applicableDepartments,

        successChances: {
          academicBackground: getString(item["Success Chances Academic Background"]),
          age: getString(item["Success Chances Age"]),
          englishProficiency: getString(item["Success Chances English Proficiency"]),
          gradesAndCGPA: formatGradesAndCGPA(getString(item["Success Chances Grades and CGPA"])),
          nationality: getString(item["Success Chances Nationality"]),
          workExperience: getString(item["Success Chances Work Experience"])
        }
      };

      console.log(`Processed scholarship data for row ${index + 1}:`, scholarshipData);
      return scholarshipData;
    });
  };

  const handleUpload = async () => {
    if (!file1) {
      setError("Please select the first Excel file (scholarship data)");
      return;
    }

    setUploading(true);
    setResult("");
    setError("");

    try {
      // Process first file (scholarship data)
      const data1 = await file1.arrayBuffer();
      const workbook1 = XLSX.read(data1, { type: "array" });
      const sheetName1 = workbook1.SheetNames[0];
      const worksheet1 = workbook1.Sheets[sheetName1];
      const jsonData1: ExcelRow[] = XLSX.utils.sheet_to_json<ExcelRow>(worksheet1);

      if (jsonData1.length === 0) {
        throw new Error("No data found in the first Excel file");
      }

      console.log("Raw JSON data from file 1:", jsonData1);
      let processedData = processExcelData(jsonData1);

      // Process second file if provided
      let columnData: ColumnData = {};
      if (file2) {
        columnData = await processFile2(file2);
        console.log("Column data from file 2:", columnData);
        setFile2Data(columnData);

        // Merge data from both files
        processedData = mergeDataSources(processedData, columnData);
      }

      console.log("Final processed data:", processedData);
      setProcessedData(processedData);

      // Send to API
      // const res = await fetch("/api/addScholarship", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(processedData),
      //   credentials: "include",
      // });

      // if (!res.ok) {
      //   throw new Error(`API returned status: ${res.status}`);
      // }

      // const json = await res.json();
      // console.log(`API response:`, json);

      setResult(`Successfully processed ${processedData.length} scholarship(s)${file2 ? ' with merged data from both files' : ''}`);

    } catch (error) {
      console.error("Error uploading files:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }

    setUploading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">University Data Upload</h1>
        {/* Alert box for file format */}
        <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-4">
          <p className="text-sm">
            <strong>Important:</strong> Only JPG and PNG image formats are supported. WebP and other formats will be rejected.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {uploadStatus && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{uploadStatus}</p>
          </div>
        )}

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allImages.map((imageType) => (
              <div key={imageType} className="relative flex flex-col">
                <label className={`block text-sm font-medium ${missingImages.includes(imageType) ? 'text-red-600' : 'text-gray-700'}`}>
                  {imageType.replace(/_/g, " ")}
                  {missingImages.includes(imageType) && " (Missing)"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleImageChange(e, imageType)}
                  className={`block w-full border p-3 rounded-lg shadow-sm my-1 ${missingImages.includes(imageType) ? 'border-red-500' : ''}`}
                  required
                />
                {imageFiles[imageType] && (
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-green-600">
                      {Math.round((imageFiles[imageType]?.size || 0) / 1024)} KB
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAllImagesUpload}
            disabled={uploading}
            className={`w-full py-3 rounded-lg transition mt-6 flex items-center justify-center ${uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Images
              </>
            )}
          </button>

          {Object.keys(universityImages).length === allImages.length ? (
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 rounded-lg transition mt-6 flex items-center justify-center ${uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to MongoDB...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save to MongoDB
                </>
              )}
            </button>
          ) : (
            <div className="text-amber-600 text-sm mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Upload all university images and add Excel data to enable the save button</span>
              </div>
            </div>
          )}
        </form>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dual Excel to MongoDB Scholarship Uploader
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select First Excel File (Scholarship Data) *
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFile1Change}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload primary Excel file (.xlsx or .xls) with scholarship data
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Second Excel File (Additional Data) - Optional
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFile2Change}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload secondary Excel file (.xlsx or .xls) with additional course/university data
          </p>
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${!file1 || uploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          onClick={handleUpload}
          disabled={!file1 || uploading}
        >
          {uploading ? "Processing..." : "Process & Upload"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-bold text-lg">Error</h3>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <h3 className="font-bold text-lg">Success</h3>
          <p className="mt-1">{result}</p>
        </div>
      )}

      {Object.keys(file2Data).length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-800">
            Second File Data Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {Object.entries(file2Data).map(([key, values]) => (
              <div key={key} className="bg-white p-3 rounded border">
                <strong className="text-blue-600">{key}:</strong>
                <div className="mt-1 text-gray-600">
                  {values.length} entries
                  <br />
                  <span className="text-xs">
                    Sample: {String(values[0]).substring(0, 30)}
                    {String(values[0]).length > 30 ? "..." : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">09
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Processed Data Preview
          </h2>
          <div className="space-y-6">
            {processedData.map((scholarship, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {scholarship.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Host Country:</strong> {scholarship.hostCountry}
                  </div>
                  <div>
                    <strong>Type:</strong> {scholarship.type}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {scholarship.deadline}
                  </div>
                  <div>
                    <strong>Programs:</strong> {scholarship.programs.join(", ")}
                  </div>
                  <div>
                    <strong>Benefits:</strong> {scholarship.benefits.length} items
                  </div>
                  <div>
                    <strong>Eligibility Criteria:</strong> {scholarship.eligibilityCriteria.length} items
                  </div>
                  <div>
                    <strong>Required Documents:</strong> {scholarship.requiredDocuments.length} items
                  </div>
                  <div>
                    <strong>Application Steps:</strong> {scholarship.applicationProcess.length} steps
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
                    View Full Data
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(scholarship, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedExcelUploader;