
export const calculateEnglishSuccess = (
    userTest: string,
    userScore: number,
    requiredScore: number | null
): number => {
    if (requiredScore === null) return 50; // Default if no required score found

    // Handle based on test type and the relative difference to the specific requirement
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