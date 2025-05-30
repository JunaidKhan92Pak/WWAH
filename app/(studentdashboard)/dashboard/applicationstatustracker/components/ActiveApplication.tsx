"use client";
import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authHelper";

const ActiveApplication = () => {
  const [currentStatus, setCurrentStatus] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStatus, setAnimatedStatus] = useState(1);

  const applicationDetails = [
    { src: "/location.svg", alt: "Location", text: "New Zealand" },
    { src: "/DashboardPage/intake.svg", alt: "Intake", text: "2024" },
    { src: "/clock.svg", alt: "Duration", text: "4 Years" },
    { src: "/money.svg", alt: "Tuition Fee", text: "$ 53,122" },
    {
      src: "/DashboardPage/deadline.svg",
      alt: "Deadline",
      text: "February 2025",
      isDeadline: true,
    },
  ];

  const progressSteps = [
    "Complete Application",
    "Applied",
    "Offer Letter Received",
    "Confirm Enrollment",
    "Visa Granted",
    "Accommodation Booked",
    "Airport Pickup Booked",
  ];

  // Animate progress steps smoothly
  useEffect(() => {
    if (currentStatus > animatedStatus) {
      const timer = setTimeout(() => {
        setAnimatedStatus((prev) => prev + 1);
      }, 300); // 300ms delay between each step animation

      return () => clearTimeout(timer);
    }
  }, [currentStatus, animatedStatus]);

  useEffect(() => {
    console.log("Fetching status data for studentId:");
    const token = getAuthToken();

    const fetchStatusData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getStatusUpdateStudent`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch status data: ${res.status}`);
        }

        const jsonData = await res.json();
        console.log(jsonData, "res from status update api");

        // Set the current status from API response
        const statusFromAPI = parseInt(jsonData.data.applicationStatus) || 1;
        setCurrentStatus(statusFromAPI);
      } catch (err) {
        console.error("Failed to fetch status:", err);
        // Default to status 1 if API fails
        setCurrentStatus(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  const getStepStatus = (stepIndex:number) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber <= animatedStatus) {
      return "completed";
    } else if (
      stepNumber === animatedStatus + 1 &&
      stepNumber <= currentStatus
    ) {
      return "current";
    } else {
      return "pending";
    }
  };

  const getStepStyles = (status:string) => {
    switch (status) {
      case "completed":
        return "bg-red-600 text-white scale-110";
      case "current":
        return "bg-red-600 text-white scale-110 animate-pulse ring-4 ring-red-200";
      case "pending":
      default:
        return "bg-gray-400 text-white scale-100";
    }
  };

  const getProgressLineWidth = () => {
    if (animatedStatus <= 1) return "0%";
    const completedSteps = Math.min(
      animatedStatus - 1,
      progressSteps.length - 1
    );
    return `${(completedSteps / (progressSteps.length - 1)) * 100}%`;
  };

  return (
    <div className="relative">
      {/* Blur Overlay - uncomment if needed */}
      {/* <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-xl flex items-center justify-center">
        <button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
          Complete Your Profile
        </button>
      </div> */}

      <div className="bg-[#FCE7D280] w-full mx-auto rounded-xl border mt-4 p-0 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6 w-[95%] mx-auto items-center md:items-start">
          {/* Course Image */}
          <Image
            src="/course1.svg"
            alt="courseImg"
            width={600}
            height={500}
            className="h-auto md:h-48 w-[350px] md:w-[240px] object-cover rounded-2xl"
          />

          {/* Course Details */}
          <div className="flex flex-col gap-3 items-start">
            <p className="font-semibold text-lg">
              Bachelor of Engineering (Honors) - BE(Hons)
            </p>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              {applicationDetails.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    item.isDeadline ? "col-span-2" : ""
                  }`}
                >
                  <Image src={item.src} width={18} height={18} alt={item.alt} />
                  {item.isDeadline ? (
                    <>
                      <p className="text-base">Deadline:</p>
                      <p className="text-base ml-6 md:ml-12">{item.text}</p>
                    </>
                  ) : (
                    <p className="text-base">{item.text}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Status Display */}
            {!isLoading && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">
                  Step {animatedStatus} of {progressSteps.length} completed
                </p>
              </div>
            )}

            {isLoading && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-400">Loading status...</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full mt-8 h-24 md:h-16">
          <div className="flex justify-between items-center w-[90%] mx-auto relative">
            {/* Background Progress Line */}
            <div className="absolute top-[50%] left-0 w-full h-1 bg-gray-300 z-[-1] rounded-full"></div>

            {/* Animated Progress Line */}
            <div
              className="absolute top-[50%] left-0 h-1 bg-gradient-to-r from-red-500 to-red-500 z-[-1] rounded-full transition-all duration-500 ease-out"
              style={{ width: getProgressLineWidth() }}
            ></div>

            {progressSteps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative group"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full 
                    font-bold text-sm transition-all duration-300 ease-out transform
                    ${getStepStyles(status)}
                    `}
                  >
                    {status === "completed" ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Text - Visible only on md+ screens */}
                  <p
                    className={`hidden md:block absolute top-[24px] text-xs text-center 
                    w-[96px] leading-normal break-words mt-3 transition-colors duration-300
                    ${
                      status === "completed"
                        ? "text-gray-700 font-medium"
                        : status === "current"
                        ? "text-red-700 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                  {/* Step Text - Hidden by default on small screens, but appears on hover */}
                  <p
                    className={`absolute top-[24px] text-xs text-center 
                    w-[96px] leading-normal break-words mt-3 bg-white shadow-lg p-2 rounded-md 
                    hidden group-hover:block md:hidden z-10 transition-colors duration-300
                    ${
                      status === "completed"
                        ? "text-red-700 font-medium border-red-200 border"
                        : status === "current"
                        ? "text-red-700 font-medium border-red-200 border"
                        : "text-gray-700"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveApplication;
