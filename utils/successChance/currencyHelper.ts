// utils/successChance/currencyUtils.ts
export const normalizeCurrency = (currency: string): string => {
    if (!currency) return "USD"; // default fallback

    // Trim spaces
    const input = currency.trim();

    // Case 1: Matches "XXX - Some Name"
    if (/^[A-Z]{3}\s*-\s*/.test(input)) {
        const code = input.split("-")[0].trim(); // take "PKR" from "PKR - Pakistan Rupee"
        return code;
    }

    // Case 2: Already a 3-letter ISO code
    if (/^[A-Z]{3}$/.test(input)) {
        return input;
    }

    // Case 3: Try extracting any 3-letter block
    const match = input.match(/[A-Z]{3}/);
    if (match) return match[0];

    console.warn(`⚠️ Unknown currency format: '${currency}', defaulting to USD`);
    return "USD";
};
