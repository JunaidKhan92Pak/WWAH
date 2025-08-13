import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities"; // Adjust import path as needed
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Parse search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          message: "University IDs are required",
        },
        { status: 400 }
      );
    }

    // Parse comma-separated IDs
    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No university IDs provided",
          favouriteUniversities: [],
        },
        { status: 200 }
      );
    }

    // Validate ObjectId format
    const validObjectIds = ids
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (validObjectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid university IDs provided",
        },
        { status: 400 }
      );
    }

    // Fetch universities with the given IDs
    const universities = await University.find(
      { _id: { $in: validObjectIds } },
      {
        _id: 1,
        university_name: 1,
        country_name: 1,
        university_type: 1,
        qs_world_university_ranking: 1,
        acceptance_rate: 1,
        universityImages: 1,
        description: 1,
        established_year: 1,
        total_students: 1,
        international_students: 1,
        // Add any other fields you need for display
      }
    ).lean();

    // Log for debugging
    console.log(
      `Found ${universities.length} universities out of ${ids.length} requested`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Favorite universities fetched successfully",
        favouriteUniversities: universities,
        totalCount: universities.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorite universities:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch favorite universities",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
