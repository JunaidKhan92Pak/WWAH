"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LanguageProficiency from "./Application/LanguageProficiency";
import StandardizedTest from "./Application/StandardizedTest";
import EducationalBackground from "./Application/EducationalBackground";
import WorkExperience from "./Application/WorkExperience";

const ApplicationInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Change based on your form pages

  return (
    <div className="flex flex-col w-[90%] xl:w-[60%] mx-auto mt-6">
      {currentPage === 1 && (
        <h6 className="font-semibold text-center">Educational Background</h6>
      )}
      {currentPage === 2 && (
        <h6 className="font-semibold text-center">Work Experience</h6>
      )}
      {currentPage === 3 && (
        <h6 className="font-semibold text-center">Language Proficiency</h6>
      )}
      {currentPage === 4 && (
        <h6 className="font-semibold text-center">Standardized Test</h6>
      )}

      <form>
        {/* Page 1 */}

        {currentPage === 1 && (
          <>
            <EducationalBackground />
          </>
        )}

        {currentPage === 2 && <WorkExperience />}
        {currentPage === 3 && <LanguageProficiency />}
        {currentPage === 4 && <StandardizedTest />}

        {/* Pagination Controls */}
        <Pagination>
          <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`p-2 text-sm  ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>

            {/* Current Page Number */}
            <span className="px-4 py-2 text-sm font-semibold  rounded-lg border">
              {currentPage}
            </span>

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`p-2 text-sm  ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </form>
    </div>
  );
};

export default ApplicationInfo;
