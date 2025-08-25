"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import { motion } from "framer-motion";

interface Course {
  _id: string;
  course_title?: string;
  countryname?: string;
  intake?: string;
  duration?: string;
  annual_tuition_fee?: {
    currency?: string;
    amount?: number;
  };
  application_fee: string;
  application_deadline?: string;
  universityData?: {
    university_name?: string;
    universityImages?: {
      banner?: string;
      logo?: string;
    };
  };
}

const ApplyingSection: React.FC = () => {
  const [detailedAppliedCourses, setDetailedAppliedCourses] = useState<
    Course[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Application status steps matching the screenshot
  const applicationSteps = [
    {
      step: 1,
      label: "Complete Application",
      shortLabel: "Complete Application",
    },
    { step: 2, label: "In Process", shortLabel: "In Process" },
    { step: 3, label: "Applied", shortLabel: "Applied" },
    {
      step: 4,
      label: "Offer Letter Received",
      shortLabel: "Offer Letter Received",
    },
    { step: 5, label: "Visa Granted", shortLabel: "Visa Granted" },
    {
      step: 6,
      label: "Accommodation Booked",
      shortLabel: "Accommodation Booked",
    },
    {
      step: 7,
      label: "Airport Pickup Booked",
      shortLabel: "Airport Pickup Booked",
    },
  ];

  // Get data from the store
  const {
    user,
    appliedCourses,
    appliedCourseIds,
    loadingAppliedCourses,
    fetchAppliedCourses,
    // removeAppliedCourse,
  } = useUserStore();
console.log(appliedCourses, "appliedCourses from store");
  // Function to fetch detailed course information from the API
  const fetchDetailedAppliedCourses = async (courseIds: string[]) => {
    if (courseIds.length === 0) {
      setDetailedAppliedCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get application data from the store
      const coursesDataForAPI = courseIds.map((courseId) => {
        const appliedCourse = appliedCourses[courseId];
        return {
          courseId,
          applicationStatus: appliedCourse?.applicationStatus || 1,
          createdAt: appliedCourse?.createdAt,
          updatedAt: appliedCourse?.updatedAt,
        };
      });

      const apiUrl = `/api/getfavouritecourse?ids=${encodeURIComponent(
        JSON.stringify(coursesDataForAPI)
      )}&type=applied`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log(response, "Response from API coursesDta");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        const detailedCourses = data.appliedCourses || [];
        setDetailedAppliedCourses(detailedCourses);
      } else {
        console.error("API returned success: false", data);
        setError(data.message || "Failed to load detailed course information");
        toast.error("Failed to load detailed course information", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching detailed courses:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast.error("Failed to load course details", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile and applied courses on component mount
  useEffect(() => {
    if (!user?.appliedCourses || appliedCourseIds.length === 0) {
      fetchAppliedCourses();
    }
  }, []);

  // Fetch detailed course information when applied course IDs change
  useEffect(() => {
    // console.log("Applied course IDs changed:", appliedCourseIds);

    if (appliedCourseIds.length > 0) {
      fetchDetailedAppliedCourses(appliedCourseIds);
    } else {
      setDetailedAppliedCourses([]);
      setLoading(false);
    }
  }, [appliedCourseIds]);

  // Get application details for a specific course (only schema fields)
  const getApplicationDetails = (courseId: string) => {
    return appliedCourses[courseId] || null;
  };

  // Loading state
  if (loading || loadingAppliedCourses) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E]"></div>
          <span className="ml-2">Loading your applications...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500 text-center">
            <p className="mb-4">Error: {error}</p>
            <Button
              onClick={() => fetchAppliedCourses()}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No applied courses state
  if (!appliedCourseIds || appliedCourseIds.length === 0) {
    return (
      <div className="relative">
        {/* Blur Overlay */}
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-xl flex flex-col items-center justify-center p-8 space-y-4">
          <Image
            src="/frame.png"
            alt="No Applications"
            width={70}
            height={70}
          />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Apply to a course to see your application status here{" "}
          </h3>

          <Link href="/coursearchive">
            <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Placeholder content */}
        <div className="opacity-30">
          <p className="font-semibold text-lg md:text-xl mb-4">
            You are applying for:
          </p>
          <div className="bg-gray-100 p-4 rounded-2xl">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if we have IDs but no detailed courses yet
  if (
    appliedCourseIds.length > 0 &&
    detailedAppliedCourses.length === 0 &&
    loading
  ) {
    return (
      <div className="relative">
        {/* Blurred background */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-gray-100 z-0" />

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center h-[250px] p-8 z-10 relative text-center">
          <p className="font-semibold text-lg md:text-xl mb-2">
            Loading Course Details...
          </p>
          <p className="text-gray-600 mb-4">
            Please wait while we fetch your application details.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E] mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        {detailedAppliedCourses.map((course, index) => {
          const applicationDetails = getApplicationDetails(course._id);
          const currentStep = applicationDetails?.applicationStatus || 1;

          return (
            <div
              key={course._id || index}
              className="bg-[#FCE7D280] rounded-2xl px-4 py-2 shadow-sm border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 bg-white py-1 px-3 rounded-md">
                  <span className="text-sm font-medium text-gray-600">
                    Application No. {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-gray-300"
                  >
                    <Link href={`/courses/${course._id}`}>View</Link>{" "}
                  </Button>
                </div>
              </div>

              {/* Course Content */}
              <div className="flex flex-col  gap-6">
                {/* Left Section: Course Image and Info */}
                <div className="flex">
                  <div className="flex gap-4">
                    <div className="relative md:w-[230px] h-[180px] rounded-xl overflow-hidden">
                      <Image
                        src={
                          course.universityData?.universityImages?.banner ||
                          `/course-${index + 1}.png`
                        }
                        alt="Course Banner"
                        width={200}
                        height={150}
                        className="w-[230px] h-[180px] object-cover"
                      />
                      <div className="absolute top-4 left-0">
                        <div className="bg-gradient-to-t from-white to-transparent opacity-100 w-[70%]">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                course.universityData?.universityImages?.logo ||
                                "/logo.png"
                              }
                              alt="University Logo"
                              className="w-6 h-6 object-cover object-center rounded-full aspect-square"
                            />
                            <p className="text-sm leading-tight pr-1">
                              {course.universityData?.university_name ||
                                "University"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" space-y-3">
                      <div className="w-[80%]">
                        <h3 className="font-semibold text-lg leading-tight mb-1">
                          {course.course_title || "Course Title Not Available"}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        {" "}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Image
                            src="/location.svg"
                            width={14}
                            height={14}
                            alt="Location"
                          />
                          <span>
                            {course.countryname || "Country not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/DashboardPage/intake.svg"
                            width={14}
                            height={14}
                            alt="Intake"
                          />
                          <span className="text-gray-600">
                            {course.intake || "2024"}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/money.svg"
                            width={14}
                            height={14}
                            alt="Fee"
                          />
                          <span className="text-gray-600">
                            {course.annual_tuition_fee?.currency || "$"}{" "}
                            {course.annual_tuition_fee?.amount || "83,122"}
                            <span></span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/clock.svg"
                            width={14}
                            height={14}
                            alt="Duration"
                          />
                          <span className="text-gray-600">
                            {course.duration || "4 Years"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-600">
                          $&nbsp;Application Fee:
                        </span>
                        <div>
                          {" "}
                          <span className="text-gray-600">
                            {course.application_fee || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/DashboardPage/deadline.svg"
                            width={14}
                            height={14}
                            alt="Deadline"
                          />
                          <span className="text-gray-600">Deadline:</span>
                        </div>

                        <span className="text-gray-600">
                          {course.application_deadline || "February 2025"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-[#FCE7D280] rounded-xl p-4 shadow-sm">
                    {/* Steps Circles */}
                    <div className="flex justify-between items-center mb-4">
                      {applicationSteps.map((step, stepIndex) => {
                        const isActive = currentStep >= step.step;
                        const isCompleted = currentStep > step.step;
                        const isCurrent = currentStep === step.step;

                        return (
                          <div
                            key={step.step}
                            className="flex flex-col items-center relative px-4"
                          >
                            {/* Animate the circle */}
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                delay: stepIndex * 0.4,
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-2 z-10
                ${
                  isCompleted
                    ? "bg-red-600 text-white"
                    : isCurrent
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
                            >
                              {isCompleted ? "✓" : step.step}
                            </motion.div>

                            {/* Connector line */}
                            {stepIndex < applicationSteps.length - 1 && (
                              <motion.div
                                className="absolute top-4 left-4 h-0.5 -z-5"
                                initial={{ width: 0 }}
                                animate={{ width: "calc(100% + 5rem)" }}
                                transition={{
                                  delay: stepIndex * 0.15,
                                  duration: 0.2,
                                }}
                                style={{
                                  backgroundColor: isActive
                                    ? "#DC2626"
                                    : "#e5e7eb",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs text-center ">
                      {applicationSteps.map((step, stepIndex) => (
                        <motion.div
                          key={step.step}
                          className="flex-1 text-wrap"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: stepIndex * 0.4 }}
                        >
                          <div className="leading-tight">{step.shortLabel}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more courses button */}
    </div>
  );
};

export default ApplyingSection;
