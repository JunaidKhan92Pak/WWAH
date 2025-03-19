// /utils/calculateGradeSuccess.ts
import { normalizeGrade, GradeScale } from "./normalizeGrade";

export function calculateGradeSuccess(
    studentGrade: number | string,
    requiredGrade: number | string,
    studentScale: GradeScale,
    // The required grade is always a percentage so no conversion is needed for it.
): number {
    const normalizedStudent = normalizeGrade(studentGrade, studentScale);
    const normalizedRequired = Number(requiredGrade); // requiredGrade is already in percentage

    const gap = normalizedRequired - normalizedStudent;

    if (gap <= 0) return 99; // Student meets or exceeds requirement
    if (gap > 0 && gap <= 10) return 90;
    if (gap > 10 && gap <= 20) return 75;
    if (gap > 20 && gap <= 30) return 50;
    return 10;
}
