// lib/change-stream-handler.ts
import {
  MongoClient,
  ChangeStream,
  ChangeStreamDocument,
  Document,
  ObjectId,
} from "mongodb";
import {
  createEmbeddingForDocument,
  updateEmbeddingForDocument,
  deleteEmbeddingForDocument,
} from "./embedding-operations";

interface ChangeStreamConfig {
  collection: string;
  embeddingCollection: string;
  handler: (
    operation: string,
    document: Record<string, unknown> | null,
    documentId: string
  ) => Promise<void>;
}

const COLLECTION_MAPPINGS: Record<string, ChangeStreamConfig> = {
  countries: {
    collection: "countries",
    embeddingCollection: "country_embeddings",
    handler: handleCountryChange,
  },
  universities: {
    collection: "universities",
    embeddingCollection: "university_embeddings",
    handler: handleUniversityChange,
  },
  courses: {
    collection: "courses",
    embeddingCollection: "course_embeddings",
    handler: handleCourseChange,
  },
  scholarships: {
    collection: "scholarships",
    embeddingCollection: "scholarship_embeddings",
    handler: handleScholarshipChange,
  },
  expenses: {
    collection: "expenses",
    embeddingCollection: "expense_embeddings",
    handler: handleExpenseChange,
  },
  userdbs: {
    collection: "userdbs",
    embeddingCollection: "user_embeddings",
    handler: handleUserChange,
  },
  successchances: {
    collection: "successchances",
    embeddingCollection: "user_embeddings",
    handler: handleSuccessChanceChange,
  },
  // NEW: Add countryData change stream
  countrydatas: {
    collection: "countrydatas",
    embeddingCollection: "country_embeddings",
    handler: handleCountryDataChange,
  },
};

// Generic change handlers
async function handleCountryChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`🌍 Country ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      if (document) {
        await createEmbeddingForDocument(
          document,
          "combined_country_data", // Use combined approach
          "country_embeddings"
        );
      }
      break;
    case "update":
      if (document) {
        await updateEmbeddingForDocument(
          documentId,
          document,
          "combined_country_data", // Use combined approach
          "country_embeddings"
        );
      }
      break;
    case "delete":
      // Use country name for deletion since that's the ID field for combined country data
      const countryName =
        (document?.country_name as string) ||
        (document?.countryname as string) ||
        documentId;
      await deleteEmbeddingForDocument(
        countryName,
        "country_embeddings",
        "countryName"
      );
      break;
  }
}

// NEW: Handle countryData changes - these should trigger country embedding updates
async function handleCountryDataChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`📋 CountryData ${operation}: ${documentId}`);

  // When countryData changes, we need to update the related country embedding
  const countryName = document?.countryname as string;

  if (countryName) {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI!);
      const db = client.db("wwah");

      // Find the related country document
      const countryDoc = await db.collection("countries").findOne({
        country_name: { $regex: new RegExp(countryName, "i") },
      });

      if (countryDoc) {
        console.log(
          `🔄 Updating country embedding for ${countryName} due to countryData change`
        );

        switch (operation) {
          case "insert":
          case "replace":
          case "update":
            await updateEmbeddingForDocument(
              countryName, // Use country name as ID
              countryDoc as Record<string, unknown>,
              "combined_country_data",
              "country_embeddings"
            );
            break;
          case "delete":
            // Re-create country embedding without the deleted document data
            await updateEmbeddingForDocument(
              countryName,
              countryDoc as Record<string, unknown>,
              "combined_country_data",
              "country_embeddings"
            );
            break;
        }
      } else {
        console.warn(`⚠️ No country found for countryData: ${countryName}`);
      }

      await client.close();
    } catch (error) {
      console.error(
        `❌ Error handling countryData change for ${countryName}:`,
        error
      );
    }
  } else {
    console.warn(
      `⚠️ No countryname found in countryData document: ${documentId}`
    );
  }
}

async function handleUniversityChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`🏛️ University ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      if (document) {
        await createEmbeddingForDocument(
          document,
          "universities",
          "university_embeddings"
        );
      }
      break;
    case "update":
      if (document) {
        await updateEmbeddingForDocument(
          documentId,
          document,
          "universities",
          "university_embeddings"
        );
      }
      break;
    case "delete":
      await deleteEmbeddingForDocument(documentId, "university_embeddings");
      break;
  }
}

async function handleCourseChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`📚 Course ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      if (document) {
        await createEmbeddingForDocument(
          document,
          "courses",
          "course_embeddings"
        );
      }
      break;
    case "update":
      if (document) {
        await updateEmbeddingForDocument(
          documentId,
          document,
          "courses",
          "course_embeddings"
        );
      }
      break;
    case "delete":
      await deleteEmbeddingForDocument(documentId, "course_embeddings");
      break;
  }
}

async function handleScholarshipChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`🎓 Scholarship ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      if (document) {
        await createEmbeddingForDocument(
          document,
          "scholarships",
          "scholarship_embeddings"
        );
      }
      break;
    case "update":
      if (document) {
        await updateEmbeddingForDocument(
          documentId,
          document,
          "scholarships",
          "scholarship_embeddings"
        );
      }
      break;
    case "delete":
      await deleteEmbeddingForDocument(documentId, "scholarship_embeddings");
      break;
  }
}

async function handleExpenseChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`💰 Expense ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      if (document) {
        await createEmbeddingForDocument(
          document,
          "expenses",
          "expense_embeddings"
        );
      }
      break;
    case "update":
      if (document) {
        await updateEmbeddingForDocument(
          documentId,
          document,
          "expenses",
          "expense_embeddings"
        );
      }
      break;
    case "delete":
      await deleteEmbeddingForDocument(documentId, "expense_embeddings");
      break;
  }
}

async function handleUserChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`👤 User ${operation}: ${documentId}`);

  switch (operation) {
    case "insert":
    case "replace":
      await createUserEmbedding(documentId, document);
      break;
    case "update":
      await updateUserEmbedding(documentId, document);
      break;
    case "delete":
      await deleteEmbeddingForDocument(documentId, "user_embeddings", "userId");
      break;
  }
}

async function handleSuccessChanceChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(`📊 SuccessChance ${operation}: ${documentId}`);

  // For success chances, we need to update the user embedding
  const userId = document?.userId?.toString();
  if (userId) {
    console.log(
      `🔄 Success chance changed, updating user embedding for: ${userId}`
    );
    await updateUserEmbedding(userId);
  } else {
    console.warn(
      `⚠️ No userId found in success chance document: ${documentId}`
    );
  }
}

// User-specific embedding functions
async function createUserEmbedding(
  userId: string,
  userDocument?: Record<string, unknown> | null
) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");

    // Get user data if not provided
    if (!userDocument) {
      userDocument = (await db
        .collection("userdbs")
        .findOne({ _id: new ObjectId(userId) })) as Record<string, unknown> | null;
    }

    if (!userDocument) {
      console.error(`❌ User ${userId} not found`);
      await client.close();
      return;
    }

    console.log(`👤 Creating user embedding for: ${userId}`);

    // Create embedding using the updated function signature
    await createEmbeddingForDocument(
      { ...userDocument, _id: userId },
      "combined_user_data", // Use combined approach
      "user_embeddings"
    );

    await client.close();
    console.log(`✅ Created user embedding for: ${userId}`);
  } catch (error) {
    console.error(`❌ Error creating user embedding for ${userId}:`, error);
  }
}

async function updateUserEmbedding(
  userId: string,
  userDocument?: Record<string, unknown> | null
) {
  try {
    console.log(`🔄 Updating user embedding for: ${userId}`);

    // Delete existing embedding
    await deleteEmbeddingForDocument(userId, "user_embeddings", "userId");

    // Create new embedding
    await createUserEmbedding(userId, userDocument);

    console.log(`✅ Updated user embedding for: ${userId}`);
  } catch (error) {
    console.error(`❌ Error updating user embedding for ${userId}:`, error);
  }
}

// Main change stream setup function
export async function setupChangeStreams() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db("wwah");

  const changeStreams: ChangeStream[] = [];

  for (const [collectionName, config] of Object.entries(COLLECTION_MAPPINGS)) {
    try {
      const collection = db.collection(config.collection);

      const changeStream = collection.watch(
        [
          {
            $match: {
              operationType: { $in: ["insert", "update", "replace", "delete"] },
            },
          },
        ],
        {
          fullDocument: "updateLookup",
          fullDocumentBeforeChange: "whenAvailable",
        }
      );

      changeStream.on(
        "change",
        async (change: ChangeStreamDocument<Document>) => {
          try {
            const { operationType } = change;

            // Only access documentKey for operation types that include it
            let documentId: string | undefined;
            if (
              operationType === "insert" ||
              operationType === "update" ||
              operationType === "replace" ||
              operationType === "delete"
            ) {
              const documentKey = (change as ChangeStreamDocument<Document> & { documentKey: { _id: unknown } }).documentKey;
              documentId = documentKey?._id?.toString();
            }

            if (!documentId) {
              console.error("❌ No document ID found in change event");
              return;
            }

            // Handle fullDocument based on operation type
            let fullDocument: Record<string, unknown> | null = null;

            if ("fullDocument" in change) {
              fullDocument = change.fullDocument as Record<
                string,
                unknown
              > | null;
            }

            console.log(
              `📝 Change detected in ${collectionName}: ${operationType} ${documentId}`
            );

            // Handle the change using the specific handler
            await config.handler(operationType, fullDocument, documentId);
          } catch (error) {
            console.error(
              `❌ Error processing change in ${collectionName}:`,
              error
            );
          }
        }
      );

      changeStream.on("error", (error) => {
        console.error(`❌ Change stream error for ${collectionName}:`, error);
      });

      changeStreams.push(changeStream);
      console.log(`✅ Change stream setup for ${collectionName}`);
    } catch (error) {
      console.error(
        `❌ Failed to setup change stream for ${collectionName}:`,
        error
      );
    }
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("🔄 Closing change streams...");
    await Promise.all(changeStreams.map((stream) => stream.close()));
    await client.close();
    process.exit(0);
  });

  console.log(`🚀 ${changeStreams.length} change streams are now active`);
  return changeStreams;
}

export { COLLECTION_MAPPINGS };
