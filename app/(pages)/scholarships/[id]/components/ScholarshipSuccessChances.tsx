import Image from "next/image";
import { useMemo, useState } from "react";
import { calculateEnglishSuccess } from "@/utils/calculateEnglishSuccess";
import { calculateGradeSuccess } from "@/utils/calculateGradeSuccess";
// import { calculateDegreeSuccess } from "@/utils/calculateDegreeSuccess";

// Define types for props
interface ScholarshipSuccessChancesProps {
  user?: {
    langPro?: {
      proficiencyTest?: "IELTS" | "PTE" | "TOEFL";
      proficiencyTestScore?: number;
    };
    majorSubject?: {
      previousGradingScore?: number | string;
      previousGradingScale?: "percentage" | "letter" | "cgpa" | "passfail";
      qualification?: string;
    };
    nationality?: string;
    age?: number;
    workExperience?: number; // in years
    isProfileComplete?: boolean;
  };
  scholarship?: {
    required_ielts_score?: string;
    required_pte_score?: string;
    required_toefl_score?: string;
    required_grade?: string;
    programs?: string[];
    age_limit?: number;
    required_nationalitie?: string[];
    work_experience_required?: number;
  };
}

export const ScholarshipSuccessChances = ({
  user,
  scholarship,
}: ScholarshipSuccessChancesProps) => {
  // Check if profile is complete

  // const isProfileComplete = user?.isProfileComplete || false;

  // Calculate English proficiency success
  const englishSuccess = useMemo(() => {
    if (!user?.langPro || !scholarship) return 0;

    const userTest = user.langPro.proficiencyTest || "IELTS";
    const userScore = user.langPro.proficiencyTestScore || 0;

    // Extract required score based on test type
    let requiredScore = null;
    if (userTest === "IELTS" && scholarship.required_ielts_score) {
      const match = scholarship.required_ielts_score.match(
        /(?:Overall|Band)(?:\s*:)?\s*([\d.]+)/i
      );
      requiredScore = match ? parseFloat(match[1]) : null;
    } else if (userTest === "PTE" && scholarship.required_pte_score) {
      const match = scholarship.required_pte_score.match(
        /(?:Overall|Band)(?:\s*:)?\s*([\d.]+)/i
      );
      requiredScore = match ? parseFloat(match[1]) : null;
    } else if (userTest === "TOEFL" && scholarship.required_toefl_score) {
      const match = scholarship.required_toefl_score.match(
        /(?:Overall|Band)(?:\s*:)?\s*([\d.]+)/i
      );
      requiredScore = match ? parseFloat(match[1]) : null;
    }

    return calculateEnglishSuccess(userTest, userScore, requiredScore);
  }, [user?.langPro, scholarship]);

  // Calculate grade success
  const gradeSuccess = useMemo(() => {
    const studentGrade = user?.majorSubject?.previousGradingScore || 0;
    const studentScale =
      user?.majorSubject?.previousGradingScale || "percentage";
    if (!studentGrade || !studentScale) return 10;
    const requiredGrade = scholarship?.required_grade || 0;
    return calculateGradeSuccess(studentGrade, requiredGrade, studentScale);
  }, [user?.majorSubject, scholarship?.required_grade]);

  const degreeSuccess = useMemo(() => {
    // Fallback to "Master" if qualification is undefined/null
    const studentDegree = user?.majorSubject?.qualification ?? "";
    // If we don’t have a degree or no programs to compare, give 0
    if (!studentDegree || !scholarship?.programs?.length) {
      return 10;
    }
    const isDegreeMatch = scholarship.programs.includes(studentDegree);
    return isDegreeMatch ? 100 : 30; // 100% if match, 0% if not
  }, [user?.majorSubject?.qualification, scholarship?.programs]);

  // Calculate work experience success
  const workExperienceSuccess = useMemo(() => {
    const userExp = user?.workExperience || 0;

    const requiredExp = scholarship?.work_experience_required || 0;
    if (!userExp) return 10;
    if (requiredExp === 0) return 100; // No experience required
    if (userExp >= requiredExp) return 100; // Meets or exceeds requirement
    if (userExp >= requiredExp * 0.75) return 85; // At least 75% of required
    if (userExp >= requiredExp * 0.5) return 70; // At least 50% of required
    if (userExp >= requiredExp * 0.25) return 40; // At least 25% of required
    return 20; // Less than 25% of required
  }, [user?.workExperience, scholarship?.work_experience_required]);

  // Calculate nationality success
  const nationalitySuccess = useMemo(() => {
    const userNationality = user?.nationality || "";
    const preferredNationalities = scholarship?.required_nationalitie || [];
    if (!userNationality) return 10;
    if (preferredNationalities.length === 0) return 100; // No nationality preference
    if (preferredNationalities.includes(userNationality.toLowerCase()))
      return 100; // Preferred nationality
    return 30; // Not a preferred nationality
  }, [user?.nationality, scholarship?.required_nationalitie]);

  // Calculate age success
  const ageSuccess = useMemo(() => {
    const userAge = user?.age || 0;
    const ageLimit = scholarship?.age_limit || 0;
    if (!userAge) return 10; // No age provided
    if (ageLimit === 0) return 100; // No age limit
    if (userAge <= ageLimit) return 100; // Within age limit
    if (userAge <= ageLimit - 2) return 80; // Slightly over
    if (userAge <= ageLimit - 5) return 60; // Moderately over
    if (userAge <= ageLimit - 10) return 40; // Significantly over
    return 20; // Far above limit
  }, [user?.age, scholarship?.age_limit]);

  // Prepare data for rendering
  const academicFactors = [
    {
      label: "Academic Background",
      value: degreeSuccess,
      icon: "/degree-icon.svg",
    },
    { label: "Grades/CGPA", value: gradeSuccess, icon: "/grade-icon.svg" },
    {
      label: "Work Experience",
      value: workExperienceSuccess,
      icon: "/work-icon.svg",
    },
    {
      label: "English Proficiency",
      value: englishSuccess,
      icon: "/lang-icon.svg",
    },
  ];

  const financialFactors = [
    {
      label: "Nationality",
      value: nationalitySuccess,
      icon: "/nationality.svg",
    },
    { label: "Age", value: ageSuccess, icon: "/age.svg" },
  ];

  // Calculate overall success chances
  const academicOverall = Math.round(
    (degreeSuccess + gradeSuccess + workExperienceSuccess + englishSuccess) / 4
  );
  const financialOverall = Math.round((nationalitySuccess + ageSuccess) / 2);
  const [genrate, setGenrate] = useState(false);
  console.log("genrate", setGenrate);
  // Helper function for progress bar colors
  const getProgressBarColor = (value: number): string => {
    return value >= 75 ? "#E5EDDE" : value >= 50 ? "#E5EDDE" : "#F4D0D2";
  };

  return (
    <section className="relative md:my-4 flex flex-col items-center justify-center p-4 sm:p-6">
      {genrate ? (
        <></>
      ) : (
        <div className="bg-red-500 h-screen shadow-md w-full absolute top-0 left-0 z-10 opacity-50 mx-auto">
          <div className="w-full ">
            <button className="bg-black p-4 text-white text-[20px]">
              Genrate
            </button>
          </div>
        </div>
      )}
      <div>
        <h3 className="">Scholarship Success Chances!</h3>
        <p className="text-gray-600 mb-2">
          Your scholarship success chances are:
        </p>
      </div>

      {/* 
      {!isProfileComplete && (
        <div className="text-center py-2 lg:px-4">
          <div
            className="p-2 bg-blue-400 items-center text-white leading-none lg:rounded-full flex lg:inline-flex rounded-lg"
            role="alert"
          >
            <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
              New
            </span>
            <span className="font-semibold mr-2 text-left flex-auto">
              <Link href={"/completeprofile"} className="underline">
                Complete
              </Link>{" "}
              your profile to get your success chance
            </span>
            <svg
              className="fill-current opacity-75 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
            </svg>
          </div>
        </div>
      )} */}

      <div className="flex flex-col md:flex-row justify-center gap-5 w-full lg:w-[85%]">
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
                  className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                  style={{
                    width: `${item.value}%`,
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
                <p className="absolute right-4 text-black">{item.value}%</p>
              </div>
              {/* Add spacing between bars */}
              {index !== academicFactors.length - 1 && (
                <div className="h-4 rounded-md"></div>
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
                  className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                  style={{
                    width: `${item.value}%`,
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
                <p className="absolute right-4 text-black">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Results Section */}
        <div className="hidden md:flex items-center gap-4">
          <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
          <p className="text-center">
            Financial Results <br /> {financialOverall}%
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSuccessChances;
