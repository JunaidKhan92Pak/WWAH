const API_KEY = "YOUR_API_KEY"; // Replace with your real key

// Base can be any currency, here we use "PKR" to match user

export const fetchExchangeRates = async (base: string) => {
    const res = await fetch(`https://api.freecurrencyapi.com/v1/latestapikey=fca_live_avXNCpwu6aejcbivVXKCeEoskojYeGa9mvhkg2u5&data=${base}`);
    const data = await res.json();

    // Example: { data: { USD: 0.0036, GBP: 0.0029, EUR: 0.0033, ... } }
    return data.data; // returns { [currency: string]: rate }
};

export const convertCurrency = (
    amount: number,
    userCurrency: string,
    courseCurrency: string,
    rates: Record<string, number>
): number => {
    if (userCurrency === courseCurrency) return amount;

    const rate = rates[courseCurrency.toUpperCase()];
    if (!rate) {
        console.warn(`No exchange rate for ${courseCurrency}`);
        return 0;
    }

    return amount * rate;
};
export const runFeeMatch = async (currency: string) => {
    const exchangeRates = await fetchExchangeRates(currency); // Base: PKR
    return exchangeRates; // { USD: 0.0036, GBP: 0.0029, EUR: 0.0033, ... }
};

