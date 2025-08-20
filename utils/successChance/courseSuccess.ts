import { calculateMajorSuccess } from "../calculateMajorSuccess";
// import { extractMajorFromTitle } from "../extractMajor";
import { calculateCostOfLivingSuccess, calculateFinancialSuccess } from "./financialSuccess"; // the new function
// import { getExchangeRates } from "./currencyRates";
import synonyms from "@/synonyms.json";
// Types
interface EnglishProficiency {
    ielts: string;
    pte: string;
    tofel: string;
}


interface User {
    languageProficiency?: {
        test: string;
        score: number | string;   // allow both
    };
    grade?: number;
    gradeType?: string;
    studyLevel?: string;
    workExperience?: number | string; // allow both
    majorSubject: string;
    tuitionFee?: {
        amount: number;
        currency: string;
    };
    livingCosts?: {
        amount: number;
        currency: string;
    };
}

interface Course {
    englishProficiency?: EnglishProficiency;
    requiredGrade?: string;
    requiredDegree?: string;
    requiredSubject?: string;
    tutionfee?: {
        amount: number;
        currency: string;
    };
    costofliving?: {
        amount: number;
        currency: string;
    };
}

interface SuccessMetrics {
    englishSuccess: number;
    gradeSuccess: number;
    degreeSuccess: number;
    workExperienceSuccess: number;
    tuitionFeeSuccess: number;
    costofliving: number;
    majorSubject?: number;
}

// Constants
const DEFAULT_SUCCESS_RATE = 50;
const DEFAULT_GRADE_REQUIREMENT = { percentage: 65, cgpa: 3.0 };
const DEFAULT_WORK_EXPERIENCE_REQUIREMENT = 2;


const DEGREE_ELIGIBILITY_MAP: Record<string, string[]> = {
    Bachelor: ["Intermediate", "IB Diploma", "GCSE", "Bachelor"],
    Master: ["Bachelor", "Master", "PhD"],
    PhD: ["Master", "PhD"],
    Certificate: ["High School", "Intermediate", "Certificate", "Diploma", "Bachelor"],
    Diploma: ["High School", "Intermediate", "Certificate", "Diploma", "Bachelor"],
};

/**
 * Extract language proficiency score from text description
 */
export const extractLangScore = (langProficiency: string): number | null => {
    if (!langProficiency) return null;
    const overallMatch = langProficiency.match(/(?:Overall|Band 1)(?:\s*:)?\s*([\d.]+)/i);
    return overallMatch ? parseFloat(overallMatch[1]) : null;
};

/**
 * Calculate English proficiency success rate
 */
export const calculateEnglishSuccess = (
    userTest: string,
    userScore: number,
    requiredScoreText: EnglishProficiency
): number => {
    if (!requiredScoreText) return DEFAULT_SUCCESS_RATE;

    const testType = userTest.toUpperCase();
    const requiredScore = testType === "IELTS"
        ? extractLangScore(requiredScoreText.ielts)
        : testType === "PTE"
            ? extractLangScore(requiredScoreText.pte)
            : extractLangScore(requiredScoreText.tofel);

    if (requiredScore === null) return DEFAULT_SUCCESS_RATE;

    return calculateTestSuccess(testType, userScore, requiredScore);
};

/*** Calculate success rate for specific test types */
const calculateTestSuccess = (
    testType: string,
    userScore: number,
    requiredScore: number
): number => {
    const scoreRatio = userScore / requiredScore;

    switch (testType) {
        case "IELTS":
            if (userScore >= requiredScore) return 100;
            if (userScore >= requiredScore - 0.5) return 90;
            if (userScore >= requiredScore - 1.0) return 80;
            if (userScore >= requiredScore - 1.5) return 70;
            if (userScore >= requiredScore - 2.0) return 60;
            if (userScore >= requiredScore - 2.5) return 50;
            if (userScore >= requiredScore - 3.0) return 30;
            return 15;

        case "PTE":
        case "TOEFL":
            if (scoreRatio >= 1.0) return 100;
            if (scoreRatio >= 0.95) return 90;
            if (scoreRatio >= 0.9) return 80;
            if (scoreRatio >= 0.85) return 70;
            if (scoreRatio >= 0.8) return 60;
            if (scoreRatio >= 0.75) return 45;
            if (scoreRatio >= 0.7) return 30;
            return 15;

        default:
            return getGenericSuccessRate(scoreRatio);
    }
};


/** * Generic success rate calculation based on score ratio */
const getGenericSuccessRate = (ratio: number): number => {
    if (ratio >= 1.0) return 100;
    if (ratio >= 0.9) return 90;
    if (ratio >= 0.8) return 80;
    if (ratio >= 0.7) return 70;
    if (ratio >= 0.6) return 60;
    if (ratio >= 0.5) return 50;
    if (ratio >= 0.4) return 40;
    if (ratio >= 0.3) return 30;
    if (ratio >= 0.2) return 20;
    return 10;
};

// Mapping for letter grades to percentage
const LETTER_GRADE_TO_PERCENTAGE: Record<string, number> = {
    "A+": 95, "A": 90, "A-": 85,
    "B+": 80, "B": 75, "B-": 70,
    "C+": 65, "C": 60, "C-": 55,
    "D+": 50, "D": 45, "D-": 40,
    "F": 30, "PASS": 60, "FAIL": 30
};


// Extract grade requirement from course text
export const extractGradeRequirement = (gradesText: string) => {
    if (!gradesText) return DEFAULT_GRADE_REQUIREMENT;

    // Percentage requirement
    const percentageMatch = gradesText.match(/(\d+(?:\.\d+)?)\s*%/);

    // GPA / CGPA requirement (e.g. "3.2 GPA", "3.2 out of 4.0")
    const gpaMatch = gradesText.match(/(\d+(?:\.\d+)?)(?=\s*(?:\/\s*\d+(?:\.\d+)?)?\s*(?:GPA|CGPA))/i);
    const gpaOutOfMatch = gradesText.match(/(\d+(?:\.\d+)?)\s*out\s+of\s+(\d+(?:\.\d+)?)/i);

    let cgpaValue: number | null = null;
    if (gpaMatch) {
        cgpaValue = parseFloat(gpaMatch[1]);
    } else if (gpaOutOfMatch) {
        const raw = parseFloat(gpaOutOfMatch[1]);
        const scale = parseFloat(gpaOutOfMatch[2]);
        cgpaValue = (raw / scale) * 4; // Convert to 4.0 scale
    }

    return {
        percentage: percentageMatch ? parseFloat(percentageMatch[1]) : DEFAULT_GRADE_REQUIREMENT.percentage,
        cgpa: cgpaValue ?? DEFAULT_GRADE_REQUIREMENT.cgpa
    };
};

const normalizeToPercentage = (score: number | string, type?: string) => {
    const cleanType = type?.toLowerCase().trim() || "percentage";
    let num = typeof score === "number" ? score : parseFloat(score as string);

    if (cleanType === "percentage") return num;
    if (cleanType === "cgpa" || cleanType === "gpa") return (num / 4) * 100;
    if (cleanType === "letter") return LETTER_GRADE_TO_PERCENTAGE[score as string] ?? 0;
    if (cleanType === "pass/fail") return score.toString().toLowerCase() === "pass" ? 100 : 0;

    return num; // fallback
};


export const calculateGradeSuccess = (
    studentScore: number | string,
    studentScale: string,
    courseGradeText: string
): number => {
    if (!studentScore || !courseGradeText) return 10;

    const gradeRequirement = extractGradeRequirement(courseGradeText);
    // console.log(`[CLIENT LOG] Grade Requirement: ${JSON.stringify(gradeRequirement)}`);

    // ✅ Convert both to percentage
    const normalizedUser = normalizeToPercentage(studentScore, studentScale);
    const normalizedRequired = gradeRequirement.cgpa
        ? normalizeToPercentage(gradeRequirement.cgpa, "cgpa")
        : gradeRequirement.percentage;

    if (normalizedRequired === 0) return 10;

    const ratio = normalizedUser / normalizedRequired;
    // console.log(`[CLIENT LOG] Ratio: ${ratio}, Normalized User: ${normalizedUser}, Normalized Required: ${normalizedRequired}`);

    if (ratio >= 1.0) return 100;
    if (ratio >= 0.95) return 95;
    if (ratio >= 0.9) return 90;
    if (ratio >= 0.85) return 85;
    if (ratio >= 0.8) return 80;
    if (ratio >= 0.7) return 70;
    if (ratio >= 0.6) return 60;
    if (ratio >= 0.5) return 50;
    if (ratio >= 0.4) return 40;
    if (ratio >= 0.3) return 30;
    if (ratio >= 0.2) return 20;
    return 10;
};

export const calculateDegreeSuccess = (studentDegree: string, requiredDegree: string): number => {
    const allowedDegrees = DEGREE_ELIGIBILITY_MAP[requiredDegree];
    if (!allowedDegrees) return 10;

    const isEligible = allowedDegrees.some(degree =>
        studentDegree.toLowerCase().includes(degree.toLowerCase())
    );

    return isEligible ? 100 : 10;
};

/**
 * Calculate work experience success percentage
 */
export const calculateWorkExperienceSuccess = (userExp: number): number => {
    if (!userExp) return 10;
    const ratio = userExp / DEFAULT_WORK_EXPERIENCE_REQUIREMENT;
    if (ratio >= 1.0) return 100;
    if (ratio >= 0.9) return 90;
    if (ratio >= 0.8) return 80;
    if (ratio >= 0.70) return 70;
    if (ratio >= 0.6) return 60;
    if (ratio >= 0.5) return 50;
    if (ratio >= 0.4) return 40;
    if (ratio >= 0.3) return 30;
    if (ratio >= 0.20) return 20;
    return 10;
};


export const calculateAllSuccessMetrics = (user: User, course: Course): SuccessMetrics => {
    // console.log(
    //     typeof window === "undefined"
    //         ? "[SERVER LOG] This is running on the server"
    //         : `[CLIENT LOG] This is running in the browser - User: ${JSON.stringify(user)}, Course: ${JSON.stringify(course)}`
    // );
    try {
        return {
            englishSuccess: calculateEnglishSuccess(
                user?.languageProficiency?.test || "IELTS",
                Number(user?.languageProficiency?.score) || 0,   // ✅ convert to number
                course?.englishProficiency || { ielts: "", pte: "", tofel: "" }
            ),
            gradeSuccess: calculateGradeSuccess(
                user?.grade || 0,
                user?.gradeType || "percentage",
                course?.requiredGrade || "65"
            ),
            degreeSuccess: calculateDegreeSuccess(
                user?.studyLevel || "",
                course?.requiredDegree || ""
            ),
            majorSubject: calculateMajorSuccess(
                user?.majorSubject || "",
                course?.requiredSubject || "",
                synonyms
            ),
            workExperienceSuccess: calculateWorkExperienceSuccess(Number(user?.workExperience) || 0),
            // 💰 Financial success using tuition fees
            tuitionFeeSuccess: calculateFinancialSuccess(
                {
                    amount: user?.tuitionFee?.amount || 0,
                    currency: user?.tuitionFee?.currency || "USD",
                },
                {
                    amount: course?.tutionfee?.amount || 0,
                    currency: course?.tutionfee?.currency || "USD",
                }
            ),
            costofliving: calculateCostOfLivingSuccess(
                {
                    amount: user?.livingCosts?.amount || 0,
                    currency: user?.livingCosts?.currency || "USD",
                },
                {
                    amount: course?.costofliving?.amount || 0,
                    currency: course?.costofliving?.currency || "USD",
                }
            ),

            // Placeholder - implement when cost calculation is ready
        };
    } catch (error) {
        console.error("Error calculating success metrics:", error);
        return {
            englishSuccess: 10,
            gradeSuccess: 10,
            degreeSuccess: 10,
            workExperienceSuccess: 10,
            tuitionFeeSuccess: 10,
            costofliving: 20
        };
    }
};