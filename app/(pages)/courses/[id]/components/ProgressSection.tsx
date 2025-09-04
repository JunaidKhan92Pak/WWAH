import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { calculateAllSuccessMetrics } from "@/utils/successChance/courseSuccess";
import { useUserInfo } from "@/store/userStore/userSuccessInfo";
// import { subjects } from "@/synonyms.json";
import synonyms from "@/synonyms.json";
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

interface SuccessMetrics {
  majorSubject: number;
  englishSuccess: number;
  gradeSuccess: number;
  degreeSuccess: number;
  workExperienceSuccess: number;
  tuitionFeeSuccess: number;
  costofliving: number;
}

interface ProgressSectionProps {
  data: CourseData;
  // embedding?: any;
  costOfLiving?: {
    currency: string;
    amount: number;
  };
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
  value: string | number;
  type: 'text' | 'number' | 'select' | 'currency';
  options?: { label: string; value: string }[];
  additionalFields?: { [key: string]: string | number };
}

// Types matching your Zustand store
type LanguageProficiency = {
  test: string;
  score: string | number;
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
  livingCosts?: {
    currency: string;
    amount: number;
  };
  tuitionFee?: {
    currency: string;
    amount: number;
  };
  languageProficiency: LanguageProficiency;
  workExperience: string;
  studyPreferenced: StudyPreferenced;
};

const INITIAL_SUCCESS_METRICS: SuccessMetrics = {
  majorSubject: 0,
  englishSuccess: 0,
  gradeSuccess: 0,
  degreeSuccess: 0,
  workExperienceSuccess: 0,
  tuitionFeeSuccess: 0,
  costofliving: 0,
};

const ANALYSIS_DELAY = 1500;

const PROGRESS_BAR_COLORS = {
  HIGH: "#90EE90",    // >= 75%
  MEDIUM: "#e5edde",  // >= 50%
  LOW: "#f4d0d2"      // < 50%
} as const;

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  data,
  costOfLiving,
}) => {
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetrics>(INITIAL_SUCCESS_METRICS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successGenerated, setSuccessGenerated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

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

  // Memoized course data transformation
  const courseData = useMemo(() => ({
    requiredWorkExp: 2,
    requiredDegree: data?.course_level || "",
    requiredSubject: data?.course_title || "",
    englishProficiency: {
      ielts: data?.required_ielts_score || "",
      pte: data?.required_pte_score || "",
      tofel: data?.required_toefl_score || "",
    },
    requiredGrade: data?.entry_requirement || data?.entry_requirements || "",
    tutionfee: {
      amount: data?.annual_tuition_fee?.amount || 0,
      currency: data?.annual_tuition_fee?.currency || "",
    },
    costofliving: {
      amount: costOfLiving?.amount || 0,
      currency: costOfLiving?.currency || "USD"
    }
  }), [data, costOfLiving]);

  // Transform Zustand data to match calculation function format
  const transformUserDataForCalculation = useCallback((userData: SuccessData) => {
    return {
      languageProficiency: {
        test: userData.languageProficiency?.test || "IELTS",
        score: userData.languageProficiency?.score || 0,
      },
      gradeType: userData.gradetype || "percentage",
      grade: userData.grade || 0,
      studyLevel: userData.studyLevel || "",
      workExperience: userData.workExperience || "0",
      majorSubject: userData.majorSubject || "",
      tuitionFee: userData.tuitionFee || {  currency: "USD" ,amount: 0},
      livingCosts: userData.livingCosts || {  currency: "USD" , amount: 0,},
    };
  }, []);

  // Progress bar color utility
  const getProgressBarColor = useCallback((value: number): string => {
    if (value >= 75) return PROGRESS_BAR_COLORS.HIGH;
    if (value >= 50) return PROGRESS_BAR_COLORS.MEDIUM;
    return PROGRESS_BAR_COLORS.LOW;
  }, []);

  // Academic factors configuration
  const academicFactors: ProgressFactor[] = useMemo(() => [
    {
      label: "Degree",
      value: successMetrics.degreeSuccess,
      icon: "/degree-icon.svg",
      fieldKey: "degree",
    },
    {
      label: "Major/Discipline",
      value: successMetrics.majorSubject,
      icon: "/degree-icon.svg",
      fieldKey: "major",
    },
    {
      label: "Grade",
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
  ], [successMetrics]);

  // Financial factors configuration
  const financialFactors: ProgressFactor[] = useMemo(() => [
    {
      label: "English Language Proficiency",
      value: successMetrics.englishSuccess,
      icon: "/lang-icon.svg",
      fieldKey: "english",
    },
    {
      label: "Tuition Fee",
      value: successMetrics.tuitionFeeSuccess,
      icon: "/work-icon.svg",
      fieldKey: "tuition",
    },
    {
      label: "Cost of Living",
      value: successMetrics.costofliving,
      icon: "/Tea-Cup.svg",
      fieldKey: "livingCost",
    },
  ], [successMetrics]);

  // Calculate overall percentages
  const { overallChance, academicOverall, financialOverall } = useMemo(() => {
    // Apply weights from PDF
    const weightedScore =
      (successMetrics.degreeSuccess * 0.25) +
      (successMetrics.gradeSuccess * 0.25) +
      (successMetrics.majorSubject * 0.20) +
      (successMetrics.englishSuccess * 0.15) +
      (successMetrics.tuitionFeeSuccess * 0.075) +
      (successMetrics.costofliving * 0.075);

    return {
      overallChance: Math.round(weightedScore),

      // If you still want subgroup averages (not in PDF but useful for UI)
      academicOverall: Math.round(
        (successMetrics.degreeSuccess * 0.25 +
          successMetrics.gradeSuccess * 0.25 +
          successMetrics.majorSubject * 0.20) / (0.25 + 0.25 + 0.20)
      ),
      financialOverall: Math.round(
        (successMetrics.englishSuccess * 0.15 +
          successMetrics.tuitionFeeSuccess * 0.075 +
          successMetrics.costofliving * 0.075) / (0.15 + 0.075 + 0.075)
      ),
    };
  }, [successMetrics]);

  console.warn(academicOverall, financialOverall);

  // Reset state when course data changes
  useEffect(() => {
    if (data) {
      setSuccessGenerated(false);
      setShowLoginPrompt(false);
      setShowProfilePrompt(false);
      setSuccessMetrics(INITIAL_SUCCESS_METRICS);
      setEditedUserData(null);
      setOriginalUserData(null);
    }
  }, [data]);

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
        const transformedData = transformUserDataForCalculation(dataToUse);
        const metrics = calculateAllSuccessMetrics(transformedData, courseData);

        setSuccessMetrics({
          majorSubject: metrics.majorSubject ?? 0,
          englishSuccess: metrics.englishSuccess ?? 0,
          gradeSuccess: metrics.gradeSuccess ?? 0,
          degreeSuccess: metrics.degreeSuccess ?? 0,
          workExperienceSuccess: metrics.workExperienceSuccess ?? 0,
          tuitionFeeSuccess: metrics.tuitionFeeSuccess ?? 0,
          costofliving: metrics.costofliving ?? 0,
        });

        setSuccessGenerated(true);
      } catch (error) {
        console.error("Error calculating success metrics:", error);
      }
    }, ANALYSIS_DELAY);
  }, [isLoggedIn, hasData, userSuccessInfo, courseData, editedUserData, transformUserDataForCalculation]);

  // Recalculate metrics when edited data changes
  useEffect(() => {
    if (successGenerated && editedUserData) {
      try {
        const transformedData = transformUserDataForCalculation(editedUserData);
        const metrics = calculateAllSuccessMetrics(transformedData, courseData);
        setSuccessMetrics({
          majorSubject: metrics.majorSubject ?? 0,
          englishSuccess: metrics.englishSuccess ?? 0,
          gradeSuccess: metrics.gradeSuccess ?? 0,
          degreeSuccess: metrics.degreeSuccess ?? 0,
          workExperienceSuccess: metrics.workExperienceSuccess ?? 0,
          tuitionFeeSuccess: metrics.tuitionFeeSuccess ?? 0,
          costofliving: metrics.costofliving ?? 0,
        });
      } catch (error) {
        console.error("Error recalculating success metrics:", error);
      }
    }
  }, [editedUserData, courseData, successGenerated, transformUserDataForCalculation]);

  // Handle field edit
  const handleEditField = (fieldKey: string, label: string) => {
    console.log(editedUserData);

    if (!editedUserData) return;
    console.log(`Editing field: ${fieldKey} (${label})`);

    let fieldValue = '';
    let fieldType: 'text' | 'number' | 'select' | 'currency' = 'text';
    let options: { label: string; value: string }[] = [];
    let additionalFields: { [key: string]: string | number } = {};

    switch (fieldKey) {
      case 'degree':
        fieldValue = editedUserData.studyLevel || '';
        fieldType = 'select';
        options = [
          { label: "Matric", value: "Matric" },
          { label: "O Levels", value: "O Levels" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "A Levels", value: "A Levels" },
          { label: "Bachelor's", value: "Bachelor" },
          { label: "Master's", value: "Master" },
          { label: "PhD", value: "PhD" },
          { label: "Diploma", value: "Diploma" },
          { label: "Certificate", value: "Certificate" },
        ];
        break;
      case 'major':
        fieldValue = editedUserData.majorSubject || '';
        fieldType = 'select';
        options = Object.keys(synonyms).map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: key,
        }));
        break;
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
      case 'tuition':
        fieldValue = editedUserData.tuitionFee?.amount?.toString() || '';
        fieldType = 'currency';
        additionalFields = {
          currency: editedUserData.tuitionFee?.currency || 'USD'
        };
        break;
      case 'livingCost':
        fieldValue = editedUserData.livingCosts?.amount?.toString() || '';
        fieldType = 'currency';
        additionalFields = {
          currency: editedUserData.livingCosts?.currency || 'USD'
        };
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
      case 'major':
        updatedData.majorSubject = newValue;
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
      case 'tuition':
        if (!updatedData.tuitionFee) {
          updatedData.tuitionFee = { amount: 0, currency: 'USD' };
        }
        updatedData.tuitionFee.amount = parseInt(newValue) || 0;
        if (additionalData?.currency) {
          updatedData.tuitionFee.currency = additionalData.currency;
        }
        break;
      case 'livingCost':
        if (!updatedData.livingCosts) {
          updatedData.livingCosts = { amount: 0, currency: 'USD' };
        }
        updatedData.livingCosts.amount = parseInt(newValue) || 0;
        if (additionalData?.currency) {
          updatedData.livingCosts.currency = additionalData.currency;
        }
        break;
    }

    setEditedUserData(updatedData);
    setIsEditModalOpen(false);
    setCurrentEditField(null);
  };

  // Get display value for field
  // const getFieldDisplayValue = (fieldKey: string) => {
  //   if (!editedUserData) return 'N/A';

  //   switch (fieldKey) {
  //     case 'degree':
  //       return editedUserData.studyLevel || 'Not specified';
  //     case 'major':
  //       return editedUserData.majorSubject || 'Not specified';
  //     case 'grade':
  //       return editedUserData.grade ? `${editedUserData.grade}${editedUserData.gradetype === 'cgpa' ? '/4.0' : '%'}` : 'Not specified';
  //     case 'workExp':
  //       return editedUserData.workExperience ? `${editedUserData.workExperience} years` : 'No experience';
  //     case 'english':
  //       const score = editedUserData.languageProficiency?.score;
  //       const test = editedUserData.languageProficiency?.test || 'IELTS';
  //       return score ? `${test}: ${score}` : 'Not taken';
  //     case 'tuition':
  //       const budget = editedUserData.  tuitionFee?.amount;
  //       const currency = editedUserData.tutionfee?.currency || 'USD';
  //       return budget ? `${currency} ${budget.toLocaleString()}` : 'Not specified';
  //     case 'livingCost':
  //       const livingCost = editedUserData.costofliving?.amount;
  //       const livingCurrency = editedUserData.costofliving?.currency || 'USD';
  //       return livingCost ? `${livingCurrency} ${livingCost.toLocaleString()}` : 'Not specified';
  //     default:
  //       return 'N/A';
  //   }
  // };

  // Get explanation text for each field
  // 1. Universal explanation (same for every field)
  const getExplanationText = (value: number) => {
    if (value >= 90) return "Woah! Great match! See what you should do next.";
    if (value >= 60) return "Pretty close chance. See how to improve.";
    if (value >= 30) return "Not a perfect match, but you still have a chance. See your options.";
    return "Low match? See suggested options.";
  };

  // 2. Tooltip text depends on field + percentage
  const tooltipConfig: Record<
    string,
    { limit: number; text: string }[]
  > = {
    degree: [
      { limit: 100, text: "You’re eligible to apply. Start your application now! Need help? Contact with a WWAH Advisor." },
      { limit: 10, text: "0% Degree match. Your degree doesn’t meet the requirement. Explore other options. Have questions? Talk to a WWAH Advisor." },
    ],

    workExp: [
      { limit: 100, text: "Great Job! You meet the experience requirement. Apply now with confidence." },
      { limit: 90, text: "You’re very close! Apply now or ask a WWAH Advisor if you need guidance." },
      { limit: 60, text: "Just slightly under the experience requirement. You can still apply, or talk to a WWAH Advisor if unsure." },
      { limit: 30, text: "Below the experience needed, but don’t lose hope. Consider applying or ask a WWAH Advisor about better-fit options." },
    ],

    english: [
      { limit: 100, text: "Woah! You meet the English requirement. Need help with next steps? Contact a WWAH Advisor." },
      { limit: 90, text: "You’re very close to the requirement, great job! Talk to a WWAH Advisor for guidance if needed.." },
      { limit: 60, text: "Slightly below the requirement, but still a chance.Contact a WWAH Advisor to explore alternatives like MOI or recommended tests" },
      { limit: 30, text: "Your English proof may not be strong enough. But don’t worry, you still have options! A WWAH Advisor can help you with accepted alternatives like MOI or prep plans." },
      { limit: 10, text: "Very low or no score provided. You haven't provided a valid score, or the test is generally not accepted by the university" },
    ],

    tuition: [
      { limit: 100, text: "Great! Your tuition budget matches this program. You’re good to go, apply now with confidence!" },
      { limit: 60, text: "A little over your budget, but there may be funding options available. Apply now or speak to a WWAH Advisor to ask about scholarships or fundings.." },
      { limit: 50, text: "Tuition is well above your current budget. Speak with a WWAH Advisor for help finding more affordable programs or financial aid options" },
      { limit: 20, text: "This course is double your budget!Talk to a WWAH Advisor to find similar programs within your range or explore scholarshipfunded courses." },
    ],

    livingCost: [
      { limit: 90, text: "Great! Your living budget matches this city’s cost.You're good to go, apply now with confidence." },
      { limit: 80, text: "Slightly over your budget, but still manageable with the right plan. You can still apply or speak to a WWAH Advisor about part-time work, budget tips, or alternative cities" },
      { limit: 50, text: "Living expenses are quite above your budget.Talk to a WWAH Advisor for better-matched cities or support options like part-time work and cost-effective housing" },
      { limit: 20, text: "This City is much more expensive than your budget allows. We recommend exploring more affordable cities or programs, WWAH Advisor can help you shortlist better options." },
    ],

    grade: [
      { limit: 100, text: "Great! Your grades meet the requirement.You’re eligible, go ahead and apply now.." },
      { limit: 80, text: "Very close! Apply now or chat with a WWAH Advisor for tips on strengthening your profile" },
      { limit: 70, text: "Almost there! With a strong SOP, you might still make it.Start your application, and reach out to a WWAH Advisor if you need support." },
      { limit: 60, text: "You’re a bit below the requirement, but some universities are flexible. Apply to see your chances or get guidance from a WWAH Advisor." },
      { limit: 50, text: "Your grades are a bit low, but you still have a chance if the rest of your profile is strong.You can apply or talk to a WWAH Advisor for advice.." },
      { limit: 40, text: "Below the typical requirement.Consider applying or consult a WWAH Advisor before deciding" },
      { limit: 30, text: "Quite low compared to the course requirement. We recommend speaking with a WWAH Advisor to find alternatives." },
      { limit: 20, text: "This program may not be suitable based on your grades. Check better-matched courses or talk to a WWAH Advisor for help." },
      { limit: 10, text: "The course requirement is much higher than your grades. Explore more suitable programs or ask a WWAH Advisor for guidance." },
    ],

    major: [
      { limit: 90, text: "Excellent! Your major subject is a strong match for this course. Go ahead and apply!" },
      { limit: 80, text: "Your major subject is a good match, you’re on the right track. Apply now, or talk to a WWAH Advisor if you’d like to explore similar programs." },
      { limit: 70, text: "Your major subject is somewhat related, many universities accept this. Apply with confidence, or reach out to a WWAH Advisor to see how to strengthen your application." },
      { limit: 60, text: "You've selected a mixed subject combination. Based on your unique mix, this is an average estimate. Consider aligning your subjects with a focused stream for more accurate chances. Contact a WWAH advisor for personalized guidance and suggestions." },
      { limit: 50, text: "Your major is not directly related, but you may still be eligible. Ask a WWAH Advisor to review your profile and suggest similar programs with higher match rates." },
      { limit: 30, text: "Your major subject doesn’t fully match this course. Talk to a WWAH Advisor to find better options or see if you can still apply" },
      { limit: 10, text: "This course doesn’t match your Major subject. We recommend speaking with a WWAH Advisor to find programs better suited to your major" },
    ],
  };

  const getTooltipText = (fieldKey: string, value: number) => {
    const config = tooltipConfig[fieldKey];
    if (!config) return "Contact a WWAH Advisor for guidance.";

    for (const { limit, text } of config) {
      if (value >= limit) return text;
    }

    return "Explore options with a WWAH Advisor.";
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

            {/* ℹ icon with its own group */}
            <span className="relative inline-block">
              <span className="group relative flex items-center justify-center 
          w-[20px] h-[20px] border border-red-500 rounded-full cursor-pointer text-red-500">
                ℹ

                {/* Tooltip — only shows when ℹ hovered */}
                <div className="absolute left-full top-1/2 ml-2 transform -translate-y-1/2 
            bg-orange-100 text-gray-800 text-sm rounded-lg shadow-md p-3 w-64 z-20
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {getTooltipText(factor.fieldKey, factor.value)}
                </div>
              </span>
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
      handleSaveEdit(String(inputValue), additionalValues);
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg mx-4 animate-slideUp">
          <h3 className="text-xl font-semibold mb-4">Edit {currentEditField.label}</h3>
  
          <div className="space-y-4">
            {/* Additional fields first (dropdown/selection fields) */}
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
  
            {currentEditField.type === 'currency' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={additionalValues.currency || 'USD'}
                  onChange={(e) => setAdditionalValues(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
            )}
  
            {/* Main input field second */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentEditField.type === 'currency' ? 'Amount' : 
                 currentEditField.key === 'english' ? 'Score' : 
                 currentEditField.key === 'grade' ? 'Grade Value' : 
                 currentEditField.label}
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
                  type={currentEditField.type === 'currency' ? 'number' : currentEditField.type}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${
                    currentEditField.type === 'currency' ? 'amount' : 
                    currentEditField.key === 'english' ? 'score' : 
                    currentEditField.key === 'grade' ? 'grade value' : 
                    currentEditField.label.toLowerCase()
                  }`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min={currentEditField.type === 'number' || currentEditField.type === 'currency' ? "0" : undefined}
                  step={currentEditField.key === 'grade' || currentEditField.key === 'english' ? "0.1" : "1"}
                />
              )}
            </div>
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
        Please complete your profile to see your course success chances
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
      <div className=" animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
      <p className="text-blue-600 font-medium">AI is analyzing your chance...</p>
    </div>
  );

  // Generate button
  const GenerateButton: React.FC = () => (
    <button
      onClick={generateSuccessMetrics}
      className="z-40 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
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

  // Success status component
  const SuccessStatus = () => {
    let statusText = "Moderate Success Chance";
    let statusColor = "#F59E0B"; // amber

    if (overallChance >= 75) {
      statusText = "High Success Chance";
      statusColor = "#10B981"; // green
    } else if (overallChance < 50) {
      statusText = "Low Success Chance";
      statusColor = "#EF4444"; // red
    }

    return (
      <div className="flex items-center justify-center mb-6  p-4 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-around ">
          {/* Circular progress indicator */}
          <div className="relative w-48 h-20">
            <svg className="w-48 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={statusColor}
                strokeWidth="4"
                strokeDasharray={`${overallChance}, 100`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">{overallChance}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">{statusText}</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="md:my-4 flex flex-col items-center justify-center p-4 sm:p-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Application Success Chances!</h2>
        <p className="text-gray-600 mb-4"> Your overall application success chances are:</p>
        {successGenerated && <SuccessStatus />}

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

        <div className="relative w-full ">
          {/* Success Metrics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full ">
            {/* Academic Progress Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 ">
              {/* <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Academic Factors</h4>
                {successGenerated && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{academicOverall}% Overall</span>
                  </div>
                )}
              </div> */}
              <div className="space-y-4 ">
                {academicFactors.map((factor) => (
                  <ProgressBar
                    key={factor.fieldKey}
                    factor={factor}
                    height="5.5rem"
                  />
                ))}
              </div>
            </div>

            {/* Financial Progress Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Financial Factors</h4>
                {successGenerated && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{financialOverall}% Overall</span>
                  </div>
                )}
              </div> */}
              <div className="space-y-4">
                {financialFactors.map((factor) => (
                  <ProgressBar
                    key={factor.fieldKey}
                    factor={factor}
                    height="7rem"
                    showExplanation={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Overlay for various states */}
          {!successGenerated && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-all duration-300">

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