import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import Country from "@/models/countryData";
import mongoose from "mongoose";
import { ICourse } from "@/models/courses"; // Import your ICourse interface
import { University } from "@/models/universities";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
        }

        const courseData = await Courses.findById(id).lean<ICourse | null>(); // ✅ Enforce correct type

        if (!courseData) {
            return NextResponse.json({ error: "Course Not Found" }, { status: 404 });
        }

        const countryData = await Country.findOne(
            { countryname: courseData.countryname },
            {
                _id: 1,
                countryname: 1,
                embassyDocuments: 1,
                universityDocuments: { $elemMatch: { course_level: courseData.education_level } },
            }
        ).lean();
        const universityData = await University.findById(courseData.university_id).select("universityImages").lean();
        return NextResponse.json({ courseData, countryData, universityData });

    } catch (error) {
        console.error("Error fetching course data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
