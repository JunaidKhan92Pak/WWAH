"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";


const Page = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]); // Store the selected file
        }
    };
    return (
        <>
            <div
                className="relative w-[98%] my-4 mx-auto bg-cover bg-center bg-no-repeat rounded-3xl h-[96vh]  md:h-[96vh] flex justify-center items-center"

                style={{ backgroundImage: "url('/adminportal/loginbackgroundimg.svg')" }}
            >
                <div className="flex flex-col justify-center items-center text-center w-full p-4">
                    <Image
                        src="/adminportal/wwah.svg"
                        alt="WWAH Logo"
                        width={130}
                        height={130}
                        className=" mb-4"
                    />

                    <h4>UploadCourses!</h4>
                    <p>  Upload your courses quickly and easily.
                    </p>

                    <div className="flex flex-col w-full md:w-[60%] lg:w-[50%] xl:w-[30%] mt-4 gap-5">
                        <Input
                            type="text"
                            placeholder="Enter Country"
                            className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base w-full rounded-lg py-5 md:py-6 border border-gray-300"

/>
                        <Input
                            type="text"
                            placeholder="Enter University"
                            className="placeholder-[#313131] placeholder:text-sm xl:placeholder:text-base w-full rounded-lg py-5 md:py-6 border border-gray-300"

                        />
                        <div className="w-full">
                            {/* File Input Container */}
                            <div className="relative w-full">
                                <Input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />

                                {/* Custom File Input Styling */}
                                <div className="flex items-center w-full border border-gray-300 rounded-lg p-2 bg-white">
                                    <span className="border border-gray-400 px-3 py-1 text-sm bg-gray-100">
                                        Choose File
                                    </span>
                                    <span className="ml-2 text-gray-700 text-sm">
                                        {selectedFile ? selectedFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Upload Button */}
                        <Button className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-lg text-base"
>Excel File Reader</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page
