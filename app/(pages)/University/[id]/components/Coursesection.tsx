"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/store/useCoursesStore";
interface CoursesectionProps {
  name: string;
}

const Coursesection: React.FC<CoursesectionProps> = ({ name }) => {
  const [courseInfo, setCourseInfo] = useState({
    level: "",
    subject: "",
  });
  const {
    search, setSearch, selectedUniversity, setSelectedUniversity,
    countryFilter, setCountryFilter, studyLevel, setStudyLevel,
  } = useCourseStore()
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCourseInfo({
      ...courseInfo,
      [e.target.name]: e.target.value,
    });

  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(search);
  };
  // console.log(search);
  return (
    <div>
      {/* Course Section */}
      <section className="pb-10 lg:pb-16 w-full">
        <div className="bg-white lg:mt-12 lg:mb-12"></div>
        <div className="w-[90%] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Side: Course Search Form */}
          <div className="">
            <h2 className="text-gray-800 mb-2 md:mb-6">Find your Course!</h2>
            {/* Dropdowns and Search Bar */}
            <div className="md:space-y-4">
              <form onSubmit={handleSearch}>
                {/* Dropdowns for Study Level and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* study level */}
                  <div>
                    <label
                      htmlFor="study-level"
                      className="block text-gray-600 mb-1"
                    >
                      Choose by Study Level
                    </label>
                    <select
                      name="level"
                      value={courseInfo.level}
                      onChange={handleChange}
                      id="study-level"
                      className="w-full p-1 md:p-2 border rounded-lg bg-gray-100"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  {/* choosee by subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-600 mb-1"
                    >
                      Choose by Subject
                    </label>
                    <select
                      name="subject"
                      value={courseInfo.subject}
                      onChange={handleChange}
                      id="subject"
                      className="w-full p-1 md:p-2 border rounded-lg bg-gray-100"
                    >
                      <option value="" disabled selected>
                        Select
                      </option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                {/* Search Bar with Icon */}
                <div className="flex items-center border rounded-lg shadow-sm gap-2 px-3 py-1 bg-gray-100 m-4">
                  <CiSearch className=" text-gray-400 " />
                  <Input
                    value={search}
                    name="searchCourse"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Write course name..."
                    className="flex-1 border-none focus:ring-0 focus:outline-none outline:none bg-gray-100"
                  />
                  <Link
                    className="hover:underline font-bold text-[#F0851D]"
                    href={{
                      pathname: "/coursearchive",
                      query: {
                        // selectedUniversity: name,
                        // studyLevel: courseInfo.level,
                        // subject: courseInfo.subject,
                        search: search,
                      }, // Pass the university ID
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search
                  </Link>
                </div>
              </form>
              {/* View All Courses Button */}
              <Link
                href={{
                  pathname: "/coursearchive",
                  query: { selectedUniversity: name }, // Pass the university ID
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto mt-2 sm:mt-0 bg-[#C7161E] text-white sm:py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ">
                  View All Courses!
                </Button>
              </Link>
            </div>
          </div>
          {/* Right Side: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg w-[90%] h-[250px] md:h-[200px] lg:h-[300px]  2xl:h-[600px]">
            <Image
              src="/Hero_Robot.png" // Replace with actual image path
              alt="Zeus Guide"
              layout="fill"
              // objectFit="cover"
              className="object-contain"
            />
            <div className="absolute inset-0 flex justify-center items-end text-center bg-black/50 p-4 md:p-6">
              <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[85%]">
                <p className="text-white px-4 mb-3">
                  Still Deciding on the right University? Let ZEUS guide you to
                  your Dream University in just 3 minutes.
                </p>
                <Link
                  href={"/chatmodel"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-white text-[#C7161E] px-4  py-2 sm:py-3 rounded-md hover:bg-gray-300 transition">
                    Start your Study Abroad Journey
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Coursesection;