export const extractOverallScore = (input: string) => {

    if (!input) return null;
    // Extract overall score with more flexible pattern
    // const overallMatch = input.match(/Overall(?:\s*:)?\s*([\d.]+)/i);
    const overallMatch = input.match(/(?:Overall|Band 1)(?:\s*:)?\s*([\d.]+)/i);
    return overallMatch ? parseFloat(overallMatch[1]) : null;
};