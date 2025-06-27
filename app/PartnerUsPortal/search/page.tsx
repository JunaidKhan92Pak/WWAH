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
  } = useCourseStore();

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [localSearch, setLocalSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [heartAnimation, setHeartAnimation] = useState<string | null>(null);

  // Toggle favorite and animate heart
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev, [id]: !prev[id] };
      setFavoritesCount(Object.values(updatedFavorites).filter(Boolean).length);
      setHeartAnimation(id);
      setTimeout(() => setHeartAnimation(null), 1000);
      return updatedFavorites;
    });
  };

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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
    ? courses.filter((course) => favorites[course._id])
    : courses;
  return (
    <section className="w-full mx-auto p-2">
      <h3>Search Courses</h3>
      {/* search and filters */}
      <div className="flex gap-2 ">
        <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 ">
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
            // className="w-full h-8 border-none bg-transparent outline-none focus:ring-0"
            className="w-full pl-2 pt-2 rounded-lg  bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] border-none focus:ring-0 truncate"
          />
        </div>
        <FilterComponent />
      </div>

      <div className="flex flex-col lg:flex-row items-start p-2 mt-6">
        <div className="w-full leading-tight">
          <p className="font-bold text-xl mb-1 flex items-center md:mb-0">
            Explore Courses from Every Discipline!
          </p>
          <p className="text-gray-600 text-sm">Over 1000 Courses Available.</p>
        </div>
        <div className="w-full md:w-[60%] lg:w-[90%] xl:w-[80%] grid grid-cols-2 md:grid-cols-4 md:flex gap-2 items-center">
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
        </div>
      </div>

      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3 gap-4  md:p-0">
          {courses.length === 0 ? (
            <p className="text-[20px] font-semibold col-span-4 text-center p-4 ">
              {" "}
              No courses Found{" "}
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

                  <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button>
                          <Image
                            src="/share.svg"
                            width={20}
                            height={20}
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
                                setTimeout(() => setCopiedLinkId(null), 2000); // auto-hide after 2s
                              });
                            }}
                          >
                            <span className="sr-only">Copy</span>
                            <Copy />
                          </Button>
                        </div>

                        {/* 👇 Show message conditionally */}
                        {copiedLinkId === item._id && (
                          <p className="text-black text-sm mt-2">
                            Link copied to clipboard!
                          </p>
                        )}

                        {/* Share buttons */}
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
                      onClick={() => toggleFavorite(item._id)}
                      className={`relative ${
                        heartAnimation === item._id ? "animate-pop" : ""
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
                          src="/whiteheart.svg"
                          width={20}
                          height={20}
                          alt="Favorite"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  {/* University Name and Course Title */}
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
                  <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/location.svg"
                        alt="location"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {item.countryname}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/shop.svg"
                        alt="year"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {item.intake}
                      </p>
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

                  <Link target="blank" href="dashboard" className="w-1/2">
                    <button className="w-full border border-red-500 text-red-500 text-sm p-2 rounded-lg">
                      Create Application
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center items-center mt-10  gap-3">
        {/* Pagination controls always visible container */}
        <div className="flex items-center gap-3">
          {/* First page button */}
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

          {/* Previous button */}
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

          {/* Page numbers */}
          <div className="hidden sm:flex space-x-2 ">
            {(() => {
              // Calculate pagination range
              let startPage = 1;
              let endPage = totalPages;

              if (totalPages > 10) {
                if (currentPage <= 6) {
                  // Show first 5 pages
                  endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                  // Show last 5 pages
                  startPage = Math.max(totalPages - 8, 1);
                } else {
                  // Show current page with neighbors
                  startPage = currentPage - 4;
                  endPage = currentPage + 4;
                }
              }

              const pages = [];

              // Add ellipsis at the beginning if needed
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

              // Add page buttons
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

              // Add ellipsis at the end if needed
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

          {/* Mobile-friendly current page indicator */}
          <div className="flex sm:hidden items-center border-2 border-red-600">
            <span className="text-gray-700 font-medium px-3">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Next button */}
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

          {/* Last page button */}
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
