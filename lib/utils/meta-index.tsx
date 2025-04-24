// import clientPromise from "@/lib/mongodb";
// import { OpenAIEmbeddings } from "@langchain/openai";

// export async function createMetaIndex() {
//   console.log("Starting meta-index creation...");
//   const client = await clientPromise;
//   const db = client.db("ragchatbot");
//   const metaCollection = db.collection("meta_embeddings");

//   // Define your source collections
//   const sourceCollections = ["collection1", "collection2", "collection3"];
//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   // Process each collection
//   for (const collectionName of sourceCollections) {
//     console.log(`Processing collection: ${collectionName}`);
//     const sourceCollection = db.collection(collectionName);
//     const documents = await sourceCollection.find({}).toArray();

//     // Process in batches to avoid memory issues
//     const batchSize = 100;
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);
//       console.log(
//         `Processing batch ${i / batchSize + 1} of ${Math.ceil(
//           documents.length / batchSize
//         )}`
//       );

//       // Extract text from documents (adapt this to your document structure)
//       const textsToEmbed = batch.map((doc) => doc.content || doc.text);

//       // Generate embeddings
//       const embeddingResults = await embeddings.embedDocuments(textsToEmbed);

//       // Create meta documents
//       const metaDocs = batch.map((doc, idx) => ({
//         text: doc.content || doc.text,
//         embedding: embeddingResults[idx],
//         sourceCollection: collectionName,
//         originalId: doc._id.toString(),
//         metadata: doc.metadata || {},
//         createdAt: new Date(),
//       }));

//       // Insert into meta collection
//       await metaCollection.insertMany(metaDocs);
//     }

//     console.log(
//       `Processed ${documents.length} documents from ${collectionName}`
//     );
//   }

//   console.log("Meta-index creation complete!");
//   return {
//     success: true,
//     documentCount: await metaCollection.countDocuments(),
//   };
// }
//v2
// import { OpenAIEmbeddings } from "@langchain/openai";
// import clientPromise from "../mongodb";

// export async function createMetaIndex() {

//   console.log("Starting meta-index creation...");
//   const client = await clientPromise;
//   const db = client.db(); // Your database name from the screenshot
//   const metaCollection = db.collection("meta_embeddings");
//   const databases = await client.db().admin().listDatabases();
//   console.log("Available databases:", databases);
//   // Define your source collections based on your actual collections
//   const sourceCollections = [
//     "academicinfos",
//     "applicationinfos",
//     "basicinfos",
//     "languageproficiencies",
//     "universities",
//     "userdbs",
//     "userpreferences",
//     "workexperiences",
//     "documents",
//   ];

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   // Process each collection
//   for (const collectionName of sourceCollections) {
//     console.log(`Processing collection: ${collectionName}`);
//     const sourceCollection = db.collection(collectionName);
//     const documents = await sourceCollection.find({}).toArray();

//     // Process in batches to avoid memory issues
//     const batchSize = 50; // Smaller batch for safety
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);
//       console.log(
//         `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
//           documents.length / batchSize
//         )} in ${collectionName}`
//       );

//       // Extract text from documents - adapt field names based on your schema
//       const textsToEmbed = batch.map((doc) => {
//         // Look for common text fields - adjust based on your actual document structure
//         const textContent =
//           doc.description ||
//           doc.content ||
//           doc.text ||
//           doc.info ||
//           (typeof doc === "object" ? JSON.stringify(doc) : String(doc));
//         return textContent;
//       });

//       // Generate embeddings
//       const embeddingResults = await embeddings.embedDocuments(textsToEmbed);

//       // Create meta documents
//       const metaDocs = batch.map((doc, idx) => ({
//         text: textsToEmbed[idx],
//         embedding: embeddingResults[idx],
//         sourceCollection: collectionName,
//         originalId: doc._id.toString(),
//         metadata: {
//           // Add any useful fields for retrieval context
//           title: doc.title || doc.name || doc.id || "Untitled",
//           // Add additional metadata fields that might be useful
//           ...doc,
//         },
//         createdAt: new Date(),
//       }));

//       // Insert into meta collection
//       await metaCollection.insertMany(metaDocs);
//     }

//     console.log(
//       `Processed ${documents.length} documents from ${collectionName}`
//     );
//   }

//   console.log("Meta-index creation complete!");
//   return {
//     success: true,
//     documentCount: await metaCollection.countDocuments(),
//   };
// }
// v3
import { OpenAIEmbeddings } from "@langchain/openai";
import clientPromise from "../mongodb";

export async function createMetaIndex() {
  console.log("Starting meta-index creation...");
  const client = await clientPromise;
  const db = client.db(); // Your database name from the screenshot
  const metaCollection = db.collection("meta_embeddings");
  const databases = await client.db().admin().listDatabases();
  console.log("Available databases:", databases);
  // Define your source collections based on your actual collections
  const sourceCollections = [
    "countries",
    "universities",
    "courses",
    "expenses",
    "scholarships",
    "visaguides",
  ];

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  // Process each collection
  for (const collectionName of sourceCollections) {
    console.log(`Processing collection: ${collectionName}`);
    const sourceCollection = db.collection(collectionName);
    const documents = await sourceCollection.find({}).toArray();

    // Process in batches to avoid memory issues
    const batchSize = 50; // Smaller batch for safety
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
          documents.length / batchSize
        )} in ${collectionName}`
      );

      // Extract text from documents - adapt field names based on your schema
      const textsToEmbed = batch.map((doc) => {
        // Look for common text fields - adjust based on your actual document structure
        const textContent =
          doc.description ||
          doc.content ||
          doc.text ||
          doc.info ||
          (typeof doc === "object" ? JSON.stringify(doc) : String(doc));
        return textContent;
      });

      // Generate embeddings
      const embeddingResults = await embeddings.embedDocuments(textsToEmbed);

      // Create meta documents
      const metaDocs = batch.map((doc, idx) => ({
        text: textsToEmbed[idx],
        embedding: embeddingResults[idx],
        sourceCollection: collectionName,
        originalId: doc._id.toString(),
        metadata: {
          // Add any useful fields for retrieval context
          title: doc.title || doc.name || doc.id || "Untitled",
          // Add additional metadata fields that might be useful
          ...doc,
        },
        createdAt: new Date(),
      }));

      // Insert into meta collection
      await metaCollection.insertMany(metaDocs);
    }

    console.log(
      `Processed ${documents.length} documents from ${collectionName}`
    );
  }

  console.log("Meta-index creation complete!");
  return {
    success: true,
    documentCount: await metaCollection.countDocuments(),
  };
}
// Add this to your meta-index.ts file or create a new utility file
export async function updateUserIndex(userId: string) {
  if (!userId) return;

  try {
    // First, delete any existing entries for this user
    const client = await clientPromise;
    const db = client.db("wwah");
    await db.collection("user_embeddings").deleteMany({ userId: userId });

    // Then recreate the index for this user
    const result = await createUserIndex();
    console.log(`User index updated `);
    return result;
  } catch (error) {
    console.error(`Error updating user index: ${error}`);
    throw error;
  }
}

  export async function createUserIndex() {
  console.log("Starting unified user embeddings creation...");
  const client = await clientPromise;
  const db = client.db("wwah");
  const userEmbeddingsCollection = db.collection("user_embeddings");
  
  // Optional: Clear existing embeddings if doing a full rebuild
  // await userEmbeddingsCollection.deleteMany({});
  
  // Define your user-specific collections
  const userSpecificCollections = ["userdbs", "successchances"];
  
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  // Process each collection
  for (const collectionName of userSpecificCollections) {
    console.log(`Processing user collection: ${collectionName}`);
    const sourceCollection = db.collection(collectionName);
    
    // Get all documents (for all users)
    const documents = await sourceCollection.find({}).toArray();
    
    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      // Extract text from documents
      const textsToEmbed = batch.map((doc) => {
        const textContent =
          doc.description ||
          doc.content ||
          doc.text ||
          doc.info ||
          (typeof doc === "object" ? JSON.stringify(doc) : String(doc));
        return textContent;
      });
      
      // Generate embeddings
      const embeddingResults = await embeddings.embedDocuments(textsToEmbed);
      
      // Create user-specific documents
      const userDocs = batch.map((doc, idx) => ({
        text: textsToEmbed[idx],
        embedding: embeddingResults[idx],
        userId: doc.userId, // Tag with original user ID
        sourceCollection: collectionName,
        originalId: doc._id.toString(),
        metadata: {
          title: doc.title || doc.name || doc.id || "Untitled",
          ...doc,
        },
        createdAt: new Date(),
      }));
      
      // Insert into unified collection
      if (userDocs.length > 0) {
        await userEmbeddingsCollection.insertMany(userDocs);
      }
    }
    
    console.log(`Processed ${documents.length} documents from ${collectionName}`);
  }
  
  console.log("User embeddings creation complete");
  return {
    success: true,
    documentCount: await userEmbeddingsCollection.countDocuments(),
  };
}