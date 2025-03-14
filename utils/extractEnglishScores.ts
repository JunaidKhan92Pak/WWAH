export const extractOverallScore = (input: string) => {
    if (!input) return null;

    // Extract overall score (e.g., "Overall: 6.0" or "Overall Score: 59")
    const overallMatch = input.match(/Overall.*?:\s*([\d.]+)/i);
    return overallMatch ? parseFloat(overallMatch[1]) : null;
};