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
import { FaFacebook, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
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

  // Determine which courses to display (all or favorites only)
  const displayedCourses = showFavorites
    ? courses.filter((course) => favorites[course._id])
    : courses;
  return (
    <section className="w-[95%] mx-auto p-2 ">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="w-full">
          <h3 className="font-bold mb-1 flex items-center md:mb-0">
            Explore Courses from Every Discipline!
          </h3>
          <p className="text-gray-600">Over 1000 courses available.</p>
        </div>
        <div className="w-full md:w-[60%] lg:w-[90%] xl:w-[70%] my-4 lg:mt-10 grid grid-cols-2 md:grid-cols-4 md:flex gap-2 items-center">
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
              // className="w-full h-8 border-none bg-transparent outline-none focus:ring-0"
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
            className={`text-sm flex items-center justify-start md:justify-center gap-1 xl:gap-2 bg-[#F1F1F1] rounded-lg p-2 w-full md:w-[95%] lg:w-[90%] xl:w-[70%] h-10 ${showFavorites ? "text-red-500 font-bold" : "text-gray-600"
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
                        <div className=" sm:w-16 sm:h-12 w-10 h-10 ">
                          <img
                            src={
                              item.universityData?.universityImages.logo ||
                              "/logo.png"
                            }
                            alt="alumini"
                            className="rounded-full border object-cover  object-center  sm:w-16 sm:h-10 w-10 h-10 "
                          />
                        </div>
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
                              value={`${typeof window !== "undefined"
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
      <div className="flex justify-center items-center mt-6 gap-2">
        <Button
          className="bg-red-600 hover:bg-red-600"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          className="bg-red-600 hover:bg-red-600"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default Page;
