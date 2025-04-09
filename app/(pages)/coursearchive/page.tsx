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
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import Link from "next/link";
import { useCourseStore } from "@/store/useCoursesStore";
import FilterComponent from "./components/Filtercomponent";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/skeleton";
import { debounce } from "lodash";
import ImageWithLoader from "@/components/ImageWithLoader";
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

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text).then(
  //     () => {
  //       console.log("Copied to clipboard successfully!");
  //     },
  //     (err) => {
  //       console.error("Failed to copy to clipboard: ", err);
  //     }
  //   );
  // };
  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/Universities/${id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const [localSearch, setLocalSearch] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );
    setFavorites(storedFavorites);
  }, []);
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );
  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev, [id]: !prev[id] };

      // Store favorites in local storage to persist on refresh
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };
  const displayedCourses = showFavorites
    ? courses.filter((course) => favorites[course._id])
    : courses;
  return (
    <section className="w-[95%] mx-auto p-2 ">
      <div className="md:flex items-center">
        <div className="w-full">
          <h3 className="font-bold mb-1 flex items-center md:mb-0">
            Explore Courses from Every Discipline!
          </h3>
          <p className="text-gray-600">Over 1000 courses available.</p>
        </div>
        <div className="w-[70%] md:w-[90%] lg:w-[75%] xl:w-[60%] mt-3 md:mt-10 flex flex-wrap md:flex-nowrap items-center gap-4 md:justify-end">
          <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 w-full md:w-[60%] md:max-w-[280px]">
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
            <DropdownMenuTrigger className="bg-[#F1F1F1] rounded-md py-2 px-6 flex items-center gap-2 text-base text-gray-600">
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
            className={`text-sm flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[50%] h-10 ${showFavorites ? "text-red-500 font-bold" : "text-gray-600"
              }`}
          >
            <Image src="/hearti.svg" width={20} height={18} alt="favorites" />
            {showFavorites ? "Show All" : "Favorites"}
          </button>
          <FilterComponent />
        </div>
      </div>

      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4  md:p-0">
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
                  <ImageWithLoader
                    src={
                      item.universityData?.universityImages.banner ||
                      `/course-${idx}.png`
                    }
                    alt="coursesImg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                    className="object-cover  rounded-2xl"
                  />

                  <div className="absolute top-4 left-0">
                    <div className=" bg-gradient-to-r from-white to-transparent opacity-100 w-[70%] ">
                      <div className="flex items-center gap-2 ">
                        <div className=" sm:w-16 sm:h-12 w-10 h-10 ">
                          <img
                            src={item.universityData?.universityImages.logo || "/logo.png"}
                            alt="alumini"
                            className="rounded-full border object-cover  object-center  sm:w-16 sm:h-10 w-10 h-10 "
                          />
                        </div>
                        <div className="py-1">
                          <p className="leading-none text-sm font-medium">
                            {item.universityData?.university_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-md">
                    <button onClick={() => copyToClipboard(item._id)}>
                      <Image
                        src="/share.svg"
                        width={20}
                        height={20}
                        alt="Share"
                      />
                    </button>

                    <button onClick={() => toggleFavorite(item._id)}>
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
                  <h3 className="text-base md:text-lg font-bold text-gray-800 truncate hover:underline underline-offset-4">
                    {item?.course_title}
                  </h3>
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
                        src="/year.png"
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
                        src="/clock.png"
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
                        src="/money.png"
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
                    href={`/courses/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2"
                  >
                    <button className="w-full bg-red-500 text-white text-sm p-2 rounded-lg">
                      Course Details
                    </button>
                  </Link>

                  <Link href="dashboard" className="w-1/2">
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
          className="bg-red-600"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          className="bg-red-600"
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
