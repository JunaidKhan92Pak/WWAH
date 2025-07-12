// // /lib/debug-vector-search.ts
// import { getDomainVectorStore } from "./langchain";
// import clientPromise from "./mongodb";

// interface DebugResult {
//   collection: string;
//   totalDocs: number;
//   sampleDocs: unknown[];
//   vectorSearchResults: unknown[];
//   filterResults: unknown[];
// }

// export async function debugVectorSearch(
//   query: string,
//   domain:
//     | "courses"
//     | "universities"
//     | "countries"
//     | "scholarships"
//     | "expenses",
//   filters?: unknown
// ): Promise<DebugResult> {
//   console.log(
//     `🔍 Debug: Starting vector search debug for "${query}" in ${domain}`
//   );

//   const client = await clientPromise;
//   const db = client.db("wwah");

//   // Get collection info
//   const collectionName = {
//     courses: "course_embeddings",
//     universities: "university_embeddings",
//     countries: "country_embeddings",
//     scholarships: "scholarship_embeddings",
//     expenses: "expense_embeddings",
//   }[domain];

//   const collection = db.collection(collectionName);

//   // 1. Check total documents
//   const totalDocs = await collection.countDocuments();
//   console.log(`📊 Total documents in ${collectionName}: ${totalDocs}`);

//   // 2. Get sample documents
//   const sampleDocs = await collection.find().limit(5).toArray();
//   console.log(
//     `📋 Sample documents:`,
//     sampleDocs.map((doc) => ({
//       id: doc._id,
//       domain: doc.domain,
//       title: doc.title,
//       country: doc.country,
//       degree: doc.degree,
//       subject: doc.subject,
//       textPreview: doc.text?.substring(0, 100) + "...",
//     }))
//   );

//   // 3. Test vector search
//   const vectorStore = await getDomainVectorStore(domain);
//   const vectorSearchResults = await vectorStore.similaritySearch(query, 10);
//   console.log(
//     `🔍 Vector search results: ${vectorSearchResults.length} documents`
//   );

//   // 4. Test with filters if provided
//   let filterResults: unknown[] = [];
//   if (filters) {
//     console.log(`🔍 Testing with filters:`, filters);
//     try {
//       const retriever = vectorStore.asRetriever({ k: 10, filter: filters });
//       filterResults = await retriever.getRelevantDocuments(query);
//       console.log(`🔍 Filter results: ${filterResults.length} documents`);
//     } catch (error) {
//       console.error(`❌ Filter search failed:`, error);
//     }
//   }

//   // 5. Test manual MongoDB query
//   console.log(`🔍 Testing manual MongoDB query...`);
//   const manualQuery: Record<string, unknown> = { domain };
//   if (filters) {
//     Object.assign(manualQuery, filters);
//   }

//   const manualResults = await collection.find(manualQuery).limit(10).toArray();
//   console.log(
//     `📋 Manual MongoDB query results: ${manualResults.length} documents`
//   );

//   return {
//     collection: collectionName,
//     totalDocs,
//     sampleDocs: sampleDocs.map((doc) => ({
//       id: doc._id,
//       domain: doc.domain,
//       title: doc.title,
//       country: doc.country,
//       degree: doc.degree,
//       subject: doc.subject,
//       textPreview: doc.text?.substring(0, 200) + "...",
//     })),
//     vectorSearchResults: vectorSearchResults.map((doc) => {
//       const d = doc as { pageContent: string; metadata: unknown };
//       return {
//         content: d.pageContent.substring(0, 200) + "...",
//         metadata: d.metadata,
//       };
//     }),
//     filterResults: filterResults.map((doc) => {
//       const d = doc as { pageContent: string; metadata: unknown };
//       return {
//         content: d.pageContent.substring(0, 200) + "...",
//         metadata: d.metadata,
//       };
//     }),
//   };
// }

// // Specific debug function for your journalism case
// export async function debugJournalismCourses() {
//   console.log(`🔍 Debug: Looking for journalism courses in UK...`);

//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const collection = db.collection("course_embeddings");

//   // 1. Find all journalism courses
//   const journalismCourses = await collection
//     .find({
//       $or: [
//         { subject: /journalism/i },
//         { title: /journalism/i },
//         { text: /journalism/i },
//       ],
//     })
//     .toArray();

//   console.log(`📋 Found ${journalismCourses.length} journalism courses`);

//   // 2. Find all UK courses
//   const ukCourses = await collection
//     .find({
//       $or: [
//         { country: /uk/i },
//         { country: /united kingdom/i },
//         { country: /britain/i },
//       ],
//     })
//     .toArray();

//   console.log(`📋 Found ${ukCourses.length} UK courses`);

//   // 3. Find journalism courses in UK
//   const ukJournalismCourses = await collection
//     .find({
//       $and: [
//         {
//           $or: [
//             { subject: /journalism/i },
//             { title: /journalism/i },
//             { text: /journalism/i },
//           ],
//         },
//         {
//           $or: [
//             { country: /uk/i },
//             { country: /united kingdom/i },
//             { country: /britain/i },
//           ],
//         },
//       ],
//     })
//     .toArray();

//   console.log(
//     `📋 Found ${ukJournalismCourses.length} journalism courses in UK`
//   );

//   // 4. Show sample data
//   if (ukJournalismCourses.length > 0) {
//     console.log(
//       `📋 Sample UK journalism courses:`,
//       ukJournalismCourses.slice(0, 3).map((course) => ({
//         id: course._id,
//         title: course.title,
//         country: course.country,
//         degree: course.degree,
//         subject: course.subject,
//         textPreview: course.text?.substring(0, 200) + "...",
//       }))
//     );
//   }

//   return {
//     totalJournalismCourses: journalismCourses.length,
//     totalUKCourses: ukCourses.length,
//     ukJournalismCourses: ukJournalismCourses.length,
//     samples: ukJournalismCourses.slice(0, 5).map((course) => ({
//       id: course._id,
//       title: course.title,
//       country: course.country,
//       degree: course.degree,
//       subject: course.subject,
//       textPreview: course.text?.substring(0, 200) + "...",
//     })),
//   };
// }

// // API endpoint for debugging
// import { NextApiRequest } from "next";

// export async function debugAPI(req: NextApiRequest) {
//   const { query, domain, filters } = req.body;

//   try {
//     const result = await debugVectorSearch(query, domain, filters);
//     return Response.json(result);
//   } catch (error) {
//     console.error("Debug API error:", error);
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return Response.json({ error: errorMessage }, { status: 500 });
//   }
// }
// /lib/debug-vector-search.ts
import { getDomainVectorStore } from "./langchain";
import clientPromise from "./mongodb";

// Define the domain types to match what getDomainVectorStore expects
type DomainType = "courses" | "universities" | "countries";

interface DebugResult {
  collection: string;
  totalDocs: number;
  sampleDocs: unknown[];
  vectorSearchResults: unknown[];
  filterResults: unknown[];
}

export async function debugVectorSearch(
  query: string,
  domain: DomainType,
  filters?: unknown
): Promise<DebugResult> {
  console.log(
    `🔍 Debug: Starting vector search debug for "${query}" in ${domain}`
  );

  const client = await clientPromise;
  const db = client.db("wwah");

  // Get collection info
  const collectionName = {
    courses: "course_embeddings",
    universities: "university_embeddings",
    countries: "country_embeddings",
    scholarships: "scholarship_embeddings",
    expenses: "expense_embeddings",
  }[domain];

  const collection = db.collection(collectionName);

  // 1. Check total documents
  const totalDocs = await collection.countDocuments();
  console.log(`📊 Total documents in ${collectionName}: ${totalDocs}`);

  // 2. Get sample documents
  const sampleDocs = await collection.find().limit(5).toArray();
  console.log(
    `📋 Sample documents:`,
    sampleDocs.map((doc) => ({
      id: doc._id,
      domain: doc.domain,
      title: doc.title,
      country: doc.country,
      degree: doc.degree,
      subject: doc.subject,
      textPreview: doc.text?.substring(0, 100) + "...",
    }))
  );

  // 3. Test vector search - with proper type checking
  let vectorSearchResults: unknown[] = [];
  try {
    const vectorStore = await getDomainVectorStore(domain);
    vectorSearchResults = await vectorStore.similaritySearch(query, 10);
    console.log(
      `🔍 Vector search results: ${vectorSearchResults.length} documents`
    );
  } catch (error) {
    console.error(`❌ Vector search failed for domain ${domain}:`, error);
    // If the domain is not supported by getDomainVectorStore, continue with other checks
  }

  // 4. Test with filters if provided
  let filterResults: unknown[] = [];
  if (filters && vectorSearchResults.length > 0) {
    console.log(`🔍 Testing with filters:`, filters);
    try {
      const vectorStore = await getDomainVectorStore(domain);
      const retriever = vectorStore.asRetriever({ k: 10, filter: filters });
      filterResults = await retriever.getRelevantDocuments(query);
      console.log(`🔍 Filter results: ${filterResults.length} documents`);
    } catch (error) {
      console.error(`❌ Filter search failed:`, error);
    }
  }

  // 5. Test manual MongoDB query
  console.log(`🔍 Testing manual MongoDB query...`);
  const manualQuery: Record<string, unknown> = { domain };
  if (filters) {
    Object.assign(manualQuery, filters);
  }

  const manualResults = await collection.find(manualQuery).limit(10).toArray();
  console.log(
    `📋 Manual MongoDB query results: ${manualResults.length} documents`
  );

  return {
    collection: collectionName,
    totalDocs,
    sampleDocs: sampleDocs.map((doc) => ({
      id: doc._id,
      domain: doc.domain,
      title: doc.title,
      country: doc.country,
      degree: doc.degree,
      subject: doc.subject,
      textPreview: doc.text?.substring(0, 200) + "...",
    })),
    vectorSearchResults: vectorSearchResults.map((doc) => {
      const d = doc as { pageContent: string; metadata: unknown };
      return {
        content: d.pageContent.substring(0, 200) + "...",
        metadata: d.metadata,
      };
    }),
    filterResults: filterResults.map((doc) => {
      const d = doc as { pageContent: string; metadata: unknown };
      return {
        content: d.pageContent.substring(0, 200) + "...",
        metadata: d.metadata,
      };
    }),
  };
}

// Specific debug function for your journalism case
export async function debugJournalismCourses() {
  console.log(`🔍 Debug: Looking for journalism courses in UK...`);

  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection("course_embeddings");

  // 1. Find all journalism courses
  const journalismCourses = await collection
    .find({
      $or: [
        { subject: /journalism/i },
        { title: /journalism/i },
        { text: /journalism/i },
      ],
    })
    .toArray();

  console.log(`📋 Found ${journalismCourses.length} journalism courses`);

  // 2. Find all UK courses
  const ukCourses = await collection
    .find({
      $or: [
        { country: /uk/i },
        { country: /united kingdom/i },
        { country: /britain/i },
      ],
    })
    .toArray();

  console.log(`📋 Found ${ukCourses.length} UK courses`);

  // 3. Find journalism courses in UK
  const ukJournalismCourses = await collection
    .find({
      $and: [
        {
          $or: [
            { subject: /journalism/i },
            { title: /journalism/i },
            { text: /journalism/i },
          ],
        },
        {
          $or: [
            { country: /uk/i },
            { country: /united kingdom/i },
            { country: /britain/i },
          ],
        },
      ],
    })
    .toArray();

  console.log(
    `📋 Found ${ukJournalismCourses.length} journalism courses in UK`
  );

  // 4. Show sample data
  if (ukJournalismCourses.length > 0) {
    console.log(
      `📋 Sample UK journalism courses:`,
      ukJournalismCourses.slice(0, 3).map((course) => ({
        id: course._id,
        title: course.title,
        country: course.country,
        degree: course.degree,
        subject: course.subject,
        textPreview: course.text?.substring(0, 200) + "...",
      }))
    );
  }

  return {
    totalJournalismCourses: journalismCourses.length,
    totalUKCourses: ukCourses.length,
    ukJournalismCourses: ukJournalismCourses.length,
    samples: ukJournalismCourses.slice(0, 5).map((course) => ({
      id: course._id,
      title: course.title,
      country: course.country,
      degree: course.degree,
      subject: course.subject,
      textPreview: course.text?.substring(0, 200) + "...",
    })),
  };
}

// API endpoint for debugging
import { NextApiRequest } from "next";

export async function debugAPI(req: NextApiRequest) {
  const { query, domain, filters } = req.body;

  // Validate domain type
  const validDomains: DomainType[] = ["courses", "universities", "countries"];
  if (!validDomains.includes(domain)) {
    return Response.json(
      { error: `Invalid domain. Must be one of: ${validDomains.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const result = await debugVectorSearch(query, domain, filters);
    return Response.json(result);
  } catch (error) {
    console.error("Debug API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// Additional helper function to check what domains are supported
export async function getSupportedDomains(): Promise<string[]> {
  const domains: DomainType[] = ["courses", "universities", "countries"];
  const supportedDomains: string[] = [];
  
  for (const domain of domains) {
    try {
      await getDomainVectorStore(domain);
      supportedDomains.push(domain);
    } catch (error) {
      console.warn(`Domain ${domain} not supported by getDomainVectorStore:`, error);
    }
  }
  
  return supportedDomains;
}