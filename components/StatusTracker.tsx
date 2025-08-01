// components/StatusTracker.tsx
"use client";
import React, { useEffect, useState } from "react";

const progressSteps = [
  "Complete Application",
  "Applied",
  "Offer Letter Received",
  "Confirm Enrollment",
  "Visa Granted",
  "Accommodation Booked",
  "Airport Pickup Booked",
];

const StatusTracker = ({ currentStatus }: { currentStatus: number }) => {
  const [animatedStatus, setAnimatedStatus] = useState(1);

  useEffect(() => {
    if (currentStatus > animatedStatus) {
      const timer = setTimeout(() => {
        setAnimatedStatus((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStatus, animatedStatus]);

  const getStepStatus = (stepIndex: number) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber <= animatedStatus) return "completed";
    if (stepNumber === animatedStatus + 1 && stepNumber <= currentStatus)
      return "current";
    return "pending";
  };

  const getStepStyles = (status: string) => {
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
    <div className="relative w-full mt-6 h-24 md:h-16">
      <div className="flex justify-between items-center w-[95%] mx-auto relative">
        <div className="absolute top-[50%] left-0 w-full h-1 bg-gray-300 z-[-1] rounded-full"></div>
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
  );
};

export default StatusTracker;
