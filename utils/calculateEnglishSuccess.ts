export const calculateEnglishSuccess = (
    userScore: number,
    requiredScore: number | null
): number => {
    if (requiredScore === null) return 50; // Default if no required score found

    const gap = requiredScore - userScore;

    if (gap <= 0) return 100; // ✅ User meets or exceeds requirement
    if (gap > 0 && gap <= 0.5) return 90; // 🔹 Slightly below (IELTS: 6.5 → 6.0)
    if (gap > 0.5 && gap <= 1) return 75; // 🔹 1-point difference
    if (gap > 1 && gap <= 2) return 50; // 🔸 2-point difference
    return 10; // ❌ Too low
};
