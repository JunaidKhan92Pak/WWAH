import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities"; // Your defined University model

export async function GET(req: Request) {
    try {
      // Establish database connection
      await connectToDatabase();
      const { searchParams } = new URL(req.url);

      const search = searchParams.get("search")?.trim() || "";
      const country =
        searchParams
          .get("country")
          ?.split(",")
          .map((c) => c.trim().toLowerCase())
          .filter((c) => c !== "") || [];

      // Get the university name to exclude
      const excludeUniversity = searchParams.get("excludeUni")?.trim() || "";
      // Get pagination parameters
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 12; // Default limit is 12

      const query: Record<string, unknown> = {};
      const textSearchSupported = await University.collection.indexExists(
        "university_name_text"
      );
      if (search) {
        if (textSearchSupported) {
          query.$text = { $search: search };
        } else {
          const escapeRegex = (text: string) =>
            text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
          query.university_name = {
            $regex: new RegExp(escapeRegex(search), "i"),
          };
        }
      }

      if (country.length > 0) {
        query.country_name = { $in: country.map((c) => new RegExp(c, "i")) };
      }
      if (excludeUniversity) {
        query.university_name = {
          ...(query.university_name || {}),
          $ne: excludeUniversity,
        };
      }
      // Get total count for pagination
      const totalCount = await University.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;

      // Fetch universities with pagination
      const universities = await University.find(query)
        .select(
          "_id university_name qs_world_university_ranking times_higher_education_ranking country_name acceptance_rate universityImages.banner ranking  universityImages.logo"
        )
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json(
        {
          success: true,
          message: "Universities fetched successfully",
          universities,
          totalPages,
        },
        { status: 200 }
      );
    } catch (error) {
        console.error("Error fetching universities:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch universities",
                error: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
