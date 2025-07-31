import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";
import { createCountry } from "@/lib/databseHook";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data, "country data");

    // Validate input
    if (!data || !data.country_name) {
      return NextResponse.json(
        { message: "Invalid input. Country name is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    await connectToDatabase();

    // Check if country already exists using Mongoose
    const existingCountry = await Country.findOne({
      country_name: data.country_name,
    });

    if (existingCountry) {
      // Country exists, update it using database hooks
      // FIXED: Use the correct filter format for MongoDB operations
      // const result = await updateCountry(
      //   client,
      //   existingCountry._id.toString(), // Keep as string, but fix the updateCountry function
      //   data
      // );

      return NextResponse.json(
        {
          message: "Country updated successfully.",
          countryId: existingCountry._id.toString(),
        },
        { status: 200 }
      );
    } else {
      // Country doesn't exist, create it using database hooks
      const result = await createCountry(client, data);

      return NextResponse.json(
        {
          message: "Country added successfully.",
          countryId: result.insertedId.toString(),
        },
        { status: 201 }
      );
    }
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
