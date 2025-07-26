import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import { ObjectId } from "mongodb";
import type { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  console.log("Fetching favorite courses...");

  try {
    await connectToDatabase();

    // Get favorite IDs from query params
    const url = new URL(req.url);
    const favoriteIdsParam = url.searchParams.get("ids");
    console.log("Favorite IDs parameter:", favoriteIdsParam);

    if (!favoriteIdsParam) {
      return NextResponse.json(
        {
          success: true,
          message: "No favorite course IDs provided",
          favouriteCourses: [],
          totalCount: 0,
        },
        { status: 200 }
      );
    }

    // Parse and validate the comma-separated IDs
    const favoriteIds = favoriteIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (favoriteIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No valid favorite course IDs found",
          favouriteCourses: [],
          totalCount: 0,
        },
        { status: 200 }
      );
    }

    console.log("Processing favorite IDs:", favoriteIds);

    // Convert string IDs to ObjectIds and validate them
    const validObjectIds: ObjectId[] = [];
    const invalidIds: string[] = [];

    for (const id of favoriteIds) {
      try {
        if (ObjectId.isValid(id)) {
          validObjectIds.push(new ObjectId(id));
        } else {
          invalidIds.push(id);
          console.warn(`Invalid ObjectId: ${id}`);
        }
      } catch (error) {
        invalidIds.push(id);
        console.warn(`Error creating ObjectId for ${id}:`, error);
      }
    }

    if (validObjectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid course IDs provided",
          error: `Invalid IDs: ${invalidIds.join(", ")}`,
          favouriteCourses: [],
          totalCount: 0,
        },
        { status: 400 }
      );
    }

    console.log(`Processing ${validObjectIds.length} valid ObjectIds`);
    if (invalidIds.length > 0) {
      console.warn(`Skipping ${invalidIds.length} invalid IDs:`, invalidIds);
    }

    // Build aggregation pipeline to fetch favorite courses with university data
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

    console.log("Executing aggregation pipeline...");

    // Execute the aggregation pipeline
    const favouriteCourses = await Courses.aggregate(pipeline);

    console.log(`Found ${favouriteCourses.length} favorite courses`);

    // Log any missing courses
    const foundIds = favouriteCourses.map((course) => course._id.toString());
    const requestedIds = validObjectIds.map((id) => id.toString());
    const missingIds = requestedIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      console.warn(`Could not find courses with IDs: ${missingIds.join(", ")}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Favorite courses fetched successfully",
        favouriteCourses,
        totalCount: favouriteCourses.length,
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
    console.error("Error fetching favorite courses:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to fetch favorite courses";
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

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        favouriteCourses: [],
        totalCount: 0,
      },
      { status: statusCode }
    );
  }
}
