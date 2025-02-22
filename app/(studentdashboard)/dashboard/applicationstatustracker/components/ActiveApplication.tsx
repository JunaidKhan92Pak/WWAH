"use client"
import Image from "next/image";

const ActiveApplication = () => {
  const applicationDetails = [
    { src: "/location.svg", alt: "Location", text: "New Zealand" },
    { src: "/DashboardPage/intake.svg", alt: "Intake", text: "2024" },
    { src: "/clock.svg", alt: "Duration", text: "4 Years" },
    { src: "/money.svg", alt: "Tuition Fee", text: "$ 53,122" },
    { src: "/DashboardPage/deadline.svg", alt: "Deadline", text: "February 2025", isDeadline: true },
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
    <div className="bg-[#FCE7D280]  w-full mx-auto rounded-xl border ">
      <div className="flex flex-col sm:flex-row gap-6 w-[95%] mx-auto items-center md:items-start p-4">
        {/* Course Image */}
        <Image
          src="/course1.svg"
          alt="courseImg"
          width={600}
          height={500}
          className="w-full h-auto lg:h-48 md:w-[290px] xl:w-[252px] object-cover rounded-2xl"
        />

        {/* Course Details */}
        <div className="flex flex-col gap-3  xl:w-[25%] items-start">
          <p className="font-semibold text-lg">Bachelor of Engineering (Honors) - BE(Hons)</p>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-nowrap">
            {applicationDetails.map((item, index) => (
              <div key={index} className={`flex items-center gap-2 ${item.isDeadline ? "col-span-2" : ""}`}>
                <Image src={item.src} width={18} height={18} alt={item.alt} />
                {item.isDeadline ? (
                  <>
                    <p className="text-base">Deadline:</p>
                    <p className="text-base ml-10">{item.text}</p>
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
      <div className="relative w-full ">
        <div className="flex justify-between items-center w-[90%] mx-auto relative">
          {/* Progress Line */}
          <div className="absolute top-[50%] left-0 w-full h-1 bg-gray-300 z-[-1]"></div>

          {progressSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative group">
              {/* Step Number */}
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${index === 0 ? "bg-red-600 text-white" : "bg-gray-500 text-white"
                  } font-bold text-sm`}
              >
                {index + 1}
              </div>

              {/* Step Text - Always visible on md screens */}
              <p className="hidden md:block text-xs text-gray-700 w-[90px] text-center absolute mt-8 cursor-pointer">
                {step}
              </p>

              {/* Step Text - Hidden by default on small screens, appears on hover */}
              <p className="hidden md:hidden group-hover:block text-xs text-gray-700 w-[90px] text-center absolute mt-8">
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
