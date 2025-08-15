// lib/change-stream-handler.ts - Updated for clean visa guide structure
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
  deleteScholarshipEmbedding,
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

interface StepData {
  title?: string;
  heading?: string;
  description?: string;
  points?: string[];
  requirements?: string[];
  documents?: string[];
  timeline?: string;
  cost?: string;
  [key: string]: unknown;
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
  countrydatas: {
    collection: "countrydatas",
    embeddingCollection: "country_embeddings",
    handler: handleCountryDataChange,
  },
  visaguides: {
    collection: "visaguides",
    embeddingCollection: "visaguide_embeddings",
    handler: handleVisaGuideChange,
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

// Handle countryData changes
async function handleCountryDataChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  console.log(
    `📋 CountryData ${operation}, updating country embedding for: ${documentId}`
  );

  // When countryData changes, we need to update the related country embedding
  const countryName = document?.countryname as string;

  if (!countryName) {
    console.warn(
      `⚠️ No countryname found in countryData document: ${documentId}`
    );
    return;
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");

    // Find the related country document
    const countryDoc = await db.collection("countries").findOne({
      $or: [
        { country_name: { $regex: new RegExp(countryName, "i") } },
        { countryname: { $regex: new RegExp(countryName, "i") } },
      ],
    });

    if (!countryDoc) {
      console.warn(
        `⚠️ No matching country found for countryData: ${countryName}. Skipping embedding creation.`
      );
      await client.close();
      return;
    }

    console.log(
      `🔄 Updating country embedding for ${countryName} due to countryData change`
    );

    // Check if country embedding already exists
    const embeddingCollection = db.collection("country_embeddings");
    const existingEmbedding = await embeddingCollection.findOne({
      countryName: { $regex: new RegExp(`^${countryName}$`, "i") },
    });

    switch (operation) {
      case "insert":
      case "replace":
      case "update":
        if (existingEmbedding) {
          // UPDATE existing embedding instead of creating new one
          console.log(
            `📝 Updating existing country embedding for ${countryName}`
          );

          // Use the country name as the documentId for country embeddings
          await updateEmbeddingForDocument(
            countryName, // Use country name as ID for country embeddings
            countryDoc as Record<string, unknown>,
            "combined_country_data",
            "country_embeddings"
          );
        } else {
          // Create new country embedding only if none exists
          console.log(
            `➕ Creating new country embedding for ${countryName} with countryData`
          );
          await createEmbeddingForDocument(
            countryDoc as Record<string, unknown>,
            "combined_country_data",
            "country_embeddings"
          );
        }
        break;

      case "delete":
        if (existingEmbedding) {
          // Update country embedding without the deleted document data
          console.log(
            `🔄 Updating country embedding for ${countryName} without deleted countryData`
          );

          // Update existing embedding rather than delete and recreate
          await updateEmbeddingForDocument(
            countryName,
            countryDoc as Record<string, unknown>,
            "combined_country_data",
            "country_embeddings"
          );
        } else {
          console.log(
            `ℹ️ No existing embedding found for ${countryName}, nothing to update after delete`
          );
        }
        break;
    }

    await client.close();
  } catch (error) {
    console.error(
      `❌ Error handling countryData change for ${countryName}:`,
      error
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
        // For scholarship updates, use the compound identifier approach
        const scholarshipName = document.name as string;
        const hostCountry = document.hostCountry as string;

        console.log(
          `🔄 Updating scholarship embedding: ${scholarshipName} in ${hostCountry}`
        );

        await updateEmbeddingForDocument(
          documentId,
          document,
          "scholarships",
          "scholarship_embeddings"
        );
      }
      break;
    case "delete":
      // For deletion, try to use compound identifier if available
      if (document) {
        const scholarshipName = document.name as string;
        const hostCountry = document.hostCountry as string;

        if (scholarshipName && hostCountry) {
          await deleteScholarshipEmbedding(
            scholarshipName,
            hostCountry,
            "scholarship_embeddings"
          );
        } else {
          await deleteEmbeddingForDocument(
            documentId,
            "scholarship_embeddings"
          );
        }
      } else {
        await deleteEmbeddingForDocument(documentId, "scholarship_embeddings");
      }
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

// UPDATED: Handle visa guide changes with clean structure support
async function handleVisaGuideChange(
  operation: string,
  document: Record<string, unknown> | null,
  documentId: string
) {
  try {
    console.log(
      `📋 Processing visa guide ${operation} for document ${documentId}`
    );

    // Always fetch the complete document to ensure we have all data
    let completeDocument = document;

    if (operation !== "delete") {
      console.log(`🔍 Fetching complete document from database...`);

      const client = await MongoClient.connect(process.env.MONGODB_URI!);
      const db = client.db("wwah");

      try {
        const fetchedDoc = await db.collection("visaguides").findOne({
          _id: new ObjectId(documentId),
        });

        if (fetchedDoc) {
          completeDocument = fetchedDoc as Record<string, unknown>;

          // Log the document structure for debugging
          console.log(`✅ Fetched complete visa guide document:`, {
            country_name: completeDocument.country_name,
            hasSteps: !!completeDocument.steps,
            stepsCount: Array.isArray(completeDocument.steps)
              ? completeDocument.steps.length
              : 0,
            totalKeys: Object.keys(completeDocument).length,
          });

          // Log sample step for debugging
          if (
            Array.isArray(completeDocument.steps) &&
            completeDocument.steps.length > 0
          ) {
            const sampleStep = completeDocument.steps[0] as StepData;
            console.log(`📝 Sample step structure:`, {
              title: sampleStep.title || sampleStep.heading,
              hasDescription: !!sampleStep.description,
              pointsCount: Array.isArray(sampleStep.points)
                ? sampleStep.points.length
                : 0,
              requirementsCount: Array.isArray(sampleStep.requirements)
                ? sampleStep.requirements.length
                : 0,
              documentsCount: Array.isArray(sampleStep.documents)
                ? sampleStep.documents.length
                : 0,
              hasTimeline: !!sampleStep.timeline,
              hasCost: !!sampleStep.cost,
            });
          }
        } else {
          console.error(`❌ Could not fetch visa guide document ${documentId}`);
        }
      } finally {
        await client.close();
      }
    }

    switch (operation) {
      case "insert":
      case "replace":
        console.log(
          `📋 Creating visa guide embedding for: ${completeDocument?.country_name}`
        );
        if (completeDocument) {
          await createEmbeddingForDocument(
            completeDocument,
            "visaguides",
            "visaguide_embeddings"
          );
        } else {
          console.error(
            `❌ Cannot create embedding: completeDocument is null for documentId ${documentId}`
          );
        }
        break;

      case "update":
        console.log(
          `📋 Updating visa guide embedding for: ${completeDocument?.country_name}`
        );
        if (completeDocument) {
          await updateEmbeddingForDocument(
            documentId,
            completeDocument,
            "visaguides",
            "visaguide_embeddings"
          );
        } else {
          console.error(
            `❌ Cannot update embedding: completeDocument is null for documentId ${documentId}`
          );
        }
        break;

      case "delete":
        console.log(`📋 Deleting visa guide embedding for: ${documentId}`);
        await deleteEmbeddingForDocument(documentId, "visaguide_embeddings");
        break;
    }

    console.log(`✅ Visa guide ${operation} completed for ${documentId}`);
  } catch (error) {
    console.error(
      `❌ Error handling visa guide change for ${documentId}:`,
      error
    );
    throw error;
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
        .findOne({ _id: new ObjectId(userId) })) as Record<
        string,
        unknown
      > | null;
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

// UPDATED: Visa guide validation and structure checking
function validateVisaGuideStructure(document: Record<string, unknown>): {
  isValid: boolean;
  hasCleanStructure: boolean;
  hasLegacyStructure: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required fields
  if (!document.country_name) {
    errors.push("Missing required field: country_name");
  }

  if (!document.country_id) {
    warnings.push("Missing country_id reference");
  }

  // Check for clean structure (steps array)
  const hasCleanStructure = !!(
    document.steps &&
    Array.isArray(document.steps) &&
    document.steps.length > 0
  );

  // Check for legacy structure (individual step properties)
  const legacyStepProperties = [
    "program",
    "register_apply",
    "submit_application",
    "applicationFee",
    "track_application",
    "confirmation_enrollment",
    "visa_application",
    "recive_visa",
    "accommodation",
    "prepare_arrival",
    "attend_orientation",
  ];

  const hasLegacyStructure = legacyStepProperties.some(
    (prop) => document[prop] && typeof document[prop] === "object"
  );

  // Validate steps structure if present
  if (hasCleanStructure) {
    const steps = document.steps as StepData[];
    steps.forEach((step, index) => {
      if (!step.title && !step.heading) {
        warnings.push(`Step ${index + 1} missing title/heading`);
      }
      if (
        !step.points ||
        !Array.isArray(step.points) ||
        step.points.length === 0
      ) {
        warnings.push(`Step ${index + 1} missing or empty points array`);
      }
    });
  }
  const isValid = errors.length === 0;

  return {
    isValid,
    hasCleanStructure,
    hasLegacyStructure,
    errors,
    warnings,
  };
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
              const documentKey = (
                change as ChangeStreamDocument<Document> & {
                  documentKey: { _id: unknown };
                }
              ).documentKey;
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

            // Special validation for visa guides
            if (
              collectionName === "visaguides" &&
              fullDocument &&
              operationType !== "delete"
            ) {
              const validation = validateVisaGuideStructure(fullDocument);
              console.log(`🔍 Visa guide structure validation:`, {
                isValid: validation.isValid,
                hasCleanStructure: validation.hasCleanStructure,
                hasLegacyStructure: validation.hasLegacyStructure,
                errorCount: validation.errors.length,
                warningCount: validation.warnings.length,
              });

              if (validation.errors.length > 0) {
                console.error(
                  `❌ Visa guide validation errors:`,
                  validation.errors
                );
              }

              if (validation.warnings.length > 0) {
                console.warn(
                  `⚠️ Visa guide validation warnings:`,
                  validation.warnings
                );
              }

              if (
                validation.hasLegacyStructure &&
                !validation.hasCleanStructure
              ) {
                console.warn(
                  `⚠️ Visa guide ${documentId} still uses legacy structure. Consider migrating to clean structure.`
                );
              }
            }

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

export { COLLECTION_MAPPINGS, validateVisaGuideStructure };
