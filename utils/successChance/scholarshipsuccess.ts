import { getAgeFromDOB } from "./ageExtracter";
import { calculateEnglishSuccess, calculateGradeSuccess } from "@/utils/successChance/courseSuccess";
// Extract language proficiency scores from text description
// export const extractLangScore = (langProficiency: string) => {
//     if (!langProficiency) return { ielts: 0, pte: 0, toefl: 0 };

//     const ieltsMatch = langProficiency.match(/(\d+(?:\.\d+)?)\s*IELTS/i);
//     const pteMatch = langProficiency.match(/(\d+(?:\.\d+)?)\s*PTE/i);
//     const toeflMatch = langProficiency.match(/(\d+(?:\.\d+)?)\s*TOEFL/i);

//     return {
//         ielts: ieltsMatch ? parseFloat(ieltsMatch[1]) : 0,
//         pte: pteMatch ? parseFloat(pteMatch[1]) : 0,
//         toefl: toeflMatch ? parseFloat(toeflMatch[1]) : 0
//     };
// };

// Calculate English proficiency success percentage


// Extract grade requirements from text description
// export const extractGradeRequirement = (gradesText: string) => {
//     if (!gradesText) return { percentage: 0, cgpa: 0 };

//     const percentageMatch = gradesText.match(/(\d+(?:\.\d+)?)%/);
//     const cgpaMatch = gradesText.match(/(\d+(?:\.\d+)?)\s*CGPA/i);

//     return {
//         percentage: percentageMatch ? parseFloat(percentageMatch[1]) : 0,
//         cgpa: cgpaMatch ? parseFloat(cgpaMatch[1]) : 0
//     };
// };

// Calculate grade success percentage
// export const calculateGradeSuccess = (studentScore: number | string, studentScale: string, scholarshipGradeText: string) => {
//     if (!studentScore || !scholarshipGradeText) return 10;

//     const score = typeof studentScore === 'string' ? parseFloat(studentScore) : studentScore;
//     const gradeRequirement = extractGradeRequirement(scholarshipGradeText);

//     let requiredScore = 0;
//     let studentScaleNormalized = 0;

//     // Normalize based on grading scale
//     if (studentScale === "percentage") {
//         requiredScore = gradeRequirement.percentage;
//         studentScaleNormalized = score;
//     } else if (studentScale === "cgpa") {
//         requiredScore = gradeRequirement.cgpa;
//         studentScaleNormalized = score;
//     } else if (studentScale === "letter") {
//         // Convert letter grade to approximate percentage
//         const letterToPercentage: Record<string, number> = {
//             "A+": 95, "A": 90, "A-": 85,
//             "B+": 80, "B": 75, "B-": 70,
//             "C+": 65, "C": 60, "C-": 55,
//             "D+": 50, "D": 45, "D-": 40,
//             "F": 30
//         };
//         studentScaleNormalized = typeof score === 'string' ? letterToPercentage[score] || 0 : 0;
//         requiredScore = gradeRequirement.percentage;
//     }

//     if (requiredScore === 0) return 10; // No requirement available
//     if (studentScaleNormalized >= requiredScore) return 100;
//     if (studentScaleNormalized >= requiredScore * 0.95) return 90;
//     if (studentScaleNormalized >= requiredScore * 0.9) return 80;
//     if (studentScaleNormalized >= requiredScore * 0.85) return 70;
//     if (studentScaleNormalized >= requiredScore * 0.8) return 60;
//     if (studentScaleNormalized >= requiredScore * 0.7) return 40;
//     return 20;
// };

// Extract program requirements from text description
export const extractAcademicRequirement = (academicText: string) => {
    if (!academicText) return [];
    const programs = academicText.split(/\s*and\s*/i);
    return programs.map(program => program.trim().toLowerCase());
};

// Calculate degree success percentage
export const calculateDegreeSuccess = (studentDegree: string, scholarshipAcademicText: string) => {
    if (!studentDegree || !scholarshipAcademicText) return 10;

    const academicRequirement = extractAcademicRequirement(scholarshipAcademicText);
    const lowerStudentDegree = studentDegree.toLowerCase();

    if (academicRequirement.length === 0) return 10;

    const isDegreeMatch = academicRequirement.some(program =>
        lowerStudentDegree.includes(program) || program.includes(lowerStudentDegree)
    );

    return isDegreeMatch ? 100 : 30;
};

// Extract work experience requirements from text description
export const extractWorkExpRequirement = (workExpText: string) => {
    if (!workExpText) return 0;
    const match = workExpText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
};

// Calculate work experience success percentage
export const calculateWorkExperienceSuccess = (userExp: number | string, scholarshipWorkExpText: string) => {
    // Convert userExp to number if it's a string
    const userExpNumber = typeof userExp === 'string' ? parseFloat(userExp) || 0 : (userExp || 0);
    
    if (!userExpNumber || !scholarshipWorkExpText) return 10;

    const workExpRequirement = extractWorkExpRequirement(scholarshipWorkExpText);
    if (workExpRequirement === 0) return 100; // No experience required
    if (userExpNumber >= workExpRequirement) return 100; // Meets or exceeds requirement
    if (userExpNumber >= workExpRequirement * 0.75) return 85; // At least 75% of required
    if (userExpNumber >= workExpRequirement * 0.5) return 70; // At least 50% of required
    if (userExpNumber >= workExpRequirement * 0.25) return 40; // At least 25% of required
    return 20; // Less than 25% of required
};

// Extract nationality requirements from text description
export const extractNationalityRequirement = (nationalityText: string) => {
    if (!nationalityText) return [];

    const nationality = nationalityText.replace(/\s*Nationality$/i, "").toLowerCase();
    return [nationality];
};

// Calculate nationality success percentage
export const calculateNationalitySuccess = (userNationality: string, scholarshipNationalityText: string) => {
    if (!userNationality || !scholarshipNationalityText) return 10;

    const nationalityRequirement = extractNationalityRequirement(scholarshipNationalityText);
    const lowerUserNationality = userNationality.toLowerCase();


    if (nationalityRequirement.length === 0) return 100; // No nationality preference
    if (nationalityRequirement.includes(lowerUserNationality)) return 100; // Preferred nationality
    return 30; // Not a preferred nationality
};

// Extract age requirements from text description
export const extractAgeRequirement = (ageText: string) => {
    if (!ageText) return 0;

    const match = ageText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
};

// Calculate age success percentage
export const calculateAgeSuccess = (userDob: string, scholarshipAgeText: string) => {
    if (!userDob || !scholarshipAgeText) return 10;

    const ageRequirement = extractAgeRequirement(scholarshipAgeText);
    const userAge = getAgeFromDOB(userDob);
    console.log(userAge, "hello ");
    if (ageRequirement === 0) return 100; // No age limit
    if (userAge <= ageRequirement) return 100; // Within age limit
    if (userAge <= ageRequirement + 2) return 80; // Slightly over
    if (userAge <= ageRequirement + 5) return 60; // Moderately over
    if (userAge <= ageRequirement + 10) return 40; // Significantly over
    return 20; // Far above limit
};
// Calculate all success metrics at once
export const calculateAllSuccessMetrics = (user: any, scholarship: any) => {
    console.log(`Client User: ${JSON.stringify(user)} Scholarship: ${JSON.stringify(scholarship)}`);
    return {
        englishSuccess: calculateEnglishSuccess(
            user?.languageProficiency?.test || "IELTS",
            user?.languageProficiency?.score || 0,
            scholarship?.englishProficiency || { ielts: 0, pte: 0, toefl: 0 }
        ),
        gradeSuccess: calculateGradeSuccess(
            user?.grade || 0,
            user?.gradetype || "percentage",
            scholarship?.gradesAndCGPA || ""
        ),
        degreeSuccess: calculateDegreeSuccess(
            user?.studyLevel || "",
            scholarship?.academicBackground || ""
        ),
        workExperienceSuccess: calculateWorkExperienceSuccess(
            user?.workExperience || 0,
            scholarship?.workExperience || ""
        ),
        nationalitySuccess: calculateNationalitySuccess(
            user?.nationality || "",
            scholarship?.nationality || ""
        ),
        ageSuccess: calculateAgeSuccess(
            user?.dateOfBirth || "",
            scholarship?.age || ""
        )
    };
};
