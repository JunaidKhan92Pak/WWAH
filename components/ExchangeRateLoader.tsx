"use client";

import { useEffect } from "react";
import { preloadExchangeRates } from "@/utils/successChance/currencyRates";

export default function ExchangeRateLoader() {
    useEffect(() => {
        preloadExchangeRates("USD"); // fetch once at app start
    }, []);

    return null; // nothing to render
}
