"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import FileButton from "@/components/FileButton";
export default function Home() {
  const allImages = [
    "banner",
    "logo",
    "campus_sports_recreation",
    "campus_accommodation",
    "campus_transportation",
    "campus_student_services",
    "campus_cultural_diversity",
    "campus_alumni_network",
    "city_historical_places_1",
    "city_historical_places_2",
    "city_historical_places_3",
    "city_food_and_cafe_1",
    "city_food_and_cafe_2",
    "city_food_and_cafe_3",
    "city_famous_places_1",
    "city_famous_places_2",
    "city_famous_places_3",
    "city_cultures_1",
    "city_cultures_2",
    "city_cultures_3",
    "city_transportation_1",
    "city_transportation_2",
    "city_transportation_3",
  ];
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>(
    {}
  );
  const [universityImages, setUniversityImages] = useState<{
    [key: string]: string | null;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    country: string;
    university: Record<string, string | number>[];
  }>({
    country: "",
    university: [],
  });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      e.target.value = ""; // ✅ Reset input
      setError(null);
    }
  };

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

  const handleFileRead = () => {
    if (!file) {
      setError("Please select an Excel file to read.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: Record<string, string | number>[] = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      const normalizedData = normalizeData(json);
      setParsedData((prev) => ({
        ...prev,
        university: normalizedData,
      }));
      setError(null);


      if (normalizedData.length === 0) {
        setError("The file does not contain any university.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const normalizeData = (data: Record<string, string | number>[]) => {
    return data.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          const normalizedKey = key
            .trim()
            .replace(/[\s()&]+/g, "_")
            .toLowerCase();
          let normalizedValue = value;

          // Suppose 'field' represents the data type, e.g., "student_count" for student numbers.
          if (typeof value === "number" && value < 1 && value > 0) {
            normalizedValue = `${value * 100}%`;
          }

          // Only convert to a date if the field is not a student count.
          if (
            typeof value === "number" &&
            value > 40000 &&
            value < 60000 &&
            normalizedKey !== "national_students" && // add additional keys if necessary
            normalizedKey !== "international_students"
          ) {
            const date = XLSX.SSF.parse_date_code(value);
            normalizedValue = new Date(Date.UTC(date.y, date.m - 1, date.d))
              .toISOString()
              .split("T")[0];
          }
          return [normalizedKey, normalizedValue];
        })
      )
    );
  };

  const handleAllImagesUpload = async () => {
    // Check if Excel data has been loaded
    if (parsedData.university.length === 0) {
      setError("Please read Excel file first before uploading images.");
      return;
    }

    // Check for missing images
    const missing: string[] = [];
    allImages.forEach(imageType => {
      if (!imageFiles[imageType]) {
        missing.push(imageType);
      }
    });

    // If there are missing images, update state and return
    if (missing.length > 0) {
      setMissingImages(missing);
      setError(`Missing images: ${missing.join(", ")}. Please upload all required images.`);
      return;
    }

    // Set uploading state to true
    setUploading(true);
    setError(null);
    setUploadStatus("Uploading images...");

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

      const universityName = parsedData.university[0]?.university_name || "unnamed_university";
      const response = await fetch("/api/addUniversityImges", {
        method: "POST",
        body: JSON.stringify({ images: imagesData, universityName }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setUniversityImages(result.imageUrls);
        setUploadStatus("Images uploaded successfully!");
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

  const uploadDataToServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData.country || parsedData.university.length === 0) {
      setError("Please fill all fields and upload images.");
      return;
    }

    // Ensure all images are uploaded
    const missingImageUrls: string[] = [];
    for (const imageType of allImages) {
      if (!universityImages[imageType]) {
        missingImageUrls.push(imageType);
      }
    }

    if (missingImageUrls.length > 0) {
      setError(`Missing image URLs for: ${missingImageUrls.join(", ")}. Please upload all required images.`);
      return;
    }

    // Set uploading state to true
    setUploading(true);
    setError(null);
    setUploadStatus("Uploading data to MongoDB...");

    try {
      const payload = {
        country: parsedData.country,
        university: parsedData.university,
        universityImages: universityImages,
      };

      const response = await fetch("/api/addUniversity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (response.ok) {
        setUploadStatus("Data uploaded successfully to MongoDB!");
        setParsedData({ country: "", university: [] });
        setFile(null);
        setImageFiles({});
        setUniversityImages({});
        setError(null);
        setMissingImages([]);
      } else {
        const errorData = await response.json();
        setError(
          `Error: ${errorData.message || "Unknown error occurred."}`
        );
        setUploadStatus(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred while uploading data: ${error.message}`);
      } else {
        setError(`An error occurred while uploading data: ${String(error)}`);
      }
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-50 min-h-screen flex justify-center py-10">
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

        <form onSubmit={uploadDataToServer} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country Name
            </label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter Country"
              value={parsedData.country}
              onChange={(e) => setParsedData({ ...parsedData, country: e.target.value })}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2">
              <label
                htmlFor="excel-upload"
                className="cursor-pointer bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Select Excel File
              </label>
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="w-full md:w-1/2">
              <FileButton handleFile={handleFileRead} />
            </div>
          </div>

          {file && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Selected file: {file.name}</span>
              </div>
            </div>
          )}

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
            disabled={uploading || parsedData.university.length === 0}
            className={`w-full py-3 rounded-lg transition mt-6 flex items-center justify-center ${uploading || parsedData.university.length === 0
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

          {Object.keys(universityImages).length === allImages.length && parsedData.university.length > 0 ? (
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
      <div className="w-[400px] ml-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image Upload Status
          </h2>
          <div className="overflow-auto h-64 border border-gray-200 rounded p-2 bg-white">
            {allImages.map((imageType) => (
              <div key={imageType} className="flex justify-between items-center py-1 border-b">
                <span className="font-medium text-sm">{imageType.replace(/_/g, " ")}:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${universityImages[imageType] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {universityImages[imageType] ? 'Uploaded ✓' : 'Not uploaded'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Parsed Excel Data
          </h2>
          {parsedData.university.length > 0 ? (
            <div className="overflow-auto h-64 border border-gray-200 rounded p-2 bg-white">
              {parsedData.university.map((item, index) => (
                <div key={index} className="mb-2 pb-2 border-b">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border border-gray-200 rounded bg-gray-50">
              <p className="text-center text-gray-500">
                Excel data will display here after reading
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}