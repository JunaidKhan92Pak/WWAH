"use client";
import React, { useState } from "react";
import ActiveApplication from "./components/ActiveApplication";
// import CompletedApplication from "./components/CompletedApplication";
import { Button } from "@/components/ui/button";
import CompletedApplication from "./components/CompletedApplication";


type Tab = {
  label: string;
  id: string;
};

const Page = () => {
  const tabs: Tab[] = [
    { label: "Active Application", id: "activeapplication" },
    { label: "Completed Application", id: "completedapplication" },

  ];

  const [activeTab, setActiveTab] = useState<string>("activeapplication");

  return (
    <>
      <div className="border rounded-xl w-[97%] mx-auto p-2 md:p-8 h-auto  ">
        <h4 className="text-center mb-4">Application Status Tracker</h4>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start w-full mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition font-semibold text-sm md:text-lg px-8 rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
                                ${activeTab === tab.id
                  ? "bg-[#C7161E] text-white" : "text-gray-600"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {activeTab === "activeapplication" && <ActiveApplication />}
        {activeTab === "completedapplication" && <CompletedApplication />}

      </div>
    </>
  );
};

export default Page;