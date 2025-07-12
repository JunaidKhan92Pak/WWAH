// // import clientPromise from "@/lib/mongodb";
// // import { OpenAIEmbeddings } from "@langchain/openai";

// // export async function createMetaIndex() {
// //   console.log("Starting meta-index creation...");
// //   const client = await clientPromise;
// //   const db = client.db("ragchatbot");
// //   const metaCollection = db.collection("meta_embeddings");

// //   // Define your source collections
// //   const sourceCollections = ["collection1", "collection2", "collection3"];
// //   const embeddings = new OpenAIEmbeddings({
// //     modelName: "text-embedding-3-small",
// //   });

// //   // Process each collection
// //   for (const collectionName of sourceCollections) {
// //     console.log(`Processing collection: ${collectionName}`);
// //     const sourceCollection = db.collection(collectionName);
// //     const documents = await sourceCollection.find({}).toArray();

// //     // Process in batches to avoid memory issues
// //     const batchSize = 100;
// //     for (let i = 0; i < documents.length; i += batchSize) {
// //       const batch = documents.slice(i, i + batchSize);
// //       console.log(
// //         `Processing batch ${i / batchSize + 1} of ${Math.ceil(
// //           documents.length / batchSize
// //         )}`
// //       );

// //       // Extract text from documents (adapt this to your document structure)
// //       const textsToEmbed = batch.map((doc) => doc.content || doc.text);

// //       // Generate embeddings
// //       const embeddingResults = await embeddings.embedDocuments(textsToEmbed);

// //       // Create meta documents
// //       const metaDocs = batch.map((doc, idx) => ({
// //         text: doc.content || doc.text,
// //         embedding: embeddingResults[idx],
// //         sourceCollection: collectionName,
// //         originalId: doc._id.toString(),
// //         metadata: doc.metadata || {},
// //         createdAt: new Date(),
// //       }));

// //       // Insert into meta collection
// //       await metaCollection.insertMany(metaDocs);
// //     }

// //     console.log(
// //       `Processed ${documents.length} documents from ${collectionName}`
// //     );
// //   }

// //   console.log("Meta-index creation complete!");
// //   return {
// //     success: true,
// //     documentCount: await metaCollection.countDocuments(),
// //   };
// // }
// //v2
// // import { OpenAIEmbeddings } from "@langchain/openai";
// // import clientPromise from "../mongodb";

// // export async function createMetaIndex() {

// //   console.log("Starting meta-index creation...");
// //   const client = await clientPromise;
// //   const db = client.db(); // Your database name from the screenshot
// //   const metaCollection = db.collection("meta_embeddings");
// //   const databases = await client.db().admin().listDatabases();
// //   console.log("Available databases:", databases);
// //   // Define your source collections based on your actual collections
// //   const sourceCollections = [
// //     "academicinfos",
// //     "applicationinfos",
// //     "basicinfos",
// //     "languageproficiencies",
// //     "universities",
// //     "userdbs",
// //     "userpreferences",
// //     "workexperiences",
// //     "documents",
// //   ];

// //   const embeddings = new OpenAIEmbeddings({
// //     modelName: "text-embedding-3-small",
// //   });

// //   // Process each collection
// //   for (const collectionName of sourceCollections) {
// //     console.log(`Processing collection: ${collectionName}`);
// //     const sourceCollection = db.collection(collectionName);
// //     const documents = await sourceCollection.find({}).toArray();

// //     // Process in batches to avoid memory issues
// //     const batchSize = 50; // Smaller batch for safety
// //     for (let i = 0; i < documents.length; i += batchSize) {
// //       const batch = documents.slice(i, i + batchSize);
// //       console.log(
// //         `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
// //           documents.length / batchSize
// //         )} in ${collectionName}`
// //       );

// //       // Extract text from documents - adapt field names based on your schema
// //       const textsToEmbed = batch.map((doc) => {
// //         // Look for common text fields - adjust based on your actual document structure
// //         const textContent =
// //           doc.description ||
// //           doc.content ||
// //           doc.text ||
// //           doc.info ||
// //           (typeof doc === "object" ? JSON.stringify(doc) : String(doc));
// //         return textContent;
// //       });

// //       // Generate embeddings
// //       const embeddingResults = await embeddings.embedDocuments(textsToEmbed);

// //       // Create meta documents
// //       const metaDocs = batch.map((doc, idx) => ({
// //         text: textsToEmbed[idx],
// //         embedding: embeddingResults[idx],
// //         sourceCollection: collectionName,
// //         originalId: doc._id.toString(),
// //         metadata: {
// //           // Add any useful fields for retrieval context
// //           title: doc.title || doc.name || doc.id || "Untitled",
// //           // Add additional metadata fields that might be useful
// //           ...doc,
// //         },
// //         createdAt: new Date(),
// //       }));

// //       // Insert into meta collection
// //       await metaCollection.insertMany(metaDocs);
// //     }

// //     console.log(
// //       `Processed ${documents.length} documents from ${collectionName}`
// //     );
// //   }

// //   console.log("Meta-index creation complete!");
// //   return {
// //     success: true,
// //     documentCount: await metaCollection.countDocuments(),
// //   };
// // }
// // v3
// // /utils/meta-indexedDB.ts
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
//     "countries",
//     "universities",
//     "courses",
//     "expenses",
//     "scholarships",
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
//         let textContent = "";

//         // Create different text content based on collection type
//         if (collectionName === "universities") {
//           textContent = `country_name: ${doc.country_name || ""}\n`;
//           textContent += `university_name: ${doc.university_name || ""}\n`;
//           textContent += `location: ${doc.location || ""}\n`;
//           textContent += `university_video: ${doc.university_video || ""}\n`;
//           textContent += `virtual_tour: ${doc.virtual_tour || ""}\n`;
//           textContent += `establishment_year: ${
//             doc.establishment_year || ""
//           }\n`;
//           textContent += `national_students: ${doc.national_students || ""}\n`;
//           textContent += `international_students: ${
//             doc.international_students || ""
//           }\n`;
//           textContent += `acceptance_rate: ${doc.acceptance_rate || ""}\n`;
//           textContent += `distance_from_city: ${doc.distance_from_city || ""}\n`;
//           textContent += `qs_world_university_ranking: ${
//             doc.qs_world_university_ranking || ""
//           }\n`;
//           textContent += `times_higher_education_ranking: ${
//             doc.times_higher_education_ranking || ""
//           }\n`;
//           textContent += `overview: ${doc.overview || ""}\n`;
//           textContent += `origin_and_establishment: ${
//             doc.origin_and_establishment || ""
//           }\n`;
//           textContent += `modern_day_development: ${
//             doc.modern_day_development || ""
//           }\n`;
//           textContent += `our_mission: ${doc.our_mission || ""}\n`;
//           textContent += `Location: ${JSON.stringify(doc.our_values || [])}\n`;
//           textContent += `Description: ${JSON.stringify(doc.ranking || [])}\n`;
//           textContent += `notable_alumni: ${JSON.stringify(
//             doc.notable_alumni || []
//           )}\n`;
//           textContent += `Location: ${JSON.stringify(
//             doc.key_achievements || []
//           )}\n`;
//           textContent += `Description: ${JSON.stringify(
//             doc.campus_life || {}
//           )}\n`;
//           textContent += `about_city: ${JSON.stringify(
//             doc.about_city || {}
//           )}\n`;
//           // Add other relevant fields
//         } else if (collectionName === "countries") {
//           textContent = `Country: ${doc.country_name || ""}\n`;
//           textContent += `Capital: ${doc.capital || ""}\n`;
//           textContent += `language: ${doc.language || ""}\n`;
//           textContent += `population: ${doc.population || ""}\n`;
//           textContent += `currency: ${doc.currency || ""}\n`;
//           textContent += `International Students: ${
//             doc.international_students || ""
//           }\n`;
//           textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;
//           textContent += `Dialing Code: ${doc.dialing_code || ""}\n`;
//           textContent += `GDP: ${doc.gdp || ""}\n`;
//           textContent += `why_study: ${doc.why_study || ""}\n`;
//           textContent += `work_while_studying: ${
//             doc.work_while_studying || ""
//           }\n`;
//           textContent += `work_after_study: ${doc.work_after_study || ""}\n`;
//           textContent += `residency: ${JSON.stringify(doc.residency || [])}\n`;
//           textContent += `popular_programs: ${JSON.stringify(
//             doc.popular_programs || []
//           )}\n`;
//           textContent += `rent: ${doc.rent || ""}\n`;
//           textContent += `groceries: ${doc.groceries || ""}\n`;
//           textContent += `transportation: ${doc.transportation || ""}\n`;
//           textContent += `healthcare: ${doc.healthcare || ""}\n`;
//           textContent += `eating_out: ${doc.eating_out || ""}\n`;
//           textContent += `household_bills: ${doc.household_bills || ""}\n`;
//           textContent += `miscellaneous: ${doc.miscellaneous || ""}\n`;
//           textContent += `health: ${JSON.stringify(doc.health || [])}\n`;
//           textContent += `scholarships: ${JSON.stringify(
//             doc.scholarships || []
//           )}\n`;
//           // Add other relevant fields
//         } else if (collectionName === "scholarships") {
//           textContent = `hostCountry: ${doc.hostCountry || ""}\n`;
//           textContent += `name: ${doc.name || ""}\n`;
//           textContent += `applicableDepartments: ${JSON.stringify(
//             doc.applicableDepartments || []
//           )}\n`;
//           textContent += `benefits: ${JSON.stringify(doc.benefits || [])}\n`;
//           textContent += `deadline: ${doc.deadline || ""}\n`;
//           textContent += `duration: ${doc.duration || ""}\n`;
//           textContent += `eligibilityCriteria: ${JSON.stringify(
//             doc.eligibilityCriteria || []
//           )}\n`;
//           textContent += `minimumRequirements: ${
//             doc.minimumRequirements || ""
//           }\n`;
//           textContent += `numberOfScholarships: ${
//             doc.numberOfScholarships || ""
//           }\n`;
//           textContent += `overview: ${doc.overview || ""}\n`;
//           textContent += `programs: ${JSON.stringify(doc.programs || [])}\n`;
//           textContent += `requiredDocuments: ${JSON.stringify(
//             doc.requiredDocuments || []
//           )}\n`;
//           textContent += `successChances: ${JSON.stringify(
//             doc.successChances || {}
//           )}\n`;
//           textContent += `type: ${doc.type || ""}\n`;
//         } else if (collectionName === "courses") {
//           textContent = `course_link: ${doc.course_link || ""}\n`;
//           textContent += `universityname: ${doc.universityname || ""}\n`;
//           textContent += `countryname: ${doc.countryname || ""}\n`;
//           textContent += `annual_tuition_fee: ${JSON.stringify(
//             doc.annual_tuition_fee || {}
//           )}\n`;
//           textContent += `application_fee: ${doc.application_fee || ""}\n`;
//           textContent += `career_opportunity_1: ${
//             doc.career_opportunity_1 || ""
//           }\n`;
//           textContent += `career_opportunity_2: ${
//             doc.career_opportunity_2 || ""
//           }\n`;
//           textContent += `career_opportunity_3: ${
//             doc.career_opportunity_3 || ""
//           }\n`;
//           textContent += `career_opportunity_4: ${
//             doc.career_opportunity_4 || ""
//           }\n`;
//           textContent += `career_opportunity_5: ${
//             doc.career_opportunity_5 || ""
//           }\n`;
//           textContent += `city: ${doc.city || ""}\n`;
//           textContent += `course_level: ${doc.course_level || ""}\n`;
//           textContent += `course_structure: ${JSON.stringify(
//             doc.course_structure || []
//           )}\n`;
//           textContent += `course_title: ${JSON.stringify(
//             doc.course_title || []
//           )}\n`;
//           textContent += `degree_format: ${doc.degree_format || ""}\n`;
//           textContent += `duration: ${doc.duration || ""}\n`;
//           textContent += `education_level: ${doc.education_level || ""}\n`;
//           textContent += `entry_requirements: ${doc.entry_requirements || ""}\n`;
//           textContent += `funding_link: ${doc.funding_link || ""}\n`;
//           textContent += `initial_deposit: ${doc.initial_deposit || ""}\n`;
//           // Add other relevant fields
//         } else if (collectionName === "expenses") {
//           textContent = `country_name: ${doc.country_name || ""}\n`;
//           textContent += `university_name: ${doc.university_name || ""}\n`;
//           textContent += `lifestyles: ${JSON.stringify(
//             doc.lifestyles || []
//           )}\n`;
//         } else {
//           // Default case - extract only safe fields
//           textContent =
//             doc.description ||
//             doc.content ||
//             doc.text ||
//             `${
//               doc.title ||
//               doc.name ||
//               doc.country_name ||
//               doc.university_name ||
//               doc.course_title ||
//               "Untitled"
//             } document`;

//           // Avoid using full JSON representations for collections not explicitly handled
//           if (textContent.trim() === "") {
//             textContent = `${
//               doc.title ||
//               doc.name ||
//               doc.country_name ||
//               doc.university_name ||
//               doc.course_title ||
//               "Untitled"
//             } document`;
//           }
//         }

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
//           title:
//             doc.title ||
//             doc.name ||
//             doc.country_name ||
//             doc.university_name ||
//             doc.course_title ||
//             "Untitled",
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
// // Add this to your meta-index.ts file or create a new utility file
// export async function updateUserIndex(userId: string) {
//   if (!userId) return;

//   try {
//     // First, delete any existing entries for this user
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     await db.collection("user_embeddings").deleteMany({ userId: userId });

//     // Then recreate the index for this user
//     const result = await createUserIndex();
//     console.log(`User index updated `);
//     return result;
//   } catch (error) {
//     console.error(`Error updating user index: ${error}`);
//     throw error;
//   }
// }

// export async function createUserIndex() {
//   console.log("Starting unified user embeddings creation...");
//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const userEmbeddingsCollection = db.collection("user_embeddings");

//   // Optional: Clear existing embeddings if doing a full rebuild
//   // await userEmbeddingsCollection.deleteMany({});

//   // Define your user-specific collections
//   const userSpecificCollections = ["userdbs", "successchances"];

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   // Process each collection
//   for (const collectionName of userSpecificCollections) {
//     console.log(`Processing user collection: ${collectionName}`);
//     const sourceCollection = db.collection(collectionName);

//     // Get all documents (for all users)
//     const documents = await sourceCollection.find({}).toArray();

//     // Process in batches
//     const batchSize = 50;
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);

//       // Extract text from documents
//       const textsToEmbed = batch.map((doc) => {
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

//       // Create user-specific documents
//       const userDocs = batch.map((doc, idx) => ({
//         text: textsToEmbed[idx],
//         embedding: embeddingResults[idx],
//         userId: doc.userId, // Tag with original user ID
//         sourceCollection: collectionName,
//         originalId: doc._id.toString(),
//         metadata: {
//           title: doc.title || doc.name || doc.id || "Untitled",
//           ...doc,
//         },
//         createdAt: new Date(),
//       }));

//       // Insert into unified collection
//       if (userDocs.length > 0) {
//         await userEmbeddingsCollection.insertMany(userDocs);
//       }
//     }

//     console.log(
//       `Processed ${documents.length} documents from ${collectionName}`
//     );
//   }

//   console.log("User embeddings creation complete");
//   return {
//     success: true,
//     documentCount: await userEmbeddingsCollection.countDocuments(),
//   };
// }
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
// /utils/meta-index.ts
// import { OpenAIEmbeddings } from "@langchain/openai";
// import clientPromise from "../mongodb";

// // Helper function to estimate token count (rough approximation)
// function estimateTokenCount(text: string): number {
//   // Rough estimate: 1 token ≈ 4 characters
//   return Math.ceil(text.length / 4);
// }

// // Helper function to truncate text while preserving important information
// function truncateText(text: string, maxTokens: number = 2000): string {
//   const maxChars = maxTokens * 4;
//   if (text.length <= maxChars) return text;

//   // Try to truncate at sentence boundaries
//   const sentences = text.split(/[.!?]+/);
//   let result = "";

//   for (const sentence of sentences) {
//     if ((result + sentence).length > maxChars) break;
//     result += sentence + ". ";
//   }

//   return result.trim() || text.substring(0, maxChars);
// }

// // Helper function to create multiple embeddings for large documents
// async function createChunkedEmbeddings(
//   doc: any,
//   collectionName: string,
//   embeddings: OpenAIEmbeddings
// ) {
//   const chunks: Array<{
//     text: string;
//     embedding: number[];
//     chunkIndex: number;
//     totalChunks: number;
//   }> = [];

//   let textContent = createTextContent(doc, collectionName);
//   const maxTokensPerChunk = 2000; // Conservative limit

//   // If text is small enough, return single chunk
//   if (estimateTokenCount(textContent) <= maxTokensPerChunk) {
//     const embedding = await embeddings.embedQuery(textContent);
//     return [
//       {
//         text: textContent,
//         embedding,
//         chunkIndex: 0,
//         totalChunks: 1,
//       },
//     ];
//   }

//   // Split large documents into chunks
//   const sections = textContent.split("\n").filter((line) => line.trim());
//   let currentChunk = "";
//   let chunkIndex = 0;

//   for (const section of sections) {
//     const potentialChunk = currentChunk + section + "\n";

//     if (
//       estimateTokenCount(potentialChunk) > maxTokensPerChunk &&
//       currentChunk
//     ) {
//       // Process current chunk
//       const embedding = await embeddings.embedQuery(currentChunk.trim());
//       chunks.push({
//         text: currentChunk.trim(),
//         embedding,
//         chunkIndex,
//         totalChunks: 0, // Will be set later
//       });

//       currentChunk = section + "\n";
//       chunkIndex++;
//     } else {
//       currentChunk = potentialChunk;
//     }
//   }

//   // Process final chunk
//   if (currentChunk.trim()) {
//     const embedding = await embeddings.embedQuery(currentChunk.trim());
//     chunks.push({
//       text: currentChunk.trim(),
//       embedding,
//       chunkIndex,
//       totalChunks: 0,
//     });
//   }

//   // Update totalChunks for all chunks
//   chunks.forEach((chunk) => (chunk.totalChunks = chunks.length));

//   return chunks;
// }

// function createTextContent(doc: any, collectionName: string): string {
//   let textContent = "";

//   if (collectionName === "universities") {
//     // Primary fields first (most important for search)
//     textContent += `University: ${doc.university_name || ""}\n`;
//     textContent += `Country: ${doc.country_name || ""}\n`;
//     textContent += `Location: ${doc.location || ""}\n`;
//     textContent += `Ranking: QS ${
//       doc.qs_world_university_ranking || "N/A"
//     }, THE ${doc.times_higher_education_ranking || "N/A"}\n`;

//     // Overview and mission (truncated if too long)
//     if (doc.overview) {
//       textContent += `Overview: ${truncateText(doc.overview, 500)}\n`;
//     }
//     if (doc.our_mission) {
//       textContent += `Mission: ${truncateText(doc.our_mission, 300)}\n`;
//     }

//     // Key stats
//     textContent += `Established: ${doc.establishment_year || ""}\n`;
//     textContent += `Students: ${doc.national_students || ""} national, ${
//       doc.international_students || ""
//     } international\n`;
//     textContent += `Acceptance Rate: ${doc.acceptance_rate || ""}\n`;
//     textContent += `Distance from City: ${doc.distance_from_city || ""}\n`;

//     // Structured data (summarized)
//     if (doc.our_values && Array.isArray(doc.our_values)) {
//       textContent += `Values: ${doc.our_values.slice(0, 3).join(", ")}\n`;
//     }
//     if (doc.notable_alumni && Array.isArray(doc.notable_alumni)) {
//       textContent += `Notable Alumni: ${doc.notable_alumni
//         .slice(0, 5)
//         .join(", ")}\n`;
//     }
//     if (doc.key_achievements && Array.isArray(doc.key_achievements)) {
//       textContent += `Achievements: ${doc.key_achievements
//         .slice(0, 3)
//         .join(", ")}\n`;
//     }

//     // Campus and city info (truncated)
//     if (doc.campus_life && typeof doc.campus_life === "object") {
//       const campusInfo = Object.entries(doc.campus_life)
//         .slice(0, 3)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(", ");
//       textContent += `Campus Life: ${campusInfo}\n`;
//     }

//     if (doc.about_city && typeof doc.about_city === "object") {
//       const cityInfo = Object.entries(doc.about_city)
//         .slice(0, 3)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(", ");
//       textContent += `About City: ${cityInfo}\n`;
//     }

//     // Additional fields
//     textContent += `Video: ${doc.university_video || ""}\n`;
//     textContent += `Virtual Tour: ${doc.virtual_tour || ""}\n`;

//     // Historical info (truncated)
//     if (doc.origin_and_establishment) {
//       textContent += `History: ${truncateText(
//         doc.origin_and_establishment,
//         200
//       )}\n`;
//     }
//     if (doc.modern_day_development) {
//       textContent += `Development: ${truncateText(
//         doc.modern_day_development,
//         200
//       )}\n`;
//     }
//   } else if (collectionName === "countries") {
//     textContent += `Country: ${doc.country_name || ""}\n`;
//     textContent += `Capital: ${doc.capital || ""}\n`;
//     textContent += `Language: ${doc.language || ""}\n`;
//     textContent += `Population: ${doc.population || ""}\n`;
//     textContent += `Currency: ${doc.currency || ""}\n`;
//     textContent += `GDP: ${doc.gdp || ""}\n`;
//     textContent += `International Students: ${
//       doc.international_students || ""
//     }\n`;
//     textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;
//     textContent += `Dialing Code: ${doc.dialing_code || ""}\n`;

//     // Why study section (truncated)
//     if (doc.why_study) {
//       textContent += `Why Study: ${truncateText(doc.why_study, 400)}\n`;
//     }

//     textContent += `Work While Studying: ${doc.work_while_studying || ""}\n`;
//     textContent += `Work After Study: ${doc.work_after_study || ""}\n`;

//     // Living costs
//     textContent += `Living Costs - Rent: ${doc.rent || ""}, Groceries: ${
//       doc.groceries || ""
//     }, Transport: ${doc.transportation || ""}\n`;
//     textContent += `Healthcare: ${doc.healthcare || ""}, Eating Out: ${
//       doc.eating_out || ""
//     }\n`;
//     textContent += `Bills: ${doc.household_bills || ""}, Miscellaneous: ${
//       doc.miscellaneous || ""
//     }\n`;

//     // Arrays (summarized)
//     if (doc.residency && Array.isArray(doc.residency)) {
//       textContent += `Residency Options: ${doc.residency
//         .slice(0, 5)
//         .join(", ")}\n`;
//     }
//     if (doc.popular_programs && Array.isArray(doc.popular_programs)) {
//       textContent += `Popular Programs: ${doc.popular_programs
//         .slice(0, 10)
//         .join(", ")}\n`;
//     }
//     if (doc.health && Array.isArray(doc.health)) {
//       textContent += `Health Info: ${doc.health.slice(0, 3).join(", ")}\n`;
//     }
//     if (doc.scholarships && Array.isArray(doc.scholarships)) {
//       textContent += `Scholarships: ${doc.scholarships
//         .slice(0, 5)
//         .join(", ")}\n`;
//     }
//   } else if (collectionName === "scholarships") {
//     textContent += `Scholarship: ${doc.name || ""}\n`;
//     textContent += `Host Country: ${doc.hostCountry || ""}\n`;
//     textContent += `Type: ${doc.type || ""}\n`;
//     textContent += `Duration: ${doc.duration || ""}\n`;
//     textContent += `Deadline: ${doc.deadline || ""}\n`;
//     textContent += `Number of Scholarships: ${
//       doc.numberOfScholarships || ""
//     }\n`;
//     textContent += `Minimum Requirements: ${doc.minimumRequirements || ""}\n`;

//     if (doc.overview) {
//       textContent += `Overview: ${truncateText(doc.overview, 400)}\n`;
//     }

//     if (doc.applicableDepartments && Array.isArray(doc.applicableDepartments)) {
//       textContent += `Departments: ${doc.applicableDepartments
//         .slice(0, 10)
//         .join(", ")}\n`;
//     }
//     if (doc.benefits && Array.isArray(doc.benefits)) {
//       textContent += `Benefits: ${doc.benefits.slice(0, 5).join(", ")}\n`;
//     }
//     if (doc.eligibilityCriteria && Array.isArray(doc.eligibilityCriteria)) {
//       textContent += `Eligibility: ${doc.eligibilityCriteria
//         .slice(0, 5)
//         .join(", ")}\n`;
//     }
//     if (doc.programs && Array.isArray(doc.programs)) {
//       textContent += `Programs: ${doc.programs.slice(0, 10).join(", ")}\n`;
//     }
//     if (doc.requiredDocuments && Array.isArray(doc.requiredDocuments)) {
//       textContent += `Required Documents: ${doc.requiredDocuments
//         .slice(0, 8)
//         .join(", ")}\n`;
//     }

//     if (doc.successChances && typeof doc.successChances === "object") {
//       const chances = Object.entries(doc.successChances)
//         .slice(0, 3)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(", ");
//       textContent += `Success Chances: ${chances}\n`;
//     }
//   } else if (collectionName === "courses") {
//     textContent += `Course: ${
//       Array.isArray(doc.course_title)
//         ? doc.course_title.join(", ")
//         : doc.course_title || ""
//     }\n`;
//     textContent += `University: ${doc.universityname || ""}\n`;
//     textContent += `Country: ${doc.countryname || ""}\n`;
//     textContent += `City: ${doc.city || ""}\n`;
//     textContent += `Level: ${doc.course_level || ""}\n`;
//     textContent += `Education Level: ${doc.education_level || ""}\n`;
//     textContent += `Duration: ${doc.duration || ""}\n`;
//     textContent += `Degree Format: ${doc.degree_format || ""}\n`;
//     textContent += `Application Fee: ${doc.application_fee || ""}\n`;
//     textContent += `Initial Deposit: ${doc.initial_deposit || ""}\n`;

//     if (doc.annual_tuition_fee && typeof doc.annual_tuition_fee === "object") {
//       const fees = Object.entries(doc.annual_tuition_fee)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(", ");
//       textContent += `Annual Tuition: ${fees}\n`;
//     }

//     if (doc.entry_requirements) {
//       textContent += `Entry Requirements: ${truncateText(
//         doc.entry_requirements,
//         300
//       )}\n`;
//     }

//     // Career opportunities
//     const careers = [
//       doc.career_opportunity_1,
//       doc.career_opportunity_2,
//       doc.career_opportunity_3,
//       doc.career_opportunity_4,
//       doc.career_opportunity_5,
//     ].filter(Boolean);
//     if (careers.length > 0) {
//       textContent += `Career Opportunities: ${careers.join(", ")}\n`;
//     }

//     if (doc.course_structure && Array.isArray(doc.course_structure)) {
//       textContent += `Course Structure: ${doc.course_structure
//         .slice(0, 5)
//         .join(", ")}\n`;
//     }

//     textContent += `Course Link: ${doc.course_link || ""}\n`;
//     textContent += `Funding Link: ${doc.funding_link || ""}\n`;
//   } else if (collectionName === "expenses") {
//     textContent += `Country: ${doc.country_name || ""}\n`;
//     textContent += `University: ${doc.university_name || ""}\n`;

//     if (doc.lifestyles && Array.isArray(doc.lifestyles)) {
//       const lifestyleInfo = doc.lifestyles
//         .map((lifestyle) => {
//           if (typeof lifestyle === "object") {
//             return Object.entries(lifestyle)
//               .slice(0, 5)
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//           }
//           return lifestyle;
//         })
//         .join(" | ");
//       textContent += `Lifestyles: ${lifestyleInfo}\n`;
//     }
//   } else {
//     // Default case - extract safe fields
//     textContent =
//       doc.description ||
//       doc.content ||
//       doc.text ||
//       `${
//         doc.title ||
//         doc.name ||
//         doc.country_name ||
//         doc.university_name ||
//         doc.course_title ||
//         "Untitled"
//       } document`;
//   }

//   return textContent;
// }

// export async function createMetaIndex() {
//   console.log("Starting meta-index creation...");
//   const client = await clientPromise;
//   const db = client.db();
//   const metaCollection = db.collection("meta_embeddings");
//   const databases = await client.db().admin().listDatabases();
//   console.log("Available databases:", databases);

//   // Clear existing meta-index
//   await metaCollection.deleteMany({});

//   const sourceCollections = [
//     "countries",
//     "universities",
//     "courses",
//     "expenses",
//     "scholarships",
//   ];

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   let totalProcessed = 0;

//   // Process each collection
//   for (const collectionName of sourceCollections) {
//     console.log(`Processing collection: ${collectionName}`);
//     const sourceCollection = db.collection(collectionName);
//     const documents = await sourceCollection.find({}).toArray();

//     // Process documents one by one to avoid token limits
//     for (let i = 0; i < documents.length; i++) {
//       const doc = documents[i];
//       console.log(
//         `Processing document ${i + 1}/${
//           documents.length
//         } from ${collectionName}`
//       );

//       try {
//         // Create chunked embeddings for this document
//         const chunks = await createChunkedEmbeddings(
//           doc,
//           collectionName,
//           embeddings
//         );

//         // Create meta documents for each chunk
//         const metaDocs = chunks.map((chunk, chunkIdx) => ({
//           text: chunk.text,
//           embedding: chunk.embedding,
//           sourceCollection: collectionName,
//           originalId: doc._id.toString(),
//           chunkIndex: chunk.chunkIndex,
//           totalChunks: chunk.totalChunks,
//           isChunked: chunk.totalChunks > 1,
//           metadata: {
//             title:
//               doc.title ||
//               doc.name ||
//               doc.country_name ||
//               doc.university_name ||
//               (Array.isArray(doc.course_title)
//                 ? doc.course_title.join(", ")
//                 : doc.course_title) ||
//               "Untitled",
//             // Store original document reference
//             originalDoc: doc,
//           },
//           createdAt: new Date(),
//         }));

//         // Insert chunks for this document
//         if (metaDocs.length > 0) {
//           await metaCollection.insertMany(metaDocs);
//           totalProcessed += metaDocs.length;
//         }

//         // Small delay to avoid rate limiting
//         if (i % 10 === 0) {
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//       } catch (error) {
//         console.error(
//           `Error processing document ${i + 1} from ${collectionName}:`,
//           error
//         );
//         // Continue with next document
//         continue;
//       }
//     }

//     console.log(
//       `Completed processing ${documents.length} documents from ${collectionName}`
//     );
//   }

//   console.log("Meta-index creation complete!");
//   console.log(`Total embeddings created: ${totalProcessed}`);

//   return {
//     success: true,
//     documentCount: await metaCollection.countDocuments(),
//     totalEmbeddings: totalProcessed,
//   };
// }

// // Enhanced user index creation with similar optimizations
// export async function createUserIndex() {
//   console.log("Starting unified user embeddings creation...");
//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const userEmbeddingsCollection = db.collection("user_embeddings");

//   const userSpecificCollections = ["userdbs", "successchances"];

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   let totalProcessed = 0;

//   // Process each collection
//   for (const collectionName of userSpecificCollections) {
//     console.log(`Processing user collection: ${collectionName}`);
//     const sourceCollection = db.collection(collectionName);
//     const documents = await sourceCollection.find({}).toArray();

//     // Process documents individually
//     for (let i = 0; i < documents.length; i++) {
//       const doc = documents[i];

//       try {
//         // Create text content
//         let textContent =
//           doc.description ||
//           doc.content ||
//           doc.text ||
//           doc.info ||
//           (typeof doc === "object" ? JSON.stringify(doc) : String(doc));

//         // Truncate if too long
//         textContent = truncateText(textContent, 2000);

//         // Generate embedding
//         const embedding = await embeddings.embedQuery(textContent);

//         // Create user document
//         const userDoc = {
//           text: textContent,
//           embedding: embedding,
//           userId: doc.userId,
//           sourceCollection: collectionName,
//           originalId: doc._id.toString(),
//           metadata: {
//             title: doc.title || doc.name || doc.id || "Untitled",
//             originalDoc: doc,
//           },
//           createdAt: new Date(),
//         };

//         // Insert document
//         await userEmbeddingsCollection.insertOne(userDoc);
//         totalProcessed++;

//         // Small delay to avoid rate limiting
//         if (i % 10 === 0) {
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//       } catch (error) {
//         console.error(`Error processing user document ${i + 1}:`, error);
//         continue;
//       }
//     }

//     console.log(
//       `Processed ${documents.length} documents from ${collectionName}`
//     );
//   }

//   console.log("User embeddings creation complete");
//   console.log(`Total user embeddings created: ${totalProcessed}`);

//   return {
//     success: true,
//     documentCount: await userEmbeddingsCollection.countDocuments(),
//     totalEmbeddings: totalProcessed,
//   };
// }

// // Update user index function
// export async function updateUserIndex(userId: string) {
//   if (!userId) return;

//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     await db.collection("user_embeddings").deleteMany({ userId: userId });

//     const result = await createUserIndex();
//     console.log(`User index updated`);
//     return result;
//   } catch (error) {
//     console.error(`Error updating user index: ${error}`);
//     throw error;
//   }
// }

// utils/meta-index.ts
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import clientPromise from "../mongodb";

// Collection configuration with enhanced metadata support
const COLLECTION_CONFIG = {
  countries: {
    name: "country_embeddings",
    indexName: "country_vector_index",
    priority: 0.3,
    searchableFields: ["country", "capital", "language", "currency"],
  },
  universities: {
    name: "university_embeddings",
    indexName: "university_vector_index",
    priority: 0.4,
    searchableFields: [
      "title",
      "country",
      "location",
      "ranking.qs",
      "ranking.the",
    ],
  },
  courses: {
    name: "course_embeddings",
    indexName: "course_vector_index",
    priority: 0.3,
    searchableFields: ["title", "country", "degree", "subject", "university"],
  },
  scholarships: {
    name: "scholarship_embeddings",
    indexName: "scholarship_vector_index",
    priority: 0.2,
    searchableFields: ["title", "country", "type", "duration"],
  },
  expenses: {
    name: "expense_embeddings",
    indexName: "expense_vector_index",
    priority: 0.1,
    searchableFields: ["country", "university"],
  },
};

// Enhanced search options interface
interface SearchOptions {
  filter?: Record<string, unknown>;
  limit?: number;
  includeMetadata?: boolean;
  similarityThreshold?: number;
}

// Enhanced search result interface
interface SearchResult {
  pageContent: string;
  metadata: Record<string, unknown>;
  score?: number;
  domain: string;
}

// Vector store instances cache
const vectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();
const userVectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();

// Initialize embeddings instance
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});

// Enhanced vector store creation with metadata support
export async function getDomainVectorStore(
  domain: keyof typeof COLLECTION_CONFIG
) {
  const cacheKey = `domain_${domain}`;
  if (vectorStoreCache.has(cacheKey)) {
    return vectorStoreCache.get(cacheKey)!;
  }

  const client = await clientPromise;
  const db = client.db("wwah");
  const config = COLLECTION_CONFIG[domain];
  const collection = db.collection(config.name);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: config.indexName,
    textKey: "text",
    embeddingKey: "embedding",
    // Note: metadataKey might not be supported in your version of @langchain/mongodb
    // If you need metadata support, you may need to handle it differently
  });

  vectorStoreCache.set(cacheKey, vectorStore);
  return vectorStore;
}

// Enhanced user vector store with caching
export async function getUserVectorStore(userId: string) {
  if (!userId) return null;

  const cacheKey = `user_${userId}`;
  if (userVectorStoreCache.has(cacheKey)) {
    return userVectorStoreCache.get(cacheKey)!;
  }

  const client = await clientPromise; // Fixed: was PromiseSend
  const db = client.db("wwah");
  const collection = db.collection("user_embeddings");

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "user_vector_index",
    textKey: "text",
    embeddingKey: "embedding",
    // Note: metadataKey might not be supported in your version of @langchain/mongodb
  });

  userVectorStoreCache.set(cacheKey, vectorStore);
  return vectorStore;
}

// NEW: Enhanced search with metadata filtering
export async function searchWithMetadata(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  options: SearchOptions = {}
) {
  const vectorStore = await getDomainVectorStore(domain);
  const {
    filter = {},
    limit = 10,
    similarityThreshold = 0.7,
  } = options;

  try {
    // Perform similarity search with metadata filter
    const results = await vectorStore.similaritySearchWithScore(
      query,
      limit,
      filter
    );

    // Filter by similarity threshold and format results
    const filteredResults: SearchResult[] = results
      .filter(([, score]) => score >= similarityThreshold) // Fixed: removed unused parameter
      .map(([document, score]) => ({
        pageContent: document.pageContent,
        metadata: document.metadata,
        score,
        domain,
      }));

    return filteredResults;
  } catch (error) {
    console.error(`Error searching in ${domain}:`, error);
    return [];
  }
}

// NEW: Multi-domain search with metadata filtering
export async function searchMultipleDomains(
  query: string,
  domains: (keyof typeof COLLECTION_CONFIG)[],
  options: SearchOptions = {}
) {
  const searchPromises = domains.map(async (domain) => {
    const results = await searchWithMetadata(query, domain, options);
    return results.map((result) => ({ ...result, domain }));
  });

  const allResults = await Promise.all(searchPromises);
  return allResults.flat();
}

// NEW: Search courses with specific filters (example of enhanced functionality)
export async function searchCourses(
  query: string,
  filters: {
    country?: string;
    degree?: string;
    subject?: string;
    university?: string;
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  // Build MongoDB filter from the enhanced metadata fields
  if (filters.country) mongoFilter.country = filters.country;
  if (filters.degree) mongoFilter.degree = filters.degree;
  if (filters.subject)
    mongoFilter.subject = { $regex: filters.subject, $options: "i" };
  if (filters.university)
    mongoFilter.university = { $regex: filters.university, $options: "i" };

  return await searchWithMetadata(query, "courses", {
    ...options,
    filter: mongoFilter,
  });
}

// NEW: Search universities with specific filters
export async function searchUniversities(
  query: string,
  filters: {
    country?: string;
    location?: string;
    ranking?: { qs?: number; the?: number };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.country) mongoFilter.country = filters.country;
  if (filters.location)
    mongoFilter.location = { $regex: filters.location, $options: "i" };
  if (filters.ranking?.qs)
    mongoFilter["ranking.qs"] = { $lte: filters.ranking.qs };
  if (filters.ranking?.the)
    mongoFilter["ranking.the"] = { $lte: filters.ranking.the };

  return await searchWithMetadata(query, "universities", {
    ...options,
    filter: mongoFilter,
  });
}

// NEW: Search scholarships with specific filters
export async function searchScholarships(
  query: string,
  filters: {
    country?: string;
    type?: string;
    deadline?: string;
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.country) mongoFilter.country = filters.country;
  if (filters.type) mongoFilter.type = filters.type;
  if (filters.deadline) {
    // Example: search for scholarships with deadlines after a certain date
    mongoFilter.deadline = { $gte: filters.deadline };
  }

  return await searchWithMetadata(query, "scholarships", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced get all domain vector stores
export async function getAllDomainVectorStores() {
  const stores = await Promise.all(
    Object.keys(COLLECTION_CONFIG).map(async (domain) => ({
      domain,
      store: await getDomainVectorStore(
        domain as keyof typeof COLLECTION_CONFIG
      ),
      config: COLLECTION_CONFIG[domain as keyof typeof COLLECTION_CONFIG],
    }))
  );
  return stores;
}

// NEW: Get search statistics for a domain
export async function getDomainStats(domain: keyof typeof COLLECTION_CONFIG) {
  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection(COLLECTION_CONFIG[domain].name);

  const stats = {
    totalDocuments: await collection.countDocuments(),
    domain,
    collectionName: COLLECTION_CONFIG[domain].name,
    searchableFields: COLLECTION_CONFIG[domain].searchableFields,
  };

  return stats;
}

// NEW: Get aggregated search statistics
export async function getAllDomainStats() {
  const domains = Object.keys(
    COLLECTION_CONFIG
  ) as (keyof typeof COLLECTION_CONFIG)[];
  const statsPromises = domains.map(getDomainStats);
  const stats = await Promise.all(statsPromises);

  return {
    totalDocuments: stats.reduce((sum, stat) => sum + stat.totalDocuments, 0),
    domainStats: stats,
    lastUpdated: new Date().toISOString(),
  };
}

// Enhanced cache clearing functions
export function clearDomainCache(domain?: keyof typeof COLLECTION_CONFIG) {
  if (domain) {
    vectorStoreCache.delete(`domain_${domain}`);
  } else {
    // Clear all domain caches
    Object.keys(COLLECTION_CONFIG).forEach((d) => {
      vectorStoreCache.delete(`domain_${d}`);
    });
  }
}

export function clearUserCache(userId?: string) {
  if (userId) {
    userVectorStoreCache.delete(`user_${userId}`);
  } else {
    userVectorStoreCache.clear();
  }
}

// NEW: Clear all caches
export function clearAllCaches() {
  vectorStoreCache.clear();
  userVectorStoreCache.clear();
}

// Export configuration for external use
export { COLLECTION_CONFIG };
export type { SearchOptions, SearchResult };