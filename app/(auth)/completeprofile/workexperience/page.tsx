"use client";
import { getAuthToken } from "@/utils/authHelper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Step3 = () => {
  const router = useRouter();

  const [hasWorkExperience, setHasWorkExperience] = useState(false);
  const [workExperience, setWorkExperience] = useState({
    hasWorkExperience: false, // Updated key to "hasWorkExperience"
    jobTitle: "",
    organizationName: "",
    startDate: "",
    endDate: "",
    employmentType: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkExperience({ ...workExperience, [name]: value });
  };

  const handleEmploymentTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkExperience({ ...workExperience, employmentType: e.target.value });
  };

  // A helper to update both states for work experience flag
  const handleWorkExperienceChange = (value: boolean) => {
    setHasWorkExperience(value);
    setWorkExperience({ ...workExperience, hasWorkExperience: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use the workExperience state directly.
    const submissionData = workExperience.hasWorkExperience
      ? { ...workExperience }
      : { hasWorkExperience: workExperience.hasWorkExperience };

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/workExperience`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(submissionData),
        }
      );

      const res = await response.json();
      console.log(res);
      router.push("/completeprofile/languageproficiency");
    } catch (error) {
      console.error("There was an error:", error);
    }
  };


  return (
    <div className="w-full p-4">
      <section className="w-full">
        <p className=" text-gray-800 font-semibold">Work Experience</p>

        {/* Work Experience Yes/No Selection */}
        <div className="">
          <label className="block text-gray-700 text-sm mb-2">
            Do you have any work experience?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center text-sm sm:text-base ">
              <input
                type="radio"
                name="workExperience"
                value="yes"
                checked={hasWorkExperience}
                onChange={() => handleWorkExperienceChange(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center text-sm sm:text-base ">
              <input
                type="radio"
                name="workExperience"
                value="no"
                checked={!hasWorkExperience}
                onChange={() => handleWorkExperienceChange(false)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Work Experience Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          {hasWorkExperience && (
            <>
              {/* Employment Type */}
              <div className="my-4">
                <label className="block text-gray-700 text-sm mb-2">
                  Employment Type:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-sm sm:text-base ">
                    <input
                      type="checkbox"
                      value="fullTime"
                      checked={workExperience.employmentType === "fullTime"}
                      onChange={handleEmploymentTypeChange}
                      className="mr-2"
                    />
                    Full Time
                  </label>
                  <label className="flex items-center text-sm sm:text-base ">
                    <input
                      type="checkbox"
                      value="partTime"
                      checked={workExperience.employmentType === "partTime"}
                      onChange={handleEmploymentTypeChange}
                      className="mr-2"
                    />
                    Part Time
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Job Title:
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={workExperience.jobTitle}
                    onChange={handleChange}
                    className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Organization Name */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Organization Name:
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={workExperience.organizationName}
                    onChange={handleChange}
                    className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Start and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={workExperience.startDate}
                    onChange={handleChange}
                    className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    End Date:
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={workExperience.endDate}
                    onChange={handleChange}
                    className="w-full bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/2 mt-4 py-2 px-6 rounded-md text-white bg-red-700"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Step3;
