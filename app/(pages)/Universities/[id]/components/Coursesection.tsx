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
    subjectAreaFilter,
    setSearch,
    studyLevel,
    setStudyLevel,
    selectedUniversity,
    setSelectedUniversity,
    setSubjectAreaFilter,
  } = useCourseStore(); // Zustand state

  // ✅ Initialize local state from Zustand if values exist
  const [courseInfo, setCourseInfo] = useState({
    search: search || "",
    level: studyLevel || "",
    subject: Array.isArray(subjectAreaFilter)
      ? subjectAreaFilter[0] || ""
      : subjectAreaFilter || "",
    university: selectedUniversity || name || "",
  });

  // ✅ Sync Zustand values on mount (for back navigation)
  useEffect(() => {
    setCourseInfo((prev) => ({
      ...prev,
      search: search || "",
      level: studyLevel || "",
      subject: Array.isArray(subjectAreaFilter)
        ? subjectAreaFilter[0] || ""
        : subjectAreaFilter || "",
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
    setSubjectAreaFilter(courseInfo.subject ? [courseInfo.subject] : []); // ✅ Update selected subject in Zustand

    // Build query params dynamically
    const queryParams = new URLSearchParams();
    if (courseInfo.search) queryParams.append("search", courseInfo.search);
    if (courseInfo.level) queryParams.append("studyLevel", courseInfo.level);
    if (courseInfo.subject)
      queryParams.append(
        "subject",
        Array.isArray(courseInfo.subject)
          ? courseInfo.subject.join(",")
          : courseInfo.subject
      );
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
                      className="w-full p-2 border rounded-lg bg-gray-100"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="foundation">Foundation</option>
                      <option value="Pre-Master">Pre-Master</option>
                      <option value="Bachelor">Bachelors</option>
                      <option value="Master">Master</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Certificate">Certificate</option>
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
                      id="subjectAreaFilter"
                      className="w-full p-2 border rounded-lg bg-gray-100"
                    >
                      <option value="" disabled selected>
                        Select
                      </option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Earth & Environmental Sciences">
                        Earth & Environmental Sciences
                      </option>
                      <option value="Astronomy">Astronomy</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Geology">Geology</option>
                      <option value="Oceanography">Oceanography</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                      <option value="Artificial Intelligence (AI)">
                        Artificial Intelligence (AI)
                      </option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Data Science & Analytics">
                        Data Science & Analytics
                      </option>
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="Game Development">Game Development</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Robotics & Automation">
                        Robotics & Automation
                      </option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Statistics">Statistics</option>
                      <option value="Actuarial Science">
                        Actuarial Science
                      </option>
                      <option value="Medicine (MBBS, MD)">
                        Medicine (MBBS, MD)
                      </option>
                      <option value="Dentistry">Dentistry</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Physiotherapy">Physiotherapy</option>
                      <option value="Public Health">Public Health</option>
                      <option value="Veterinary Science">
                        Veterinary Science
                      </option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Molecular Biology">
                        Molecular Biology
                      </option>
                      <option value="Neuroscience">Neuroscience</option>
                      <option value="Genetics">Genetics</option>
                      <option value="Microbiology">Microbiology</option>
                      <option value="Immunology">Immunology</option>
                      <option value="Radiology & Medical Imaging">
                        Radiology & Medical Imaging
                      </option>
                      <option value="Nutrition & Dietetics">
                        Nutrition & Dietetics
                      </option>
                      <option value="Occupational Therapy">
                        Occupational Therapy
                      </option>
                      <option value="Speech & Language Therapy">
                        Speech & Language Therapy
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resource Management">
                        Human Resource Management
                      </option>
                      <option value="Operations Management">
                        Operations Management
                      </option>
                      <option value="Supply Chain Management">
                        Supply Chain Management
                      </option>
                      <option value="Financial Management">
                        Financial Management
                      </option>
                      <option value="Investment & Asset Management">
                        Investment & Asset Management
                      </option>
                      <option value="Banking & Risk Management">
                        Banking & Risk Management
                      </option>
                      <option value="Accounting & Auditing">
                        Accounting & Auditing
                      </option>
                      <option value="Economics">Economics</option>
                      <option value="Law">Law</option>
                      <option value="International Law">
                        International Law
                      </option>
                      <option value="Political Science">
                        Political Science
                      </option>
                      <option value="Public Administration">
                        Public Administration
                      </option>
                      <option value="International Relations">
                        International Relations
                      </option>
                      <option value="Psychology">Psychology</option>
                      <option value="Social Work">Social Work</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Fashion Design">Fashion Design</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Theatre & Drama">Theatre & Drama</option>
                      <option value="Film & Television">
                        Film & Television
                      </option>
                      <option value="Music Performance & Production">
                        Music Performance & Production
                      </option>
                      <option value="Dance">Dance</option>
                      <option value="Journalism">Journalism</option>
                      <option value="Public Relations (PR)">
                        Public Relations (PR)
                      </option>
                      <option value="Digital Media">Digital Media</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Education & Pedagogy">
                        Education & Pedagogy
                      </option>
                      <option value="Agricultural Sciences">
                        Agricultural Sciences
                      </option>
                      <option value="Food Science & Technology">
                        Food Science & Technology
                      </option>
                      <option value="Tourism & Travel Management">
                        Tourism & Travel Management
                      </option>
                      <option value="Event Management">Event Management</option>
                      <option value="Culinary Arts">Culinary Arts</option>
                      <option value="Gender Studies">Gender Studies</option>
                      <option value="Visual Arts">Visual Arts</option>
                      <option value="Sports and Exercise Sciences">
                        Sports and Exercise Sciences
                      </option>
                      <option value="Media & Communication">
                        Media & Communication
                      </option>
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
          <div className="relative rounded-3xl overflow-hidden shadow-lg w-[100%] h-[250px] md:h-[200px] lg:h-[300px]  2xl:h-[400px]">
            <Image
              src="/Zeushicomp.png"
              alt="AI Assistant"
              layout="fill"
              width={0}
              height={0}
              sizes="20vw"
              objectFit="none"
              className="rounded-3xl"
            />
            <div className="absolute inset-0 flex justify-center items-end text-center bg-black/50 p-4 md:p-6">
              <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[85%]">
                <p className="text-white px-4 mb-3">
                  Still Deciding on the right University? Let ZEUS guide you to
                  your Dream University in just 3 minutes.
                </p>
                <Link
                  href={"/chatmodel"}
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
