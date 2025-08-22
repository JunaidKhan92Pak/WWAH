// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// // import CircularProgress from "./CircularProgress";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";
// import { useUserStore } from "@/store/useUserData";
// import CircularProgress from "@/app/(studentdashboard)/dashboard/overview/components/CircularProgress";

// interface Course {
//   _id: string;
//   course_title?: string;
//   countryname?: string;
//   intake?: string;
//   duration?: string;
//   annual_tuition_fee?: {
//     currency?: string;
//     amount?: number;
//   };
//   application_deadline?: string;
//   universityData?: {
//     university_name?: string;
//     universityImages?: {
//       banner?: string;
//       logo?: string;
//     };
//   };
// }

// const ApplicationStatus: React.FC = () => {
//   const [detailedAppliedCourses, setDetailedAppliedCourses] = useState<
//     Course[]
//   >([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Helper function to get application step label
//   const getApplicationStepLabel = (applicationStatus: number): string => {
//     const steps = [
//       { step: 1, label: "Application Started" },
//       { step: 2, label: "Documents Prepared" },
//       { step: 3, label: "Application Submitted" },
//       { step: 4, label: "Under Review" },
//       { step: 5, label: "Interview Scheduled" },
//       { step: 6, label: "Decision Pending" },
//       { step: 7, label: "Final Decision" },
//     ];

//     const step = steps.find((s) => s.step === applicationStatus);
//     return step ? step.label : "Unknown Step";
//   };

//   const getApplicationProgress = (applicationStatus: number): number => {
//     return Math.round((applicationStatus / 7) * 100);
//   };

//   // Get data from the store
//   const {
//     user,
//     appliedCourses,
//     appliedCourseIds,
//     loadingAppliedCourses,
//     fetchAppliedCourses,
//     removeAppliedCourse,
//   } = useUserStore();
//   // console.log(user, "useris")
//   console.log("ApplicationStatus component rendered", {
//     appliedCourseIds,
//     appliedCoursesCount: Object.keys(appliedCourses).length,
//     userAppliedCourses: user?.appliedCourses,
//   });
//   console.log(appliedCourses, "applied courses");
//   // Function to fetch detailed course information for applied courses
//   const fetchDetailedAppliedCourses = async (courseIds: string[]) => {
//     if (courseIds.length === 0) {
//       setDetailedAppliedCourses([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       // Get application data from the store
//       const coursesDataForAPI = courseIds.map((courseId) => {
//         const appliedCourse = appliedCourses[courseId];
//         return {
//           courseId,
//           applicationStatus: appliedCourse?.applicationStatus || 1,
//           createdAt: appliedCourse?.createdAt,
//           updatedAt: appliedCourse?.updatedAt,
//         };
//       });

//       const apiUrl = `/api/getfavouritecourse?ids=${encodeURIComponent(
//         JSON.stringify(coursesDataForAPI)
//       )}&type=applied`;

//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log(response, "Response from API coursesDta");

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Response error text:", errorText);
//         throw new Error(
//           `HTTP error! status: ${response.status} - ${errorText}`
//         );
//       }

//       const data = await response.json();

//       if (data.success) {
//         const detailedCourses = data.appliedCourses || [];
//         setDetailedAppliedCourses(detailedCourses);
//       } else {
//         console.error("API returned success: false", data);
//         setError(data.message || "Failed to load detailed course information");
//         toast.error("Failed to load detailed course information", {
//           duration: 3000,
//           position: "top-center",
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error fetching detailed courses:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       setError(errorMessage);
//       toast.error("Failed to load course details", {
//         duration: 3000,
//         position: "top-center",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user profile and applied courses on component mount
//   useEffect(() => {
//     if (!user?.appliedCourses || appliedCourseIds.length === 0) {
//       fetchAppliedCourses();
//     }
//   }, []);

//   // Fetch detailed course information when applied course IDs change
//   useEffect(() => {
//     console.log("Applied course IDs changed:", appliedCourseIds);

//     if (appliedCourseIds.length > 0) {
//       fetchDetailedAppliedCourses(appliedCourseIds);
//     } else {
//       setDetailedAppliedCourses([]);
//       setLoading(false);
//     }
//   }, [appliedCourseIds]);

//   // Function to remove course from applied courses using the store
//   const handleRemoveCourse = async (courseId: string) => {
//     console.log("Removing course:", courseId);

//     const loadingToast = toast.loading("Removing course...", {
//       position: "top-center",
//     });

//     try {
//       const success = await removeAppliedCourse(courseId);

//       if (success) {
//         // Remove from local state immediately for better UX
//         setDetailedAppliedCourses((prev) =>
//           prev.filter((course) => course._id !== courseId)
//         );

//         toast.dismiss(loadingToast);
//         toast.success("Course removed from applications!", {
//           duration: 2000,
//           position: "top-center",
//         });
//       } else {
//         throw new Error("Failed to remove course");
//       }
//     } catch (error: unknown) {
//       console.error("Error removing course:", error);
//       toast.dismiss(loadingToast);

//       const errorMessage =
//         error instanceof Error ? error.message : String(error);
//       toast.error(`Failed to remove course: ${errorMessage}`, {
//         duration: 4000,
//         position: "top-center",
//       });
//     }
//   };

//   // console.log("Detailed applied courses:", detailedAppliedCourses);

//   // Get application details for a specific course (only schema fields)
//   const getApplicationDetails = (courseId: string) => {
//     return appliedCourses[courseId] || null;
//   };

//   // Loading state
//   if (loading || loadingAppliedCourses) {
//     return (
//       <div className="relative">
//         <div className="flex items-center justify-center p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E]"></div>
//           <span className="ml-2">Loading your applications...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="relative">
//         <div className="flex items-center justify-center p-8">
//           <div className="text-red-500 text-center">
//             <p className="mb-4">Error: {error}</p>
//             <Button
//               onClick={() => fetchAppliedCourses()}
//               className="bg-[#C7161E] hover:bg-[#f03c45] text-white"
//             >
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No applied courses state
//   if (!appliedCourseIds || appliedCourseIds.length === 0) {
//     return (
//       <div className="relative">
//         {/* Blur Overlay */}
//         <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-xl flex flex-col items-center justify-center p-8">
//           <h3 className="text-lg font-semibold mb-4 text-center">
//             No Course Applications Yet
//           </h3>
//           <p className="text-gray-600 mb-6 text-center">
//             Start your journey by applying to your first course!
//           </p>
//           <Link href="/coursearchive">
//             <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
//               Browse Courses
//             </Button>
//           </Link>
//         </div>

//         {/* Placeholder content */}
//         <div className="opacity-30">
//           <p className="font-semibold text-lg md:text-xl mb-4">
//             You are applying for:
//           </p>
//           <div className="bg-gray-100 p-4 rounded-2xl">
//             <div className="h-48 bg-gray-200 rounded-2xl"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show loading state if we have IDs but no detailed courses yet
//   if (
//     appliedCourseIds.length > 0 &&
//     detailedAppliedCourses.length === 0 &&
//     loading
//   ) {
//     return (
//       <div className="relative">
//         {/* Blurred background */}
//         <div className="absolute inset-0 backdrop-blur-2xl bg-gray-100 z-0" />

//         {/* Centered content */}
//         <div className="flex flex-col items-center justify-center h-[250px] p-8 z-10 relative text-center">
//           <p className="font-semibold text-lg md:text-xl mb-2">
//             Loading Course Details...
//           </p>
//           <p className="text-gray-600 mb-4">
//             Please wait while we fetch your application details.
//           </p>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E] mb-4"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <p className="font-semibold text-lg md:text-xl mb-4">
//         You are applying for ({appliedCourseIds.length} course
//         {appliedCourseIds.length !== 1 ? "s" : ""}):
//       </p>

//       <div
//         className="flex overflow-x-auto space-x-3 hide-scrollbar"
//         style={{
//           scrollbarWidth: "thin",
//           msOverflowStyle: "none",
//         }}
//       >
//         {detailedAppliedCourses.map((course, index) => {
//           const applicationDetails = getApplicationDetails(course._id);

//           return (
//             <div
//               key={course._id || index}
//               className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-row gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-4 overflow-hidden border border-gray-200"
//             >
//               {/* Remove Button */}
//               <button
//                 onClick={() => handleRemoveCourse(course._id)}
//                 className="absolute top-2 right-1 z-10 border border-gray-400 bg-white text-gray-400 hover:bg-red-600 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
//                 title="Remove from applications"
//               >
//                 ×
//               </button>

//               {/* Left Section: Course Info */}
//               <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
//                 {/* Course Image and University Info */}
//                 <div>
//                   <div className="relative md:w-[200px] h-[150px] rounded-xl overflow-hidden">
//                     <Image
//                       src={
//                         course.universityData?.universityImages?.banner ||
//                         `/course-${index + 1}.png`
//                       }
//                       alt="Course Banner"
//                       width={200}
//                       height={150}
//                       className="w-[200px] h-[150px] object-cover"
//                     />
//                     <div className="absolute top-4 left-0">
//                       <div className="bg-gradient-to-t from-white to-transparent opacity-100 w-[70%]">
//                         <div className="flex items-center gap-2">
//                           <img
//                             src={
//                               course.universityData?.universityImages?.logo ||
//                               "/logo.png"
//                             }
//                             alt="University Logo"
//                             className="w-6 h-6 object-cover object-center rounded-full aspect-square"
//                           />
//                           <p className="text-sm leading-tight pr-1">
//                             {course.universityData?.university_name ||
//                               "University"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="absolute top-2 right-2">
//                       <Image
//                         src="/hearti.svg"
//                         alt="favorite"
//                         width={20}
//                         height={20}
//                       />
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 pt-2">
//                     <input
//                       type="checkbox"
//                       defaultChecked
//                       className="accent-[#C7161E]"
//                     />
//                     <label className="text-sm">
//                       Yes, I want to apply for this course.
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex-1 space-y-2">
//                   {/* Course title */}
//                   <p className="text-sm font-semibold">
//                     {course.course_title || "Course Title Not Available"}
//                   </p>

//                   {/* Info grid */}
//                   <div className="grid grid-cols-2 gap-y-1 gap-x-4 space-y-1 text-sm text-gray-700">
//                     <div className="flex items-center gap-1">
//                       <Image
//                         src="/location.svg"
//                         width={16}
//                         height={16}
//                         alt="Location"
//                       />
//                       <span>
//                         {course.countryname || "Country not specified"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Image
//                         src="/DashboardPage/intake.svg"
//                         width={16}
//                         height={16}
//                         alt="Intake"
//                       />
//                       <span>{course.intake || "Not specified"}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Image
//                         src="/clock.svg"
//                         width={16}
//                         height={16}
//                         alt="Duration"
//                       />
//                       <span>{course.duration || "Not specified"}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Image
//                         src="/money.svg"
//                         width={16}
//                         height={16}
//                         alt="Fee"
//                       />
//                       <span>
//                         {course.annual_tuition_fee?.currency || "$"}{" "}
//                         {course.annual_tuition_fee?.amount || "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Image
//                         src="/DashboardPage/deadline.svg"
//                         width={14}
//                         height={14}
//                         alt="Deadline"
//                       />
//                       <span>Deadline:</span>
//                     </div>
//                     <span>
//                       {course.application_deadline || "Not specified"}
//                     </span>
//                   </div>

//                   {/* Application Status - Only using schema fields */}
//                   {applicationDetails && (
//                     <div className="mt-2 p-3 bg-gray-50 rounded-lg">
//                       <p className="text-xs text-gray-600 mb-2">
//                         Application Progress:
//                       </p>

//                       {/* Progress bar based on applicationStatus (1-7) */}
//                       <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                         <div
//                           className="bg-[#C7161E] h-2 rounded-full transition-all duration-300"
//                           style={{
//                             width: `${getApplicationProgress(
//                               applicationDetails.applicationStatus || 1
//                             )}%`,
//                           }}
//                         ></div>
//                       </div>

//                       {/* Status labels - Only using schema data */}
//                       <div className="flex flex-wrap gap-2 text-xs">
//                         <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
//                           {getApplicationStepLabel(
//                             applicationDetails.applicationStatus || 1
//                           )}
//                         </span>
//                       </div>

//                       {/* Application dates from schema */}
//                       <div className="mt-2 text-xs text-gray-500">
//                         {applicationDetails.createdAt && (
//                           <div>
//                             Applied:{" "}
//                             {new Date(
//                               applicationDetails.createdAt
//                             ).toLocaleDateString()}
//                           </div>
//                         )}
//                         {applicationDetails.updatedAt && (
//                           <div>
//                             Last Updated:{" "}
//                             {new Date(
//                               applicationDetails.updatedAt
//                             ).toLocaleDateString()}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Section: Progress Circle */}
//               <div className="flex flex-col items-center justify-center min-w-[140px]">
//                 <p className="text-sm font-semibold mb-2 text-center w-4/5">
//                   Application Progress
//                 </p>

//                 {/* Use applicationStatus for progress */}
//                 <CircularProgress
//                   progress={
//                     applicationDetails
//                       ? getApplicationProgress(
//                           applicationDetails.applicationStatus || 1
//                         )
//                       : 0
//                   }
//                 />

//                 {/* Show current step */}
//                 {applicationDetails && (
//                   <div className="mt-2 text-center">
//                     <p className="text-xs text-gray-600">
//                       Step {applicationDetails.applicationStatus || 1} of 7
//                     </p>
//                     <p className="text-xs font-medium">
//                       {getApplicationStepLabel(
//                         applicationDetails.applicationStatus || 1
//                       )}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Add more courses button */}
//       <div className="mt-6 text-center">
//         <Link href="/coursearchive">
//           <Button
//             variant="outline"
//             className="border-[#C7161E] text-[#C7161E] hover:bg-[#C7161E] hover:text-white"
//           >
//             + Apply to More Courses
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ApplicationStatus;
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
// import CircularProgress from "./CircularProgress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import CircularProgress from "@/app/(studentdashboard)/dashboard/overview/components/CircularProgress";

interface Course {
  _id: string;
  course_title?: string;
  countryname?: string;
  intake?: string;
  duration?: string;
  annual_tuition_fee?: {
    currency?: string;
    amount?: number;
  };
  application_deadline?: string;
  universityData?: {
    university_name?: string;
    universityImages?: {
      banner?: string;
      logo?: string;
    };
  };
}

const ApplicationStatus: React.FC = () => {
  const [detailedAppliedCourses, setDetailedAppliedCourses] = useState<
    Course[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get application step label
  const getApplicationStepLabel = (applicationStatus: number): string => {
    const steps = [
      { step: 1, label: "Application Started" },
      { step: 2, label: "Documents Prepared" },
      { step: 3, label: "Application Submitted" },
      { step: 4, label: "Under Review" },
      { step: 5, label: "Interview Scheduled" },
      { step: 6, label: "Decision Pending" },
      { step: 7, label: "Final Decision" },
    ];

    const step = steps.find((s) => s.step === applicationStatus);
    return step ? step.label : "Unknown Step";
  };

  const getApplicationProgress = (applicationStatus: number): number => {
    return Math.round((applicationStatus / 7) * 100);
  };

  // Get data from the store
  const {
    user,
    appliedCourses,
    appliedCourseIds,
    loadingAppliedCourses,
    fetchAppliedCourses,
    removeAppliedCourse,
  } = useUserStore();

  console.log("ApplicationStatus component rendered", {
    appliedCourseIds,
    appliedCoursesCount: Object.keys(appliedCourses).length,
    userAppliedCourses: user?.appliedCourses,
  });
  console.log(appliedCourses, "applied courses");

  // Function to fetch detailed course information for applied courses
  const fetchDetailedAppliedCourses = async (courseIds: string[]) => {
    if (courseIds.length === 0) {
      setDetailedAppliedCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get application data from the store
      const coursesDataForAPI = courseIds.map((courseId) => {
        const appliedCourse = appliedCourses[courseId];
        return {
          courseId,
          applicationStatus: appliedCourse?.applicationStatus || 1,
          createdAt: appliedCourse?.createdAt,
          updatedAt: appliedCourse?.updatedAt,
        };
      });

      const apiUrl = `/api/getfavouritecourse?ids=${encodeURIComponent(
        JSON.stringify(coursesDataForAPI)
      )}&type=applied`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response, "Response from API coursesDta");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        const detailedCourses = data.appliedCourses || [];
        setDetailedAppliedCourses(detailedCourses);
      } else {
        console.error("API returned success: false", data);
        setError(data.message || "Failed to load detailed course information");
        toast.error("Failed to load detailed course information", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching detailed courses:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast.error("Failed to load course details", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile and applied courses on component mount
  useEffect(() => {
    if (!user?.appliedCourses || appliedCourseIds.length === 0) {
      fetchAppliedCourses();
    }
  }, []);

  // Fetch detailed course information when applied course IDs change
  useEffect(() => {
    console.log("Applied course IDs changed:", appliedCourseIds);

    if (appliedCourseIds.length > 0) {
      fetchDetailedAppliedCourses(appliedCourseIds);
    } else {
      setDetailedAppliedCourses([]);
      setLoading(false);
    }
  }, [appliedCourseIds]);

  // Function to remove course from applied courses using the store
  const handleRemoveCourse = async (courseId: string) => {
    console.log("Removing course:", courseId);

    const loadingToast = toast.loading("Removing course...", {
      position: "top-center",
    });

    try {
      const success = await removeAppliedCourse(courseId);

      if (success) {
        // Remove from local state immediately for better UX
        setDetailedAppliedCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );

        toast.dismiss(loadingToast);
        toast.success("Course removed from applications!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        throw new Error("Failed to remove course");
      }
    } catch (error: unknown) {
      console.error("Error removing course:", error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to remove course: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // Get application details for a specific course (only schema fields)
  const getApplicationDetails = (courseId: string) => {
    return appliedCourses[courseId] || null;
  };

  // Loading state
  if (loading || loadingAppliedCourses) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E]"></div>
          <span className="ml-2">Loading your applications...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500 text-center">
            <p className="mb-4">Error: {error}</p>
            <Button
              onClick={() => fetchAppliedCourses()}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No applied courses state
  if (!appliedCourseIds || appliedCourseIds.length === 0) {
    return (
      <div className="relative">
        {/* Blur Overlay */}
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/70 rounded-xl flex flex-col items-center justify-center p-8">
          <h3 className="text-lg font-semibold mb-4 text-center">
            No Course Applications Yet
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Start your journey by applying to your first course!
          </p>
          <Link href="/coursearchive">
            <Button className="bg-[#C7161E] hover:bg-[#f03c45] text-white font-medium py-2 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Placeholder content */}
        <div className="opacity-30">
          <p className="font-semibold text-lg md:text-xl mb-4">
            You are applying for:
          </p>
          <div className="bg-gray-100 p-4 rounded-2xl">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if we have IDs but no detailed courses yet
  if (
    appliedCourseIds.length > 0 &&
    detailedAppliedCourses.length === 0 &&
    loading
  ) {
    return (
      <div className="relative">
        {/* Blurred background */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-gray-100 z-0" />

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center h-[250px] p-8 z-10 relative text-center">
          <p className="font-semibold text-lg md:text-xl mb-2">
            Loading Course Details...
          </p>
          <p className="text-gray-600 mb-4">
            Please wait while we fetch your application details.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E] mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="font-semibold text-lg md:text-xl mb-4">
        You are applying for ({appliedCourseIds.length} course
        {appliedCourseIds.length !== 1 ? "s" : ""}):
      </p>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        {/* Scroll Indicators */}
        {detailedAppliedCourses.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
            Scroll →
          </div>
        )}

        <div
          className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#C7161E #f1f1f1",
          }}
        >
          {detailedAppliedCourses.map((course, index) => {
            const applicationDetails = getApplicationDetails(course._id);

            return (
              <div
                key={course._id || index}
                className="relative min-w-[350px] max-w-[400px] sm:min-w-[400px] sm:max-w-[450px] lg:min-w-[500px] lg:max-w-[550px] flex-shrink-0 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveCourse(course._id)}
                  className="absolute top-3 right-3 z-10 border border-gray-400 bg-white text-gray-400 hover:bg-red-600 hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:scale-110 transition-all duration-200"
                  title="Remove from applications"
                >
                  ×
                </button>

                {/* Course Content */}
                <div className="flex flex-col gap-4">
                  {/* Course Image and University Info */}
                  <div className="relative">
                    <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
                      <Image
                        src={
                          course.universityData?.universityImages?.banner ||
                          `/course-${index + 1}.png`
                        }
                        alt="Course Banner"
                        fill
                        className="object-cover"
                      />

                      {/* University Info Overlay */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                course.universityData?.universityImages?.logo ||
                                "/logo.png"
                              }
                              alt="University Logo"
                              className="w-6 h-6 object-cover rounded-full"
                            />
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                              {course.universityData?.university_name ||
                                "University"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                          <Image
                            src="/hearti.svg"
                            alt="favorite"
                            width={20}
                            height={20}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#C7161E] w-4 h-4"
                      />
                      <label className="text-sm text-gray-700">
                        Yes, I want to apply for this course.
                      </label>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3">
                    {/* Course Title */}
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.course_title || "Course Title Not Available"}
                    </h3>

                    {/* Course Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/location.svg"
                          width={16}
                          height={16}
                          alt="Location"
                        />
                        <span className="truncate">
                          {course.countryname || "Country not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image
                          src="/DashboardPage/intake.svg"
                          width={16}
                          height={16}
                          alt="Intake"
                        />
                        <span className="truncate">
                          {course.intake || "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image
                          src="/clock.svg"
                          width={16}
                          height={16}
                          alt="Duration"
                        />
                        <span className="truncate">
                          {course.duration || "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Image
                          src="/money.svg"
                          width={16}
                          height={16}
                          alt="Fee"
                        />
                        <span className="truncate">
                          {course.annual_tuition_fee?.currency || "$"}{" "}
                          {course.annual_tuition_fee?.amount || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Image
                        src="/DashboardPage/deadline.svg"
                        width={16}
                        height={16}
                        alt="Deadline"
                      />
                      <span>
                        Deadline:{" "}
                        {course.application_deadline || "Not specified"}
                      </span>
                    </div>

                    {/* Application Status */}
                    {applicationDetails && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-gray-800">
                            Application Progress
                          </p>
                          <div className="w-16 h-16">
                            <CircularProgress
                              progress={getApplicationProgress(
                                applicationDetails.applicationStatus || 1
                              )}
                            />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-[#C7161E] h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${getApplicationProgress(
                                applicationDetails.applicationStatus || 1
                              )}%`,
                            }}
                          ></div>
                        </div>

                        {/* Status info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-600">
                              Step {applicationDetails.applicationStatus || 1}{" "}
                              of 7
                            </span>
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {getApplicationStepLabel(
                                applicationDetails.applicationStatus || 1
                              )}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="text-xs text-gray-500 space-y-1">
                            {applicationDetails.createdAt && (
                              <div className="flex justify-between">
                                <span>Applied:</span>
                                <span>
                                  {new Date(
                                    applicationDetails.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {applicationDetails.updatedAt && (
                              <div className="flex justify-between">
                                <span>Last Updated:</span>
                                <span>
                                  {new Date(
                                    applicationDetails.updatedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add more courses button */}
      <div className="mt-6 text-center">
        <Link href="/coursearchive">
          <Button
            variant="outline"
            className="border-[#C7161E] text-[#C7161E] hover:bg-[#C7161E] hover:text-white transition-colors duration-300"
          >
            + Apply to More Courses
          </Button>
        </Link>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #c7161e;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #f03c45;
        }
      `}</style>
    </div>
  );
};

export default ApplicationStatus;
