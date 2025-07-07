"use client";
import Image from "next/image";

const CompletedApplication = () => {
  const applicationDetails = [
    { src: "/location.svg", alt: "Location", text: "New Zealand" },
    { src: "/DashboardPage/intake.svg", alt: "Intake", text: "2024" },
    { src: "/clock.svg", alt: "Duration", text: "4 Years" },
    { src: "/money.svg", alt: "Tuition Fee", text: "$ 53,122" },
  ];

  return (
    <div className="rounded-xl mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
        {["/course1.svg", "/course1.svg"].map((courseImg, index) => (
          <div
            key={index}
            className="flex flex-col xl:flex-row bg-[#FCE7D280] p-4 sm:p-2 rounded-xl gap-4 border border-orange-200"
          >
            {/* Course Image */}
            <Image
              src="/course1.svg"
              alt="courseImg"
              width={600}
              height={500}
              className="w-full h-auto lg:h-48 lg:w-[290px] xl:w-[250px] object-cover rounded-2xl"
            />

            {/* Course Details */}
            <div className="flex flex-col justify-start gap-3 w-full">
              <p className="font-semibold text-base sm:text-lg md:text-xl leading-snug text-gray-800">
                Bachelor of Engineering (Honors) - BE(Hons)
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 ">
                {applicationDetails.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Image
                      src={item.src}
                      width={18}
                      height={18}
                      alt={item.alt}
                      className="min-w-[18px]"
                    />
                    <p className="text-sm sm:text-[15px] text-gray-700">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedApplication;
