// app/api/getfavouritecourse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import { ObjectId } from "mongodb";
import type { PipelineStage } from "mongoose";
import { Country } from "@/models/countries";

interface ApplicationData {
  applicationStatus: number;
  isConfirmed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Utility for parsing min values ---
function parseMinValue(value: string): { min: number; currency: string } | null {
    if (!value) return null;

    // Clean value (remove Annually, extra spaces)
    const cleaned = value.replace(/Annually/i, "").trim();

    // Regex: capture symbol/code + min/max numbers
    const match = cleaned.match(/(£|\$|€|[A-Z]{3})(?:\s*-?\s*[A-Za-z]*)?\s*([\d,]+)(?:-([\d,]+))?/);

    if (!match) return null;

    let currency = match[1]; // currency symbol or code
    let min = parseFloat(match[2].replace(/,/g, ""));

    // Convert annual → monthly
    if (/annually/i.test(value)) {
        min = min / 12;
    }

    // Map symbols → ISO codes
    const currencyMap: Record<string, string> = {
        "£": "GBP",
        "$": "USD",
        "€": "EUR",
        "USD": "USD",
        "GBP": "GBP",
        "EUR": "EUR",
        "CAD": "CAD",
    };
    if (currencyMap[currency]) {
        currency = currencyMap[currency];
    }

    return { min, currency };
}

function calculateMinCostOfLiving(costData: { [key: string]: string }) {
    const categories = ["rent", "groceries", "transportation", "healthcare", "eating_out", "household_bills"];

    let amount = 0;
    let currency = "";

    categories.forEach((cat) => {
        const parsed = parseMinValue(costData?.[cat]);
        if (parsed) {
            amount += parsed.min;
            currency = parsed.currency; // assume same currency across all fields
        }
    });

    return {
        amount,
        currency,
    };
}

export async function GET(req: NextRequest) {
  try {
    // Connect to database first
    await connectToDatabase();
    console.log("Database connected successfully");

    // Get course IDs and type from query params
    const { searchParams } = new URL(req.url);
    const courseIdsParam = searchParams.get("ids");
    const type = searchParams.get("type") || "favourite";
    const includeApplicationData =
      searchParams.get("includeApplicationData") === "true";

    // Early return if no course IDs provided
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

    // Parse course IDs - handle both string IDs and JSON objects
    let courseIds: string[] = [];
    const applicationDataMap = new Map<string, ApplicationData>(); // To store ONLY schema fields

    try {
      // Try to parse as JSON first (for applied courses with objects)
      const parsed = JSON.parse(decodeURIComponent(courseIdsParam));
      console.log("Parsed data:", parsed);

      if (Array.isArray(parsed)) {
        parsed.forEach((item, index) => {
          if (typeof item === "string") {
            // Handle old string format or favourites
            courseIds.push(item );
            console.log(`Added string course ID: ${index}`);
          } else if (typeof item === "object" && item.courseId) {
            // Handle new applied course object format (SCHEMA ALIGNED)
            courseIds.push(item.courseId);
            console.log(`Added object course ID: ${item.courseId}`);

            if (includeApplicationData || type === "applied") {
              // Store ONLY the schema fields
              const applicationData = {
                applicationStatus: item.applicationStatus || 1, // Main tracking field (1-7)
                isConfirmed: item.isConfirmed || false, // ✅ NEW: Added isConfirmed field
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              };

              applicationDataMap.set(item.courseId, applicationData);
              console.log(
                `Stored application data for ${item.courseId}:`,
                applicationData
              );
            }
          }
        });
      } else {
        throw new Error("Invalid format - not an array");
      }
    } catch {
      console.log("JSON parse failed, trying comma-separated string parsing");
      // Fallback to comma-separated string parsing (for favourites or old format)
      courseIds = decodeURIComponent(courseIdsParam)
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }

    // Early return if no valid course IDs found after parsing
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

    // Return error if no valid ObjectIds found
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
          application_deadline: 1,
          course_description: 1,
          entry_requirements: 1,
          required_ielts_score: 1,
          required_toefl_score: 1,
          required_pte_score: 1,
          language_requirements: 1,
          "universityData.universityImages.banner": 1,
          "universityData.universityImages.logo": 1,
          "universityData.university_name": 1,
          "universityData.university_description": 1,
          "universityData.university_ranking": 1,
          "universityData.location": 1,
        },
      },
      {
        $sort: {
          course_title: 1,
        },
      },
    ];

    // Execute the aggregation pipeline with error handling
    const courses = await Courses.aggregate(pipeline).exec();

    // Get unique country names from the courses
    const uniqueCountries = [...new Set(courses.map(course => course.countryname?.trim()).filter(Boolean))];
    
    // Fetch cost of living data for all countries at once
    const costOfLivingData = await Country.find(
      {
        $or: [
          { country_name: { $in: uniqueCountries } },
          { short_name: { $in: uniqueCountries.map(c => c.toLowerCase()) } }
        ]
      },
      { 
        country_name: 1, 
        short_name: 1,
        rent: 1, 
        groceries: 1, 
        transportation: 1, 
        healthcare: 1, 
        eating_out: 1, 
        household_bills: 1, 
        country_id: 1 
      }
    ).lean();

    // Create a map for quick country lookup
    const countryToCostMap = new Map();
    costOfLivingData.forEach(countryData => {
      const costOfLiving = calculateMinCostOfLiving(countryData);
      // Map by both country_name and short_name for flexible matching
      if (countryData.country_name) {
        countryToCostMap.set(countryData.country_name.trim(), costOfLiving);
      }
      if (countryData.short_name) {
        countryToCostMap.set(countryData.short_name.trim().toLowerCase(), costOfLiving);
      }
    });

    // Enhance courses with application data and cost of living
    const enhancedCourses = courses.map((course) => {
      const courseId = course._id.toString();
      const applicationData = applicationDataMap.get(courseId);

      // Get cost of living for this course's country
      const countryName = course.countryname?.trim();
      let costOfLiving = null;
      
      if (countryName) {
        // Try exact match first, then lowercase match
        costOfLiving = countryToCostMap.get(countryName) || 
                      countryToCostMap.get(countryName.toLowerCase()) || 
                      null;
      }

      console.log(`Processing course ${courseId}:`, {
        hasApplicationData: !!applicationData,
        applicationData: applicationData,
        countryName: countryName,
        hasCostOfLiving: !!costOfLiving,
      });

      const enhancedCourse = {
        ...course,
        costOfLiving, // Add cost of living to each course
      };

      if (applicationData && (type === "applied" || includeApplicationData)) {
        return {
          ...enhancedCourse,
          // Include ONLY schema fields in the course object
          applicationStatus: applicationData.applicationStatus,
          isConfirmed: applicationData.isConfirmed,
          applicationData: {
            applicationStatus: applicationData.applicationStatus,
            isConfirmed: applicationData.isConfirmed,
            createdAt: applicationData.createdAt,
            updatedAt: applicationData.updatedAt,
          },
        };
      }

      return enhancedCourse;
    });

    // Log details about each found course
    enhancedCourses.forEach((course, index) => {
      console.log(`Course ${index + 1}: ${course.course_title} - Cost of Living:`, course.costOfLiving);
    });

    // Check for missing courses
    const foundIds = courses.map((course) => course._id.toString());
    const requestedIds = validObjectIds.map((id) => id.toString());
    const missingIds = requestedIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      console.warn(`Could not find courses with IDs: ${missingIds.join(", ")}`);
    }

    // Prepare response based on type
    const responseKey =
      type === "applied" ? "appliedCourses" : "favouriteCourses";
    const responseMessage =
      type === "applied"
        ? "Applied courses fetched successfully"
        : "Favorite courses fetched successfully";

    // Sort applied courses by application status (higher status first) if applicable
    const finalCourses =
      type === "applied"
        ? enhancedCourses.sort((a, b) => {
          // First sort by applicationStatus (higher status first)
          const aStatus = a.applicationStatus || 1;
          const bStatus = b.applicationStatus || 1;

          if (aStatus !== bStatus) {
            return bStatus - aStatus;
          }

          // Then sort by creation date (most recent first) if available
          const aDate = a.applicationData?.createdAt
            ? new Date(a.applicationData.createdAt)
            : new Date(0);
          const bDate = b.applicationData?.createdAt
            ? new Date(b.applicationData.createdAt)
            : new Date(0);

          return bDate.getTime() - aDate.getTime();
        })
        : enhancedCourses;

    // Prepare warnings array
    const warnings: string[] = [];
    if (invalidIds.length > 0) {
      warnings.push(`Skipped invalid IDs: ${invalidIds.join(", ")}`);
    }
    if (missingIds.length > 0) {
      warnings.push(
        `Could not find courses with IDs: ${missingIds.join(", ")}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: responseMessage,
        [responseKey]: finalCourses,
        totalCount: finalCourses.length,
        metadata: {
          hasApplicationData: applicationDataMap.size > 0,
          type: type,
          includedApplicationData: includeApplicationData || type === "applied",
          schemaAligned: true,
          requestedCount: courseIds.length,
          foundCount: courses.length,
          invalidCount: invalidIds.length,
          missingCount: missingIds.length,
          hasCostOfLiving: true, // Indicate cost of living is included
        },
        ...(warnings.length > 0 && { warnings }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);

    let errorMessage = "Failed to fetch courses";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("ObjectId")) {
        errorMessage = "Invalid course ID format";
        statusCode = 400;
      } else if (
        error.message.includes("connection") ||
        error.message.includes("database")
      ) {
        errorMessage = "Database connection error";
        statusCode = 503;
      } else if (error.message.includes("timeout")) {
        errorMessage = "Database query timeout";
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "favourite";
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
        metadata: {
          type: type,
          errorType:
            error instanceof Error ? error.constructor.name : "UnknownError",
          timestamp: new Date().toISOString(),
        },
      },
      { status: statusCode }
    );
  }
}
// Handle unsupported HTTP methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
