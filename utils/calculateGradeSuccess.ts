// /utils/calculateGradeSuccess.ts
import { normalizeGrade, GradeScale } from "./normalizeGrade";

export function calculateGradeSuccess(
    studentGrade: number | string,
    requiredGrade: number | string,
    studentScale: GradeScale,
    cgpaMax?: number
): number {

    // Normalize student grade to percentage
    const normalizedStudent = normalizeGrade(studentGrade, studentScale, cgpaMax);

    // Ensure requiredGrade is a number (in percentage)
    const normalizedRequired = Number(requiredGrade);

    // Calculate the gap between required and student grades
    const gap = normalizedRequired - normalizedStudent;

    // Handle grade scales differently for more accurate results
    if (studentScale === "percentage") {
        // For percentage, use standard gap calculations
        if (gap <= 0) return 100; // Student meets or exceeds requirement
        if (gap <= 5) return 95;  // Very close to requirement
        if (gap <= 10) return 85; // Close to requirement
        if (gap <= 15) return 75; // Moderately close
        if (gap <= 20) return 60; // Some gap
        if (gap <= 30) return 40; // Significant gap
        return 10;              // Very far from requirement
    }
    else if (studentScale === "letter") {
        // For letter grades, be more forgiving since they represent ranges
        if (gap <= 0) return 100; // Student meets or exceeds requirement
        if (gap <= 10) return 90; // Within one letter grade (roughly)
        if (gap <= 20) return 75; // Within two letter grades
        if (gap <= 30) return 50; // Within three letter grades
        return 20;              // More than three letter grades away
    }
    else if (studentScale === "cgpa") {
        // For CGPA, consider that small differences in CGPA are significant
        if (gap <= 0) return 100; // Student meets or exceeds requirement
        if (gap <= 5) return 95;  // Very close
        if (gap <= 10) return 85; // Within about 0.4 points on a 4.0 scale
        if (gap <= 15) return 70; // Within about 0.6 points
        if (gap <= 25) return 50; // Within about 1.0 point
        return 15;              // More than 1.0 point away
    }
    else if (studentScale === "passfail") {
        // For pass/fail, it's binary but provide some nuance based on the gap to percentage
        return normalizedStudent >= normalizedRequired ? 100 : 10;
    }

    // Default fallback using standard gap calculation
    if (gap <= 0) return 100;
    if (gap <= 10) return 90;
    if (gap <= 20) return 75;
    if (gap <= 30) return 50;
    return 10;
}