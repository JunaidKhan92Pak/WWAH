import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Scholarship from "@/models/scholarship"

export async function GET() {
    try {
        await connectToDatabase()

        // Get unique countries from scholarships
        const countries = await Scholarship.aggregate([
            {
                $group: {
                    _id: "$hostCountry",
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    _id: { $nin: [null, ""] },
                },
            },
            {
                $sort: { count: -1 },
            },
        ])

        const normalizedCountries = new Map<string, { name: string; count: number }>()

        countries.forEach((country) => {
            const normalizedName = normalizeCountryName(country._id)

            if (normalizedCountries.has(normalizedName)) {
                // Merge counts for duplicate countries
                const existing = normalizedCountries.get(normalizedName)!
                existing.count += country.count
            } else {
                normalizedCountries.set(normalizedName, {
                    name: normalizedName,
                    count: country.count,
                })
            }
        })

        // Transform the normalized data
        const countryList = Array.from(normalizedCountries.values())
            .sort((a, b) => b.count - a.count) // Sort by count descending
            .map((country) => ({
                name: country.name,
                value: country.name.toLowerCase(),
                count: country.count,
                img: getCountryFlag(country.name),
            }))

        return NextResponse.json({
            countries: countryList,
            success: true,
        })
    } catch (error) {
        console.error("Countries API Error:", error)
        return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
    }
}

function normalizeCountryName(countryName: string): string {
    const normalizations: Record<string, string> = {
        UK: "United Kingdom",
    }

    return normalizations[countryName] || countryName
}

function getCountryFlag(countryName: string): string {
    // Map country names to ISO country codes for reliable flag URLs
    const countryToCode: Record<string, string> = {
        "United States": "us",
        USA: "us",
        UK: "gb",
        "Czech Republic": "cz",
        China: "cn",
        Turkiye: "tr",
        Canada: "ca",
        Italy: "it",
        Ireland: "ie",
        "New Zealand": "nz",
        Denmark: "dk",
        France: "fr",
        Australia: "au",
        Austria: "at",
        Germany: "de",
        Portugal: "pt",
        Poland: "pl",
        Norway: "no",
        Hungary: "hu",
        "South Korea": "kr",
        Japan: "jp",
        Romania: "ro",
        Turkey: "tr",
        "United Kingdom": "gb",
        Netherlands: "nl",
        Spain: "es",
        Sweden: "se",
        Switzerland: "ch",
        Belgium: "be",
        Finland: "fi",
        Greece: "gr",
        Malaysia: "my",
        "Scotland (UK)": "sc",
        england: "gb",
        wales: "gb",
        Thailand: "th",
        Singapore: "sg",
        ireland: "ie",
        Fiji: "fj",

    }

    const countryCode = countryToCode[countryName]

    if (countryCode) {
        return `https://flagcdn.com/24x18/${countryCode}.png`
    }

    return ""
}
