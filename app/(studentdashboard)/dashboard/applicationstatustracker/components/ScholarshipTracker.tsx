import React from "react";
import { useUserStore } from "@/store/useUserData";
import Image from "next/image";
// import CircularProgress from "../../overview/components/CircularProgress";
// import CircularProgress from "./CircularProgress";

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
  applicationStatus?: number; // Added this field
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  banner?: string;
}

// Status mapping based on your schema (1-7)
const statusSteps = [
  { id: 1, label: "Complete Application", icon: "✓" },
  { id: 2, label: "In Process", icon: "✓" },
  { id: 3, label: "Applied", icon: "✓" },
  { id: 4, label: "Offer Letter Received", icon: "4" },
  { id: 5, label: "Visa Granted", icon: "5" },
  { id: 6, label: "Accommodation Booked", icon: "6" },
  { id: 7, label: "Airport Pickup Booked", icon: "7" },
];

// Status Tracker Component
const StatusTracker = ({ currentStatus }: { currentStatus: number }) => {
  return (
    <div className="mt-4 px-2 relative">
      {/* Background line */}
      <div
        className="absolute top-4 left-0 h-1 bg-gray-300 z-0"
        style={{
          left: "calc(50% / " + statusSteps.length + ")", // start from first step center
          right: "calc(50% / " + statusSteps.length + ")", // end at last step center
        }}
      ></div>

      {/* Progress line */}
      <div
        className="absolute top-4 left-0 h-1 bg-red-600 z-0"
        style={{
          left: "calc(50% / " + statusSteps.length + ")", // start at first step center
          width: `calc((((${currentStatus - 1}) / (${
            statusSteps.length - 1
          })) * 100%) - (50% / ${statusSteps.length}))`,
        }}
      ></div>

      {/* Steps */}
      <div className="flex items-center justify-between relative z-10">
        {statusSteps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                step.id <= currentStatus ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              {step.id <= currentStatus ? "✓" : step.id}
            </div>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex items-start justify-between mt-3">
        {statusSteps.map((step) => (
          <div key={step.id} className="flex-1 text-center">
            <span
              className={`text-xs font-medium ${
                step.id <= currentStatus ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Applied Scholarships
          </h3>
          <p className="text-gray-500">
            You haven&apos;t applied for any scholarships yet.
          </p>
        </div>
      </div>
    );
  }

  // const getStatusColor = (status?: string): string => {
  //   switch (status?.toLowerCase()) {
  //     case "approved":
  //       return "bg-green-100 text-green-800";
  //     case "rejected":
  //       return "bg-red-100 text-red-800";
  //     case "pending":
  //     default:
  //       return "bg-orange-100 text-orange-800";
  //   }
  // };

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

  console.log(appliedCoursesArray, "show sch data");

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
              <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-0"></div>

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
            <div className="space-y-4 w-full">
              {appliedCoursesArray.map(
                (application: AppliedScholarshipCourse, index: number) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Application Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Application No. {index + 1}
                      </h3>
                      <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                        View
                      </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Image */}
                        <div className="relative w-full lg:w-[300px] h-[200px] rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              application.banner ||
                              "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={`${application.scholarshipName} banner`}
                            fill
                            className="object-cover"
                            sizes="300px"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {application.scholarshipName}
                          </h2>
                          <p className="text-lg text-gray-700 mb-4">
                            {application.courseName}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
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

                            <div className="flex items-center gap-2">
                              <Image
                                src="/lang.svg"
                                alt="Language Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                {application.language || "Not specified"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Image
                                src="/ielts/Dollar.svg"
                                alt="University Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                {application.universityName || "Not specified"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Image
                                src="/vectoruni.svg"
                                alt="Scholarship Type Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                {application.scholarshipType || "Not specified"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Image
                                src="/calender.svg"
                                alt="Deadline Icon"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-600">
                                Deadline: {formatDate(application.deadline)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Tracker */}
                      <StatusTracker
                        currentStatus={application.applicationStatus || 1}
                      />
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
