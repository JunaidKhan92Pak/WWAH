"use client";
import React, { useEffect, Suspense } from "react";
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
import { useSearchParams } from "next/navigation";
import { SkeletonCard } from "@/components/skeleton"
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseArchive />
    </Suspense>
  );
};

const CourseArchive = () => {
  const {
    courses, search, setSearch, setSortOrder,
    currentPage, totalPages,
    setPage, loading, fetchCourses
  } = useCourseStore();

  const searchParams = useSearchParams();
  const universityName = searchParams.get("uni");
  const subject = searchParams.get("subject");
  const level = searchParams.get("level");
  const searchCourse = searchParams.get("searchCourse");

  useEffect(() => {
    fetchCourses();
  }, [universityName, subject, level, searchCourse]);

  return (
    <section className="w-full p-4 md:p-8">
      <div className="md:flex items-center">
        <div className="w-full">
          <h3 className="font-bold mb-1 flex items-center md:mb-0">
            Explore Courses from Every Discipline!
          </h3>
          <p className="text-gray-600">Over 1000 courses available.</p>
        </div>
        <div className="w-full md:w-[60%] mt-3 md:mt-10 flex flex-wrap md:flex-nowrap items-center gap-4 md:justify-end">
          <div className="flex items-center bg-[#F1F1F1] rounded-lg px-4 py-1 w-full md:w-[60%] md:max-w-[280px]">
            <Image
              src="/search.svg"
              width={20}
              height={20}
              alt="search"
              className="w-4 h-4 mr-2"
            />
            <Input
              placeholder="Search Course Name..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full h-8 border-none bg-transparent outline-none focus:ring-0"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-[#F1F1F1] rounded-md p-2 flex items-center gap-2 text-base text-gray-600">
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
          <FilterComponent />
        </div>
      </div>

      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {courses.map((item, idx) => (
            <div key={idx} className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col">
              <div className="relative">
                <Image
                  src="/course1.png"
                  alt="coursesImg"
                  width={400}
                  height={250}
                  className="w-full h-52 md:h-56 lg:h-60 object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-base md:text-lg font-bold text-gray-800 truncate">
                  {item?.course_title}
                </h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/location.png"
                      alt="location"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <p className="text-sm text-gray-600 truncate">{item.countryname}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/year.png"
                      alt="year"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <p className="text-sm text-gray-600 truncate">{item.intake}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/clock.png"
                      alt="duration"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <p className="text-sm text-gray-600 truncate">{item.duration}</p>
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
                      {item.annual_tuition_fee.currency} {item.annual_tuition_fee.amount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-around mb-4 mt-auto px-2 gap-2">
                <Link
                  href={`/courses/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[50%] bg-red-500 rounded-lg"
                >
                  <button className="w-full text-white text-sm p-2">Course Details</button>
                </Link>
                <button className="w-[50%] border border-red-500 text-red-500 text-sm p-2 rounded-lg">
                  Create Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center mt-6 gap-2">
        <Button className="bg-red-400" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button className="bg-red-400" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</Button>
      </div>
    </section>
  );
};

export default Page;
