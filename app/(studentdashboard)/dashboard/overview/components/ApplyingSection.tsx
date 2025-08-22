"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import { useRouter } from "next/navigation";

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
  application_fee: string;
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

  // ✅ NEW: Modal state
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  // ✅ NEW: Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [courseToConfirm, setCourseToConfirm] = useState<string | null>(null);

  // ✅ NEW: Router for navigation
  const router = useRouter();

  // Helper function to get application step label
  const getApplicationStepLabel = (applicationStatus: number): string => {
    const steps = [
      { step: 1, label: "Application Started" },
      { step: 2, label: "Documents Prepared" },
      { step: 3, label: "Application Submitted" },
      { step: 4, label: "Under Review" },
      { step: 5, label: "Interview Scheduled" },
      { step: 6, label: "Decision Pending" },
      { step: 7, label: "Final Decision" },
    ];

    const step = steps.find((s) => s.step === applicationStatus);
    return step ? step.label : "Unknown Step";
  };

  const getApplicationProgress = (applicationStatus: number): number => {
    return Math.round((applicationStatus / 7) * 100);
  };

  // Get data from the store
  const {
    user,
    appliedCourses,
    appliedCourseIds,
    loadingAppliedCourses,
    fetchAppliedCourses,
    removeAppliedCourse,
    updateCourseConfirmation,
  } = useUserStore();

  console.log("ApplyingSection component rendered", {
    appliedCourseIds,
    appliedCoursesCount: Object.keys(appliedCourses).length,
    userAppliedCourses: user?.appliedCourses,
  });

  // Function to fetch detailed course information for applied courses
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

      console.log(response, "Response from API coursesDta");

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
    console.log("Applied course IDs changed:", appliedCourseIds);

    if (appliedCourseIds.length > 0) {
      fetchDetailedAppliedCourses(appliedCourseIds);
    } else {
      setDetailedAppliedCourses([]);
      setLoading(false);
    }
  }, [appliedCourseIds]);

  // ✅ UPDATED: Function to handle remove button click
  const handleRemoveButtonClick = async (courseId: string) => {
    const applicationDetails = getApplicationDetails(courseId);

    // If course is confirmed, show modal instead of removing
    if (applicationDetails?.isConfirmed) {
      setShowContactModal(true);
      return;
    }

    // If not confirmed, proceed with normal removal
    await handleRemoveCourse(courseId);
  };

  // Function to remove course from applied courses using the store
  const handleRemoveCourse = async (courseId: string) => {
    console.log("Removing course:", courseId);

    const loadingToast = toast.loading("Removing course...", {
      position: "top-center",
    });

    try {
      const success = await removeAppliedCourse(courseId);

      if (success) {
        // Remove from local state immediately for better UX
        setDetailedAppliedCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );

        toast.dismiss(loadingToast);
        toast.success("Course removed from applications!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        throw new Error("Failed to remove course");
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

  // ✅ NEW: Handle confirm button click - show modal
  const handleConfirmButtonClick = (courseId: string) => {
    console.log("Confirm button clicked for course:", courseId);
    setCourseToConfirm(courseId);
    setShowConfirmModal(true);
    console.log("Modal should be open now");
  };

  // ✅ UPDATED: Handle confirmation modal Yes click with redirect
  const handleConfirmYes = async () => {
    if (courseToConfirm) {
      await handleCourseConfirmation(courseToConfirm, true);
      // Redirect to complete application page after successful confirmation
      router.push("/dashboard/completeapplication");
    }
    setShowConfirmModal(false);
    setCourseToConfirm(null);
  };

  // ✅ NEW: Handle confirmation modal No click
  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setCourseToConfirm(null);
  };

  // Function to handle course confirmation
  const handleCourseConfirmation = async (
    courseId: string,
    isConfirmed: boolean
  ) => {
    console.log("Updating course confirmation:", { courseId, isConfirmed });

    const loadingToast = toast.loading(
      isConfirmed ? "Confirming course..." : "Updating course...",
      {
        position: "top-center",
      }
    );

    try {
      const success = await updateCourseConfirmation(courseId, isConfirmed);

      if (success) {
        toast.dismiss(loadingToast);
        toast.success(
          isConfirmed
            ? "Course confirmed successfully!"
            : "Course confirmation updated!",
          {
            duration: 2000,
            position: "top-center",
          }
        );
      } else {
        throw new Error("Failed to update course confirmation");
      }
    } catch (error: unknown) {
      console.error("Error updating course confirmation:", error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update confirmation: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  console.log("Detailed applied courses:", detailedAppliedCourses);

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
              No Course Applications Yet{" "}
            </p>
            <p className="text-gray-600 mb-4">
              Start your journey by applying to your first course!{" "}
            </p>
            <Link href="/coursearchive">
              <button className="px-5 py-2 bg-[#C7161E] text-white rounded-full hover:bg-red-700">
                Browse Scholarships
              </button>
            </Link>
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
      {/* Contact Advisor Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Course Confirmed</DialogTitle>
            <DialogDescription className="text-center pt-4">
              This course has been confirmed and cannot be removed. Please
              contact your WWAH advisor for any changes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowContactModal(false)}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ NEW: Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center text-center gap-6">
              <Image src="/spark.png" alt="Spark Icon" width={80} height={80} />
             <p className="text-[12px]">Are you sure you want to Confirm this course?</p>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleConfirmYes}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white px-8"
            >
              Yes
            </Button>
            <Button
              onClick={handleConfirmNo}
              variant="outline"
              className="px-8"
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="font-semibold text-lg md:text-xl mb-4">
        You are applying for Self-Financed admission ({appliedCourseIds.length}{" "}
        course
        {appliedCourseIds.length !== 1 ? "s" : ""}):
      </p>

      <div
        className="flex overflow-x-auto space-x-3 hide-scrollbar"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
        }}
      >
        {detailedAppliedCourses.map((course, index) => {
          const applicationDetails = getApplicationDetails(course._id);
          const isConfirmed = applicationDetails?.isConfirmed || false;

          return (
            <div
              key={course._id || index}
              className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-col gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-2 overflow-hidden border border-gray-200"
            >
              {/* Remove Button with conditional styling and click handler */}
              <div className="flex justify-end gap-2">
                <button className="px-2 bg-[#FCE7D2] text-gray-700 rounded-md hover:text-white hover:bg-red-700 transition-colors text-[12px] font-medium">
                  <Link href={`/courses/${course._id}`}>View</Link>
                </button>
                <button
                  onClick={() => handleRemoveButtonClick(course._id)}
                  className={` border py-1 px-4 rounded-md flex items-center justify-center transition-colors  ${
                    isConfirmed
                      ? "text-black-400 bg-[#FCE7D2] cursor-not-allowed opacity-50"
                      : "text-black-600 hover:bg-red-50 cursor-pointer"
                  }`}
                  title={
                    isConfirmed
                      ? "Cannot remove confirmed course"
                      : "Remove from applications"
                  }
                >
                  <Image
                    src="/delete.svg"
                    alt="Delete Icon"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />{" "}
                </button>
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left Section: Course Info */}
                <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
                  {/* Course Image and University Info */}
                  <div>
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

                    {/* Course Confirmation Checkbox */}
                    <div className="flex items-center gap-0 pt-4">
                      <Button className="bg-red-600 py-1">
                        Current Status :
                      </Button>
                      <span className="text-sm ml-2">
                        {getApplicationStepLabel(
                          applicationDetails?.applicationStatus || 1
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Course title */}
                    <p className="text-[14px] font-semibold">
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
                        <p className="text-[12px]">{course.countryname || "Country not specified"}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/DashboardPage/intake.svg"
                          width={16}
                          height={16}
                          alt="Intake"
                        />
                       <p className="text-[12px]">{course.intake || "Not specified"}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/clock.svg"
                          width={16}
                          height={16}
                          alt="Duration"
                        />
                       <p className="text-[12px]">{course.duration || "Not specified"}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/money.svg"
                          width={16}
                          height={16}
                          alt="Fee"
                        />
                       <p className="text-[12px]">
                          {course.annual_tuition_fee?.currency || "$"}{" "}
                          {course.annual_tuition_fee?.amount || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/dollar.png"
                          width={18}
                          height={18}
                          alt="dollar"
                        />
                       <p className="text-[12px]">Application fee:</p>
                      </div>
                      <p
                        className="truncate text-[12px] max-w-[100px]"
                        title={course.application_fee || "Not specified"}
                      >
                        {course.application_fee || "Not specified"}
                      </p>
                      {/* <p className="truncate">
                        {course.application_fee || "Not specified"}
                      </p> */}
                      <div className="flex items-center gap-1">
                        <Image
                          src="/DashboardPage/deadline.svg"
                          width={13}
                          height={13}
                          alt="Deadline"
                        />
                       <p className="text-[12px]">Deadline:</p>
                      </div>
                     <p className="text-[12px]">{course.application_deadline || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Right Section: Progress Circle */}
                <div className="flex flex-col items-center justify-between mt-4 md:mt-0 md:ml-4">
                  <div className="relative flex flex-col items-end justify-center min-w-[140px]">
                    {/* Blurred content */}
                    <div className="blur-sm opacity-40 pointer-events-none flex flex-col justify-center items-center">
                      <p className="text-sm font-semibold mb-2 text-center w-4/5">
                        Application Success Chances
                      </p>

                      <CircularProgress
                        progress={
                          applicationDetails
                            ? getApplicationProgress(
                                applicationDetails.applicationStatus || 1
                              )
                            : 0
                        }
                      />
                    </div>

                    {/* Overlay Button */}
                    <button className="absolute mr-2 px-2 py-1 text-[12px] bg-red-600 text-white rounded-full shadow-md hover:bg-red-700">
                      Generate Success Chances
                    </button>
                  </div>

                  {/* ✅ UPDATED: Confirm button now calls handleConfirmButtonClick */}
                  <button
                    onClick={() => handleConfirmButtonClick(course._id)}
                    disabled={applicationDetails?.isConfirmed === true}
                    className={` py-1 rounded text-white font-medium text-sm mt-2 ${
                      applicationDetails?.isConfirmed
                        ? "bg-red-600 cursor-not-allowed px-8"
                        : "bg-[#C7161E] hover:bg-[#A01419] cursor-pointer px-2"
                    }`}
                  >
                    {applicationDetails?.isConfirmed
                      ? "Confirmed"
                      : "Confirm Course Selection"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
