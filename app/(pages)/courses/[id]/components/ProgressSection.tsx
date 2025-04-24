import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { calculateAllSuccessMetrics } from "@/utils/successChance/courseSuccess";
import { useUserInfo } from "@/store/userStore/userSuccessInfo";
import Link from "next/link";

interface CourseData {
  _id: string;
  countryname: string;
  universityname: string;
  course_title: string;
  required_ielts_score: string;
  required_pte_score: string;
  required_toefl_score: string;
  entry_requirement: string;
  entry_requirements: string;
  course_level: string;
  annual_tuition_fee: {
    currency: string;
    amount: number;
  };
}

export const ProgressSection = ({ data }: { data: CourseData }) => {
  const [successGenerated, setSuccessGenerated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const { userSuccessInfo, isLoggedIn, hasData, fetchUserSuccessInfo } =
    useUserInfo();

  // Initial state for success metrics
  const [successMetrics, setSuccessMetrics] = useState({
    englishSuccess: 10,
    gradeSuccess: 100,
    degreeSuccess: 10,
    workExperienceSuccess: 50,
    tuitionFeeSuccess: 100,
    costofliving: 20,
  });
  // Create course data reference
  const courseDataRef = useRef({
    requiredWorkExp: 2,
    requiredDegree: "",
    requiredSubject: "",
    englishProficiency: { ielts: "", pte: "", tofel: "" },
    requiredGrade: "",
    tutionfee: { amount: 0, currency: "" },
    costofliving: 2,
  });

  // Fetch user info when component mounts
  useEffect(() => {
    fetchUserSuccessInfo();
  }, [fetchUserSuccessInfo]);

  // Update courseData ref when prop data changes
  useEffect(() => {
    if (data) {
      courseDataRef.current = {
        requiredWorkExp: 2,
        requiredDegree: data.course_level,
        requiredSubject: data.course_title,
        englishProficiency: {
          ielts: data.required_ielts_score,
          pte: data.required_pte_score,
          tofel: data.required_toefl_score,
        },
        requiredGrade: data?.entry_requirement || data?.entry_requirements,
        tutionfee: { amount: data?.annual_tuition_fee.amount, currency: data.annual_tuition_fee.currency },
        costofliving: 2,
      };
      // Reset states when course data changes
      setSuccessGenerated(false);
      setShowLoginPrompt(false);
      setShowProfilePrompt(false);
    }
  }, [data]);

  // Function to generate success metrics
  const generateSuccessMetrics = () => {
    setIsAnalyzing(true);
    // Check login status and data availability after a short delay
    setTimeout(() => {
      setIsAnalyzing(false);
      if (!isLoggedIn) {
        setShowLoginPrompt(true);
        return;
      }

      if (!hasData || !userSuccessInfo) {
        setShowProfilePrompt(true);
        return;
      }

      // If logged in and has data, calculate metrics
      // const userInfo = {
      //   languageProficiency: {
      //     test: userSuccessInfo.languageProficiency.test,
      //     score: parseInt(userSuccessInfo.languageProficiency.score) || 0
      //   },
      //   majorSubject: {
      //     previousGradingScore: userSuccessInfo.grade || 20,
      //     previousGradingScale: userSuccessInfo.gradetype || "percentage",
      //     qualification: userSuccessInfo.studyLevel || "Inter",
      //   },
      //   subject: userSuccessInfo.majorSubject || "Computer",
      //   workExperience: parseInt(userSuccessInfo.workExperience) || 2,
      //   isProfileComplete: true,
      //   tuitionFee: userSuccessInfo.tuitionFee || "$200",
      //   costofliving: userSuccessInfo.livingCosts || "$200",
      // };
      // const userInfo = {
      //   languageProficiency: {
      //     test: userSuccessInfo.languageProficiency.test,
      //     score: parseInt(userSuccessInfo.languageProficiency.score) || 0
      //   },
      //   majorSubject: {
      //     previousGradingScore: userSuccessInfo.grade || 20,
      //     previousGradingScale: userSuccessInfo.gradetype || "percentage",
      //     qualification: userSuccessInfo.studyLevel || "Inter",
      //   },
      //   subject: userSuccessInfo.majorSubject || "Computer",
      //   workExperience: parseInt(userSuccessInfo.workExperience) || 2,
      //   isProfileComplete: true,
      //   tuitionFee: userSuccessInfo.tuitionFee || "$200",
      //   costofliving: userSuccessInfo.livingCosts || "$200",
      // };

      const metrics = calculateAllSuccessMetrics(
        userSuccessInfo,
        courseDataRef.current
      );
      setSuccessMetrics(metrics);
      setSuccessGenerated(true);
    }, 1500);
  };
  // Define factors for rendering
  const academicFactors = [
    {
      label: "Academic Background",
      value: successMetrics.degreeSuccess,
      icon: "/degree-icon.svg",
    },
    {
      label: "Grades/CGPA",
      value: successMetrics.gradeSuccess,
      icon: "/grade-icon.svg",
    },
    {
      label: "Work Experience",
      value: successMetrics.workExperienceSuccess,
      icon: "/work-icon.svg",
    },
    {
      label: "English Proficiency",
      value: successMetrics.englishSuccess,
      icon: "/lang-icon.svg",
    },
  ];

  const financialFactors = [
    {
      label: "Tuition Fee",
      value: successMetrics.tuitionFeeSuccess,
      icon: "/work-icon.svg",
    },
    {
      label: "Cost of Living",
      value: successMetrics.costofliving,
      icon: "/Tea-Cup.svg",
    },
  ];

  // Calculate overall scores
  const academicOverall = Math.round(
    academicFactors.reduce((sum, factor) => sum + factor.value, 0) /
    academicFactors.length
  );

  const financialOverall = Math.round(
    financialFactors.reduce((sum, factor) => sum + factor.value, 0) /
    financialFactors.length
  );

  // Helper function for progress bar color
  const getProgressBarColor = (value: number) =>
    value >= 75 ? "#90EE90" : value >= 50 ? "#e5edde" : "#f4d0d2";

  // Login prompt content
  const LoginPrompt = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center text-gray-600 mb-4">
        Please log in to see your scholarship success chances
      </p>
      <Link href="/signin">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
          Login
        </button>
      </Link>
    </div>
  );

  // Profile completion prompt content
  const ProfilePrompt = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center text-gray-600 mb-4">
        Please complete your profile to see your scholarship success chances
      </p>
      <Link href="/successratioform">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
          Complete Profile
        </button>
      </Link>
    </div>
  );

  return (
    <section className="md:my-4 flex flex-col items-center justify-center p-4 sm:p-6">
      <h3 className="">Scholarship Success Chances!</h3>
      <p className="text-gray-600 mb-2">
        Your scholarship success chances are:
      </p>

      <div className="relative w-full lg:w-[80%]">
        {/* Success Metrics Content */}
        <div className="flex flex-col md:flex-row justify-center gap-5 w-full">
          {/* Academic Results Section */}
          <div className="hidden md:flex items-center gap-4">
            <p className="text-center">
              Academic Results <br /> {academicOverall}%
            </p>
            <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
          </div>

          {/* Academic Progress Bars */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white shadow rounded-3xl p-4 md:px-6">
            {academicFactors.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="relative w-full h-[3.8rem] rounded-2xl bg-[#F7F7F7] overflow-hidden flex items-center px-4">
                  <div
                    className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 flex items-center px-4 text-black"
                    style={{
                      width: successGenerated ? `${item.value}%` : "0%",
                      backgroundColor: getProgressBarColor(item.value),
                    }}
                  >
                    <p className="flex items-center gap-2 text-[14px]">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="md:w-6 md:h-6 w-5 h-5"
                      />
                      {item.label}
                    </p>
                  </div>
                  <p className="absolute right-4 text-black">
                    {successGenerated ? `${item.value}%` : "0%"}
                  </p>
                </div>
                {index !== academicFactors.length - 1 && (
                  <div className="h-4"></div>
                )}
              </div>
            ))}
          </div>

          {/* Financial Progress Bars */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white shadow rounded-3xl p-2 md:px-6">
            {financialFactors.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="relative w-full h-44 rounded-2xl bg-[#F7F7F7] overflow-hidden flex items-center px-4">
                  <div
                    className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 flex items-center px-4 text-black"
                    style={{
                      width: successGenerated ? `${item.value}%` : "0%",
                      backgroundColor: getProgressBarColor(item.value),
                    }}
                  >
                    <p className="flex items-center gap-2">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="md:w-6 md:h-6 h-5 w-5"
                      />
                      {item.label}
                    </p>
                  </div>
                  <p className="absolute right-4 text-black">
                    {successGenerated ? `${item.value}%` : "0%"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Results Section */}
          <div className="hidden md:flex items-center gap-4">
            <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
            <p className="text-center">
              Financial Results <br /> {successGenerated ? financialOverall : 0}
              %
            </p>
          </div>
        </div>

        {/* Blur Overlay with various states */}
        {!successGenerated && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-3xl transition-all duration-300">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-blue-600 font-medium">
                  AI is analyzing your Chance...
                </p>
              </div>
            ) : showLoginPrompt ? (
              <LoginPrompt />
            ) : showProfilePrompt ? (
              <ProfilePrompt />
            ) : (
              <button
                onClick={generateSuccessMetrics}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
              >
                Generate Success Chances
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
