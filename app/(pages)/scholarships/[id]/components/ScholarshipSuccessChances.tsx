
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { calculateAllSuccessMetrics } from "@/utils/successChance/scholarshipsuccess";
import Link from "next/link";
import { useUserInfo } from "@/store/userStore/userSuccessInfo";
import SuccessCircle from "@/components/SuccessCircle ";
// import synonyms from "@/synonyms.json";

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

interface SuccessMetrics {
  englishSuccess: number;
  gradeSuccess: number;
  degreeSuccess: number;
  workExperienceSuccess: number;
  nationalitySuccess: number;
  ageSuccess: number;
}

interface ProgressFactor {
  label: string;
  value: number;
  icon: string;
  fieldKey: string;
}

interface EditableField {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'select' | 'currency';
  options?: { label: string; value: string }[];
  additionalFields?: { [key: string]: string | number };
}

// Types matching your Zustand store
type LanguageProficiency = {
  score: string | number;
  test: string;
};

type StudyPreferenced = {
  country: string;
  degree: string;
  subject: string;
};

type SuccessData = {
  studyLevel: string;
  gradetype: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  costofliving?: {
    amount: number;
    currency: string;
  };
  tutionfee?: {
    amount: number;
    currency: string;
  };
  languageProficiency: LanguageProficiency;
  workExperience: string;
  studyPreferenced: StudyPreferenced;
};

const INITIAL_SUCCESS_METRICS: SuccessMetrics = {
  englishSuccess: 0,
  gradeSuccess: 0,
  degreeSuccess: 0,
  workExperienceSuccess: 0,
  nationalitySuccess: 0,
  ageSuccess: 0,
};

const ANALYSIS_DELAY = 1500;

const PROGRESS_BAR_COLORS = {
  HIGH: "#90EE90",    // >= 75%
  MEDIUM: "#e5edde",  // >= 50%
  LOW: "#f4d0d2"      // < 50%
} as const;

export const ScholarshipSuccessChances = ({
  successChances,
}: ScholarshipSuccessChancesProps) => {
  const [successGenerated, setSuccessGenerated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetrics>(INITIAL_SUCCESS_METRICS);

  // Edit feature states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<EditableField | null>(null);
  const [editedUserData, setEditedUserData] = useState<SuccessData | null>(null);
  const [originalUserData, setOriginalUserData] = useState<SuccessData | null>(null);

  const { userSuccessInfo, isLoggedIn, hasData, fetchUserSuccessInfo } = useUserInfo();

  // Initialize edited user data with original data and store original
  useEffect(() => {
    if (userSuccessInfo && !editedUserData) {
      setEditedUserData({ ...userSuccessInfo });
      setOriginalUserData({ ...userSuccessInfo });
    }
  }, [userSuccessInfo, editedUserData]);

  // Progress bar color utility
  const getProgressBarColor = useCallback((value: number): string => {
    if (value >= 75) return PROGRESS_BAR_COLORS.HIGH;
    if (value >= 50) return PROGRESS_BAR_COLORS.MEDIUM;
    return PROGRESS_BAR_COLORS.LOW;
  }, []);

  // Academic factors configuration
  const academicFactors: ProgressFactor[] = useMemo(() => [
    {
      label: "Academic Background",
      value: successMetrics.degreeSuccess,
      icon: "/degree-icon.svg",
      fieldKey: "degree",
    },
    {
      label: "Grades/CGPA",
      value: successMetrics.gradeSuccess,
      icon: "/grade-icon.svg",
      fieldKey: "grade",
    },
    {
      label: "Work Experience",
      value: successMetrics.workExperienceSuccess,
      icon: "/work-icon.svg",
      fieldKey: "workExp",
    },
    {
      label: "English Proficiency",
      value: successMetrics.englishSuccess,
      icon: "/lang-icon.svg",
      fieldKey: "english",
    },
  ], [successMetrics]);

  // Financial factors configuration (for scholarship - nationality and age)
  const financialFactors: ProgressFactor[] = useMemo(() => [
    {
      label: "Nationality",
      value: successMetrics.nationalitySuccess,
      icon: "/nationality.svg",
      fieldKey: "nationality",
    },
    {
      label: "Age",
      value: successMetrics.ageSuccess,
      icon: "/age.svg",
      fieldKey: "age",
    },
  ], [successMetrics]);

  // Calculate overall percentages
  const { overallSuccess, academicOverall, financialOverall } = useMemo(() => {
    const academicSum = academicFactors.reduce((sum, factor) => sum + factor.value, 0);
    const financialSum = financialFactors.reduce((sum, factor) => sum + factor.value, 0);
    

    return {
      academicOverall: Math.round(academicSum / academicFactors.length),
      financialOverall: Math.round(financialSum / financialFactors.length),
      overallSuccess: Math.round((academicSum + financialSum) / (academicFactors.length + financialFactors.length)),
    };
    console.warn(academicOverall, financialOverall);
  }, [academicFactors, financialFactors]);

  // Reset state when success chances change
  useEffect(() => {
    setSuccessGenerated(false);
    setShowLoginPrompt(false);
    setShowProfilePrompt(false);
    setSuccessMetrics(INITIAL_SUCCESS_METRICS);
    setEditedUserData(null);
    setOriginalUserData(null);
  }, [successChances]);

  // Fetch user info on mount
  useEffect(() => {
    fetchUserSuccessInfo();
  }, [fetchUserSuccessInfo]);

  // Generate success metrics with proper error handling
  const generateSuccessMetrics = useCallback(() => {
    setIsAnalyzing(true);

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

      try {
        // Use edited data if available, otherwise use original data
        const dataToUse = editedUserData || userSuccessInfo;
        const metrics = calculateAllSuccessMetrics(dataToUse, successChances);

        setSuccessMetrics({
          englishSuccess: metrics.englishSuccess ?? 0,
          gradeSuccess: metrics.gradeSuccess ?? 0,
          degreeSuccess: metrics.degreeSuccess ?? 0,
          workExperienceSuccess: metrics.workExperienceSuccess ?? 0,
          nationalitySuccess: metrics.nationalitySuccess ?? 0,
          ageSuccess: metrics.ageSuccess ?? 0,
        });

        setSuccessGenerated(true);
      } catch (error) {
        console.error("Error calculating success metrics:", error);
      }
    }, ANALYSIS_DELAY);
  }, [isLoggedIn, hasData, userSuccessInfo, successChances, editedUserData]);

  // Recalculate metrics when edited data changes
  useEffect(() => {
    if (successGenerated && editedUserData) {
      try {
        const metrics = calculateAllSuccessMetrics(editedUserData, successChances);
        setSuccessMetrics({
          englishSuccess: metrics.englishSuccess ?? 0,
          gradeSuccess: metrics.gradeSuccess ?? 0,
          degreeSuccess: metrics.degreeSuccess ?? 0,
          workExperienceSuccess: metrics.workExperienceSuccess ?? 0,
          nationalitySuccess: metrics.nationalitySuccess ?? 0,
          ageSuccess: metrics.ageSuccess ?? 0,
        });
      } catch (error) {
        console.error("Error recalculating success metrics:", error);
      }
    }
  }, [editedUserData, successChances, successGenerated]);

  // Handle field edit
  const handleEditField = (fieldKey: string, label: string) => {
    if (!editedUserData) return;
    console.log(`Editing field: ${fieldKey} (${label})`);

    let fieldValue = '';
    let fieldType: 'text' | 'number' | 'select' | 'currency' = 'text';
    let options: { label: string; value: string }[] = [];
    let additionalFields: { [key: string]: string } = {};

    switch (fieldKey) {
      case 'degree':
        fieldValue = editedUserData.studyLevel || '';
        fieldType = 'select';
        options = [
          { label: "Bachelor's", value: "Bachelor" },
          { label: "Master's", value: "Master" },
          { label: "PhD", value: "PhD" },
          { label: "Diploma", value: "Diploma" },
          { label: "Certificate", value: "Certificate" },
        ];
        break;
      case 'grade':
        fieldValue = editedUserData.grade?.toString() || '';
        fieldType = 'number';
        additionalFields = {
          gradeType: editedUserData.gradetype || 'percentage'
        };
        break;
      case 'workExp':
        fieldValue = editedUserData.workExperience || '';
        fieldType = 'number';
        break;
      case 'english':
        fieldValue = editedUserData.languageProficiency?.score?.toString() || '';
        fieldType = 'number';
        additionalFields = {
          test: editedUserData.languageProficiency?.test || 'IELTS'
        };
        break;
      case 'nationality':
        fieldValue = editedUserData.nationality || '';
        fieldType = 'text';
        break;
      case 'age':
        // Calculate age from dateOfBirth
        if (editedUserData.dateOfBirth) {
          const birthDate = new Date(editedUserData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          fieldValue = age.toString();
        }
        fieldType = 'number';
        break;
      default:
        fieldValue = '';
    }

    setCurrentEditField({
      key: fieldKey,
      label,
      value: fieldValue,
      type: fieldType,
      options,
      additionalFields,
    });
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = (newValue: string, additionalData?: { [key: string]: string }) => {
    if (!currentEditField || !editedUserData) return;

    const updatedData = { ...editedUserData };

    switch (currentEditField.key) {
      case 'degree':
        updatedData.studyLevel = newValue;
        break;
      case 'grade':
        updatedData.grade = parseFloat(newValue) || 0;
        if (additionalData?.gradeType) {
          updatedData.gradetype = additionalData.gradeType;
        }
        break;
      case 'workExp':
        updatedData.workExperience = newValue;
        break;
      case 'english':
        if (!updatedData.languageProficiency) {
          updatedData.languageProficiency = { test: 'IELTS', score: 0 };
        }
        updatedData.languageProficiency.score = parseFloat(newValue) || 0;
        if (additionalData?.test) {
          updatedData.languageProficiency.test = additionalData.test;
        }
        break;
      case 'nationality':
        updatedData.nationality = newValue;
        break;
      case 'age':
        // Calculate new dateOfBirth based on age
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(newValue);
        updatedData.dateOfBirth = `${birthYear}-01-01`;
        break;
    }

    setEditedUserData(updatedData);
    setIsEditModalOpen(false);
    setCurrentEditField(null);
  };

  // Get explanation text for each field (universal)
  const getExplanationText = (value: number) => {
    if (value >= 90) return "Excellent! Great match for this scholarship.";
    if (value >= 60) return "Good chance! See how to improve further.";
    if (value >= 30) return "Moderate chance. See your options.";
    return "Low match? Explore alternatives.";
  };

  // Tooltip configuration for scholarship-specific fields
  const tooltipConfig: Record<string, { limit: number; text: string }[]> = {
    degree: [
      { limit: 100, text: "Perfect degree match! Your academic background strongly aligns with scholarship requirements. Apply with confidence!" },
      { limit: 75, text: "Good degree match. Your background fits well. Contact a WWAH Advisor for application guidance." },
      { limit: 50, text: "Moderate match. Your degree is somewhat relevant. Speak with a WWAH Advisor about strengthening your application." },
      { limit: 10, text: "Low degree match. Consider exploring scholarships better suited to your academic background." },
    ],

    grade: [
      { limit: 90, text: "Outstanding grades! You meet the academic excellence criteria. Apply immediately!" },
      { limit: 75, text: "Excellent grades! You're a strong candidate. Start your application process." },
      { limit: 60, text: "Good grades. You have a solid chance. Consider highlighting other strengths in your application." },
      { limit: 40, text: "Below average grades. Focus on showcasing other achievements and experiences." },
      { limit: 20, text: "Low grades may affect your chances. Consider scholarships with more flexible academic requirements." },
    ],

    workExp: [
      { limit: 90, text: "Excellent work experience! This significantly strengthens your scholarship application." },
      { limit: 70, text: "Good work experience. This adds value to your profile." },
      { limit: 50, text: "Some work experience. Consider highlighting leadership and skills gained." },
      { limit: 30, text: "Limited work experience. Focus on academic achievements and extracurricular activities." },
      { limit: 10, text: "No significant work experience. Emphasize academic excellence and potential in your application." },
    ],

    english: [
      { limit: 90, text: "Excellent English proficiency! This meets all scholarship language requirements." },
      { limit: 75, text: "Good English score. You meet most scholarship requirements." },
      { limit: 60, text: "Decent English proficiency. Some scholarships may require higher scores." },
      { limit: 40, text: "Below average English score. Consider retaking the test or exploring scholarships with lower requirements." },
      { limit: 20, text: "Low English proficiency. Focus on improving your language skills before applying." },
    ],

    nationality: [
      { limit: 90, text: "Your nationality gives you excellent scholarship opportunities! Many programs prioritize your region." },
      { limit: 70, text: "Good scholarship prospects based on your nationality. You have access to various programs." },
      { limit: 50, text: "Moderate opportunities. Some scholarships may prioritize other nationalities." },
      { limit: 30, text: "Limited nationality-based scholarships. Focus on merit-based opportunities." },
      { limit: 10, text: "Few nationality-specific scholarships available. Explore general merit scholarships." },
    ],

    age: [
      { limit: 90, text: "Perfect age range! You fit the ideal demographic for most scholarships." },
      { limit: 75, text: "Good age range. You're eligible for most scholarship programs." },
      { limit: 60, text: "Acceptable age range. Some scholarships may have age preferences." },
      { limit: 40, text: "Age may be a limiting factor for some scholarships. Focus on age-flexible programs." },
      { limit: 20, text: "Age restrictions may limit options. Look for scholarships without strict age limits." },
    ],
  };

  const getTooltipText = (fieldKey: string, value: number) => {
    const config = tooltipConfig[fieldKey];
    if (!config) return "Contact a WWAH Advisor for guidance.";

    for (const { limit, text } of config) {
      if (value >= limit) return text;
    }

    return "Explore alternative scholarship options with a WWAH Advisor.";
  };

  // Progress bar component with edit functionality
  const ProgressBar: React.FC<{
    factor: ProgressFactor;
    isLast?: boolean;
    height?: string;
    showExplanation?: boolean;
  }> = ({ factor, height = "4rem", showExplanation = true }) => (
    <div className="relative flex flex-col  ">
      <div className="relative w-full rounded-xl bg-gray-100 overflow-hidden flex items-center px-4 group" style={{ height }} >
        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-xl transition-all duration-700 ease-out flex items-center px-4"
          style={{
            width: successGenerated ? `${factor.value}%` : "0%",
            backgroundColor: getProgressBarColor(factor.value),
          }}
        />

        {/* Content */}
        <div className="relative  flex items-center gap-3 text-md font-medium text-gray-800">
          <Image
            src={factor.icon}
            alt={factor.label}
            width={20}
            height={20}
            className="w-5 h-5"
          />
          {factor.label}
        </div>

        {/* Edit Button */}
        {successGenerated && (
          <button
            onClick={() => handleEditField(factor.fieldKey, factor.label)}
            className="absolute top-1 right-4 opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-md  z-10 border border-gray-200"
            title={`Edit ${factor.label}`}
          >
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        {/* Percentage */}
        <p className="absolute right-4 text-gray-800 font-semibold text-md ">
          {successGenerated ? `${factor.value}%` : "0%"}
        </p>

      </div>

      {/* Explanation text */}
      {successGenerated && showExplanation && (
        <div className="my-2 px-4 absolute bottom-0 left-2">
          <p className="text-[13px] text-gray-800 flex items-center gap-1">
            {/* Universal explanation */}
            {getExplanationText(factor.value)}

            {/* Info icon with tooltip */}
            <span className="relative inline-block group w-[20px] h-[20px] border-[1px] text-center border-red-500 rounded-full">
              <span className="text-red-500 cursor-pointer">ℹ</span>

              {/* Tooltip (field + percentage specific) */}
              <div className="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 
             bg-orange-100 text-gray-800 text-sm rounded-lg shadow-md p-3 w-64 z-50
             opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {getTooltipText(factor.fieldKey, factor.value)}
              </div>
            </span>
          </p>
        </div>
      )}

    </div>
  );

  // Enhanced Edit Modal Component
  const EditModal: React.FC = () => {
    const [inputValue, setInputValue] = useState(currentEditField?.value || '');
    const [additionalValues, setAdditionalValues] = useState<{ [key: string]: string }>({});

    useEffect(() => {
      if (currentEditField) {
        setInputValue(currentEditField.value || '');
        setAdditionalValues(
          Object.fromEntries(
            Object.entries(currentEditField.additionalFields || {}).map(([k, v]) => [k, String(v)])
          )
        );
      }
    }, [currentEditField]);

    if (!isEditModalOpen || !currentEditField) return null;

    const handleSave = () => {
      handleSaveEdit(inputValue, additionalValues);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg mx-4 animate-slideUp">
          <h3 className="text-xl font-semibold mb-4">Edit {currentEditField.label}</h3>

          <div className="space-y-4">
            {/* Main input field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentEditField.label}
              </label>
              {currentEditField.type === 'select' ? (
                <select
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select...</option>
                  {currentEditField.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={currentEditField.type}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${currentEditField.label.toLowerCase()}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min={currentEditField.type === 'number' ? "0" : undefined}
                  step={currentEditField.key === 'grade' || currentEditField.key === 'english' ? "0.1" : "1"}
                />
              )}
            </div>

            {/* Additional fields based on field type */}
            {currentEditField.key === 'grade' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Type</label>
                <select
                  value={additionalValues.gradeType || 'percentage'}
                  onChange={(e) => setAdditionalValues(prev => ({ ...prev, gradeType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="percentage">Percentage</option>
                  <option value="cgpa">CGPA</option>
                </select>
              </div>
            )}

            {currentEditField.key === 'english' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                <select
                  value={additionalValues.test || 'IELTS'}
                  onChange={(e) => setAdditionalValues(prev => ({ ...prev, test: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="PTE">PTE</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setCurrentEditField(null);
              }}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Prompt components
  const LoginPrompt: React.FC = () => (
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

  const ProfilePrompt: React.FC = () => (
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

  // Loading state
  const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
      <p className="text-blue-600 font-medium">AI is analyzing your scholarship chances...</p>
    </div>
  );

  // Generate button
  const GenerateButton: React.FC = () => (
    <button
      onClick={generateSuccessMetrics}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
    >
      Generate Success Chances
    </button>
  );

  // Reset to original data function
  const resetToOriginalData = () => {
    if (originalUserData) {
      setEditedUserData({ ...originalUserData });
    }
  };

  // Check if data has been modified
  const isDataModified = useMemo(() => {
    if (!originalUserData || !editedUserData) return false;
    return JSON.stringify(originalUserData) !== JSON.stringify(editedUserData);
  }, [originalUserData, editedUserData]);

  // Render overlay content based on state
  const renderOverlayContent = () => {
    if (isAnalyzing) return <LoadingState />;
    if (showLoginPrompt) return <LoginPrompt />;
    if (showProfilePrompt) return <ProfilePrompt />;
    return <GenerateButton />;
  };

  return (
    <>
      <section className="md:my-4 flex flex-col items-center justify-center p-4 sm:p-6 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-gray-800 mb-2">Scholarship Success Chances!</h3>
        <p className="text-gray-600 mb-4">Your scholarship success chances are:</p>

        {/* Overall Success Display */}
        <div className="flex justify-center items-center mb-6">
          <SuccessCircle overallSuccess={successGenerated ? overallSuccess : 0} />
          <span className="ml-2 text-gray-500">Overall Success</span>
        </div>

        {/* Reset button - only show when data has been edited */}
        {successGenerated && isDataModified && (
          <div className="mb-4">
            <button
              onClick={resetToOriginalData}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Reset to Original Data
            </button>
          </div>
        )}

        <div className="relative w-full">
          {/* Mobile View Labels */}
          {/* <div className="sm:hidden flex items-center justify-center mb-4">
            <h5 className="font-semibold">Academic Results</h5>
          </div> */}

          {/* Success Metrics Content */}
          <div className="flex flex-col md:flex-row justify-center gap-5 w-full">
            {/* Academic Results Section Label (Desktop) */}
            {/* <div className="hidden md:flex items-center gap-4">
              <p className="text-center">
                Academic Results <br /> {successGenerated ? academicOverall : 0}%
              </p>
              <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
            </div> */}

            {/* Academic Progress Bars */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-center bg-white shadow rounded-3xl p-4 md:px-6">
              {academicFactors.map((factor) => (
                <ProgressBar
                  key={factor.fieldKey}
                  factor={factor}
                  height="5rem"
                />
              ))}
            </div>

            {/* Mobile View Label for Financial */}
            {/* <div className="sm:hidden flex items-center justify-center">
              <h5 className="font-semibold">Financial Results</h5>
            </div> */}

            {/* Financial Progress Bars */}
            <div className="w-full lg:w-1/2 flex flex-col justify-around bg-white shadow rounded-3xl p-2 md:px-6">
              {financialFactors.map((factor) => (
                <div key={factor.fieldKey} className="mb-2">
                  <ProgressBar
                    factor={factor}
                    height="7rem"
                    showExplanation={true}
                  />
                </div>
              ))}
            </div>

            {/* Financial Results Section Label (Desktop) */}
            {/* <div className="hidden md:flex items-center gap-4">
              <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
              <p className="text-center">
                Financial Results <br /> {successGenerated ? financialOverall : 0}%
              </p>
            </div> */}
          </div>

          {/* Overlay for various states */}
          {!successGenerated && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-3xl transition-all duration-300">
              {renderOverlayContent()}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal />

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ScholarshipSuccessChances;