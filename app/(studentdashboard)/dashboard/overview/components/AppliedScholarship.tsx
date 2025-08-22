import React, { useState } from "react";
import { useUserStore } from "@/store/useUserData";
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
import { getAuthToken } from "@/utils/authHelper";

// Type definitions for better TypeScript support
interface AppliedScholarshipCourseProps {
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
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  ScholarshipId: string;
  isConfirmed?: boolean;
  banner?: string;
  statusId?: number; // Added for the new status system
}

const AppliedScholarship = () => {
  // Using the store with proper destructuring - matching backup pattern
  const store = useUserStore();
  const { user } = store;
  console.log("Debug - user:", user);

  // ✅ NEW: Modal states
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [scholarshipToConfirm, setScholarshipToConfirm] = useState<
    string | null
  >(null);

  // Safely access the loading state - matching backup pattern
  const loadingApplications =
    (store as { loadingApplications?: boolean }).loadingApplications || false;

  // ✅ NEW: Status dot color mapping function
  const getStatusDotColor = (status?: string, statusId?: number): string => {
    // If we have statusId, use it for more precise mapping
    if (statusId) {
      switch (statusId) {
        case 1: // Incomplete Application
          return "bg-red-500";
        case 2: // Complete application and confirm course
          return "bg-red-500";
        case 3: // Awaiting Course Confirmation
          return "bg-orange-500";
        case 4: // Pay Application Fee
          return "bg-yellow-500";
        case 5: // In Process
          return "bg-yellow-500";
        case 6: // Application withdrawn by student
          return "bg-black";
        case 7: // Application Successful
          return "bg-green-500";
        case 8: // Application Unsuccessful
          return "bg-red-500";
        case 9: // Visa in process
          return "bg-yellow-500";
        case 10: // Visa Rejected
          return "bg-red-500";
        case 11: // Ready to Fly
          return "bg-green-500";
        default:
          return "bg-orange-500"; // Default fallback
      }
    }

    // Fallback to status string mapping
    switch (status?.toLowerCase()) {
      case "incomplete application":
        return "bg-red-500";
      case "complete application and confirm course":
        return "bg-red-500";
      case "awaiting course confirmation":
        return "bg-orange-500";
      case "pay application fee":
        return "bg-yellow-500";
      case "in process":
        return "bg-yellow-500";
      case "application withdrawn by student":
        return "bg-black";
      case "applied":
        return "bg-yellow-500";
      case "application successful":
        return "bg-green-500";
      case "application unsuccessful":
        return "bg-red-500";
      case "visa in process":
        return "bg-yellow-500";
      case "visa rejected":
        return "bg-red-500";
      case "ready to fly":
        return "bg-green-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
      case "submitted":
      default:
        return "bg-orange-500"; // Default orange for pending/unknown status
    }
  };

  // ✅ NEW: Get readable status label
  const getStatusLabel = (status?: string, statusId?: number): string => {
    // If we have statusId, use it for more precise labeling
    if (statusId) {
      const statusMap = {
        1: "Incomplete Application",
        2: "Complete application and confirm course",
        3: "Awaiting Course Confirmation",
        4: "Pay Application Fee",
        5: "In Process",
        6: "Application withdrawn by student",
        7: "Application Successful",
        8: "Application Unsuccessful",
        9: "Visa in process",
        10: "Visa Rejected",
        11: "Ready to Fly",
      };
      return (
        statusMap[statusId as keyof typeof statusMap] ||
        status ||
        "Awaiting Scholarship Confirmation"
      );
    }

    return status || "Awaiting Scholarship Confirmation";
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!user?._id) {
      alert("User not found. Please log in again.");
      return;
    }

    // Check if scholarship is confirmed
    const scholarship = appliedCoursesArray.find(
      (app) => app._id === applicationId
    );
    if (scholarship?.isConfirmed) {
      setShowContactModal(true);
      return;
    }

    // Confirm deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this application? This action cannot be undone."
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Application deleted successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("An error occurred while deleting the application");
    }
  };

  // ✅ NEW: Handle confirm button click - show modal
  const handleConfirmButtonClick = (scholarshipId: string) => {
    console.log("Confirm button clicked for scholarship:", scholarshipId);
    setScholarshipToConfirm(scholarshipId);
    setShowConfirmModal(true);
    console.log("Modal should be open now");
  };

  // ✅ NEW: Handle confirmation modal Yes click
  const handleConfirmYes = async () => {
    if (scholarshipToConfirm) {
      await handleScholarshipConfirmation(scholarshipToConfirm, true);
    }
    setShowConfirmModal(false);
    setScholarshipToConfirm(null);
  };

  // ✅ NEW: Handle confirmation modal No click
  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setScholarshipToConfirm(null);
  };

  // ✅ NEW: Function to handle scholarship confirmation
  const handleScholarshipConfirmation = async (
    scholarshipId: string,
    isConfirmed: boolean
  ) => {
    console.log("Updating scholarship confirmation:", {
      scholarshipId,
      isConfirmed,
    });

    const loadingToast = toast.loading(
      isConfirmed ? "Confirming scholarship..." : "Updating scholarship...",
      {
        position: "top-center",
      }
    );

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/confirm/${scholarshipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add auth token
          },
          body: JSON.stringify({
            isConfirmed,
            userId: user?._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success(
          isConfirmed
            ? "Scholarship confirmed successfully!"
            : "Scholarship confirmation updated!",
          {
            duration: 2000,
            position: "top-center",
          }
        );

        // Refresh the page or update local state
        window.location.reload();
      } else {
        throw new Error(
          data.message || "Failed to update scholarship confirmation"
        );
      }
    } catch (error: unknown) {
      console.error("Error updating scholarship confirmation:", error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update confirmation: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // ✅ FIXED: Use user.appliedScholarshipCourses directly like in backup
  const appliedCoursesArray: AppliedScholarshipCourseProps[] =
    user?.appliedScholarshipCourses || [];
  console.log("Debug - appliedCoursesArray:", appliedCoursesArray);

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
              No Applied Scholarships Yet
            </p>
            <p className="text-gray-600 mb-4">
              Start your journey by applying to your first scholarship!
            </p>
            <Link href="/scholarships">
              <button className="px-5 py-2 bg-[#C7161E] text-white rounded-full hover:bg-red-700">
                Browse Scholarships
              </button>
            </Link>
          </div>
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

  return (
    <div className="p-3 bg-gray-50">
      {/* ✅ NEW: Contact Advisor Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Scholarship Confirmed
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              This scholarship has been confirmed and cannot be removed. Please
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
            <DialogTitle className="text-center">
              Are you sure you want to confirm this scholarship?
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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Applied Scholarships
        </h1>

        <div className="flex w-full relative">
          {!appliedCoursesArray || appliedCoursesArray.length === 0 ? (
            // Empty state with blur effect
            <div className="relative w-full">
              {/* Blurred background */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10 z-0"></div>

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
            <div
              className="flex overflow-x-auto space-x-3 hide-scrollbar"
              style={{
                scrollbarWidth: "thin",
                msOverflowStyle: "none",
              }}
            >
              {appliedCoursesArray.map(
                (application: AppliedScholarshipCourseProps) => {
                  const isConfirmed = application.isConfirmed || false;

                  return (
                    <div
                      key={application._id}
                      className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-col items-end gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-4 overflow-hidden border border-gray-200"
                    >
                      <div className="flex gap-2 pr-8">
                        <button className="px-2 bg-[#FCE7D2] text-black hover:text-white rounded-md hover:bg-red-700 transition-colors text-[14px] font-medium">
                          <a
                            href={`/scholarships/${application.ScholarshipId}`}
                          >
                            View
                          </a>
                        </button>
                        {/* ✅ UPDATED: Delete button with confirmation check */}
                        <button
                          className={`py-1 px-4 rounded-md transition-colors ${
                            isConfirmed
                              ? "text-black-400 bg-[#FCE7D2] cursor-not-allowed opacity-50"
                              : "text-black-600 hover:bg-red-50 cursor-pointer"
                          }`}
                          onClick={() =>
                            handleDeleteApplication(application._id)
                          }
                          title={
                            isConfirmed
                              ? "Cannot delete confirmed scholarship"
                              : "Delete Application"
                          }
                          disabled={isConfirmed}
                        >
                          <Image
                            src="/delete.svg"
                            alt="Delete Icon"
                            width={16}
                            height={16}
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="bg-white px-0 py-0 rounded-lg overflow-hidden mt-0">
                          <div className="flex items-center">
                            <div className="relative md:w-[200px] h-[150px] rounded-xl overflow-hidden">
                              <Image
                                src={
                                  application.banner ||
                                  "https://via.placeholder.com/200x150?text=No+Image"
                                }
                                alt={`${application.scholarshipName} banner`}
                                fill
                                className="object-cover"
                                sizes="192px"
                              />
                            </div>

                            <div className="flex-1 p-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-[12px] font-semibold">
                                    {application.scholarshipName}
                                  </p>
                                  <p className="text-[12px]">
                                    {application.courseName}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-[12px]">
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
                                <div className="flex items-center gap-2 mb-1">
                                  <Image
                                    src="/lang.svg"
                                    alt="Language Icon"
                                    width={16}
                                    height={16}
                                    className="w-3 h-3"
                                  />
                                  <span className="text-gray-600">
                                    {application.language || "Not specified"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <Image
                                  src="/ielts/Dollar.svg"
                                  alt="University Icon"
                                  width={16}
                                  height={16}
                                  className="w-4 h-4"
                                />
                                <span className="text-gray-600 text-[12px]">
                                  {application.universityName ||
                                    "Not specified"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <Image
                                  src="/vectoruni.svg"
                                  alt="Scholarship Type Icon"
                                  width={16}
                                  height={16}
                                  className="w-3 h-3"
                                />
                                <span className="text-gray-600 text-[12px]">
                                  Scholarship Type:{" "}
                                  {application.scholarshipType ||
                                    "Not specified"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/calender.svg"
                                  alt="Deadline Icon"
                                  width={16}
                                  height={16}
                                  className="w-3 h-3"
                                />
                                <span className="text-gray-600 text-[12px]">
                                  Deadline: {formatDate(application.deadline)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-evenly min-w-[140px]">
                              <div className="flex flex-col items-center mt-4">
                                <p className="text-[12px] font-semibold mb-2 text-center w-4/5">
                                  Application Success Chances
                                </p>
                                <CircularProgress progress={75} />
                              </div>
                            </div>
                          </div>

                          <div className=" border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[12px] font-medium px-2 py-1 rounded-lg text-white bg-red-600">
                                Current Status:
                              </span>
                              {/* ✅ UPDATED: Status with colored dot */}
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${getStatusDotColor(
                                    application.status,
                                    application.statusId
                                  )}`}
                                  title={`Status: ${getStatusLabel(
                                    application.status,
                                    application.statusId
                                  )}`}
                                />
                                <span className="text-xs font-medium text-gray-700">
                                  {getStatusLabel(
                                    application.status,
                                    application.statusId
                                  )}
                                </span>
                              </div>
                            </div>
                            {/* ✅ NEW: Confirm Scholarship Button */}
                            <button
                              onClick={() =>
                                handleConfirmButtonClick(application._id)
                              }
                              disabled={isConfirmed}
                              className={`px-6 py-2 rounded mr-4 text-white font-medium text-sm mt-2 ${
                                isConfirmed
                                  ? "bg-red-600 cursor-not-allowed"
                                  : "bg-[#C7161E] hover:bg-[#A01419] cursor-pointer"
                              }`}
                            >
                              {isConfirmed
                                ? "Confirmed"
                                : "Confirm Scholarship"}
                            </button>
                            {application.appliedAt && (
                              <div className="text-[12px] text-gray-500">
                                Applied: {formatDate(application.appliedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedScholarship;
