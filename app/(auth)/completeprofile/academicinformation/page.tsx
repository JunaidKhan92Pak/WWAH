"use client";
import { getAuthToken } from "@/utils/authHelper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AcademicInformation = () => {
  const router = useRouter();

  const [academicInfo, setAcademicInfo] = useState({
    highestQualification: "",
    majorSubject: "",
    previousGradingScale: "",
    previousGradingScore: "",
    standardizedTest: "",
    standardizedTestScore: "",
    institutionName: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAcademicInfo({ ...academicInfo, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/academic-Information`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Move this out of headers
          body: JSON.stringify(academicInfo),
        }
      );

      const res = await response.json();
      console.log(res);
      router.push("/completeprofile/languageproficiency");
    } catch (error) {
      console.log(`There Is Some Error: ${error}`);
    }
  };

  return (
    <div className="w-full">
      <section>
        <form
          className=" bg-white rounded-md space-y-2 mx-auto  lg:p-8"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {/* Highest Qualification */}
              <label className="block text-gray-700 text-sm mb-2">
                What is your highest level of Qualification
              </label>
              <select
                id="highestQualification"
                name="highestQualification"
                value={academicInfo.highestQualification}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Matric">
                  Matric/O Levels/Secondary School Certificates
                </option>
                <option value="Intermediate">
                  Intermediate/A Levels/High School
                </option>
                <option value="IB Diploma">IB Diploma</option>
                <option value="GCSE">GCSE</option>
                <option value="Masters">Master/MPhil</option>
                <option value="Bachelors">Bachelors</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate Program</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              {/* Major Subject */}
              <label className="block  text-gray-700 text-sm mb-2 truncate  hover:whitespace-normal">
                What was your Major Subject/Field of Study?
              </label>
              <input
                type="text"
                placeholder="Write"
                name="majorSubject"
                id="majorSubject"
                value={academicInfo.majorSubject}
                onChange={handleChange}
                className="w-full py-2 placeholder:text-sm   placeholder-gray-700 bg-[#F1F1F1] px-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {/* Previous Grading Scale */}
              <label className="block text-gray-700 text-sm mb-2 truncate hover:whitespace-normal hover:p-1 hover:rounded-sm">
                Which grading scale was used in your previous studies?
              </label>
              <select
                id="previousGradingScale"
                name="previousGradingScale"
                value={academicInfo.previousGradingScale}
                onChange={handleChange}
                className="w-full py-2 px-4 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="percentage">Percentage Grade Scale</option>
                <option value="gpa">Grade Point Average (GPA) Scale</option>
                <option value="letter">Letter Grade Scale (A-F)</option>
                <option value="pass/fail">Pass/Fail</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              {/* Obtained Scores */}
              <label className="block text-gray-700 text-sm mb-2">
                Obtained scores
              </label>
              <input
                type="text"
                name="previousGradingScore"
                id="previousGradingScore"
                value={academicInfo.previousGradingScore}
                onChange={handleChange}
                placeholder="Write..."
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {/* Standardized Test */}
              <label className="block text-gray-700 text-sm mb-2">
                What standardized test have you taken?
              </label>
              <select
                id="standardizedTest"
                name="standardizedTest"
                value={academicInfo.standardizedTest}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm  bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
                <option value="GRE">GRE</option>
                <option value="GMAT">GMAT</option>
                <option value="LSAT">LSAT</option>
                <option value="MCAT">MCAT</option>
                <option value="GAMSAT">GAMSAT</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              {/* Standardized Test Score */}
              <label className="block text-gray-700 text-sm mb-2">
                Obtained scores
              </label>
              <input
                type="text"
                name="standardizedTestScore"
                id="standardizedTestScore"
                value={academicInfo.standardizedTestScore}
                onChange={handleChange}
                placeholder="Write..."
                className="w-full bg-[#F1F1F1] px-4 py-2 placeholder:text-sm  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
              />
            </div>
          </div>
          {/* start and end date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={academicInfo.startDate}
                onChange={handleChange}
                placeholder="start date"
                className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={academicInfo.endDate}
                onChange={handleChange}
                placeholder="end date"
                className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {/* Standardized Test Score */}
              <label className="block text-gray-700 text-sm mb-2">
                Institution Name
              </label>
              <input
                type="text"
                name="institutionName"
                id="institutionName"
                value={academicInfo.institutionName}
                onChange={handleChange}
                placeholder="Institution Name"
                className="w-full placeholder:text-sm  bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 placeholder-gray-700"
              />
            </div>
          </div>

          <div className="text-left ">
            <button
              type="submit"
              className="w-1/2 mt-2 py-2 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AcademicInformation;
