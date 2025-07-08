import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";

export async function GET() {
  try {
    // Establish database connection
    await connectToDatabase();
    // Fetch all countries from the database, sorted alphabetically by country_name
    const country = await Country.find({})
      .select("country_name short_name _id")
      .sort({ country_name: 1 }); // 1 = ascending, -1 = descending

    // Return a successful response with the fetched countries
    return NextResponse.json(
      {
        success: true,
        message: "Countries fetched successfully",
        country,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching countries:", error);
    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch countries",
        error: (error as Error).message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
