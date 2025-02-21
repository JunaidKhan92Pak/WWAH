"use client";
import React, { useState } from "react";
import ActiveApplication from "./components/ActiveApplication";
import CompletedApplication from "./components/CompletedApplication";
import { Button } from "@/components/ui/button";


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
            <div className="border rounded-xl w-[97%] mx-auto p-2 md:p-8 h-auto  lg:h-[85vh]">
                <h5 className="text-center lg:mb-6">Application Status Tracker</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4  sm:w-[85%] xl:w-[50%]">


                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`transition px-8 font-semibold text-xl py-6 rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
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
