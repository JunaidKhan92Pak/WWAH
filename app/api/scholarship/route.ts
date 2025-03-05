// This route will only get Scholarship course by id and will be used in the Scholarship detail page
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Scholarship from "@/models/scholarship";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid Scholarship ID" },
                { status: 400 }
            );
        }
        const ScholarshipData = await Scholarship.findById(id).lean();
        if (!ScholarshipData) {
            return NextResponse.json(
                { error: "Scholarship Not Found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ ScholarshipData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching Scholarship data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
