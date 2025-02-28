"use client";
import Image from "next/image";

const ActiveApplication = () => {
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

  return (
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
        <div className="flex flex-col gap-3  items-start">
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
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full mt-8 h-24 md:h-16">
        <div className="flex justify-between items-center w-[90%] mx-auto relative">
          {/* Progress Line */}
          <div className="absolute top-[50%] left-0 w-full h-1 bg-gray-300 z-[-1]"></div>

          {progressSteps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative group"
            >
              {/* Step Number */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full 
                  ${
                    index === 0
                      ? "bg-red-600 text-white"
                      : "bg-gray-500 text-white"
                  }
                  font-bold text-sm`}
              >
                {index + 1}
              </div>

              {/* Step Text - Visible only on md+ screens */}
              <p
                className="hidden md:block absolute top-[24px] text-xs text-gray-700 text-center 
                w-[96px] leading-normal break-words mt-3"
              >
                {step}
              </p>

              {/* Step Text - Hidden by default on small screens, but appears on hover */}
              <p
                className="absolute top-[24px] text-xs text-gray-700 text-center 
                w-[96px] leading-normal break-words mt-3 bg-white shadow-lg p-1 rounded-md 
                hidden group-hover:block md:hidden z-10"
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveApplication;
