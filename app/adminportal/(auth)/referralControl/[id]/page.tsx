"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authHelper";
import AdminCommissionForm from "@/app/adminportal/refportal/components/AdminCommissionForm";
import { DetailedInfo, Referral, User } from "@/types/reffertypes";
import { useRefUserStore } from "@/store/useRefDataStore";

export default function RefUserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const [updatingReferral, setUpdatingReferral] = useState<string | null>(null);
  const [editingCommission, setEditingCommission] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(0);
  const [updatingCommission, setUpdatingCommission] = useState(false);

  const {  clearError } = useRefUserStore() as {
    user: User | null;
    detailedInfo: DetailedInfo;
    loading: boolean;
    error: string | null;
    fetchUserProfile: (token: string | null) => Promise<void>;
    clearError: () => void;
  };

  // Local state for this specific user (not the store's current user)
  const [specificUser, setSpecificUser] = useState<User | null>(null);
  const [specificDetailedInfo, setSpecificDetailedInfo] =
    useState<DetailedInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  // Update commission rate
  const updateCommissionRate = async () => {
    const token = getAuthToken();
    if (!token) return;

    setUpdatingCommission(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/mbaData/user/${userId}/commission`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            commissionPerReferral: newCommissionRate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update commission rate");
      }

      const result = await response.json();

      // Update local specific user state
      if (specificUser) {
        setSpecificUser({
          ...specificUser,
          commissionPerReferral: newCommissionRate,
          totalCommissionEarned: result.user.totalCommissionEarned,
        });
      }

      setEditingCommission(false);
      alert("Commission rate updated successfully!");
    } catch (error) {
      console.error("Error updating commission rate:", error);
      alert("Failed to update commission rate. Please try again.");
    } finally {
      setUpdatingCommission(false);
    }
  };

  // Update referral status
  const updateReferralStatus = async (
    referralId: string,
    newStatus: "accepted" | "pending" | "rejected"
  ) => {
    const token = getAuthToken();
    if (!token) return;

    setUpdatingReferral(referralId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/referrals/update-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            referralId,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update referral status");
      }

      // Update local specific user state and recalculate commission
      if (specificUser) {
        const updatedReferrals =
          specificUser.referrals?.map((ref) =>
            ref.id === referralId ? { ...ref, status: newStatus } : ref
          ) || [];

        const acceptedReferrals = updatedReferrals.filter(
          (ref) => ref.status === "accepted"
        ).length;
        const totalCommissionEarned =
          acceptedReferrals * (specificUser.commissionPerReferral || 0);

        setSpecificUser({
          ...specificUser,
          referrals: updatedReferrals,
          acceptedReferrals,
          totalCommissionEarned,
        });
      }

      console.log(`Referral ${referralId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating referral status:", error);
      alert("Failed to update referral status. Please try again.");
    } finally {
      setUpdatingReferral(null);
    }
  };

  // Fetch specific user data by ID
  const fetchSpecificUserData = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/mbaData/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`
        );
      }

      const userData = await response.json();

      // Transform detailed info
      const transformedDetailedInfo = {
        AcademicInformation: userData.AcademmicInfo || {
          currentDegree: "",
          program: "",
          uniName: "",
          currentSemester: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        paymentInformation: userData.paymentInfo || {
          preferredPaymentMethod: "",
          bankAccountTitle: "",
          bankName: "",
          accountNumberIban: "",
          mobileWalletNumber: "",
          accountHolderName: "",
          termsAndAgreement: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        workExperience: userData.workExp || {
          hasWorkExperience: false,
          hasBrandAmbassador: false,
          jobDescription: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      if (userData.user) {
        const user: User = {
          _id: userData.user._id || "",
          firstName: userData.user.firstName || "",
          lastName: userData.user.lastName || "",
          email: userData.user.email || "",
          phone: userData.user.phone || 0,
          facebook: userData.user.facebook || "",
          instagram: userData.user.instagram || "",
          linkedin: userData.user.linkedin || "",
          contactNo: userData.user.contactNo || "",
          dob: userData.user.dob || "",
          country: userData.user.country || "",
          nationality: userData.user.nationality || "",
          gender: userData.user.gender || "",
          city: userData.user.city || "",
          createdAt: userData.user.createdAt || "",
          updatedAt: userData.user.updatedAt || "",
          countryCode: userData.user.countryCode || "",
          profilePicture: userData.user.profilePicture || "",
          coverPhoto: userData.user.coverPhoto || "",
          referralCode: userData.user?.referralCode || "",
          referrals: (userData.user?.referrals || []).map((ref: Referral) => ({
            firstName: ref.firstName || "",
            lastName: ref.lastName || "",
            id: ref.id || "",
            profilePicture: ref.profilePicture || "",
            status: ref.status || "pending",
            createdAt: ref.createdAt || new Date().toISOString(),
          })) as Referral[],
          refId: userData.user?.refId || "",
          totalReferrals: userData.user?.totalReferrals || 0,
          // Commission fields
          commissionPerReferral: userData.user?.commissionPerReferral || 0,
          acceptedReferrals: userData.user?.acceptedReferrals || 0,
          totalCommissionEarned: userData.user?.totalCommissionEarned || 0,
        };

        // Set initial commission rate for editing
        setNewCommissionRate(user.commissionPerReferral);

        // Set local state for this specific user
        setSpecificUser(user);
        setSpecificDetailedInfo(transformedDetailedInfo);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching specific user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
      setLoading(false);
    }
  };

  // Fetch user data when userId is available
  useEffect(() => {
    if (userId) {
      fetchSpecificUserData(userId);
    }
  }, [userId]);

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold text-lg mb-2">Error</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => {
              if (userId) {
                fetchSpecificUserData(userId);
              }
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!specificUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600">
            No user data available for ID: {userId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {specificUser?.profilePicture ? (
                  <img
                    src={specificUser.profilePicture}
                    alt={`${specificUser.firstName} ${specificUser.lastName}`}
                    className="h-20 w-20 rounded-full object-cover border-4 border-white border-opacity-20"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                    {specificUser?.firstName?.charAt(0)}
                    {specificUser?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {specificUser.firstName} {specificUser.lastName}
                </h1>
                <p className="text-xl opacity-90">{specificUser.email}</p>
                <p className="opacity-80">User ID: {userId}</p>
                <div className="flex items-center flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-80">Referral Code:</span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-mono">
                      {specificUser?.referralCode || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-80">Total Referrals:</span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-bold">
                      {specificUser?.totalReferrals}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-80">Accepted:</span>
                    <span className="bg-green-500 bg-opacity-20 px-2 py-1 rounded text-sm font-bold">
                      {specificUser?.acceptedReferrals || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Summary Card */}
        <div className="bg-white shadow-lg rounded-lg mb-8">
          <div className="bg-green-50 px-6 py-4 border-b rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              💰 Commission Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Commission Per Referral
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      Rs: 
                      {specificUser?.commissionPerReferral?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCommission(true);
                      setNewCommissionRate(
                        specificUser?.commissionPerReferral || 0
                      );
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Accepted Referrals
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {specificUser?.acceptedReferrals || 0}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Total Commission Earned
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    Rs: 
                    {specificUser?.totalCommissionEarned?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Rate Editor */}
            {editingCommission && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Update Commission Rate
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Per Referral (Rs: )
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={newCommissionRate}
                      onChange={(e) =>
                        setNewCommissionRate(parseInt(e.target.value) || 0)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter commission amount in rupees"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={updateCommissionRate}
                      disabled={updatingCommission}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingCommission ? "Updating..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommission(false);
                        setNewCommissionRate(
                          specificUser?.commissionPerReferral || 0
                        );
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  New total commission: Rs: 
                  {(
                    (specificUser?.acceptedReferrals || 0) * newCommissionRate
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.firstName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.lastName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser?.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.contactNo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.dob
                      ? new Date(specificUser.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nationality
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.nationality || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.country || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {specificUser.city || "N/A"}
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              {(specificUser.facebook ||
                specificUser.instagram ||
                specificUser.linkedin) && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {specificUser.facebook && (
                      <a
                        href={specificUser.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        Facebook
                      </a>
                    )}
                    {specificUser.instagram && (
                      <a
                        href={specificUser.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 hover:bg-pink-200"
                      >
                        Instagram
                      </a>
                    )}
                    {specificUser.linkedin && (
                      <a
                        href={specificUser.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {specificUser.createdAt
                        ? new Date(specificUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {specificUser.updatedAt
                        ? new Date(specificUser.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Academic Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {specificDetailedInfo?.AcademicInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Degree
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.AcademicInformation.currentDegree ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Program
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.AcademicInformation.program ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      University Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.AcademicInformation.uniName ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Semester
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.AcademicInformation
                        .currentSemester || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No academic information available
                </p>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Work Experience
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {specificDetailedInfo?.workExperience ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Has Work Experience
                      </label>
                      <span
                        className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          specificDetailedInfo.workExperience.hasWorkExperience
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {specificDetailedInfo.workExperience.hasWorkExperience
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Brand Ambassador
                      </label>
                      <span
                        className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          specificDetailedInfo.workExperience.hasBrandAmbassador
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {specificDetailedInfo.workExperience.hasBrandAmbassador
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                  {specificDetailedInfo.workExperience.jobDescription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job Description
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {specificDetailedInfo.workExperience.jobDescription}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No work experience information available
                </p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {specificDetailedInfo?.paymentInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Payment Method
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.paymentInformation
                        .preferredPaymentMethod || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Account Title
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.paymentInformation
                        .bankAccountTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.paymentInformation.bankName ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number/IBAN
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {specificDetailedInfo.paymentInformation.accountNumberIban
                        ? `****${specificDetailedInfo.paymentInformation.accountNumberIban.slice(
                            -4
                          )}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Wallet Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.paymentInformation
                        .mobileWalletNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {specificDetailedInfo.paymentInformation
                        .accountHolderName || "N/A"}
                    </p>
                  </div>
                  {specificDetailedInfo.paymentInformation
                    .termsAndAgreement && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Terms & Agreement
                      </label>
                      <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Agreed
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No payment information available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Commission Form - Pass the userId from params */}
        <AdminCommissionForm userId={userId} />

        {/* Referrals Section */}
        <div className="mt-8 bg-white shadow-lg rounded-lg">
          <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-900">
              Referrals ({specificUser?.referrals?.length || 0})
            </h2>
          </div>
          <div className="p-6">
            {specificUser?.referrals && specificUser.referrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission Impact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {specificUser.referrals.map(
                      (referral: Referral, index: number) => (
                        <tr key={referral.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-10 w-10">
                              {referral.profilePicture ? (
                                <img
                                  src={referral.profilePicture}
                                  alt={`${referral.firstName} ${referral.lastName}`}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {referral.firstName?.charAt(0)}
                                    {referral.lastName?.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {referral.firstName} {referral.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {referral.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                referral.status
                              )}`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {referral.status === "accepted" ? (
                              <span className="text-green-600 font-medium">
                                +Rs: 
                                {specificUser.commissionPerReferral?.toLocaleString() ||
                                  "0"}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                Rs: 
                                {specificUser.commissionPerReferral?.toLocaleString() ||
                                  "0"}{" "}
                                (pending)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  updateReferralStatus(referral.id, "accepted")
                                }
                                disabled={
                                  updatingReferral === referral.id ||
                                  referral.status === "accepted"
                                }
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingReferral === referral.id
                                  ? "..."
                                  : "Accept"}
                              </button>
                              <button
                                onClick={() =>
                                  updateReferralStatus(referral.id, "pending")
                                }
                                disabled={
                                  updatingReferral === referral.id ||
                                  referral.status === "pending"
                                }
                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingReferral === referral.id
                                  ? "..."
                                  : "Pending"}
                              </button>
                              <button
                                onClick={() =>
                                  updateReferralStatus(referral.id, "rejected")
                                }
                                disabled={
                                  updatingReferral === referral.id ||
                                  referral.status === "rejected"
                                }
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingReferral === referral.id
                                  ? "..."
                                  : "Reject"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Referrals Yet
                </h3>
                <p className="text-gray-500">
                  This user hasn&apos;t referred anyone yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Referral Control
          </button>
        </div>
      </div>
    </div>
  );
}
