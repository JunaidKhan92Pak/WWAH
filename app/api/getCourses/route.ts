import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";

import type { PipelineStage } from "mongoose";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Parse search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12"));
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
    const intakeMonth = searchParams.get("intakeMonth") || "";
    // Extract and process country filter
    const countryFilter = searchParams.get("countryFilter")
      ?.split(",")
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c !== "") || [];

    // Initialize the query object
    const query: Record<string, unknown> = {};

    // Support text search if an index exists; otherwise, use regex search
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

    // Budget filtering
    if (minBudget > 0 && maxBudget < 999999) {
      if (!isNaN(minBudget) || !isNaN(maxBudget)) {
        query["annual_tuition_fee.amount"] = { $gte: minBudget, $lte: maxBudget };
      }
    }
    if (studyLevel) query.course_level = studyLevel;
    // Filtering by intake month and year if provided
    if (intakeMonth && intakeYear) {
      // Filter for both month and year
      query.intake = {
        $elemMatch: {
          $regex: `\\b${intakeMonth}\\s+${intakeYear}\\b`, // Matches "February 2026", "July 2027"
          $options: "i"  // Case-insensitive search
        }
      };
    } else if (intakeMonth) {
      // Filter by month only
      query.intake = {
        $elemMatch: {
          $regex: `\\b${intakeMonth}\\b`, // Matches only the month, e.g., "February"
          $options: "i"
        }
      };
    } else if (intakeYear) {
      // Filter by year only
      query.intake = {
        $elemMatch: {
          $regex: `\\b${intakeYear}\\b`, // Matches only the year, e.g., "2026"
          $options: "i"
        }
      };
    }
    if (studyMode) query.degree_format = { $regex: `^${studyMode}`, $options: "i" };
    // Filter by university name using regex
    if (university) {
      const escapeRegex = (text: string) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
      query.universityname = { $regex: new RegExp(`.*${escapeRegex(university)}.*`, "i") };
    }

    // Filter by country if provided
    if (countryFilter.length > 0) {
      query.countryname = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
    }

    // Apply course title filters
    let courseTitleFilter: Record<string, unknown> | undefined;
    if (subject) {
      courseTitleFilter = { $regex: new RegExp(subject, "i") };
    }
    if (searchCourse) {
      courseTitleFilter = { $regex: new RegExp(searchCourse, "i") };
    }
    const subjectAreaFilterStr = searchParams.get("subjectAreaFilter");
    if (subjectAreaFilterStr) {
      const subjectAreas = subjectAreaFilterStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      if (subjectAreas.length > 0) {
        const regexPattern = subjectAreas.join("|");
        const subjectAreaCondition = { $regex: new RegExp(regexPattern, "i") };
        if (courseTitleFilter) {
          query.$and = [
            { course_title: courseTitleFilter },
            { course_title: subjectAreaCondition },
          ];
        } else {
          query.course_title = subjectAreaCondition;
        }
      }
    } else if (courseTitleFilter) {
      query.course_title = courseTitleFilter;
    }

    // Build aggregation pipeline with $lookup to join university data
    const pipeline: PipelineStage[] = [
      { $match: query },
      {
        $lookup: {
          from: "universities", // name of the universities collection
          localField: "universityname", // field in courses
          foreignField: "university_name", // matching field in universities
          as: "universityData",
        },
      },
      {
        $unwind: {
          path: "$universityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { course_title: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          course_title: 1,
          countryname: 1,
          intake: 1,
          duration: 1,
          annual_tuition_fee: 1,
          "universityData.universityImages.banner": 1,
          "universityData.universityImages.logo": 1,
          "universityData.university_name": 1,
        },
      },
    ];

    // Run the aggregation pipeline to fetch courses with joined university info
    const courses = await Courses.aggregate(pipeline);

    // Count total matching courses for pagination
    const countPipeline: PipelineStage[] = [
      { $match: query },
      { $count: "total" },
    ];
    const countResult = await Courses.aggregate(countPipeline);
    const totalCourses = countResult[0]?.total || 0;

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
