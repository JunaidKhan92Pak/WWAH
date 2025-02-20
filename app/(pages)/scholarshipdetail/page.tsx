"use client";
import React, { useState } from "react";
import Hero from "./components/Hero";
import GKSscholarships from "./components/GKSscholarships";
import Overview from "./components/Overview";
import Applicationdepartment from "./components/Applicationdepartment";
import Requireddocs from "./components/Requireddocs";
import Applicationprocess from "./components/Applicationprocess";
import Eligibilitycriteria from "./components/Eligibilitycriteria";
type Tab = {
  label: string;
  id: string;
};
const Scholarshipdetail = () => {
  const tabs: Tab[] = [
    { label: "Scholarship Overview", id: "Scholarship Overview" },
    { label: "Benefits", id: "Benefits" },
    { label: "Application Departments", id:"Application-departments"},
    { label: "Eligibility Criteria", id: "Eligibility Criteria" },
    { label: "Required Documents", id: "Required Documents" },
    { label: "Application Process", id: "Application Process" },
  ];
  const [activeTabPro, setActiveTabPro] = useState<string>(
    "Scholarship Overview"
  );
  const handleTabClick = (tab: Tab) => {
    setActiveTabPro(tab.label);
    const section = document.getElementById(tab.id);
    if (section) {
      const yOffset = -100; // Adjust this value based on your header height or margin
      const yPosition =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };
  return (
    <>
      <Hero />
      <div className="bg-white mt-4 lg:mt-40 2xl:mt-[12%] lg:my-6">
        <div className=" mx-auto sm:w-[88%] w-[70%]">
          <div className="w-full flex flex-col sm:flex-row gap-1 justify-center lg:justify-evenly items-center  border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)} 
                className={`border-b md:border-none font-medium text-left md:text-center transition px-2 md:text-[14px] text-[12px] md:py-2 py-1 rounded-lg w-full hover:bg-[#FCE7D2] hover:text-black ${
                  activeTabPro === tab.label
                    ? "bg-[#C7161E] text-white"
                    : "text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Overview />
      <div id="Benefits">
        <GKSscholarships />
      </div>
      <div id="Application-departments">
        <Applicationdepartment />
      </div>
      <div id="Eligibility Criteria" >
        <Eligibilitycriteria />
      </div>

      <div id="Required Documents">
        <Requireddocs />
      </div>
      <div id="Application Process">
        {/* <Requireddocs */}
        <Applicationprocess />
      </div>
    </>
  );
};

export default Scholarshipdetail;
