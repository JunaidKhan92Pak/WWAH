import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities"; // Your defined University model

export async function GET() {
    try {
        // Establish database connection
        await connectToDatabase();
        // const { searchParams } = new URL(req.url);
        // const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));

        // const countryFilter = searchParams.get("countryFilter")
        //     ?.split(",")
        //     .map((c) => c.trim().toLowerCase())
        //     .filter((c) => c !== "") || []; // Ensure it's always an array
        // const query: Record<string, unknown> = {};

        // if (countryFilter.length > 0) {
        //     query.countryname = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
        // }

        // Fetch all universities from the database
        const universities = await University.find({})
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
