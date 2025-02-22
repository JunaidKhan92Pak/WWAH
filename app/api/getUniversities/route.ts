import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities"; // Your defined University model

export async function GET(req: Request) {
    try {
        // Establish database connection
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search")?.trim() || "";
        const country = searchParams.get("country")
            ?.split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== "") || []; // Ensure it's always an array
        const query: Record<string, unknown> = {};
        const textSearchSupported = await University.collection.indexExists("university_name_text");
        if (search) {
            if (textSearchSupported) {
                query.$text = { $search: search };
            } else {
                const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
                query.university_name = { $regex: new RegExp(escapeRegex(search), "i") };
            }
        }

        if (country.length > 0) {
            query.country_name = { $in: country.map((c) => new RegExp(`^${c}$`, "i")) };
        }
        // Fetch all universities from the database
        const universities = await University.find(query)
            .select("_id  university_name   country_name acceptance_rate universityImages.banner ranking universityImages.logo ") // 
            .lean();
        // Return a successful response with the fetched universities
        return NextResponse.json(
            {
                success: true,
                message: "Universities fetched successfully",
                universities, // Changed this to `universities`
            },
            { status: 200 }
        );
    } catch (error) {
        // Log error for debugging
        console.error("Error fetching universities:", error);
        // Return an error response
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch universities",
                error: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
