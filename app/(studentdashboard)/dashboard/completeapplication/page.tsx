"use client";
import React, { useState } from "react";
import BasicInfo from "./components/BasicInfo";
import ApplicationInfo from "./components/ApplicationInfo";
import UploadDocuments from "./components/UploadDocuments";
import ReviewSection from "./components/ReviewSection";

type Tab = {
    label: string;
    id: string;
};

const Page = () => {
    const tabs: Tab[] = [
        { label: "Basic Information", id: "basicinfo" },
        { label: "Application Information", id: "appinfo" },
        { label: "Upload Documents", id: "documents" },
        { label: "Review & Submit", id: "review" },
    ];

    const [activeTab, setActiveTab] = useState<string>("basicinfo");

    return (
        <>
           <div className="border rounded-xl p-6">
            <h5 className="text-center font-bold lg:mb-10">Complete your Application</h5>
            <div className="bg-white my-4 md:mb-12">
                <div className="w-full grid  md:grid-cols-4 justify-center items-center space-x-2 space-y-2 lg:space-y-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`transition  px-8 font-semibold py-2 rounded-t-xl ${activeTab === tab.id ? "bg-[#C7161E] text-white" : "text-gray-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {activeTab === "basicinfo" && <BasicInfo />}
            {activeTab === "appinfo" && <ApplicationInfo />}
            {activeTab === "documents" && <UploadDocuments />}
            {activeTab === "review" && <ReviewSection />}
            </div>
        </>
    );
};

export default Page;
