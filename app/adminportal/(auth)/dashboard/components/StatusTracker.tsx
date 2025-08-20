// AdminApplicationTracker.tsx - FIXED VERSION
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Save, CheckCircle, GraduationCap, X, AlertCircle } from "lucide-react";

// TypeScript interfaces
interface UniversityData {
  university_name?: string;
  universityImages?: {
    banner?: string;
    logo?: string;
  };
}

interface TuitionFee {
  currency?: string;
  amount?: number;
}

interface CourseData {
  _id?: string;
  userId: string;
  courseId?: string;
  course_title?: string;
  universityname?: string;
  countryname?: string;
  countryOfStudy?: string;
  intake?: string | string[];
  duration?: string;
  annual_tuition_fee?: TuitionFee;
  application_deadline?: string;
  course_level?: string;
  applicationStatus?: number;
  createdAt?: string;
  updatedAt?: string;
  universityData?: UniversityData;
  applicantId:string;
  user: {
    _id: string;
  };
}

interface ApplicationStep {
  id: number;
  label: string;
  key: string;
}

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data?: any;
// }

interface AdminCourseStatusTrackerProps {
  courseData: CourseData;
  onStatusUpdate?: (courseId: string, newStatus: number) => Promise<boolean>;
  readOnly?: boolean;
  userId?: string;
}

interface AdminApplicationTrackerProps {
  appliedCoursesData?: CourseData[];
  onStatusUpdate?: (courseId: string, newStatus: number) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
  userId?: string | null;
  userIdFromData?: string | null;
  extractUserIdFromUrl?: boolean;
}

// Import cookie parser
import { parse as cookieParse } from "cookie";

// Helper function to get auth token from cookies
const getAuthToken = () => {
  if (typeof document !== "undefined") {
    const cookies = cookieParse(document.cookie);
    return cookies.authToken || null;
  }
  return null;
};

// Helper function to get authentication headers
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Get token from cookies
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Individual Course Status Tracker Component for Admin View
const AdminCourseStatusTracker: React.FC<AdminCourseStatusTrackerProps> = ({
  courseData,
  onStatusUpdate,
  readOnly = false,
  userId,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState<boolean>(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null
  );
  const [localStatus, setLocalStatus] = useState<number>(
    courseData.applicationStatus || 1
  );

  const APPLICATION_STEPS: ApplicationStep[] = [
    { id: 1, label: "Application Started", key: "started" },
    { id: 2, label: "Documents Prepared", key: "documentsReady" },
    { id: 3, label: "Application Submitted", key: "submitted" },
    { id: 4, label: "Under Review", key: "underReview" },
    { id: 5, label: "Interview Scheduled", key: "interview" },
    { id: 6, label: "Decision Pending", key: "pending" },
    { id: 7, label: "Final Decision", key: "decided" },
  ];

  const currentStatus = courseData.applicationStatus || 1;
  const courseId = courseData.courseId || courseData._id || "";

  const handleStepClick = (stepId: number): void => {
    if (readOnly) return;

    if (stepId === localStatus) {
      setLocalStatus(Math.max(1, stepId - 1));
    } else {
      setLocalStatus(stepId);
    }

    // Clear any previous errors when user interacts
    setStatusUpdateError(null);
  };
  console.log(userId, "userId");
  // ✅ FIXED: Updated handleStatusUpdate function with userId in request body
  const handleStatusUpdate = async (): Promise<void> => {
    if (!courseId) {
      setStatusUpdateError("Course ID is missing");
      return;
    }

    if (!userId) {
      setStatusUpdateError("User ID is missing - required for admin updates");
      return;
    }

    if (localStatus === currentStatus) {
      setStatusUpdateError("No changes to save");
      return;
    }

    try {
      setIsUpdatingStatus(true);
      setStatusUpdateError(null);
      setStatusUpdateSuccess(false);

      console.log("🔄 Sending status update request:", {
        courseId,
        applicationStatus: localStatus,
        userId,
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/tracking/${courseId}`,
      });

      // ✅ FIXED: Include userId in the request body for admin updates
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/tracking/${courseId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            courseId,
            applicationStatus: localStatus,
            userId: userId, // ✅ Include userId for admin updates
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Response not OK:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          errorData.message ||
            `Failed to update course status: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Update response:", result);

      if (result.success) {
        // Call parent component's status update handler if provided
        if (onStatusUpdate) {
          await onStatusUpdate(courseId, localStatus);
        }

        // Show success message
        setStatusUpdateSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setStatusUpdateSuccess(false);
        }, 3000);

        console.log(
          `✅ Successfully updated course ${courseId} to status ${localStatus}`
        );
      } else {
        throw new Error(result.message || "Failed to update course status");
      }
    } catch (error) {
      console.error("❌ Failed to update course status:", error);
      setStatusUpdateError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Update local status when courseData changes
  useEffect(() => {
    setLocalStatus(courseData.applicationStatus || 1);
  }, [courseData.applicationStatus]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Course Details Section */}
      <div className="relative flex flex-col lg:flex-row gap-6 p-6">
        {/* Success Indicator */}
        {statusUpdateSuccess && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-green-600 text-sm animate-pulse bg-green-50 px-3 py-2 rounded-full z-10">
            <CheckCircle className="w-4 h-4" />
            Status Updated!
          </div>
        )}

        {/* Error Indicator */}
        {statusUpdateError && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-full z-10 max-w-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Update Failed</span>
          </div>
        )}

        {/* Left Section: Course Image and University Info */}
        <div className="flex flex-col items-start gap-4 min-w-[250px]">
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
            <Image
              src={
                courseData.universityData?.universityImages?.banner ||
                `/course-1.png`
              }
              alt="Course Banner"
              width={250}
              height={200}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                {courseData.universityData?.universityImages?.logo ? (
                  <img
                    src={courseData.universityData.universityImages.logo}
                    alt="University Logo"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                ) : (
                  <GraduationCap className="w-8 h-8 text-gray-600" />
                )}
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {courseData.universityData?.university_name ||
                      courseData.universityname ||
                      "University"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {courseData.countryname ||
                      courseData.countryOfStudy ||
                      "Country"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Applied:</span>
              <span>
                {courseData.createdAt
                  ? new Date(courseData.createdAt).toLocaleDateString()
                  : "Not available"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Current Status:</span>
              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Step {currentStatus} of {APPLICATION_STEPS.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Course ID:</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {courseId || "Missing"}
              </span>
            </div>
            {userId && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded">
                  {userId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Course Details */}
        <div className="flex-1 space-y-4">
          {/* Course Title */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {courseData.course_title || "Course Title"}
            </h3>

            {/* Course Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Image
                  src="/location.svg"
                  width={16}
                  height={16}
                  alt="Location"
                />
                <span>
                  {courseData.countryname ||
                    courseData.countryOfStudy ||
                    "Country not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/DashboardPage/intake.svg"
                  width={16}
                  height={16}
                  alt="Intake"
                />
                <span>
                  {Array.isArray(courseData.intake)
                    ? courseData.intake.join(", ")
                    : courseData.intake || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/clock.svg" width={16} height={16} alt="Duration" />
                <span>{courseData.duration || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/money.svg" width={16} height={16} alt="Fee" />
                <span>
                  {courseData.annual_tuition_fee?.currency || "$"}{" "}
                  {courseData.annual_tuition_fee?.amount?.toLocaleString() ||
                    "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/DashboardPage/deadline.svg"
                  width={14}
                  height={14}
                  alt="Deadline"
                />
                <span className="font-medium">Deadline:</span>
                <span>
                  {courseData.application_deadline
                    ? new Date(
                        courseData.application_deadline
                      ).toLocaleDateString()
                    : "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="font-medium">Level:</span>
                <span>{courseData.course_level || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Current Step Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Current Step Details:
            </h4>
            <p className="text-sm text-gray-700">
              {APPLICATION_STEPS.find((step) => step.id === currentStatus)
                ?.label || "Unknown Step"}
            </p>
            {courseData.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated:{" "}
                {new Date(courseData.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Error Message Display */}
          {statusUpdateError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">{statusUpdateError}</span>
              </p>
              {statusUpdateError.includes("Authentication") && (
                <div className="mt-2 text-xs text-red-500">
                  Try refreshing the page and logging in again.
                </div>
              )}
              {statusUpdateError.includes("User ID") && (
                <div className="mt-2 text-xs text-red-500">
                  Admin access required. Please ensure you&apos;re logged in as
                  an admin.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Progress Circle */}
        <div className="flex flex-col items-center justify-center min-w-[150px] space-y-3">
          <p className="text-sm font-semibold text-center">
            Application Progress
          </p>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-red-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${
                  (currentStatus / APPLICATION_STEPS.length) * 100
                }, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((currentStatus / APPLICATION_STEPS.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Step {currentStatus} of {APPLICATION_STEPS.length}
            </p>
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStatus / APPLICATION_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Progress Tracker Section */}
      <div className="border-t border-gray-100 p-6 bg-gray-50">
        <h4 className="text-lg font-medium text-gray-900 mb-6">
          Application Status Timeline
        </h4>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            {/* Background Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 rounded-full" />

            {/* Animated Progress Line */}
            <div
              className="absolute top-4 left-4 h-0.5 bg-red-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((Math.min(localStatus, currentStatus) - 1) /
                    (APPLICATION_STEPS.length - 1)) *
                  100
                }%`,
              }}
            />

            {APPLICATION_STEPS.map((step) => {
              const isCompleted = currentStatus >= step.id;
              const isCurrent = currentStatus === step.id;
              const isLocalSelected = localStatus >= step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-all duration-300 ease-out transform ${
                      !readOnly ? "cursor-pointer" : "cursor-default"
                    } ${
                      isCompleted
                        ? "bg-red-500 text-white scale-110 shadow-lg"
                        : isCurrent
                        ? "bg-red-500 text-white scale-110 shadow-lg animate-pulse ring-4 ring-red-200"
                        : isLocalSelected && !readOnly
                        ? "bg-red-400 text-white scale-105 hover:bg-red-500"
                        : "bg-gray-400 text-white scale-100 hover:bg-gray-500"
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {isCompleted && step.id < currentStatus ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <p
                    className={`text-xs text-center mt-3 max-w-20 leading-tight transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? "text-red-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Controls */}
        {!readOnly && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Click on steps above to update progress
              {localStatus !== currentStatus && (
                <span className="block text-xs text-orange-600 mt-1">
                  Pending changes: Step {localStatus} selected
                </span>
              )}
            </div>
            {/* ✅ Updated button with better disabled state handling */}
            <button
              onClick={handleStatusUpdate}
              disabled={
                isUpdatingStatus ||
                localStatus === currentStatus ||
                !courseId ||
                !userId
              }
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
            >
              {isUpdatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : localStatus === currentStatus ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Up to date
                </>
              ) : !courseId || !userId ? (
                <>
                  <X className="w-4 h-4" />
                  Missing Info
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Status to Step {localStatus}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Admin Status Tracker Component with proper userId handling
const AdminApplicationTracker: React.FC<AdminApplicationTrackerProps> = ({
  appliedCoursesData = [],
  // onStatusUpdate,
  loading = false,
  error = null,
  userId = null,
  userIdFromData = null,
  extractUserIdFromUrl = false,
}) => {
  // Smart userId detection
  const [detectedUserId, setDetectedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Method 1: Use provided userId
    if (userId) {
      setDetectedUserId(userId);
      return;
    }

    // Method 2: Use userIdFromData prop
    if (userIdFromData) {
      setDetectedUserId(userIdFromData);
      return;
    }

    // Method 3: Extract from URL parameters (for admin pages like /admin/user/[userId])
    if (extractUserIdFromUrl && typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      const userIndex = pathSegments.findIndex((segment) => segment === "user");
      if (userIndex !== -1 && pathSegments[userIndex + 1]) {
        setDetectedUserId(pathSegments[userIndex + 1]);
        return;
      }

      // Try to get from dashboard route pattern
      const dashboardIndex = pathSegments.findIndex(
        (segment) => segment === "dashboard"
      );
      if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
        setDetectedUserId(pathSegments[dashboardIndex + 1]);
        return;
      }
    }

    // Method 4: Extract from applied courses data if it contains user info
    if (appliedCoursesData && appliedCoursesData.length > 0) {
      // Look for userId in the course data structure
      const firstCourse = appliedCoursesData[0];
      if ((firstCourse ).userId) {
        setDetectedUserId((firstCourse).userId);
        return;
      }
      if ((firstCourse).user && (firstCourse ).user._id) {
        setDetectedUserId((firstCourse ).user._id);
        return;
      }
      if ((firstCourse ).applicantId) {
        setDetectedUserId((firstCourse).applicantId);
        return;
      }
    }

    // Method 5: Check URL params/query string
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromQuery =
        urlParams.get("userId") || urlParams.get("user") || urlParams.get("id");
      if (userIdFromQuery) {
        setDetectedUserId(userIdFromQuery);
        return;
      }
    }

    console.warn(
      "AdminApplicationTracker: Could not detect userId. This may affect admin functionality."
    );
  }, [userId, userIdFromData, extractUserIdFromUrl, appliedCoursesData]);

  const finalUserId = detectedUserId || userId;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          <span className="ml-3 text-gray-600">
            Loading student applications...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center text-red-600">
          <X className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">
            Error Loading Applications
          </p>
          <p className="break-words">{error}</p>
        </div>
      </div>
    );
  }

  if (!appliedCoursesData || appliedCoursesData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Course Applications
          </h3>
          <p className="text-gray-600">
            This student hasn&apos;t applied to any courses yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-red-600" />
          Course Applications
        </h2>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {appliedCoursesData.length}
          </p>
          <p className="text-sm text-gray-600">
            Application{appliedCoursesData.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Render each applied course with its tracker */}
      {appliedCoursesData.map((courseData) => (
        <AdminCourseStatusTracker
          key={courseData._id || courseData.courseId || Math.random()}
          courseData={courseData}
          // onStatusUpdate={handleStatusUpdate}
          readOnly={false}
          userId={finalUserId || undefined}
        />
      ))}
    </div>
  );
};

export default AdminApplicationTracker;
