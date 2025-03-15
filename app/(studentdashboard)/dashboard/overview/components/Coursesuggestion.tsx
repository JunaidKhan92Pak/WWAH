import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    title: "Bachelor of Engineering (Honors) - BE(Hons)",
    location: "New Zealand",
    intake: "2024",
    duration: "4 Years",
    fee: "$ 53,122",
    image: "/course1.svg",
  },
  {
    id: 2,
    title: "Bachelor of Engineering (Honors) - BE(Hons)",
    location: "New Zealand",
    intake: "2024",
    duration: "4 Years",
    fee: "$ 53,122",
    image: "/course2.svg",
  },
  {
    id: 3,
    title: "MBA - Master of Business Administration",
    location: "Canada",
    intake: "2024",
    duration: "1.5 Years",
    fee: "$ 53,122",
    image: "/course3.svg",
  },
];

const Coursesuggestion = () => {
  return (
    <>
      {" "}
      <div className="bg-gray-100 w-full rounded-xl  p-2 md:p-4">
        <p className="font-semibold text-lg md:text-xl">Suggested Courses</p>
        <div className="relative w-full sm:w-full flex justify-center overflow-hidden">
          <div
            className=" w-[250px] sm:w-full  flex  overflow-x-auto space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                className="relative w-[250px] md:w-[100%] lg:w-[85%] flex flex-col md:flex-row gap-4 flex-shrink-0 bg-white rounded-3xl  p-2 md:p-4 overflow-hidden"
              >
                <Image
                  src="/course1.svg"
                  alt="courseImg"
                  width={400}
                  height={250}
                  className=" h-auto md:h-48 w-[259px] md:w-[240px]  object-cover rounded-2xl"
                />
                <div className="flex flex-col justify-between">
                  <h5 className="  text-sm md:text-lg leading-tight">
                    {course.title}
                  </h5>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/location.svg"
                        width={20}
                        height={20}
                        alt="Location"
                      />
                      <p className="text-sm  truncate">New Zealand</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/DashboardPage/intake.svg"
                        width={20}
                        height={20}
                        alt="intake"
                      />
                      <p className="text-sm">2024</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/clock.svg"
                        width={20}
                        height={20}
                        alt="Duration"
                      />
                      <p className="text-sm">4 Years</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/money.svg"
                        width={20}
                        height={20}
                        alt="Tuition Fee"
                      />
                      <p className="text-sm">$ 53,122</p>
                    </div>
                  </div>
                  <Button className="text-white bg-[#C7161E] hover:bg-[#C7161E] w-full mt-2">
                    Course Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Coursesuggestion;
