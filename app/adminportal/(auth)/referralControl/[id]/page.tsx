"use client";

import React, { useEffect, useState } from "react";
// import { useRefUserStore } from "@/store/refUserStore";
import { getAuthToken } from "@/utils/authHelper";
import { useRefUserStore } from "@/store/useRefDataStore";

export default function RefUserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const { user, detailedInfo, loading, error, fetchUserProfile, clearError } =
    useRefUserStore();

  // Unwrap params
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  // Fetch specific user data by ID
  const fetchSpecificUserData = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
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

      // Transform and set the data similar to your store logic
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

      // You'll need to add these to your store or use local state
      // For now, we'll use the store's setUser method
      if (userData.user) {
        const user = {
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
        };

        // You might want to extend your store to handle this admin view data
        useRefUserStore.setState({
          user,
          detailedInfo: transformedDetailedInfo,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error fetching specific user:", error);
      useRefUserStore.setState({
        error:
          error instanceof Error ? error.message : "Failed to fetch user data",
        loading: false,
      });
    }
  };

  // Fetch user data when userId is available
  useEffect(() => {
    if (userId) {
      useRefUserStore.setState({ loading: true, error: null });
      fetchSpecificUserData(userId);
    }
  }, [userId]);

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

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
              const token = getAuthToken();
              fetchUserProfile(token);
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
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
                <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xl opacity-90">{user.email}</p>
                <p className="opacity-80">User ID: {userId}</p>
              </div>
            </div>
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
                    {user.firstName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.lastName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.contactNo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nationality
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.nationality || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.country || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.city || "N/A"}
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              {(user.facebook || user.instagram || user.linkedin) && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {user.facebook && (
                      <a
                        href={user.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        Facebook
                      </a>
                    )}
                    {user.instagram && (
                      <a
                        href={user.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 hover:bg-pink-200"
                      >
                        Instagram
                      </a>
                    )}
                    {user.linkedin && (
                      <a
                        href={user.linkedin}
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
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
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
              {detailedInfo?.AcademicInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Degree
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.AcademicInformation.currentDegree || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Program
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.AcademicInformation.program || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      University Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.AcademicInformation.uniName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Semester
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.AcademicInformation.currentSemester ||
                        "N/A"}
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
              {detailedInfo?.workExperience ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Has Work Experience
                      </label>
                      <span
                        className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          detailedInfo.workExperience.hasWorkExperience
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {detailedInfo.workExperience.hasWorkExperience
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
                          detailedInfo.workExperience.hasBrandAmbassador
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {detailedInfo.workExperience.hasBrandAmbassador
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                  {detailedInfo.workExperience.jobDescription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job Description
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {detailedInfo.workExperience.jobDescription}
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
              {detailedInfo?.paymentInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Payment Method
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.paymentInformation.preferredPaymentMethod ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Account Title
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.paymentInformation.bankAccountTitle ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.paymentInformation.bankName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number/IBAN
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {detailedInfo.paymentInformation.accountNumberIban
                        ? `****${detailedInfo.paymentInformation.accountNumberIban.slice(
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
                      {detailedInfo.paymentInformation.mobileWalletNumber ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailedInfo.paymentInformation.accountHolderName ||
                        "N/A"}
                    </p>
                  </div>
                  {detailedInfo.paymentInformation.termsAndAgreement && (
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
