"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReferralModal from "./components/ReferralModal";
import totalSignups from "../../../../public/refferalportal/Overview/totalSignups.svg";
import pendingSignups from "../../../../public/refferalportal/Overview/pendingSignups.svg";
import approvedSignups from "../../../../public/refferalportal/Overview/approvedSignups.svg";
import rejectedSignups from "../../../../public/refferalportal/Overview/rejectedSignups.svg";
import profits from "../../../../public/refferalportal/Overview/profits.svg";
import Image, { StaticImageData } from "next/image";
import refer from "../../../../public/refferalportal/Overview/refer.svg";
import { getAuthToken } from "@/utils/authHelper";

// Define proper TypeScript interfaces
interface StatData {
  title: string;
  value: string;
  icon: StaticImageData; // You might want to import StaticImageData from 'next/image' for better typing
  bgColor: string;
  iconColor: string;
}

interface ReferralData {
  name: string;
  initials: string;
  status: string;
  date: string;
  statusColor: string;
  referralId: string;
  profilePicture?: string | null;
  commissionEarned: number;
}

interface CommissionData {
  commissionPerReferral: number;
  totalCommissionEarned: number;
  currency: string;
}

interface APIStatsResponse {
  data: {
    totalReferrals: number;
    pending: number;
    approved: number;
    rejected: number;
    totalCommissionEarned: number;
  };
}

interface APIReferral {
  referral: {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
    createdAt: string;
    profilePicture?: string;
  };
}

interface APIReferralsResponse {
  data: {
    referrerName?: string;
    commissionData?: CommissionData;
    referrals: APIReferral[];
    pagination?: {
      current: number; // API uses 'current' not 'currentPage'
      pages: number; // API uses 'pages' not 'totalPages'
      total: number; // API uses 'total' not 'totalItems'
      limit: number;
      currentPage?: number;
      totalPages?: number;
      totalItems?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  };
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [referralsData, setReferralsData] = useState<ReferralData[]>([]);
  const [referrerName, setReferrerName] = useState<string>("");
  const [commissionData, setCommissionData] = useState<CommissionData>({
    commissionPerReferral: 0,
    totalCommissionEarned: 0,
    currency: "PKR",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalReferrals, setTotalReferrals] = useState<number>(0);
  const [loadingReferrals, setLoadingReferrals] = useState<boolean>(false);
  const itemsPerPage = 5;
  console.log(totalReferrals);
  // Fetch statistics (only once)
  const fetchStats = async (): Promise<void> => {
    try {
      const token = getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/referrals/my-statistics`,
        {
          headers,
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const statsResult: APIStatsResponse = await statsResponse.json();

      const updatedStatsData: StatData[] = [
        {
          title: "Total Sign-ups",
          value: statsResult.data.totalReferrals.toString(),
          icon: totalSignups,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          title: "Pending Sign-ups",
          value: statsResult.data.pending.toString(),
          icon: pendingSignups,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
        },
        {
          title: "Approved Sign-ups",
          value: statsResult.data.approved.toString(),
          icon: approvedSignups,
          bgColor: "bg-pink-50",
          iconColor: "text-pink-600",
        },
        {
          title: "Rejected Sign-ups",
          value: statsResult.data.rejected.toString(),
          icon: rejectedSignups,
          bgColor: "bg-gray-50",
          iconColor: "text-gray-600",
        },
        {
          title: "Total Commission Earned",
          value: `Rs: ${statsResult.data.totalCommissionEarned.toLocaleString()} `,
          icon: profits,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
      ];

      setStatsData(updatedStatsData);
    } catch (err: unknown) {
      console.error("Error fetching stats:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  // Fetch referrals with pagination
  const fetchReferrals = async (page: number): Promise<void> => {
    try {
      setLoadingReferrals(true);

      const token = getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const referralsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/referrals/my-referrals?page=${page}&limit=${itemsPerPage}`,
        {
          headers,
        }
      );

      if (!referralsResponse.ok) {
        throw new Error("Failed to fetch referrals");
      }

      const referralsResult: APIReferralsResponse =
        await referralsResponse.json();

      // Set referrer name and commission data (only on first load)
      if (page === 1) {
        if (referralsResult.data && referralsResult.data.referrerName) {
          setReferrerName(referralsResult.data.referrerName);
        }

        if (referralsResult.data && referralsResult.data.commissionData) {
          setCommissionData({
            commissionPerReferral:
              referralsResult.data.commissionData.commissionPerReferral,
            totalCommissionEarned:
              referralsResult.data.commissionData.totalCommissionEarned,
            currency: referralsResult.data.commissionData.currency,
          });
        }
      }

      // Transform referrals data
      const transformedReferralsData: ReferralData[] =
        referralsResult.data.referrals.map((item: APIReferral) => ({
          name: `${item.referral.firstName} ${item.referral.lastName}`,
          initials: `${item.referral.firstName.charAt(
            0
          )}${item.referral.lastName.charAt(0)}`,
          status:
            item.referral.status.charAt(0).toUpperCase() +
            item.referral.status.slice(1),
          date: new Date(item.referral.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          }),
          statusColor: getStatusColor(item.referral.status),
          referralId: item.referral.id,
          profilePicture: item.referral.profilePicture,
          commissionEarned:
            item.referral.status === "accepted"
              ? commissionData.commissionPerReferral
              : 0,
        }));

      setReferralsData(transformedReferralsData);

      // Update pagination info using the correct property names
      if (referralsResult.data.pagination) {
        const paginationData = referralsResult.data.pagination;

        // Use the actual API response property names
        const totalPages =
          paginationData.pages || paginationData.totalPages || 1;
        const totalItems =
          paginationData.total || paginationData.totalItems || 0;
        const currentPageFromAPI =
          paginationData.current || paginationData.currentPage || page;

        setTotalPages(totalPages);
        setTotalReferrals(totalItems);
        setCurrentPage(currentPageFromAPI);

        console.log("Setting pagination from API:", {
          totalPages,
          totalItems,
          currentPage: currentPageFromAPI,
          rawPaginationData: paginationData,
        });
      } else {
        // Fallback logic when no pagination data is provided
        console.log("No pagination data from API, using fallback");

        if (transformedReferralsData.length < itemsPerPage && page === 1) {
          setTotalPages(1);
          setTotalReferrals(transformedReferralsData.length);
        } else if (transformedReferralsData.length < itemsPerPage && page > 1) {
          setTotalPages(page);
          setTotalReferrals(
            (page - 1) * itemsPerPage + transformedReferralsData.length
          );
        } else {
          // Assume there might be more pages
          setTotalPages(page + 1);
          setTotalReferrals(
            (page - 1) * itemsPerPage + transformedReferralsData.length
          );
        }
      }
    } catch (err: unknown) {
      console.error("Error fetching referrals:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoadingReferrals(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      try {
        setLoading(true);
        await Promise.all([fetchStats(), fetchReferrals(1)]);
      } catch (err: unknown) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchReferrals(newPage);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
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

  function getDarkerBgColor(lightColor: string): string {
    const shadeMap: Record<string, string> = {
      "bg-blue-50": "bg-blue-200",
      "bg-yellow-50": "bg-yellow-200",
      "bg-pink-50": "bg-pink-200",
      "bg-gray-50": "bg-gray-200",
      "bg-green-50": "bg-green-200",
      "bg-purple-50": "bg-purple-200",
    };
    return shadeMap[lightColor] || lightColor;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <Card
          className="shadow-sm overflow-hidden relative"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #FCE7D2 100%)",
          }}
        >
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-xl sm:text-2xl">👋</div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                Welcome, {referrerName || "MBA"}!
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Track your performance, rewards and upcoming goals at a glance.
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-3 flex lg:flex-col items-center justify-evenly gap-1  lg:justify-center">
                  {/* Icon and Title Row */}
                  <div className="flex items-center justify-center gap-2 sm:gap-1 h-16">
                    <div className="rounded-lg flex sm:w-1/2 h-full  items-center justify-center">
                      <Image
                        src={stat.icon}
                        alt="icon"
                        width={0}
                        height={20}
                        className={`h-10 ${stat.iconColor}`}
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 leading-tight w-full h-full flex items-center justify-center">
                      {stat.title}
                    </p>
                  </div>

                  {/* Value */}
                  <div
                    className={`flex justify-center items-center rounded-lg h-10 px-2 min-w-11 ${getDarkerBgColor(
                      stat.bgColor
                    )}`}
                  >
                    <span className="text-md sm:text-md lg:text-md font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refer & Make Money Section */}
        <Card
          className="shadow-sm overflow-hidden relative"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #FCE7D2 100%)",
          }}
        >
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Refer & Make Money
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  Help students join WWAH and earn up to 1,000/- per referral.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm sm:text-base font-medium rounded-full transition-colors w-full sm:w-auto"
                >
                  Generate your Referral Link
                </Button>
              </div>

              {/* Decorative Element */}
              <div className="flex-shrink-0 hidden lg:block">
                <Image
                  src={refer}
                  alt="Refer illustration"
                  width={120}
                  height={120}
                  className="object-contain xl:w-[150px] xl:h-[150px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Referrals Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                My Referrals ({totalReferrals})
              </h3>
              {totalPages > 1 && (
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            {loadingReferrals ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : referralsData.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <p className="text-gray-500 text-sm sm:text-base">
                  No referrals found
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 lg:space-y-4">
                  {referralsData.map((referral, index) => (
                    <div
                      key={referral.referralId || index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors w-full"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3 sm:w-[30%] flex-1">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          {referral.profilePicture ? (
                            <img
                              src={referral.profilePicture}
                              alt={referral.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-red-600 text-white font-medium text-xs sm:text-sm">
                              {referral.initials}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                            {referral.name}
                          </p>
                        </div>
                      </div>

                      {/* Status and Info */}
                      <div className="sm:w-[30%]">
                        <p className="border-0 font-medium px-2 sm:px-3 py-1 flex-shrink-0 w-full flex justify-center items-center">
                          {referral.status}
                        </p>
                      </div>
                      <div className="sm:w-[30%] ">
                        <span className="text-gray-500 flex-shrink-0 flex justify-center items-center">
                          {referral.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center sm:justify-end gap-3 mt-6 pt-4  border-gray-100">
                    {/* Previous Button */}
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </Button>

                    {/* Page Indicator */}
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
                      {currentPage} of {totalPages}
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
