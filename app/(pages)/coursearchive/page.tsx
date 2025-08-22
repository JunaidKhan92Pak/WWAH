"use client";
import React, { useEffect, Suspense, useCallback, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineSortByAlpha } from "react-icons/md";
import {
  FaFacebook,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useCourseStore } from "@/store/useCoursesStore";
import FilterComponent from "./components/Filtercomponent";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/skeleton";
import { debounce } from "lodash";
import ImageWithLoader from "@/components/ImageWithLoader";
import { Copy } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

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
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserData";
import toast from "react-hot-toast";
import { getAuthToken } from "@/utils/authHelper";
import { useRouter, useSearchParams } from "next/navigation";

interface Course {
  _id: string;
  title: string;
  description?: string;
  // add any other relevant fields from your schema
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseArchive />
    </Suspense>
  );
};

const CourseArchive = () => {
  const {
    courses,
    setSearch,
    setSortOrder,
    currentPage,
    totalPages,
    setPage,
    loading,
    fetchCourses,
    setCountryFilter, // ✅ Make sure it's destructured here
  } = useCourseStore();

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [localSearch, setLocalSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [heartAnimation, setHeartAnimation] = useState<string | null>(null);
  const [favoriteCourses, setFavoriteCourses] = useState<
    Record<string, (typeof courses)[0]>
  >({});
const router = useRouter();
  const { user, fetchUserProfile } = useUserStore();
  const [loadingFavorites, setLoadingFavorites] = useState<
    Record<string, boolean>
  >({});

  // Initialize favorites from user data
  useEffect(() => {
    const initializeFavorites = () => {
      if (user?.favouriteCourse && Array.isArray(user.favouriteCourse)) {
        console.log("User favorite courses:", user.favouriteCourse);

        const favoriteMap: Record<string, boolean> = {};
        const favoriteCoursesMap: Record<string, Course> = {};

        user.favouriteCourse.forEach((course: unknown) => {
          // Handle different possible data structures
          let courseId: string | undefined;
          if (typeof course === "object" && course !== null) {
            courseId =
              (course as { _id?: string; id?: string })._id ||
              (course as { id?: string }).id;
          } else if (typeof course === "string") {
            courseId = course;
          }
          if (courseId) {
            favoriteMap[courseId] = true;
            // If the course object has full data, store it
            if (
              typeof course === "object" &&
              course !== null &&
              (course as { _id?: string; course_title?: string })._id &&
              (course as { course_title?: string }).course_title
            ) {
              favoriteCoursesMap[courseId] = course as Course;
            }
          }
        });

        setFavorites(favoriteMap);
        setFavoritesCount(Object.keys(favoriteMap).length);

        if (Object.keys(favoriteCoursesMap).length > 0) {
          setFavoriteCourses(favoriteCoursesMap);
        }
      } else {
        // Reset favorites if no user or no favorite courses
        setFavorites({});
        setFavoritesCount(0);
        setFavoriteCourses({});
      }
    };

    initializeFavorites();
  }, [user?.favouriteCourse]);

  // Fetch user profile on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, user]);

  // Update favoriteCourses when courses are loaded and we have favorites
  useEffect(() => {
    if (courses.length > 0 && Object.keys(favorites).length > 0) {
      const updatedFavoriteCourses: Record<string, string> = {};

      courses.forEach((course) => {
        if (favorites[course._id]) {
          updatedFavoriteCourses[course._id] = course;
        }
      });

      setFavoriteCourses((prev) => ({
        ...prev,
        ...updatedFavoriteCourses,
      }));
    }
  }, [courses, favorites]);

  console.log("Current user:", user);
  console.log("User favorite courses:", user?.favouriteCourse);
  console.log("Favorites state:", favorites);
  console.log("Favorites count:", favoritesCount);

  // Function to add/remove course from favorites in database
  const toggleFavorite = async (courseId: string, action: "add" | "remove") => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}favorites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const result = await response.json();
      // console.log("Favorite updated successfully", result);

      // Refresh user profile to get updated favorites
      await fetchUserProfile();

      return result;
    } catch (error) {
      console.error("Error updating favorites:", error);
      throw error;
    }
  };
  const showLoginPrompt = () => {
    toast.error("Please login to add courses to your favorites!", {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #fecaca",
      },
    });
  };

  // ✅ Function to add a course to applied courses
  const addToAppliedCourses = async (courseId: unknown) => {
    const token = getAuthToken();

    if (!token) {
      showLoginPrompt();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action: "add",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add course to applied courses");
      }

      const data = await response.json();
      console.log("Course added to applied courses:", data);
      toast.success("Course added to applied courses!", {
        duration: 2000,
        position: "top-center",
      });
      router.push("/dashboard/overview");

      return data;
    } catch (error) {
      console.error("Error adding course to applied courses:", error);
      toast.error("Failed to add course. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
      throw error;
    }
  };
  const toggleFavoriteInDB = async (id: string) => {
    const token = getAuthToken();

    if (!token) {
      showLoginPrompt();
      return;
    }

    setLoadingFavorites((prev) => ({ ...prev, [id]: true }));

    try {
      const isCurrentlyFavorited = favorites[id];
      const action = isCurrentlyFavorited ? "remove" : "add";

      // Optimistic UI update
      setFavorites((prev) => {
        const updatedFavorites = { ...prev, [id]: !prev[id] };
        const newCount = Object.values(updatedFavorites).filter(Boolean).length;
        setFavoritesCount(newCount);
        return updatedFavorites;
      });

      // Animate heart
      setHeartAnimation(id);
      setTimeout(() => setHeartAnimation(null), 1000);

      // Update favoriteCourses state
      setFavoriteCourses((prevCourses) => {
        const updated = { ...prevCourses };
        const courseObj = courses.find((c) => c._id === id);

        if (!isCurrentlyFavorited && courseObj) {
          updated[id] = courseObj;
        } else {
          delete updated[id];
        }

        return updated;
      });

      // Call backend
      await toggleFavorite(id, action);

      toast.success(
        action === "add"
          ? "Course added to favorites!"
          : "Course removed from favorites!",
        {
          duration: 2000,
          position: "top-center",
        }
      );
    } catch (error) {
      console.error("Failed to update favorites:", error);

      // Revert optimistic UI on failure
      setFavorites((prev) => {
        const revertedFavorites = { ...prev, [id]: !prev[id] };
        const newCount =
          Object.values(revertedFavorites).filter(Boolean).length;
        setFavoritesCount(newCount);
        return revertedFavorites;
      });

      // Revert favoriteCourses
      setFavoriteCourses((prevCourses) => {
        const reverted = { ...prevCourses };
        const courseObj = courses.find((c) => c._id === id);

        if (favorites[id] && courseObj) {
          reverted[id] = courseObj;
        } else {
          delete reverted[id];
        }

        return reverted;
      });

      toast.error("Failed to update favorites. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  // Get search params
  const searchParams = useSearchParams();
  const countryFromURL = searchParams.get("country");

  // Set country filter from URL parameter FIRST, before fetching courses
  useEffect(() => {
    if (countryFromURL) {
      setCountryFilter([countryFromURL]);
    }
  }, [countryFromURL, setCountryFilter]);

  // Fetch courses AFTER setting the country filter
  useEffect(() => {
    // Only fetch courses after we've processed the URL parameters
    // Add a small delay to ensure the country filter is set first
    const timer = setTimeout(() => {
      fetchCourses();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchCourses, countryFromURL]); // Add countryFromURL as dependency

  // Scroll to top whenever the currentPage changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  // Determine which courses to display (all or favorites only)
  const displayedCourses = showFavorites
    ? Object.values(favoriteCourses)
    : courses;

  return (
    <section className="w-[95%] mx-auto p-2 ">
      <div className="flex flex-col lg:flex-row items-start">
        <div className="w-full">
          <h3 className="font-bold mb-1 flex items-center md:mb-0">
            Explore Courses from Every Discipline!
          </h3>
          <p className="text-gray-600">Over 100,000+ Courses Available.</p>
        </div>
        <div className="w-full md:w-[60%] lg:w-[90%] xl:w-[80%] grid grid-cols-2 md:grid-cols-4 md:flex gap-2 items-center">
          <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 w-[100%] xl:w-[90%]">
            <Image
              src="/search.svg"
              width={20}
              height={20}
              alt="search"
              className="w-4 h-4"
            />
            <Input
              placeholder="Search Course Name..."
              onChange={(e) => {
                const value = String(e.target.value);
                setLocalSearch(value);
                handleSearch(value);
              }}
              value={localSearch}
              className="w-full pl-2 pt-2 rounded-lg  bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] border-none focus:ring-0 truncate"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-[#F1F1F1] rounded-md py-2 px-6 flex items-center gap-2 text-base text-gray-600 ">
              <MdOutlineSortByAlpha className="w-4 h-4" />
              <span>Sorting</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                <FaSortAlphaDown className="mr-2" />
                Sort A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                <FaSortAlphaDownAlt className="mr-2" />
                Sort Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className={`text-sm flex items-center justify-start md:justify-center gap-1 xl:gap-2 bg-[#F1F1F1] rounded-lg p-2 w-full md:w-[95%] lg:w-[90%] xl:w-[70%] h-10 ${
              showFavorites ? "text-red-500 font-bold" : "text-gray-600"
            }`}
          >
            <Image
              src={favoritesCount > 0 ? "/redheart.svg" : "/hearti.svg"}
              width={20}
              height={18}
              alt="favorites"
            />
            {showFavorites ? "Show All" : "Favorites"}
            <span>({favoritesCount})</span>
          </button>

          <FilterComponent />
        </div>
      </div>

      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4  md:p-0">
          {displayedCourses.length === 0 ? (
            <p className="text-[20px] font-semibold col-span-4 text-center p-4 ">
              {showFavorites ? "No Favorite Courses Found" : "No Courses Found"}
            </p>
          ) : (
            displayedCourses.map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3 "
              >
                <div className="relative h-52 p-2">
                  <Link
                    target="blank"
                    href={`/courses/${item._id}`}
                    rel="noopener noreferrer"
                    className="w-1/2"
                  >
                    <ImageWithLoader
                      src={
                        item.universityData?.universityImages.banner ||
                        `/course-${idx}.png`
                      }
                      alt="coursesImg"
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                      className="object-cover  rounded-2xl"
                    />
                  </Link>
                  <div className="absolute top-4 left-0">
                    <div className=" bg-gradient-to-r from-white to-transparent opacity-100 w-[70%] ">
                      <div className="flex items-center gap-2 ">
                        <img
                          src={
                            item.universityData?.universityImages.logo ||
                            "/logo.png"
                          }
                          alt="alumni"
                          className="w-14 h-14 object-cover  object-center rounded-full aspect-square"
                        />

                        <div className="py-1">
                          <p className="leading-none text-sm font-medium cursor-pointer">
                            {item.universityData?.university_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-gray-200 bg-opacity-40 backdrop-blur-sm rounded-md">
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
                            Anyone who has this link will be able to view this.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label
                              htmlFor={`link-${item._id}`}
                              className="sr-only"
                            >
                              Link
                            </Label>
                            <Input
                              id={`link-${item._id}`}
                              value={`${
                                typeof window !== "undefined"
                                  ? window.location.origin
                                  : ""
                              }/courses/${item._id}`}
                              readOnly
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="px-3"
                            onClick={() => {
                              const link = `${window.location.origin}/courses/${item._id}`;
                              navigator.clipboard.writeText(link).then(() => {
                                setCopiedLinkId(item._id);
                                setTimeout(() => setCopiedLinkId(null), 2000);
                              });
                            }}
                          >
                            <span className="sr-only">Copy</span>
                            <Copy />
                          </Button>
                        </div>

                        {copiedLinkId === item._id && (
                          <p className="text-black text-sm mt-2">
                            Link copied to clipboard!
                          </p>
                        )}

                        <div className="mt-2 flex gap-4 justify-left">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `${window.location.origin}/courses/${item._id}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            <BsWhatsapp className="text-2xl" />{" "}
                          </a>
                          <a
                            href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                              `${window.location.origin}/courses/${item._id}`
                            )}`}
                            className="text-blue-600 hover:underline"
                          >
                            <AiOutlineMail className="text-2xl text-red-600" />{" "}
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              `${window.location.origin}/courses/${item._id}`
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

                    <button
                      onClick={() => toggleFavoriteInDB(item._id)}
                      disabled={loadingFavorites[item._id]}
                      className={`relative ${
                        heartAnimation === item._id ? "animate-pop" : ""
                      } ${
                        loadingFavorites[item._id]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {favorites[item._id] ? (
                        <Image
                          src="/redheart.svg"
                          width={20}
                          height={20}
                          alt="Favorite"
                        />
                      ) : (
                        <Image
                          src="/hearti.svg"
                          width={20}
                          height={20}
                          alt="Favorite"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <Link
                    target="blank"
                    href={`/courses/${item._id}`}
                    rel="noopener noreferrer"
                    className="w-1/2"
                  >
                    <h3
                      className="text-base md:text-lg font-bold text-gray-800 truncate hover:underline underline-offset-4 cursor-pointer "
                      title={item?.course_title}
                    >
                      {item?.course_title}
                    </h3>
                  </Link>
                  <div className="mt-3 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/location.svg"
                        alt="location"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 whitespace-normal overflow-hidden md:truncate">
                        {item.countryname}
                      </p>
                    </div>

                    <div className="relative group flex items-center gap-2">
                      <Image
                        src="/shop.svg"
                        alt="intake"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {item.intake}
                      </p>
                      <div className="hidden group-hover:block absolute top-full left-0 mt-1 z-10 bg-gray-600 text-white text-xs p-2 rounded shadow max-w-xs">
                        {item.intake}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Image
                        src="/clock.svg"
                        alt="duration"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {item.duration}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Image
                        src="/money.svg"
                        alt="fees"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {item.annual_tuition_fee.currency}{" "}
                        {item.annual_tuition_fee.amount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 mt-auto gap-2">
                  <Link
                    target="blank"
                    href={`/courses/${item._id}`}
                    rel="noopener noreferrer"
                    className="w-1/2"
                  >
                    <button className="w-full bg-red-500 text-white text-sm p-2 rounded-lg">
                      Course Details
                    </button>
                  </Link>

                  <div className="w-1/2">
                    <button
                      onClick={() => addToAppliedCourses(item._id)}
                      className="w-full border border-red-500 text-red-500 text-sm p-2 rounded-lg"
                    >
                      Create Application
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center items-center mt-10  gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(1)}
            className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200 ${
              currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="First page"
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={handlePrevPage}
            className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200 ${
              currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous page"
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="hidden sm:flex space-x-2 ">
            {(() => {
              let startPage = 1;
              let endPage = totalPages;

              if (totalPages > 10) {
                if (currentPage <= 6) {
                  endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                  startPage = Math.max(totalPages - 8, 1);
                } else {
                  startPage = currentPage - 4;
                  endPage = currentPage + 4;
                }
              }

              const pages = [];

              if (startPage > 1) {
                pages.push(
                  <button
                    key="start-ellipsis"
                    className="rounded-lg px-4 py-2 text-gray-500"
                    disabled
                  >
                    ...
                  </button>
                );
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                      currentPage === i
                        ? "bg-red-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100"
                    }`}
                    aria-current={currentPage === i ? "page" : undefined}
                  >
                    {i}
                  </button>
                );
              }

              if (endPage < totalPages) {
                pages.push(
                  <button
                    key="end-ellipsis"
                    className="rounded-lg px-4 py-2 text-gray-500"
                    disabled
                  >
                    ...
                  </button>
                );
              }

              return pages;
            })()}
          </div>

          <div className="flex sm:hidden items-center border-2 border-red-600">
            <span className="text-gray-700 font-medium px-3">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {currentPage < totalPages && (
            <button
              onClick={handleNextPage}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {currentPage < totalPages && (
            <button
              onClick={() => setPage(totalPages)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
              aria-label="Last page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
