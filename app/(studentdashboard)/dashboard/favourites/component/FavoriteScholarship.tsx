"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/useUserData";
import toast from "react-hot-toast";
import { getAuthToken } from "@/utils/authHelper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Enhanced scholarship type definition matching your API response
type Scholarship = {
  _id: string;
  name: string;
  banner?: string;
  minimumRequirements?: string;
  description?: string;
  amount?: number;
  deadline?: string;
  eligibility?: string[];
  university?: string;
  hostCountry?: string;
  country?: string;
  category?: string;
  type?: string;
  duration?: {
    general?: string;
    bachelors?: string;
    masters?: string;
    phd?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  logo?: string;
};

// API response type
type ApiResponse = {
  success: boolean;
  message: string;
  scholarships: Scholarship[];
  stats: {
    totalFound: number;
    totalRequested: number;
    foundIds?: string[];
    notFoundIds?: string[];
  };
  error?: string;
};

export default function FavoriteScholarship() {
  const { user, fetchUserProfile } = useUserStore();
  const [favoriteList, setFavoriteList] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Helper function to get proper image URL
  const getImageUrl = (imageUrl?: string, defaultImage?: string) => {
    if (!imageUrl || imageUrl === "") {
      return defaultImage || "/default-banner.jpg";
    }

    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it starts with '/', it's already a proper path
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }

    // Otherwise, assume it needs to be prefixed
    return `/${imageUrl}`;
  };

  // Handle image load errors
  const handleImageError = (
    scholarshipId: string,
    imageType: "banner" | "logo"
  ) => {
    setImageErrors((prev) => ({
      ...prev,
      [`${scholarshipId}-${imageType}`]: true,
    }));
  };

  // Enhanced fetch function with better error handling and caching
  const fetchFavoriteScholarships = useCallback(
    async (forceRefresh = false) => {
      // console.log(
      //   "Fetching favorite scholarships for user:",
      //   user?.favouriteScholarship
      // );
      // console.log("User object:", user);

      // Reset error state
      setError(null);

      // Check if user exists and has favorite scholarships
      if (!user) {
        console.log("No user found");
        setFavoriteList([]);
        return;
      }

      // Handle the favouriteScholarships array properly
      const favoriteIds = user.favouriteScholarship || [];
      // console.log("Favorite scholarship IDs:", favoriteIds);

      if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
        console.log("No favorite scholarships found or invalid format");
        setFavoriteList([]);
        return;
      }

      // Avoid unnecessary API calls if we already have data
      if (!forceRefresh && favoriteList.length > 0) {
        return;
      }

      setLoading(true);

      try {
        // Convert array of IDs to comma-separated string for GET request
        const idsParam = favoriteIds.join(",");
        // console.log("IDs parameter:", idsParam);

        // Fetch scholarships with timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(
          `/api/getfavscholarship?ids=${encodeURIComponent(idsParam)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": forceRefresh
                ? "no-cache"
                : "public, max-age=300",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle different HTTP status codes
          let errorMessage = "Failed to fetch scholarships";

          switch (response.status) {
            case 400:
              errorMessage = "Invalid request parameters";
              break;
            case 404:
              errorMessage = "Scholarships not found";
              break;
            case 429:
              errorMessage = "Too many requests. Please wait and try again";
              break;
            case 503:
              errorMessage = "Service temporarily unavailable";
              break;
            default:
              errorMessage = `Server error (${response.status})`;
          }

          throw new Error(errorMessage);
        }

        const data: ApiResponse = await response.json();
        // console.log("API response data:", data);

        if (!data.success) {
          throw new Error(
            data.error || data.message || "Failed to fetch scholarships"
          );
        }

        // console.log("Fetched favorite scholarships:", data);

        // Sort scholarships by creation date (newest first) or name
        const sortedScholarships = (data.scholarships || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return a.name.localeCompare(b.name);
        });

        setFavoriteList(sortedScholarships);

        // Show informative messages
        if (data.stats.notFoundIds?.length) {
          const count = data.stats.notFoundIds.length;
          console.warn(
            "Some favorite scholarships were not found:",
            data.stats.notFoundIds
          );

          toast(
            `${count} favorite scholarship${count > 1 ? "s" : ""
            } no longer exist`,
            {
              icon: "⚠️",
              duration: 4000,
            }
          );
        }

        // Success message for refresh
        if (forceRefresh && data.scholarships.length > 0) {
          toast.success("Favorites refreshed successfully!");
        }
      } catch (error) {
        console.error("Error fetching favorite scholarships:", error);

        let errorMessage = "Failed to load favorite scholarships";

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage =
              "Request timed out. Please check your connection and try again.";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);

        // Only show toast for actual errors, not timeouts
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error(errorMessage);
        }

        setFavoriteList([]);
      } finally {
        setLoading(false);
      }
    },
    [user?.favouriteScholarship, favoriteList.length]
  );

  // console.log(favoriteList, "favoriteList from FavoriteScholarship component");

  // Fetch scholarships when user data changes
  useEffect(() => {
    // console.log("User data changed:", user);
    if (user && user.favouriteScholarship) {
      console.log("User has favorite scholarships:", user.favouriteScholarship);
      fetchFavoriteScholarships();
    } else {
      console.log("User has no favorite scholarships, clearing list");
      setFavoriteList([]);
    }
  }, [user, fetchFavoriteScholarships]);

  // Enhanced remove favorite function with optimistic updates
  const removeFavorite = async (id: string, scholarshipName: string) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setLoadingMap((prev) => ({ ...prev, [id]: true }));

    // Store original list for rollback
    const originalList = [...favoriteList];

    // Optimistic UI removal
    setFavoriteList((prev) => prev.filter((s) => s._id !== id));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}scholarships/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarshipId: id,
            action: "remove",
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
          errorData.error ||
          `Failed to remove favorite (${res.status})`
        );
      }

      // Refresh user profile to get updated favorites list
      await fetchUserProfile();
      toast.success(`"${scholarshipName}" removed from favorites!`);
    } catch (err) {
      console.error("Error removing favorite:", err);

      let errorMessage = "Could not remove favorite. Please try again.";

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);

      // Rollback optimistic UI update
      setFavoriteList(originalList);

      // Refresh user profile
      try {
        await fetchUserProfile();
      } catch (profileError) {
        console.error("Error refreshing user profile:", profileError);
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Retry function for error state
  const handleRetry = () => {
    setError(null);
    fetchFavoriteScholarships(true);
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchFavoriteScholarships(true);
  };

  // Format deadline date
  const formatDeadline = (deadline: string) => {
    try {
      // Handle different deadline formats like "20th February 2025"
      let dateStr = deadline;
      if (
        deadline.includes("th") ||
        deadline.includes("st") ||
        deadline.includes("nd") ||
        deadline.includes("rd")
      ) {
        // Convert "20th February 2025" to "February 20, 2025"
        const parts = deadline.match(/(\d+)(?:st|nd|rd|th)\s+(\w+)\s+(\d+)/);
        if (parts) {
          dateStr = `${parts[2]} ${parts[1]}, ${parts[3]}`;
        }
      }

      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (diffDays < 0) {
        return { text: formatted, class: "bg-gray-500", status: "expired" };
      } else if (diffDays <= 7) {
        return {
          text: formatted,
          class: "bg-red-500 animate-pulse",
          status: "urgent",
        };
      } else if (diffDays <= 30) {
        return { text: formatted, class: "bg-orange-500", status: "soon" };
      } else {
        return { text: formatted, class: "bg-blue-500", status: "normal" };
      }
    } catch {
      return { text: deadline, class: "bg-gray-500", status: "unknown" };
    }
  };

  // Format duration text
  const formatDuration = (duration: Scholarship["duration"]) => {
    if (!duration) return null;

    const parts = [];
    if (duration.masters && duration.masters.trim()) {
      parts.push(duration.masters.replace(",", ""));
    }
    if (duration.phd && duration.phd.trim()) {
      parts.push(duration.phd.replace(",", ""));
    }
    if (duration.bachelors && duration.bachelors.trim()) {
      parts.push(duration.bachelors.replace(",", ""));
    }
    if (duration.general && duration.general.trim()) {
      parts.push(duration.general.replace(",", ""));
    }

    return parts.length > 0 ? parts.join(", ") : null;
  };

  return (
    <div className="w-[95%] mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            My Favorite Scholarships
          </h2>
          {favoriteList.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {favoriteList.length} scholarship
              {favoriteList.length !== 1 ? "s" : ""} saved
            </p>
          )}
        </div>

        {favoriteList.length > 0 && (
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && favoriteList.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Loading your favorite scholarships...
            </p>
          </div>
        </div>
      ) : !user ? (
        /* Not Logged In */
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Login Required
            </h3>
            <p className="text-gray-700 mb-4">
              Please log in to see your favorite scholarships.
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Log In
            </Link>
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Favorites
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : favoriteList.length === 0 ? (
        /* Empty State */
        // <div className="text-center py-12">
        //   <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
        //     {/* <div className="text-6xl mb-4">📚</div> */}
        //     <h3 className="text-lg font-semibold text-gray-800 mb-2">
        //       No Favorites Yet
        //     </h3>
        //     <p className="text-gray-600 mb-4">
        //       You haven&apos;t favorited any scholarships yet.
        //     </p>
        //     <p className="text-sm text-gray-500 mb-6">
        //       Start exploring scholarships and save your favorites for easy
        //       access later.
        //     </p>
        //     <Link
        //       href="/scholarships"
        //       className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        //     >
        //       Browse Scholarships
        //     </Link>
        //   </div>
        // </div>
        <div className="text-center py-20">
          <Image
            src="/hearti.svg"
            width={60}
            height={60}
            alt="No favorites"
            className="mx-auto mb-4 opacity-50"
          />
          <p className="text-xl font-semibold text-gray-500">
            No favorite Scholarship yet
          </p>
          <p className="text-gray-400 mt-2 mb-4">
            Start exploring Scholarship and add them to your favorites!
          </p>
          <Link
            href="/scholarships"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        /* Scholarships Grid */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteList.map((scholarship) => {
              const deadlineInfo = scholarship.deadline
                ? formatDeadline(scholarship.deadline)
                : null;

              const durationText = formatDuration(scholarship.duration);

              const bannerUrl = getImageUrl(
                scholarship.banner,
                "/default-banner.jpg"
              );
              const logoUrl = getImageUrl(
                scholarship.logo,
                "/default-logo.png"
              );

              const bannerHasError = imageErrors[`${scholarship._id}-banner`];
              const logoHasError = imageErrors[`${scholarship._id}-logo`];

              return (
                <div
                  key={scholarship._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3"
                >
                  <div className="relative w-full">
                    {/* Background Image */}
                    <Image
                      src={bannerHasError ? "/default-banner.jpg" : bannerUrl}
                      alt={`${scholarship.name} Banner`}
                      width={400}
                      height={250}
                      className="w-full object-cover h-[170px] md:h-[180px] rounded-lg"
                      onError={() =>
                        handleImageError(scholarship._id, "banner")
                      }
                      onLoad={() => {
                        // Remove error state if image loads successfully
                        setImageErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors[`${scholarship._id}-banner`];
                          return newErrors;
                        });
                      }}
                    />

                    {/* Logo Overlay - Only show if logo exists and hasn't errored */}
                    {scholarship.logo && !logoHasError && (
                      <div className="absolute bottom-3 left-4 z-10 w-14 h-14 rounded-full bg-white border border-gray-300 p-1 shadow-md">
                        <Image
                          src={logoUrl}
                          alt={`${scholarship.name} Logo`}
                          width={52}
                          height={52}
                          className="rounded-full object-contain w-full h-full"
                          onError={() =>
                            handleImageError(scholarship._id, "logo")
                          }
                          onLoad={() => {
                            // Remove error state if image loads successfully
                            setImageErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[`${scholarship._id}-logo`];
                              return newErrors;
                            });
                          }}
                        />
                      </div>
                    )}

                    {/* Share & Remove Favorite Buttons */}
                    <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-gray-200 bg-opacity-40 backdrop-blur-sm rounded-md">
                      {/* Share Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button>
                            <Image
                              src="/university/Share.svg"
                              width={21}
                              height={21}
                              alt="Share"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Share link</DialogTitle>
                            <DialogDescription>
                              Anyone who has this link will be able to view
                              this.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label
                                htmlFor={`link-${scholarship._id}`}
                                className="sr-only"
                              >
                                Link
                              </Label>
                              <Input
                                id={`link-${scholarship._id}`}
                                value={`${typeof window !== "undefined"
                                    ? window.location.origin
                                    : ""
                                  }/scholarships/${scholarship._id}`}
                                readOnly
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="px-3"
                              onClick={() => {
                                const link = `${window.location.origin}/scholarships/${scholarship._id}`;
                                navigator.clipboard.writeText(link).then(() => {
                                  setCopiedLinkId(scholarship._id);
                                  setTimeout(() => setCopiedLinkId(null), 2000);
                                });
                              }}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy />
                            </Button>
                          </div>

                          {copiedLinkId === scholarship._id && (
                            <p className="text-black text-sm mt-2">
                              Link copied to clipboard!
                            </p>
                          )}

                          {/* Share buttons */}
                          <div className="mt-2 flex gap-4 justify-left">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `${window.location.origin}/scholarships/${scholarship._id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:underline"
                            >
                              <BsWhatsapp className="text-2xl" />
                            </a>
                            <a
                              href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                                `${window.location.origin}/scholarships/${scholarship._id}`
                              )}`}
                              className="text-blue-600 hover:underline"
                            >
                              <AiOutlineMail className="text-2xl text-red-600" />
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                `${window.location.origin}/scholarships/${scholarship._id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1877F2] hover:underline"
                            >
                              <FaFacebook className="text-blue-600 text-2xl" />
                            </a>
                          </div>

                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={() =>
                          removeFavorite(scholarship._id, scholarship.name)
                        }
                        disabled={loadingMap[scholarship._id]}
                        className={`transition-colors duration-200 ${loadingMap[scholarship._id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                      >
                        {loadingMap[scholarship._id] ? (
                          <div className="animate-spin rounded-full h-1 w-1 border-b-2 border-white"></div>
                        ) : (
                          <Image
                            src="/redheart.svg"
                            alt="heart"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                        )}
                      </button>
                    </div>

                    {/* Scholarship Type Badge */}
                    {scholarship.type && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                          {scholarship.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-2 flex-grow">
                    <Link
                      href={`/scholarships/${scholarship._id}`}
                      className="block"
                    >
                      <h3 className="font-bold text-[15px] leading-tight hover:underline underline-offset-4 cursor-pointer mb-2">
                        {scholarship.name}
                      </h3>
                    </Link>

                    {/* Scholarship Details */}
                    <div className="space-y-2">
                      {/* Minimum Requirements */}
                      {scholarship.minimumRequirements && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Min GPA:</span>{" "}
                          {scholarship.minimumRequirements}
                        </p>
                      )}

                      {/* Duration */}
                      {durationText && (
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {durationText}
                          </p>
                        </div>
                      )}

                      {/* Country */}
                      {scholarship.hostCountry && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {scholarship.hostCountry}
                          </p>
                        </div>
                      )}

                      {/* Deadline */}
                      {deadlineInfo && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span
                            className={`text-xs px-2 py-1 rounded-full text-white ${deadlineInfo.class}`}
                          >
                            {deadlineInfo.text}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {/* {scholarship.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {scholarship.description}
                      </p>
                    )} */}
                  </div>

                  {/* Action Button */}
                  <div className="p-2 pt-0">
                    <Link
                      href={`/scholarships/${scholarship._id}`}
                      className="block w-full bg-red-600 hover:bg-red-600 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary and Additional Info */}
          <div className="mt-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="text-gray-600">
                Showing {favoriteList.length} favorite scholarship
                {favoriteList.length !== 1 ? "s" : ""}
              </span>
              {user?.favouriteScholarship &&
                favoriteList.length !== user.favouriteScholarship.length && (
                  <span className="text-orange-600 text-sm font-medium">
                    ({user.favouriteScholarship.length - favoriteList.length}{" "}
                    unavailable)
                  </span>
                )}
            </div>

            {favoriteList.length > 0 && (
              <p className="text-xs text-gray-500">
                Click on scholarship names to view full details • Deadlines are
                color-coded by urgency
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
