import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VisaGuides } from "@/models/visaGuide";

export async function GET() {
  try {
    // Establish database connection
    await connectToDatabase();

    // Fetch all universities from the database
    const visaguide = await VisaGuides.findOne({ country_name: "United Kingdom", }); // Fetch all universities from the "Universities" collection
    // Return a successful response with the fetched universities
    return NextResponse.json(
      {
        success: true,
        message: "Visa guide fetched successfully",
        visaguide, // Changed this to `universities`
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching visa guide:", error);

    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch visaguide",
        error: (error instanceof Error ? error.message : "An unexpected error occurred"),
      },
      { status: 500 }
    );
  }
}
