"use client";
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import GKSscholarships from "./components/GKSscholarships";
import Overview from "./components/Overview";
import Applicationdepartment from "./components/Applicationdepartment";
import Requireddocs from "./components/Requireddocs";
import Applicationprocess from "./components/Applicationprocess";
import Eligibilitycriteria from "./components/Eligibilitycriteria";
import { HeroSkeleton } from "@/components/HeroSkeleton";
import ScholarshipSuccessChances from "./components/ScholarshipSuccessChances";
// import { HeroSkeleton } from "@/components/HeroSkeleton";
type Tab = {
  label: string;
  id: string;
};
type ScholarshipData = {
  name: string;
  hostCountry: string;
  scholarshipType: string;
  deadline: string;
  overview: string;
  university: string;
  duration: {
    undergraduate: string;
    master: string;
    phd: string;
  };
  benefits: string[];
  applicableDepartments: [];
  eligibilityCriteria: [];
};

const Scholarshipdetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [data, setData] = useState<ScholarshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/scholarship?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch scholarship data");
        const jsonData = await res.json();
        if (!jsonData.ScholarshipData)
          throw new Error("Scholarship data not found");
        setData(jsonData.ScholarshipData);
      } catch (err) {
        console.error("Error fetching scholaoship data:", err);
        let errorMessage = "An error occurred while fetching data.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Add id as a dependency

  const tabs: Tab[] = [
    { label: "Scholarship Overview", id: "Scholarship Overview" },
    { label: "Benefits", id: "Benefits" },
    { label: "Applicable Departments", id: "Applicable-Departments" },
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

  if (loading) return <HeroSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p> Not Aviable</p>;
  return (
    <>
      <Hero
        name={data?.name || "Not Available"}
        country={data?.hostCountry || "Unknown"}
        type={data?.scholarshipType || "Unknown"}
        deadline={data?.deadline || "Unknown"}
        university={data?.university || "Not Mention"}
      />
      <div className="bg-white my-4 lg:mt-40 2xl:mt-[12%] lg:my-6">
        <div className=" mx-auto sm:w-[88%] w-[90%]">
          <div className="w-full flex whitespace-nowrap overflow-x-auto scrollbar-hide justify-center lg:justify-evenly items-center border-b gap-2 border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`border-b md:border-none font-medium text-left md:text-center transition px-2 md:text-[14px] text-[12px] md:py-2 py-1 rounded-lg w-full hover:bg-[#FCE7D2] hover:text-black ${activeTabPro === tab.label
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
      <Overview
        overview={data?.overview || ""}
        duration={data?.duration || { undergraduate: "", master: "", phd: "", Diploma: "" }}
      />
      <div id="Benefits">
        <GKSscholarships benefit={data?.benefits || []} />
      </div>
      <div id="Applicable-Departments">
        <Applicationdepartment
          applicableDepartments={data?.applicableDepartments || []}
        />
      </div>
      <div id="Eligibility Criteria">
        <Eligibilitycriteria
          eligibilityCriteria={data?.eligibilityCriteria || []}
        />
      </div>
      <div>
        <ScholarshipSuccessChances />
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
