export const extractOverallScore = (input: string) => {

    if (!input) return null;
    const overallMatch = input.match(/(?:Overall|Band 1)(?:\s*:)?\s*([\d.]+)/i);
    return overallMatch ? parseFloat(overallMatch[1]) : null;
};