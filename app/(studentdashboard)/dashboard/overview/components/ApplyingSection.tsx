"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/utils/authHelper";
import toast from "react-hot-toast";

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
  application_deadline?: string;
  successChance?: number;
  universityData?: {
    university_name?: string;
    universityImages?: {
      banner?: string;
      logo?: string;
    };
  };
}

const ApplyingSection: React.FC = () => {
  // Change this to store course IDs as strings, not course objects
  const [appliedCourseIds, setAppliedCourseIds] = useState<string[]>([]);
  const [detailedAppliedCourses, setDetailedAppliedCourses] = useState<
    Course[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // console.log("ApplyingSection component rendered", appliedCourseIds);

  // Function to fetch applied course IDs (basic data with IDs)
  const fetchAppliedCourses = async () => {
    const token = getAuthToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applied courses");
      }

      const data = await response.json();
      // console.log("Applied courses data:", data);

      // Extract the course IDs array from the response
      const appliedCoursesData = data.data?.appliedCourses || [];
      // console.log("Applied course IDs:", appliedCoursesData);
      // console.log("Number of applied courses:", appliedCoursesData.length);

      // Store the course IDs
      setAppliedCourseIds(appliedCoursesData);
    } catch (error: unknown) {
      console.error("Error fetching applied courses:", error);
      setError(error instanceof Error ? error.message : String(error));
      toast.error("Failed to fetch applied courses", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch detailed course information for applied courses
  const fetchDetailedAppliedCourses = async (courseIds: string[]) => {
    if (courseIds.length === 0) {
      setDetailedAppliedCourses([]);
      return;
    }

    // console.log("=== DETAILED COURSE FETCH DEBUG ===");
    // console.log("Fetching detailed applied courses for IDs:", courseIds);
    // console.log("Current appliedCourseIds state:", courseIds);

    try {
      const idsString = courseIds.join(",");
      const apiUrl = `/api/getfavouritecourse?ids=${encodeURIComponent(
        idsString
      )}&type=applied`;

      // console.log("API URL:", apiUrl);
      // console.log("Making API request...");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("Response status:", response.status);
      // console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      // console.log("=== DETAILED API RESPONSE ===");
      // console.log("Full API Response:", JSON.stringify(data, null, 2));
      // console.log("Response success:", data.success);
      // console.log("Applied courses in response:", data.appliedCourses);
      // console.log(
      //   "Number of courses returned:",
      //   data.appliedCourses?.length || 0
      // );

      if (data.success) {
        const detailedCourses = data.appliedCourses || [];
        // console.log("=== DETAILED COURSES ===");
        detailedCourses.forEach((course: Course, index: number) => {
          console.log(`Detailed Course ${index + 1}:`, {
            id: course._id,
            title: course.course_title,
            country: course.countryname,
            intake: course.intake,
            duration: course.duration,
            fee: course.annual_tuition_fee,
            deadline: course.application_deadline,
            universityData: course.universityData,
          });
        });

        // Add success chances to detailed courses (since we don't have them from backend)
        const coursesWithSuccessChance = detailedCourses.map(
          (course: Course) => ({
            ...course,
            successChance: 75, // Default success chance
          })
        );

        // console.log("=== COURSES WITH SUCCESS CHANCE ===");
        // console.log(
        //   "Final courses with success chance:",
        //   coursesWithSuccessChance
        // );
        setDetailedAppliedCourses(coursesWithSuccessChance);

        if (coursesWithSuccessChance.length === 0) {
          console.warn(
            "No detailed courses found! This might indicate an ID mismatch."
          );
        }
      } else {
        console.error("API returned success: false", data);
        setError(data.message || "Failed to load detailed course information");
        toast.error("Failed to load detailed course information", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error: unknown) {
      console.error("=== ERROR FETCHING DETAILED COURSES ===");
      console.error("Error details:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Error message:", String(error));
      }
      toast.error("Failed to load course details", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  // Fetch applied courses on component mount
  useEffect(() => {
    fetchAppliedCourses();
  }, []);

  // Fetch detailed course information when applied course IDs change
  useEffect(() => {
    // console.log("=== USE EFFECT TRIGGER ===");
    // console.log("Applied course IDs length:", appliedCourseIds.length);
    // console.log("Applied course IDs data:", appliedCourseIds);

    if (appliedCourseIds.length > 0) {
      // console.log("Course IDs for detailed fetch:", appliedCourseIds);

      // Add a small delay to ensure state is fully updated
      setTimeout(() => {
        fetchDetailedAppliedCourses(appliedCourseIds);
      }, 100);
    } else {
      console.log("No applied course IDs available for detailed fetch");
      setDetailedAppliedCourses([]);
    }
  }, [appliedCourseIds]);

  // Function to remove course from applied courses
  // Alternative: Using the DELETE endpoint (more RESTful)
  const removeFromAppliedCourses = async (courseId: string) => {
    console.log("=== REMOVING COURSE (DELETE METHOD) ===");
    console.log("Course ID to remove:", courseId);

    const token = getAuthToken();

    if (!token) {
      toast.error("Please login to manage your applications!", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const loadingToast = toast.loading("Removing course...", {
      position: "top-center",
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: courseId.toString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to remove course: ${response.status} - ${errorData}`
        );
      }

      const data = await response.json();
      console.log("Remove response:", data);

      if (data.success) {
        const updatedAppliedCourseIds = data.data?.appliedCourses || [];

        // Update states
        setAppliedCourseIds(updatedAppliedCourseIds);
        setDetailedAppliedCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );

        toast.dismiss(loadingToast);
        toast.success("Course removed from applications!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (error: unknown) {
      console.error("Error removing course:", error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to remove course: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // Loading state
  if (loading) {
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
              onClick={fetchAppliedCourses}
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
    // console.log("No applied course IDs to display");
    return (
      <div className="relative">
        {/* Blur Overlay */}
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-xl flex flex-col items-center justify-center p-8">
          <h3 className="text-lg font-semibold mb-4 text-center">
            No Course Applications Yet
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Start your journey by applying to your first course!
          </p>
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

  // Use detailed courses for rendering
  const coursesToRender = detailedAppliedCourses;

  // Log final courses before rendering
  // console.log("=== RENDERING DECISION ===");
  // console.log("Detailed courses available:", detailedAppliedCourses.length);
  // console.log("Applied course IDs:", appliedCourseIds.length);
  // console.log(
  //   "Courses to render:",
  //   coursesToRender.map((course) => ({
  //     id: course._id,
  //     title: course.course_title,
  //     hasUniversityData: !!course.universityData,
  //   }))
  // );

  // Show loading state if we have IDs but no detailed courses yet
  if (appliedCourseIds.length > 0 && detailedAppliedCourses.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E]"></div>
          <span className="ml-2">Loading course details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="font-semibold text-lg md:text-xl mb-4">
        You are applying for ({appliedCourseIds.length} course
        {appliedCourseIds.length !== 1 ? "s" : ""}):
      </p>

      <div
        className="flex  overflow-x-auto space-x-3 hide-scrollbar"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
        }}
      >
        {" "}
        {coursesToRender.map((course, index) => (
          <div
            key={course._id || index}
            className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-row gap-2 flex-shrink-0 bg-white rounded-xl  p-2 md:p-4 overflow-hidden border border-gray-200 "
          >
            {/* Remove Button */}
            <button
              onClick={() => removeFromAppliedCourses(course._id)}
              className="absolute top-2 right-1 z-10 border border-gray-400 bg-white text-gray-400 hover:bg-red-600 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
              title="Remove from applications"
            >
              ×
            </button>

            {/* Left Section: Course Info */}
            <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
              <div>
                <div className="relative  md:w-[150px] h-[150px] rounded-xl overflow-hidden">
                  <Image
                    src={
                      course.universityData?.universityImages?.banner ||
                      `/course-${index + 1}.png`
                    }
                    alt="Course Banner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-0">
                    <div className=" bg-gradient-to-t from-white to-transparent opacity-100 w-[70%] ">
                      <div className="flex items-center gap-2 ">
                        <img
                          src={
                            course.universityData?.universityImages?.logo ||
                            "/logo.png"
                          }
                          alt="University Logo"
                          className="w-6 h-6 object-cover  object-center rounded-full aspect-square"
                        />
                        <p className="text-sm leading-tight pr-1">
                          {course.universityData?.university_name ||
                            "University"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Image
                      src="/hearti.svg"
                      alt="favorite"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#C7161E]"
                  />
                  <label className="text-sm">
                    Yes, I want to apply for this course.
                  </label>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {/* University logo and name */}

                {/* Course title */}
                <p className="text-sm font-semibold">
                  {course.course_title || "Course Title Not Available"}
                </p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Image
                      src="/location.svg"
                      width={16}
                      height={16}
                      alt="Location"
                    />
                    <span>{course.countryname || "Country not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/DashboardPage/intake.svg"
                      width={16}
                      height={16}
                      alt="Intake"
                    />
                    <span>{course.intake || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/clock.svg"
                      width={16}
                      height={16}
                      alt="Duration"
                    />
                    <span>{course.duration || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src="/money.svg" width={16} height={16} alt="Fee" />
                    <span>
                      {course.annual_tuition_fee?.currency || "$"}{" "}
                      {course.annual_tuition_fee?.amount || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/DashboardPage/deadline.svg"
                      width={14}
                      height={14}
                      alt="Deadline"
                    />
                    <span>Deadline:</span>
                  </div>
                  <span>{course.application_deadline || "Not specified"}</span>
                </div>

                {/* Checkbox */}
              </div>
            </div>

            {/* Right Section: Success % + Button */}
            <div className="flex flex-col items-center justify-center min-w-[140px]">
              <p className="text-sm font-semibold mb-2 text-center w-4/5">
                Application Success Chances
              </p>
              <CircularProgress progress={course.successChance || 75} />
              {/* <Link
                href={`/courses/${course._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#C7161E] text-[#C7161E] hover:bg-[#C7161E] hover:text-white"
                >
                  View Details
                </Button>
              </Link> */}
            </div>
          </div>
        ))}
      </div>

      {/* Add more courses button */}
      <div className="mt-6 text-center">
        <Link href="/coursearchive">
          <Button
            variant="outline"
            className="border-[#C7161E] text-[#C7161E] hover:bg-[#C7161E] hover:text-white"
          >
            + Apply to More Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ApplyingSection;
