"use client";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authHelper";
import { CheckCircle, Save } from "lucide-react";

const APPLICATION_STEPS = [
  { id: 1, label: "Complete Application", status: "complete" },
  { id: 2, label: "Applied", status: "applied" },
  { id: 3, label: "Offer Letter Received", status: "offer" },
  { id: 4, label: "Confirm Enrollment", status: "enrollment" },
  { id: 5, label: "Visa Granted", status: "visa" },
  { id: 6, label: "Accommodation Booked", status: "accommodation" },
  { id: 7, label: "Airport Pickup Booked", status: "pickup" },
];
interface StatusTrackerProps {
  studentId: string;

  params: { id: string }; // Assuming params contains an id for fetching status
}
export const StatusTracker = ({
  studentId,

  params,
}: StatusTrackerProps) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [animatedStatus, setAnimatedStatus] = useState(1);
  const [currentStatus, setCurrentStatus] = useState<number>(1);
  // console.log(data,"data from statusTrack")
  // console.log(data, "data in status tracker");
  // Smooth animation effect when status changes
  useEffect(() => {
    if (currentStatus !== animatedStatus) {
      const timer = setTimeout(() => {
        if (currentStatus > animatedStatus) {
          setAnimatedStatus((prev) =>
            Math.min(prev + 1, APPLICATION_STEPS.length)
          );
        } else if (currentStatus < animatedStatus) {
          setAnimatedStatus((prev) => Math.max(prev - 1, 1));
        }
      }, 300); // Single timing for smooth animation

      return () => clearTimeout(timer);
    }
  }, [currentStatus, animatedStatus]);
  useEffect(() => {
    console.log("Fetching status data for studentId:", studentId);
    const fetchStatusData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getStatusUpdate/${params.id}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch status data: ${res.status}`);
        }

        const jsonData = await res.json();
        // console.log(jsonData, "res from status update api");
        setCurrentStatus(jsonData.data.applicationStatus || 1);
      } catch (err) {
        console.error("Failed to fetch status:", err);
        // Don't set error state here as it's not critical
      }
    };
    fetchStatusData();
  }, []);
  const handleStatusUpdate = async () => {
    if (!studentId) return;
    const token = getAuthToken();
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/createStatusUpdate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId: studentId,
            applicationStatus: currentStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Update local data
      // if (data) {
      //   const updatedData = { ...data };
      //   const applicationIndex = updatedData.applications.findIndex(
      //     (app) => app.user === studentId
      //   );
      //   if (applicationIndex !== -1) {
      //     updatedData.applications[applicationIndex].applicationStatus =
      //       currentStatus;
      //     setData(updatedData);
      //   }
      // }

      setStatusUpdateSuccess(true);
      setTimeout(() => setStatusUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update application status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Application Status
          </h2>
          {statusUpdateSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse">
              <CheckCircle className="w-4 h-4" />
              Updated!
            </div>
          )}
        </div>

        {/* Course Info - Compact */}
        {/* {userApplication && (
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {userApplication.courseName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{userApplication.countryOfStudy}</span>
                  <span>{userApplication.courseDuration}</span>
                  <span>{userApplication.courseFee}</span>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Progress Steps - Sequential Transition */}
        <div className="mb-4">
          <div className="flex items-center justify-between relative">
            {/* Background Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 rounded-full"></div>

            {/* Animated Progress Line */}
            <div
              className="absolute top-4 left-4 h-0.5 bg-red-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  animatedStatus <= 1
                    ? "0%"
                    : `${
                        (Math.min(
                          animatedStatus - 1,
                          APPLICATION_STEPS.length - 1
                        ) /
                          (APPLICATION_STEPS.length - 1)) *
                        100
                      }%`,
              }}
            />

            {APPLICATION_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const status =
                stepNumber <= animatedStatus
                  ? "completed"
                  : stepNumber === animatedStatus + 1 &&
                    stepNumber <= currentStatus
                  ? "current"
                  : "pending";

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  {/* Step Circle with Sequential Transitions */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-all duration-300 ease-out transform ${
                      status === "completed"
                        ? "bg-red-500 text-white scale-110 shadow-lg"
                        : status === "current"
                        ? "bg-red-500 text-white scale-110 shadow-lg animate-pulse ring-4 ring-red-200"
                        : "bg-gray-400 text-white scale-100"
                    }`}
                  >
                    {status === "completed" ? (
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
                      <span className="transition-all duration-300">
                        {stepNumber}
                      </span>
                    )}

                    {/* Pulse effect for current step */}
                    {status === "current" && (
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-red-500 opacity-30 animate-ping" />
                    )}
                  </div>

                  {/* Step Label with Sequential Fade */}
                  <p
                    className={`hidden md:block text-xs text-center mt-1 max-w-16 leading-tight transition-all duration-300 ${
                      status === "completed"
                        ? "text-red-600 font-medium"
                        : status === "current"
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

        {/* Status Display */}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-gray-600">
            Step {animatedStatus} of {APPLICATION_STEPS.length} completed
          </p>
        </div>

        {/* Admin Controls - Compact */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            {/* <AlertCircle className="w-4 h-4 text-orange-500" /> */}
            <h5 className="font-semibold text-gray-900">Update Status </h5>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Current: Step {currentStatus}
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-200 text-sm transition-all duration-200"
              >
                {APPLICATION_STEPS.map((step) => (
                  <option key={step.id} value={step.id}>
                    Step {step.id}: {step.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus}
              className="px-4 py-[0.75rem] bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
            >
              {isUpdatingStatus ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
