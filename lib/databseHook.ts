// lib/database-hooks.ts
import { CountryDocumentData } from "@/scripts/types";
import { MongoClient, ObjectId } from "mongodb";

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_APP_URL + "/api/webhooks/embeddingUpdate";
const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET ||
  "8f3fda4b91822b4a0d5b2a27947f9f21a8cbbd1a124a20aa8b2f76f0e6cfac12";

// Helper function to trigger webhook
async function triggerWebhook(
  action: "create" | "update" | "delete",
  collection: string,
  documentId: string,
  document?: Record<string, unknown>
) {
  try {
    console.log(
      `🔄 Triggering webhook: ${action} for ${collection} document ${documentId}`
    );

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        collection,
        documentId,
        document,
        secret: WEBHOOK_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Webhook failed: ${response.status} ${response.statusText}`,
        errorText
      );
    } else {
      const result = await response.json();
      console.log(
        `✅ Webhook triggered successfully: ${action} for ${collection}`,
        result
      );
    }
  } catch (error) {
    console.error("❌ Error triggering webhook:", error);
  }
}

export class DatabaseHooks {
  private client: MongoClient;
  private dbName: string;

  constructor(client: MongoClient, dbName: string = "wwah") {
    this.client = client;
    this.dbName = dbName;
  }

  // Create document with embedding hook
  async createDocument(
    collectionName: string,
    document: Record<string, unknown>
  ) {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      const result = await collection.insertOne(document);
      const documentId = result.insertedId.toString();

      // Enhanced document payload for webhook
      let enhancedDocument: Record<string, unknown> = {
        ...document,
        _id: result.insertedId,
      };

      // For user documents, include success chance data if available
      if (collectionName === "userdbs") {
        try {
          const successChances = await db
            .collection("successchances")
            .find({ userId: documentId })
            .toArray();

          if (successChances.length > 0) {
            enhancedDocument.successChanceData = successChances[0];
            console.log(
              `📊 Including success chance data for user ${documentId}`
            );
          }
        } catch (error) {
          console.error(
            `⚠️ Could not fetch success chances for user ${documentId}:`,
            error
          );
        }
      }

      // For country documents, include document data if available
      if (collectionName === "countries") {
        try {
          const countryName =
            (document.country_name as string) ||
            (document.countryname as string);
          if (countryName) {
            const countryDocuments = await db
              .collection("countrydatas")
              .find({ countryname: { $regex: new RegExp(countryName, "i") } })
              .toArray();

            if (countryDocuments.length > 0) {
              enhancedDocument.documentData = countryDocuments;
              console.log(
                `📋 Including document data for country ${countryName}`
              );
            }
          }
        } catch (error) {
          console.error(`⚠️ Could not fetch document data for country:`, error);
        }
      }

      // ADD THIS: For visa guide documents, fetch the complete document to ensure all fields are included
      if (collectionName === "visaguides") {
        try {
          // Fetch the complete document from the database to ensure all fields are included
          const completeVisaGuide = await collection.findOne({
            _id: result.insertedId,
          });
          if (completeVisaGuide) {
            enhancedDocument = completeVisaGuide as Record<string, unknown>;
            console.log(
              `📋 Including complete visa guide data for ${documentId}`
            );
            console.log(
              `📋 Steps included: ${completeVisaGuide.steps ? "Yes" : "No"}`
            );
            console.log(
              `📋 Steps count: ${completeVisaGuide.steps?.length || 0}`
            );
          }
        } catch (error) {
          console.error(`⚠️ Could not fetch complete visa guide data:`, error);
        }
      }

      // Trigger embedding creation
      await triggerWebhook(
        "create",
        collectionName,
        documentId,
        enhancedDocument
      );

      return result;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Update document with embedding hook
  async updateDocument(
    collectionName: string,
    filter: Record<string, unknown>,
    update: Record<string, unknown>
  ) {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      // Get the document before update to have the ID
      const existingDoc = await collection.findOne(filter);
      if (!existingDoc) {
        throw new Error("Document not found");
      }

      const result = await collection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        // Get the updated document
        const updatedDoc = await collection.findOne(filter);
        const documentId = existingDoc._id.toString();

        // Enhanced document payload for webhook
        let enhancedDocument: Record<string, unknown> = updatedDoc || {};

        // For user documents, include success chance data if available
        if (collectionName === "userdbs") {
          try {
            const successChances = await db
              .collection("successchances")
              .find({ userId: documentId })
              .toArray();

            if (successChances.length > 0) {
              enhancedDocument = {
                ...updatedDoc,
                successChanceData: successChances[0], // Use first success chance for embedded data
              };
              console.log(
                `📊 Including success chance data for user ${documentId}`
              );
            }
          } catch (error) {
            console.error(
              `⚠️ Could not fetch success chances for user ${documentId}:`,
              error
            );
          }
        }

        // For country documents, include document data if available
        if (collectionName === "countries") {
          try {
            const countryName =
              (updatedDoc?.country_name as string) ||
              (updatedDoc?.countryname as string);
            if (countryName) {
              const countryDocuments = await db
                .collection("countrydatas")
                .find({ countryname: { $regex: new RegExp(countryName, "i") } })
                .toArray();

              if (countryDocuments.length > 0) {
                enhancedDocument = {
                  ...updatedDoc,
                  documentData: countryDocuments,
                };
                console.log(
                  `📋 Including document data for country ${countryName}`
                );
              }
            }
          } catch (error) {
            console.error(
              `⚠️ Could not fetch document data for country:`,
              error
            );
          }
        }

        // Trigger embedding update
        await triggerWebhook(
          "update",
          collectionName,
          documentId,
          enhancedDocument
        );
      }

      return result;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Replace document with embedding hook
  async replaceDocument(
    collectionName: string,
    filter: Record<string, unknown>,
    replacement: Record<string, unknown>
  ) {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      const existingDoc = await collection.findOne(filter);
      if (!existingDoc) {
        throw new Error("Document not found");
      }

      const result = await collection.replaceOne(filter, replacement);
      const documentId = existingDoc._id.toString();

      if (result.modifiedCount > 0) {
        // Enhanced document payload for webhook
        const enhancedDocument: Record<string, unknown> = {
          ...replacement,
          _id: existingDoc._id,
        };

        // For user documents, include success chance data if available
        if (collectionName === "userdbs") {
          try {
            const successChances = await db
              .collection("successchances")
              .find({ userId: documentId })
              .toArray();

            if (successChances.length > 0) {
              enhancedDocument.successChanceData = successChances[0];
              console.log(
                `📊 Including success chance data for user ${documentId}`
              );
            }
          } catch (error) {
            console.error(
              `⚠️ Could not fetch success chances for user ${documentId}:`,
              error
            );
          }
        }

        // For country documents, include document data if available
        if (collectionName === "countries") {
          try {
            const countryName =
              (replacement.country_name as string) ||
              (replacement.countryname as string);
            if (countryName) {
              const countryDocuments = await db
                .collection("countrydatas")
                .find({ countryname: { $regex: new RegExp(countryName, "i") } })
                .toArray();

              if (countryDocuments.length > 0) {
                enhancedDocument.documentData = countryDocuments;
                console.log(
                  `📋 Including document data for country ${countryName}`
                );
              }
            }
          } catch (error) {
            console.error(
              `⚠️ Could not fetch document data for country:`,
              error
            );
          }
        }

        // Trigger embedding update
        await triggerWebhook(
          "update",
          collectionName,
          documentId,
          enhancedDocument
        );
      }

      return result;
    } catch (error) {
      console.error(`Error replacing document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete document with embedding hook
  async deleteDocument(
    collectionName: string,
    filter: Record<string, unknown>
  ) {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      // Get the document before deletion to have the ID
      const existingDoc = await collection.findOne(filter);
      if (!existingDoc) {
        throw new Error("Document not found");
      }

      const result = await collection.deleteOne(filter);
      const documentId = existingDoc._id.toString();

      if (result.deletedCount > 0) {
        // Trigger embedding deletion
        await triggerWebhook(
          "delete",
          collectionName,
          documentId,
          existingDoc as Record<string, unknown>
        );
      }

      return result;
    } catch (error) {
      console.error(`Error deleting document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Bulk operations with embedding hooks
  async bulkWrite(
    collectionName: string,
    operations: Record<string, unknown>[]
  ) {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      // Process operations to get document IDs for webhook triggers
      const webhookPromises: Promise<void>[] = [];

      for (const operation of operations) {
        const operationObj = operation as Record<
          string,
          Record<string, unknown>
        >;

        if (operationObj.insertOne) {
          const doc = operationObj.insertOne.document as Record<
            string,
            unknown
          >;
          webhookPromises.push(
            (async () => {
              const result = await collection.insertOne(doc);

              // Enhanced document payload
              const enhancedDoc: Record<string, unknown> = {
                ...doc,
                _id: result.insertedId,
              };

              // Add related data for specific collections
              if (collectionName === "userdbs") {
                try {
                  const successChances = await db
                    .collection("successchances")
                    .find({ userId: result.insertedId.toString() })
                    .toArray();
                  if (successChances.length > 0) {
                    enhancedDoc.successChanceData = successChances[0];
                  }
                } catch (error) {
                  console.error(`⚠️ Could not fetch success chances:`, error);
                }
              }

              await triggerWebhook(
                "create",
                collectionName,
                result.insertedId.toString(),
                enhancedDoc
              );
            })()
          );
        } else if (operationObj.updateOne || operationObj.updateMany) {
          const updateOp = (operationObj.updateOne ||
            operationObj.updateMany) as {
            filter: Record<string, unknown>;
            update: Record<string, unknown>;
          };
          const existingDoc = await collection.findOne(updateOp.filter);
          if (existingDoc) {
            webhookPromises.push(
              (async () => {
                await collection.updateOne(updateOp.filter, updateOp.update);
                const updatedDoc = await collection.findOne(updateOp.filter);

                // Enhanced document payload
                let enhancedDoc: Record<string, unknown> = updatedDoc || {};

                // Add related data for specific collections
                if (collectionName === "userdbs") {
                  try {
                    const successChances = await db
                      .collection("successchances")
                      .find({ userId: existingDoc._id.toString() })
                      .toArray();
                    if (successChances.length > 0) {
                      enhancedDoc = {
                        ...updatedDoc,
                        successChanceData: successChances[0],
                      };
                    }
                  } catch (error) {
                    console.error(`⚠️ Could not fetch success chances:`, error);
                  }
                }

                await triggerWebhook(
                  "update",
                  collectionName,
                  existingDoc._id.toString(),
                  enhancedDoc
                );
              })()
            );
          }
        } else if (operationObj.deleteOne || operationObj.deleteMany) {
          const deleteOp = (operationObj.deleteOne ||
            operationObj.deleteMany) as {
            filter: Record<string, unknown>;
          };
          const existingDoc = await collection.findOne(deleteOp.filter);
          if (existingDoc) {
            webhookPromises.push(
              (async () => {
                await collection.deleteOne(deleteOp.filter);
                await triggerWebhook(
                  "delete",
                  collectionName,
                  existingDoc._id.toString(),
                  existingDoc as Record<string, unknown>
                );
              })()
            );
          }
        }
      }

      // Execute all operations
      await Promise.all(webhookPromises);

      return { acknowledged: true, webhooksTriggered: webhookPromises.length };
    } catch (error) {
      console.error(`Error in bulk operations for ${collectionName}:`, error);
      throw error;
    }
  }
}

// All convenience functions remain the same...
export async function createCountry(
  client: MongoClient,
  countryData: CountryDocumentData
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument(
    "countries",
    countryData as Record<string, unknown>
  );
}

export async function updateCountry(
  client: MongoClient,
  countryId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);

  // Convert string to ObjectId if it's a valid ObjectId string
  let filter: Record<string, unknown>;

  if (ObjectId.isValid(countryId)) {
    // If it's a valid ObjectId, use it directly
    filter = { _id: new ObjectId(countryId) };
  } else {
    filter = {
      $or: [
        { country_name: countryId },
        { countryname: countryId }, // Handle both possible field names
      ],
    };
  }

  console.log(`🔍 Updating country with filter:`, filter);
  console.log(`📝 Update data:`, updateData);

  return await hooks.updateDocument("countries", filter, { $set: updateData });
}

export async function updateCountryByName(
  client: MongoClient,
  countryName: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);

  const filter = {
    $or: [{ country_name: countryName }, { countryname: countryName }],
  };

  console.log(`🔍 Updating country by name with filter:`, filter);
  console.log(`📝 Update data:`, updateData);

  return await hooks.updateDocument("countries", filter, { $set: updateData });
}
export async function deleteCountry(client: MongoClient, countryId: string) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("countries", { _id: countryId });
}

// NEW: CountryData convenience functions
export async function createCountryData(
  client: MongoClient,
  countryDataDoc: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("countrydatas", countryDataDoc);
}

export async function updateCountryData(
  client: MongoClient,
  countryDataId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "countrydatas",
    { _id: countryDataId },
    { $set: updateData }
  );
}

export async function updateCountryDataByFilter(
  client: MongoClient,
  filter: Record<string, unknown>,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument("countrydatas", filter, {
    $set: updateData,
  });
}

export async function deleteCountryData(
  client: MongoClient,
  countryDataId: string
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("countrydatas", { _id: countryDataId });
}

export async function deleteCountryDataByFilter(
  client: MongoClient,
  filter: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("countrydatas", filter);
}

export async function createUniversity(
  client: MongoClient,
  universityData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("universities", universityData);
}

export async function updateUniversity(
  client: MongoClient,
  universityId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);

  // Convert string to ObjectId if it's a valid ObjectId string
  let filter: Record<string, unknown>;

  if (ObjectId.isValid(universityId)) {
    // If it's a valid ObjectId, use it directly
    filter = { _id: new ObjectId(universityId) };
  } else {
    // If it's not a valid ObjectId, treat it as a string field
    filter = { _id: universityId };
  }

  console.log(`🔍 Updating university with filter:`, filter);
  console.log(`📝 Update data:`, updateData);

  return await hooks.updateDocument("universities", filter, {
    $set: updateData,
  });
}

export async function deleteUniversity(
  client: MongoClient,
  universityId: string
) {
  const hooks = new DatabaseHooks(client);

  // Convert string to ObjectId if it's a valid ObjectId string
  let filter: Record<string, unknown>;

  if (ObjectId.isValid(universityId)) {
    filter = { _id: new ObjectId(universityId) };
  } else {
    filter = { _id: universityId };
  }

  return await hooks.deleteDocument("universities", filter);
}

export async function createCourse(
  client: MongoClient,
  courseData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("courses", courseData);
}

export async function updateCourse(
  client: MongoClient,
  courseId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "courses",
    { _id: courseId },
    { $set: updateData }
  );
}

export async function updateCourseByFilter(
  client: MongoClient,
  filter: Record<string, unknown>,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument("courses", filter, { $set: updateData });
}

export async function deleteCourse(client: MongoClient, courseId: string) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("courses", { _id: courseId });
}

export async function deleteCourseByFilter(
  client: MongoClient,
  filter: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("courses", filter);
}

export async function createScholarship(
  client: MongoClient,
  scholarshipData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("scholarships", scholarshipData);
}

export async function updateScholarship(
  client: MongoClient,
  scholarshipId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "scholarships",
    { _id: scholarshipId },
    { $set: updateData }
  );
}

export async function deleteScholarship(
  client: MongoClient,
  scholarshipId: string
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("scholarships", { _id: scholarshipId });
}

export async function createExpense(
  client: MongoClient,
  expenseData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("expenses", expenseData);
}

export async function updateExpense(
  client: MongoClient,
  expenseId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);

  // Convert string to ObjectId if it's a valid ObjectId string
  let filter: Record<string, unknown>;
  if (ObjectId.isValid(expenseId)) {
    filter = { _id: new ObjectId(expenseId) };
  } else {
    // If it's not a valid ObjectId, treat it as a string (shouldn't happen for _id)
    filter = { _id: expenseId };
  }

  return await hooks.updateDocument("expenses", filter, { $set: updateData });
}

export async function updateExpenseByFilter(
  client: MongoClient,
  filter: Record<string, unknown>,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument("expenses", filter, { $set: updateData });
}

export async function deleteExpense(client: MongoClient, expenseId: string) {
  const hooks = new DatabaseHooks(client);

  // Convert string to ObjectId if it's a valid ObjectId string
  let filter: Record<string, unknown>;
  if (ObjectId.isValid(expenseId)) {
    filter = { _id: new ObjectId(expenseId) };
  } else {
    filter = { _id: expenseId };
  }

  return await hooks.deleteDocument("expenses", filter);
}

export async function createUser(
  client: MongoClient,
  userData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("userdbs", userData);
}

export async function updateUser(
  client: MongoClient,
  userId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "userdbs",
    { _id: userId },
    { $set: updateData }
  );
}

export async function deleteUser(client: MongoClient, userId: string) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("userdbs", { _id: userId });
}

export async function createSuccessChance(
  client: MongoClient,
  successChanceData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("successchances", successChanceData);
}

export async function updateSuccessChance(
  client: MongoClient,
  successChanceId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "successchances",
    { _id: successChanceId },
    { $set: updateData }
  );
}

export async function deleteSuccessChance(
  client: MongoClient,
  successChanceId: string
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("successchances", { _id: successChanceId });
}

export async function createVisaGuide(
  client: MongoClient,
  visaGuideData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.createDocument("visaguides", visaGuideData);
}

export async function updateVisaGuide(
  client: MongoClient,
  visaGuideId: string,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument(
    "visaguides",
    { _id: visaGuideId },
    { $set: updateData }
  );
}

export async function updateVisaGuideByFilter(
  client: MongoClient,
  filter: Record<string, unknown>,
  updateData: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.updateDocument("visaguides", filter, { $set: updateData });
}

export async function deleteVisaGuide(
  client: MongoClient,
  visaGuideId: string
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("visaguides", { _id: visaGuideId });
}

export async function deleteVisaGuideByFilter(
  client: MongoClient,
  filter: Record<string, unknown>
) {
  const hooks = new DatabaseHooks(client);
  return await hooks.deleteDocument("visaguides", filter);
}
