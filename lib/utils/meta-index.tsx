// // utils/aemt - index.ts;
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import clientPromise from "../mongodb";

// // Collection configuration with enhanced metadata support
// const COLLECTION_CONFIG = {
//   countries: {
//     name: "country_embeddings",
//     indexName: "country_vector_index",
//     priority: 0.3,
//     searchableFields: [
//       "country",
//       "capital",
//       "language",
//       "currency",
//       "workRights",
//       "livingCosts",
//       "popularPrograms",
//     ],
//   },
//   universities: {
//     name: "university_embeddings",
//     indexName: "university_vector_index",
//     priority: 0.4,
//     searchableFields: [
//       "title",
//       "country",
//       "location",
//       "type",
//       "ranking.qsWorldRanking",
//       "ranking.timesHigherEducation",
//       "establishmentYear",
//       "acceptanceRate",
//     ],
//   },
//   courses: {
//     name: "course_embeddings",
//     indexName: "course_vector_index",
//     priority: 0.3,
//     searchableFields: [
//       "title",
//       "country",
//       "city",
//       "degree",
//       "subject",
//       "university",
//       "duration",
//       "testScores",
//       "annualTuitionFee",
//     ],
//   },
//   scholarships: {
//     name: "scholarship_embeddings",
//     indexName: "scholarship_vector_index",
//     priority: 0.2,
//     searchableFields: [
//       "title",
//       "country",
//       "type",
//       "provider",
//       "deadline",
//       "programs",
//       "numberOfScholarships",
//       "benefits",
//     ],
//   },
//   expenses: {
//     name: "expense_embeddings",
//     indexName: "expense_vector_index",
//     priority: 0.1,
//     searchableFields: ["country", "university", "lifestyles"],
//   },
//   users: {
//     name: "user_embeddings",
//     indexName: "user_vector_index",
//     priority: 0.5,
//     searchableFields: [
//       "userId",
//       "email",
//       "userProfile",
//       "successChances",
//       "hasSuccessChanceData",
//     ],
//   },
// };

// // Enhanced search options interface
// interface SearchOptions {
//   filter?: Record<string, unknown>;
//   limit?: number;
//   includeMetadata?: boolean;
//   similarityThreshold?: number;
// }

// // Enhanced search result interface
// interface SearchResult {
//   pageContent: string;
//   metadata: Record<string, unknown>;
//   score?: number;
//   domain: string;
// }

// // Vector store instances cache
// const vectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();
// const userVectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();

// // Initialize embeddings instance
// const embeddings = new OpenAIEmbeddings({
//   modelName: "text-embedding-3-small",
// });

// // Enhanced vector store creation with metadata support
// export async function getDomainVectorStore(
//   domain: keyof typeof COLLECTION_CONFIG
// ) {
//   const cacheKey = `domain_${domain}`;
//   if (vectorStoreCache.has(cacheKey)) {
//     return vectorStoreCache.get(cacheKey)!;
//   }

//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const config = COLLECTION_CONFIG[domain];
//   const collection = db.collection(config.name);

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: config.indexName,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });

//   vectorStoreCache.set(cacheKey, vectorStore);
//   return vectorStore;
// }

// // Enhanced user vector store with caching
// export async function getUserVectorStore(userId: string) {
//   if (!userId) return null;

//   const cacheKey = `user_${userId}`;
//   if (userVectorStoreCache.has(cacheKey)) {
//     return userVectorStoreCache.get(cacheKey)!;
//   }

//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const collection = db.collection("user_embeddings");

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "user_vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//   });

//   userVectorStoreCache.set(cacheKey, vectorStore);
//   return vectorStore;
// }

// // Enhanced search with metadata filtering
// export async function searchWithMetadata(
//   query: string,
//   domain: keyof typeof COLLECTION_CONFIG,
//   options: SearchOptions = {}
// ) {
//   const vectorStore = await getDomainVectorStore(domain);
//   const { filter = {}, limit = 10, similarityThreshold = 0.7 } = options;

//   try {
//     // Perform similarity search with metadata filter
//     const results = await vectorStore.similaritySearchWithScore(
//       query,
//       limit,
//       filter
//     );

//     // Filter by similarity threshold and format results
//     const filteredResults: SearchResult[] = results
//       .filter(([, score]) => score >= similarityThreshold)
//       .map(([document, score]) => ({
//         pageContent: document.pageContent,
//         metadata: document.metadata,
//         score,
//         domain,
//       }));

//     return filteredResults;
//   } catch (error) {
//     console.error(`Error searching in ${domain}:`, error);
//     return [];
//   }
// }

// // Multi-domain search with metadata filtering
// export async function searchMultipleDomains(
//   query: string,
//   domains: (keyof typeof COLLECTION_CONFIG)[],
//   options: SearchOptions = {}
// ) {
//   const searchPromises = domains.map(async (domain) => {
//     const results = await searchWithMetadata(query, domain, options);
//     return results.map((result) => ({ ...result, domain }));
//   });

//   const allResults = await Promise.all(searchPromises);
//   return allResults.flat();
// }

// // Enhanced course search with comprehensive filters
// export async function searchCourses(
//   query: string,
//   filters: {
//     country?: string;
//     city?: string;
//     degree?: string;
//     subject?: string;
//     university?: string;
//     duration?: string;
//     degreeFormat?: string;
//     testScores?: {
//       ielts?: string;
//       pte?: string;
//       toefl?: string;
//     };
//     tuitionFeeRange?: {
//       min?: number;
//       max?: number;
//       currency?: string;
//     };
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   // Build MongoDB filter from the enhanced metadata fields
//   if (filters.country) mongoFilter["metadata.country"] = filters.country;
//   if (filters.city) mongoFilter["metadata.city"] = filters.city;
//   if (filters.degree) mongoFilter["metadata.degree"] = filters.degree;
//   if (filters.subject)
//     mongoFilter["metadata.subject"] = {
//       $regex: filters.subject,
//       $options: "i",
//     };
//   if (filters.university)
//     mongoFilter["metadata.university"] = {
//       $regex: filters.university,
//       $options: "i",
//     };
//   if (filters.duration) mongoFilter["metadata.duration"] = filters.duration;
//   if (filters.degreeFormat)
//     mongoFilter["metadata.degreeFormat"] = filters.degreeFormat;

//   // Test score filters
//   if (filters.testScores?.ielts)
//     mongoFilter["metadata.testScores.ielts"] = filters.testScores.ielts;
//   if (filters.testScores?.pte)
//     mongoFilter["metadata.testScores.pte"] = filters.testScores.pte;
//   if (filters.testScores?.toefl)
//     mongoFilter["metadata.testScores.toefl"] = filters.testScores.toefl;

//   // Tuition fee range filter
//   if (filters.tuitionFeeRange) {
//     const feeFilter: Record<string, unknown> = {};
//     if (filters.tuitionFeeRange.min !== undefined) {
//       feeFilter["$gte"] = filters.tuitionFeeRange.min;
//     }
//     if (filters.tuitionFeeRange.max !== undefined) {
//       feeFilter["$lte"] = filters.tuitionFeeRange.max;
//     }
//     if (Object.keys(feeFilter).length > 0) {
//       mongoFilter["metadata.annualTuitionFee.amount"] = feeFilter;
//     }
//     if (filters.tuitionFeeRange.currency) {
//       mongoFilter["metadata.annualTuitionFee.currency"] =
//         filters.tuitionFeeRange.currency;
//     }
//   }

//   return await searchWithMetadata(query, "courses", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Enhanced university search with comprehensive filters
// export async function searchUniversities(
//   query: string,
//   filters: {
//     country?: string;
//     location?: string;
//     type?: string;
//     establishmentYear?: {
//       min?: number;
//       max?: number;
//     };
//     ranking?: {
//       qsWorldRanking?: { max?: number };
//       timesHigherEducation?: { max?: number };
//     };
//     acceptanceRate?: {
//       min?: string;
//       max?: string;
//     };
//     studentCount?: {
//       minNational?: number;
//       minInternational?: number;
//     };
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   if (filters.country) mongoFilter["metadata.country"] = filters.country;
//   if (filters.location)
//     mongoFilter["metadata.location"] = {
//       $regex: filters.location,
//       $options: "i",
//     };
//   if (filters.type) mongoFilter["metadata.type"] = filters.type;

//   // Establishment year range
//   if (filters.establishmentYear) {
//     const yearFilter: Record<string, unknown> = {};
//     if (filters.establishmentYear.min)
//       yearFilter["$gte"] = filters.establishmentYear.min;
//     if (filters.establishmentYear.max)
//       yearFilter["$lte"] = filters.establishmentYear.max;
//     if (Object.keys(yearFilter).length > 0) {
//       mongoFilter["metadata.establishmentYear"] = yearFilter;
//     }
//   }

//   // Ranking filters
//   if (filters.ranking?.qsWorldRanking?.max) {
//     mongoFilter["metadata.ranking.qsWorldRanking"] = {
//       $lte: filters.ranking.qsWorldRanking.max,
//     };
//   }
//   if (filters.ranking?.timesHigherEducation?.max) {
//     mongoFilter["metadata.ranking.timesHigherEducation"] = {
//       $lte: filters.ranking.timesHigherEducation.max,
//     };
//   }

//   // Student count filters
//   if (filters.studentCount?.minNational) {
//     mongoFilter["metadata.studentCount.national"] = {
//       $gte: filters.studentCount.minNational,
//     };
//   }
//   if (filters.studentCount?.minInternational) {
//     mongoFilter["metadata.studentCount.international"] = {
//       $gte: filters.studentCount.minInternational,
//     };
//   }

//   return await searchWithMetadata(query, "universities", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Enhanced scholarship search with comprehensive filters
// export async function searchScholarships(
//   query: string,
//   filters: {
//     country?: string;
//     type?: string;
//     provider?: string;
//     deadline?: {
//       after?: string;
//       before?: string;
//     };
//     programs?: string[];
//     benefits?: string[];
//     numberOfScholarships?: {
//       min?: number;
//     };
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   if (filters.country) mongoFilter["metadata.country"] = filters.country;
//   if (filters.type) mongoFilter["metadata.type"] = filters.type;
//   if (filters.provider)
//     mongoFilter["metadata.provider"] = {
//       $regex: filters.provider,
//       $options: "i",
//     };

//   // Deadline filters
//   if (filters.deadline?.after) {
//     mongoFilter["metadata.deadline"] = { $gte: filters.deadline.after };
//   }
//   if (filters.deadline?.before) {
//     if (mongoFilter["metadata.deadline"]) {
//       (mongoFilter["metadata.deadline"] as Record<string, unknown>)["$lte"] =
//         filters.deadline.before;
//     } else {
//       mongoFilter["metadata.deadline"] = { $lte: filters.deadline.before };
//     }
//   }

//   // Programs filter
//   if (filters.programs && filters.programs.length > 0) {
//     mongoFilter["metadata.programs"] = { $in: filters.programs };
//   }

//   // Benefits filter
//   if (filters.benefits && filters.benefits.length > 0) {
//     mongoFilter["metadata.benefits"] = { $in: filters.benefits };
//   }

//   // Number of scholarships filter
//   if (filters.numberOfScholarships?.min) {
//     mongoFilter["metadata.numberOfScholarships"] = {
//       $gte: filters.numberOfScholarships.min,
//     };
//   }

//   return await searchWithMetadata(query, "scholarships", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Enhanced country search with comprehensive filters
// export async function searchCountries(
//   query: string,
//   filters: {
//     capital?: string;
//     language?: string;
//     currency?: string;
//     workRights?: {
//       whileStudying?: string;
//       afterStudy?: string;
//     };
//     livingCosts?: {
//       rentRange?: { min?: number; max?: number };
//       groceriesRange?: { min?: number; max?: number };
//     };
//     popularPrograms?: string[];
//     hasDocumentData?: boolean;
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   if (filters.capital)
//     mongoFilter["metadata.capital"] = {
//       $regex: filters.capital,
//       $options: "i",
//     };
//   if (filters.language)
//     mongoFilter["metadata.language"] = {
//       $regex: filters.language,
//       $options: "i",
//     };
//   if (filters.currency) mongoFilter["metadata.currency"] = filters.currency;

//   // Work rights filters
//   if (filters.workRights?.whileStudying) {
//     mongoFilter["metadata.workRights.whileStudying"] = {
//       $regex: filters.workRights.whileStudying,
//       $options: "i",
//     };
//   }
//   if (filters.workRights?.afterStudy) {
//     mongoFilter["metadata.workRights.afterStudy"] = {
//       $regex: filters.workRights.afterStudy,
//       $options: "i",
//     };
//   }

//   // Popular programs filter
//   if (filters.popularPrograms && filters.popularPrograms.length > 0) {
//     mongoFilter["metadata.popularPrograms"] = { $in: filters.popularPrograms };
//   }

//   // Document data availability filter
//   if (filters.hasDocumentData !== undefined) {
//     mongoFilter["metadata.hasDocumentData"] = filters.hasDocumentData;
//   }

//   return await searchWithMetadata(query, "countries", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Enhanced user search
// export async function searchUsers(
//   query: string,
//   filters: {
//     email?: string;
//     hasSuccessChanceData?: boolean;
//     nationality?: string;
//     studyLevel?: string;
//     majorSubject?: string;
//     preferredCountry?: string;
//     budgetRange?: {
//       min?: number;
//       max?: number;
//       currency?: string;
//     };
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   if (filters.email)
//     mongoFilter["metadata.email"] = { $regex: filters.email, $options: "i" };
//   if (filters.hasSuccessChanceData !== undefined) {
//     mongoFilter["metadata.hasSuccessChanceData"] = filters.hasSuccessChanceData;
//   }

//   // Success chance related filters
//   if (filters.nationality) {
//     mongoFilter["metadata.successChances.nationality"] = filters.nationality;
//   }
//   if (filters.studyLevel) {
//     mongoFilter["metadata.successChances.studyLevel"] = filters.studyLevel;
//   }
//   if (filters.majorSubject) {
//     mongoFilter["metadata.successChances.majorSubject"] = {
//       $regex: filters.majorSubject,
//       $options: "i",
//     };
//   }
//   if (filters.preferredCountry) {
//     mongoFilter["metadata.successChances.studyPreferenced.country"] =
//       filters.preferredCountry;
//   }

//   return await searchWithMetadata(query, "users", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Enhanced expense search
// export async function searchExpenses(
//   query: string,
//   filters: {
//     country?: string;
//     university?: string;
//     lifestyleType?: string;
//     currency?: string;
//     totalCostRange?: {
//       min?: number;
//       max?: number;
//     };
//   } = {},
//   options: SearchOptions = {}
// ) {
//   const mongoFilter: Record<string, unknown> = {};

//   if (filters.country) mongoFilter["metadata.country"] = filters.country;
//   if (filters.university)
//     mongoFilter["metadata.university"] = {
//       $regex: filters.university,
//       $options: "i",
//     };
//   if (filters.lifestyleType)
//     mongoFilter["metadata.lifestyles.type"] = filters.lifestyleType;
//   if (filters.currency)
//     mongoFilter["metadata.lifestyles.currency"] = filters.currency;

//   // Total cost range filter
//   if (filters.totalCostRange) {
//     const costFilter: Record<string, unknown> = {};
//     if (filters.totalCostRange.min !== undefined) {
//       costFilter["$gte"] = filters.totalCostRange.min;
//     }
//     if (filters.totalCostRange.max !== undefined) {
//       costFilter["$lte"] = filters.totalCostRange.max;
//     }
//     if (Object.keys(costFilter).length > 0) {
//       mongoFilter["metadata.lifestyles.costs.totalEstimatedCost.min"] =
//         costFilter;
//     }
//   }

//   return await searchWithMetadata(query, "expenses", {
//     ...options,
//     filter: mongoFilter,
//   });
// }

// // Get all domain vector stores
// export async function getAllDomainVectorStores() {
//   const stores = await Promise.all(
//     Object.keys(COLLECTION_CONFIG).map(async (domain) => ({
//       domain,
//       store: await getDomainVectorStore(
//         domain as keyof typeof COLLECTION_CONFIG
//       ),
//       config: COLLECTION_CONFIG[domain as keyof typeof COLLECTION_CONFIG],
//     }))
//   );
//   return stores;
// }

// // Get search statistics for a domain
// export async function getDomainStats(domain: keyof typeof COLLECTION_CONFIG) {
//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const collection = db.collection(COLLECTION_CONFIG[domain].name);

//   const stats = {
//     totalDocuments: await collection.countDocuments(),
//     domain,
//     collectionName: COLLECTION_CONFIG[domain].name,
//     searchableFields: COLLECTION_CONFIG[domain].searchableFields,
//   };

//   return stats;
// }

// // Get aggregated search statistics
// export async function getAllDomainStats() {
//   const domains = Object.keys(
//     COLLECTION_CONFIG
//   ) as (keyof typeof COLLECTION_CONFIG)[];
//   const statsPromises = domains.map(getDomainStats);
//   const stats = await Promise.all(statsPromises);

//   return {
//     totalDocuments: stats.reduce((sum, stat) => sum + stat.totalDocuments, 0),
//     domainStats: stats,
//     lastUpdated: new Date().toISOString(),
//   };
// }

// // Enhanced cache clearing functions
// export function clearDomainCache(domain?: keyof typeof COLLECTION_CONFIG) {
//   if (domain) {
//     vectorStoreCache.delete(`domain_${domain}`);
//   } else {
//     // Clear all domain caches
//     Object.keys(COLLECTION_CONFIG).forEach((d) => {
//       vectorStoreCache.delete(`domain_${d}`);
//     });
//   }
// }

// export function clearUserCache(userId?: string) {
//   if (userId) {
//     userVectorStoreCache.delete(`user_${userId}`);
//   } else {
//     userVectorStoreCache.clear();
//   }
// }

// // Clear all caches
// export function clearAllCaches() {
//   vectorStoreCache.clear();
//   userVectorStoreCache.clear();
// }

// // Export configuration for external use
// export { COLLECTION_CONFIG };
// export type { SearchOptions, SearchResult };
// utils/meta-index.ts;
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import clientPromise from "../mongodb";

// Collection configuration with enhanced metadata support
const COLLECTION_CONFIG = {
  countries: {
    name: "country_embeddings",
    indexName: "country_vector_index",
    priority: 0.3,
    searchableFields: [
      "country",
      "capital",
      "language",
      "currency",
      "workRights",
      "livingCosts",
      "popularPrograms",
    ],
  },
  universities: {
    name: "university_embeddings",
    indexName: "university_vector_index",
    priority: 0.4,
    searchableFields: [
      "title",
      "country",
      "location",
      "type",
      "ranking.qsWorldRanking",
      "ranking.timesHigherEducation",
      "establishmentYear",
      "acceptanceRate",
    ],
  },
  courses: {
    name: "course_embeddings",
    indexName: "course_vector_index",
    priority: 0.3,
    searchableFields: [
      "title",
      "country",
      "city",
      "degree",
      "subject",
      "university",
      "duration",
      "testScores",
      "annualTuitionFee",
    ],
  },
  scholarships: {
    name: "scholarship_embeddings",
    indexName: "scholarship_vector_index",
    priority: 0.2,
    searchableFields: [
      "title",
      "country",
      "type",
      "provider",
      "deadline",
      "programs",
      "numberOfScholarships",
      "benefits",
    ],
  },
  expenses: {
    name: "expense_embeddings",
    indexName: "expense_vector_index",
    priority: 0.1,
    searchableFields: ["country", "university", "lifestyles"],
  },
  users: {
    name: "user_embeddings",
    indexName: "user_vector_index",
    priority: 0.5,
    searchableFields: [
      "userId",
      "email",
      "userProfile",
      "successChances",
      "hasSuccessChanceData",
    ],
  },
  // NEW: Add visa guides configuration
  visaguides: {
    name: "visaguide_embeddings",
    indexName: "visaguide_vector_index",
    priority: 0.3,
    searchableFields: [
      "country_name",
      "country_id",
      "steps",
      "stepCount",
    ],
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

  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection("user_embeddings");

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "user_vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  userVectorStoreCache.set(cacheKey, vectorStore);
  return vectorStore;
}

// Enhanced search with metadata filtering
export async function searchWithMetadata(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  options: SearchOptions = {}
) {
  const vectorStore = await getDomainVectorStore(domain);
  const { filter = {}, limit = 10, similarityThreshold = 0.7 } = options;

  try {
    // Perform similarity search with metadata filter
    const results = await vectorStore.similaritySearchWithScore(
      query,
      limit,
      filter
    );

    // Filter by similarity threshold and format results
    const filteredResults: SearchResult[] = results
      .filter(([, score]) => score >= similarityThreshold)
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

// Multi-domain search with metadata filtering
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

// NEW: Enhanced visa guide search with comprehensive filters
export async function searchVisaGuides(
  query: string,
  filters: {
    country_name?: string;
    country_id?: string;
    stepCount?: {
      min?: number;
      max?: number;
    };

    hasSteps?: boolean;
    stepHeadings?: string[];
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  // Basic filters
  if (filters.country_name) {
    mongoFilter["metadata.country_name"] = {
      $regex: filters.country_name,
      $options: "i",
    };
  }
  if (filters.country_id) {
    mongoFilter["metadata.country_id"] = filters.country_id;
  }

  // Step count filters
  if (filters.stepCount) {
    const stepFilter: Record<string, unknown> = {};
    if (filters.stepCount.min !== undefined) {
      stepFilter["$gte"] = filters.stepCount.min;
    }
    if (filters.stepCount.max !== undefined) {
      stepFilter["$lte"] = filters.stepCount.max;
    }
    if (Object.keys(stepFilter).length > 0) {
      mongoFilter["metadata.stepCount"] = stepFilter;
    }
  }

  if (filters.hasSteps !== undefined) {
    mongoFilter["metadata.hasSteps"] = filters.hasSteps;
  }
  // Step headings filter
  if (filters.stepHeadings && filters.stepHeadings.length > 0) {
    mongoFilter["metadata.stepHeadings"] = {
      $in: filters.stepHeadings.map((heading) => new RegExp(heading, "i")),
    };
  }

  return await searchWithMetadata(query, "visaguides", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced course search with comprehensive filters
export async function searchCourses(
  query: string,
  filters: {
    country?: string;
    city?: string;
    degree?: string;
    subject?: string;
    university?: string;
    duration?: string;
    degreeFormat?: string;
    testScores?: {
      ielts?: string;
      pte?: string;
      toefl?: string;
    };
    tuitionFeeRange?: {
      min?: number;
      max?: number;
      currency?: string;
    };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  // Build MongoDB filter from the enhanced metadata fields
  if (filters.country) mongoFilter["metadata.country"] = filters.country;
  if (filters.city) mongoFilter["metadata.city"] = filters.city;
  if (filters.degree) mongoFilter["metadata.degree"] = filters.degree;
  if (filters.subject)
    mongoFilter["metadata.subject"] = {
      $regex: filters.subject,
      $options: "i",
    };
  if (filters.university)
    mongoFilter["metadata.university"] = {
      $regex: filters.university,
      $options: "i",
    };
  if (filters.duration) mongoFilter["metadata.duration"] = filters.duration;
  if (filters.degreeFormat)
    mongoFilter["metadata.degreeFormat"] = filters.degreeFormat;

  // Test score filters
  if (filters.testScores?.ielts)
    mongoFilter["metadata.testScores.ielts"] = filters.testScores.ielts;
  if (filters.testScores?.pte)
    mongoFilter["metadata.testScores.pte"] = filters.testScores.pte;
  if (filters.testScores?.toefl)
    mongoFilter["metadata.testScores.toefl"] = filters.testScores.toefl;

  // Tuition fee range filter
  if (filters.tuitionFeeRange) {
    const feeFilter: Record<string, unknown> = {};
    if (filters.tuitionFeeRange.min !== undefined) {
      feeFilter["$gte"] = filters.tuitionFeeRange.min;
    }
    if (filters.tuitionFeeRange.max !== undefined) {
      feeFilter["$lte"] = filters.tuitionFeeRange.max;
    }
    if (Object.keys(feeFilter).length > 0) {
      mongoFilter["metadata.annualTuitionFee.amount"] = feeFilter;
    }
    if (filters.tuitionFeeRange.currency) {
      mongoFilter["metadata.annualTuitionFee.currency"] =
        filters.tuitionFeeRange.currency;
    }
  }

  return await searchWithMetadata(query, "courses", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced university search with comprehensive filters
export async function searchUniversities(
  query: string,
  filters: {
    country?: string;
    location?: string;
    type?: string;
    establishmentYear?: {
      min?: number;
      max?: number;
    };
    ranking?: {
      qsWorldRanking?: { max?: number };
      timesHigherEducation?: { max?: number };
    };
    acceptanceRate?: {
      min?: string;
      max?: string;
    };
    studentCount?: {
      minNational?: number;
      minInternational?: number;
    };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.country) mongoFilter["metadata.country"] = filters.country;
  if (filters.location)
    mongoFilter["metadata.location"] = {
      $regex: filters.location,
      $options: "i",
    };
  if (filters.type) mongoFilter["metadata.type"] = filters.type;

  // Establishment year range
  if (filters.establishmentYear) {
    const yearFilter: Record<string, unknown> = {};
    if (filters.establishmentYear.min)
      yearFilter["$gte"] = filters.establishmentYear.min;
    if (filters.establishmentYear.max)
      yearFilter["$lte"] = filters.establishmentYear.max;
    if (Object.keys(yearFilter).length > 0) {
      mongoFilter["metadata.establishmentYear"] = yearFilter;
    }
  }

  // Ranking filters
  if (filters.ranking?.qsWorldRanking?.max) {
    mongoFilter["metadata.ranking.qsWorldRanking"] = {
      $lte: filters.ranking.qsWorldRanking.max,
    };
  }
  if (filters.ranking?.timesHigherEducation?.max) {
    mongoFilter["metadata.ranking.timesHigherEducation"] = {
      $lte: filters.ranking.timesHigherEducation.max,
    };
  }

  // Student count filters
  if (filters.studentCount?.minNational) {
    mongoFilter["metadata.studentCount.national"] = {
      $gte: filters.studentCount.minNational,
    };
  }
  if (filters.studentCount?.minInternational) {
    mongoFilter["metadata.studentCount.international"] = {
      $gte: filters.studentCount.minInternational,
    };
  }

  return await searchWithMetadata(query, "universities", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced scholarship search with comprehensive filters
export async function searchScholarships(
  query: string,
  filters: {
    country?: string;
    type?: string;
    provider?: string;
    deadline?: {
      after?: string;
      before?: string;
    };
    programs?: string[];
    benefits?: string[];
    numberOfScholarships?: {
      min?: number;
    };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.country) mongoFilter["metadata.country"] = filters.country;
  if (filters.type) mongoFilter["metadata.type"] = filters.type;
  if (filters.provider)
    mongoFilter["metadata.provider"] = {
      $regex: filters.provider,
      $options: "i",
    };

  // Deadline filters
  if (filters.deadline?.after) {
    mongoFilter["metadata.deadline"] = { $gte: filters.deadline.after };
  }
  if (filters.deadline?.before) {
    if (mongoFilter["metadata.deadline"]) {
      (mongoFilter["metadata.deadline"] as Record<string, unknown>)["$lte"] =
        filters.deadline.before;
    } else {
      mongoFilter["metadata.deadline"] = { $lte: filters.deadline.before };
    }
  }

  // Programs filter
  if (filters.programs && filters.programs.length > 0) {
    mongoFilter["metadata.programs"] = { $in: filters.programs };
  }

  // Benefits filter
  if (filters.benefits && filters.benefits.length > 0) {
    mongoFilter["metadata.benefits"] = { $in: filters.benefits };
  }

  // Number of scholarships filter
  if (filters.numberOfScholarships?.min) {
    mongoFilter["metadata.numberOfScholarships"] = {
      $gte: filters.numberOfScholarships.min,
    };
  }

  return await searchWithMetadata(query, "scholarships", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced country search with comprehensive filters
export async function searchCountries(
  query: string,
  filters: {
    capital?: string;
    language?: string;
    currency?: string;
    workRights?: {
      whileStudying?: string;
      afterStudy?: string;
    };
    livingCosts?: {
      rentRange?: { min?: number; max?: number };
      groceriesRange?: { min?: number; max?: number };
    };
    popularPrograms?: string[];
    hasDocumentData?: boolean;
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.capital)
    mongoFilter["metadata.capital"] = {
      $regex: filters.capital,
      $options: "i",
    };
  if (filters.language)
    mongoFilter["metadata.language"] = {
      $regex: filters.language,
      $options: "i",
    };
  if (filters.currency) mongoFilter["metadata.currency"] = filters.currency;

  // Work rights filters
  if (filters.workRights?.whileStudying) {
    mongoFilter["metadata.workRights.whileStudying"] = {
      $regex: filters.workRights.whileStudying,
      $options: "i",
    };
  }
  if (filters.workRights?.afterStudy) {
    mongoFilter["metadata.workRights.afterStudy"] = {
      $regex: filters.workRights.afterStudy,
      $options: "i",
    };
  }

  // Popular programs filter
  if (filters.popularPrograms && filters.popularPrograms.length > 0) {
    mongoFilter["metadata.popularPrograms"] = { $in: filters.popularPrograms };
  }

  // Document data availability filter
  if (filters.hasDocumentData !== undefined) {
    mongoFilter["metadata.hasDocumentData"] = filters.hasDocumentData;
  }

  return await searchWithMetadata(query, "countries", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced user search
export async function searchUsers(
  query: string,
  filters: {
    email?: string;
    hasSuccessChanceData?: boolean;
    nationality?: string;
    studyLevel?: string;
    majorSubject?: string;
    preferredCountry?: string;
    budgetRange?: {
      min?: number;
      max?: number;
      currency?: string;
    };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.email)
    mongoFilter["metadata.email"] = { $regex: filters.email, $options: "i" };
  if (filters.hasSuccessChanceData !== undefined) {
    mongoFilter["metadata.hasSuccessChanceData"] = filters.hasSuccessChanceData;
  }

  // Success chance related filters
  if (filters.nationality) {
    mongoFilter["metadata.successChances.nationality"] = filters.nationality;
  }
  if (filters.studyLevel) {
    mongoFilter["metadata.successChances.studyLevel"] = filters.studyLevel;
  }
  if (filters.majorSubject) {
    mongoFilter["metadata.successChances.majorSubject"] = {
      $regex: filters.majorSubject,
      $options: "i",
    };
  }
  if (filters.preferredCountry) {
    mongoFilter["metadata.successChances.studyPreferenced.country"] =
      filters.preferredCountry;
  }

  return await searchWithMetadata(query, "users", {
    ...options,
    filter: mongoFilter,
  });
}

// Enhanced expense search
export async function searchExpenses(
  query: string,
  filters: {
    country?: string;
    university?: string;
    lifestyleType?: string;
    currency?: string;
    totalCostRange?: {
      min?: number;
      max?: number;
    };
  } = {},
  options: SearchOptions = {}
) {
  const mongoFilter: Record<string, unknown> = {};

  if (filters.country) mongoFilter["metadata.country"] = filters.country;
  if (filters.university)
    mongoFilter["metadata.university"] = {
      $regex: filters.university,
      $options: "i",
    };
  if (filters.lifestyleType)
    mongoFilter["metadata.lifestyles.type"] = filters.lifestyleType;
  if (filters.currency)
    mongoFilter["metadata.lifestyles.currency"] = filters.currency;

  // Total cost range filter
  if (filters.totalCostRange) {
    const costFilter: Record<string, unknown> = {};
    if (filters.totalCostRange.min !== undefined) {
      costFilter["$gte"] = filters.totalCostRange.min;
    }
    if (filters.totalCostRange.max !== undefined) {
      costFilter["$lte"] = filters.totalCostRange.max;
    }
    if (Object.keys(costFilter).length > 0) {
      mongoFilter["metadata.lifestyles.costs.totalEstimatedCost.min"] =
        costFilter;
    }
  }

  return await searchWithMetadata(query, "expenses", {
    ...options,
    filter: mongoFilter,
  });
}

// NEW: Search across multiple domains with visa guides included
export async function searchAllDomains(
  query: string,
  options: SearchOptions & {
    includeVisaGuides?: boolean;
    prioritizeByDomain?: boolean;
  } = {}
) {
  const {
    includeVisaGuides = true,
    prioritizeByDomain = true,
    ...searchOptions
  } = options;

  const domains: (keyof typeof COLLECTION_CONFIG)[] = [
    "countries",
    "universities",
    "courses",
    "scholarships",
    "expenses",
    "users",
  ];

  if (includeVisaGuides) {
    domains.push("visaguides");
  }

  const results = await searchMultipleDomains(query, domains, searchOptions);

  if (prioritizeByDomain) {
    // Sort results by domain priority and then by score
    return results.sort((a, b) => {
      const priorityA =
        COLLECTION_CONFIG[a.domain as keyof typeof COLLECTION_CONFIG].priority;
      const priorityB =
        COLLECTION_CONFIG[b.domain as keyof typeof COLLECTION_CONFIG].priority;

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      return (b.score || 0) - (a.score || 0); // Higher score first within same priority
    });
  }

  return results;
}

// Get all domain vector stores
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

// Get search statistics for a domain
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

// Get aggregated search statistics
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

// Clear all caches
export function clearAllCaches() {
  vectorStoreCache.clear();
  userVectorStoreCache.clear();
}

// Export configuration for external use
export { COLLECTION_CONFIG };
export type { SearchOptions, SearchResult };
