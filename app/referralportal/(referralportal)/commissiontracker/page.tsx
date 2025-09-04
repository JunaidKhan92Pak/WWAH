"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRefUserStore } from "@/store/useRefDataStore";
import { getAuthToken } from "@/utils/authHelper";
import { IoAlertCircle } from "react-icons/io5";
import { Commission } from "@/types/reffertypes";

export default function Dashboard() {
  const {
    user,
    commissions,
    loading,
    error,
    fetchUserProfile,
    fetchCommissions,
    updateCommission,
    clearError,
  } = useRefUserStore();

  const [selectedYears, setSelectedYears] = useState<number[]>([2025]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestingWithdrawal, setRequestingWithdrawal] = useState<
    string | null
  >(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Debug logging
  useEffect(() => {
    console.log("Dashboard Debug Info:");
    console.log("User:", user);
    console.log("Commissions:", commissions);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [user, commissions, loading, error]);

  // Get unique years from commission data
  const availableYears = Array.from(
    new Set(
      commissions
        .map((commission) => {
          const year = commission.month.split(" ")[1];
          return parseInt(year);
        })
        .filter((year) => !isNaN(year))
    )
  ).sort((a, b) => b - a);

  // Fetch user profile first, then commissions
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      console.log("Fetching user profile...");
      fetchUserProfile(token);
    }
  }, [fetchUserProfile, user]);

  // Fetch commissions when user is available
  useEffect(() => {
    if (user?._id) {
      console.log("Fetching commissions for user:", user._id);
      fetchCommissions(user._id);
    }
  }, [user?._id, fetchCommissions]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Filter data based on selected years
  const filteredData = commissions.filter((commission) => {
    const yearStr = commission.month.split(" ")[1];
    const year = parseInt(yearStr);
    return selectedYears.includes(year);
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
    setCurrentPage(1);
  };

  const handleWithdrawalRequest = async (commissionId: string) => {
    if (!user?._id) {
      alert("User not found. Please refresh the page.");
      return;
    }

    setRequestingWithdrawal(commissionId);

    try {
      const success = await updateCommission(user._id, commissionId, {
        status: "Requested",
      });

      if (success) {
        setIsWithdrawalModalOpen(true);
        setTimeout(() => {
          setIsWithdrawalModalOpen(false);
        }, 3000);
      } else {
        alert("Failed to request withdrawal. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      alert("Failed to request withdrawal. Please try again.");
    } finally {
      setRequestingWithdrawal(null);
    }
  };

  // Replace the logo loading section in your generatePDF function with this improved version:

  const generatePDF = async (commission: Commission) => {
    if (!user) {
      alert("User data not available");
      return;
    }

    setDownloadingPdf(commission._id);

    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      let yPos = 20;

      // Improved logo loading with better error handling and fallback
      try {
        const logoUrl = "/logopng.png"; // Make sure this path is correct

        // Check if the logo exists first
        const response = await fetch(logoUrl);
        if (response.ok) {
          // Create canvas to convert image to base64
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new Error("Could not get canvas 2d context");
          }

          const img = new Image();

          await new Promise((resolve, reject) => {
            img.onload = () => {
              // Set canvas dimensions
              canvas.width = img.width;
              canvas.height = img.height;

              // Draw image on canvas
              ctx.drawImage(img, 0, 0);

              // Get base64 data
              const dataUrl = canvas.toDataURL("image/png");

              // Add logo to PDF
              const logoWidth = 40;
              const logoHeight = 20;
              const logoX = (pageWidth - logoWidth) / 2;

              try {
                doc.addImage(
                  dataUrl,
                  "PNG",
                  logoX,
                  yPos,
                  logoWidth,
                  logoHeight
                );
                console.log("Logo added successfully");
              } catch (pdfError) {
                console.error("Error adding logo to PDF:", pdfError);
              }

              resolve(true);
            };

            img.onerror = (error) => {
              console.error("Failed to load logo image:", error);
              reject(error);
            };

            // Set crossOrigin before src to avoid CORS issues
            img.crossOrigin = "anonymous";
            img.src = logoUrl;
          });

          yPos += 35; // Space after logo
        } else {
          console.log("Logo file not found at path:", logoUrl);
          yPos += 10; // Minimal space when no logo
        }
      } catch (logoError) {
        console.error("Logo loading error:", logoError);
        // Continue without logo - don't break the PDF generation
        yPos += 10;
      }

      // Rest of your PDF generation code remains the same...
      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(`Payment Invoice - ${commission.month}`, pageWidth / 2, yPos, {
        align: "center",
      });

      yPos += 20;

      // Company Info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("World Wide Admission Hub", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 10;
      doc.text("Head Office: Al Waheeda, Dubai.", pageWidth / 2, yPos, {
        align: "center",
      });

      yPos += 30;

      // Invoice Details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice Details", 20, yPos);

      yPos += 20;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      // User and Commission Info
      doc.text(`Name: ${user.firstName} ${user.lastName}`, 20, yPos);
      yPos += 15;
      doc.text(`Number of Referrals: ${commission.referrals}`, 20, yPos);
      yPos += 15;
      doc.text(
        `Amount Paid: Rs. ${commission.amount.toLocaleString()}`,
        20,
        yPos
      );
      yPos += 15;
      doc.text(`Date of Payment: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 15;
      doc.text(
        `Purpose of Payment: Commission Payment - ${commission.month}`,
        20,
        yPos
      );

      yPos += 30;

      // Statement
      doc.setFont("helvetica", "bold");
      doc.text("Statement:", 20, yPos);
      yPos += 15;
      doc.setFont("helvetica", "normal");
      const statementText =
        "We confirm that the above amount has been paid to the provided bank account. No other payments are pending for this period.";
      const splitStatement = doc.splitTextToSize(statementText, pageWidth - 40);
      doc.text(splitStatement, 20, yPos);

      yPos += splitStatement.length * 5 + 20;

      // Signature section
      doc.setFont("helvetica", "bold");
      doc.text("Authorized Signature / Company Seal", 20, yPos);
      yPos += 30;
      doc.line(20, yPos, 120, yPos);
      yPos += 10;
      doc.setFont("helvetica", "normal");
      doc.text("Company Representative", 20, yPos);

      // Footer
      doc.setFontSize(8);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        20,
        pageHeight - 15
      );

      // Download the PDF
      doc.save(
        `Payment_Invoice_${commission.month.replace(" ", "_")}_${
          user.firstName
        }_${user.lastName}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(null);
    }
  };
  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`;

  // Force refresh function for debugging
  const handleForceRefresh = () => {
    const token = getAuthToken();
    if (token && user?._id) {
      console.log("Force refreshing data...");
      fetchUserProfile(token);
      fetchCommissions(user._id);
    }
  };

  // Loading state
  if (!user || (loading && commissions.length === 0)) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                <span className="ml-2 text-gray-600">
                  {!user ? "Loading user data..." : "Loading commissions..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state with refresh button
  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoAlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-2">Error loading data</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <div className="space-x-2">
                  <Button
                    onClick={handleForceRefresh}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Retry
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Current state:", {
                        user,
                        commissions,
                        loading,
                        error,
                      });
                    }}
                    variant="outline"
                  >
                    Debug Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with user info and debug info */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">
            View your commission records and manage withdrawals
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Debug: User ID: {user._id} | Commissions Count: {commissions.length}
            <Button
              onClick={handleForceRefresh}
              size="sm"
              variant="outline"
              className="ml-2 text-xs h-6"
            >
              Refresh Data
            </Button>
          </div>
        </div> */}

        {/* Header */}
        <div className="flex justify-end items-center mb-8">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filter by Year
                  </h2>
                </div>

                <div className="space-y-4">
                  {availableYears.length > 0 ? (
                    (availableYears as number[]).map((year: number) => (
                      <div
                        key={year}
                        className="flex items-center justify-between"
                      >
                        <label
                          htmlFor={`year-${year}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {year}
                        </label>
                        <Checkbox
                          id={`year-${year}`}
                          checked={selectedYears.includes(year)}
                          onCheckedChange={() => handleYearToggle(year)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No data available to filter
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {commissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  No commission records found
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Commission records will appear here once available
                </p>
                <Button
                  onClick={handleForceRefresh}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Refresh Data
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr className="bg-gray-50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Month
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Referrals
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Amount
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((commission: Commission) => (
                        <tr
                          key={commission._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 text-gray-900">
                            {commission.month}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {commission.referrals}
                          </td>
                          <td className="py-4 px-6 text-gray-900 font-medium">
                            {formatCurrency(commission.amount)}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                commission.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : commission.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {commission.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {commission.status === "Paid" ? (
                                <Button
                                  onClick={() => generatePDF(commission)}
                                  disabled={downloadingPdf === commission._id}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  {downloadingPdf === commission._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                  <span className="hidden sm:inline">
                                    Download
                                  </span>
                                </Button>
                              ) : commission.status === "Pending" ? (
                                <Button
                                  onClick={() =>
                                    handleWithdrawalRequest(commission._id)
                                  }
                                  disabled={
                                    requestingWithdrawal === commission._id
                                  }
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  size="sm"
                                >
                                  {requestingWithdrawal === commission._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <span className="hidden sm:inline">
                                      Request Withdrawal
                                    </span>
                                  )}
                                  <span className="sm:hidden">Request</span>
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Requested
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                      of {filteredData.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Success Modal */}
        <Dialog
          open={isWithdrawalModalOpen}
          onOpenChange={setIsWithdrawalModalOpen}
        >
          <DialogContent className="w-[90%] mx-auto sm:max-w-md rounded-sm">
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                <div className="absolute -top-1 right-4 w-1 h-1 bg-orange-300 rounded-full"></div>
                <div className="absolute -bottom-2 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  Your withdrawal request has been submitted.
                </p>
                <p className="text-sm text-gray-600">
                  You will be paid within 3-5 business days.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
