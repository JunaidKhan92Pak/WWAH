import { connectToDatabase } from "@/lib/db";
import Expense from "@/models/trackExpense";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data, "Data");

    if (!data || !data.country_name || !data.university_name || !data.lifestyles) {
      return NextResponse.json(
        { message: "Invalid input. 'country_name', 'university_name', and 'lifestyles' are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingExpense = await Expense.findOne({
      country_name: data.country_name,
      university_name: data.university_name,
    });

    if (existingExpense) {
      // Update existing record and merge lifestyles properly
      await Expense.updateOne(
        {
          country_name: data.country_name,
          university_name: data.university_name,
        },
        {
          $set: {
            currency: data.currency || existingExpense.currency, // Update currency if provided
          },
          $addToSet: { lifestyles: { $each: data.lifestyles } }, // Prevent duplicate lifestyle types
        }
      );

      return NextResponse.json(
        { message: "Expense details updated successfully." },
        { status: 200 }
      );
    } else {
      // Create a new entry
      await Expense.create(data);

      return NextResponse.json(
        { message: "Expense details added successfully." },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Failed to process the request.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
