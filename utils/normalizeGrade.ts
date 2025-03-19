// /utils/normalizeGrade.ts
export type GradeScale = "percentage" | "letter" | "cgpa" | "passfail";

export function normalizeGrade(
    grade: number | string,
    scale: GradeScale,
    cgpaMax?: number
): number {
    switch (scale) {
        case "percentage":
            // If the grade is already in percentage, simply return it as a number.
            return Number(grade);
        case "letter":
            // Map letter grades to percentages (adjust these mappings as needed)
            const letterMapping: { [key: string]: number } = {
                "A+": 100,
                "A": 95,
                "A-": 90,
                "B+": 85,
                "B": 80,
                "B-": 75,
                "C+": 70,
                "C": 65,
                "C-": 60,
                "D+": 55,
                "D": 50,
                "D-": 45,
                "F": 10,
            };
            return letterMapping[String(grade).toUpperCase().trim()] || 10;
        case "cgpa":
            // For CGPA, convert by dividing by the maximum (default to 4.0 if not provided) and multiplying by 100.
            const max = cgpaMax || 4;
            return (Number(grade) / max) * 100;
        case "passfail":
            // For pass/fail, return 100 if the user passed, otherwise a low score.
            return String(grade).toLowerCase() === "pass" ? 100 : 10;
        default:
            return 10;
    }
}
