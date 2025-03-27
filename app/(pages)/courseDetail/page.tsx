"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Herosection from "./components/Herosection";

const healthcareItems = [
  { text: "Public Health", image: "/countrypage/img3.svg" },
  { text: "Healthcare Promotion", image: "/countrypage/img2.svg" },
  { text: "Healthcare Information", image: "/countrypage/img5.png" },
  { text: "Healthcare Management", image: "/countrypage/img4.svg" },
  { text: "Healthcare Policy", image: "/countrypage/img1.svg" },
];
function Page() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("scholarship");

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const tabs = [
    { name: "Course Overview", id: "courseOverview" },
    { name: "Career Opportunities", id: "careerOpportunities" },
    { name: "Fee & Scholarships", id: "feeScholarships" },
    { name: "Entry Requirements", id: "entryRequirements" },
    { name: "Application Process", id: "applicationProcess" },
  ];

  const [activeTabPro, setActiveTabPro] = useState(
    tabs.length > 0 ? tabs[0].id : ""
  );

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

  const [activeTabUni, setActiveTabUni] = useState(
    "University Application Docs"
  );

  const academicData = [
    {
      label: "Degree",
      value: 40,
      icon: (
        <Image
          src="/degree-icon.png"
          alt="Degree Icon"
          width={24}
          height={24}
        />
      ),
    },
    {
      label: "Major/Discipline",
      value: 50,
      icon: (
        <Image src="/major-icon.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
    {
      label: "Grade",
      value: 40,
      icon: (
        <Image src="/grade-icon.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
    {
      label: "Work Experience",
      value: 40,
      icon: (
        <Image src="/work-icon.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
    {
      label: "English Language Proficiency",
      value: 78,
      icon: (
        <Image src="/lang-icon.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
  ];

  const financialData = [
    {
      label: "Tuition Fee",
      value: 50,
      icon: (
        <Image src="/fee-icon.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
    {
      label: "Cost of Living",
      value: 50,
      icon: (
        <Image src="/Tea-Cup.png" alt="Degree Icon" width={24} height={24} />
      ),
    },
  ];
  const requirements = [
    {
      name: "IELTS",
      overallScore: "6.5",
      subScore: "6.0",
      link: "ilets",
      description: "Minimum Sub Score: 6.0",
    },
    {
      name: "TOEFL iBET",
      overallScore: "90",
      subScore: "20",
      link: "pte",
      description: "Minimum Sub Score: 20 in each band",
    },
    {
      name: "CAEL",
      overallScore: "70",
      subScore: "60",
      link: "toefl",
      description: "Minimum Sub Score: 60",
    },
  ];

  const sliderData = [
    {
      src: "/explore-UOV.png",
      title: "University of Victoria",
    },
    {
      src: "/explore-UOV.png",
      title: "University of Victoria",
    },
    {
      src: "/explore-UOV.png",
      title: "University of Victoria",
    },
  ];

  return (
    <div>
      <Herosection />
      {/* Course Overview & Navigation Tabs */}
      <section className="bg-white mt-6 lg:mt-12 mb-6">
        <div className=" mx-auto w-[92%]">
          {/* Navigation Tabs */}
          <div className="w-full lg:w-[95%] flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`font-medium transition text-sm md:text-lg hover:bg-[#FCE7D2] hover:text-black px-4 py-2 md:rounded-t-xl flex-shrink-0 border-b border-gray-400 md:border-none ${
                  activeTabPro === tab.id
                    ? "bg-[#C7161E] text-white"
                    : "bg-transparent text-gray-800"
                }`}
              >
                {tab.name}
              </Button>
            ))}
          </div>

          {/* Course Overview */}
          <div
            id="courseOverview"
            className="CourseOverview flex flex-col lg:flex-row items-center lg:items-start mt-5 md:mt-10"
          >
            {/* content side */}
            <div className="bg-white md:pb-12 pb-4 md:w-[90%] lg:w-[45%]">
              <div className="mx-auto">
                <h4 className="">Course Overview!</h4>
                <p className="text-gray-700 leading-relaxed md:mb-4">
                  The Postgraduate Certificate in Health Science is a
                  specialized program designed to equip healthcare professionals
                  with advanced knowledge and skills in various areas of health
                  science. This certificate program offers a comprehensive
                  curriculum that covers essential topics relevant to
                  today&#39;s healthcare landscape, providing students with the
                  expertise needed to excel in their respective fields.
                </p>
                {isExpanded && (
                  <>
                    <h4 className="">Advanced Specialization</h4>
                    <p className="text-gray-700 leading-relaxed">
                      The Postgraduate Certificate in Health Science allows
                      healthcare professionals to specialize in specific areas
                      of interest within the field of health science. This
                      advanced specialization enables individuals to deepen
                      their expertise and focus on areas that align with their
                      career goals and interests.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Many Postgraduate Certificate programs in Health Science
                      offer flexible learning options to accommodate the busy
                      schedules of working professionals. Whether through online
                      courses, evening classes, or weekend workshops, students
                      can pursue their education while balancing other
                      commitments.
                    </p>
                  </>
                )}
                <p
                  className="font-bold underline cursor-pointer"
                  onClick={toggleReadMore}
                >
                  {isExpanded ? "Show less" : "Read more..."}
                </p>
              </div>
            </div>
            {/* media side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto w-full md:w-[90%] lg:w-[49%] lg:items-stretch">
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
                        NEED MORE INFO ABOUT DUBLIN CITY UNIVERSITY?
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
                      <p className="text-white md:px-2 xl:px-4 mb-3">
                        Get a glimpse of your future at DCU!
                      </p>
                      <Link href="/universityarchievepage">
                        <button className="bg-white text-[#C7161E] font-normal px-1 md:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition ">
                          Discover More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Second Column: Card 3 */}
              <div className="relative text-white rounded-lg w-full flex items-center  h-[200px] lg:h-[550px]  lg:min-h-full">
                {/* Background Image */}
                <Image
                  // src="/CourseDetailPage/zeus.svg"
                  src="/Hero_Robot.png"
                  alt="AI Assistant"
                  layout="fill"
                  objectFit="none"
                  className="rounded-3xl"
                />
                <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 p-4 md:p-6 rounded-3xl "></div>
                {/* Content Section */}
                <div className="absolute bottom-0 w-full px-4 md:px-2 py-6 text-center">
                  <p>
                    Use our{" "}
                    <span className="text-[#F0851D]">AI - Powered </span>
                    platform Zeus to find your dream university in 3 minutes.
                  </p>
                  <Link href="/chatmodel">
                    <Button className="mt-4 bg-white  text-red-700 hover:bg-gray-300 w-4/5">
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
      <section
        id="careerOpportunities"
        className="my-7 relative bg-black bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div className="flex flex-col lg:flex-row w-full gap-5 m-4 justify-center items-start md:items-center">
          <div className="relative w-full md:w-3/4 xl:w-1/2 md:space-y-5  text-white">
            <h3>Career Opportunities</h3>
            <p className="text-[#9D9D9D] font-semibold">
              Unlock a world of career opportunities that align with your skills
              and passions. Discover industries, job roles, and professional
              growth paths that set you up for long-term success.
            </p>
          </div>

          <div className="hidden md:flex relative justify-center items-center w-full xl:w-1/2 text-white h-[40vh]">
            <div className="relative w-full pr-2 flex flex-col justify-center items-end h-[20vh]">
              <div className="flex h-[50%] items-center justify-end">
                <p>Healthcare Promotion</p>
              </div>
              <div className="flex h-[50%] items-center justify-end pt-4 pr-5">
                <p>Healthcare Information</p>
              </div>
            </div>

            {/* Center Section */}
            <div className="w-full flex flex-col justify-start">
              <div className="flex justify-center text-center m-2">
                <p>Public Health</p>
              </div>
              <div className="relative ">
                <Image
                  src="/countrypage/studyinuk.svg"
                  alt="BSC Physiology"
                  width={400}
                  height={400}
                />
                <div className="md:absolute md:inset-0 md:top-4 flex items-center justify-center">
                  <p className="w-[90px] text-center  text-white md:text-black font-semibold">
                    {" "}
                    BSC Physiology
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section with Reduced Border Height */}
            <div className="relative w-full pl-2 flex flex-col justify-center items-start h-[20vh]">
              <div className="flex h-[50%] items-center ">
                <p>Healthcare Management</p>
              </div>
              <p className="flex h-[50%] items-center  pt-4 pl-5">
                Healthcare Policy
              </p>
            </div>
          </div>

          <div className="relative flex flex-col md:hidden space-y-4">
            <h2 className="text-white">BSC Physicology</h2>
            {healthcareItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 text-white"
              >
                <Image
                  src={item.image}
                  alt={item.text}
                  width={50}
                  height={50}
                />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* fee and scholarship*/}
      <section id="feeScholarships" className=" w-[90%] mx-auto">
        <h2 className="pb-2">Fee and Scholarships!</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[24%_26%_46%] gap-6">
          {/* Fee Information Card */}
          <Card className="md:p-6 p-2 bg-[#FCE7D2] flex flex-col justify-between">
            <div>
              <h5 className="mb-2">Total Fee:</h5>
              <ul className="space-y-4 leading-normal lg:leading-10">
                <li className="flex items-center space-x-2 ">
                  <span className="vertical-line w-[1px] h-3 bg-black"></span>
                  <p className="font-semibold">€18,100</p>
                  <p className="text-gray-600">Annual Fee</p>
                </li>
                <li className="flex items-center space-x-2 ">
                  <span className="vertical-line w-[1px] h-3 bg-black"></span>
                  <p className="font-semibold">€500-800</p>
                  <p className="text-gray-600">Server Fee</p>
                </li>
                <li className="flex items-center space-x-2 ">
                  <span className="vertical-line w-[1px] h-3 bg-black"></span>
                  <p className="font-semibold">€500</p>
                  <p className="text-gray-600">Initial Deposit</p>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <p>
                Have Questions about University Fee?{" "}
                <Link
                  href="/contactus"
                  className="text-red-600 hover:underline font-semibold"
                >
                  WWAH
                </Link>{" "}
                is here to help!
              </p>
            </div>
          </Card>

          {/* Scholarships Card */}
          <Card className="py-6 md:p-6 p-2 bg-[#FCE7D2] flex flex-col justify-between">
            <div>
              <h5 className="mb-4 leading-tight">
                Scholarships at Dublin City University
              </h5>

              <div className="flex items-start pb-4">
                <p className="text-gray-600 mb-4 leading-tight">
                  For overseas students, DCU provides a variety of scholarships
                  that may cover living expenses, travel expenses, tuition fees,
                  or provide a partial award like a tuition fee remission or
                  discount.
                </p>
              </div>
            </div>

            <div className="flex w-full rounded-lg bg-[#FDF2E8]">
              <button
                onClick={() => setActiveTab("scholarship")}
                className={`flex-1 py-2 px-1 text-center rounded-lg text-xs sm:text-sm transition-colors duration-300 ${
                  activeTab === "scholarship"
                    ? "bg-[#F57C00] text-white"
                    : "bg-transparent text-black"
                }`}
              >
                <Link href="https://mta.ca/costs-financial-aid/scholarships-and-awards-first-year-students">
                  Scholarship Details
                </Link>
              </button>
              <button
                onClick={() => setActiveTab("funding")}
                className={`flex-1 py-2 text-center rounded-lg text-xs sm:text-sm transition-colors duration-300 ${
                  activeTab === "funding"
                    ? "bg-[#F57C00] text-white"
                    : "bg-transparent text-black"
                }`}
              >
                <Link href="https://mta.ca/current-students/student-finances/financial-aid-current-students">
                  Funding Details
                </Link>
              </button>
            </div>

            <Link href="/contactus">
              <Button
                variant="outline"
                className="w-full mt-4 border-2 border-red-500 text-red-500 bg-[#FCEAD8] 
             rounded-lg text-xs sm:text-sm hover:bg-[#F0851D] hover:text-white transition-colors duration-300"
              >
                Contact with WWAH Advisor
              </Button>
            </Link>
          </Card>
          <div className="flex flex-col gap-2">
            {/* Payment Methods Card */}
            <Card className="p-4 bg-[#FCE7D2]">
              <h5 className="font-semibold mb-4 leading-tight">
                Payment method for International Students
              </h5>
              <div className="flex items-start space-x-2">
                <span className="vertical-line hidden lg:block w-[1px] h-6 bg-black"></span>
                <p className=" text-gray-600 mb-2 leading-tight">
                  There are three ways in which you can pay your tuition and
                  related fee:
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-bold">Online</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-bold">Via Telephone</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-bold">Bank</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 mt-2">
                <span className="vertical-line hidden lg:block w-[1px] h-10 bg-black"></span>
                <p className=" text-gray-600 mb-4 leading-tight">
                  To find out how to pay Your tuition fee, deposits &
                  Accommodation fee at University of Victoria.
                </p>
              </div>
              <Link href="#">
                <Button
                  variant="outline"
                  className="w-full border-2 border-red-500 text-red-500 bg-[#FCEAD8] 
                  rounded-lg font-medium hover:bg-[#F0851D] hover:text-white transition-colors duration-300"
                >
                  Click here
                </Button>
              </Link>
            </Card>

            {/* Calculator Card */}
            <Card className="p-8 text-white col-span-full relative overflow-hidden rounded-lg bg-black/50">
              {/* Background Image */}
              <Image
                src="/calculate-bg.png"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
              />
              {/* Overlay Content */}
              <div className="relative z-10 text-center flex flex-col items-center justify-center space-y-2">
                <Calculator className="w-12 h-12" />
                <p>
                  Calculate your Living Expense at <br /> Dublin City University
                </p>
                <Link href="/trackexpense">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                  >
                    Calculate Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* progress bar  */}
      <section className="md:my-4 min-h-screen flex flex-col items-center justify-cente p-4 sm:p-6">
        <h3 className=" ">Application Success Chances!</h3>
        <p className="text-gray-600 mb-2">
          Your application success chances are:
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 w-full lg:w-[85%]">
          <div className="hidden md:flex items-center gap-4">
            <p className="text-center">
              Academic Results <br /> 70%
            </p>
            <span className="vertical-line w-[1px] h-20 bg-gray-500"></span>
          </div>
          {/* Academic Match Section */}
          <div className="w-full lg:w-1/2 bg-white shadow rounded-3xl p-4 md:p-6">
            {academicData.map((item, index) => (
              <div key={index} className="mb-6">
                {/* Progress Bar */}
                <div className="relative w-full h-[4rem] rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black`}
                    style={{
                      width: `${item.value}%`,
                      backgroundColor:
                        item.value >= 75
                          ? "#e5edde"
                          : item.value >= 50
                          ? "#e5edde"
                          : "#f4d0d2",
                    }}
                  >
                    <p className="flex items-center gap-2 text-[14px]">
                      {item.icon}
                      {item.label}
                    </p>
                  </div>
                  <p className="absolute right-4 text-black">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Match Section */}
          <div className="w-full lg:w-1/2 bg-white shadow rounded-3xl p-2 md:p-6">
            {financialData.map((item, index) => (
              <div key={index} className="mb-6">
                {/* Progress Bar */}
                <div className="relative w-full h-[6rem] rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black`}
                    style={{
                      width: `${item.value}%`,
                      backgroundColor:
                        item.value >= 75
                          ? "#e5edde"
                          : item.value >= 50
                          ? "#e5edde"
                          : "#f4d0d2",
                    }}
                  >
                    <p className="flex items-center gap-2 ">
                      {item.icon}
                      {item.label}
                    </p>
                  </div>
                  <p className="absolute right-4 text-black">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 ">
            <span className="vertical-line hidden md:block w-[1px] h-32 bg-gray-500"></span>
            <p className="text-center">
              Financial Results <br /> 70%
            </p>
          </div>
        </div>
      </section>

      {/* English Requirnment Section      */}
      <section className="bg-black text-white p-4 md:p-8">
        <div className="mx-auto flex flex-col lg:flex-row gap-2 md:gap-8">
          {/* Requirements Section */}
          <div className="flex flex-col flex-grow">
            <h4>English Language Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:gap-6 text-white place-content-center">
              {requirements.map((req, index) => (
                <div key={req.name} className="md:p-6 p-2 rounded-lg">
                  <h6 className="flex justify-between items-start">
                    <div>
                      {index + 1}. {req.name}
                      <p className="text-gray-400">
                        Overall Score: {req.overallScore}
                      </p>
                    </div>
                  </h6>
                  <p className="text-gray-400 md:mb-4">{req.description}</p>
                  <a
                    href={`/${req.link}`}
                    className="text-red-500 hover:text-red-400 underline"
                  >
                    View Detail
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-[#2a2a2a] bg-opacity-90 border border-zinc-800 text-white p-6 rounded-lg w-full lg:w-[40%]">
            <div className="mb-4">
              <h6>Struggling with your English Proficiency Score?</h6>
            </div>
            <div>
              <p className="text-gray-400 mb-4">
                Book your IELTS/PTE Classes with us and Start preparing Today!
              </p>
              <Link href="/form">
                <Button
                  className="w-full bg-[#545454] hover:bg-zinc-700 text-white py-2 rounded"
                  onClick={() => {}}
                >
                  Register Now!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents! */}
      <section
        id="entryRequirements"
        className="flex flex-col items-center justify-center my-5 md:my-10"
      >
        <h1 className="md:mb-6 mb-2">Required Documents!</h1>
        <div className="flex flex-col md:flex-row gap-2 md:mb-8">
          <Button
            variant={"destructive"}
            className={`px-4 py-2 rounded-lg border-2 h-12 ${
              activeTabUni === "University Application Docs"
                ? "border-red-500 text-gray-900 font-semibold bg-transparent"
                : "border-gray-900 text-gray-900  bg-transparent"
            }`}
            onClick={() => setActiveTabUni("University Application Docs")}
          >
            University Application Docs
          </Button>
          <Button
            variant={"destructive"}
            className={`px-4 py-2 rounded-lg border-2 h-12 ${
              activeTabUni === "Embassy Documents"
                ? "border-red-500 text-white-700 font-semibold bg-transparent"
                : "border-gray-900 text-gray-900  bg-transparent"
            }`}
            onClick={() => setActiveTabUni("Embassy Documents")}
          >
            Embassy Documents
          </Button>
        </div>
        {activeTabUni === "University Application Docs" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-[90%]">
            {/* Text Section */}
            <div className="bg-white p-6 rounded-xl shadow-md h-full">
              <h5 className=" md:mb-4">University Application Docs:</h5>
              <h6 className=" md:mb-4">Required Documents:</h6>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0 md:gap-4 text-gray-700 ">
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Passport Images</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Bank Statement</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Any Bill (Electricity, Water, Gas, etc.)</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Proof of Enrollment</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>University Acceptance Letter</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Passport-Sized Photos</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Scholarship Proof (if applicable)</p>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500 text-4xl">•</span>
                  <p>Medical Clearance</p>
                </li>
              </ul>
            </div>

            {/* Image Section */}
            <div className=" items-center justify-center rounded-3xl shadow-lg h-full block">
              <Image
                src="/scholarshipdetail/illustration.png"
                alt="Illustration"
                className="w-full h-full object-cover rounded-3xl"
                width={500}
                height={500}
              />
            </div>
          </div>
        )}

        {activeTabUni === "Embassy Documents" && (
          <div className="text-center text-gray-600 py-2">
            <p>Embassy Documents content will go here.</p>
          </div>
        )}
      </section>
      {/* application process */}
      <div className="w-full flex flex-col items-center">
        <section id="applicationProcess" className="w-[90%]  my-5 md:my-10">
          <h2 className="mb-2">Application Process!</h2>
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
            <div className="space-y-2">
              {/* Step 1 */}
              <div>
                <h6>Create an Account</h6>
                <p className="text-gray-700 mt-2">
                  Click on{" "}
                  <Link
                    href="/apply-now"
                    className="text-[#F0851D] hover:underline font-semibold"
                  >
                    Apply Now
                  </Link>{" "}
                  after creating your personalized profile through a registered
                  account. You can monitor your applications and receive regular
                  updates.{" "}
                  <Link
                    href="/register"
                    className="text-[#F0851D] hover:underline font-semibold"
                  >
                    Register here.
                  </Link>
                </p>
              </div>

              {/* Step 2 */}
              <div>
                <h6>Submit Your Application</h6>
                <p className="text-gray-700 mt-2">
                  Complete your Personal and Educational details. Upload your
                  documents and double-check all information before submission.
                </p>
              </div>
            </div>
            {/* Image with CTA */}
            <div className="relative bg-gray-100 p-4 w-full lg:w-[90%] 2xl:w-[60%] rounded-lg shadow-md h-40 md:h-60 flex items-center justify-center my-1">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: "url('/application-process-img.png')",
                }}
              ></div>

              {/* Overlay Content */}
              <div className="relative text-center text-white">
                <h6 className="mb-2">Begin Your Academic Journey in Ireland</h6>
                <Link
                  href="/learn-more"
                  className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 text-sm"
                >
                  Learn About the Application Process
                </Link>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div>
            <h6>Pay the Application Fee (If required)</h6>
            <p className="text-gray-700 mt-2">
              Make sure to pay the application fee (if applicable) to finalize
              your submission. Payment can be made easily directly to the
              university through bank, money exchangers, online apps, and WWAH
              secure online payment system.
            </p>
          </div>
          {/* Step 4 */}
          <div>
            <h6>Track Your Application</h6>
            <p className="text-gray-700 mt-2">
              Once your application is submitted, you can monitor its progress
              through your personalized WWAH dashboard. Stay informed with
              real-time updates and notifications.
            </p>
          </div>

          {/* Read More */}
          <div className="">
            <Link
              href="/read-more"
              className="text-red-500 hover:underline font-semibold"
            >
              Read more....
            </Link>
          </div>
        </section>
      </div>

      {/* explore section */}
      <section
        className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full"
        // style={{
        //   backgroundImage: "url('/bg-usa.png')",
        // }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        {/* Content Section */}
        <div className="relative z-10 w-full lg:w-[56%] flex flex-col justify-center md:space-y-4 sm:px-4 text-left">
          <h6 className="mb-2">Explore More Universities!</h6>
          <p className="text-[#9D9D9D] leading-relaxed">
            Discover the exciting world of universities in the United Kingdom,
            where you can gain a high-quality education and experience life in a
            new culture. Explore the perfect fit for your academic and career
            aspirations!
          </p>
        </div>
        {/* Slider Section */}
        <div className="relative z-10 w-full lg:w-[40%] mt-6 lg:mt-0">
          <div className="relative w-full flex justify-center overflow-hidden">
            <div
              className="flex overflow-x-auto space-x-4 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {sliderData.map((item, index) => (
                <div
                  key={index}
                  className="relative w-[85%] md:w-[65%]  flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt="image"
                    width={430}
                    height={350}
                    objectFit="cover"
                    className="rounded-3xl w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
