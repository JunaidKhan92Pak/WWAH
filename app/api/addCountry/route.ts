// api/countries/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Country } from "@/models/countries";
import { createCountry, updateCountry } from "@/lib/databseHook";
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

    let result;
    let countryId;
    let action;

    if (existingCountry) {
      // Country exists, update it using database hooks
      console.log(`📝 Updating existing country: ${data.country_name}`);
      result = await updateCountry(
        client,
        existingCountry._id.toString(),
        data
      );
      countryId = existingCountry._id.toString();
      action = "update";

      const message = "Country updated successfully.";
      const statusCode = 200;

      return NextResponse.json(
        {
          message,
          countryId,
          action,
          webhookTriggered: true,
        },
        { status: statusCode }
      );
    } else {
      // Country doesn't exist, create it using database hooks
      console.log(`➕ Creating new country: ${data.country_name}`);
      result = await createCountry(client, data);
      
      if (!("insertedId" in result)) {
        throw new Error("Expected InsertOneResult but got UpdateResult");
      }
      
      countryId = result.insertedId.toString();
      action = "create";

      const message = "Country added successfully.";
      const statusCode = 201;

      return NextResponse.json(
        {
          message,
          countryId,
          action,
          webhookTriggered: true,
        },
        { status: statusCode }
      );
    }
  } catch (error) {
    console.error("Error processing country request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to process the request.",
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}