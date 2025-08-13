import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Scholarship from "@/models/scholarship";
import mongoose from "mongoose";
// import { parse } from "path";

// Type definition matching your schema
type ScholarshipData = {
  _id: string;
  name: string;
  banner?: string;
  logo?: string;
  minimumRequirements?: string;
  description?: string;
  amount?: number;
  deadline?: string;
  eligibility?: string[];
  university?: string;
  hostCountry: string; // Required field in your schema
  country?: string;
  category?: string;
  type?: string;
  duration?: {
    general?: string;
    bachelors?: string;
    masters?: string;
    phd?: string;
  };
  programs?: string[];
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function GET(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    const url = new URL(req.url);
    const idsParam = url.searchParams.get("ids");
    // console.log("Received IDs:", idsParam);

    // Validate required parameter
    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "IDs parameter is required",
          message: "Please provide scholarship IDs as a comma-separated string",
        },
        { status: 400 }
      );
    }

    // Parse and validate IDs
    let ids: string[];
    try {
      // Handle both comma-separated string and JSON array formats
      if (idsParam.startsWith("[") && idsParam.endsWith("]")) {
        ids = JSON.parse(idsParam);
      } else {
        ids = idsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    } catch (parseError) {
      console.log(parseError, "Error parsing IDs parameter:");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid IDs format",
          message: "Use comma-separated string or JSON array format",
        },
        { status: 400 }
      );
    }

    // Validate array structure and length
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid IDs array",
          message: "IDs must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Limit the number of IDs to prevent abuse
    const MAX_IDS = 50;
    if (ids.length > MAX_IDS) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many IDs",
          message: `Maximum ${MAX_IDS} scholarship IDs allowed per request`,
        },
        { status: 400 }
      );
    }

    // Validate each MongoDB ObjectId
    const validIds: string[] = [];
    const invalidIds: string[] = [];

    ids.forEach((id) => {
      const trimmedId = String(id).trim();
      if (mongoose.Types.ObjectId.isValid(trimmedId)) {
        validIds.push(trimmedId);
      } else {
        invalidIds.push(id);
      }
    });

    // Return error if any invalid IDs found
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid MongoDB ObjectIds found",
          invalidIds: invalidIds,
          message: "All IDs must be valid MongoDB ObjectIds",
        },
        { status: 400 }
      );
    }

    // FIXED: Fetch scholarships from database - Include banner and logo fields
    const scholarships = await Scholarship.find({
      _id: { $in: validIds.map((id) => new mongoose.Types.ObjectId(id)) },
    })
      .select(
        "name banner logo hostCountry type provider deadline numberOfScholarships overview programs minimumRequirements officialLink duration benefits applicableDepartments eligibilityCriteria requiredDocuments applicationProcess successChances description amount eligibility university country category createdAt updatedAt"
      )
      .lean<ScholarshipData[]>();

    // console.log("Fetched scholarships count:", scholarships.length);
    // console.log(
    //   "Fetched scholarships with image fields:",
    //   scholarships.map((s) => ({
    //     id: s._id,
    //     name: s.name,
    //     banner: s.banner,
    //     logo: s.logo,
    //   }))
    // );

    // FIXED: Transform the data to ensure consistent field names and proper image handling
    const transformedScholarships = scholarships.map((scholarship) => ({
      ...scholarship,
      // FIXED: Properly handle banner and logo fields
      banner:
        scholarship.banner && scholarship.banner !== ""
          ? scholarship.banner
          : "/default-banner.jpg",
      logo:
        scholarship.logo && scholarship.logo !== ""
          ? scholarship.logo
          : "/default-logo.png",
      // Ensure backward compatibility for field names
      minRequirements: scholarship.minimumRequirements || "Not specified",
      minimumRequirements: scholarship.minimumRequirements || "Not specified",
      // Convert programs array to string if needed for display
      programs: Array.isArray(scholarship.programs)
        ? scholarship.programs.join(", ")
        : scholarship.programs || "Not specified",
      // Ensure type has a default
      type: scholarship.type || "Not Specified",
      // Ensure deadline has a default
      deadline: scholarship.deadline || "Not specified",
      // Handle country/hostCountry
      country: scholarship.country || scholarship.hostCountry,
      hostCountry: scholarship.hostCountry || scholarship.country,
      // Ensure description exists
      description: scholarship.description || "No description available",
      // Ensure other fields have defaults
      amount: scholarship.amount || 0,
      eligibility: scholarship.eligibility || [],
      university: scholarship.university || "Not specified",
      category: scholarship.category || "General",
    }));

    // console.log(
    //   "Transformed scholarships with images:",
    //   transformedScholarships.map((s) => ({
    //     id: s._id,
    //     name: s.name,
    //     banner: s.banner,
    //     logo: s.logo,
    //   }))
    // );

    // Check if any scholarships were found
    if (transformedScholarships.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No scholarships found",
          message: "No scholarships found for the provided IDs",
          scholarships: [],
          stats: {
            totalFound: 0,
            totalRequested: validIds.length,
            notFoundIds: validIds,
          },
        },
        { status: 404 }
      );
    }

    // Track which IDs were not found
    const foundIds = transformedScholarships.map((s) => s._id.toString());
    const notFoundIds = validIds.filter((id) => !foundIds.includes(id));

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Scholarships fetched successfully",
        scholarships: transformedScholarships,
        stats: {
          totalFound: transformedScholarships.length,
          totalRequested: validIds.length,
          foundIds,
          ...(notFoundIds.length > 0 && { notFoundIds }),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error("Error fetching scholarships:", error);

    // Handle specific mongoose/database errors
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: "Failed to connect to database or execute query",
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An unexpected error occurred while fetching scholarships",
      },
      { status: 500 }
    );
  }
}
