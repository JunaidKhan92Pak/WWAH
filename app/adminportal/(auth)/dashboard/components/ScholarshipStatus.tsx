// /scholarshipStatus.tsx
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserData";
import Image from "next/image";
import {
  Save,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

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
  userId: string | null;
  isAdmin?: boolean;
  onStatusUpdate?: (
    applicationId: string,
    newStatus: number
  ) => Promise<boolean>;
  readOnly?: boolean;
  extractUserIdFromUrl?: boolean;
  userIdFromData?: string;
  showOnlyConfirmed?: boolean; // New prop to control behavior
}

// Application steps configuration (for progress tracking)
const APPLICATION_STEPS = [
  { id: 1, label: "Complete Application", key: "complete-application" },
  { id: 2, label: "In Process", key: "in-process" },
  { id: 3, label: "Applied", key: "applied" },
  { id: 4, label: "Offer Letter Received", key: "offer-letter-received" },
  { id: 5, label: "Visa Granted", key: "visa-granted" },
  { id: 6, label: "Accommodation Booked", key: "accommodation-booked" },
  { id: 7, label: "Airport Pickup Booked", key: "Airport-pickup-booked" },
];

// Application status configuration (for status dropdown)
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
  { id: 8, label: "Application Unsuccessful", key: "application-unsuccessful" },
  { id: 9, label: "Visa in process", key: "visa-in-process" },
  { id: 10, label: "Visa Rejected", key: "visa-rejected" },
  { id: 11, label: "Ready to Fly", key: "ready-to-fly" },
];

// Individual Scholarship Application Tracker Component - HORIZONTAL CARD VERSION
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
  const [localTrackStep, setLocalTrackStep] = useState<number>(
    application.applicationStatus || 1
  );
  const [localApplicationStatus, setLocalApplicationStatus] = useState<number>(
    application.applicationStatus || 1
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] =
    useState<boolean>(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null
  );
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

  const currentTrackStep = application.applicationStatus || 1;
  const applicationId = application._id;

  // Handle track step click
  const handleStepClick = (stepId: number): void => {
    if (readOnly || !isAdmin) return;

    if (stepId === localTrackStep) {
      setLocalTrackStep(Math.max(1, stepId - 1));
    } else {
      setLocalTrackStep(stepId);
    }

    setStatusUpdateError(null);
  };

  // Handle status dropdown change
  const handleStatusChange = (statusId: number): void => {
    if (readOnly || !isAdmin) return;

    setLocalApplicationStatus(statusId);
    setShowStatusDropdown(false);
    setStatusUpdateError(null);
  };

  // Updated status update handler
  const handleStatusUpdate = async (): Promise<void> => {
    if (!applicationId) {
      setStatusUpdateError("Application ID is missing");
      return;
    }

    if (!userId) {
      setStatusUpdateError("User ID is missing - required for admin updates");
      return;
    }

    if (
      localTrackStep === currentTrackStep &&
      localApplicationStatus === currentTrackStep
    ) {
      setStatusUpdateError("No changes to save");
      return;
    }

    try {
      setIsUpdatingStatus(true);
      setStatusUpdateError(null);
      setStatusUpdateSuccess(false);

      console.log("🔄 Sending scholarship status update request:", {
        applicationId,
        trackStep: localTrackStep,
        applicationStatus: localApplicationStatus,
        userId,
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/tracking/${applicationId}`,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/tracking/${applicationId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            applicationStatus: localTrackStep,
            statusId: localApplicationStatus,
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
            `Failed to update scholarship status: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Update response:", result);

      if (result.success) {
        if (onStatusUpdate) {
          await onStatusUpdate(applicationId, localTrackStep);
        }

        setStatusUpdateSuccess(true);

        setTimeout(() => {
          setStatusUpdateSuccess(false);
        }, 3000);

        console.log(
          `✅ Successfully updated scholarship ${applicationId} to track step ${localTrackStep} and status ${localApplicationStatus}`
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

  // Update local states when application data changes
  useEffect(() => {
    setLocalTrackStep(application.applicationStatus || 1);
    setLocalApplicationStatus(application.applicationStatus || 1);
  }, [application.applicationStatus]);

  // Helper functions
  const getApplicationStepLabel = (applicationStatus?: number): string => {
    const step = APPLICATION_STEPS.find(
      (s) => s.id === (applicationStatus || 1)
    );
    return step ? step.label : "Application Started";
  };

  const getApplicationStatusLabel = (statusId?: number): string => {
    const status = APPLICATION_STATUS.find((s) => s.id === (statusId || 1));
    return status ? status.label : "Incomplete Application";
  };

  // const getApplicationProgress = (applicationStatus?: number): number => {
  //   return Math.round(
  //     ((applicationStatus || 1) / APPLICATION_STEPS.length) * 100
  //   );
  // };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "application successful":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "application unsuccessful":
      case "visa rejected":
        return "bg-red-100 text-red-800";
      case "shortlisted":
      case "ready to fly":
        return "bg-blue-100 text-blue-800";
      case "under review":
      case "in process":
      case "visa in process":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
      case "submitted":
      case "incomplete application":
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.log(error);
      return "Invalid date";
    }
  };

  const hasChanges =
    localTrackStep !== currentTrackStep ||
    localApplicationStatus !== currentTrackStep;

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
        {/* Header Section with Scholarship Image and Basic Info */}
        <div className="flex gap-4">
          {/* Scholarship Image */}
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={
                application.banner ||
                "https://via.placeholder.com/200x150?text=Scholarship"
              }
              alt={`${application.scholarshipName} banner`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#C7161E] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <p className="text-xs text-white font-medium truncate">
                  {application.hostCountry || "Country"}
                </p>
              </div>
            </div>
          </div>

          {/* Scholarship Title and Progress */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {application.scholarshipName || "Scholarship Name"}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-1">
              {application.courseName || "Course Name Not Available"}
            </p>

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
                      (currentTrackStep / APPLICATION_STEPS.length) * 100
                    }, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-900">
                    {Math.round(
                      (currentTrackStep / APPLICATION_STEPS.length) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Step {currentTrackStep} of {APPLICATION_STEPS.length}
                </p>
                <p className="text-xs text-gray-600">
                  {getApplicationStepLabel(currentTrackStep)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Image src="/location.svg" width={14} height={14} alt="Location" />
            <span className="truncate">
              {application.hostCountry || "Country not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/clock.svg" width={14} height={14} alt="Duration" />
            <span className="truncate">
              {application.duration || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/lang.svg" width={14} height={14} alt="Language" />
            <span className="truncate">
              {application.language || "Not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/vectoruni.svg"
              width={14}
              height={14}
              alt="University"
            />
            <span className="truncate">
              {application.universityName || "N/A"}
            </span>
          </div>
        </div>

        {/* Application Timeline - Compact Horizontal */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Status Timeline</h4>

          {/* Compact Step Indicators */}
          <div className="flex items-center justify-between relative">
            {/* Background Progress Line */}
            <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 rounded-full" />

            {/* Active Progress Line */}
            <div
              className="absolute top-3 left-3 h-0.5 bg-red-500 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((Math.min(localTrackStep, currentTrackStep) - 1) /
                    (APPLICATION_STEPS.length - 1)) *
                  100
                }%`,
              }}
            />

            {APPLICATION_STEPS.map((step) => {
              const isCompleted = currentTrackStep >= step.id;
              const isCurrent = currentTrackStep === step.id;
              const isLocalSelected = localTrackStep >= step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium z-10 transition-all duration-300 ${
                      isAdmin && !readOnly ? "cursor-pointer" : "cursor-default"
                    } ${
                      isCompleted
                        ? "bg-red-500 text-white"
                        : isCurrent
                        ? "bg-red-500 text-white animate-pulse ring-2 ring-red-200"
                        : isLocalSelected && isAdmin && !readOnly
                        ? "bg-red-400 text-white hover:bg-red-500"
                        : "bg-gray-400 text-white hover:bg-gray-500"
                    }`}
                    onClick={
                      isAdmin && !readOnly
                        ? () => handleStepClick(step.id)
                        : undefined
                    }
                    title={step.label}
                  >
                    {isCompleted && step.id < currentTrackStep ? (
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

        {/* Application Info */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium text-gray-600">Applied:</span>
              <div className="text-gray-800">
                {application.createdAt || application.appliedDate
                  ? formatDate(application.createdAt || application.appliedDate)
                  : "Not available"}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Deadline:</span>
              <div className="text-gray-800 font-medium">
                {formatDate(application.deadline)}
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                  application.scholarshipType
                )}`}
              >
                {application.scholarshipType || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                  getApplicationStatusLabel(currentTrackStep)
                )}`}
              >
                {getApplicationStatusLabel(currentTrackStep)}
              </span>
            </div>
          </div>

          {/* ID Info */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Application ID:</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">
                {applicationId || "Missing"}
              </span>
            </div>
            {isAdmin && userId && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">
                  {userId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Status Dropdown */}
        {isAdmin && !readOnly && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-xs font-medium text-blue-900 mb-2">
              Admin Controls
            </h5>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-blue-800 block mb-1">
                  Application Status:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs text-left flex items-center justify-between hover:border-blue-400"
                  >
                    <span className="truncate">
                      {getApplicationStatusLabel(localApplicationStatus)}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        showStatusDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-300 rounded shadow-lg z-50 max-h-32 overflow-y-auto">
                      {APPLICATION_STATUS.map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusChange(status.id)}
                          className={`w-full text-left px-2 py-1 text-xs hover:bg-blue-50 ${
                            localApplicationStatus === status.id
                              ? "bg-blue-100 text-blue-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {hasChanges && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  Pending: Track Step {localTrackStep}, Status:{" "}
                  {getApplicationStatusLabel(localApplicationStatus)}
                </div>
              )}
            </div>
          </div>
        )}

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
        {isAdmin && !readOnly && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              {hasChanges ? (
                <span className="text-orange-600 font-medium">
                  Pending changes ready to save
                </span>
              ) : (
                "Click steps above to update"
              )}
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={
                isUpdatingStatus || !hasChanges || !applicationId || !userId
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 text-xs font-medium transition-all duration-200"
            >
              {isUpdatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : !hasChanges ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Updated
                </>
              ) : !applicationId || !userId ? (
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
      </div>

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStatusDropdown(false)}
        />
      )}
    </div>
  );
};

// Main Scholarship Status Component with Horizontal Scrolling
const ScholarshipStatus: React.FC<ScholarshipStatusProps> = ({
  userId,
  isAdmin = false,
  readOnly = false,
  extractUserIdFromUrl = false,
  userIdFromData = undefined,
  showOnlyConfirmed = false, // New prop with default false
}) => {
  // Choose which data source to use based on showOnlyConfirmed prop
  const {
    // For all scholarships (existing behavior)
    appliedScholarshipCourses,
    appliedScholarshipCourseIds,
    loadingApplications,
    fetchAppliedScholarship,

    // For confirmed scholarships only (new)
    confirmedScholarshipCourses,
    confirmedScholarshipCourseIds,
    loadingConfirmedApplications,
    fetchConfirmedScholarshipCourses,
  } = useUserStore();

  // Smart userId detection (keep existing logic)
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

    // Method 3: Extract from URL parameters
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

  // Choose data source based on showOnlyConfirmed prop
  const scholarshipCourses = showOnlyConfirmed
    ? confirmedScholarshipCourses
    : appliedScholarshipCourses;
  const scholarshipCourseIds = showOnlyConfirmed
    ? confirmedScholarshipCourseIds
    : appliedScholarshipCourseIds;
  const loading = showOnlyConfirmed
    ? loadingConfirmedApplications
    : loadingApplications;
  const fetchFunction = showOnlyConfirmed
    ? fetchConfirmedScholarshipCourses
    : fetchAppliedScholarship;

  // Fetch scholarship data when component mounts or userId changes
  useEffect(() => {
    if (finalUserId) {
      console.log(
        `Fetching ${
          showOnlyConfirmed ? "confirmed" : "all"
        } scholarship data for userId:`,
        finalUserId
      );
      fetchFunction(finalUserId);
    }
  }, [finalUserId, fetchFunction, showOnlyConfirmed]);

  // Admin status update handler
  const handleStatusUpdate = async (): Promise<boolean> => {
    try {
      if (finalUserId) {
        // Refresh the appropriate data source
        await fetchFunction(finalUserId);
      }
      return true;
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      return false;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          <span className="ml-3 text-gray-600">
            Loading {showOnlyConfirmed ? "confirmed" : ""} scholarship
            applications...
          </span>
        </div>
      </div>
    );
  }

  // No scholarships state
  if (!scholarshipCourseIds || scholarshipCourseIds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showOnlyConfirmed
              ? "No Confirmed Scholarship Applications"
              : "No Scholarship Applications"}
          </h3>
          <p className="text-gray-600">
            {showOnlyConfirmed
              ? isAdmin
                ? "This student hasn't confirmed any scholarship applications yet."
                : "You haven't confirmed any scholarship applications yet."
              : isAdmin
              ? "This student hasn't applied to any scholarships yet."
              : "Start your journey by applying to your first scholarship!"}
          </p>
          {!isAdmin && !showOnlyConfirmed && (
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
          <GraduationCap className="w-8 h-8 text-red-600" />
          {showOnlyConfirmed
            ? isAdmin
              ? "Confirmed Scholarship Applications"
              : "Your Confirmed Scholarship Applications"
            : isAdmin
            ? "Scholarship Applications"
            : "Your Scholarship Applications"}
        </h2>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {scholarshipCourseIds.length}
          </p>
          <p className="text-sm text-gray-600">
            {showOnlyConfirmed ? "Confirmed " : ""}Application
            {scholarshipCourseIds.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        {/* Scroll Indicator */}
        {scholarshipCourseIds.length > 1 && (
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
          {scholarshipCourseIds.map((applicationId: string) => {
            const application = scholarshipCourses[applicationId];

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

      {/* Admin Instructions */}
      {isAdmin && !readOnly && scholarshipCourseIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Admin Instructions
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              •{" "}
              {showOnlyConfirmed
                ? "Viewing only confirmed scholarship applications"
                : "Viewing all scholarship applications"}
            </p>
            <p>
              • Click on timeline steps in each card to update the application
              progress
            </p>
            <p>
              • Use the &quot;Admin Controls&quot; section in each card to
              change status
            </p>
            <p>• Scroll horizontally to view all applications</p>
            <p>
              • Changes are highlighted until you click &quot;Save Changes&quot;
            </p>
            <p>• All updates are saved immediately to the database</p>
            <p>• Students will see the updated progress in their dashboard</p>
          </div>
        </div>
      )}

      {/* Mobile scroll hint */}
      {scholarshipCourseIds.length > 1 && (
        <div className="text-center text-sm text-gray-500 md:hidden">
          <p>Swipe left or right to view all applications</p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipStatus;
