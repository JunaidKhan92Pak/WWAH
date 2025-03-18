"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/store/useCoursesStore";
import { useRouter } from "next/navigation";
interface CoursesectionProps {
  name: string;
}

const Coursesection: React.FC<CoursesectionProps> = ({ name }) => {
  const router = useRouter();
  const {
    search,
    setSearch,
    studyLevel,
    setStudyLevel,
    selectedUniversity,
    setSelectedUniversity,
  } = useCourseStore(); // Zustand state

  // ✅ Initialize local state from Zustand if values exist
  const [courseInfo, setCourseInfo] = useState({
    search: search || "",
    level: studyLevel || "",
    subject: "",
    university: selectedUniversity || name || "",
  });

  // ✅ Sync Zustand values on mount (for back navigation)
  useEffect(() => {
    setCourseInfo((prev) => ({
      ...prev,
      search: search || "",
      level: studyLevel || "",
      university: selectedUniversity || name || "",
    }));
  }, []); // Runs only on mount

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCourseInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Update Zustand states when the form is submitted
    if (courseInfo.search.trim()) {
      setSearch(courseInfo.search);
    } else {
      setSearch(""); // ✅ Allows clearing Zustand state
    }

    setStudyLevel(courseInfo.level); // ✅ Update study level in Zustand
    setSelectedUniversity(courseInfo.university); // ✅ Update selected university in Zustand

    // Build query params dynamically
    const queryParams = new URLSearchParams();
    if (courseInfo.search) queryParams.append("search", courseInfo.search);
    if (courseInfo.level) queryParams.append("studyLevel", courseInfo.level);
    if (courseInfo.subject) queryParams.append("subject", courseInfo.subject);
    if (courseInfo.university)
      queryParams.append("university", courseInfo.university);

    // Navigate to search results page
    router.push(`/coursearchive?${queryParams.toString()}`);
  };
  return (
    <div>
      {/* Course Section */}
      <section className="pb-10 lg:pb-16 w-full">
        <div className="bg-white lg:mt-12 lg:mb-12"></div>
        <div className="w-[90%] mx-auto sm:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Side: Course Search Form */}
          <div className="">
            <h2 className="text-gray-800 mb-2 md:mb-6">Find your Course!</h2>
            {/* Dropdowns and Search Bar */}
            <form className="md:space-y-4" onSubmit={handleSearch}>
              <div>
                {/* Dropdowns for Study Level and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                      className="w-full p-1 md:p-1 border rounded-lg bg-gray-100"
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
                      className="w-full p-1 md:p-1 border rounded-lg bg-gray-100"
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
                <div className="flex items-center border rounded-lg shadow-sm gap-2 px-3 py-0 bg-gray-100 mt-3">
                  <CiSearch className=" text-gray-400 " />
                  <Input
                    value={courseInfo.search}
                    name="search"
                    onChange={handleChange}
                    placeholder="Write course name..."
                    className="flex-1 border-none focus:ring-0 focus:outline-none outline:none bg-gray-100 placeholder:text-[14px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                  />
                  <Button
                    type="submit"
                    className="hover:underline font-bold bg-gray-100 text-[#F0851D] underline underline-offset-3"
                  >
                    Search
                  </Button>
                </div>
              </div>
              {/* View All Courses Button */}

              <Button
                type="submit"
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-[#C7161E] text-white sm:py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 "
              >
                View All Courses!
              </Button>
            </form>
          </div>
          {/* Right Side: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg w-[100%] h-[250px] md:h-[200px] lg:h-[300px]  2xl:h-[600px]">
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
