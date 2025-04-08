"use client";
import React, { useState } from "react";
import BasicInfo from "./components/BasicInfo/page";
import UploadDocuments from "./components/UploadDocuments";
import ReviewSection from "./components/ReviewSection";
import { Button } from "@/components/ui/button";
import ApplicationInfo from "./components/ApplicationInfo/page";

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
      <div className="w-[98%] mx-auto ">
        {/* <h5 className="text-center font-bold lg:mb-10">Complete your Application</h5> */}
        <div className="w-full  flex overflow-x-auto scrollbar-hide ">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition md:w-1/4 px-4 font-semibold text-sm sm:text-base py-4  rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
                        ${
                          activeTab === tab.id
                            ? "bg-[#C7161E] text-white"
                            : "text-gray-600"
                        }`}
            >
              {tab.label}
            </Button>
          ))}
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
