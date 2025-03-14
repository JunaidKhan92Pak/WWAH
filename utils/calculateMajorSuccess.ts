export const calculateMajorSuccess = (
    userMajor: string,
    requiredMajor: string,
    synonyms: { [key: string]: any }
): number => {
    userMajor = userMajor.toLowerCase().trim();
    requiredMajor = requiredMajor.toLowerCase().trim();

    if (userMajor === requiredMajor) return 100;

    for (const [category, relatedMajors] of Object.entries(synonyms)) {
        const lowerSynonyms = relatedMajors["Exact Match"].map((s: string) => s.toLowerCase());

        if (category.toLowerCase() === userMajor) return 100;
        if (lowerSynonyms.includes(requiredMajor)) return 100;
        if (requiredMajor.includes(userMajor) || userMajor.includes(requiredMajor)) {
            return 90;
        }

        if (relatedMajors["Closely Related"].some((s: string) => requiredMajor.includes(s))) return 90;
        if (relatedMajors["Somewhat Related"].some((s: string) => requiredMajor.includes(s))) return 75;
        if (relatedMajors["Weak Connection"].some((s: string) => requiredMajor.includes(s))) return 50;
    }

    return 10;
};
