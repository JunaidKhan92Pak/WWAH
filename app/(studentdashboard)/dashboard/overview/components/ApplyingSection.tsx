// Enhanced ApplyingSection Component with Success Chances
"use client";
import React, { useState, useEffect, useCallback, useRef, } from "react";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserData";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/store/userStore/userSuccessInfo";
import { calculateAllSuccessMetrics } from "@/utils/successChance/courseSuccess";

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
  application_fee: string;
  universityData?: {
    university_name?: string;
    universityImages?: {
      banner?: string;
      logo?: string;
    };
  };
  required_ielts_score?: string;
  required_pte_score?: string;
  required_toefl_score?: string;
  entry_requirement?: string;
  entry_requirements?: string;
  course_level?: string;
    costOfLiving?: {
    currency?: string;
    amount?: number;
  };
}
interface User {
    languageProficiency?: {
      test?: string;
      score?: number;
    };
    grade?: number;
    gradetype?: string;
    studyLevel?: string;
    workExperience?: string;
    majorSubject?: string;
    tuitionFee?: {
      amount: number;
      currency: string;
    };
    livingCosts?: {
      amount: number;
      currency: string;
    };
  }
const ApplyingSection: React.FC = () => {
  const [detailedAppliedCourses, setDetailedAppliedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Success chance states
  const [courseSuccessChances, setCourseSuccessChances] = useState<Record<string, number>>({});
  const [generatingSuccess, setGeneratingSuccess] = useState<Record<string, boolean>>({});
  const [showSuccessPromptModal, setShowSuccessPromptModal] = useState<boolean>(false);

  // Existing states
  const [initializationState, setInitializationState] = useState<"idle" | "initializing" | "completed">("idle");
  const initializationRef = useRef(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [courseToConfirm, setCourseToConfirm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  
  const router = useRouter();
  const { userSuccessInfo, isLoggedIn, hasData, fetchUserSuccessInfo } = useUserInfo();
  
  useEffect(() => {
    fetchUserSuccessInfo();
  }, [fetchUserSuccessInfo]);

  interface UserLanguageProficiency {
    test: string;
    score: number;
  }

  interface UserTuitionFee {
    amount: number;
    currency: string;
  }

  interface UserLivingCosts {
    amount: number;
    currency: string;
  }

  interface UserDataForCalculation {
    languageProficiency: UserLanguageProficiency;
    grade: number;
    gradeType: string;
    studyLevel: string;
    workExperience: string;
    majorSubject: string;
    tuitionFee: UserTuitionFee;
    livingCosts: UserLivingCosts;
  }

  // The userData parameter is any, as the shape is not strictly defined in the codebase.
  const transformUserDataForCalculation = useCallback(
    (userData: User): UserDataForCalculation => {
      return {
        languageProficiency: {
          test: userData?.languageProficiency?.test || "IELTS",
          score: userData?.languageProficiency?.score || 0,
        },
        grade: userData?.grade || 0,
        gradeType: userData?.gradetype || "percentage",
        studyLevel: userData?.studyLevel || "",
        workExperience: userData?.workExperience || "0",
        majorSubject: userData?.majorSubject || "",
        tuitionFee: userData?.tuitionFee || { amount: 0, currency: "USD" },
        livingCosts: userData?.livingCosts || { amount: 0, currency: "USD" },
      };
    },
    []
  );

  // Transform course data for success calculation
  const transformCourseDataForCalculation = useCallback((course: Course) => {
    console.log("Transforming course data:", course);
    
    return {
      requiredWorkExp: 2,
      requiredDegree: course?.course_level || "",
      requiredSubject: course?.course_title || "",
      englishProficiency: {
        ielts: course?.required_ielts_score || "",
        pte: course?.required_pte_score || "",
        tofel: course?.required_toefl_score || "",
      },
      requiredGrade: course?.entry_requirement || course?.entry_requirements || "",
      tutionfee: {
        amount: course?.annual_tuition_fee?.amount || 0,
        currency: course?.annual_tuition_fee?.currency || "",
      },
      costofliving: {
        amount: course?.costOfLiving?.amount || 0, // You can add cost of living data here if available
        currency: course?.costOfLiving?.currency || ""
      }
    };
  }, []);

  // Calculate overall success chance from metrics
  interface SuccessMetrics {
    degreeSuccess: number;
    gradeSuccess: number;
    majorSubject: number;
    englishSuccess: number;
    tuitionFeeSuccess: number;
    costofliving: number;
  }

  const calculateOverallSuccess = useCallback(
    (metrics: SuccessMetrics): number => {
      const weightedScore =
        (metrics.degreeSuccess * 0.25) +
        (metrics.gradeSuccess * 0.25) +
        (metrics.majorSubject * 0.20) +
        (metrics.englishSuccess * 0.15) +
        (metrics.tuitionFeeSuccess * 0.075) +
        (metrics.costofliving * 0.075);

      return Math.round(weightedScore);
    },
    []
  );

  // Generate success chance for a specific course
  const generateCourseSuccessChance = useCallback(async (course: Course) => {
    // Check if user is logged in and has data
    if (!isLoggedIn) {
      toast.error("Please log in to generate success chances", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!hasData || !userSuccessInfo) {
      setShowSuccessPromptModal(true);
      return;
    }

    setGeneratingSuccess(prev => ({ ...prev, [course._id]: true }));

    try {
      // Simulate analysis delay like in ProgressSection
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transformedUserData = transformUserDataForCalculation(userSuccessInfo as User);
      const transformedCourseData = transformCourseDataForCalculation(course);
      
      const metrics = calculateAllSuccessMetrics(transformedUserData, transformedCourseData);
      const safeMetrics: SuccessMetrics = {
        degreeSuccess: metrics.degreeSuccess ?? 0,
        gradeSuccess: metrics.gradeSuccess ?? 0,
        majorSubject: metrics.majorSubject ?? 0,
        englishSuccess: metrics.englishSuccess ?? 0,
        tuitionFeeSuccess: metrics.tuitionFeeSuccess ?? 0,
        costofliving: metrics.costofliving ?? 0,
      };
      const overallChance = calculateOverallSuccess(safeMetrics);

      setCourseSuccessChances(prev => ({
        ...prev,
        [course._id]: overallChance
      }));

      toast.success("Success chance calculated!", {
        duration: 2000,
        position: "top-center",
      });

    } catch (error) {
      console.error("Error calculating success chance:", error);
      toast.error("Failed to calculate success chance", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setGeneratingSuccess(prev => ({ ...prev, [course._id]: false }));
    }
  }, [isLoggedIn, hasData, userSuccessInfo, transformUserDataForCalculation, transformCourseDataForCalculation, calculateOverallSuccess]);

  // Generate all success chances when user data is available
  const generateAllSuccessChances = useCallback(async () => {
    if (!isLoggedIn || !hasData || !userSuccessInfo || detailedAppliedCourses.length === 0) {
      return;
    }

    const transformedUserData = transformUserDataForCalculation(userSuccessInfo as User);
    const newSuccessChances: Record<string, number> = {};
    detailedAppliedCourses.forEach(course => {
      const transformedCourseData = transformCourseDataForCalculation(course);
      const metrics = calculateAllSuccessMetrics(transformedUserData, transformedCourseData);
      const safeMetrics: SuccessMetrics = {
        degreeSuccess: metrics.degreeSuccess ?? 0,
        gradeSuccess: metrics.gradeSuccess ?? 0,
        majorSubject: metrics.majorSubject ?? 0,
        englishSuccess: metrics.englishSuccess ?? 0,
        tuitionFeeSuccess: metrics.tuitionFeeSuccess ?? 0,
        costofliving: metrics.costofliving ?? 0,
      };
      const overallChance = calculateOverallSuccess(safeMetrics);
      newSuccessChances[course._id] = overallChance;
    });
  
    setCourseSuccessChances(newSuccessChances);
  }, [isLoggedIn, hasData, userSuccessInfo, detailedAppliedCourses, transformUserDataForCalculation, transformCourseDataForCalculation, calculateOverallSuccess]);

  // Auto-generate success chances when user data and courses are available
  useEffect(() => {
    if (detailedAppliedCourses.length > 0 && userSuccessInfo && hasData) {
      generateAllSuccessChances();
    }
  }, [detailedAppliedCourses, userSuccessInfo, hasData, generateAllSuccessChances]);

  const getStatusConfig = (statusId: number) => {
    const statusConfigs: Record<number, { label: string; color: string }> = {
      1: { label: "Incomplete Application", color: "bg-red-500" },
      2: { label: "Complete application and confirm course", color: "bg-red-500" },
      3: { label: "Awaiting Course Confirmation", color: "bg-orange-500" },
      4: { label: "Pay Application Fee", color: "bg-yellow-500" },
      5: { label: "In Process", color: "bg-yellow-500" },
      6: { label: "Application withdrawn by student", color: "bg-black" },
      7: { label: "Application Successful", color: "bg-green-500" },
      8: { label: "Application Unsuccessful", color: "bg-red-500" },
      9: { label: "Visa in process", color: "bg-yellow-500" },
      10: { label: "Visa Rejected", color: "bg-red-500" },
      11: { label: "Ready to Fly", color: "bg-green-500" },
    };

    return statusConfigs[statusId] || { label: "Unknown Status", color: "bg-gray-500" };
  };

  // Get data from the store
  const {
    user,
    appliedCourses,
    appliedCourseIds,
    loadingAppliedCourses,
    fetchAppliedCourses,
    removeAppliedCourse,
    updateCourseConfirmation,
  } = useUserStore();

  // Function to fetch detailed course information for applied courses
  const fetchDetailedAppliedCourses = useCallback(
    async (courseIds: string[]) => {
      if (courseIds.length === 0) {
        setDetailedAppliedCourses([]);
        return;
      }

      try {
        setLoading(true);

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

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        toast.error("Failed to load course details", {
          duration: 3000,
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
    [appliedCourses]
  );

  // Single initialization effect
  useEffect(() => {
    const initializeComponent = async () => {
      if (initializationRef.current || initializationState !== "idle") {
        return;
      }

      initializationRef.current = true;
      setInitializationState("initializing");

      try {
        if (!user?.appliedCourses && !loadingAppliedCourses) {
          await fetchAppliedCourses();
        }
      } catch (error) {
        console.error("Error initializing component:", error);
        setError("Failed to initialize applied courses");
      } finally {
        setInitializationState("completed");
      }
    };

    initializeComponent();
  }, []);

  // Separate effect for fetching detailed courses when IDs change
  useEffect(() => {
    if (initializationState === "completed" && appliedCourseIds.length > 0) {
      fetchDetailedAppliedCourses(appliedCourseIds);
    } else if (initializationState === "completed" && appliedCourseIds.length === 0) {
      setDetailedAppliedCourses([]);
    }
  }, [appliedCourseIds, initializationState, fetchDetailedAppliedCourses]);

  const handleRemoveButtonClick = async (courseId: string) => {
    const applicationDetails = getApplicationDetails(courseId);

    if (applicationDetails?.isConfirmed) {
      setShowContactModal(true);
      return;
    }

    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteYes = async () => {
    if (courseToDelete) {
      await handleRemoveCourse(courseToDelete);
    }
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleDeleteNo = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleRemoveCourse = async (courseId: string) => {
    console.log("Removing course:", courseId);

    const loadingToast = toast.loading("Removing course...", {
      position: "top-center",
    });

    try {
      const success = await removeAppliedCourse(courseId);

      if (success) {
        setDetailedAppliedCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );

        // Also remove from success chances
        setCourseSuccessChances(prev => {
          const newChances = { ...prev };
          delete newChances[courseId];
          return newChances;
        });

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

      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to remove course: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleConfirmButtonClick = (courseId: string) => {
    console.log("Confirm button clicked for course:", courseId);
    setCourseToConfirm(courseId);
    setShowConfirmModal(true);
  };

  const handleConfirmYes = async () => {
    if (courseToConfirm) {
      await handleCourseConfirmation(courseToConfirm, true);
      router.push("/dashboard/completeapplication");
    }
    setShowConfirmModal(false);
    setCourseToConfirm(null);
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setCourseToConfirm(null);
  };

  const handleCourseConfirmation = async (courseId: string, isConfirmed: boolean) => {
    console.log("Updating course confirmation:", { courseId, isConfirmed });

    const loadingToast = toast.loading(
      isConfirmed ? "Confirming course..." : "Updating course...",
      { position: "top-center" }
    );

    try {
      const success = await updateCourseConfirmation(courseId, isConfirmed);

      if (success) {
        toast.dismiss(loadingToast);
        toast.success(
          isConfirmed
            ? "Course confirmed successfully!"
            : "Course confirmation updated!",
          { duration: 2000, position: "top-center" }
        );
      } else {
        throw new Error("Failed to update course confirmation");
      }
    } catch (error: unknown) {
      console.error("Error updating course confirmation:", error);
      toast.dismiss(loadingToast);

      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update confirmation: ${errorMessage}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const getApplicationDetails = (courseId: string) => {
    return appliedCourses[courseId] || null;
  };

  // Handle generate success chance button click
  const handleGenerateSuccessChance = (course: Course) => {
    if (!isLoggedIn) {
      toast.error("Please log in to generate success chances", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!hasData || !userSuccessInfo) {
      setShowSuccessPromptModal(true);
      return;
    }

    generateCourseSuccessChance(course);
  };

  // Success Prompt Modal component
  const SuccessPromptModal = () => (
    <Dialog open={showSuccessPromptModal} onOpenChange={setShowSuccessPromptModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <Image
              src="/spark.png"
              alt="Spark Icon"
              width={80}
              height={80}
            />
            <span>Complete Your Profile</span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            To generate accurate success chances, we need your academic and personal information.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => setShowSuccessPromptModal(false)}
            variant="outline"
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              setShowSuccessPromptModal(false);
              router.push("/successratioform");
            }}
            className="bg-[#C7161E] hover:bg-[#f03c45] text-white flex-1"
          >
            Complete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Loading state
  if (
    (initializationState === "initializing" || loadingAppliedCourses) &&
    !initializationRef.current
  ) {
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
              onClick={() => {
                setError(null);
                setInitializationState("idle");
                initializationRef.current = false;
                fetchAppliedCourses();
              }}
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
  if (initializationState === "completed" && appliedCourseIds.length === 0) {
    return (
      <div>
        <div className="relative w-full h-[250px] flex items-center justify-center border border-gray-200 rounded-xl">
          {/* Blurred Dummy Card in Background */}
          <div className="absolute inset-0">
            <div className=" opacity-80 blur-sm">
              <div className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-row gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-4 overflow-hidden border border-gray-200 opacity-80 pointer-events-none">
                <div className="bg-white px-0 py-2 rounded-lg overflow-hidden mt-2">
                  <div className="flex">
                    <div className="relative md:w-[200px] h-[150px] rounded-xl overflow-hidden">
                      <Image
                        src="/bg-usa.png"
                        alt="Dummy Banner"
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>

                    <div className="flex-1 p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[12px] font-semibold">Scholarship Name</p>
                          <p className="text-[12px]">Course Name</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[12px]">
                        <div className="flex items-center gap-2">
                          <Image src="/location.svg" alt="Location Icon" width={16} height={16} />
                          <span className="text-gray-600">Country</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image src="/clock.svg" alt="Duration Icon" width={16} height={16} />
                          <span className="text-gray-600">Duration</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Image src="/lang.svg" alt="Language Icon" width={16} height={16} />
                          <span className="text-gray-600">Language</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Image src="/ielts/Dollar.svg" alt="University Icon" width={16} height={16} />
                        <span className="text-gray-600 text-[12px]">University</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Image src="/vectoruni.svg" alt="Scholarship Type Icon" width={16} height={16} />
                        <span className="text-gray-600 text-[12px]">Scholarship Type</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/calender.svg" alt="Deadline Icon" width={16} height={16} />
                        <span className="text-gray-600 text-[12px]">Deadline</span>
                      </div>
                    </div>
                    <Button className=" bg-red-600 px-6">hello</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay Message */}
          <div className="flex flex-col items-center justify-center h-[250px] text-center relative z-10 w-full">
            <p className="font-semibold text-lg md:text-lg mb-2">No Course Applications Yet</p>
            <p className="text-gray-600 mb-4">Start your journey by applying to your first course!</p>
            <Link href="/coursearchive">
              <button className="px-4 py-2 text-[14px] bg-[#C7161E] text-white rounded-full hover:bg-red-700">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state when fetching detailed courses
  if (
    initializationState === "completed" &&
    appliedCourseIds.length > 0 &&
    detailedAppliedCourses.length === 0 &&
    loading
  ) {
    return (
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-gray-100 z-0" />
        <div className="flex flex-col items-center justify-center h-[250px] p-8 z-10 relative text-center">
          <p className="font-semibold text-lg md:text-xl mb-2">Loading Course Details...</p>
          <p className="text-gray-600 mb-4">Please wait while we fetch your application details.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7161E] mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Success Prompt Modal */}
      <SuccessPromptModal />

      {/* Contact Advisor Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Course Confirmed</DialogTitle>
            <DialogDescription className="text-center pt-4 flex flex-col items-center text-black font-semibold text-[15px]">
              <Image src="/spark.png" alt="Spark Icon" width={100} height={100} />
              <p className="pt-2">
                Your application is already in process for this course. Please{" "}
                <a
                  href="https://wa.me/923279541070"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C7161E] underline hover:text-[#f03c45] transition-colors"
                >
                  contact a WWAH advisor
                </a>{" "}
                if you need to make changes.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowContactModal(false)}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center mx-auto">
              <Image src="/spark.png" alt="Spark Icon" width={100} height={100} />
            </DialogTitle>
            <DialogDescription className="text-center text-black font-semibold text-[16px] pt-4">
              Are you sure you want to delete this course?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleDeleteYes}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white px-8"
            >
              Yes
            </Button>
            <Button onClick={handleDeleteNo} variant="outline" className="px-8">
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center text-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Image src="/spark.png" alt="Spark Icon" width={100} height={100} />
                <p>Are you sure you want to confirm this Course?</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 pt-2">
            <Button
              onClick={handleConfirmYes}
              className="bg-[#C7161E] hover:bg-[#f03c45] text-white px-8"
            >
              Yes
            </Button>
            <Button onClick={handleConfirmNo} variant="outline" className="px-8">
              No
            </Button>
          </div>
          <DialogDescription className="text-center pt-0">
            *This will be the course we prepare your application for. You will not be able to delete or change it later.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <p className="font-semibold text-lg md:text-xl mb-4">
        You are applying for Self-Financed admission ({appliedCourseIds.length} course
        {appliedCourseIds.length !== 1 ? "s" : ""}):
      </p>

      <div
        className="flex overflow-x-auto space-x-3 hide-scrollbar"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
        }}
      >
       {[...detailedAppliedCourses].reverse().map((course, index) => {
          const applicationDetails = getApplicationDetails(course._id);
          const isConfirmed = applicationDetails?.isConfirmed || false;
          const statusId = applicationDetails?.statusId || applicationDetails?.applicationStatus || 1;
          const statusConfig = getStatusConfig(statusId);
          
          // Get success chance for this course
          const successChance = courseSuccessChances[course._id];
          const isGenerating = generatingSuccess[course._id];
          const hasSuccessChance = successChance !== undefined;

          return (
            <div
              key={course._id || index}
              className="relative w-[90%] md:w-[100%] lg:w-[95%] flex flex-col md:flex-col gap-2 flex-shrink-0 bg-white rounded-xl p-2 md:p-2 overflow-hidden border border-gray-200"
            >
              {/* Remove Button with conditional styling and click handler */}
              <div className="flex justify-end gap-2">
                <button className="px-2 bg-[#FCE7D2] text-gray-700 rounded-md hover:text-white hover:bg-red-700 transition-colors text-[12px] font-medium">
                  <Link href={`/courses/${course._id}`}>View</Link>
                </button>
                <button
                  onClick={() => handleRemoveButtonClick(course._id)}
                  className={`border py-1 px-4 rounded-md flex items-center justify-center transition-colors ${
                    isConfirmed
                      ? "text-black-400 bg-[#FCE7D2] cursor-not-allowed opacity-50"
                      : "text-black-600 hover:bg-red-50 cursor-pointer"
                  }`}
                  title={
                    isConfirmed
                      ? "Cannot remove confirmed course"
                      : "Remove from applications"
                  }
                >
                  <Image
                    src="/delete.svg"
                    alt="Delete Icon"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-2">
                {/* Left Section: Course Info */}
                <div className="flex flex-col md:flex-row items-center gap-2 flex-1">
                  {/* Course Image and University Info */}
                  <div>
                    <div className="relative md:w-[230px] h-[180px] rounded-xl overflow-hidden">
                      <Image
                        src={
                          course.universityData?.universityImages?.banner ||
                          `/course-${index + 1}.png`
                        }
                        alt="Course Banner"
                        width={200}
                        height={150}
                        className="w-[230px] h-[180px] object-cover"
                      />
                      <div className="absolute top-4 left-0">
                        <div className="bg-gradient-to-t from-white to-transparent opacity-100 w-[70%]">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                course.universityData?.universityImages?.logo ||
                                "/logo.png"
                              }
                              alt="University Logo"
                              className="w-6 h-6 object-cover object-center rounded-full aspect-square"
                            />
                            <p className="text-sm leading-tight pr-1">
                              {course.universityData?.university_name ||
                                "University"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Share Icon on Banner Image */}
                      <div className="absolute z-10 top-4 right-4 flex space-x-1 py-1 px-3 bg-gray-200 bg-opacity-40 backdrop-blur-sm rounded-md">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button>
                              <Image
                                src="/university/Share.svg"
                                width={16}
                                height={16}
                                alt="Share"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Share link</DialogTitle>
                              <DialogDescription>
                                Anyone who has this link will be able to view
                                this.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center space-x-2">
                              <div className="grid flex-1 gap-2">
                                <Label
                                  htmlFor={`link-${course._id}`}
                                  className="sr-only"
                                >
                                  Link
                                </Label>
                                <Input
                                  id={`link-${course._id}`}
                                  value={`${
                                    typeof window !== "undefined"
                                      ? window.location.origin
                                      : ""
                                  }/courses/${course._id}`}
                                  readOnly
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                className="px-3"
                                onClick={() => {
                                  const link = `${window.location.origin}/courses/${course._id}`;
                                  navigator.clipboard
                                    .writeText(link)
                                    .then(() => {
                                      setCopiedLinkId(course._id);
                                      setTimeout(
                                        () => setCopiedLinkId(null),
                                        2000
                                      );
                                    });
                                }}
                              >
                                <span className="sr-only">Copy</span>
                                <Copy />
                              </Button>
                            </div>

                            {copiedLinkId === course._id && (
                              <p className="text-black text-sm mt-2">
                                Link copied to clipboard!
                              </p>
                            )}

                            <div className="mt-2 flex gap-4 justify-left">
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                  `${window.location.origin}/courses/${course._id}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline"
                              >
                                <BsWhatsapp className="text-2xl" />
                              </a>
                              <a
                                href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                                  `${window.location.origin}/courses/${course._id}`
                                )}`}
                                className="text-blue-600 hover:underline"
                              >
                                <AiOutlineMail className="text-2xl text-red-600" />
                              </a>
                              <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                  `${window.location.origin}/courses/${course._id}`
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
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Course title */}
                    <p className="text-[13px] font-semibold leading-snug">
                      {course.course_title || "Course Title Not Available"}
                    </p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 space-y-0 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Image
                          src="/location.svg"
                          width={16}
                          height={16}
                          alt="Location"
                        />
                        <p className="text-[12px]">
                          {course.countryname || "Country not specified"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/DashboardPage/intake.svg"
                          width={16}
                          height={16}
                          alt="Intake"
                        />
                        <p className="text-[12px]">
                          {course.intake || "Not specified"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/clock.svg"
                          width={16}
                          height={16}
                          alt="Duration"
                        />
                        <p className="text-[12px]">
                          {course.duration || "Not specified"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/money.svg"
                          width={16}
                          height={16}
                          alt="Fee"
                        />
                        <p className="text-[12px]">
                          {course.annual_tuition_fee?.currency || "$"}{" "}
                          {course.annual_tuition_fee?.amount || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/dollar.png"
                          width={16}
                          height={16}
                          alt="dollar"
                        />
                        <p className="text-[12px]">Application fee:</p>
                      </div>
                      <p
                        className="truncate text-[12px] max-w-[100px]"
                        title={course.application_fee || "Not specified"}
                      >
                        {course.application_fee || "Not specified"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/DashboardPage/deadline.svg"
                          width={13}
                          height={13}
                          alt="Deadline"
                        />
                        <p className="text-[12px]">Deadline:</p>
                      </div>
                      <p className="text-[12px]">
                        {course.application_deadline || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section: Success Chance Display */}
                <div className="flex flex-col items-center justify-between mt-4 md:mt-0">
                  <div className="relative flex flex-col items-end justify-center min-w-[140px]">
                    {hasSuccessChance && !isGenerating ? (
                      // Show success chance when available
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm font-semibold mb-2 text-center">
                          Application Success Chances
                        </p>
                        <CircularProgress progress={successChance} />
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          {successChance >= 75 ? "High Success Chance" :
                           successChance >= 50 ? "Moderate Success Chance" :
                           "Low Success Chance"}
                        </p>
                      </div>
                    ) : isGenerating ? (
                      // Show loading state when generating
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm font-semibold mb-2 text-center">
                          Application Success Chances
                        </p>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#C7161E]"></div>
                          <span className="absolute text-xs text-gray-600">AI</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          Analyzing...
                        </p>
                      </div>
                    ) : (
                      // Show blurred content with generate button
                      <>
                        <div className="blur-sm opacity-40 pointer-events-none flex flex-col justify-center items-center">
                          <p className="text-sm font-semibold mb-2 text-center w-4/5">
                            Application Success Chances
                          </p>
                          <CircularProgress progress={75} />
                        </div>
                        
                        {/* Overlay Generate Button */}
                        <button
                          onClick={() => handleGenerateSuccessChance(course)}
                          className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/90 transition-all duration-200"
                        >
                          <div className="text-center">
                            <div className="px-3 py-2 text-[12px] bg-[#C7161E] text-white rounded-full shadow-md hover:bg-red-700 transition-colors">
                              Generate Success Chances
                            </div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Status and Confirm Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 pt-4">
                  <span className="text-[13px] font-medium px-4 py-1 rounded-md text-white bg-red-600">
                    Current Status:
                  </span>
                  <div className="flex items-center gap-2 ml-2">
                    <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
                    <span className="text-sm">{statusConfig.label}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleConfirmButtonClick(course._id)}
                  disabled={applicationDetails?.isConfirmed === true}
                  className={`py-1 rounded text-white font-medium text-[13px] mr-3 ${
                    applicationDetails?.isConfirmed
                      ? "bg-red-600 cursor-not-allowed px-8"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer px-2"
                  }`}
                >
                  {applicationDetails?.isConfirmed
                    ? "Confirmed"
                    : "Confirm Course Selection"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more courses button */}
      <div className="mt-6 text-center">
        <Link href="/coursearchive">
          <Button
            variant="outline"
            className="border-[#C7161E] text-[#C7161E] hover:bg-[#C7161E] hover:text-white"
          >
            + Apply to More Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ApplyingSection;