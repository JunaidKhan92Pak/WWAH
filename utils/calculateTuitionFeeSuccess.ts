export const calculateTuitionFeeSuccess = (userBudget: number, courseFee: number): number => {
    const gap = courseFee - userBudget;
    if (gap <= 0) return 100; // User can fully cover the fee.
    const percentGap = (gap / courseFee) * 100;
    if (percentGap <= 10) return 90;
    if (percentGap <= 20) return 75;
    if (percentGap <= 30) return 50;
    return 10;
};