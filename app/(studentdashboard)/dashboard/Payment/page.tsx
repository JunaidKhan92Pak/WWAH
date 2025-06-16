"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DataRangeDialog from "./components/DateRangeDialog";
import { getAuthToken } from "@/utils/authHelper";

// Define the transaction status type
type Status = "pending" | "approved";

// Define the transaction interface
interface Transaction {
  _id: string;
  transactionName: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const token = getAuthToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/adminControls/getPaymentStats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Payments fetched:", result);

        if (result.success) {
          // Handle different response structures
          let paymentsData = [];

          if (result.data) {
            paymentsData = Array.isArray(result.data)
              ? result.data
              : [result.data];
          }

          // Filter out any null or invalid entries
            paymentsData = paymentsData.filter(
            (payment: Transaction | null | undefined): payment is Transaction => payment !== null && payment !== undefined && !!payment._id
            );

          setTransactions(paymentsData);
        } else {
          // If API returns success: false but it's just no data, don't treat as error
          if (
            result.message?.toLowerCase().includes("no data") ||
            result.message?.toLowerCase().includes("not found") ||
            !result.data
          ) {
            setTransactions([]);
          } else {
            setError(result.message || "Failed to fetch payments");
          }
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        // Only set error for actual network/server errors, not "no data" scenarios
        if (err instanceof Error) {
          if (
            err.message.includes("404") ||
            err.message.includes("not found")
          ) {
            setTransactions([]); // Treat 404 as no data, not an error
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-600";
      case "approved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `$ ${amount.toFixed(2)} ${currency}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="px-4 ml-auto rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
            <p className="text-sm hidden sm:block">
              Showing data history of current month.
            </p>
          </div>
          <div className="bg-gray-100 flex items-center justify-center">
            <DataRangeDialog />
          </div>
        </div>
        <div className="flex justify-center items-center h-40 border rounded-lg bg-gray-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E]"></div>
            <div className="text-gray-600">Loading payment history...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (only for actual errors, not no data)
  if (error) {
    return (
      <div className="px-4 ml-auto rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
            <p className="text-sm hidden sm:block">
              Showing data history of current month.
            </p>
          </div>
          <div className="bg-gray-100 flex items-center justify-center">
            <DataRangeDialog />
          </div>
        </div>
        <div className="flex justify-center items-center h-40 border rounded-lg bg-red-50">
          <div className="flex flex-col items-center space-y-3 text-center px-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div className="text-red-700 font-medium">
              Oops! Something went wrong
            </div>
            <div className="text-red-600 text-sm">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 ml-auto rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-base sm:text-lg">Payment Tracker & History!</h4>
          <p className="text-sm hidden sm:block">
            Showing data history of current month.
          </p>
        </div>
        <div className="bg-gray-100 flex items-center justify-center">
          <DataRangeDialog />
        </div>
      </div>

      <div className="relative">
        {/* No Data State - Beautiful UI */}
        {transactions.length === 0 ? (
          <div className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4 px-8">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                No Payment History Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                You don&apos;t have any payment transactions yet. Once you make
                your first payment, it will appear here with all the details.
              </p>
            </div>
          </div>
        ) : (
          // Table with data
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-black">
                    <TableHead>Transaction Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Transaction ID
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Amount
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.transactionName}</TableCell>
                      <TableCell className="font-mono hidden md:table-cell">
                        {transaction.transactionId}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-3 justify-center gap-2 w-full h-9 sm:w-4/5 lg:w-2/3 rounded-lg ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          <span className="capitalize">
                            {transaction.status}
                          </span>
                          <span className="text-4xl pb-1">•</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination - only show if there are transactions */}
            {transactions.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: Math.ceil(transactions.length / itemsPerPage) },
                      (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(
                              Math.ceil(transactions.length / itemsPerPage),
                              p + 1
                            )
                          )
                        }
                        className={
                          currentPage ===
                          Math.ceil(transactions.length / itemsPerPage)
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
