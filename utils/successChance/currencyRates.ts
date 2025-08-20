// currencyStore.ts
let exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    AUD: 1.52,
    CAD: 1.35,
    PKR: 278, // fallback if API fails
};

export function getExchangeRates() {
    return exchangeRates;
}

export async function preloadExchangeRates(base: string = "USD") {
    try {
        const res = await fetch(
            `https://v6.exchangerate-api.com/v6/b83b318c23e00e4ae2acf27a/latest/${base}`
        );
        const data = await res.json();

        if (data?.conversion_rates) {
            exchangeRates = data.conversion_rates; // ✅ update global cache
            console.log("✅ Updated live exchange rates", exchangeRates);
        }
    } catch (err) {
        console.warn("⚠️ Using fallback exchange rates", err);
    }
}
