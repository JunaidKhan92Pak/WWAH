"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  firstName: string | null;
  lastName: string | null;
}

const Herosection = ({ user }: { user: User }) => {
  const [time, setTime] = useState(new Date());

  // You can customize these values
  const currentStatus = 4;
  const totalSteps = 5;

  const steps = [
    {
      id: 1,
      label: "Register ",
      sublabel: "profile",
      icon: "/usericon.svg",
      alt: "Register Icon",
    },
    {
      id: 2,
      label: "Choose Course",
      sublabel: "and Apply",
      icon: "/apply.svg",
      alt: "Choose Course Icon",
    },
    {
      id: 3,
      label: "Confirm course",
      sublabel: "selection",
      icon: "/confirm.svg",
      alt: "Confirm Course Icon",
    },
    {
      id: 4,
      label: "Complete your",
      sublabel: "Application",
      icon: "/application.svg",
      alt: "Complete Application Icon",
    },
    {
      id: 5,
      label: "Track",
      sublabel: "Application",
      icon: "/trackap.svg",
      alt: "Track Application Icon",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FCE7D2] border border-red-100 rounded-2xl shadow-md px-6 py-5 md:py-7 w-full">
      {/* Greeting Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#FCE7D2] p-2 rounded-xl">
          <Image
            src="/DashboardPage/handframe.svg"
            alt="Welcome Icon"
            width={40}
            height={40}
            className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
          />
        </div>
        <div className="text-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold">
            Hello, {user?.firstName || "Asma"} {user?.lastName || "Kazmi"}!
          </h2>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString("en-US", { weekday: "long" })}{" "}
            {time.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative w-[90%] mx-auto">
        {/* Progress Line Background */}
        <div className="absolute top-4 left-0 w-full h-3 bg-gray-300 rounded-full"></div>

        {/* Active Progress Line */}
        <div
          className="absolute top-4 left-0 h-3 bg-green-500 rounded-full "
          style={{
            width: `${((currentStatus - 1) / (totalSteps - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps Container */}
        <div className="relative flex justify-between items-start">
          {steps.map((step) => {
            const isCompleted = step.id <= currentStatus;
            // const isActive = step.id === currentStatus;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative"
              >
                {/* Circle Checkpoint */}
                <div
                  className={`
                    w-10 h-10 rounded-full  flex items-center justify-center z-10 transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-300 border-gray-500"
                    }
                  `}
                >
                  <Image src="/tick.svg" alt="tick" width={24} height={24} />
                </div>

                {/* Step Content */}
                <div className="mt-3 text-center min-w-0">
                  <div className="flex flex-col items-center text-xs text-gray-700">
                    <Image
                      src={step.icon}
                      width={24}
                      height={24}
                      alt={step.alt}
                    />
                    <div className="font-medium leading-tight pt-1">
                      {step.label}
                    </div>
                    <div className="text-gray-500 leading-tight">
                      {step.sublabel}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Herosection;
