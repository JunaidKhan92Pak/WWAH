import Image from "next/image";
import { useState, useEffect } from "react";
import { calculateAllSuccessMetrics } from "@/utils/successChance/scholarshipsuccess";

// Define types for props
interface ScholarshipSuccessChancesProps {
  successChances?: {
    academicBackground?: string;
    age?: string;
    englishProficiency?: string;
    gradesAndCGPA?: string;
    nationality?: string;
    workExperience?: string;
  };
}

export const ScholarshipSuccessChances = ({ successChances }: ScholarshipSuccessChancesProps) => {
  const [successGenerated, setSuccessGenerated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user,] = useState({
    langPro: {
      proficiencyTest: "TOEFL",
      proficiencyTestScore: 50
    },
    majorSubject: {
      previousGradingScore: 20,
      previousGradingScale: "percentage",
      qualification: "Inter",
    },
    nationality: "Australian",
    age: 40,
    workExperience: 2, // in years
    isProfileComplete: true,
  });

  const [successMetrics, setSuccessMetrics] = useState({
    englishSuccess: 10,
    gradeSuccess: 100,
    degreeSuccess: 10,
    workExperienceSuccess: 50,
    nationalitySuccess: 50,
    ageSuccess: 100
  });

  // Check if profile is complete

  const isProfileComplete = user?.isProfileComplete || false;

  // Reset success generated state when user data or success chances change
  useEffect(() => {
    setSuccessGenerated(false);
  }, [user, successChances]);

  // Function to generate success metrics with loading state
  const generateSuccessMetrics = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      const metrics = calculateAllSuccessMetrics(user, successChances);
      setSuccessMetrics(metrics);
      setSuccessGenerated(true);
      setIsAnalyzing(false);
    }, 1500); // 1.5 seconds delay to simulate analysis
  };

  // Prepare data for rendering based on whether metrics have been generated
  const academicFactors = [
    { label: "Academic Background", value: successMetrics.degreeSuccess, icon: "/degree-icon.svg" },
    { label: "Grades/CGPA", value: successMetrics.gradeSuccess, icon: "/grade-icon.svg" },
    { label: "Work Experience", value: successMetrics.workExperienceSuccess, icon: "/work-icon.svg" },
    { label: "English Proficiency", value: successMetrics.englishSuccess, icon: "/lang-icon.svg" },
  ];

  const financialFactors = [
    { label: "Nationality", value: successMetrics.nationalitySuccess, icon: "/nationality.svg" },
    { label: "Age", value: successMetrics.ageSuccess, icon: "/age.svg" },
  ];

  // Calculate overall success chances
  const academicOverall = Math.round(
    (successMetrics.degreeSuccess +
      successMetrics.gradeSuccess +
      successMetrics.workExperienceSuccess +
      successMetrics.englishSuccess) / 4
  );

  const financialOverall = Math.round(
    (successMetrics.nationalitySuccess + successMetrics.ageSuccess) / 2
  );

  // Helper function for progress bar colors
  const getProgressBarColor = (value: number): string => {
    return value >= 75 ? "#90EE90" : value >= 50 ? "#E5EDDE" : "#F4D0D2";
  };

  return (
    <section className="md:my-4 flex flex-col items-center justify-center p-4 sm:p-6">
      <h3 className="">Scholarship Success Chances!</h3>
      <p className="text-gray-600 mb-2">
        Your scholarship success chances are:
      </p>
      {isProfileComplete && (
        <div className="relative w-full lg:w-[85%]">
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
                        width: successGenerated ? `${item.value}%` : '0%',
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
                    <p className="absolute right-4 text-black">{successGenerated ? `${item.value}%` : '0%'}</p>
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
                      className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 flex items-center px-4 text-black"
                      style={{
                        width: successGenerated ? `${item.value}%` : '0%',
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
                    <p className="absolute right-4 text-black">{successGenerated ? `${item.value}%` : '0%'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Results Section */}
            <div className="hidden md:flex items-center gap-4">
              <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
              <p className="text-center">
                Financial Results <br /> {successGenerated ? financialOverall : 0}%
              </p>
            </div>
          </div>

          {/* Blur Overlay with Generate Button or Loading State (shown when success not generated) */}
          {!successGenerated && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-3xl transition-all duration-300">
              {isAnalyzing ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-blue-600 font-medium">AI is analyzing your Chance...</p>
                </div>
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
      )}
    </section>
  );
};

export default ScholarshipSuccessChances;
