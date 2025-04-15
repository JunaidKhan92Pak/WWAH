"use client";
import Image from "next/image";

const CompletedApplication = () => {
  const applicationDetails = [
    { src: "/location.svg", alt: "Location", text: "New Zealand" },
    { src: "/DashboardPage/intake.svg", alt: "Intake", text: "2024" },
    { src: "/clock.svg", alt: "Duration", text: "4 Years" },
    { src: "/money.svg", alt: "Tuition Fee", text: "$ 53,122" },
    // { src: "/DashboardPage/deadline.svg", alt: "Deadline", text: "February 2025", isDeadline: true },
  ];

  return (
    <div className="rounded-xl mt-2">
      <div className="mx-auto flex  flex-col  gap-4 w-full">
        {["/course1.svg", "/course1.svg"].map((courseImg, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row w-full md:w-[70%]  gap-4 bg-[#FCE7D280] p-2 rounded-xl "
          >
            {/* Course Image */}
            {/* <Image
              src={courseImg}
              alt="courseImg"
              width={600}
              height={500}
              className="w-full h-auto lg:h-40 md:w-[290px] xl:w-[178px] object-cover rounded-2xl"
            /> */}
            <Image
              src="/course1.svg"
              alt="courseImg"
              width={600}
              height={500}
              className="w-full h-auto lg:h-48 md:w-[290px] xl:w-[252px] object-cover rounded-2xl"
            />

            {/* Course Details */}
            <div className="flex flex-col gap-2 items-start ">
              <p className="font-semibold text-lg leading-tight">
                Bachelor of Engineering (Honors) - BE(Hons)
              </p>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-x-10 gap-3 text-nowrap w-full">
                {applicationDetails.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Image
                      src={item.src}
                      width={18}
                      height={18}
                      alt={item.alt}
                    />
                    <p className="text-sm">{item.text}</p>
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
