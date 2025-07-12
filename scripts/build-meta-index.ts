// scripts/build-meta-index.js\
// import "dotenv/config";

// import { createMetaIndex, createUserIndex } from "../lib/utils/meta-index";

// async function run() {
//   try {
//     console.log("Starting meta-index build process...");
//     const result = await createMetaIndex();
//     console.log("Meta-index build complete:", result);
//     console.log("Starting user-index build process...");
//     const userResult = await createUserIndex();
//     console.log("User-index build complete:", userResult);
//     process.exit(0);
//   } catch (error) {
//     console.error("Error building meta-index:", error);
//     process.exit(1);
//   }
// }

// run();
//command for running script
//  npx tsx scripts/build-meta-index.ts
// scripts/build-meta-index.js
// import { createMetaIndex, createUserIndex } from "../lib/utils/meta-index";
// import "dotenv/config";

// async function run() {
//   try {
//     console.log("Starting meta-index build process...");
//     const metaResult = await createMetaIndex();
//     console.log("Meta-index build complete:", metaResult);

//     // If you have a specific user ID to process
//    // Replace with actual userId or get from env
//     console.log("Starting user-index build process...");
//     const userResult = await createUserIndex();
//     console.log("User-index build complete:", userResult);

//     process.exit(0);
//   } catch (error) {
//     console.error("Error building indexes:", error);
//     process.exit(1);
//   }
// }

// run();

// build-meta-index.ts
import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import clientPromise from "../lib/mongodb";

// Environment validation
console.log("🔍 Validating environment...");
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set");
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is not set");
  process.exit(1);
}
console.log("✅ Environment validated");

// Collection mapping configuration
const COLLECTION_MAPPING = {
  countries: { source: "countries", target: "country_embeddings" },
  universities: { source: "universities", target: "university_embeddings" },
  courses: { source: "courses", target: "course_embeddings" },
  scholarships: { source: "scholarships", target: "scholarship_embeddings" },
  expenses: { source: "expenses", target: "expense_embeddings" },
};

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});

function truncateText(text: string, maxTokens: number = 2000): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;

  const sentences = text.split(/[.!?]+/);
  let result = "";

  for (const sentence of sentences) {
    if ((result + sentence).length > maxChars) break;
    result += sentence + ". ";
  }

  return result.trim() || text.substring(0, maxChars);
}
// Create combined text content from user data
interface UserProfile {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  otpVerified?: boolean;
  // Add other relevant fields as needed
}

interface SuccessChance {
  studyLevel?: string;
  grade?: string;
  gradeType?: string;
  nationality?: string;
  majorSubject?: string;
  workExperience?: string | number;
  livingCosts?: { amount: number; currency: string };
  tuitionFee?: { amount: number; currency: string };
  languageProficiency?: { test: string; score: string | number };
  studyPreferenced?: {
    country?: string;
    degree?: string;
    subject?: string;
  };
  userId?: string;
}

function createCombinedUserTextContent(
  user: UserProfile,
  successChances: SuccessChance[]
): string {
  let textContent = "";

  // Basic user profile
  textContent += `User Profile:\n`;
  textContent += `ID: ${user._id}\n`;
  textContent += `Name: ${user.name || user.firstName + " " + user.lastName}\n`;
  textContent += `Email: ${user.email}\n`;
  // Academic preferences from success chances
  if (successChances && successChances.length > 0) {
    textContent += `\nAcademic Profile:\n`;

    successChances.forEach((record, index) => {
      textContent += `\n--- Profile ${index + 1} ---\n`;
      textContent += `Study Level: ${record.studyLevel || ""}\n`;
      textContent += `Grade: ${record.grade || ""} (${
        record.gradeType || ""
      })\n`;
      textContent += `Nationality: ${record.nationality || ""}\n`;
      textContent += `Major: ${record.majorSubject || ""}\n`;
      textContent += `Work Experience: ${record.workExperience || "0"} years\n`;

      if (record.livingCosts) {
        textContent += `Living Budget: ${record.livingCosts.amount} ${record.livingCosts.currency}\n`;
      }

      if (record.tuitionFee) {
        textContent += `Tuition Budget: ${record.tuitionFee.amount} ${record.tuitionFee.currency}\n`;
      }

      if (record.languageProficiency) {
        textContent += `Language: ${record.languageProficiency.test} ${record.languageProficiency.score}\n`;
      }

      if (record.studyPreferenced) {
        textContent += `Preferred Country: ${
          record.studyPreferenced.country || ""
        }\n`;
        textContent += `Preferred Degree: ${
          record.studyPreferenced.degree || ""
        }\n`;
        textContent += `Preferred Subject: ${
          record.studyPreferenced.subject || ""
        }\n`;
      }
    });
  }

  return textContent;
}

// Create user embeddings (prioritized first)
export async function createUserEmbeddings() {
  console.log("🚀 Starting user embeddings creation...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const userEmbeddingsCollection = db.collection("user_embeddings");

    // Clear existing embeddings
    console.log("🗑️ Clearing existing user embeddings...");
    await userEmbeddingsCollection.deleteMany({});

    // Get user data
    const userDbCollection = db.collection("userdbs");
    const successChanceCollection = db.collection("successchances");

    console.log("🔍 Fetching user data...");
    const users = await userDbCollection.find({}).toArray();
    const successChances = await successChanceCollection.find({}).toArray();

    // Map success chances by userId
    const successChanceMap = new Map();
    successChances.forEach((record) => {
      const userId = record.userId?.toString();
      if (userId) {
        if (!successChanceMap.has(userId)) {
          successChanceMap.set(userId, []);
        }
        successChanceMap.get(userId).push(record);
      }
    });

    console.log(`📊 Processing ${users.length} users...`);

    const batchSize = 20;
    let totalProcessed = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchEmbeddings = [];

      for (const user of batch) {
        try {
          const userId = user._id.toString();
          const userSuccessChances = successChanceMap.get(userId) || [];
          const textContent = createCombinedUserTextContent(
            { ...user, _id: user._id.toString() },
            userSuccessChances
          );

          if (textContent.trim()) {
            const embedding = await embeddings.embedQuery(textContent);

            batchEmbeddings.push({
              text: textContent,
              embedding: embedding,
              userId: userId,
              sourceCollection: "combined_user_data",
              originalId: user._id.toString(),
              domain: "user",
              metadata: {
                userProfile: user,
                successChances: userSuccessChances,
                hasSuccessChanceData: userSuccessChances.length > 0,
              },
              createdAt: new Date(),
            });

            totalProcessed++;

            // Rate limiting
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(`❌ Error processing user ${user._id}:`, error);
        }
      }

      // Insert batch
      if (batchEmbeddings.length > 0) {
        await userEmbeddingsCollection.insertMany(batchEmbeddings);
        console.log(`✅ Processed batch: ${totalProcessed}/${users.length}`);
      }
    }

    console.log(
      `✅ User embeddings completed: ${totalProcessed} users processed`
    );
    return { totalProcessed, collectionName: "user_embeddings" };
  } catch (error) {
    console.error("❌ Error in createUserEmbeddings:", error);
    throw error;
  }
}

// Create text content for domain documents
function createTextContent(
  doc: Record<string, unknown>,
  collectionName: string
): { textContent: string; metadata: Record<string, unknown> } {
  let textContent = "";
  let metadata: Record<string, unknown> = {};

  switch (collectionName) {
    case "universities":
      textContent += `University: ${doc.university_name || ""}\n`;
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `Location: ${doc.location || ""}\n`;
      textContent += `Ranking: QS ${
        doc.qs_world_university_ranking || "N/A"
      }, THE ${doc.times_higher_education_ranking || "N/A"}\n`;
      textContent += `Established: ${doc.establishment_year || ""}\n`;
      textContent += `Students: ${doc.national_students || ""} national, ${
        doc.international_students || ""
      } international\n`;
      textContent += `Acceptance Rate: ${doc.acceptance_rate || ""}\n`;

      if (doc.overview) {
        textContent += `Overview: ${truncateText(
          typeof doc.overview === "string" ? doc.overview : "",
          500
        )}\n`;
      }
      if (doc.modern_day_development) {
        textContent += `Modern Day Development: ${truncateText(
          typeof doc.modern_day_development === "string"
            ? doc.modern_day_development
            : "",
          500
        )}\n`;
      }
      if (doc.our_mission) {
        textContent += `Mission: ${truncateText(
          typeof doc.our_mission === "string" ? doc.our_mission : "",
          300
        )}\n`;
      }

      // Enhanced metadata for universities
      metadata = {
        title: doc.university_name || "Untitled University",
        country: doc.country_name || "",
        location: doc.location || "",
        ranking: {
          qs: doc.qs_world_university_ranking || null,
          the: doc.times_higher_education_ranking || null,
        },
        establishmentYear: doc.establishment_year || null,
        acceptanceRate: doc.acceptance_rate || null,
        studentCount: {
          national: doc.national_students || null,
          international: doc.international_students || null,
        },
        originalDoc: doc,
      };
      break;

    case "countries":
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `Capital: ${doc.capital || ""}\n`;
      textContent += `Language: ${doc.language || ""}\n`;
      textContent += `Population: ${doc.population || ""}\n`;
      textContent += `Currency: ${doc.currency || ""}\n`;
      textContent += `International Students: ${
        doc.international_students || ""
      }\n`;
      textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;

      if (doc.why_study) {
        textContent += `Why Study: ${truncateText(
          typeof doc.why_study === "string" ? doc.why_study : "",
          400
        )}\n`;
      }

      textContent += `Work While Studying: ${doc.work_while_studying || ""}\n`;
      textContent += `Work After Study: ${doc.work_after_study || ""}\n`;
      textContent += `Living Costs - Rent: ${doc.rent || ""}, Transport: ${
        doc.transportation || ""
      }\n`;

      // Enhanced metadata for countries
      metadata = {
        title: doc.country_name || "Untitled Country",
        country: doc.country_name || "",
        capital: doc.capital || "",
        language: doc.language || "",
        population: doc.population || null,
        currency: doc.currency || "",
        internationalStudents: doc.international_students || null,
        academicIntakes: doc.academic_intakes || "",
        workRights: {
          whileStudying: doc.work_while_studying || "",
          afterStudy: doc.work_after_study || "",
        },
        livingCosts: {
          rent: doc.rent || null,
          transportation: doc.transportation || null,
        },
        originalDoc: doc,
      };
      break;

    case "courses":
      const courseTitle = Array.isArray(doc.course_title)
        ? doc.course_title.join(", ")
        : doc.course_title || "";

      textContent += `Subject: ${courseTitle}\n`;
      textContent += `University: ${doc.universityname || ""}\n`;
      textContent += `Country: ${doc.countryname || ""}\n`;
      textContent += `Degree: ${doc.course_level || ""}\n`;
      textContent += `Duration: ${doc.duration || ""}\n`;
      textContent += `Application Fee: ${doc.application_fee || ""}\n`;

      if (doc.entry_requirements) {
        textContent += `Entry Requirements: ${truncateText(
          typeof doc.entry_requirements === "string"
            ? doc.entry_requirements
            : "",
          300
        )}\n`;
      }

      const careers = [
        doc.career_opportunity_1,
        doc.career_opportunity_2,
        doc.career_opportunity_3,
        doc.career_opportunity_4,
        doc.career_opportunity_5,
      ].filter(Boolean);
      if (careers.length > 0) {
        textContent += `Career Opportunities: ${careers.join(", ")}\n`;
      }

      // Enhanced metadata for courses - THIS IS THE KEY ADDITION
      metadata = {
        title: courseTitle,
        country: doc.countryname || "",
        degree: doc.course_level || "", // This is the "degree" field you wanted
        subject: courseTitle, // This is the "subject" field you wanted
        university: doc.universityname || "",
        duration: doc.duration || "",
        applicationFee: doc.application_fee || null,
        entryRequirements: doc.entry_requirements || "",
        careerOpportunities: careers,
        originalDoc: doc,
      };
      break;

    case "scholarships":
      textContent += `Scholarship: ${doc.name || ""}\n`;
      textContent += `Host Country: ${doc.hostCountry || ""}\n`;
      textContent += `Type: ${doc.type || ""}\n`;
      textContent += `Duration: ${doc.duration || ""}\n`;
      textContent += `Deadline: ${doc.deadline || ""}\n`;
      textContent += `Number of Scholarships: ${
        doc.numberOfScholarships || ""
      }\n`;
      textContent += `Minimum Requirements: ${doc.minimumRequirements || ""}\n`;

      if (doc.overview) {
        textContent += `Overview: ${truncateText(
          typeof doc.overview === "string" ? doc.overview : "",
          400
        )}\n`;
      }

      // Enhanced metadata for scholarships
      metadata = {
        title: doc.name || "Untitled Scholarship",
        country: doc.hostCountry || "",
        type: doc.type || "",
        duration: doc.duration || "",
        deadline: doc.deadline || "",
        numberOfScholarships: doc.numberOfScholarships || null,
        minimumRequirements: doc.minimumRequirements || "",
        originalDoc: doc,
      };
      break;

    case "expenses":
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `University: ${doc.university_name || ""}\n`;

      if (doc.lifestyles && Array.isArray(doc.lifestyles)) {
        const lifestyleInfo = doc.lifestyles
          .map((lifestyle) => {
            if (typeof lifestyle === "object") {
              return Object.entries(lifestyle)
                .slice(0, 5)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
            }
            return lifestyle;
          })
          .join(" | ");
        textContent += `Lifestyles: ${lifestyleInfo}\n`;
      }

      // Enhanced metadata for expenses
      metadata = {
        title: `${doc.country_name || "Country"} - ${
          doc.university_name || "University"
        } Expenses`,
        country: doc.country_name || "",
        university: doc.university_name || "",
        lifestyles: doc.lifestyles || [],
        originalDoc: doc,
      };
      break;

    default:
      metadata = {
        title: "Untitled",
        originalDoc: doc,
      };
      break;
  }

  return { textContent, metadata };
}

// Updated createDomainEmbeddings function to use enhanced metadata
export async function createDomainEmbeddings() {
  console.log("🚀 Starting domain embeddings creation...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const results: Record<
      string,
      {
        documentsProcessed: number;
        embeddingsCreated: number;
        collectionName?: string;
      }
    > = {};

    for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
      console.log(`\n🔄 Processing ${domain}...`);

      const sourceCollection = db.collection(config.source);
      const targetCollection = db.collection(config.target);

      // Clear existing embeddings
      await targetCollection.deleteMany({});

      // Get documents
      const documents = await sourceCollection.find({}).toArray();
      console.log(`📊 Found ${documents.length} ${domain} documents`);

      if (documents.length === 0) {
        results[domain] = { documentsProcessed: 0, embeddingsCreated: 0 };
        continue;
      }

      let totalProcessed = 0;
      const batchSize = 10;

      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const batchEmbeddings = [];

        for (const doc of batch) {
          try {
            // Use the enhanced createTextContent function
            const { textContent, metadata } = createTextContent(
              doc,
              config.source
            );

            if (textContent.trim()) {
              const embedding = await embeddings.embedQuery(textContent);

              batchEmbeddings.push({
                text: textContent,
                embedding: embedding,
                domain: domain,
                sourceCollection: config.source,
                originalId: doc._id.toString(),
                ...metadata, 
                metadata: metadata, 
                createdAt: new Date(),
              });

              totalProcessed++;

              // Rate limiting
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          } catch (error) {
            console.error(
              `❌ Error processing ${domain} document ${doc._id}:`,
              error
            );
          }
        }

        // Insert batch
        if (batchEmbeddings.length > 0) {
          await targetCollection.insertMany(batchEmbeddings);
          console.log(
            `✅ ${domain}: ${totalProcessed}/${documents.length} processed`
          );
        }
      }

      results[domain] = {
        documentsProcessed: totalProcessed,
        embeddingsCreated: totalProcessed,
        collectionName: config.target,
      };
    }

    console.log("✅ Domain embeddings completed");
    return results;
  } catch (error) {
    console.error("❌ Error in createDomainEmbeddings:", error);
    throw error;
  }
}

// Main function - user embeddings first, then domain embeddings
export async function createAllEmbeddings() {
  console.log("🚀 Starting complete embeddings creation...");

  try {
    // Step 1: Create user embeddings first (prioritized)
    console.log("👤 Step 1: Creating user embeddings...");
    const userResults = await createUserEmbeddings();
    console.log("✅ User embeddings completed");

    // Step 2: Create domain embeddings
    console.log("\n📋 Step 2: Creating domain embeddings...");
    const domainResults = await createDomainEmbeddings();
    console.log("✅ Domain embeddings completed");

    const finalResults = {
      users: userResults,
      domains: domainResults,
      timestamp: new Date().toISOString(),
    };

    console.log("\n🎉 All embeddings creation completed");
    console.log("📊 Results:", JSON.stringify(finalResults, null, 2));

    return finalResults;
  } catch (error) {
    console.error("❌ Error in createAllEmbeddings:", error);
    throw error;
  }
}

// Utility function to get embedding statistics
export async function getEmbeddingStats() {
  console.log("📊 Getting embedding statistics...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const stats: Record<string, { count: number; collection: string }> = {};

    // User embeddings stats
    const userCollection = db.collection("user_embeddings");
    const userCount = await userCollection.countDocuments();
    stats["users"] = { count: userCount, collection: "user_embeddings" };

    // Domain embeddings stats
    for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
      const collection = db.collection(config.target);
      const count = await collection.countDocuments();
      stats[domain] = { count, collection: config.target };
    }

    console.log("📊 Statistics:", JSON.stringify(stats, null, 2));
    return stats;
  } catch (error) {
    console.error("❌ Error getting stats:", error);
    throw error;
  }
}

// Execute main function
async function main() {
  try {
    console.log("🚀 Starting embeddings creation process...");
    const results = await createAllEmbeddings();
    console.log("✅ Process completed successfully", results);
  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exit(1);
  } finally {
    console.log("🔄 Exiting...");
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
// for university search index, use the following structure
// {
//   "fields": [
//     {
//       "type": "vector",
//       "path": "embedding",
//       "numDimensions": 1536,
//       "similarity": "cosine"
//     },
//     {
//       "type": "filter",
//       "path": "text"
//     },
//     {
//       "type": "filter",
//       "path": "country"
//     },
//     {
//       "type": "filter",
//       "path": "qs_world_university_ranking"
//     },
//     {
//       "type": "filter",
//       "path": "acceptance_rate"
//     },
//     {
//       "type": "filter",
//       "path": "title"
//     }
//   ]
// }

// for course search index, use the following structure

// {
//   "fields": [
//     {
//       "numDimensions": 1536,
//       "path": "embedding",
//       "similarity": "cosine",
//       "type": "vector"
//     },
//     {
//       "path": "text",
//       "type": "filter"
//     },
//     {
//       "path": "country",
//       "type": "filter"
//     },
//     {
//       "path": "degree",
//       "type": "filter"
//     },
//     {
//       "path": "subject",
//       "type": "filter"
//     },
//     {
//       "path": "tuitionFee",
//       "type": "filter"
//     },
//     {
//       "path": "grade",
//       "type": "filter"
//     }
//   ]
// }
//to run this script, use the following command:
// npx tsx scripts/build-meta-index.ts
