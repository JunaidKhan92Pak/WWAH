import { getExchangeRates } from "@/utils/successChance/currencyRates";
import { normalizeCurrency } from "@/utils/successChance/currencyHelper";

export function calculateFinancialSuccess(
    userFee: { amount: number; currency: string },
    courseFee: { amount: number; currency: string }
): number {
    const rates = getExchangeRates();

    const userCurrency = normalizeCurrency(userFee?.currency || "USD");
    const courseCurrency = normalizeCurrency(courseFee?.currency || "USD");

    const userRate = rates[userCurrency];
    const courseRate = rates[courseCurrency];

    if (!userRate || !courseRate) {
        // console.warn("⚠️ Currency not found in rates:", { userCurrency, userRate }, { courseCurrency, courseRate });
        return 10; // fallback
    }

    const userBudgetUSD = userFee.amount / userRate;
    const courseCostUSD = courseFee.amount / courseRate;

    const ratio = userBudgetUSD / courseCostUSD;

    if (ratio >= 1.0) return 100;
    if (ratio >= 0.9) return 90;
    if (ratio >= 0.8) return 75;
    if (ratio >= 0.7) return 50;
    if (ratio >= 0.6) return 25;
    return 10;
}

export function calculateCostOfLivingSuccess(
    userBudget: { amount: number; currency: string },
    courseCost: { amount: number; currency: string }
): number {
    // console.log(`Client: Calculating cost of living success for user budget ${JSON.stringify(userBudget)} and course cost ${JSON.stringify(courseCost)}`);
    if (!userBudget?.amount || !courseCost?.amount) return 0;

    const rates = getExchangeRates();
    console.log(`Client: Exchange rates fetched: ${JSON.stringify(rates)}`);
    const userCurrency = normalizeCurrency(userBudget.currency);
    const courseCurrency = normalizeCurrency(courseCost.currency);

    const userRate = rates[userCurrency];
    const courseRate = rates[courseCurrency];
    console.log(`Client: User rate for ${userCurrency}: ${userRate}, Course rate for ${courseCurrency}: ${courseRate}`);
    if (!userRate || !courseRate) return 0;

    const userBudgetUSD = userBudget.amount / userRate;
    const courseLivingUSD = courseCost.amount / courseRate;

    const ratio = userBudgetUSD / courseLivingUSD;
    return Math.min(100, Math.round(ratio * 100));
}
