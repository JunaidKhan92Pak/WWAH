// import { CheckCircle, Clock } from "lucide-react";

// export const PaymentTracker = ({
//   payments,
//   onStatusUpdate,
// }: {
//   payments: Array<{
//     _id: string;
//     user: string;
//     transactionName: string;
//     transactionId: string;
//     amount: number;
//     currency: string;
//     status: "pending" | "approved" | "rejected" | "completed";
//     createdAt: string;
//     updatedAt: string;
//     description?: string;
//     paymentMethod?: string;
//   }>;
//   onStatusUpdate: (paymentId: string, newStatus: string) => void;
// }) => {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "approved":
//       case "completed":
//         return "text-green-600 bg-green-50";
//       case "pending":
//         return "text-orange-600 bg-orange-50";
//       case "rejected":
//         return "text-red-600 bg-red-50";
//       default:
//         return "text-gray-600 bg-gray-50";
//     }
//   };

//   const handleStatusChange = async (paymentId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/updatePaymentStatus`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             paymentId,
//             status: newStatus,
//           }),
//         }
//       );

//       if (response.ok) {
//         onStatusUpdate(paymentId, newStatus);
//       } else {
//         console.error("Failed to update payment status");
//       }
//     } catch (error) {
//       console.error("Error updating payment status:", error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border p-6 my-8">
//       <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//         <svg
//           className="w-5 h-5 text-green-500"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//           />
//         </svg>
//         Payment Tracker & History
//       </h2>

//       {payments.length === 0 ? (
//         <div className="text-center py-8">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               className="w-8 h-8 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600">No payment transactions found</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Transaction Name
//                 </th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Transaction ID
//                 </th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Amount
//                 </th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Date
//                 </th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((payment) => (
//                 <tr
//                   key={payment._id}
//                   className="border-b border-gray-100 hover:bg-gray-50"
//                 >
//                   <td className="py-4 px-4">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {payment.transactionName}
//                       </p>
//                       {payment.description && (
//                         <p className="text-sm text-gray-600">
//                           {payment.description}
//                         </p>
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
//                       #{payment.transactionId}
//                     </code>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span className="font-semibold text-gray-900">
//                       ${payment.amount.toFixed(2)} {payment.currency}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
//                         payment.status
//                       )}`}
//                     >
//                       {payment.status === "approved" && (
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                       )}
//                       {payment.status === "pending" && (
//                         <Clock className="w-3 h-3 mr-1" />
//                       )}
//                       {payment.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-600">
//                     {new Date(payment.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="py-4 px-4">
//                     <select
//                       value={payment.status}
//                       onChange={(e) =>
//                         handleStatusChange(payment._id, e.target.value)
//                       }
//                       className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="completed">Completed</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Payment Summary */}
//       {payments.length > 0 && (
//         <div className="mt-6 pt-6 border-t">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Payment Summary
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-green-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-green-600">
//                 {
//                   payments.filter(
//                     (p) => p.status === "approved" || p.status === "completed"
//                   ).length
//                 }
//               </div>
//               <div className="text-sm text-gray-600">Approved</div>
//             </div>
//             <div className="bg-orange-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-orange-600">
//                 {payments.filter((p) => p.status === "pending").length}
//               </div>
//               <div className="text-sm text-gray-600">Pending</div>
//             </div>
//             <div className="bg-red-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-red-600">
//                 {payments.filter((p) => p.status === "rejected").length}
//               </div>
//               <div className="text-sm text-gray-600">Rejected</div>
//             </div>
//             <div className="bg-red-50 rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-red-600">
//                 ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
//               </div>
//               <div className="text-sm text-gray-600">Total Amount</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  X,
  Edit3,
  Save,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { getAuthToken } from "@/utils/authHelper";

interface Payment {
  _id: string;
  user: string;
  transactionName: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "approved";
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
}

interface PaymentTrackerProps {
  studentId: string;
  params: { id: string };
  onStatusUpdate?: (paymentId: string, newStatus: string) => void;
  onPaymentUpdate?: (
    paymentId: string,
    updatedPayment: Partial<Payment>
  ) => void;
  onPaymentAdd?: (newPayment: Payment) => void;
  onPaymentDelete?: (paymentId: string) => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  studentId,
  params,
  onStatusUpdate,
  onPaymentUpdate,
  onPaymentAdd,
  onPaymentDelete,
}) => {
  // State to manage payments internally - Initialize as empty array
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Payment>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState<
    Omit<Payment, "_id" | "createdAt" | "updatedAt">
  >({
    user: studentId,
    transactionName: "",
    transactionId: "",
    amount: 0,
    currency: "USD",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Fetch payments on component mount
  useEffect(() => {
    const fetchPaymentData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/adminControls/getPayments/${params.id}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch payment data: ${res.status}`);
        }

        const jsonData = await res.json();
        console.log(jsonData, "res from payment update api");

        // Handle the updated API response structure with better error handling
        if (jsonData.success && jsonData.data && Array.isArray(jsonData.data)) {
          setPayments(jsonData.data);
        } else if (jsonData.data === null || jsonData.data === undefined) {
          // Handle case where no payments exist (empty array)
          setPayments([]);
        } else {
          console.warn("Unexpected API response structure:", jsonData);
          setPayments([]);
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch payments"
        );
        setPayments([]); // Ensure payments is always an array
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPaymentData();
    }
  }, [params.id]);

  // Update the newPayment state when studentId changes
  useEffect(() => {
    setNewPayment((prev) => ({
      ...prev,
      user: studentId,
    }));
  }, [studentId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Internal function to update payment status in local state
  const handlePaymentStatusUpdate = (paymentId: string, newStatus: string) => {
    setPayments((prevPayments) => {
      console.log("Updating payment status for payments:", prevPayments);

      // Ensure we have a valid array
      if (!Array.isArray(prevPayments)) {
        console.error("prevPayments is not an array:", prevPayments);
        return prevPayments;
      }

      // Update the specific payment's status
      const updatedPayments = prevPayments.map((payment) =>
        payment._id === paymentId
          ? {
              ...payment,
              status: newStatus as "pending" | "approved",
              updatedAt: new Date().toISOString(),
            }
          : payment
      );

      console.log("Updated payments:", updatedPayments);
      return updatedPayments;
    });
  };

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    setIsLoading(paymentId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/adminControls/updatePaymentStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Status update response:", responseData);

        // Update local state using internal function
        handlePaymentStatusUpdate(paymentId, newStatus);

        // Call parent callback if provided
        if (onStatusUpdate) {
          onStatusUpdate(paymentId, newStatus);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update payment status:", errorData);
        throw new Error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditStart = (payment: Payment) => {
    setEditingPayment(payment._id);
    setEditedData({
      transactionName: payment.transactionName,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
    });
  };

  const handleEditSave = async (paymentId: string) => {
    setIsLoading(paymentId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/updatePayment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            ...editedData,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Edit response:", responseData);

        // Update local state with proper validation
        setPayments((prevPayments) => {
          if (!Array.isArray(prevPayments)) {
            console.error("prevPayments is not an array:", prevPayments);
            return prevPayments;
          }

          return prevPayments.map((payment) =>
            payment._id === paymentId
              ? {
                  ...payment,
                  ...editedData,
                  updatedAt: new Date().toISOString(),
                }
              : payment
          );
        });

        setEditingPayment(null);
        setEditedData({});

        // Call parent callback if provided
        if (onPaymentUpdate) {
          onPaymentUpdate(paymentId, editedData);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update payment:", errorData);
        throw new Error("Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditCancel = () => {
    setEditingPayment(null);
    setEditedData({});
  };

  const handleAddPayment = async () => {
    console.log(newPayment, "new payment data to be added");
    if (
      !newPayment.transactionName ||
      !newPayment.transactionId ||
      newPayment.amount <= 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading("new");
    const token = getAuthToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/adminControls/createPaymentTrack`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(newPayment),
        }
      );

      if (response.ok) {
        const createdPaymentResponse = await response.json();
        const createdPayment =
          createdPaymentResponse.data || createdPaymentResponse;

        console.log("Created payment:", createdPayment);

        // Add to local state with proper validation
        setPayments((prevPayments) => {
          if (!Array.isArray(prevPayments)) {
            console.error("prevPayments is not an array:", prevPayments);
            return [createdPayment];
          }
          return [...prevPayments, createdPayment];
        });

        // Reset form
        setNewPayment({
          user: studentId,
          transactionName: "",
          transactionId: "",
          amount: 0,
          currency: "USD",
          status: "pending",
        });
        setShowAddForm(false);

        // Call parent callback if provided with the complete payment object
        if (onPaymentAdd) {
          onPaymentAdd(createdPayment);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to add payment:", errorData);
        throw new Error("Failed to add payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) {
      return;
    }

    setIsLoading(paymentId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/deletePayment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (response.ok) {
        // Remove from local state with proper validation
        setPayments((prevPayments) => {
          if (!Array.isArray(prevPayments)) {
            console.error("prevPayments is not an array:", prevPayments);
            return prevPayments;
          }
          return prevPayments.filter((payment) => payment._id !== paymentId);
        });

        // Call parent callback if provided
        if (onPaymentDelete) {
          onPaymentDelete(paymentId);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete payment:", errorData);
        throw new Error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 my-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
          <span className="ml-2 text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 my-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-2">Error loading payments</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Ensure payments is always an array before rendering
  const safePayments = Array.isArray(payments) ? payments : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Payment Tracker & History
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      {/* Add Payment Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Payment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Name *
              </label>
              <input
                type="text"
                value={newPayment.transactionName}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    transactionName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Application Fee"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID *
              </label>
              <select
                value={newPayment.transactionId}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    transactionId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Transaction Type</option>
                <option value="application">Application Processing Fee</option>
                <option value="accommodation">Accommodation Booking Fee</option>
                <option value="airport">Airport Pickup Fee</option>
                <option value="english">
                  English Language Proficiency Booking fee
                </option>
                <option value="Service">Service Plan Fee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="1"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={newPayment.currency}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, currency: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newPayment.status}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    status: e.target.value as Payment["status"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddPayment}
              disabled={isLoading === "new"}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading === "new" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Payment
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {safePayments.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No payment transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Transaction Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {safePayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    {editingPayment === payment._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.transactionName || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              transactionName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.transactionName}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {editingPayment === payment._id ? (
                      <select
                        value={editedData.transactionId || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            transactionId: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="">Select Transaction Type</option>
                        <option value="application">
                          Application Processing Fee
                        </option>
                        <option value="accommodation">
                          Accommodation Booking Fee
                        </option>
                        <option value="airport">Airport Pickup Fee</option>
                        <option value="english">
                          English Language Proficiency Booking fee
                        </option>
                        <option value="Service">Service Plan Fee</option>
                      </select>
                    ) : (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        #{payment.transactionId}
                      </code>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {editingPayment === payment._id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={editedData.amount || 0}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <select
                          value={editedData.currency || "USD"}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              currency: e.target.value,
                            })
                          }
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                        </select>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {payment.amount.toFixed(2)} {payment.currency}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status === "approved" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {payment.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {payment.status}
                      </span>
                      {isLoading === payment._id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {editingPayment === payment._id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(payment._id)}
                            disabled={isLoading === payment._id}
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
                          <select
                            value={payment.status}
                            onChange={(e) =>
                              handleStatusChange(payment._id, e.target.value)
                            }
                            disabled={isLoading === payment._id}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                          </select>
                          <button
                            onClick={() => handleEditStart(payment)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit payment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment._id)}
                            disabled={isLoading === payment._id}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete payment"
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
      )}

      {/* Payment Summary */}
      {safePayments.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {safePayments.filter((p) => p.status === "approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {safePayments.filter((p) => p.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">
                {safePayments.length}
              </div>
              <div className="text-sm text-gray-600">Total Payments</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                ${safePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
