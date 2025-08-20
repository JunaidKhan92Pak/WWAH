import React from "react";
import { useUserStore } from "@/store/useUserData";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Type definitions for better TypeScript support
interface AppliedScholarshipCourse {
  _id: string;
  scholarshipName: string;
  hostCountry: string;
  courseName: string;
  duration: string;
  language: string;
  universityName: string;
  scholarshipType: string;
  deadline: string;
  status?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  banner?: string; // Added banner property like in backup
}

const AppliedScholarship = () => {
  // Using the store with proper destructuring - matching backup pattern
  const store = useUserStore();
  const { user } = store;
  console.log("Debug - user:", user);

  // Safely access the loading state - matching backup pattern
  const loadingApplications =
    (store as { loadingApplications?: boolean }).loadingApplications || false;

  // ✅ FIXED: Use user.appliedScholarshipCourses directly like in backup
  const appliedCoursesArray: AppliedScholarshipCourse[] =
    user?.appliedScholarshipCourses || [];

  if (loadingApplications) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applied scholarships...</p>
        </div>
      </div>
    );
  }

  if (appliedCoursesArray.length === 0) {
    return (
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
            <p className="font-semibold text-lg md:text-xl mb-2">
              No Applied Scholarships Yet
            </p>
            <p className="text-gray-600 mb-4">
              Start your journey by applying to your first scholarship!
            </p>
            <Link href="/scholarships">
              <button className="px-5 py-2 bg-[#C7161E] text-white rounded-full hover:bg-red-700">
                Browse Scholarships
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.log(error);
      return "Invalid date";
    }
  };

  return (
    <div className="p-3 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Applied Scholarships
        </h1>

        <div className="flex w-full relative">
          {!appliedCoursesArray || appliedCoursesArray.length === 0 ? (
            // Empty state with blur effect
            <div className="relative w-full">
              {/* Blurred background */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10 z-0"></div>

              {/* Centered message */}
              <div className="flex flex-col items-center justify-center h-[250px] text-center relative z-10 w-full">
                <p className="font-semibold text-lg md:text-xl mb-2">
                  No Applied Scholarships Yet
                </p>
                <p className="text-gray-600 mb-4">
                  Start your journey by applying to your first scholarship!
                </p>
                <button className="px-5 py-2 bg-[#C7161E] text-white rounded-full hover:bg-red-700">
                  Browse Scholarships
                </button>
              </div>
            </div>
          ) : (
            // Mapped scholarship cards when data exists
            <div
              className="flex overflow-x-auto space-x-3 hide-scrollbar"
              style={{
                scrollbarWidth: "thin",
                msOverflowStyle: "none",
              }}
            >
              {appliedCoursesArray.map(
                (application: AppliedScholarshipCourse) => (
                  <div
                    key={application._id}
                    className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-row gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-4 overflow-hidden border border-gray-200"
                  >
                    <div className="bg-white px-0 py-2 rounded-lg overflow-hidden mt-2">
                      <div className="flex">
                        <div className="relative md:w-[200px] h-[150px] rounded-xl overflow-hidden">
                          <Image
                            src={
                              application.banner ||
                              "https://via.placeholder.com/200x150?text=No+Image"
                            }
                            alt={`${application.scholarshipName} banner`}
                            fill
                            className="object-cover"
                            sizes="192px"
                          />
                        </div>

                        <div className="flex-1 p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[12px] font-semibold">
                                {application.scholarshipName}
                              </p>
                              <p className="text-[12px]">
                                {application.courseName}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[12px]">
                            <div className="flex items-center gap-2">
                              <Image
                                src="/location.svg"
                                alt="Location Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                {application.hostCountry || "Not specified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/clock.svg"
                                alt="Duration Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                {application.duration || "Not specified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Image
                                src="/lang.svg"
                                alt="Language Icon"
                                width={16}
                                height={16}
                                className="w-3 h-3"
                              />
                              <span className="text-gray-600">
                                {application.language || "Not specified"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Image
                              src="/ielts/Dollar.svg"
                              alt="University Icon"
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-600 text-[12px]">
                              {application.universityName || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Image
                              src="/vectoruni.svg"
                              alt="Scholarship Type Icon"
                              width={16}
                              height={16}
                              className="w-3 h-3"
                            />
                            <span className="text-gray-600 text-[12px]">
                              Scholarship Type:{" "}
                              {application.scholarshipType || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/calender.svg"
                              alt="Deadline Icon"
                              width={16}
                              height={16}
                              className="w-3 h-3"
                            />
                            <span className="text-gray-600 text-[12px]">
                              Deadline: {formatDate(application.deadline)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-evenly min-w-[140px]">
                          <div className="flex gap-1">
                            <button className="px-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-[14px] font-medium">
                              <a href={`/scholarships/${application._id}`}>
                                View
                              </a>
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                              <Image
                                src="/delete.svg"
                                alt="Delete Icon"
                                width={16}
                                height={16}
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                          <div className="flex flex-col items-center mt-4">
                            <p className="text-[12px] font-semibold mb-2 text-center w-4/5">
                              Application Success Chances
                            </p>
                            <CircularProgress progress={75} />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[12px] font-medium px-2 py-1 rounded-lg text-white bg-red-600">
                            Current Status:
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            ●{" "}
                            {application.status ||
                              "Awaiting Course Confirmation"}
                          </span>
                        </div>
                        {application.appliedAt && (
                          <div className="text-[12px] text-gray-500">
                            Applied: {formatDate(application.appliedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedScholarship;
