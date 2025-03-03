// This route will only get university course by id and will be used in the university detail page
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid university ID" },
        { status: 400 }
      );
    }
    const universityData = await University.findById(id).select("").lean();
    if (!universityData) {
      return NextResponse.json(
        { error: "university Not Found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ universityData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching university data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
