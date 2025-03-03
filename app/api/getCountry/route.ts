import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    // Establish database connection
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid university ID" }, { status: 400 });
    }
    // Fetch all universities from the database
    const country = await Country.findById(id).lean(); // Fetch all universities from the "Universities" collection
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
    console.error("Error fetching country:", error);

    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch country",
        error: (error instanceof Error ? error.message : "An unexpected error occurred"),
      },
      { status: 500 }
    );
  }
}
