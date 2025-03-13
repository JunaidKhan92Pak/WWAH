"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
    const allImages = ["banner", "logo", "campus_sports_recreation", "campus_accommodation", "campus_transportation", "campus_student_services", "campus_cultural_diversity", "campus_alumni_network", "city_historical_places_1", "city_historical_places_2", "city_historical_places_3", "city_food_and_cafe_1", "city_food_and_cafe_2", "city_food_and_cafe_3", "city_famous_places_1", "city_famous_places_2", "city_famous_places_3", "city_cultures_1", "city_cultures_2", "city_cultures_3", "city_transportation_1", "city_transportation_2", "city_transportation_3"
    ]
    const [file, setFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({});
    const [universityImages, setUniversityImages] = useState<{ [key: string]: string | null }>({});
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<{ country: string; university: Record<string, string | number>[] }>({
        country: "",
        university: [],
    });
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (files && files.length > 0) {
    //         setFile(files[0]);
    //         setError(null);
    //     }
    // };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            e.target.value = ""; // ✅ Reset input
            setError(null);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFiles((prev) => ({ ...prev, [imageType]: files[0] }));
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
            const json: Record<string, string | number>[] = XLSX.utils.sheet_to_json(worksheet);
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

                    if (typeof value === "number" && value < 1 && value > 0) {
                        normalizedValue = `${value * 100}%`;
                    }

                    if (typeof value === "number" && value > 40000 && value < 60000) {
                        const date = XLSX.SSF.parse_date_code(value);
                        normalizedValue = new Date(
                            Date.UTC(date.y, date.m - 1, date.d)
                        ).toISOString().split("T")[0];
                    }

                    return [normalizedKey, normalizedValue];
                })
            )
        );
    };

    const handleAllImagesUpload = async () => {
        const selectedImages = Object.entries(imageFiles).filter(([_file]) => _file);
        // const selectedImages = Object.entries(imageFiles).filter(([_, file]) => file);
        if (selectedImages.length === 0 && parsedData.university.length === 0) {
            setError("Please select at least one image to upload and Read Excel File.");
            return;
        }
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
        const universityName = parsedData.university[0].university_name;
        console.log(imageFiles, "imageFiles");
        try {
            const response = await fetch("/api/addUniversityImges", {
                method: "POST",
                body: JSON.stringify({ images: imagesData, universityName }),
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            console.log(result, "result");
            if (response.ok) {
                setUniversityImages(result.imageUrls);
            } else {
                setError(result.error || "Image upload failed.");
            }
        } catch (error) {
            setError("An error occurred while uploading images." + error);
        }
    };
    const uploadDataToServer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!parsedData.country || parsedData.university.length === 0) {
            setError("Please fill all fields and upload images.");
            return;
        }

        // Ensure all images are uploaded
        const requiredImages = allImages;
        for (const imageType of requiredImages) {
            if (!universityImages[imageType]) {
                setError(`Please upload an image for ${imageType}.`);
                return;
            }
        }
        console.log(universityImages, "universityImages");

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
            });

            if (response.ok) {
                setUploadStatus("Data uploaded successfully.");
                setParsedData({ country: "", university: [] });
                setFile(null);
            } else {
                const errorData = await response.json();
                setUploadStatus(`Error: ${errorData.message || "Unknown error occurred."}`);
            }
        } catch (error) {
            setError("An error occurred while uploading images." + error);
        }
    };

    return (
        // <div className="bg-gradient-to-br from-indigo-100 to-purple-50 min-h-screen flex justify-center  py-10">
        <div
            className="relative w-full bg-cover bg-center bg-no-repeat  min-h-screen flex flex-col lg:flex-row justify-center gap-4 py-10 "

            style={{ backgroundImage: "url('/adminportal/loginbackgroundimg.svg')" }}
        >
            <div className="w-full max-w-full lg:max-w-3xl bg-white  rounded-lg p-4">
                <h1 className="text-left md:text-center text-gray-800 mb-2">University Data Upload</h1>
                <form onSubmit={uploadDataToServer} className="space-y-4">
                    <div className="mb-4">
                        <label
                            htmlFor="country"
                            className="cursor-pointer text-black p-2  rounded-lg transition"
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
                            className="w-full py-3 px-4 border border-gray-300 xl:placeholder:text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"

/>
                    </div>

                    <div className="flex flex-col md:flex-row items-start justify-between md:items-center gap-4">
                        <label
                            htmlFor="excel-upload"
                            className="cursor-pointer bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Select University Excel File
                        </label>
                        <input
                            id="excel-upload"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleFileRead}
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                        >
                            Read File
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allImages.map((imageType) => (
                            <div key={imageType} className="relative flex flex-col ">
                                <label className="block text-md font-medium text-gray-700">{imageType.replace("_", " ")}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, imageType)}
                                    className="block w-full border p-2 md:p-4 rounded-lg shadow-md my-2"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAllImagesUpload}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mt-6"
                    >
                        Upload Images to Generate URLs
                    </button>
                    {universityImages && parsedData.university.length > 0 ? (
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition mt-6"
                        >
                            Upload Data to Server
                        </button>)
                        : (
                            <p className="text-red-600 text-lg mt-6 text-center">Upload University Images & add Excel Data To Get Upload Button</p>
                        )
                    }
                    {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                    {uploadStatus && <p className="text-green-600 text-lg mt-6 text-center">{uploadStatus}</p>}
                </form>
            </div>
            <div className="lg:w-[400px]  border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="mb-4 h-screen">
                    <ul className="list-disc list-inside overflow-auto">
                        {universityImages && (
                            <li>{JSON.stringify(universityImages)}</li>
                        )}

                    </ul>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Parsed Data</h2>
                    {parsedData.university.length > 0 ? (
                        <ul className="list-disc list-inside overflow-auto h-80">
                            {parsedData.university.map((item, index) => (
                                <li key={index}>{JSON.stringify(item)}</li>
                            ))}
                        </ul>
                    ) : (<p className="text-left text-lg text-gray-800">Excel data Will display here after Reading it</p>)}
                </div>


            </div>
        </div>
    );
}
