import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Expense from "@/models/trackExpense";

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const university = searchParams.get("university");

    if (!university) {
      return NextResponse.json(
        { message: "Missing required query parameters." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Escape and use regex for university name filtering
    const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");

    const expenses = await Expense.find({ country_name: { $regex: new RegExp(`.*${escapeRegex(university)}.*`, "i") } })
      .limit(1);

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch expenses.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
