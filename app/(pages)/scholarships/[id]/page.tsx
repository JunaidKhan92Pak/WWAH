"use client";
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import GKSscholarships from "./components/GKSscholarships";
import Overview from "./components/Overview";
import ApplicableCourses from "./components/ApplicableCourses";
import Requireddocs from "./components/Requireddocs";
import Applicationprocess from "./components/Applicationprocess";
import Eligibilitycriteria from "./components/Eligibilitycriteria";
import { HeroSkeleton } from "@/components/HeroSkeleton";
import ScholarshipSuccessChances from "./components/ScholarshipSuccessChances";
// import { Explora } from "next/font/google";
import ExploreScholarships from "./components/ExploreScholarships";
// import { HeroSkeleton } from "@/components/HeroSkeleton";
type Tab = {
  label: string;
  id: string;
};
type ScholarshipData = {
  applicationProcess: {
    details: string;
    step: string[];
    title: string;
    description: string;
  }[];

  name: string;
  hostCountry: string;
  logo: string;
  banner: string;
  type: string;
  deadline: string;
  overview: string;
  university: string;
  numberOfScholarships: number;
  duration: {
    undergraduate: string;
    masters: string;
    phd: string;
    bachelors: string;
    Diploma: string;
  };
  benefits: string[];
  applicableDepartments: [];
  eligibilityCriteria: [];
  programs: string[];
  Document: string[];
  requiredDocuments: [];
  info_link: string;
  officialLink: string;
  table?: {
    course: string[];
    create_application: string[];
    deadline: string[];
    duration: string[];
    entry_requirements: string[];
    faculty_department: string[];
    scholarship_type: string[];
    teaching_language: string[];
    university: string[];
    countries: string[];
  };
  successChances?: {
    academicBackground?: string;
    age?: string;
    englishProficiency?: string;
    gradesAndCGPA?: string;
    nationality?: string;
    workExperience?: string;
  };
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
    { label: "Overview", id: "Overview" },
    // { label: "Benefits", id: "Benefits" },
    { label: "Applicable Course", id: "Applicable-Departments" },
    { label: "Eligibility Criteria", id: "Eligibility Criteria" },
    {
      label: "Success Chances",
      id: "Success Chances",
    },
    { label: "Required Documents", id: "Required Documents" },
    { label: "Application Process", id: "Application Process" },
  ];
  const [activeTabPro, setActiveTabPro] = useState<string>("Overview");
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

  console.log("Scholarship Data:", data);
  console.log(data.applicationProcess, "applicationProcess");
  return (
    <>
      <Hero
        name={data?.name || "Not Available"}
        logo={data?.logo || "Not Available"}
        banner={data?.banner || "Not Available"}
        country={data?.hostCountry || "Unknown"}
        type={data?.type || "Unknown"}
        deadline={data?.deadline || "Unknown"}
        NumberOfScholarships={data?.numberOfScholarships}
        officialLink={data?.officialLink || "#"}
      />
      <div className="bg-white my-4 lg:mt-40 2xl:mt-[12%] lg:my-6">
        <div className=" mx-auto sm:w-[88%] w-[90%]">
          <div className="w-full flex whitespace-nowrap overflow-x-auto hide-scrollbar  lg:justify-evenly items-center border-b gap-2 border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`border-b md:border-none font-medium text-left md:text-center transition px-4 md:text-[16px] text-[12px] md:py-2 py-1 rounded-t-xl  md:rounded-t-xl  border-gray-400  w-full hover:bg-[#FCE7D2] hover:text-black ${activeTabPro === tab.label
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
        info_link={data?.info_link || ""}
        overview={data?.overview || ""}
        duration={
          data?.duration || {
            undergraduate: "",
            bachelors: "",
            masters: "",
            phd: "",
            Diploma: "",
          }
        }
      />
      <div id="Benefits">
        <GKSscholarships benefit={data?.benefits || []} />
      </div>
      {/* <div id="Applicable-Departments">
        <ApplicableCourses
          applicableCourses={data?.applicableCourses || []} />
      </div> */}
      <div id="Applicable-Departments">
        <ApplicableCourses tableData={data?.table} />
      </div>

      <div id="Eligibility Criteria">
        <Eligibilitycriteria
          name={data?.name || "Not Available"}
          eligibilityCriteria={data?.eligibilityCriteria || []}
        />
      </div>
      <div id="Success Chances">
        <ScholarshipSuccessChances successChances={data?.successChances} />
      </div>
      <div id="Required Documents">
        <Requireddocs requiredDocs={data.requiredDocuments} />
      </div>
      <div id="Application Process">
        {/* <Requireddocs */}
        <Applicationprocess
          applicationProcess={
            data?.applicationProcess
              ? data.applicationProcess.map((step, idx) => ({
                ...step,
                _id: idx
              }))
              : []
          }
        />
      </div>
      <ExploreScholarships />
    </>
  );
};
export default Scholarshipdetail;
