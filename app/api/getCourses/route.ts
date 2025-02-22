import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Parse search parameters
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 12));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const search = searchParams.get("search")?.trim() || "";
    const sortOrder = searchParams.get("sortOrder")?.toLowerCase() === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;
    const studyLevel = searchParams.get("studyLevel") || "";
    const intakeYear = searchParams.get("intakeYear") || "";
    const studyMode = searchParams.get("studyMode") || "";
    const university = searchParams.get("selectedUniversity") || "";
    const subject = searchParams.get("subject");
    const searchCourse = searchParams.get("searchCourse");
    const minBudget = parseFloat(searchParams.get("minBudget") || "0");
    const maxBudget = parseFloat(searchParams.get("maxBudget") || "999999");
    // Extract countryFilter and convert to lowercase
    const countryFilter = searchParams.get("countryFilter")
      ?.split(",")
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c !== "") || []; // Ensure it's always an array

    // Query object initialization
    const query: Record<string, unknown> = {};

    // ✅ **Case-Insensitive Search**
    const textSearchSupported = await Courses.collection.indexExists("course_title_text");
    if (search) {
      if (textSearchSupported) {
        query.$text = { $search: search };
      } else {
        const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
        query.course_title = { $regex: new RegExp(escapeRegex(search), "i") };
        console.log(search, "cour");
      }
    }
    if (!isNaN(minBudget) || !isNaN(maxBudget)) {
      query["annual_tuition_fee.amount"] = {
        $gte: minBudget,
        $lte: maxBudget,
      };
    }
    // ✅ **Apply Individual Filters**
    if (studyLevel) query.course_level = studyLevel;
    if (intakeYear) query.intake = { $regex: `^${intakeYear}`, $options: "i" };
    if (studyMode) query.degree_format = { $regex: `^${studyMode}`, $options: "i" };

    // ✅ **Properly Filter University**
    if (university) {
      const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
      query.universityname = { $regex: new RegExp(`.*${escapeRegex(university)}.*`, "i") };
      console.log(university, "Uni");
    }

    // ✅ **Properly Filter Country (if countryFilter has values)**
    if (countryFilter.length > 0) {
      query.countryname = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
    }
    if (subject) {
      query.course_title = { $regex: new RegExp(subject, "i") }; // Case-insensitive match
    }
    if (searchCourse) {
      query.course_title = { $regex: new RegExp(searchCourse, "i") }; // Case-insensitive match
    }
    // ✅ **Fetch courses with efficient pagination**
    const [courses, totalCourses] = await Promise.all([
      Courses.find(query).sort({ course_title: sortOrder }).skip(skip).limit(limit).lean().select("_id course_title countryname intake duration annual_tuition_fee"),
      Courses.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Courses fetched successfully",
        courses,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
        totalCourses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
