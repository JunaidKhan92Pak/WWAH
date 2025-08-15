// app/api/visaguide/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VisaGuide from "@/models/visaGuide";
import { NextRequest } from "next/server";
import { Country } from "@/models/countries";
import mongoose from "mongoose";
import { createVisaGuide, updateVisaGuideByFilter } from "@/lib/databseHook";
import clientPromise from "@/lib/mongodb";

// GET all study steps
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid visa guide ID" },
        { status: 400 }
      );
    }

    const visaguide = await VisaGuide.findById(id).lean();
    return NextResponse.json({
      success: true,
      visaguide,
    });
  } catch (error) {
    console.error("Error fetching visa guide:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch visa guide",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);

  const { country_name, steps = [], faqs = [], ...visaGuideData } = body;

  try {
    await connectToDatabase();

    if (!country_name) {
      return NextResponse.json(
        { success: false, error: "country_name is required." },
        { status: 400 }
      );
    }

    const country = await Country.findOne({ country_name: country_name });
    if (!country) {
      return NextResponse.json(
        { success: false, error: "Country not found." },
        { status: 404 }
      );
    }

    // Check if visa guide already exists for this country
    const existingVisaGuide = await VisaGuide.findOne({
      country_name: country_name,
    });

    if (existingVisaGuide) {
      // Update existing visa guide using database hooks for automatic embedding updates
      const updateData = {
        steps: Array.isArray(steps) ? steps : [],
        faqs: Array.isArray(faqs) ? faqs : [],
        updatedAt: new Date(),
        // Add any other fields from visaGuideData but ensure clean structure
        ...Object.fromEntries(
          Object.entries(visaGuideData).filter(
            ([key]) =>
              // Filter out any nested object structures that shouldn't be at root level
              ![
                "program",
                "register_apply",
                "submit_application",
                "applicationFee",
                "track_application",
                "confirmation_enrollment",
                "visa_application",
                "recive_visa",
                "accommodation",
              ].includes(key)
          )
        ),
      };

      // Use database hooks to update with automatic embedding updates
      const client = await clientPromise;
      await updateVisaGuideByFilter(
        client,
        { country_name: country_name },
        updateData
      );

      // Fetch the updated document to return in response
      const updatedVisaGuide = await VisaGuide.findById(
        existingVisaGuide._id
      ).lean();

      console.log(
        `✅ Visa guide updated for ${country_name}: ${existingVisaGuide._id}`
      );

      return NextResponse.json(
        {
          success: true,
          visaGuide: updatedVisaGuide,
          message: "Visa guide updated successfully (with embeddings)",
          isUpdate: true,
        },
        { status: 200 }
      );
    }

    // Create new visa guide if it doesn't exist
    const visaGuidePayload = {
      _id: new mongoose.Types.ObjectId(),
      country_name,
      country_id: country._id,
      steps: Array.isArray(steps) ? steps : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      // Add any other fields from visaGuideData but ensure clean structure
      ...Object.fromEntries(
        Object.entries(visaGuideData).filter(
          ([key]) =>
            // Filter out any nested object structures that shouldn't be at root level
            ![
              "program",
              "register_apply",
              "submit_application",
              "applicationFee",
              "track_application",
              "confirmation_enrollment",
              "visa_application",
              "recive_visa",
              "accommodation",
            ].includes(key)
        )
      ),
    };

    // Use database hooks to create visa guide with automatic embedding
    const client = await clientPromise;
    const result = await createVisaGuide(client, visaGuidePayload);

    // Fetch the created document to return in response
    const newVisaGuide = await VisaGuide.findById(result.insertedId).lean();

    console.log(
      `✅ Visa guide created with clean structure: ${result.insertedId}`
    );

    return NextResponse.json(
      {
        success: true,
        visaGuide: newVisaGuide,
        message:
          "Visa guide created with clean structure and embeddings updated successfully",
        isUpdate: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating/updating visa guide:", error);
    console.error("Error creating/updating visa guide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create/update visa guide" },
      { status: 500 }
    );
  }
}
