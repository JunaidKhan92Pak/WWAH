// api/webhooks/embeddingUpdate/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createEmbeddingForDocument,
  updateEmbeddingForDocument,
  deleteEmbeddingForDocument,
} from "@/lib/embedding-operations";

const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET ||
  "8f3fda4b91822b4a0d5b2a27947f9f21a8cbbd1a124a20aa8b2f76f0e6cfac12";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, collection, documentId, document, secret } = body;

    // Verify webhook secret
    if (secret !== WEBHOOK_SECRET) {
      console.log("❌ Invalid webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`🔍 Webhook received: {
  action: '${action}',
  collection: '${collection}',
  documentId: '${documentId}',
  hasDocument: ${!!document},
  documentKeys: ${document ? JSON.stringify(Object.keys(document)) : "none"}
}`);

    console.log(
      `📝 Processing webhook: ${action} for ${collection} document ${documentId}`
    );

    // Handle different collections
    switch (collection) {
      case "countrydatas":
        await handleCountryDataChange(action, documentId, document);
        break;
      case "countries":
        await handleCountryChange(action, documentId, document);
        break;
      case "userdbs":
      case "users":
        await handleUserChange(action, documentId, document);
        break;
      case "universities":
        await handleUniversityChange(action, documentId, document);
        break;
      case "courses":
        await handleCourseChange(action, documentId, document);
        break;
      case "scholarships":
        await handleScholarshipChange(action, documentId, document);
        break;
      case "expenses":
        await handleExpenseChange(action, documentId, document);
        break;
      default:
        console.log(`⚠️ Unknown collection: ${collection}`);
    }

    return NextResponse.json({
      success: true,
      message: `${collection} ${action} processed successfully`,
      documentId,
      collection,
      action,
    });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle countryData changes - this affects country embeddings
async function handleCountryDataChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    if (!document || !document.countryname) {
      console.log("❌ CountryData document missing countryname");
      return;
    }

    const countryName = document.countryname;
    console.log(
      `📋 CountryData ${action}, updating country embedding for: ${countryName}`
    );

    // Import MongoDB client here to avoid issues
    const { MongoClient } = await import("mongodb");
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");

    try {
      // Get the corresponding country document
      const countriesCollection = db.collection("countries");
      const countryDoc = await countriesCollection.findOne({
        country_name: { $regex: new RegExp(`^${countryName}$`, "i") },
      });

      if (!countryDoc) {
        console.log(`⚠️ No matching country found for: ${countryName}`);
        await client.close();
        return;
      }

      console.log(`✅ Found matching country document for: ${countryName}`);

      // Always update the combined country embedding when countryData changes
      switch (action) {
        case "create":
        case "update":
          // Create/update combined country embedding with document data
          console.log(
            `🔄 Creating/updating combined country embedding for: ${countryName}`
          );
          await createEmbeddingForDocument(
            countryDoc,
            "combined_country_data",
            "country_embeddings"
          );
          console.log(
            `✅ Combined country embedding created/updated for: ${countryName}`
          );
          break;

        case "delete":
          // Update country embedding (remove document data)
          console.log(
            `🔄 Updating country embedding (removing document data) for: ${countryName}`
          );
          await createEmbeddingForDocument(
            countryDoc,
            "combined_country_data",
            "country_embeddings"
          );
          console.log(
            `✅ Country embedding updated (document data removed) for: ${countryName}`
          );
          break;
      }
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error(
      `❌ Error handling countryData change for ${documentId}:`,
      error
    );
    throw error;
  }
}

// Handle country changes - this affects country embeddings
async function handleCountryChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    switch (action) {
      case "create":
        console.log(
          `🌍 Creating country embedding for: ${document?.country_name}`
        );
        await createEmbeddingForDocument(
          document,
          "combined_country_data",
          "country_embeddings"
        );
        break;

      case "update":
        console.log(
          `🌍 Updating country embedding for: ${document?.country_name}`
        );
        await updateEmbeddingForDocument(
          documentId,
          document,
          "combined_country_data",
          "country_embeddings"
        );
        break;

      case "delete":
        console.log(`🌍 Deleting country embedding for: ${documentId}`);
        await deleteEmbeddingForDocument(
          documentId,
          "country_embeddings",
          "countryName"
        );
        break;
    }
  } catch (error) {
    console.error(`❌ Error handling country change for ${documentId}:`, error);
    throw error;
  }
}

// Handle user changes
async function handleUserChange(
  action: string,
  documentId: string,
  document: { [key: string]: unknown }
) {
  try {
    switch (action) {
      case "create":
        console.log(
          `👤 Creating user embedding for: ${document?.email || documentId}`
        );
        await createEmbeddingForDocument(
          document,
          "combined_user_data",
          "user_embeddings"
        );
        break;

      case "update":
        console.log(
          `👤 Updating user embedding for: ${document?.email || documentId}`
        );
        await updateEmbeddingForDocument(
          documentId,
          document,
          "combined_user_data",
          "user_embeddings"
        );
        break;

      case "delete":
        console.log(`👤 Deleting user embedding for: ${documentId}`);
        await deleteEmbeddingForDocument(
          documentId,
          "user_embeddings",
          "userId"
        );
        break;
    }
  } catch (error) {
    console.error(`❌ Error handling user change for ${documentId}:`, error);
    throw error;
  }
}

// Handle university changes
async function handleUniversityChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    switch (action) {
      case "create":
        await createEmbeddingForDocument(
          document,
          "universities",
          "university_embeddings"
        );
        break;
      case "update":
        await updateEmbeddingForDocument(
          documentId,
          document,
          "universities",
          "university_embeddings"
        );
        break;
      case "delete":
        await deleteEmbeddingForDocument(documentId, "university_embeddings");
        break;
    }
  } catch (error) {
    console.error(
      `❌ Error handling university change for ${documentId}:`,
      error
    );
    throw error;
  }
}

// Handle course changes
async function handleCourseChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    switch (action) {
      case "create":
        await createEmbeddingForDocument(
          document,
          "courses",
          "course_embeddings"
        );
        break;
      case "update":
        await updateEmbeddingForDocument(
          documentId,
          document,
          "courses",
          "course_embeddings"
        );
        break;
      case "delete":
        await deleteEmbeddingForDocument(documentId, "course_embeddings");
        break;
    }
  } catch (error) {
    console.error(`❌ Error handling course change for ${documentId}:`, error);
    throw error;
  }
}

// Handle scholarship changes
async function handleScholarshipChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    switch (action) {
      case "create":
        await createEmbeddingForDocument(
          document,
          "scholarships",
          "scholarship_embeddings"
        );
        break;
      case "update":
        await updateEmbeddingForDocument(
          documentId,
          document,
          "scholarships",
          "scholarship_embeddings"
        );
        break;
      case "delete":
        await deleteEmbeddingForDocument(documentId, "scholarship_embeddings");
        break;
    }
  } catch (error) {
    console.error(
      `❌ Error handling scholarship change for ${documentId}:`,
      error
    );
    throw error;
  }
}

// Handle expense changes
async function handleExpenseChange(
  action: string,
  documentId: string,
  document: Record<string, unknown>
) {
  try {
    switch (action) {
      case "create":
        await createEmbeddingForDocument(
          document,
          "expenses",
          "expense_embeddings"
        );
        break;
      case "update":
        await updateEmbeddingForDocument(
          documentId,
          document,
          "expenses",
          "expense_embeddings"
        );
        break;
      case "delete":
        await deleteEmbeddingForDocument(documentId, "expense_embeddings");
        break;
    }
  } catch (error) {
    console.error(`❌ Error handling expense change for ${documentId}:`, error);
    throw error;
  }
}
