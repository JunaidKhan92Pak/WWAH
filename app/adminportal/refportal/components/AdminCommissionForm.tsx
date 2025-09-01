"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit3,
  Save,
  X,
  Trash2,
  Plus,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import { useRefUserStore, Commission } from "@/store/useRefDataStore";

interface AdminCommissionFormProps {
  userId: string;
}

export default function AdminCommissionForm({
  userId,
}: AdminCommissionFormProps) {
  const {
    user,
    commissions,
    loading,
    error,
    fetchUserProfile,
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    clearError,
  } = useRefUserStore();

  const [formData, setFormData] = useState({
    month: "",
    referrals: "",
    amount: "",
    status: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCommission, setEditingCommission] = useState<string | null>(
    null
  );
  const [editedData, setEditedData] = useState<Partial<Commission>>({});
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  const months = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025",
    "July 2025",
    "August 2025",
    "September 2025",
    "October 2025",
    "November 2025",
    "December 2025",
  ];

  const statuses: Commission["status"][] = ["Paid", "Pending", "Requested"];

  // Calculate total amount for form
  const calculateTotalAmount = (
    referrals: string | number,
    perReferralAmount: string | number
  ): number => {
    const refs =
      typeof referrals === "string" ? parseFloat(referrals) : referrals;
    const amount =
      typeof perReferralAmount === "string"
        ? parseFloat(perReferralAmount)
        : perReferralAmount;

    if (isNaN(refs) || isNaN(amount) || refs < 0 || amount < 0) {
      return 0;
    }

    return refs * amount;
  };

  // Calculate total amount for editing
  const calculateEditTotalAmount = (): number => {
    return calculateTotalAmount(
      editedData.referrals || 0,
      editedData.amount || 0
    );
  };

  // Fetch user profile and commissions on component mount
  useEffect(() => {
    if (userId) {
      fetchUserProfile(""); // You might need to pass admin token here
      fetchCommissions(userId);
    }
  }, [userId, fetchCommissions, fetchUserProfile]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const generatePDF = async (commission: Commission) => {
    // Check if we have user data, if not try to fetch it
    if (!user) {
      alert(
        "MBA user data not available. Please refresh the page and try again."
      );
      return;
    }

    setDownloadingPdf(commission._id);

    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(`Payment Invoice - ${commission.month}`, pageWidth / 2, 30, {
        align: "center",
      });

      // Company Info (You can customize this)
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Your Company Name", pageWidth / 2, 45, { align: "center" });
      doc.text("Company Address", pageWidth / 2, 55, { align: "center" });

      // Invoice Details
      let yPos = 80;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice Details", 20, yPos);

      yPos += 20;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      // MBA Info
      doc.text(`MBA Name: ${user.firstName} ${user.lastName}`, 20, yPos);
      yPos += 15;
      doc.text(`MBA ID: ${user._id}`, 20, yPos);
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

      // Generate transaction ID (you might want to store this in DB)
      const transactionId = `TXN${Date.now()}${commission._id.slice(-4)}`;
      doc.text(`Transaction ID: ${transactionId}`, 20, yPos);
      yPos += 15;
      doc.text(
        `Purpose of Payment: Commission Payment - ${commission.month}`,
        20,
        yPos
      );

      // Statement
      yPos += 30;
      doc.setFont("helvetica", "bold");
      doc.text("Statement:", 20, yPos);
      yPos += 15;
      doc.setFont("helvetica", "normal");
      const statementText =
        "We confirm that the above amount has been paid to the provided bank account. No other payments are pending for this period.";
      const splitStatement = doc.splitTextToSize(statementText, pageWidth - 40);
      doc.text(splitStatement, 20, yPos);

      // Signature section
      yPos += 40;
      doc.setFont("helvetica", "bold");
      doc.text("Authorized Signature / Company Seal", 20, yPos);
      yPos += 30;
      doc.line(20, yPos, 120, yPos); // Signature line
      yPos += 10;
      doc.setFont("helvetica", "normal");
      doc.text("Company Representative", 20, yPos);

      // Footer
      doc.setFontSize(8);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        20,
        doc.internal.pageSize.getHeight() - 20
      );

      // Download the PDF
      doc.save(
        `Admin_Payment_Invoice_${commission.month.replace(" ", "_")}_${
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

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.month ||
      !formData.referrals ||
      !formData.amount ||
      !formData.status
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (!userId) {
      alert("User ID is missing");
      return;
    }

    // Validate numbers
    const referralsNum = Number(formData.referrals);
    const perReferralAmount = Number(formData.amount);

    if (isNaN(referralsNum) || referralsNum < 0) {
      alert("Please enter a valid number of referrals");
      return;
    }

    if (isNaN(perReferralAmount) || perReferralAmount < 0) {
      alert("Please enter a valid amount per referral");
      return;
    }

    const totalAmount = calculateTotalAmount(referralsNum, perReferralAmount);

    setFormLoading(true);

    try {
      const success = await createCommission(userId, {
        month: formData.month,
        referrals: referralsNum,
        amount: totalAmount, // Send calculated total amount
        status: formData.status as Commission["status"],
      });

      if (success) {
        alert("Commission saved successfully!");
        setFormData({ month: "", referrals: "", amount: "", status: "" });
        setShowAddForm(false);
      } else {
        alert("Error saving commission. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Error saving commission:", err);

      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("Error: Failed to save commission");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status: Commission["status"]) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "Pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Requested":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: Commission["status"]) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "Pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "Requested":
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const handleEditStart = (commission: Commission) => {
    setEditingCommission(commission._id);
    // When editing, we need to reverse-calculate the per referral amount
    const perReferralAmount =
      commission.referrals > 0 ? commission.amount / commission.referrals : 0;
    setEditedData({
      month: commission.month,
      referrals: commission.referrals,
      amount: perReferralAmount,
      status: commission.status,
    });
  };

  const handleEditSave = async (commissionId: string) => {
    if (
      !editedData.month ||
      editedData.referrals === undefined ||
      editedData.amount === undefined ||
      !editedData.status
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editedData.referrals < 0 || editedData.amount < 0) {
      alert("Referrals and amount must be positive numbers");
      return;
    }

    const totalAmount = calculateEditTotalAmount();

    setIsLoading(commissionId);

    try {
      const success = await updateCommission(userId, commissionId, {
        ...editedData,
        amount: totalAmount, // Send calculated total amount
      });

      if (success) {
        setEditingCommission(null);
        setEditedData({});
      } else {
        alert("Failed to update commission. Please try again.");
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      alert("Failed to update commission. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditCancel = () => {
    setEditingCommission(null);
    setEditedData({});
  };

  const handleStatusChange = async (
    commissionId: string,
    newStatus: Commission["status"]
  ) => {
    setIsLoading(commissionId);

    try {
      const success = await updateCommission(userId, commissionId, {
        status: newStatus,
      });

      if (!success) {
        alert("Failed to update commission status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating commission status:", error);
      alert("Failed to update commission status. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteCommission = async (commissionId: string) => {
    if (!confirm("Are you sure you want to delete this commission record?")) {
      return;
    }

    setIsLoading(commissionId);

    try {
      const success = await deleteCommission(userId, commissionId);

      if (!success) {
        alert("Failed to delete commission. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting commission:", error);
      alert("Failed to delete commission. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  // Loading state
  if (loading && commissions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
              <span className="ml-2 text-gray-600">Loading commissions...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && commissions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 mb-2">Error loading commissions</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={() => fetchCommissions(userId)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Admin Commission Tracker
              </CardTitle>
              {userId && (
                <p className="text-sm text-gray-600 mt-1">User ID: {userId}</p>
              )}
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              <Plus className="w-4 h-4" />
              Add Commission
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Add Commission Form */}
          {showAddForm && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Commission Record
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Month Dropdown */}
                  <div>
                    <Label>Month *</Label>
                    <Select
                      onValueChange={(val) => handleChange("month", val)}
                      value={formData.month}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Referrals Input */}
                  <div>
                    <Label>Referrals *</Label>
                    <Input
                      type="number"
                      placeholder="Enter number of referrals"
                      value={formData.referrals}
                      onChange={(e) =>
                        handleChange("referrals", e.target.value)
                      }
                      min="0"
                    />
                  </div>

                  {/* Amount Per Referral Input */}
                  <div>
                    <Label>Amount Per Referral *</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount per referral"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <Label>Status *</Label>
                    <Select
                      onValueChange={(val) => handleChange("status", val)}
                      value={formData.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Total Amount Display */}
                {formData.referrals && formData.amount && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">
                      Total Amount:
                    </div>
                    <div className="text-xl font-bold text-blue-700">
                      Rs.
                      {calculateTotalAmount(
                        formData.referrals,
                        formData.amount
                      ).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={formLoading || !userId}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    {formLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Commission Record
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Commission Records Table */}
          {commissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg mb-2">
                No commission records found
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Get started by adding your first commission record
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Commission
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Month
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Referrals
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Total Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((commission: Commission) => (
                      <tr
                        key={commission._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {/* Month */}
                        <td className="py-4 px-4">
                          {editingCommission === commission._id ? (
                            <Select
                              value={editedData.month || ""}
                              onValueChange={(val) =>
                                setEditedData({ ...editedData, month: val })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {commission.month}
                            </span>
                          )}
                        </td>

                        {/* Referrals */}
                        <td className="py-4 px-4">
                          {editingCommission === commission._id ? (
                            <Input
                              type="number"
                              value={editedData.referrals || 0}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  referrals: parseInt(e.target.value) || 0,
                                })
                              }
                              min="0"
                              className="w-20"
                            />
                          ) : (
                            <span className="text-gray-900">
                              {commission.referrals}
                            </span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4">
                          {editingCommission === commission._id ? (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                value={editedData.amount || 0}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    amount: parseFloat(e.target.value) || 0,
                                  })
                                }
                                min="0"
                                step="0.01"
                                className="w-24"
                                placeholder="Per referral"
                              />
                              <div className="text-xs text-gray-600">
                                Total: Rs.{" "}
                                {calculateEditTotalAmount().toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-900">
                              Rs. {commission.amount.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                commission.status
                              )}`}
                            >
                              {getStatusIcon(commission.status)}
                              {commission.status}
                            </span>
                            {isLoading === commission._id && (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                            )}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {editingCommission === commission._id ? (
                              <>
                                <button
                                  onClick={() => handleEditSave(commission._id)}
                                  disabled={isLoading === commission._id}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Save changes"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                  title="Cancel editing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                {commission.status === "Paid" && (
                                  <button
                                    onClick={() => generatePDF(commission)}
                                    disabled={downloadingPdf === commission._id}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
                                    title="Download Payment Invoice"
                                  >
                                    {downloadingPdf === commission._id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                                <Select
                                  value={commission.status}
                                  onValueChange={(val: Commission["status"]) =>
                                    handleStatusChange(commission._id, val)
                                  }
                                  disabled={isLoading === commission._id}
                                >
                                  <SelectTrigger className="w-24 h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statuses.map((s) => (
                                      <SelectItem key={s} value={s}>
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <button
                                  onClick={() => handleEditStart(commission)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit commission"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCommission(commission._id)
                                  }
                                  disabled={isLoading === commission._id}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete commission"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Commission Summary */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Commission Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {commissions.filter((c) => c.status === "Paid").length}
                    </div>
                    <div className="text-sm text-gray-600">Paid</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {commissions.filter((c) => c.status === "Pending").length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        commissions.filter((c) => c.status === "Requested")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Requested</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">
                      Rs.
                      {commissions
                        .reduce((sum, c) => sum + c.amount, 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
