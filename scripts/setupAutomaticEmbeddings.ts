// scripts/setup-automatic-embeddings.ts
import "dotenv/config";
import clientPromise from "../lib/mongodb";
import { createAllEmbeddings, getEmbeddingStats } from "./build-meta-index";

// Test the webhook system
async function testWebhookSystem() {
  console.log("🧪 Testing webhook system...");

  const testPayload = {
    action: "create",
    collection: "universities",
    documentId: "test-id",
    document: {
      _id: "test-id",
      university_name: "Test University",
      country_name: "Test Country",
      location: "Test City",
    },
    secret: process.env.WEBHOOK_SECRET,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/embeddingUpdate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      }
    );

    if (response.ok) {
      console.log("✅ Webhook test successful");
      return true;
    } else {
      console.error("❌ Webhook test failed:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("❌ Webhook test error:", error);
    return false;
  }
}

// Create
async function createVectorIndexes() {
  console.log("📊 Creating vector search indexes...");

  try {
    // const client = await clientPromise;
    // const db = client.db("wwah");

    const indexes = [
      {
        collection: "country_embeddings",
        indexName: "country_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "university_embeddings",
        indexName: "university_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "course_embeddings",
        indexName: "course_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "scholarship_embeddings",
        indexName: "scholarship_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "expense_embeddings",
        indexName: "expense_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "user_embeddings",
        indexName: "user_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
      {
        collection: "visaguide_embeddings",
        indexName: "visaguide_vector_index",
        definition: {
          fields: [
            {
              type: "vector",
              path: "embedding",
              numDimensions: 1536,
              similarity: "cosine",
            },
          ],
        },
      },
    ];

    for (const indexConfig of indexes) {
      try {
        // const collection = db.collection(indexConfig.collection);

        // Note: This is a placeholder - actual vector index creation depends on your MongoDB Atlas setup
        // You'll need to create these indexes through MongoDB Atlas UI or Atlas CLI
        console.log(
          `📍 Index needed for ${indexConfig.collection}: ${indexConfig.indexName}`
        );
        console.log(
          `   Definition:`,
          JSON.stringify(indexConfig.definition, null, 2)
        );
      } catch (error) {
        console.error(
          `❌ Error with index for ${indexConfig.collection}:`,
          error
        );
      }
    }

    console.log(
      "✅ Vector index configurations logged (create these in MongoDB Atlas)"
    );
    return true;
  } catch (error) {
    console.error("❌ Error creating vector indexes:", error);
    return false;
  }
}

// Validate environment setup
function validateEnvironment() {
  console.log("🔍 Validating environment setup...");

  const required = [
    "MONGODB_URI",
    "OPENAI_API_KEY",
    "WEBHOOK_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    return false;
  }

  console.log("✅ Environment variables validated");
  return true;
}

// Main setup function
async function setupAutomaticEmbeddings() {
  console.log("🚀 Setting up automatic embeddings system...\n");

  // Step 1: Validate environment
  if (!validateEnvironment()) {
    process.exit(1);
  }

  // Step 2: Create initial embeddings
  console.log("\n📋 Step 1: Creating initial embeddings...");
  try {
    await createAllEmbeddings();
    console.log("✅ Initial embeddings created");
  } catch (error) {
    console.error("❌ Failed to create initial embeddings:", error);
    process.exit(1);
  }

  // Step 3: Create vector indexes (informational)
  console.log("\n📊 Step 2: Vector index setup...");
  await createVectorIndexes();

  // Step 4: Test webhook system (only if URL is available)
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
  ) {
    console.log("\n🧪 Step 3: Testing webhook system...");
    const webhookTest = await testWebhookSystem();
    if (!webhookTest) {
      console.warn("⚠️ Webhook test failed - make sure your app is deployed");
    }
  } else {
    console.log("\n⏭️ Step 3: Skipping webhook test (deploy app first)");
  }

  // Step 5: Show current stats
  console.log("\n📊 Step 4: Current embedding statistics...");
  try {
    const stats = await getEmbeddingStats();
    console.log("Current embeddings:", stats);
  } catch (error) {
    console.error("❌ Error getting stats:", error);
  }

  console.log("\n🎉 Setup complete! Next steps:");
  console.log("1. Deploy your app to Vercel");
  console.log("2. Create vector search indexes in MongoDB Atlas");
  console.log(
    "3. Replace your database operations with hook-enabled functions"
  );
  console.log("4. Test the system by creating/updating records");
  console.log("5. Monitor webhook logs in Vercel Functions");
}

// Test individual embedding operations
async function testEmbeddingOperations() {
  console.log("🧪 Testing individual embedding operations...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");

    // Test creating a sample document
    const testUniversity = {
      university_name: "Test University for Embeddings",
      country_name: "Test Country",
      location: "Test City",
      overview:
        "This is a test university for testing automatic embedding creation.",
    };

    console.log("📝 Testing university creation...");
    const result = await db
      .collection("universities")
      .insertOne(testUniversity);
    console.log("✅ Test university created with ID:", result.insertedId);

    // Clean up test data
    await db.collection("universities").deleteOne({ _id: result.insertedId });
    console.log("🧹 Test data cleaned up");

    return true;
  } catch (error) {
    console.error("❌ Error testing embedding operations:", error);
    return false;
  }
}

// Check database connections
async function checkDatabaseConnection() {
  console.log("🔌 Checking database connection...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");

    // Check if collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const requiredCollections = [
      "countries",
      "universities",
      "courses",
      "scholarships",
      "expenses",
      "userdbs",
      "successchances",
      "visaGuides",
    ];

    const missingCollections = requiredCollections.filter(
      (name) => !collectionNames.includes(name)
    );

    if (missingCollections.length > 0) {
      console.warn("⚠️ Missing collections:", missingCollections);
      console.log(
        "💡 These collections will be created automatically when you add data"
      );
    }

    console.log("✅ Database connection successful");
    console.log(
      "📋 Found collections:",
      collectionNames.filter((name) => requiredCollections.includes(name))
    );

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  setupAutomaticEmbeddings().catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
}

export {
  setupAutomaticEmbeddings,
  testWebhookSystem,
  createVectorIndexes,
  validateEnvironment,
  testEmbeddingOperations,
  checkDatabaseConnection,
};
