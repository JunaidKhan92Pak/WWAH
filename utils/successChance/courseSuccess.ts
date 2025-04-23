import useSynonyms from "@/hooks/useSynonyms";
import { calculateMajorSuccess } from "../calculateMajorSuccess";
import { extractMajorFromTitle } from "../extractMajor";
import { convertCurrency, runFeeMatch } from "./fetchExchangeRates";

// Extract language proficiency scores from text description
export const extractLangScore = (langProficiency: string) => {
    if (!langProficiency) return null;
    const overallMatch = langProficiency.match(/(?:Overall|Band 1)(?:\s*:)?\s*([\d.]+)/i);
    return overallMatch ? parseFloat(overallMatch[1]) : null;

};
export const calculateEnglishSuccess = (userTest: string, userScore: number, requiredScoreText: { ielts: string, pte: string, tofel: string }): number => {
    if (requiredScoreText === null) return 50; // Default if no required score found
    const requiredScore = userTest === "IELTS"
        ? extractLangScore(requiredScoreText?.ielts)
        : userTest === "PTE"
            ? extractLangScore(requiredScoreText?.pte)
            : extractLangScore(requiredScoreText?.tofel);
    if (requiredScore === null) return 50; // Default if no required score found

    switch (userTest.toUpperCase()) {
        case "IELTS":
            // Calculate percentage of requirement achieved (IELTS has a 9-point scale)
            // But we need to handle the special case since scoring starts at 1, not 0
            const ieltsPercentage = Math.min(userScore / requiredScore * 100, 100);

            if (userScore >= requiredScore) return 100; // Meets or exceeds
            if (userScore >= requiredScore - 0.5) return 90; // Just below
            if (userScore >= requiredScore - 1.0) return 75; // Below by 1 band
            if (userScore >= requiredScore - 1.5) return 50; // Below by 1.5 bands
            if (userScore >= requiredScore - 2.0) return 25; // Below by 2 bands
            return 10; // Far below

        case "PTE":
            // PTE scores typically range from 10-90
            if (userScore >= requiredScore) return 100; // Meets or exceeds

            // Calculate how close the user is to meeting the requirement as a percentage
            const ptePercentage = (userScore / requiredScore) * 100;

            if (ptePercentage >= 90) return 90; // Within 10% of requirement
            if (ptePercentage >= 80) return 75; // Within 20% of requirement
            if (ptePercentage >= 70) return 50; // Within 30% of requirement
            if (ptePercentage >= 60) return 25; // Within 40% of requirement
            return 10; // Less than 60% of requirement

        case "TOEFL":
            // TOEFL iBT scores range from 0-120
            if (userScore >= requiredScore) return 100; // Meets or exceeds

            // Calculate how close the user is to meeting the requirement as a percentage
            const toeflPercentage = (userScore / requiredScore) * 100;

            if (toeflPercentage >= 90) return 90; // Within 10% of requirement
            if (toeflPercentage >= 80) return 75; // Within 20% of requirement
            if (toeflPercentage >= 70) return 50; // Within 30% of requirement
            if (toeflPercentage >= 60) return 25; // Within 40% of requirement
            return 10; // Less than 60% of requirement

        default:
            // Generic fallback using percentage of requirement
            const percentage = (userScore / requiredScore) * 100;
            if (percentage >= 100) return 100;
            if (percentage >= 90) return 90;
            if (percentage >= 80) return 75;
            if (percentage >= 70) return 50;
            if (percentage >= 60) return 25;
            return 10;
    }
};

// Extract grade requirements from text description
export const extractGradeRequirement = (gradesText: string) => {
    if (!gradesText) return { percentage: 0, cgpa: 0 };
    const percentageMatch = gradesText.match(/(\d+(?:\.\d+)?)%/);
    const cgpaMatch = gradesText.match(/(\d+(?:\.\d+)?)\s*CGPA/i);

    return {
        percentage: percentageMatch ? parseFloat(percentageMatch[1]) : 65,
        cgpa: cgpaMatch ? parseFloat(cgpaMatch[1]) : 3.0
    };
};

// Calculate grade success percentage
export const calculateGradeSuccess = (studentScore: number | string, studentScale: string, courseGradeText: string) => {

    console.log("studentScore", studentScore, studentScale, courseGradeText);
    if (!studentScore || !courseGradeText) return 10;
    const score = typeof studentScore === 'string' ? parseFloat(studentScore) : studentScore;
    const gradeRequirement = extractGradeRequirement(courseGradeText);

    let requiredScore = 0;
    let studentScaleNormalized = 0;

    // Normalize based on grading scale
    if (studentScale === "percentage") {
        requiredScore = gradeRequirement.percentage;
        studentScaleNormalized = score;
    } else if (studentScale === "cgpa") {
        requiredScore = gradeRequirement.cgpa;
        studentScaleNormalized = score;
    } else if (studentScale === "letter") {
        // Convert letter grade to approximate percentage
        const letterToPercentage: Record<string, number> = {
            "A+": 95, "A": 90, "A-": 85,
            "B+": 80, "B": 75, "B-": 70,
            "C+": 65, "C": 60, "C-": 55,
            "D+": 50, "D": 45, "D-": 40,
            "F": 30
        };
        studentScaleNormalized = typeof score === 'string' ? letterToPercentage[score] || 0 : 0;
        requiredScore = gradeRequirement.percentage;
    }

    if (requiredScore === 0) return 10; // No requirement available
    if (studentScaleNormalized >= requiredScore) return 100;
    if (studentScaleNormalized >= requiredScore * 0.95) return 90;
    if (studentScaleNormalized >= requiredScore * 0.9) return 80;
    if (studentScaleNormalized >= requiredScore * 0.85) return 70;
    if (studentScaleNormalized >= requiredScore * 0.8) return 60;
    if (studentScaleNormalized >= requiredScore * 0.7) return 40;
    return 20;
};

const calculateDegreeSuccess = (studentDegree: string, requiredDegree: string): number => {
    const eligibilityMap: { [key: string]: string[] } = {
        Bachelor: ["Intermediate", "IB Diploma", "GCSE", "Bachelor"],
        Master: ["Bachelor", "Master", "PhD"],
        PhD: ["Master", "PhD"],
        Certificate: ["High School", "Intermediate", "Certificate", "Diploma", "Bachelor"],
        Diploma: ["High School", "Intermediate", "Certificate", "Diploma", "Bachelor"],
    };
    const allowedDegrees = eligibilityMap[requiredDegree];
    if (!allowedDegrees) return 10;
    const isEligible = allowedDegrees.some((deg) =>
        studentDegree.toLowerCase().includes(deg.toLowerCase())
    );
    return isEligible ? 100 : 10;
};
//Calculate work experience success percentage
export const calculateWorkExperienceSuccess = (userExp: number) => {
    if (!userExp) return 10;
    const workExpRequirement = 2;
    if (userExp >= workExpRequirement) return 100; // Meets or exceeds requirement
    if (userExp >= workExpRequirement * 0.75) return 85; // At least 75% of required
    if (userExp >= workExpRequirement * 0.5) return 70; // At least 50% of required
    if (userExp >= workExpRequirement * 0.25) return 40; // At least 25% of required
    return 20; // Less than 25% of required
};
// export const calculateFeeSuccess = (
//     userAmountInCourseCurrency: number,
//     courseFeeAmount: number
// ): number => {
//     if (userAmountInCourseCurrency >= courseFeeAmount) return 100;
//     if (userAmountInCourseCurrency >= courseFeeAmount * 0.9) return 80;
//     if (userAmountInCourseCurrency >= courseFeeAmount * 0.75) return 60;
//     if (userAmountInCourseCurrency >= courseFeeAmount * 0.5) return 40;
//     return 20;
// };

// Calculate all success metrics at once
export const calculateAllSuccessMetrics = (user: any, course: any) => {
    // const requiredSubject = extractMajorFromTitle(
    //     String(course.course_title || "").trim()
    // );
    // const userSubject = user?.majorSubject?.majorSubject || "90";
    // const exchangeRates = await runFeeMatch(user.tutionfee.currency); // Fetch exchange rates based on user's currency
    // const userInCourseCurrency = convertCurrency(
    //     user.tutionfee.amount,
    //     user.tustion.rrency,
    //     course.tutionfee.currency,
    //     exchangeRates
    // );
    return {
        // subjectSuccess: calculateMajorSuccess(userSubject, requiredSubject, useSynonyms),
        englishSuccess: calculateEnglishSuccess(
            user?.languageProficiency?.test || "IELTS",
            user?.languageProficiency?.score || 0,
            course?.englishProficiency || ""
        ),
        gradeSuccess: calculateGradeSuccess(
            user?.grade || 0,
            user?.gradetype || "percentage",
            course?.requiredGrade || ""
        ),
        degreeSuccess: calculateDegreeSuccess(user?.studyLevel || "", course?.requiredDegree || ""),
        workExperienceSuccess: calculateWorkExperienceSuccess(user?.workExperience || 0),
        // tuitionFeeSuccess: calculateFeeSuccess(userInCourseCurrency, course.amount) || 10,
        tuitionFeeSuccess: 10,
        costofliving: 20
    };
};
