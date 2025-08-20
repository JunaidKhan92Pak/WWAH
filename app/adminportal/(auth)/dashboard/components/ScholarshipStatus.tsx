// /scholarshipStatus.tsx
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserData";
import Image from "next/image";
import CircularProgress from "@/app/(studentdashboard)/dashboard/overview/components/CircularProgress";
import { Save, CheckCircle, AlertCircle, X } from "lucide-react";

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

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

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
  appliedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  banner?: string;
}

interface ScholarshipStatusProps {
  //   userId: string;
  userId: string | null;

  isAdmin?: boolean;
  onStatusUpdate?: (
    applicationId: string,
    newStatus: number
  ) => Promise<boolean>;
  readOnly?: boolean;
  extractUserIdFromUrl?: boolean;
  userIdFromData?: string;
}

// Application steps configuration
const APPLICATION_STEPS = [
  { id: 1, label: "Application Started", key: "started" },
  { id: 2, label: "Documents Prepared", key: "documentsReady" },
  { id: 3, label: "Application Submitted", key: "submitted" },
  { id: 4, label: "Under Review", key: "underReview" },
  { id: 5, label: "Interview Scheduled", key: "interview" },
  { id: 6, label: "Decision Pending", key: "pending" },
  { id: 7, label: "Final Decision", key: "decided" },
];

// Individual Scholarship Application Tracker Component
interface ScholarshipApplicationTrackerProps {
  application: AppliedScholarshipCourse;
  isAdmin?: boolean;
  userId: string;
  onStatusUpdate?: (
    applicationId: string,
    newStatus: number
  ) => Promise<boolean>;
  readOnly?: boolean;
}

const ScholarshipApplicationTracker: React.FC<
  ScholarshipApplicationTrackerProps
> = ({
  application,
  isAdmin = false,
  userId,
  onStatusUpdate,
  readOnly = false,
}) => {
  const [localStatus, setLocalStatus] = useState<number>(
    application.applicationStatus || 1
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState<boolean>(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null
  );

  const currentStatus = application.applicationStatus || 1;
  const applicationId = application._id;

  const handleStepClick = (stepId: number): void => {
    if (readOnly || !isAdmin) return;

    if (stepId === localStatus) {
      setLocalStatus(Math.max(1, stepId - 1));
    } else {
      setLocalStatus(stepId);
    }

    // Clear any previous errors when user interacts
    setStatusUpdateError(null);
  };

  const handleStatusUpdate = async (): Promise<void> => {
    if (!applicationId) {
      setStatusUpdateError("Application ID is missing");
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

      console.log("🔄 Sending scholarship status update request:", {
        applicationId,
        applicationStatus: localStatus,
        userId,
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/tracking/${applicationId}`,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/tracking/${applicationId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            applicationStatus: localStatus,
            userId: userId, // Include userId for admin updates
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
            `Failed to update scholarship status: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Update response:", result);

      if (result.success) {
        // Call parent component's status update handler if provided
        if (onStatusUpdate) {
          await onStatusUpdate(applicationId, localStatus);
        }

        // Show success message
        setStatusUpdateSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setStatusUpdateSuccess(false);
        }, 3000);

        console.log(
          `✅ Successfully updated scholarship ${applicationId} to status ${localStatus}`
        );
      } else {
        throw new Error(
          result.message || "Failed to update scholarship status"
        );
      }
    } catch (error) {
      console.error("❌ Failed to update scholarship status:", error);
      setStatusUpdateError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Update local status when application data changes
  useEffect(() => {
    setLocalStatus(application.applicationStatus || 1);
  }, [application.applicationStatus]);

  // Helper functions
  const getApplicationStepLabel = (applicationStatus?: number): string => {
    const step = APPLICATION_STEPS.find(
      (s) => s.id === (applicationStatus || 1)
    );
    return step ? step.label : "Application Started";
  };

  const getApplicationProgress = (applicationStatus?: number): number => {
    return Math.round(
      ((applicationStatus || 1) / APPLICATION_STEPS.length) * 100
    );
  };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "under review":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
      case "submitted":
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Success/Error Indicators */}
      {statusUpdateSuccess && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-green-600 text-sm animate-pulse bg-green-50 px-3 py-2 rounded-full z-10">
          <CheckCircle className="w-4 h-4" />
          Status Updated!
        </div>
      )}

      {statusUpdateError && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-full z-10 max-w-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Update Failed</span>
        </div>
      )}

      <div className="relative flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Section: Scholarship Image and Info */}
        <div className="flex flex-col items-start gap-4 min-w-[250px]">
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
            <Image
              src={
                application.banner ||
                "https://via.placeholder.com/200x150?text=No+Image"
              }
              alt={`${application.scholarshipName} banner`}
              width={250}
              height={200}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C7161E] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {application.scholarshipName || "Scholarship"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {application.hostCountry || "Country"}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Image src="/hearti.svg" alt="favorite" width={20} height={20} />
            </div>
          </div>

          {/* Application Info */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Applied:</span>
              <span>
                {application.createdAt || application.appliedDate
                  ? new Date(
                      application.createdAt || application.appliedDate || ""
                    ).toLocaleDateString()
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
              <span className="font-medium text-gray-600">Application ID:</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {applicationId || "Missing"}
              </span>
            </div>
            {isAdmin && userId && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded">
                  {userId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Scholarship Details */}
        <div className="flex-1 space-y-4">
          {/* Scholarship Title */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {application.scholarshipName || "Scholarship Name"}
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              {application.courseName || "Course Name Not Available"}
            </p>

            {/* Scholarship Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Image
                  src="/location.svg"
                  width={16}
                  height={16}
                  alt="Location"
                />
                <span>
                  {application.hostCountry || "Country not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/clock.svg" width={16} height={16} alt="Duration" />
                <span>{application.duration || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/lang.svg" width={16} height={16} alt="Language" />
                <span>{application.language || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/vectoruni.svg"
                  width={16}
                  height={16}
                  alt="University"
                />
                <span>{application.universityName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/calender.svg"
                  width={14}
                  height={14}
                  alt="Deadline"
                />
                <span className="font-medium">Deadline:</span>
              </div>
              <span>{formatDate(application.deadline)}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Type:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    application.scholarshipType
                  )}`}
                >
                  {application.scholarshipType || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Current Step Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Current Step Details:
            </h4>
            <p className="text-sm text-gray-700">
              {getApplicationStepLabel(currentStatus)}
            </p>
            {application.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated:{" "}
                {new Date(application.updatedAt).toLocaleDateString()}
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
                  Admin access required. Please ensure you&apos;re logged in as an
                  admin.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Progress Circle */}
        <div className="flex flex-col items-center justify-center min-w-[150px] space-y-3">
          <p className="text-sm font-semibold text-center w-4/5">
            Application Progress
          </p>

          {/* Circular Progress */}
          <CircularProgress progress={getApplicationProgress(currentStatus)} />

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

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
              View
            </button>
            {!isAdmin && (
              <button
                onClick={() => {
                  /* Add remove functionality here */
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Remove scholarship application"
              >
                <Image
                  src="/delete.svg"
                  alt="Delete Icon"
                  width={16}
                  height={16}
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Progress Tracker Section */}
      <div className="border-t border-gray-100 p-6 bg-gray-50">
        <h4 className="text-lg font-medium text-gray-900 mb-6">
          Application Status Timeline
        </h4>

        {/* Progress Steps - Updated to match AdminApplicationTracker pattern */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            {/* Background Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 rounded-full" />

            {/* Animated Progress Line */}
            <div
              className="absolute top-4 left-4 h-0.5 bg-[#C7161E] rounded-full transition-all duration-500 ease-out"
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
                      isAdmin && !readOnly ? "cursor-pointer" : "cursor-default"
                    } ${
                      isCompleted
                        ? "bg-[#C7161E] text-white scale-110 shadow-lg"
                        : isCurrent
                        ? "bg-[#C7161E] text-white scale-110 shadow-lg animate-pulse ring-4 ring-red-200"
                        : isLocalSelected && isAdmin && !readOnly
                        ? "bg-red-400 text-white scale-105 hover:bg-red-500"
                        : isAdmin && !readOnly
                        ? "bg-gray-400 text-white scale-100 hover:bg-gray-500"
                        : "bg-gray-400 text-white scale-100"
                    }`}
                    onClick={
                      isAdmin && !readOnly
                        ? () => handleStepClick(step.id)
                        : undefined
                    }
                    title={
                      isAdmin && !readOnly
                        ? `Click to set status to step ${step.id}`
                        : undefined
                    }
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

        {/* Progress Summary */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Step {currentStatus} of {APPLICATION_STEPS.length}
            </span>
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                currentStatus === APPLICATION_STEPS.length
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }
            `}
            >
              {getApplicationStepLabel(currentStatus)}
            </span>
          </div>
        </div>

        {/* Admin Controls - Updated to match AdminApplicationTracker */}
        {isAdmin && !readOnly && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
            <div className="text-sm text-gray-600">
              Click on steps above to update progress
              {localStatus !== currentStatus && (
                <span className="block text-xs text-orange-600 mt-1">
                  Pending changes: Step {localStatus} selected
                </span>
              )}
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={
                isUpdatingStatus ||
                localStatus === currentStatus ||
                !applicationId ||
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
              ) : !applicationId || !userId ? (
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

// Main Scholarship Status Component with Admin Support
const ScholarshipStatus: React.FC<ScholarshipStatusProps> = ({
  userId,
  isAdmin = false,
  readOnly = false,
  extractUserIdFromUrl = false,
  userIdFromData = undefined,
}) => {
  // Using the store to get applied scholarship courses
  const {
    appliedScholarshipCourses,
    appliedScholarshipCourseIds,
    loadingApplications,
    error,
    fetchAppliedScholarship,
  } = useUserStore();

  // Smart userId detection (similar to AdminApplicationTracker)
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

    // Method 4: Check URL params/query string
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
      "ScholarshipStatus: Could not detect userId. This may affect admin functionality."
    );
  }, [userId, userIdFromData, extractUserIdFromUrl]);

  const finalUserId = detectedUserId || userId;

  console.log("ScholarshipStatus Debug Info:", {
    userId,
    finalUserId,
    appliedScholarshipCourseIds,
    loadingApplications,
    error,
    isAdmin,
    readOnly,
  });

  // Fetch scholarship data when component mounts or userId changes
  useEffect(() => {
    if (finalUserId) {
      console.log("Fetching scholarship data for userId:", finalUserId);
      fetchAppliedScholarship(finalUserId);
    }
  }, [finalUserId, fetchAppliedScholarship]);

  // Admin status update handler
  const handleStatusUpdate = async (
    // applicationId: string,
    // newStatus: number
  ): Promise<boolean> => {
    try {
      // Refresh the data after successful update
      if (finalUserId) {
        await fetchAppliedScholarship(finalUserId);
      }
      return true;
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      return false;
    }
  };

  // Helper functions
  // const getApplicationStepLabel = (applicationStatus?: number): string => {
  //   const step = APPLICATION_STEPS.find(
  //     (s) => s.id === (applicationStatus || 1)
  //   );
  //   return step ? step.label : "Application Started";
  // };

  // const getApplicationProgress = (applicationStatus?: number): number => {
  //   return Math.round(
  //     ((applicationStatus || 1) / APPLICATION_STEPS.length) * 100
  //   );
  // };

  // const getStatusColor = (status?: string): string => {
  //   switch (status?.toLowerCase()) {
  //     case "approved":
  //       return "bg-green-100 text-green-800";
  //     case "rejected":
  //       return "bg-red-100 text-red-800";
  //     case "shortlisted":
  //       return "bg-blue-100 text-blue-800";
  //     case "under review":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "pending":
  //     case "submitted":
  //     default:
  //       return "bg-orange-100 text-orange-800";
  //   }
  // };

  // const formatDate = (dateString?: string): string => {
  //   if (!dateString) return "Not specified";
  //   try {
  //     return new Date(dateString).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return "Invalid date";
  //   }
  // };

  // Loading state
  if (loadingApplications) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          <span className="ml-3 text-gray-600">
            Loading scholarship applications...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center text-red-600">
          <X className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">
            Error Loading Applications
          </p>
          <p className="break-words">{error}</p>
          <button
            onClick={() => {
              console.log("Retry button clicked");
              if (finalUserId) {
                fetchAppliedScholarship(finalUserId);
              }
            }}
            className="mt-4 bg-[#C7161E] hover:bg-[#f03c45] text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No applied scholarships state
  if (
    !appliedScholarshipCourseIds ||
    appliedScholarshipCourseIds.length === 0
  ) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Scholarship Applications
          </h3>
          <p className="text-gray-600">
            {isAdmin
              ? "This student hasn't applied to any scholarships yet."
              : "Start your journey by applying to your first scholarship!"}
          </p>
          {!isAdmin && (
            <button className="mt-4 bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Browse Scholarships
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          {isAdmin
            ? "Scholarship Applications"
            : "You are applying for scholarships"}
        </h2>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {appliedScholarshipCourseIds.length}
          </p>
          <p className="text-sm text-gray-600">
            Application{appliedScholarshipCourseIds.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Debug Info for Admins */}
      {isAdmin && process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Debug Info (Dev Mode)
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Final User ID: {finalUserId || "Not detected"}</p>
            <p>
              Applications Count: {appliedScholarshipCourseIds?.length || 0}
            </p>
            <p>Admin Mode: {isAdmin ? "Enabled" : "Disabled"}</p>
            <p>Read Only: {readOnly ? "Yes" : "No"}</p>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {appliedScholarshipCourseIds.map((applicationId: string) => {
          const application = appliedScholarshipCourses[applicationId];

          if (!application) {
            console.warn(`Application ${applicationId} not found in store`);
            return null;
          }

          return (
            <ScholarshipApplicationTracker
              key={application._id}
              application={application}
              isAdmin={isAdmin}
              userId={finalUserId || ""}
              onStatusUpdate={isAdmin ? handleStatusUpdate : undefined}
              readOnly={readOnly}
            />
          );
        })}
      </div>

      {/* Admin Instructions */}
      {isAdmin && !readOnly && appliedScholarshipCourseIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Admin Instructions
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              • Click on any step in the timeline to update the application
              status
            </p>
            <p>
              • Changes are highlighted in orange until you click &quot;Update
              Status&quot;
            </p>
            <p>• All status updates are saved immediately to the database</p>
            <p>• Students will see the updated progress in their dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipStatus;
