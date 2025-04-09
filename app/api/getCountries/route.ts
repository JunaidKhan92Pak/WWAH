import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";

export async function GET() {
  try {
    // Establish database connection
    await connectToDatabase();

    // Fetch all universities from the database
    const country = await Country.find({})
      .select("country_name short_name _id"); // Fetch all universities from the "Universities" collection
    // Return a successful response with the fetched universities
    return NextResponse.json(
      {
        success: true,
        message: "Country fetched successfully",
        country, // Changed this to `universities`
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching Contry:", error);
    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch visaguide",
        error: (error as Error).message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
