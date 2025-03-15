import React from 'react'
import Image from "next/image"; // Import the Image component
import CircularProgress from "./CircularProgress"; // Import CircularProgress component

const ApplyingSection = () => {
    return (
      <>
        <div>
          <p className="font-semibold text-lg md:text-xl">
            You are applying for:
          </p>

          <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between  p-4  rounded-2xl gap-4 md:gap-0">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-0 ">
              <div className="relative">
                <Image
                  src="/course1.svg"
                  alt="courseImg"
                  width={600}
                  height={500}
                  className="w-[350px] h-auto md:h-44 xl:h-48 sm:w-[251px] xl:w-96 object-cover rounded-2xl"
                />
              </div>

              <div className="p-2 md:p-4">
                <h5 className=" text-sm md:text-lg leading-tight">
                  Bachelor of Engineering (Honors) - BE(Hons)
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
                  <div className="flex items-center gap-1">
                    <Image
                      src="/DashboardPage/deadline.svg"
                      width={14}
                      height={14}
                      alt="Deadline"
                    />
                    <p className="text-sm">Deadline:</p>
                  </div>
                  <p className="text-sm">February 2025</p>
                </div>
              </div>
            </div>
            {/* Right Section with CircularProgress */}
            <div className="flex flex-col items-center justify-evenly">
              <p className="font-bold text-sm leading-tight mb-2">
                Application Success chances
              </p>
              <CircularProgress progress={80} />{" "}
              {/* Pass dynamic progress if needed */}
            </div>
          </div>
        </div>
      </>
    );
}

export default ApplyingSection
