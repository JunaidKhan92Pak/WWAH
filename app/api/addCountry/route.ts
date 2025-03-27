import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";
// import { VisaGuides } from "@/models/visaGuide"; // Your defined University model

export async function POST(req: Request) {
  try {
    // Parse incoming request data
    const data = await req.json();
    // console.log(data)
    // Validate input (checking if necessary fields exist)
    if (!data) {
      return NextResponse.json(
        { message: "Invalid input. country details are required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    const existingCountry = await Country.findOne({
      country_name: data.country_name,
    });

    if (!existingCountry) {
      // Format the university data
      // Save the new university document
      await Country.create(data);
    }

    return NextResponse.json(
      { message: "country added successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to process the request.", error: errorMessage },
      { status: 500 }
    );
  }
}
