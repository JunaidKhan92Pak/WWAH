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
      .filter((c) => c !== "") || [];

    // Query object initialization
    const query: Record<string, unknown> = {};

    // ✅ **Case-Insensitive Search**
    const textSearchSupported = await Courses.collection.indexExists("course_title_text");
    if (search) {
      if (textSearchSupported) {
        query.$text = { $search: search };
      } else {
        const escapeRegex = (text: string) =>
          text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
        query.course_title = { $regex: new RegExp(escapeRegex(search), "i") };
      }
    }
    if (minBudget > 0 && maxBudget < 999999) {
      if (!isNaN(minBudget) || !isNaN(maxBudget)) {
        query["annual_tuition_fee.amount"] = {
          $gte: minBudget,
          $lte: maxBudget,
        };
      }
    }
    // ✅ **Apply Individual Filters**
    if (studyLevel) query.course_level = studyLevel;
    if (intakeYear) query.intake = { $regex: `^${intakeYear}`, $options: "i" };
    if (studyMode) query.degree_format = { $regex: `^${studyMode}`, $options: "i" };

    // ✅ **Properly Filter University**
    if (university) {
      const escapeRegex = (text: string) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
      query.universityname = { $regex: new RegExp(`.*${escapeRegex(university)}.*`, "i") };
    }

    // ✅ **Properly Filter Country (if countryFilter has values)**
    if (countryFilter.length > 0) {
      query.countryname = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
    }

    // ✅ **Course Title Filters**
    // Apply additional filters on the course_title field.
    // Note: If multiple course title filters are provided, we'll combine them.
    let courseTitleFilter: Record<string, unknown> | undefined;
    if (subject) {
      courseTitleFilter = { $regex: new RegExp(subject, "i") };
    }
    if (searchCourse) {
      // If searchCourse is provided, use that instead (or override previous filter)
      courseTitleFilter = { $regex: new RegExp(searchCourse, "i") };
    }
    // The client can pass a `subjectAreaFilter` parameter as a comma-separated list.
    const subjectAreaFilterStr = searchParams.get("subjectAreaFilter");
    if (subjectAreaFilterStr) {
      const subjectAreas = subjectAreaFilterStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      if (subjectAreas.length > 0) {
        // Build a regex that matches any of the provided subject areas.
        const regexPattern = subjectAreas.join("|");
        const subjectAreaCondition = { $regex: new RegExp(regexPattern, "i") };
        if (courseTitleFilter) {
          // Combine existing course title filter with the subject area condition.
          query.$and = [
            { course_title: courseTitleFilter },
            { course_title: subjectAreaCondition },
          ];
        } else {
          query.course_title = subjectAreaCondition;
        }
      }
    } else if (courseTitleFilter) {
      // If no subject area filter but one of the other course title filters is provided.
      query.course_title = courseTitleFilter;
    }

    // ✅ **Fetch courses with efficient pagination**
    const [courses, totalCourses] = await Promise.all([
      Courses.find(query)
        .sort({ course_title: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
        .select("_id course_title countryname intake duration annual_tuition_fee"),
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
