"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";

const Step3 = () => {
  const router = useRouter();

  // State for the form data
  const [workExperience, setWorkExperience] = useState({
    hasWorkExperience: false,
    hasBrandAmbassador: false,
    jobDescription: "",
  });

  // Handler for work experience radio buttons
  const handleWorkExperienceChange = (value: boolean) => {
    setWorkExperience({
      ...workExperience,
      hasWorkExperience: value,
      // Clear jobDescription if work experience is set to false
      jobDescription: value ? workExperience.jobDescription : "",
    });
  };

  // Handler for brand ambassador radio buttons
  const handleBrandAmbassadorChange = (value: boolean) => {
    setWorkExperience({
      ...workExperience,
      hasBrandAmbassador: value,
    });
  };

  // Handler for text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkExperience({ ...workExperience, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (
      workExperience.hasWorkExperience &&
      !workExperience.jobDescription.trim()
    ) {
      alert("Please describe your work experience.");
      return;
    }

    try {
      const token = getAuthToken();

      // Prepare data according to backend expectations
      const requestData = {
        hasWorkExperience: workExperience.hasWorkExperience,
        hasBrandAmbassador: workExperience.hasBrandAmbassador,
        jobDescription:
          workExperience.hasWorkExperience &&
          workExperience.jobDescription.trim()
            ? workExperience.jobDescription.trim()
            : null,
      };

      console.log("Frontend - Sending data:", requestData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/workExperience`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      const res = await response.json();
      console.log("Frontend - Received response:", res);

      if (res.success) {
        router.push("/referralportal/completeprofile/paymentinformation");
      } else {
        console.error("Error:", res.message);
        alert(res.message || "Failed to save work experience");
      }
    } catch (error) {
      console.error("Frontend - Submission error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="w-full p-6 bg-white">
      <form onSubmit={handleSubmit}>
        <section className="w-full">
          <p className="text-gray-800 font-semibold mb-6">Work Experience</p>

          {/* Work Experience Yes/No Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-4">
              Do you have any work experience?
            </label>
            <div className="flex gap-8 ">
              <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
                <input
                  type="radio"
                  name="hasWorkExperience"
                  value="yes"
                  checked={workExperience.hasWorkExperience}
                  onChange={() => handleWorkExperienceChange(true)}
                  className="mr-3"
                />
                <span className="text-sm sm:text-base">Yes</span>
              </label>
              <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
                <input
                  type="radio"
                  name="hasWorkExperience"
                  value="no"
                  checked={!workExperience.hasWorkExperience}
                  onChange={() => handleWorkExperienceChange(false)}
                  className="mr-3"
                />
                <span className="text-sm sm:text-base">No</span>
              </label>
            </div>
          </div>

          {/* Explain Work Experience Text Area - Only show if hasWorkExperience is true */}
          {workExperience.hasWorkExperience && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Explain Work Experience *
              </label>
              <textarea
                name="jobDescription"
                value={workExperience.jobDescription}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-100 px-4 py-2 placeholder:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Please describe your work experience in detail..."
                required={workExperience.hasWorkExperience}
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
                  name="hasBrandAmbassador"
                  value="yes"
                  checked={workExperience.hasBrandAmbassador}
                  onChange={() => handleBrandAmbassadorChange(true)}
                  className="mr-3"
                />
                <span className="text-sm sm:text-base">Yes</span>
              </label>
              <label className="flex items-center bg-gray-100 px-6 py-2 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors min-w-[200px]">
                <input
                  type="radio"
                  name="hasBrandAmbassador"
                  value="no"
                  checked={!workExperience.hasBrandAmbassador}
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
      </form>
    </div>
  );
};

export default Step3;
