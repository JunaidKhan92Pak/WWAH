// AdminApplicationTracker.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Save,
  CheckCircle,
  GraduationCap,
  X,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

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
  statusId?: number; // For APPLICATION_STATUS
  createdAt?: string;
  updatedAt?: string;
  universityData?: UniversityData;
  applicantId: string;
  user: {
    _id: string;
  };
}



interface AdminCourseStatusTrackerProps {
  courseData: CourseData;
  onStatusUpdate?: (
    courseId: string,
    newStatus: number,
    newStatusId?: number
  ) => Promise<boolean>;
  readOnly?: boolean;
  userId?: string;
}

interface AdminApplicationTrackerProps {
  appliedCoursesData?: CourseData[];
  onStatusUpdate?: (
    courseId: string,
    newStatus: number,
    newStatusId?: number
  ) => Promise<boolean>;
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

// Individual Course Status Tracker Component for Admin View - HORIZONTAL CARD VERSION
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
  const [localStatusId, setLocalStatusId] = useState<number>(
    courseData.statusId || 1
  );
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

  const APPLICATION_STEPS = [
    { id: 1, label: "Complete Application", key: "complete-application" },
    { id: 2, label: "In Process", key: "in-process" },
    { id: 3, label: "Applied", key: "applied" },
    { id: 4, label: "Offer Letter Received", key: "offer-letter-received" },
    { id: 5, label: "Visa Granted", key: "visa-granted" },
    { id: 6, label: "Accommodation Booked", key: "accommodation-booked" },
    { id: 7, label: "Airport Pickup Booked", key: "Airport-pickup-booked" },
  ];

  const APPLICATION_STATUS = [
    { id: 1, label: "Incomplete Application", key: "incomplete-application" },
    {
      id: 2,
      label: "Complete application and confirm course",
      key: "complete-application",
    },
    {
      id: 3,
      label: "Awaiting Course Confirmation",
      key: "awaiting-course-confirmation",
    },
    { id: 4, label: "Pay Application Fee", key: "pay-application-fee" },
    { id: 5, label: "In Process", key: "in-process" },
    {
      id: 6,
      label: "Application withdrawn by student",
      key: "application-withdrawn",
    },
    { id: 7, label: "Application Successful", key: "application-successful" },
    {
      id: 8,
      label: "Application Unsuccessful",
      key: "application-unsuccessful",
    },
    { id: 9, label: "Visa in process", key: "visa-in-process" },
    { id: 10, label: "Visa Rejected", key: "visa-rejected" },
    { id: 11, label: "Ready to Fly", key: "ready-to-fly" },
  ];

  const currentStatus = courseData.applicationStatus || 1;
  const currentStatusId = courseData.statusId || 1;
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

  const handleStatusChange = (statusId: number): void => {
    setLocalStatusId(statusId);
    setShowStatusDropdown(false);
    setStatusUpdateError(null);
  };

  const handleStatusUpdate = async (): Promise<void> => {
    if (!courseId) {
      setStatusUpdateError("Course ID is missing");
      return;
    }

    if (!userId) {
      setStatusUpdateError("User ID is missing - required for admin updates");
      return;
    }

    if (localStatus === currentStatus && localStatusId === currentStatusId) {
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
        statusId: localStatusId,
        userId,
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/tracking/${courseId}`,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/tracking/${courseId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            courseId,
            applicationStatus: localStatus,
            statusId: localStatusId,
            userId: userId,
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
        // ✅ CRITICAL: Call onStatusUpdate with both parameters
        if (onStatusUpdate) {
          await onStatusUpdate(courseId, localStatus, localStatusId);
        }

        setStatusUpdateSuccess(true);

        setTimeout(() => {
          setStatusUpdateSuccess(false);
        }, 3000);

        console.log(
          `✅ Successfully updated course ${courseId} to status ${localStatus} and statusId ${localStatusId}`
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
    console.log("🔄 CourseData changed, updating local status:", {
      courseId: courseData.courseId || courseData._id,
      applicationStatus: courseData.applicationStatus,
      statusId: courseData.statusId,
    });

    setLocalStatus(courseData.applicationStatus || 1);
    setLocalStatusId(courseData.statusId || 1); // ✅ CRITICAL: Ensure statusId is set
  }, [courseData.applicationStatus, courseData.statusId]);



  return (
    <div className="relative min-w-[450px] max-w-[500px] sm:min-w-[500px] sm:max-w-[550px] lg:min-w-[600px] lg:max-w-[650px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Success/Error Indicators */}
      {statusUpdateSuccess && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-green-600 text-sm animate-pulse bg-green-50 px-3 py-2 rounded-full z-20">
          <CheckCircle className="w-4 h-4" />
          Status Updated!
        </div>
      )}

      {statusUpdateError && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-full z-20 max-w-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Update Failed</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 space-y-6">
        {/* Header Section with Course Image and Basic Info */}
        <div className="flex gap-4">
          {/* Course Image */}
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={
                courseData.universityData?.universityImages?.banner ||
                `/course-1.png`
              }
              alt="Course Banner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-center gap-2">
                {courseData.universityData?.universityImages?.logo ? (
                  <img
                    src={courseData.universityData.universityImages.logo}
                    alt="University Logo"
                    className="w-5 h-5 object-cover rounded-full"
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-white" />
                )}
                <p className="text-xs text-white font-medium truncate">
                  {courseData.universityData?.university_name ||
                    courseData.universityname ||
                    "University"}
                </p>
              </div>
            </div>
          </div>

          {/* Course Title and Progress */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {courseData.course_title || "Course Title"}
            </h3>

            {/* Progress Circle - Compact */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
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
                  <span className="text-xs font-semibold text-gray-900">
                    {Math.round(
                      (currentStatus / APPLICATION_STEPS.length) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Step {currentStatus} of {APPLICATION_STEPS.length}
                </p>
                <p className="text-xs text-gray-600">
                  {
                    APPLICATION_STEPS.find((step) => step.id === currentStatus)
                      ?.label
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Image src="/location.svg" width={14} height={14} alt="Location" />
            <span className="truncate">
              {courseData.countryname ||
                courseData.countryOfStudy ||
                "Country not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/DashboardPage/intake.svg"
              width={14}
              height={14}
              alt="Intake"
            />
            <span className="truncate">
              {Array.isArray(courseData.intake)
                ? courseData.intake.join(", ")
                : courseData.intake || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/clock.svg" width={14} height={14} alt="Duration" />
            <span className="truncate">
              {courseData.duration || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/money.svg" width={14} height={14} alt="Fee" />
            <span className="truncate">
              {courseData.annual_tuition_fee?.currency || "$"}{" "}
              {courseData.annual_tuition_fee?.amount?.toLocaleString() || "N/A"}
            </span>
          </div>
        </div>

        {/* Application Timeline - Compact Horizontal */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Progress Timeline
          </h4>

          {/* Compact Step Indicators */}
          <div className="flex items-center justify-between relative">
            {/* Background Progress Line */}
            <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 rounded-full" />

            {/* Active Progress Line */}
            <div
              className="absolute top-3 left-3 h-0.5 bg-red-500 rounded-full transition-all duration-500"
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
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium z-10 transition-all duration-300 ${
                      !readOnly ? "cursor-pointer" : "cursor-default"
                    } ${
                      isCompleted
                        ? "bg-red-500 text-white"
                        : isCurrent
                        ? "bg-red-500 text-white animate-pulse ring-2 ring-red-200"
                        : isLocalSelected && !readOnly
                        ? "bg-red-400 text-white hover:bg-red-500"
                        : "bg-gray-400 text-white hover:bg-gray-500"
                    }`}
                    onClick={() => handleStepClick(step.id)}
                    title={step.label}
                  >
                    {isCompleted && step.id < currentStatus ? (
                      <svg
                        className="w-3 h-3"
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
                  <p className="text-xs text-center mt-2 max-w-16 leading-tight text-gray-600">
                    {step.label.split(" ")[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Status Dropdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Application Status
          </h4>

          {/* Current Status Display */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Current Status:</div>
            <div className="text-sm font-medium text-gray-900">
              {/* ✅ CRITICAL: Use currentStatusId instead of applicationStatus for display */}
              {APPLICATION_STATUS.find(
                (status) => status.id === currentStatusId
              )?.label || "Unknown Status"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Status ID: {currentStatusId} | Progress Step: {currentStatus}
            </div>
          </div>

          {/* Status Dropdown */}
          {!readOnly && (
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-red-500 focus:outline-none focus:border-red-500 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-600 mb-1">
                    Update Status To:
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {/* ✅ CRITICAL: Show selected status based on localStatusId */}
                    {APPLICATION_STATUS.find(
                      (status) => status.id === localStatusId
                    )?.label || "Unknown Status"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Will update to Status ID: {localStatusId}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showStatusDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options */}
              {showStatusDropdown && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {APPLICATION_STATUS.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => handleStatusChange(status.id)}
                      className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                        localStatusId === status.id
                          ? "bg-red-50 text-red-700 font-medium"
                          : "text-gray-900"
                      }`}
                    >
                      <div className="text-sm">{status.label}</div>
                      <div className="text-xs text-gray-500">
                        ID: {status.id}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Application Info */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium text-gray-600">Applied:</span>
              <div className="text-gray-800">
                {courseData.createdAt
                  ? new Date(courseData.createdAt).toLocaleDateString()
                  : "Not available"}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Updated:</span>
              <div className="text-gray-800">
                {courseData.updatedAt
                  ? new Date(courseData.updatedAt).toLocaleDateString()
                  : "Not available"}
              </div>
            </div>
          </div>

          {/* ID Info */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Course ID:</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">
                {courseId || "Missing"}
              </span>
            </div>
            {userId && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">
                  {userId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {statusUpdateError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{statusUpdateError}</span>
            </p>
          </div>
        )}

        {/* Admin Controls */}
        {!readOnly && (
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-red-500 focus:outline-none focus:border-red-500 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="text-xs text-gray-600 mb-1">
                  Update Status To:
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {/* ✅ CRITICAL: Show selected status based on localStatusId */}
                  {APPLICATION_STATUS.find(
                    (status) => status.id === localStatusId
                  )?.label || "Unknown Status"}
                </div>
                <div className="text-xs text-gray-500">
                  Will update to Status ID: {localStatusId}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Options */}
            {showStatusDropdown && (
              <div className="absolute z-30 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {APPLICATION_STATUS.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      localStatusId === status.id
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-gray-900"
                    }`}
                  >
                    <div className="text-sm">{status.label}</div>
                    <div className="text-xs text-gray-500">ID: {status.id}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ... rest of JSX ... */}

      {/* Admin Controls */}
      {!readOnly && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            {localStatus !== currentStatus ||
            localStatusId !== currentStatusId ? (
              <div>
                <span className="text-orange-600 font-medium">
                  Pending Changes:
                </span>
                {localStatus !== currentStatus && (
                  <div>Progress: Step {localStatus}</div>
                )}
                {localStatusId !== currentStatusId && (
                  <div>
                    Status:{" "}
                    {
                      APPLICATION_STATUS.find((s) => s.id === localStatusId)
                        ?.label
                    }{" "}
                    (ID: {localStatusId})
                  </div>
                )}
              </div>
            ) : (
              "No changes pending"
            )}
          </div>
          <button
            onClick={handleStatusUpdate}
            disabled={
              isUpdatingStatus ||
              (localStatus === currentStatus &&
                localStatusId === currentStatusId) ||
              !courseId ||
              !userId
            }
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 text-xs font-medium transition-all duration-200"
          >
            {isUpdatingStatus ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                Updating...
              </>
            ) : localStatus === currentStatus &&
              localStatusId === currentStatusId ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Updated
              </>
            ) : !courseId || !userId ? (
              <>
                <X className="w-3 h-3" />
                Missing Info
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowStatusDropdown(false)}
        />
      )}
    </div>
  );
};

// Main Admin Application Tracker with Horizontal Scrolling
const AdminApplicationTracker: React.FC<AdminApplicationTrackerProps> = ({
  appliedCoursesData = [],
  loading = false,
  error = null,
  userId = null,
  userIdFromData = null,
  extractUserIdFromUrl = false,
}) => {
  const [detectedUserId, setDetectedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Smart userId detection (same logic as original)
    if (userId) {
      setDetectedUserId(userId);
      return;
    }

    if (userIdFromData) {
      setDetectedUserId(userIdFromData);
      return;
    }

    if (extractUserIdFromUrl && typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      const userIndex = pathSegments.findIndex((segment) => segment === "user");
      if (userIndex !== -1 && pathSegments[userIndex + 1]) {
        setDetectedUserId(pathSegments[userIndex + 1]);
        return;
      }

      const dashboardIndex = pathSegments.findIndex(
        (segment) => segment === "dashboard"
      );
      if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
        setDetectedUserId(pathSegments[dashboardIndex + 1]);
        return;
      }
    }

    if (appliedCoursesData && appliedCoursesData.length > 0) {
      const firstCourse = appliedCoursesData[0];
      if (firstCourse.userId) {
        setDetectedUserId(firstCourse.userId);
        return;
      }
      if (firstCourse.user && firstCourse.user._id) {
        setDetectedUserId(firstCourse.user._id);
        return;
      }
      if (firstCourse.applicantId) {
        setDetectedUserId(firstCourse.applicantId);
        return;
      }
    }

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
      {/* Header */}
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

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        {/* Scroll Indicator */}
        {appliedCoursesData.length > 1 && (
          <div className="absolute top-4 right-4 z-20 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
            Scroll →
          </div>
        )}

        <div
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#C7161E #f1f1f1",
          }}
        >
          {appliedCoursesData.map((courseData) => (
            <AdminCourseStatusTracker
              key={courseData._id || courseData.courseId || Math.random()}
              courseData={courseData}
              readOnly={false}
              userId={finalUserId || undefined}
            />
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #c7161e;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #f03c45;
        }
      `}</style>
    </div>
  );
};

export default AdminApplicationTracker;
