"use client";
import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { applyCourse } from "@/lib/appliedScholarships"; // Make sure this path is correct
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";
// import Scholarship from "@/models/scholarship";

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
  countries: string;
}

interface DynamicTableData {
  course: string[];
  create_application: string[];
  deadline: string[];
  duration: string[];
  entry_requirements: string[];
  faculty_department: string[];
  scholarship_type: string[];
  teaching_language: string[];
  university: string[];
  countries: string[];
  scholarshipName: string;

  // Add optional alternative field names
  country?: string[];
  host_country?: string[];
  hostCountry?: string[];
  location?: string[];
}

interface ApplicableCoursesProps {
  tableData?: DynamicTableData;
  hostCountry: string;
  banner: string;
  scholarshipName: string;
  s_id: string; // Add id prop to pass scholarship ID
  logo: string;
}

export default function ApplicableCourses({
  hostCountry,
  banner,
  tableData,
  scholarshipName,
  s_id,
  logo,
}: ApplicableCoursesProps) {
  const router = useRouter();
  const { user, fetchUserProfile } = useUserStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyingCourseId, setApplyingCourseId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Course | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const coursesPerPage = 5;

  // console.log(logo,"fhjhgg");
  // console.log(s_id, "Scholarship ID from ApplicableCourses");
  // console.log("Host country:", hostCountry);
  // console.log(scholarshipName, "Scholarship Name");
  // Transform dynamic data to Course objects
  useEffect(() => {
    // Debug: Log the incoming tableData
    // console.log("Raw tableData:", tableData);
    // console.log("Countries array:", tableData?.countries);
    // console.log(
    //   "All tableData keys:",
    //   tableData ? Object.keys(tableData) : "No tableData"
    // );
    // console.log("Raw tableData:", tableData);
    // console.log("Countries array:", tableData?.countries);
    // console.log(
    //   "All tableData keys:",
    //   tableData ? Object.keys(tableData) : "No tableData"
    // );

    if (tableData && Array.isArray(tableData.course)) {
      const transformedCourses: Course[] = tableData.course.map((_, index) => {
        const courseObj = {
          id: (index + 1).toString(),
          // logo: logo || logo,
          ScholarshipId: s_id,
          scholarshipName: scholarshipName || scholarshipName,
          department: tableData.faculty_department?.[index] || "",
          course: tableData.course?.[index] || "",
          university: tableData.university?.[index] || "",
          duration: tableData.duration?.[index] || "",
          deadline: tableData.deadline?.[index] || "",
          entryRequirements: tableData.entry_requirements?.[index] || "",
          scholarshipType: tableData.scholarship_type?.[index] || "",
          teachingLanguage: tableData.teaching_language?.[index] || "",
          // Try multiple possible field names for countries
          countries:
            tableData.countries?.[index] ||
            tableData.country?.[index] ||
            tableData.host_country?.[index] ||
            tableData.hostCountry?.[index] ||
            tableData.location?.[index] ||
            tableData.scholarshipName ||
            "",
        };

        // Debug: Log each transformed course
        console.log(`Course ${index + 1}:`, courseObj);
        console.log(`Course ${index + 1} countries:`, courseObj.countries);

        return courseObj;
      });

      console.log("All transformed courses:", transformedCourses);

      setCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
      setCurrentPage(1);
      setSearchTerm("");
    } else {
      setCourses([]);
      setFilteredCourses([]);
      setCurrentPage(1);
    }
  }, [tableData]);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, []);
  const token = getAuthToken();
  // Function to handle course application using API service
  console.log(user, "fetchuserProfile");
  const showLoginPrompt = () => {
    toast.error("Please login to apply for courses.", {
      duration: 6000,
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

  // Updated handleApplyCourse function
  const handleApplyCourse = async (course: Course) => {
    console.log("gjjfjfj");
    console.log(course, "Applying for course");

    // Check if user is logged in
    if (!token) {
      console.log("User not logged in");
      showLoginPrompt();
      return;
    }

    try {
      setApplyingCourseId(course.id);

      const applicationData = {
        banner: banner,
        userId: user?._id,
        logo: logo,
        scholarshipName: scholarshipName || ` Scholarship`,
        hostCountry: hostCountry || "Not specified",
        courseName: course.course || "Not specified",
        duration: course.duration || "Not specified",
        language: course.teachingLanguage || "Not specified",
        universityName: course.university || "Not specified",
        scholarshipType: course.scholarshipType || "Not specified",
        deadline: course.deadline || "Not specified",
        ScholarshipId: s_id || "Not specified",
      };

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(applicationData),
        }
      );
      const data = await result.json();

      if (result.ok) {
        toast.success("Application submitted successfully!", {
          duration: 2000,
          position: "top-center",
        });
        router.push("/dashboard/overview#applied-scholarships");
      } else {
        if (result.status === 401 || result.status === 403) {
          toast.error("Session expired. Please login again.", {
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
          router.push("/signin");
          return;
        }
        throw new Error(data.message || "Application failed");
      }
    } catch (error) {
      console.error("Error applying for course:", error);

      if (error instanceof Error) {
        if (
          error.message?.includes("login") ||
          error.message?.includes("authentication") ||
          error.message?.includes("unauthorized")
        ) {
          toast.error("Please login to apply for courses.", {
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
          router.push("/signin");
        } else if (error.message?.includes("already applied")) {
          toast.error("You have already applied for this course", {
            duration: 3000,
            position: "top-center",
          });
        } else {
          toast.error(
            error.message || "Failed to submit application. Please try again.",
            {
              duration: 3000,
              position: "top-center",
            }
          );
        }
      } else {
        toast.error("Failed to submit application. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
      }
    } finally {
      setApplyingCourseId(null);
    }
  };
  const handleSearch = (value: string) => {
    setIsLoading(true);
    setSearchTerm(value);
    setCurrentPage(1);

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
            course.teachingLanguage
              .toLowerCase()
              .includes(lowerCaseSearchTerm) ||
            course.countries.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredCourses(filtered);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleSort = (field: keyof Course) => {
    setCurrentPage(1);
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

  const actualFirst = sortedCourses.length === 0 ? 0 : indexOfFirstCourse + 1;
  const actualLast = Math.min(indexOfLastCourse, sortedCourses.length);

  const getPaginationItems = () => {
    const maxVisible = 7;
    const items = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        items.push(1);
        items.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      }
    }

    return items;
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
    "countries",
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
              placeholder="Search by course, department, university.."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="placeholder:text-base pl-10 py-6 bg-muted/30 border-muted focus-visible:ring-2 text-foreground transition-all duration-300 ease-in-out hover:bg-muted/50"
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
                            <div className="relative group w-fit">
                              <div className="cursor-pointer max-w-[300px] overflow-hidden line-clamp-2">
                                {course.entryRequirements}
                              </div>
                              <div className="absolute top-0 left-full ml-2 hidden group-hover:block bg-gray-100 text-black text-sm font-medium p-2 rounded-md w-[300px] shadow-lg z-10">
                                {course.entryRequirements}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.scholarshipType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.teachingLanguage}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="relative group w-fit">
                              <div className="cursor-pointer max-w-[300px] overflow-hidden line-clamp-2">
                                {course.countries}
                              </div>
                              <div className="absolute top-0 left-full ml-2 hidden group-hover:block bg-gray-100 text-black text-sm font-medium p-2 rounded-md w-[300px] shadow-lg z-10">
                                {course.countries}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50"
                              onClick={() => handleApplyCourse(course)}
                              disabled={applyingCourseId === course.id}
                            >
                              {applyingCourseId === course.id ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Applying...</span>
                                </div>
                              ) : (
                                "Apply"
                              )}
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
                    Showing <span className="font-medium">{actualFirst}</span>{" "}
                    to <span className="font-medium">{actualLast}</span> of{" "}
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
                    {getPaginationItems().map((item, index) => (
                      <Button
                        key={index}
                        variant={currentPage === item ? "default" : "ghost"}
                        size="sm"
                        onClick={() =>
                          typeof item === "number" ? paginate(item) : undefined
                        }
                        disabled={typeof item !== "number"}
                        className={cn(
                          "relative inline-flex items-center px-4 py-2 border border-border",
                          currentPage === item
                            ? "bg-primary text-primary-foreground"
                            : typeof item === "number"
                            ? "bg-card hover:bg-muted text-foreground"
                            : "bg-card text-muted-foreground cursor-default"
                        )}
                      >
                        {typeof item === "number" ? item : "..."}
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
