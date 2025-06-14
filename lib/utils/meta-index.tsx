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
        let textContent = "";

        // Create different text content based on collection type
        if (collectionName === "universities") {
          textContent = `country_name: ${doc.country_name || ""}\n`;
          textContent += `university_name: ${doc.university_name || ""}\n`;
          textContent += `location: ${doc.location || ""}\n`;
          textContent += `university_video: ${doc.university_video || ""}\n`;
          textContent += `virtual_tour: ${doc.virtual_tour || ""}\n`;
          textContent += `establishment_year: ${
            doc.establishment_year || ""
          }\n`;
          textContent += `national_students: ${doc.national_students || ""}\n`;
          textContent += `international_students: ${
            doc.international_students || ""
          }\n`;
          textContent += `acceptance_rate: ${doc.acceptance_rate || ""}\n`;
          textContent += `distance_from_city: ${doc.distance_from_city || ""}\n`;
          textContent += `qs_world_university_ranking: ${
            doc.qs_world_university_ranking || ""
          }\n`;
          textContent += `times_higher_education_ranking: ${
            doc.times_higher_education_ranking || ""
          }\n`;
          textContent += `overview: ${doc.overview || ""}\n`;
          textContent += `origin_and_establishment: ${
            doc.origin_and_establishment || ""
          }\n`;
          textContent += `modern_day_development: ${
            doc.modern_day_development || ""
          }\n`;
          textContent += `our_mission: ${doc.our_mission || ""}\n`;
          textContent += `Location: ${JSON.stringify(doc.our_values || [])}\n`;
          textContent += `Description: ${JSON.stringify(doc.ranking || [])}\n`;
          textContent += `notable_alumni: ${JSON.stringify(
            doc.notable_alumni || []
          )}\n`;
          textContent += `Location: ${JSON.stringify(
            doc.key_achievements || []
          )}\n`;
          textContent += `Description: ${JSON.stringify(
            doc.campus_life || {}
          )}\n`;
          textContent += `about_city: ${JSON.stringify(
            doc.about_city || {}
          )}\n`;
          // Add other relevant fields
        } else if (collectionName === "countries") {
          textContent = `Country: ${doc.country_name || ""}\n`;
          textContent += `Capital: ${doc.capital || ""}\n`;
          textContent += `language: ${doc.language || ""}\n`;
          textContent += `population: ${doc.population || ""}\n`;
          textContent += `currency: ${doc.currency || ""}\n`;
          textContent += `International Students: ${
            doc.international_students || ""
          }\n`;
          textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;
          textContent += `Dialing Code: ${doc.dialing_code || ""}\n`;
          textContent += `GDP: ${doc.gdp || ""}\n`;
          textContent += `why_study: ${doc.why_study || ""}\n`;
          textContent += `work_while_studying: ${
            doc.work_while_studying || ""
          }\n`;
          textContent += `work_after_study: ${doc.work_after_study || ""}\n`;
          textContent += `residency: ${JSON.stringify(doc.residency || [])}\n`;
          textContent += `popular_programs: ${JSON.stringify(
            doc.popular_programs || []
          )}\n`;
          textContent += `rent: ${doc.rent || ""}\n`;
          textContent += `groceries: ${doc.groceries || ""}\n`;
          textContent += `transportation: ${doc.transportation || ""}\n`;
          textContent += `healthcare: ${doc.healthcare || ""}\n`;
          textContent += `eating_out: ${doc.eating_out || ""}\n`;
          textContent += `household_bills: ${doc.household_bills || ""}\n`;
          textContent += `miscellaneous: ${doc.miscellaneous || ""}\n`;
          textContent += `health: ${JSON.stringify(doc.health || [])}\n`;
          textContent += `scholarships: ${JSON.stringify(
            doc.scholarships || []
          )}\n`;
          // Add other relevant fields
        } else if (collectionName === "scholarships") {
          textContent = `hostCountry: ${doc.hostCountry || ""}\n`;
          textContent += `name: ${doc.name || ""}\n`;
          textContent += `applicableDepartments: ${JSON.stringify(
            doc.applicableDepartments || []
          )}\n`;
          textContent += `benefits: ${JSON.stringify(doc.benefits || [])}\n`;
          textContent += `deadline: ${doc.deadline || ""}\n`;
          textContent += `duration: ${doc.duration || ""}\n`;
          textContent += `eligibilityCriteria: ${JSON.stringify(
            doc.eligibilityCriteria || []
          )}\n`;
          textContent += `minimumRequirements: ${
            doc.minimumRequirements || ""
          }\n`;
          textContent += `numberOfScholarships: ${
            doc.numberOfScholarships || ""
          }\n`;
          textContent += `overview: ${doc.overview || ""}\n`;
          textContent += `programs: ${JSON.stringify(doc.programs || [])}\n`;
          textContent += `requiredDocuments: ${JSON.stringify(
            doc.requiredDocuments || []
          )}\n`;
          textContent += `successChances: ${JSON.stringify(
            doc.successChances || {}
          )}\n`;
          textContent += `type: ${doc.type || ""}\n`;
        } else if (collectionName === "courses") {
          textContent = `course_link: ${doc.course_link || ""}\n`;
          textContent += `universityname: ${doc.universityname || ""}\n`;
          textContent += `countryname: ${doc.countryname || ""}\n`;
          textContent += `annual_tuition_fee: ${JSON.stringify(
            doc.annual_tuition_fee || {}
          )}\n`;
          textContent += `application_fee: ${doc.application_fee || ""}\n`;
          textContent += `career_opportunity_1: ${
            doc.career_opportunity_1 || ""
          }\n`;
          textContent += `career_opportunity_2: ${
            doc.career_opportunity_2 || ""
          }\n`;
          textContent += `career_opportunity_3: ${
            doc.career_opportunity_3 || ""
          }\n`;
          textContent += `career_opportunity_4: ${
            doc.career_opportunity_4 || ""
          }\n`;
          textContent += `career_opportunity_5: ${
            doc.career_opportunity_5 || ""
          }\n`;
          textContent += `city: ${doc.city || ""}\n`;
          textContent += `course_level: ${doc.course_level || ""}\n`;
          textContent += `course_structure: ${JSON.stringify(
            doc.course_structure || []
          )}\n`;
          textContent += `course_title: ${JSON.stringify(
            doc.course_title || []
          )}\n`;
          textContent += `degree_format: ${doc.degree_format || ""}\n`;
          textContent += `duration: ${doc.duration || ""}\n`;
          textContent += `education_level: ${doc.education_level || ""}\n`;
          textContent += `entry_requirements: ${doc.entry_requirements || ""}\n`;
          textContent += `funding_link: ${doc.funding_link || ""}\n`;
          textContent += `initial_deposit: ${doc.initial_deposit || ""}\n`;
          // Add other relevant fields
        } else if (collectionName === "expenses") {
          textContent = `country_name: ${doc.country_name || ""}\n`;
          textContent += `university_name: ${doc.university_name || ""}\n`;
          textContent += `lifestyles: ${JSON.stringify(
            doc.lifestyles || []
          )}\n`;
        } else {
          // Default case - extract only safe fields
          textContent =
            doc.description ||
            doc.content ||
            doc.text ||
            `${
              doc.title ||
              doc.name ||
              doc.country_name ||
              doc.university_name ||
              doc.course_title ||
              "Untitled"
            } document`;

          // Avoid using full JSON representations for collections not explicitly handled
          if (textContent.trim() === "") {
            textContent = `${
              doc.title ||
              doc.name ||
              doc.country_name ||
              doc.university_name ||
              doc.course_title ||
              "Untitled"
            } document`;
          }
        }

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
          title:
            doc.title ||
            doc.name ||
            doc.country_name ||
            doc.university_name ||
            doc.course_title ||
            "Untitled",
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

    console.log(
      `Processed ${documents.length} documents from ${collectionName}`
    );
  }

  console.log("User embeddings creation complete");
  return {
    success: true,
    documentCount: await userEmbeddingsCollection.countDocuments(),
  };
}
