"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LanguageProficiency from "./Application/LanguageProficiency";
import StandardizedTest from "./Application/StandardizedTest";
import EducationalBackground from "./Application/EducationalBackground";
import WorkExperience from "./Application/WorkExperience";


const BasicInfo = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Change based on your form pages



  return (
    <div className="flex flex-col w-[75%] mx-auto my-4">
      {currentPage === 1 && <h6 className="font-semibold text-center">Educational Background</h6>}
      {currentPage === 2 && <h6 className="font-semibold text-center">Work Experience</h6>}
      {currentPage === 3 && <h6 className="font-semibold text-center">Language Proficiency</h6>}
      {currentPage === 4 && <h6 className="font-semibold text-center">Standardized Test</h6>}


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
          <PaginationContent className="flex justify-between mt-4">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </form>
    </div>
  );
};

export default BasicInfo;