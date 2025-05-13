"use client";
import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface Course {
  id: string;
  department: string;
  course: string;
  university: string;
  duration: string;
  deadline: string;
  entryRequirements: string;
  scholarshipType: string;
  teachingLanguage: string;
}

const courses: Course[] = [
  {
    id: "1",
    department: "Social Sciences",
    course: "MSc Creative Writing",
    university: "Jilin University",
    duration: "4 Years",
    deadline: "March 2025",
    entryRequirements: "Being a high school graduate with minimum GPA of 3.0",
    scholarshipType: "Fully Funded",
    teachingLanguage: "Chinese",
  },
  {
    id: "2",
    department: "Social Sciences",
    course: "PhD Civil Engineering",
    university: "Wellington University",
    duration: "3 Years",
    deadline: "October 2025",
    entryRequirements:
      "Being a high school graduate with relevant bachelor's degree",
    scholarshipType: "Partial Funded",
    teachingLanguage: "English",
  },
  {
    id: "3",
    department: "Social Sciences",
    course: "MSc Creative Writing",
    university: "Jilin University",
    duration: "4 Years",
    deadline: "March 2025",
    entryRequirements: "Being a high school graduate with minimum GPA of 3.0",
    scholarshipType: "Fully Funded",
    teachingLanguage: "Chinese",
  },
  {
    id: "4",
    department: "Social Sciences",
    course: "PhD Civil Engineering",
    university: "Wellington University",
    duration: "3 Years",
    deadline: "October 2025",
    entryRequirements:
      "Being a high school graduate with relevant bachelor's degree",
    scholarshipType: "Partial Funded",
    teachingLanguage: "English",
  },
  {
    id: "5",
    department: "Social Sciences",
    course: "MSc Creative Writing",
    university: "Jilin University",
    duration: "4 Years",
    deadline: "March 2025",
    entryRequirements: "Being a high school graduate with minimum GPA of 3.0",
    scholarshipType: "Fully Funded",
    teachingLanguage: "Chinese",
  },
  {
    id: "6",
    department: "Computer Science",
    course: "BSc Computer Science",
    university: "Stanford University",
    duration: "4 Years",
    deadline: "April 2025",
    entryRequirements:
      "Being a high school graduate with strong math background",
    scholarshipType: "Partial Funded",
    teachingLanguage: "English",
  },
  {
    id: "7",
    department: "Business",
    course: "MBA Business Administration",
    university: "Harvard University",
    duration: "2 Years",
    deadline: "May 2025",
    entryRequirements: "Bachelor's degree with 2+ years work experience",
    scholarshipType: "Fully Funded",
    teachingLanguage: "English",
  },
  {
    id: "8",
    department: "Medicine",
    course: "MD Medicine",
    university: "Oxford University",
    duration: "5 Years",
    deadline: "June 2025",
    entryRequirements: "Bachelor's degree in related field with 3.5+ GPA",
    scholarshipType: "Fully Funded",
    teachingLanguage: "English",
  },
  {
    id: "9",
    department: "Engineering",
    course: "MSc Electrical Engineering",
    university: "MIT",
    duration: "2 Years",
    deadline: "July 2025",
    entryRequirements: "Bachelor's in Electrical Engineering or related field",
    scholarshipType: "Partial Funded",
    teachingLanguage: "English",
  },
  {
    id: "10",
    department: "Arts",
    course: "BFA Fine Arts",
    university: "Paris Arts Academy",
    duration: "3 Years",
    deadline: "August 2025",
    entryRequirements: "Portfolio submission and interview",
    scholarshipType: "Fully Funded",
    teachingLanguage: "French",
  },
];

export default function Home() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Course | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const coursesPerPage = 5;

  const handleSearch = (value: string) => {
    setIsLoading(true);
    setSearchTerm(value);

    setTimeout(() => {
      if (!value.trim()) {
        setFilteredCourses(courses);
      } else {
        const lowerCaseSearchTerm = value.toLowerCase();
        const filtered = courses.filter(
          (course) =>
            course.department.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.course.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.university.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.duration.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.deadline.toLowerCase().includes(lowerCaseSearchTerm) ||
            course.entryRequirements
              .toLowerCase()
              .includes(lowerCaseSearchTerm) ||
            course.scholarshipType
              .toLowerCase()
              .includes(lowerCaseSearchTerm) ||
            course.teachingLanguage.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredCourses(filtered);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleSort = (field: keyof Course) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const SortIcon = ({ field }: { field: keyof Course }) => {
    if (sortField !== field)
      return (
        <MoreHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-50" />
      );
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const columns: (keyof Course | "action")[] = [
    "department",
    "course",
    "university",
    "duration",
    "deadline",
    "entryRequirements",
    "scholarshipType",
    "teachingLanguage",
    "action",
  ];

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Applicable Courses
          </h1>
         
        </div>

        <div className="space-y-6 w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by department/faculty, Course, University..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 py-6 bg-muted/30 border-muted focus-visible:ring-2 text-foreground transition-all duration-300 ease-in-out hover:bg-muted/50"
            />
          </div>

          <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full border-collapse">
                  <thead className="bg-[#FCE7D2] sticky top-0 z-10">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className={cn(
                            "px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider whitespace-nowrap",
                            column !== "action" &&
                              "cursor-pointer group transition-colors hover:bg-[#FCE7D2]",
                            column === "entryRequirements" && "min-w-[300px]"
                          )}
                          onClick={() =>
                            column !== "action" &&
                            handleSort(column as keyof Course)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {column === "entryRequirements"
                                ? "Entry Requirements"
                                : column === "scholarshipType"
                                ? "Scholarship Type"
                                : column === "teachingLanguage"
                                ? "Teaching Language"
                                : column === "action"
                                ? ""
                                : column}
                            </span>
                            {column !== "action" && (
                              <SortIcon field={column as keyof Course} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="px-6 py-4 text-center"
                        >
                          <div className="flex justify-center items-center h-[400px]">
                            <div className="animate-pulse flex flex-col items-center space-y-4">
                              <div className="h-12 w-12 rounded-full bg-muted"></div>
                              <div className="h-4 w-32 bg-muted rounded"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : currentCourses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="px-6 py-4 text-center"
                        >
                          <div className="flex justify-center items-center h-[400px]">
                            <div className="text-center">
                              <h3 className="text-lg font-medium">
                                No courses found
                              </h3>
                              <p className="text-muted-foreground">
                                Try adjusting your search terms
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentCourses.map((course, index) => (
                        <tr
                          key={course.id}
                          className={cn(
                            "transition-colors hover:bg-muted/30",
                            index % 2 === 0 ? "bg-background" : "bg-card"
                          )}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.university}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.deadline}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {course.entryRequirements}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.scholarshipType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.teachingLanguage}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full bg-red-700 hover:bg-red-700 "
                              onClick={() => {}}
                            >
                              Apply
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstCourse + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {indexOfLastCourse > sortedCourses.length
                        ? sortedCourses.length
                        : indexOfLastCourse}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{sortedCourses.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm space-x-1 items-center"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card hover:bg-muted"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          currentPage === index + 1 ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => paginate(index + 1)}
                        className={cn(
                          "relative inline-flex items-center px-4 py-2 border border-border",
                          currentPage === index + 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted text-foreground"
                        )}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card hover:bg-muted"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
