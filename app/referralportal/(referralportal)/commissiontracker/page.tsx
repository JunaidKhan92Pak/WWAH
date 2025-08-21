"use client";

import { useState } from "react";
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
} from "lucide-react";

// Types
interface ReferralData {
  id: string;
  month: string;
  referrals: number;
  amount: number;
  status: "Paid" | "Pending";
}

// Dummy data
const allReferralData: ReferralData[] = [
  { id: "1", month: "May 2025", referrals: 18, amount: 1800, status: "Paid" },
  {
    id: "2",
    month: "April 2025",
    referrals: 12,
    amount: 1200,
    status: "Pending",
  },
  { id: "3", month: "March 2025", referrals: 24, amount: 2400, status: "Paid" },
  {
    id: "4",
    month: "February 2025",
    referrals: 15,
    amount: 1500,
    status: "Paid",
  },
  {
    id: "5",
    month: "January 2025",
    referrals: 9,
    amount: 900,
    status: "Pending",
  },
  {
    id: "6",
    month: "December 2026",
    referrals: 22,
    amount: 2200,
    status: "Paid",
  },
  {
    id: "7",
    month: "November 2026",
    referrals: 17,
    amount: 1700,
    status: "Pending",
  },
  {
    id: "8",
    month: "October 2027",
    referrals: 31,
    amount: 3100,
    status: "Paid",
  },
  {
    id: "9",
    month: "September 2028",
    referrals: 8,
    amount: 800,
    status: "Pending",
  },
  {
    id: "10",
    month: "August 2029",
    referrals: 14,
    amount: 1400,
    status: "Paid",
  },
];

const years = [2025, 2026, 2027, 2028, 2029];

export default function Dashboard() {
  const [selectedYears, setSelectedYears] = useState<number[]>([2025]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on selected years
  const filteredData = allReferralData.filter((item) => {
    const year = parseInt(item.month.split(" ")[1]);
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
  };

  const handleWithdrawalRequest = () => {
    setIsWithdrawalModalOpen(true);
    // Auto close after 3 seconds
    setTimeout(() => {
      setIsWithdrawalModalOpen(false);
    }, 3000);
  };

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-end items-center mb-8">
          {/* Filters Button */}
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
                    Filter
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                  
                  </Button>
                </div>

                <div className="space-y-4">
                  {years.map((year) => (
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
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
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
                  {paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-900">{item.month}</td>
                      <td className="py-4 px-6 text-gray-700">
                        {item.referrals}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {item.status === "Paid" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          ) : (
                            <Button
                              onClick={handleWithdrawalRequest}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              size="sm"
                            >
                              <span className="hidden sm:inline">
                                Request Withdrawal
                              </span>
                              <span className="sm:hidden">Request</span>
                            </Button>
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
                  {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} results
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Success Modal */}
        <Dialog
          open={isWithdrawalModalOpen}
          onOpenChange={setIsWithdrawalModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <div className="text-center py-8">
              {/* Success Icon with decorative elements */}
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
