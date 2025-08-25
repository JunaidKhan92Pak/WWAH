import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserData";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

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
  applicationStatus?: number;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  banner?: string;
  logo?: string;
  ScholarshipId: string;
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
          left: "calc(50% / " + statusSteps.length + ")",
          right: "calc(50% / " + statusSteps.length + ")",
        }}
      ></div>

      {/* Progress line */}
      <div
        className="absolute top-4 left-0 h-1 bg-red-600 z-0"
        style={{
          left: "calc(50% / " + statusSteps.length + ")",
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
  // Using the store with proper destructuring
  const store = useUserStore();
  const { user } = store;

  console.log("Debug - user:", user);

  // Access loading state for confirmed applications
  const loadingConfirmedApplications =
    store.loadingConfirmedApplications || false;

  // Access only confirmed scholarships from the store's confirmed state
  const confirmedScholarshipsMap = store.confirmedScholarshipCourses || {};
  const confirmedCoursesArray: AppliedScholarshipCourse[] = Object.values(
    confirmedScholarshipsMap
  );
  console.log("confirmedScholarshipsMap daata", confirmedScholarshipsMap);
  // Fetch confirmed scholarships when component mounts
  useEffect(() => {
    if (
      user?._id &&
      !loadingConfirmedApplications &&
      confirmedCoursesArray.length === 0
    ) {
      console.log("Fetching confirmed scholarships for user:", user._id);
      store.fetchConfirmedScholarshipCourses(user._id);
    }
  }, [user?._id]); // Remove store from dependencies to prevent infinite loop

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

  console.log("Debug - Confirmed courses array:", confirmedCoursesArray);
  console.log("Debug - Confirmed scholarships map:", confirmedScholarshipsMap);
  console.log(
    "Debug - Loading confirmed applications:",
    loadingConfirmedApplications
  );

  if (loadingConfirmedApplications) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading your confirmed scholarships...
          </p>
        </div>
      </div>
    );
  }

  if (confirmedCoursesArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src="/frame.png"
            alt="No Applications"
            width={70}
            height={70}
          />{" "}
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Apply to a scholarship to see your application status here{" "}
          </h3>
          <Link href="/scholarships">
            <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Browse Scholarships
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto">
        <div className="flex w-full relative">
          {/* Confirmed Scholarship cards */}
          <div className="space-y-4 w-full">
            {confirmedCoursesArray.map(
              (application: AppliedScholarshipCourse, index: number) => (
                <div
                  key={application._id}
                  className="bg-[#FDF3E8] rounded-xl border border-gray-200 overflow-hidden pb-4"
                >
                  {/* Application Header */}
                  <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-white rounded-md px-3 py-1">
                      <span className="text-sm font-medium text-gray-600">
                        Application No. {index + 1}
                      </span>
                      {/* <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Confirmed
                      </span> */}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4">
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
                        {/* Logo Overlay - NEW ADDITION */}
                        <div className="absolute bottom-3 left-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-300 p-1 shadow-md">
                          <Image
                            unoptimized
                            src={application.logo || "/default-logo.png"}
                            alt="University Logo"
                            width={44}
                            height={44}
                            className="rounded-full object-contain w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {application.scholarshipName}
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                          {application.courseName}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2  gap-3 text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default AppliedScholarship;
