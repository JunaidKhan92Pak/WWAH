import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import { ObjectId } from "mongodb";
import type { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  console.log("=== API ROUTE DEBUG START ===");
  console.log("Fetching courses by IDs...");

  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    // Get course IDs and type from query params
    const url = new URL(req.url);
    const courseIdsParam = url.searchParams.get("ids");
    const type = url.searchParams.get("type") || "favourite"; // Default to favourite for backward compatibility

    console.log("=== REQUEST PARAMETERS ===");
    console.log("Course IDs parameter:", courseIdsParam);
    console.log("Request type:", type);
    console.log("Full URL:", req.url);

    if (!courseIdsParam) {
      const responseMessage =
        type === "applied"
          ? "No applied course IDs provided"
          : "No favorite course IDs provided";
      const responseKey =
        type === "applied" ? "appliedCourses" : "favouriteCourses";

      console.log("No course IDs provided, returning empty response");
      return NextResponse.json(
        {
          success: true,
          message: responseMessage,
          [responseKey]: [],
          totalCount: 0,
        },
        { status: 200 }
      );
    }

    // Parse and validate the comma-separated IDs
    const courseIds = courseIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    console.log("=== PARSED IDS ===");
    console.log("Parsed course IDs:", courseIds);
    console.log("Number of course IDs:", courseIds.length);

    if (courseIds.length === 0) {
      const responseMessage =
        type === "applied"
          ? "No valid applied course IDs found"
          : "No valid favorite course IDs found";
      const responseKey =
        type === "applied" ? "appliedCourses" : "favouriteCourses";

      console.log("No valid course IDs found after parsing");
      return NextResponse.json(
        {
          success: true,
          message: responseMessage,
          [responseKey]: [],
          totalCount: 0,
        },
        { status: 200 }
      );
    }

    console.log("Processing course IDs:", courseIds);

    // Convert string IDs to ObjectIds and validate them
    const validObjectIds: ObjectId[] = [];
    const invalidIds: string[] = [];

    for (const id of courseIds) {
      try {
        if (ObjectId.isValid(id)) {
          validObjectIds.push(new ObjectId(id));
          console.log(`✓ Valid ObjectId: ${id}`);
        } else {
          invalidIds.push(id);
          console.warn(`✗ Invalid ObjectId: ${id}`);
        }
      } catch (error) {
        invalidIds.push(id);
        console.warn(`✗ Error creating ObjectId for ${id}:`, error);
      }
    }

    console.log("=== OBJECTID VALIDATION ===");
    console.log(`Valid ObjectIds: ${validObjectIds.length}`);
    console.log(`Invalid IDs: ${invalidIds.length}`);
    console.log(
      "Valid ObjectIds:",
      validObjectIds.map((id) => id.toString())
    );
    console.log("Invalid IDs:", invalidIds);

    if (validObjectIds.length === 0) {
      const responseKey =
        type === "applied" ? "appliedCourses" : "favouriteCourses";

      console.error("No valid ObjectIds found");
      return NextResponse.json(
        {
          success: false,
          message: "No valid course IDs provided",
          error: `Invalid IDs: ${invalidIds.join(", ")}`,
          [responseKey]: [],
          totalCount: 0,
        },
        { status: 400 }
      );
    }

    console.log(`Processing ${validObjectIds.length} valid ObjectIds`);
    if (invalidIds.length > 0) {
      console.warn(`Skipping ${invalidIds.length} invalid IDs:`, invalidIds);
    }

    // Build aggregation pipeline to fetch courses with university data
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: { $in: validObjectIds },
        },
      },
      {
        $lookup: {
          from: "universities",
          localField: "universityname",
          foreignField: "university_name",
          as: "universityData",
        },
      },
      {
        $unwind: {
          path: "$universityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          course_title: 1,
          countryname: 1,
          intake: 1,
          duration: 1,
          annual_tuition_fee: 1,
          course_level: 1,
          degree_format: 1,
          universityname: 1,
          application_deadline: 1, // Include application deadline for applied courses
          "universityData.universityImages.banner": 1,
          "universityData.universityImages.logo": 1,
          "universityData.university_name": 1,
        },
      },
      {
        $sort: {
          course_title: 1, // Sort by course title alphabetically
        },
      },
    ];

    console.log("=== AGGREGATION PIPELINE ===");
    console.log("Executing aggregation pipeline...");
    console.log("Pipeline stages:", JSON.stringify(pipeline, null, 2));

    // Execute the aggregation pipeline
    const courses = await Courses.aggregate(pipeline);

    console.log("=== AGGREGATION RESULTS ===");
    console.log(`Found ${courses.length} courses from aggregation`);
    console.log("Courses data:", JSON.stringify(courses, null, 2));

    // Log detailed information about each found course
    courses.forEach((course, index) => {
      console.log(`=== COURSE ${index + 1} ===`);
      console.log(`ID: ${course._id}`);
      console.log(`Title: ${course.course_title}`);
      console.log(`Country: ${course.countryname}`);
      console.log(`Intake: ${course.intake}`);
      console.log(`Duration: ${course.duration}`);
      console.log(`Fee: ${JSON.stringify(course.annual_tuition_fee)}`);
      console.log(`Deadline: ${course.application_deadline}`);
      console.log(`University: ${course.universityname}`);
      console.log(`University Data: ${JSON.stringify(course.universityData)}`);
    });

    // Log any missing courses
    const foundIds = courses.map((course) => course._id.toString());
    const requestedIds = validObjectIds.map((id) => id.toString());
    const missingIds = requestedIds.filter((id) => !foundIds.includes(id));

    // console.log("=== ID MATCHING ANALYSIS ===");
    // console.log("Requested IDs:", requestedIds);
    // console.log("Found IDs:", foundIds);
    // console.log("Missing IDs:", missingIds);

    if (missingIds.length > 0) {
      // console.warn(`Could not find courses with IDs: ${missingIds.join(", ")}`);

      // Try to find if these courses exist in the database with different criteria
      for (const missingId of missingIds) {
        try {
          const directLookup = await Courses.findById(new ObjectId(missingId));
          console.log(
            `Direct lookup for ${missingId}:`,
            directLookup ? "EXISTS" : "NOT FOUND"
          );
          if (directLookup) {
            console.log(`Course data:`, JSON.stringify(directLookup, null, 2));
          }
        } catch (error) {
          console.error(`Error in direct lookup for ${missingId}:`, error);
        }
      }
    }

    // Prepare response based on type
    const responseKey =
      type === "applied" ? "appliedCourses" : "favouriteCourses";
    const responseMessage =
      type === "applied"
        ? "Applied courses fetched successfully"
        : "Favorite courses fetched successfully";

    return NextResponse.json(
      {
        success: true,
        message: responseMessage,
        [responseKey]: courses,
        totalCount: courses.length,
        ...(invalidIds.length > 0 && {
          warnings: [`Skipped invalid IDs: ${invalidIds.join(", ")}`],
        }),
        ...(missingIds.length > 0 && {
          warnings: [
            ...(invalidIds.length > 0
              ? [`Skipped invalid IDs: ${invalidIds.join(", ")}`]
              : []),
            `Could not find courses with IDs: ${missingIds.join(", ")}`,
          ],
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to fetch courses";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("ObjectId")) {
        errorMessage = "Invalid course ID format";
        statusCode = 400;
      } else if (error.message.includes("connection")) {
        errorMessage = "Database connection error";
      } else {
        errorMessage = error.message;
      }
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "favourite";
    const responseKey =
      type === "applied" ? "appliedCourses" : "favouriteCourses";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        [responseKey]: [],
        totalCount: 0,
      },
      { status: statusCode }
    );
  }
}
 