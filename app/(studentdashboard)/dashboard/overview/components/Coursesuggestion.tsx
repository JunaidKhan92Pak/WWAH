import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// const courses = [
//   {
//     id: 1,
//     title: "Bachelor of Engineering (Honors) - BE(Hons)",
//     location: "New Zealand",
//     intake: "2024",
//     duration: "4 Years",
//     fee: "$ 53,122",
//     image: "/course1.svg",
//   },
//   {
//     id: 2,
//     title: "Bachelor of Engineering (Honors) - BE(Hons)",
//     location: "New Zealand",
//     intake: "2024",
//     duration: "4 Years",
//     fee: "$ 53,122",
//     image: "/course2.svg",
//   },
//   {
//     id: 3,
//     title: "MBA - Master of Business Administration",
//     location: "Canada",
//     intake: "2024",
//     duration: "1.5 Years",
//     fee: "$ 53,122",
//     image: "/course3.svg",
//   },
// ];

const Coursesuggestion = () => {
  return (
    <>
      {" "}
      <div>
        <div className="relative w-full h-[250px] flex items-center justify-center border border-gray-200 rounded-xl">
          {/* Blurred Dummy Card in Background */}
          <div className="absolute inset-0">
            <div className=" opacity-80 blur-sm">
              <div
                className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-row gap-2 flex-shrink-0 
                 bg-white rounded-xl p-2 md:p-4 overflow-hidden border border-gray-200 opacity-80 pointer-events-none"
              >
                <div className="bg-white px-0 py-2 rounded-lg overflow-hidden mt-2">
                  <div className="flex">
                    <div className="relative md:w-[200px] h-[150px] rounded-xl overflow-hidden">
                      <Image
                        src="/bg-usa.png"
                        alt="Dummy Banner"
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>

                    <div className="flex-1 p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[12px] font-semibold">
                            Scholarship Name
                          </p>
                          <p className="text-[12px]">Course Name</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[12px]">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/location.svg"
                            alt="Location Icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-gray-600">Country</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/clock.svg"
                            alt="Duration Icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-gray-600">Duration</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Image
                            src="/lang.svg"
                            alt="Language Icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-gray-600">Language</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src="/ielts/Dollar.svg"
                          alt="University Icon"
                          width={16}
                          height={16}
                        />
                        <span className="text-gray-600 text-[12px]">
                          University
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src="/vectoruni.svg"
                          alt="Scholarship Type Icon"
                          width={16}
                          height={16}
                        />
                        <span className="text-gray-600 text-[12px]">
                          Scholarship Type
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/calender.svg"
                          alt="Deadline Icon"
                          width={16}
                          height={16}
                        />
                        <span className="text-gray-600 text-[12px]">
                          Deadline
                        </span>
                      </div>
                    </div>
                    <Button className=" bg-red-600 px-6">hello</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay Message */}
          <div className="flex flex-col items-center justify-center h-[250px] text-center relative z-10 w-full">

            <Link href="/dashboard/completeapplication">
              <button className="px-4 py-2 bg-[#C7161E] text-[14px] text-white rounded-full hover:bg-red-700">
                Complete Your Profile{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coursesuggestion;
