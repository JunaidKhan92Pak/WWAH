"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const WorkExperienceForm = () => {
  const [hasWorkExperience, setHasWorkExperience] = useState(false);
  const [hasBrandAmbassadorExperience, setHasBrandAmbassadorExperience] =
    useState(false);
  const [workExperience, setWorkExperience] = useState({
    employmentType: "",
    jobTitle: "",
    organizationName: "",
    startDate: "",
    endDate: "",
    explanation: "",
  });

  const handleWorkExperienceChange = (value: boolean) => {
    setHasWorkExperience(value);
    if (!value) {
      setWorkExperience({
        employmentType: "",
        jobTitle: "",
        organizationName: "",
        startDate: "",
        endDate: "",
        explanation: "",
      });
    }
  };

  const handleBrandAmbassadorChange = (value: boolean) => {
    setHasBrandAmbassadorExperience(value);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkExperience({
      ...workExperience,
      [name]: value,
    });
  };

 

  return (
    <div className="w-full p-6 bg-white">
      <section className="w-full">
        <p className="text-gray-800 font-semibold mb-6">Work Experience</p>

        {/* Work Experience Yes/No Selection */}
        <div className="mb-6" >
          <label className="block text-gray-700 text-sm mb-4">
            Do you have any work experience?
          </label>
          <div className="flex gap-8 ">
            <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
              <input
                type="radio"
                name="workExperience"
                value="yes"
                checked={hasWorkExperience}
                onChange={() => handleWorkExperienceChange(true)}
                className="mr-3"
              />
              <span className="text-sm sm:text-base">Yes</span>
            </label>
            <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
              <input
                type="radio"
                name="workExperience"
                value="no"
                checked={!hasWorkExperience}
                onChange={() => handleWorkExperienceChange(false)}
                className="mr-3"
              />
              <span className="text-sm sm:text-base">No</span>
            </label>
          </div>
        </div>

        {/* Explain Work Experience Text Area */}
        {hasWorkExperience && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">
              Explain Work Experience
            </label>
            <textarea
              name="explanation"
              value={workExperience.explanation || ""}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-100 px-4 py-2 placeholder:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please describe your work experience in detail..."
            />
          </div>
        )}

        {/* Brand Ambassador Question */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-4">
            Have you worked as a brand ambassador before?
          </label>
          <div className="flex gap-8">
            <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
              <input
                type="radio"
                name="brandAmbassador"
                value="yes"
                checked={hasBrandAmbassadorExperience}
                onChange={() => handleBrandAmbassadorChange(true)}
                className="mr-3"
              />
              <span className="text-sm sm:text-base">Yes</span>
            </label>
            <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
              <input
                type="radio"
                name="brandAmbassador"
                value="no"
                checked={!hasBrandAmbassadorExperience}
                onChange={() => handleBrandAmbassadorChange(false)}
                className="mr-3"
              />
              <span className="text-sm sm:text-base">No</span>
            </label>
          </div>
        </div>

        <div className="text-left">
          <Button
            type="submit"
            size={"lg"}
            className="py- mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
          >
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WorkExperienceForm;
