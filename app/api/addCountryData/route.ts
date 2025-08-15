// api/addCountryData/route.ts
import { NextResponse } from "next/server";
import {
  createCountryData,
  updateCountryDataByFilter,
} from "@/lib/databseHook";
import clientPromise from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

// Helper function to check if country exists
async function checkCountryExists(client: MongoClient, countryname: string) {
  const db = client.db("wwah");
  const collection = db.collection("countries");
  return await collection.findOne({
    $or: [
      { country_name: { $regex: new RegExp(countryname, "i") } },
      { countryname: { $regex: new RegExp(countryname, "i") } },
    ],
  });
}

// Helper function to check if countryData exists
async function checkCountryDataExists(
  client: MongoClient,
  countryname: string
) {
  const db = client.db("wwah");
  const collection = db.collection("countrydatas");
  return await collection.findOne({
    countryname: { $regex: new RegExp(countryname, "i") },
  });
}
// Helper function to trigger webhook

// async function triggerEmbeddingWebhook(
//   action: string,
//   collection: string,
//   documentId: string,
//   document: unknown
// ) {
//   try {
//     const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/embeddingUpdate`;
//     const webhookSecret =
//       process.env.WEBHOOK_SECRET ||
//       "8f3fda4b91822b4a0d5b2a27947f9f21a8cbbd1a124a20aa8b2f76f0e6cfac12";

//     console.log(
//       `🔄 Triggering webhook: ${action} for ${collection} document ${documentId}`
//     );

//     const response = await fetch(webhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action,
//         collection,
//         documentId,
//         document,
//         secret: webhookSecret,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(
//         `❌ Webhook failed: ${response.status} ${response.statusText}`,
//         errorText
//       );
//       throw new Error(`Webhook failed: ${response.status} ${errorText}`);
//     } else {
//       const result = await response.json();
//       console.log(
//         `✅ Webhook triggered successfully: ${action} for ${collection}`,
//         result
//       );
//       return result;
//     }
//   } catch (error) {
//     console.error("❌ Error triggering webhook:", error);
//     throw error;
//   }
// }

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data, "country data");

    if (!data || !data.countryname) {
      return NextResponse.json(
        { message: "Invalid input. 'countryname' is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    // IMPORTANT: Check if the related country exists first
    const relatedCountry = await checkCountryExists(client, data.countryname);

    if (!relatedCountry) {
      console.warn(
        `⚠️ No country found with name: ${data.countryname}. CountryData will not be added.`
      );
      return NextResponse.json(
        {
          message: `Cannot add country data. No country found with name: ${data.countryname}. Please add the country first.`,
          countryname: data.countryname,
          action: "rejected",
        },
        { status: 400 }
      );
    }

    console.log(
      `✅ Found related country: ${
        relatedCountry.country_name || relatedCountry.countryname
      }`
    );

    // Check if country data already exists
    const existingData = await checkCountryDataExists(client, data.countryname);

    let result;
    let countryDataId;
    let action;
    let documentIdForQuery: ObjectId;

    if (existingData) {
      // Update existing
      console.log(`📝 Updating existing country data for: ${data.countryname}`);
      result = await updateCountryDataByFilter(
        client,
        { countryname: { $regex: new RegExp(data.countryname, "i") } },
        data
      );
      countryDataId = existingData._id.toString();
      action = "update";
      documentIdForQuery = existingData._id;
    } else {
      // Create new
      console.log(`➕ Creating new country data for: ${data.countryname}`);
      result = await createCountryData(client, data);
      if (!("insertedId" in result)) {
        throw new Error("Expected InsertOneResult but got UpdateResult");
      }
      countryDataId = result.insertedId.toString();
      action = "create";
      documentIdForQuery = result.insertedId;
    }

    // Get the full document for webhook
    const fullDocument = await client
      .db("wwah")
      .collection("countrydatas")
      .findOne({ _id: documentIdForQuery });

    if (!fullDocument) {
      throw new Error("Failed to retrieve created/updated document");
    }

    // DON'T trigger webhook for countrydatas - let the change stream handle it
    // The change stream will automatically update the related country embedding
    console.log(
      `ℹ️ Skipping webhook trigger - change stream will handle embedding update for ${data.countryname}`
    );

    const message = existingData
      ? "Country data updated successfully. Related country embedding will be updated automatically."
      : "Country data added successfully. Related country embedding will be updated automatically.";

    const statusCode = existingData ? 200 : 201;

    return NextResponse.json(
      {
        message,
        countryDataId,
        action,
        relatedCountry:
          relatedCountry.country_name || relatedCountry.countryname,
        webhookTriggered: false, // Changed to false since we're letting change stream handle it
        changeStreamWillHandle: true,
      },
      { status: statusCode }
    );
  } catch (error) {
    console.error("Error processing country data request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to process the request.",
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
