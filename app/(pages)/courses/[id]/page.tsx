"use client";
import React, { useEffect, useState } from "react";
import Herosection from "./components/Herosection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CareerOpportunities } from "./components/CareerOpportunities";
import { FeeAndScholarships } from "./components/FeeAndScholarships";
import { ProgressSection } from "./components/ProgressSection";
import { EnglishRequirement } from "./components/EnglishRequirement";
import { RequiredDocuments } from "./components/RequiredDocuments";
import { ApplicationProcess } from "./components/ApplicationProcess";
import { ExploreSection } from "./components/ExploreSection";
import { HeroSkeleton } from "@/components/HeroSkeleton";

// export default function Page({ params }: { params: { id: string } }) {
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  interface CourseData {
    courseData: {
      _id: string;
      countryname: string;
      universityname: string;
      course_link: string;
      course_title: string;
      required_ielts_score: string;
      required_pte_score: string;
      required_toefl_score: string;
      entry_requirement: string;
      education_level: string;
      course_level: string;
      intake: string;
      duration: string;
      start_date: string;
      degree_format: string;
      location_campus: string;
      annual_tuition_fee: {
        currency: string;
        amount: string;
      };
      initial_deposit: string;
      overview: string;
      course_structure: string;
      year_1?: string;
      year_2?: string;
      year_3?: string;
      year_4?: string;
      year_5?: string;
      year_6?: string;
      career_opportunity_1?: string;
      career_opportunity_2?: string;
      career_opportunity_3?: string;
      career_opportunity_4?: string;
      career_opportunity_5?: string;
    };
    universityData?: {
      universityImages?: string;
    };
    countryData: {
      countryname: string;
      embassyDocuments: [];
      universityDocuments: [];
    };
  }
  const tabs = [
    { name: "Course Overview", id: "courseOverview" },
    { name: "Career Opportunities", id: "careerOpportunities" },
    { name: "Fee & Scholarships", id: "feeScholarships" },
    { name: "Entry Requirements", id: "entryRequirements" },
    { name: "Application Process", id: "applicationProcess" },
  ];

  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTabPro, setActiveTabPro] = useState(
    tabs.length > 0 ? tabs[0].id : ""
  );
  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!activeTabPro && tabs.length > 0) {
      setActiveTabPro(tabs[0].id);
    }
  }, [tabs, activeTabPro]);

  const handleTabClick = (id: string) => {
    setActiveTabPro(id);

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust this value based on your header height or margin
      const yPosition =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };
  // Unwrap the params Promise using React.use()
  // const { id } = params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/course?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch course data");
        const jsonData = await res.json();
        if (!jsonData.courseData) throw new Error("Course data not found");
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching course data:", err);
        let errorMessage = "An error occurred while fetching data.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }; // const fetchData = async () => {
    //   try {
    //     const res = await fetch(`/api/course?id=${id}`);
    //     if (!res.ok) throw new Error("Failed to fetch course data");
    //     const jsonData = await res.json();
    //     if (!jsonData.courseData) throw new Error("Course data not found");

    //     setData(jsonData);
    //   } catch (err: any) {
    //     console.error("Error fetching course data:", err);
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    fetchData();
  }, [id]); // Add id as a dependency
  if (loading) return <HeroSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p> Course Not Found</p>;
  return (
    <div>
      <Herosection data={data?.courseData} uniData={{ banner: data?.universityData?.universityImages || "" }} />
      {/* Course Overview & Navigation Tabs */}
      <section className="bg-white md:mt-6 lg:mt-12 mb-6">
        <div className=" mx-auto w-[92%]">
          {/* Navigation Tabs */}
          <div className="w-full lg:w-[95%] flex overflow-x-auto scrollbar-hide border-b border-gray-200 mt-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`font-medium transition text-sm md:text-lg px-10 py-2 md:rounded-t-xl flex-shrink-0 border-b border-gray-400 md:border-none
        ${activeTabPro === tab.id
                    ? "bg-[#C7161E] text-white"
                    : "bg-transparent text-gray-800"
                  }
        hover:bg-[#FCE7D2] hover:text-black`}
              >
                {tab.name}
              </Button>
            ))}
          </div>

          {/* Course Overview */}
          <div
            id="courseOverview"
            className="CourseOverview flex flex-col gap-8 lg:flex-row items-center lg:items-start mt-5 md:mt-10"
          >
            {/* Content side */}
            <div className="bg-white pb-4 md:w-[70%]">
              <div>
                <div className="lg:w-[90%]">
                  <h4 className="">Course Overview!</h4>
                  <p className="text-gray-700 md:mb-4 leading-snug w-full text-justify">
                    {data?.courseData?.overview}
                  </p>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="w-full">
                    {data?.courseData?.year_1 && (
                      <div>
                        <h4>Year 1</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_1}
                        </p>
                      </div>
                    )}
                    {data?.courseData?.year_2 && (
                      <div>
                        <h4>Year 2</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_2}
                        </p>
                      </div>
                    )}
                    {data?.courseData?.year_3 && (
                      <div>
                        <h4>Year 3</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_3}
                        </p>
                      </div>
                    )}
                    {data.courseData.year_4 && (
                      <div>
                        <h4>Year 4</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_4}
                        </p>
                      </div>
                    )}
                    {data.courseData.year_5 && (
                      <div>
                        <h4>Year 5</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_5}
                        </p>
                      </div>
                    )}
                    {data.courseData.year_6 && (
                      <div>
                        <h4>Year 6</h4>
                        <p className="text-gray-700 leading-snug text-justify">
                          {data.courseData.year_6}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Read More Toggle */}
                <div className="mt-4">
                  <p
                    className="font-bold underline cursor-pointer"
                    onClick={toggleReadMore}
                  >
                    {isExpanded ? "Show less" : "Read more..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Media side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto w-full md:w-[90%] lg:w-[69%] lg:items-stretch">
              {/* First Column: Card 1 and Card 2 */}
              <div className="flex lg:flex-col gap-2 lg:space-y-3">
                {/* Card 1 */}
                <div className="relative rounded-3xl shadow-lg w-full h-[180px] lg:h-[275px]">
                  <Image
                    src="/dublin.jpg"
                    alt="Zeus Guide"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 py-4 md:p-6 rounded-3xl">
                    <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[100%]">
                      <p className="text-white xl:px-4 mb-3">
                        NEED MORE INFO ABOUT {data.courseData.universityname}?
                      </p>
                      <Link href="/universityarchievepage">
                        <Button className="bg-white text-[#C7161E] px-2 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition w-full">
                          Explore Here
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="relative rounded-3xl shadow-lg w-full h-[180px] lg:h-[275px]">
                  <Image
                    src="/dcu.jpg"
                    alt="Future at DCU"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 px-1 py-4 md:px-4 md:py-6 xl:p-6 rounded-3xl">
                    <div className="w-full">
                      <p className="text-white md:px-2  mb-3">
                        Get a glimpse of your future at{" "}
                        {data?.courseData?.universityname}!
                      </p>
                      <Link href="/universityarchievepage">
                        <Button className="bg-white text-[#C7161E] font-normal px-1 md:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition ">
                          Watch? Discover More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Second Column: Card 3 */}
              <div className="relative text-white rounded-lg w-full flex items-center h-[200px] lg:h-[550px] lg:min-h-full">
                <Image
                  src="/Hero_Robot.png"
                  alt="AI Assistant"
                  layout="fill"
                  objectFit="none"
                  className="rounded-3xl"
                />
                <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 p-4 md:p-6 rounded-3xl "></div>
                <div className="absolute bottom-0 w-full px-4 md:px-2 py-6 text-center">
                  <p>
                    Use our{" "}
                    <span className="text-[#F0851D]">AI - Powered </span>
                    platform Zeus to find your dream university in 3 minutes.
                  </p>
                  <Link href="/chatmodel">
                    <Button className="mt-4 bg-white text-red-700 hover:bg-gray-300 w-4/5">
                      Start your Abroad Journey
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities Section */}
      <div id="careerOpportunities">
        <CareerOpportunities data={data.courseData} />
      </div>
      {/* fee and scholarship     */}
      <div id="feeScholarships">
        <FeeAndScholarships data={data.courseData} />
      </div>

      {/* progress bar  */}
      <ProgressSection data={data.courseData} />

      {/* English Requirnment Section      */}
      <EnglishRequirement data={data.courseData} />

      {/* Required Documents! */}
      <div id="entryRequirements">
        <RequiredDocuments data={data.countryData} />
      </div>
      {/* application process */}
      <div id="applicationProcess">
        <ApplicationProcess
          countryname={data.courseData.countryname}
          uniname={data.courseData.universityname}
        />
      </div>
      {/* explore section */}
      <ExploreSection data={data.courseData.countryname} />
    </div>
  );
}
