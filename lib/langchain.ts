// /lib/langchain.ts
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import clientPromise from "./mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { Document } from "@langchain/core/documents";
import {
  getCachedVectorResults,
  cacheVectorResults,
  generateVectorKey,
} from "./redis";
import {  UserStore } from "@/store/useUserData";


type Filter = Record<string, unknown>;
type QueryParams = {
  message: string;
  userId?: string;
  conversationHistory?: { role: string; content: string }[];
  userData?: UserStore | null;
};
type QueryIntent = "study" | "greeting" | "general" | "unknown";
interface IntentResult {
  intent: QueryIntent;
  confidence: "high" | "medium" | "low";
}
// Enhanced collection configuration with better priorities
const COLLECTION_CONFIG = {
  courses: {
    name: "course_embeddings",
    indexName: "course_vector_index",
    priority: 0.6, // Increased priority for courses
    k: 20, // Increased k for more results
  },
  universities: {
    name: "university_embeddings",
    indexName: "university_vector_index",
    priority: 0.3,
    k: 10,
  },
  countries: {
    name: "country_embeddings",
    indexName: "country_vector_index",
    priority: 0.1,
    k: 5,
  },
};

// Vector store instances cache
const vectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();
const userVectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();

// Initialize embeddings instance
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});
function isGreeting(message: string): boolean {
  const greetingPatterns = [
    /^hi+\s*$/i,
    /^hello+\s*$/i,
    /^hey+\s*$/i,
    /^how are you\?*\s*$/i,
    /^good (morning|afternoon|evening)\s*$/i,
    /^(thanks|thank you|thankyou|ty)\s*$/i,
  ];

  return greetingPatterns.some((pattern) => pattern.test(message));
}
function classifyQueryIntent(
  message: string,
  userData?: UserStore | null
): IntentResult {
  const lowerMessage = message.toLowerCase().trim();

  // More specific study-related patterns
  const studyPatterns = [
    /\b(study|course|program|degree|university|college|admission|scholarship)\b/i,
    /\b(bachelor|master|phd|diploma|certificate)\b/i,
    /\b(biotechnology|engineering|physics|chemistry|biology|medicine|computer science|business)\b.*\b(course|program|degree|study)\b/i,
    /\b(suggest|recommend|find|looking for|search for|tell me about).*\b(course|program|university|college)\b/i,
    /\bwhat about\b.*\b(course|program|degree|study|university)\b/i,
    /\b(study abroad|international study|overseas study)\b/i,
    /\b(application|apply|requirements|eligibility|fees|tuition)\b/i,
    /\b(canada|usa|uk|australia|germany|italy).*\b(university|study|course)\b/i,
  ];

  // Non-study patterns (more specific)
  const nonStudyPatterns = [
    /\b(recipe|cooking|food|ingredient|how to make|how to cook)\b/i,
    /\b(weather|temperature|climate|forecast)\b/i,
    /\b(movie|music|song|book|game|entertainment)\b/i,
    /\b(news|current events|politics|sports)\b/i,
    /\b(joke|funny|humor|entertainment)\b/i,
    /\b(calculate|math|arithmetic|solve)\b.*\b(equation|problem|formula)\b/i,
    /\b(what is|define|explain|meaning of)\b.*\b(radius|diameter|distance|weight|height)\b/i,
    /\b(time|date|calendar|schedule)\b/i,
    /\b(health|medical|doctor|medicine)\b(?!.*\b(course|study|degree)\b)/i,
  ];

  // Check for non-study patterns first
  if (nonStudyPatterns.some((pattern) => pattern.test(lowerMessage))) {
    return { intent: "general", confidence: "high" };
  }

  // Check for study patterns
  if (studyPatterns.some((pattern) => pattern.test(lowerMessage))) {
    return { intent: "study", confidence: "high" };
  }

  // Greeting patterns
  if (isGreeting(lowerMessage)) {
    return { intent: "greeting", confidence: "high" };
  }

  // Context-based classification
  // If user has preferences and uses ambiguous terms, be more careful
  if (userData?.detailedInfo?.studyPreferenced) {
    // Check if the query is asking about a different subject than user's preference
    const userSubject =
      userData.detailedInfo.studyPreferenced.subject?.toLowerCase();
    const querySubjects = extractSubjectsFromQuery(lowerMessage);

    if (querySubjects.length > 0 && !querySubjects.includes(userSubject)) {
      // User is asking about a different subject - treat as study query but don't force preferences
      return { intent: "study", confidence: "medium" };
    }
  }

  return { intent: "general", confidence: "low" };
}
// Enhanced semantic search with flexible user preference handling
export async function flexibleSemanticSearch(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  userData?: UserStore | null,
  forceUserPreferences: boolean = false
): Promise<Document[]> {
  const client = await clientPromise;
  const db = client.db("wwah");
  const config = COLLECTION_CONFIG[domain];
  const collection = db.collection(config.name);

  // Build query - only enhance with user preferences if forced or query is generic
  let enhancedQuery = query;
  const isGenericQuery =
    /^(study abroad|tell me about|suggest|recommend|find|looking for)$/i.test(
      query.trim()
    );

  if (forceUserPreferences && userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;
    enhancedQuery = `${query} ${prefs.degree} ${prefs.subject} ${prefs.country}`;
  } else if (isGenericQuery && userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;
    enhancedQuery = `${prefs.degree} in ${prefs.subject} in ${prefs.country}`;
  }

  console.log(`🔍 Enhanced query for ${domain}: "${enhancedQuery}"`);

  try {
    const vectorStore = await getDomainVectorStore(domain);

    // Build filters more intelligently
    const filters = buildFlexibleFilters(
      query,
      domain,
      userData,
      forceUserPreferences
    );

    // Test if filters work
    const testCount = await collection.countDocuments(filters || {});
    console.log(`🧪 Filter test for ${domain}: ${testCount} documents match`);

    let results = [];

    if (testCount > 0) {
      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: filters,
      });
      results = await retriever.getRelevantDocuments(enhancedQuery);
      console.log(
        `✅ Found ${results.length} documents with filters for ${domain}`
      );
    } else {
      // Fallback to domain-only search
      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: { domain },
      });
      results = await retriever.getRelevantDocuments(enhancedQuery);
      console.log(
        `✅ Found ${results.length} documents with domain-only search for ${domain}`
      );
    }

    // Smart post-processing based on query content
    if (results.length > 0) {
      results = rankResultsByQueryRelevance(
        results,
        query,
        userData,
        forceUserPreferences
      );
    }

    return results;
  } catch (error) {
    console.error(`❌ Error in flexible semantic search for ${domain}:`, error);
    throw error;
  }
}

// Build filters that adapt to the query content
function buildFlexibleFilters(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  userData?: UserStore | null,
  forceUserPreferences: boolean = false
): Filter | undefined {
  const filters: Filter = { domain };

  console.log(
    `🔍 Building flexible filters for domain: ${domain}, query: "${query}"`
  );

  // Extract explicit preferences from query
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const queryDegree = detectDegreeFromQuery(query);
  const queryCountry = detectCountryFromQuery(query);

  if (domain === "courses") {
    // Use query-specific preferences first, then fall back to user preferences
    if (querySubjects.length > 0) {
      filters.subject = { $in: getSubjectVariations(querySubjects[0]) };
    } else if (
      forceUserPreferences &&
      userData?.detailedInfo?.studyPreferenced?.subject
    ) {
      filters.subject = {
        $in: getSubjectVariations(
          userData.detailedInfo.studyPreferenced.subject
        ),
      };
    }

    if (queryDegree) {
      filters.degree = { $in: getDegreeVariations(queryDegree) };
    } else if (
      forceUserPreferences &&
      userData?.detailedInfo?.studyPreferenced?.degree
    ) {
      filters.degree = {
        $in: getDegreeVariations(userData.detailedInfo.studyPreferenced.degree),
      };
    }

    if (queryCountry) {
      filters.country = queryCountry;
    } else if (
      forceUserPreferences &&
      userData?.detailedInfo?.studyPreferenced?.country
    ) {
      filters.country = userData.detailedInfo.studyPreferenced.country;
    }
  }

  if (domain === "universities") {
    if (queryCountry) {
      filters.country = queryCountry;
    } else if (
      forceUserPreferences &&
      userData?.detailedInfo?.studyPreferenced?.country
    ) {
      filters.country = userData.detailedInfo.studyPreferenced.country;
    }
  }

  if (domain === "countries") {
    if (queryCountry) {
      filters.country = queryCountry;
    } else if (
      forceUserPreferences &&
      userData?.detailedInfo?.studyPreferenced?.country
    ) {
      filters.country = userData.detailedInfo.studyPreferenced.country;
    }
  }

  console.log(
    `🔍 Flexible filters for ${domain}:`,
    JSON.stringify(filters, null, 2)
  );
  return filters;
}

// Get subject variations for better matching
function getSubjectVariations(subject: string): string[] {
  const variations: Record<string, string[]> = {
    physics: [
      "Physics",
      "physics",
      "BSc Physics",
      "BS Physics",
      "Bachelor of Science in Physics",
      "B.S. in Physics",
    ],
    biotechnology: [
      "Biotechnology",
      "biotechnology",
      "Biotech",
      "biotech",
      "Biological Technology",
      "Bio Technology",
    ],
    biology: [
      "Biology",
      "biology",
      "Biological Science",
      "Life Science",
      "Biological Studies",
    ],
    chemistry: [
      "Chemistry",
      "chemistry",
      "Chemical Science",
      "Chemical Engineering",
    ],
    engineering: ["Engineering", "engineering", "Engineer", "Technical"],
    "computer science": [
      "Computer Science",
      "computer science",
      "CS",
      "Computing",
      "Software Engineering",
    ],
    business: [
      "Business",
      "business",
      "Business Administration",
      "Management",
      "Commerce",
    ],
    medicine: [
      "Medicine",
      "medicine",
      "Medical",
      "Healthcare",
      "Health Sciences",
    ],
  };

  const lowerSubject = subject.toLowerCase();
  return (
    variations[lowerSubject] || [
      subject,
      subject.toLowerCase(),
      subject.toUpperCase(),
    ]
  );
}

// Get degree variations for better matching
function getDegreeVariations(degree: string): string[] {
  const variations: Record<string, string[]> = {
    Bachelor: [
      "Bachelor",
      "bachelor",
      "Bachelor's",
      "BS",
      "BSc",
      "BA",
      "B.S.",
      "B.A.",
      "Undergraduate",
    ],
    Master: [
      "Master",
      "master",
      "Master's",
      "MS",
      "MSc",
      "MA",
      "M.S.",
      "M.A.",
      "Graduate",
    ],
    PhD: [
      "PhD",
      "phd",
      "Ph.D.",
      "Doctorate",
      "doctorate",
      "Doctoral",
      "Doctor",
    ],
    Diploma: [
      "Diploma",
      "diploma",
      "Certificate",
      "certificate",
      "Advanced Diploma",
    ],
  };

  return (
    variations[degree] || [degree, degree.toLowerCase(), degree.toUpperCase()]
  );
}

// Rank results by query relevance
function rankResultsByQueryRelevance(
  results: Document[],
  query: string,
  userData?: UserStore | null,
  forceUserPreferences: boolean = false
): Document[] {
  const lowerQuery = query.toLowerCase();
  const querySubjects = extractSubjectsFromQuery(lowerQuery);
  const queryDegree = detectDegreeFromQuery(query);
  const queryCountry = detectCountryFromQuery(query);

  return results
    .map((doc) => {
      const content = doc.pageContent.toLowerCase();
      let score = 0;

      // Score based on query-specific terms (higher priority)
      if (querySubjects.length > 0) {
        querySubjects.forEach((subject) => {
          if (content.includes(subject)) score += 5;
        });
      }

      if (queryDegree && content.includes(queryDegree.toLowerCase())) {
        score += 3;
      }

      if (queryCountry && content.includes(queryCountry.toLowerCase())) {
        score += 3;
      }

      // Score based on user preferences (lower priority unless forced)
      if (forceUserPreferences && userData?.detailedInfo?.studyPreferenced) {
        const prefs = userData.detailedInfo.studyPreferenced;

        if (prefs.subject && content.includes(prefs.subject.toLowerCase())) {
          score += 2;
        }
        if (prefs.degree && content.includes(prefs.degree.toLowerCase())) {
          score += 2;
        }
        if (prefs.country && content.includes(prefs.country.toLowerCase())) {
          score += 2;
        }
      }

      return { ...doc, relevanceScore: score };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Enhanced query processing with better context selection
export async function queryDocumentsWithFlexibleContext(
  query: string,
  userData: UserStore | null = null,
  userId: string = ""
) {
  console.log(`🔍 Processing flexible query: "${query}"`);
  console.log(`👤 User ID: ${userId}`);

  // Determine if we should force user preferences
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const userPreferredSubject =
    userData?.detailedInfo?.studyPreferenced?.subject?.toLowerCase();
  const forceUserPreferences =
    !querySubjects.length ||
    (userPreferredSubject && querySubjects.includes(userPreferredSubject));

  console.log(`🎯 Force user preferences: ${forceUserPreferences}`);

  // Check for cached results
  const cacheKey = generateVectorKey(query, userId);
  const cachedResults = await getCachedVectorResults(cacheKey);
  if (cachedResults) {
    console.log("✅ Returning cached results");
    return cachedResults;
  }

  // Create smart ensemble retriever with flexible approach
  const detectedDomains = detectQueryDomains(query, userData);
  const retrievers = [];
  const weights = [];

  // Add domain-specific retrievers with flexible search
  for (const domain of detectedDomains) {
    try {
      const documents = await flexibleSemanticSearch(
        query,
        domain,
        userData,
        forceUserPreferences || undefined
      );

      if (documents.length > 0) {
        const vectorStore = await getDomainVectorStore(domain);
        const config = COLLECTION_CONFIG[domain];

        const retriever = vectorStore.asRetriever({
          k: config.k,
          filter: { domain },
        });

        retrievers.push(retriever);
        weights.push(config.priority);
        console.log(
          `✅ Added ${domain} retriever (k=${config.k}, docs=${documents.length})`
        );
      }
    } catch (error) {
      console.error(`❌ Failed to add ${domain} retriever:`, error);
    }
  }

  if (retrievers.length === 0) {
    throw new Error("No retrievers could be initialized");
  }

  // Normalize weights
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map((weight) => weight / totalWeight);

  const ensembleRetriever = new EnsembleRetriever({
    retrievers,
    weights: normalizedWeights,
  });

  // Get results
  const retrievalResults = await ensembleRetriever.getRelevantDocuments(query);
  console.log(`🧪 Retriever returned ${retrievalResults.length} documents`);

  // Filter results based on query relevance
  const filteredResults = filterResultsByQueryRelevance(
    retrievalResults,
    query
  );

  console.log(`📊 Filtered to ${filteredResults.length} relevant documents`);

  // Use the enhanced prompt template
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
    topP: 0.9,
  });

  const promptTemplate = createFlexiblePromptTemplate(
    query,
    userData,
    !!forceUserPreferences
  );

  const chain = RetrievalQAChain.fromLLM(model, ensembleRetriever, {
    returnSourceDocuments: true,
    prompt: promptTemplate,
  });

  try {
    const organizedContext = organizeContextByRelevance(filteredResults, query);

    const response = await chain.invoke({
      query: query,
      context: organizedContext,
      userPreferences: userData?.detailedInfo?.studyPreferenced
        ? JSON.stringify(userData.detailedInfo.studyPreferenced)
        : "None specified",
    });

    await cacheVectorResults(cacheKey, response.text);
    console.log("✅ Query processed successfully");
    return response.text;
  } catch (error) {
    console.error("❌ Error in flexible query processing:", error);
    throw error;
  }
}

// Filter results by query relevance
function filterResultsByQueryRelevance(
  results: Document[],
  query: string
): Document[] {
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const queryDegree = detectDegreeFromQuery(query);
  const queryCountry = detectCountryFromQuery(query);

  if (querySubjects.length === 0 && !queryDegree && !queryCountry) {
    // Generic query - use user preferences if available
    return results;
  }

  // Filter for query-specific content
  const relevantResults = results.filter((doc) => {
    const content = doc.pageContent.toLowerCase();

    // Check if document matches query-specific criteria
    const matchesSubject =
      querySubjects.length === 0 ||
      querySubjects.some((subject) => content.includes(subject));
    const matchesDegree =
      !queryDegree || content.includes(queryDegree.toLowerCase());
    const matchesCountry =
      !queryCountry || content.includes(queryCountry.toLowerCase());

    return matchesSubject && matchesDegree && matchesCountry;
  });

  console.log(
    `📊 Query-specific filtering: ${relevantResults.length} out of ${results.length} documents match`
  );

  return relevantResults.length > 0 ? relevantResults : results.slice(0, 10);
}

// Create flexible prompt template
function createFlexiblePromptTemplate(
  query: string,
  userData?: UserStore | null,
  forceUserPreferences: boolean = false
): PromptTemplate {
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const hasQuerySpecificContent =
    querySubjects.length > 0 ||
    detectDegreeFromQuery(query) ||
    detectCountryFromQuery(query);

  const baseInstructions = `You are ZEUS, an AI assistant specialized in university and study abroad information.

CRITICAL INSTRUCTIONS:
1. **Answer EXACTLY what the user asks** - don't add information about unrelated topics
2. **Focus on the query content** - prioritize information that directly answers the question
3. **Be specific and detailed** - include exact names, requirements, and fees from the context
4. **Provide actionable information** - include application details and next steps when relevant`;

  let userPreferenceSection = "";
  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;

    if (forceUserPreferences && !hasQuerySpecificContent) {
      userPreferenceSection = `
🎯 USER PREFERENCES (Use these since query is generic):
- Preferred Country: ${prefs.country}
- Preferred Degree: ${prefs.degree}
- Preferred Subject: ${prefs.subject}
- Nationality: ${userData.detailedInfo.nationality}`;
    } else if (hasQuerySpecificContent) {
      userPreferenceSection = `
📋 User Background (for context only):
- User prefers: ${prefs.degree} in ${prefs.subject} in ${prefs.country}
- But they're asking about something specific, so focus on their query`;
    }
  }

  return new PromptTemplate({
    inputVariables: ["question", "context", "userPreferences"],
    template: `${baseInstructions}

${userPreferenceSection}

5. **If the user asks about a specific subject/topic, focus ONLY on that topic**
6. **Don't mention the user's general preferences unless directly relevant**
7.If a user asks anything about the application process or how to apply etc give them this clickable link to the dashboard http://localhost:3000/dashboard/overview

Question: {question}

Available Information:
{context}

Please provide a focused response that directly answers the user's question:`,
  });
}

// Organize context by relevance to query
function organizeContextByRelevance(
  results: Document[],
  query: string
): string {
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const queryDegree = detectDegreeFromQuery(query);

  let organizedContext = "";

  // Group results by relevance
  const highRelevance = results.filter((doc) => {
    const content = doc.pageContent.toLowerCase();
    return (
      querySubjects.some((subject) => content.includes(subject)) ||
      (queryDegree && content.includes(queryDegree.toLowerCase()))
    );
  });

  type ScoredDocument = Document & { relevanceScore?: number };

  const mediumRelevance = results.filter(
    (doc) =>
      !highRelevance.includes(doc) &&
      typeof (doc as ScoredDocument).relevanceScore === "number" &&
      ((doc as ScoredDocument).relevanceScore ?? 0) > 0
  );

  // Add high relevance results first
  if (highRelevance.length > 0) {
    organizedContext += "\n=== MOST RELEVANT INFORMATION ===\n";
    highRelevance.forEach((doc, index) => {
      organizedContext += `\n--- Result ${index + 1} ---\n${doc.pageContent}\n`;
    });
  }

  // Add medium relevance results
  if (mediumRelevance.length > 0) {
    organizedContext += "\n=== ADDITIONAL RELEVANT INFORMATION ===\n";
    mediumRelevance.slice(0, 3).forEach((doc, index) => {
      organizedContext += `\n--- Additional ${index + 1} ---\n${
        doc.pageContent
      }\n`;
    });
  }

  return organizedContext || "No relevant information found in the database.";
}
function extractSubjectsFromQuery(query: string): string[] {
  const subjects = [
    "biotechnology",
    "biotech",
    "biology",
    "physics",
    "chemistry",
    "mathematics",
    "engineering",
    "computer science",
    "business",
    "medicine",
    "law",
    "psychology",
    "economics",
    "arts",
    "literature",
    "history",
    "geography",
    "sociology",
  ];

  return subjects.filter(
    (subject) =>
      query.includes(subject) || query.includes(subject.replace(" ", ""))
  );
}
export async function handleStudyQueryWithSubjectDetection(params: {
  message: string;
  userData?: UserStore | null;
  userId?: string;
  conversationHistory?: { role: string; content: string }[];
}): Promise<string> {
  const { message, userData, userId, conversationHistory = [] } = params;

  // Detect if user is asking about a different subject
  const querySubjects = extractSubjectsFromQuery(message.toLowerCase());
  const userPreferredSubject =
    userData?.detailedInfo?.studyPreferenced?.subject?.toLowerCase();

  // Determine if we should use user preferences or query-specific search
  const shouldUseUserPreferences =
    !querySubjects.length ||
    (userPreferredSubject && querySubjects.includes(userPreferredSubject));

  if (shouldUseUserPreferences) {
    // Use existing logic with user preferences
    return await queryDocumentsWithUserContext(
      message,
      userData || null,
      userId || "",
      conversationHistory
    );
  } else {
    // Create temporary user data with query-specific preferences
    const querySpecificUserData = createQuerySpecificUserData(
      message,
      userData
    );
    return await queryDocumentsWithUserContext(
      message,
      querySpecificUserData,
      userId || "",
      conversationHistory
    );
  }
}
function createQuerySpecificUserData(
  query: string,
  originalUserData?: UserStore | null
): UserStore | null {
  const querySubjects = extractSubjectsFromQuery(query.toLowerCase());
  const detectedDegree = detectDegreeFromQuery(query);
  const detectedCountry = detectCountryFromQuery(query);

  if (querySubjects.length === 0) {
    return originalUserData ?? null;
  }

  const querySpecificData: UserStore = {
    user: {
      _id: originalUserData?.user?._id || "",
      firstName: originalUserData?.user?.firstName || "Guest",
      lastName: originalUserData?.user?.lastName || "",
      email: originalUserData?.user?.email || "",
      phone: originalUserData?.user?.phone || 0,
      gender: originalUserData?.user?.gender || "",
      createdAt: originalUserData?.user?.createdAt || new Date().toISOString(),
      updatedAt: originalUserData?.user?.updatedAt || new Date().toISOString(),
    },
    detailedInfo: {
      dateOfBirth: originalUserData?.detailedInfo?.dateOfBirth || "",
      grade: originalUserData?.detailedInfo?.grade || 0,
      gradeType: originalUserData?.detailedInfo?.gradeType || "",
      languageProficiency: originalUserData?.detailedInfo
        ?.languageProficiency || {
        test: "",
        score: "",
      },
      livingCosts: originalUserData?.detailedInfo?.livingCosts || {
        currency: "",
        amount: 0,
      },
      majorSubject: originalUserData?.detailedInfo?.majorSubject || "",
      nationality: originalUserData?.detailedInfo?.nationality || "",
      studyLevel: originalUserData?.detailedInfo?.studyLevel || "",
      tuitionFee: originalUserData?.detailedInfo?.tuitionFee || {
        currency: "",
        amount: 0,
      },
      updatedAt: originalUserData?.detailedInfo?.updatedAt || "",
      workExperience: originalUserData?.detailedInfo?.workExperience || 0,
      ...originalUserData?.detailedInfo,
      studyPreferenced: {
        subject:
          querySubjects[0].charAt(0).toUpperCase() + querySubjects[0].slice(1),
        degree:
          detectedDegree ||
          originalUserData?.detailedInfo?.studyPreferenced?.degree ||
          "Bachelor",
        country:
          detectedCountry ||
          originalUserData?.detailedInfo?.studyPreferenced?.country ||
          "Canada",
      },
    },
    loading: false,
    error: null,
    isAuthenticated: false,
    fetchUserProfile: async () => {},
    updateUserProfile: async () => {},
    updateDetailedInfo: async () => {},
    setUser: () => {},
    logout: () => {},
  };

  return querySpecificData;
}
// Detect degree type from query
function detectDegreeFromQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  if (/\b(diploma|certificate)\b/i.test(lowerQuery)) return "Diploma";
  if (/\b(bachelor|undergraduate|bs|ba|bsc)\b/i.test(lowerQuery))
    return "Bachelor";
  if (/\b(master|graduate|ms|ma|msc)\b/i.test(lowerQuery)) return "Master";
  if (/\b(phd|doctorate|doctoral)\b/i.test(lowerQuery)) return "PhD";

  return null;
}

// Detect country from query
function detectCountryFromQuery(query: string): string | null {
  const countries = [
    "canada",
    "usa",
    "uk",
    "australia",
    "germany",
    "italy",
    "france",
  ];
  const lowerQuery = query.toLowerCase();

  for (const country of countries) {
    if (lowerQuery.includes(country)) {
      return country.charAt(0).toUpperCase() + country.slice(1);
    }
  }

  return null;
}
async function handleGreeting(params: {
  message: string;
  userData?: UserStore | null;
}): Promise<string> {
  const { userData, message } = params;
  const userName = userData?.user?.firstName || "there";
  const hasValidUser = !!(userData?.user?._id && userData?.user?.firstName);
  const hasValidDetailedInfo = !!(
    userData?.detailedInfo &&
    userData.detailedInfo.studyPreferenced &&
    userData.detailedInfo.studyPreferenced.country &&
    userData.detailedInfo.studyPreferenced.degree &&
    userData.detailedInfo.studyPreferenced.subject
  );

  const lowerMessage = message.toLowerCase().trim();

  if (/^(hi+|hello+|hey+)\s*$/i.test(lowerMessage)) {
    const greeting = hasValidUser
      ? hasValidDetailedInfo
        ? `Hello ${userName}! 👋 I can see your study preferences. How can I help you today?`
        : `Hello ${userName}! 👋 How can I help you with your university or scholarship search today?`
      : "Hello there! 👋 How can I help you with your university or scholarship search today?";

    return (
      greeting +
      " I can provide detailed information about countries, universities, courses, and scholarships! 🎓"
    );
  }

  if (/^how are you\?*\s*$/i.test(lowerMessage)) {
    const personalizedPart = hasValidUser
      ? `Nice to see you again, ${userName}! 🌟`
      : "I'm doing great, thanks for asking! 🌟";

    return (
      personalizedPart +
      " I'm ready to help you with comprehensive information about universities, courses, scholarships, and study abroad opportunities. What would you like to know? 🎓"
    );
  }

  if (/^(thanks|thank you|thankyou|ty)\s*$/i.test(lowerMessage)) {
    const personalizedPart = hasValidUser
      ? `You're welcome, ${userName}! 😊`
      : "You're welcome! 😊";

    return (
      personalizedPart +
      " Is there anything else I can help you with regarding your study abroad journey? I'm here to assist with universities, courses, or any other questions you might have! 🎓"
    );
  }

  // Default greeting fallback
  const fallback = hasValidUser ? `Hello ${userName}! 🌍` : "Hello there! 🌍";
  return (
    fallback +
    " How can I assist you today? I can provide detailed information about universities, courses, scholarships, and countries for studying abroad! ✨"
  );
}

// Create a dedicated model for general queries
const generalQueryModel = new ChatOpenAI({
  modelName: "gpt-4o-mini", // Use mini for cost efficiency on general queries
  temperature: 0.7,
  maxTokens: 500, // Limit response length
});

// Enhanced general query handler
async function handleGeneralQuery(params: {
  message: string;
  userData?: UserStore | null;
}): Promise<string> {
  const { message, userData } = params;
  const userName = userData?.user?.firstName || "";

  // Create a smart prompt that can handle any general query
  const generalPrompt = new PromptTemplate({
    inputVariables: ["query", "userName"],
    template: `You are ZEUS, a helpful AI assistant. You specialize in university and study abroad information, but you can also help with general questions.

User Query: {query}
${userName ? `User Name: ${userName}` : ""}

Instructions:
1. Answer the user's question helpfully and accurately
2. Keep your response concise (under 300 words)
3. At the end, gently remind them that you specialize in university/study abroad information
4. If appropriate, ask if they need help with studies/universities
5. Be friendly and personable${userName ? ` (use their name: ${userName})` : ""}
6.If a user asks anything about the application process or how to apply etc give them this clickable link to the dashboard http://localhost:3000/dashboard/overview

Example transitions:
- "Hope this helps! By the way, I specialize in university applications and study abroad guidance. Need any help with that?"
- "There you go! I'm also great at helping with course recommendations and university searches if you're interested."

Please provide a helpful response:`,
  });

  try {
    // Use the general model to generate a response
    const response = await generalQueryModel.invoke(
      await generalPrompt.format({
        query: message,
        userName: userName,
      })
    );

    return response.content as string;
  } catch (error) {
    console.error("❌ Error in general query handler:", error);

    // Fallback to basic response if OpenAI fails
    return `I'd be happy to help, but I'm having trouble processing that right now. ${
      userName ? `${userName}, ` : ""
    } I specialize in university applications and study abroad information. Is there anything about studying abroad or universities I can help you with instead? 🎓`;
  }
}

// Alternative approach: Use a more sophisticated classification system
async function handleGeneralQueryWithClassification(params: {
  message: string;
  userData?: UserStore | null;
}): Promise<string> {
  const { message, userData } = params;
  const userName = userData?.user?.firstName || "";

  // First, determine what type of general query this is
  const classificationPrompt = new PromptTemplate({
    inputVariables: ["query"],
    template: `Classify this query into one of these categories:
- recipe: cooking, food recipes, ingredients
- math: calculations, math problems, conversions
- general_knowledge: facts, definitions, explanations
- weather: weather, temperature, climate
- entertainment: movies, music, books, games
- technology: tech help, programming (non-educational)
- health: health advice, medical questions
- other: anything else

Query: {query}

Respond with just the category name:`,
  });

  try {
    const classificationResponse = await generalQueryModel.invoke(
      await classificationPrompt.format({ query: message })
    );

    const category = (classificationResponse.content as string)
      .toLowerCase()
      .trim();

    // Create specialized responses based on category
    const specializedPrompt = new PromptTemplate({
      inputVariables: ["query", "category", "userName"],
      template: `You are ZEUS, a helpful AI assistant specializing in university and study abroad information.

The user asked a ${category} question: {query}
${userName ? `User Name: ${userName}` : ""}

Instructions:
1. Provide a helpful, accurate answer to their ${category} question
2. Keep it concise but informative
3. Be friendly and use their name if provided
4. End with a gentle transition to your specialty area

Specialized endings based on category:
- recipe: "Enjoy cooking! By the way, if you're interested in culinary arts programs or hospitality management courses abroad, I'd love to help with that too!"
- math: "Hope that helps with the math! I also help students find engineering and mathematics programs at universities worldwide if you're interested."
- general_knowledge: "Interesting question! I specialize in university applications and study abroad guidance. Any academic programs you're curious about?"
- weather: "For current weather, check your weather app. I'm great at helping with university applications and study abroad planning though!"
- entertainment: "Great topic! I also help with media studies, film programs, and other creative courses at universities. Interested in studying abroad?"
- technology: "Tech questions are always interesting! I specialize in helping students find computer science and engineering programs worldwide if you're looking to study."
- health: "Health is important! I also help students find medical programs, nursing courses, and health sciences degrees abroad if you're interested."
- other: "I'm here to help! I specialize in university applications and study abroad information. Anything in that area I can assist with?"

Please provide a helpful response:`,
    });

    const response = await generalQueryModel.invoke(
      await specializedPrompt.format({
        query: message,
        category: category,
        userName: userName,
      })
    );

    return response.content as string;
  } catch (error) {
    console.error("❌ Error in classified general query handler:", error);

    // Fallback to simple general handler
    return handleGeneralQuery(params);
  }
}

// Enhanced classification function that works with the existing system
function enhanceGeneralQueryClassification(message: string): {
  isDefinitelyGeneral: boolean;
  category: string;
  confidence: number;
} {
  const lowerMessage = message.toLowerCase();

  // High confidence general patterns
  const definitelyGeneral = [
    {
      pattern:
        /recipe|cooking|how to make|how to cook|ingredients|food preparation/i,
      category: "recipe",
      confidence: 0.9,
    },
    {
      pattern: /weather|temperature|climate|forecast|rain|snow|sunny/i,
      category: "weather",
      confidence: 0.9,
    },
    {
      pattern: /calculate|solve|math|arithmetic|equation|formula|convert/i,
      category: "math",
      confidence: 0.8,
    },
    {
      pattern: /movie|film|song|music|book|novel|game|entertainment/i,
      category: "entertainment",
      confidence: 0.8,
    },
    {
      pattern: /joke|funny|humor|tell me something funny/i,
      category: "entertainment",
      confidence: 0.9,
    },
    {
      pattern: /health|medical|doctor|symptoms|treatment/i,
      category: "health",
      confidence: 0.7,
    },
    {
      pattern: /news|politics|current events|sports/i,
      category: "news",
      confidence: 0.8,
    },
    {
      pattern: /what is|define|explain|meaning of|tell me about/i,
      category: "general_knowledge",
      confidence: 0.6,
    },
  ];

  for (const item of definitelyGeneral) {
    if (item.pattern.test(lowerMessage)) {
      return {
        isDefinitelyGeneral: true,
        category: item.category,
        confidence: item.confidence,
      };
    }
  }

  return {
    isDefinitelyGeneral: false,
    category: "unknown",
    confidence: 0.0,
  };
}

// Replace the existing handleGeneralQuery function with this enhanced version
export async function handleEnhancedGeneralQuery(params: {
  message: string;
  userData?: UserStore | null;
}): Promise<string> {
  const { message } = params;

  // Check if this is definitely a general query
  const classification = enhanceGeneralQueryClassification(message);

  if (classification.isDefinitelyGeneral && classification.confidence > 0.7) {
    // Use the sophisticated classification approach
    return handleGeneralQueryWithClassification(params);
  } else {
    // Use the simple general approach
    return handleGeneralQuery(params);
  }
}

// Integration point: Update your existing handleUnifiedQuery function
export async function handleUnifiedQueryEnhanced(
  params: QueryParams
): Promise<string> {
  const { intent, confidence } = classifyQueryIntent(
    params.message,
    params.userData
  );

  console.log(`🎯 Classified intent: ${intent} (confidence: ${confidence})`);

  switch (intent) {
    case "greeting":
      return handleGreeting(params);
    case "study":
      return handleStudyQueryWithSubjectDetection(params);
    case "general":
      // Use the enhanced general query handler
      return handleEnhancedGeneralQuery(params);
    default:
      // For unknown intents, try the enhanced general handler first
      if (confidence === "low") {
        return handleEnhancedGeneralQuery(params);
      }
      return `I'm not sure I understand what you're looking for. I specialize in helping with university applications, study abroad information, and course recommendations. Could you please ask me something specific about studying abroad or universities? 🎓`;
  }
}

export async function handleUnifiedQuery(params: QueryParams): Promise<string> {
  const { intent, confidence } = classifyQueryIntent(
    params.message,
    params.userData
  );

  console.log(`🎯 Classified intent: ${intent} (confidence: ${confidence})`);

  switch (intent) {
    case "greeting":
      return handleGreeting(params);
    case "study":
      return handleStudyQueryWithSubjectDetection(params);
    case "general":
      return handleGeneralQuery(params);
    default:
      // For unknown intents with low confidence, ask for clarification
      return `I'm not sure I understand what you're looking for. I specialize in helping with university applications, study abroad information, and course recommendations. Could you please ask me something specific about studying abroad or universities? 🎓`;
  }
}
// Get specific domain vector store
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
  const docCount = await collection.countDocuments();
  console.log(`📊 Collection ${config.name} has ${docCount} documents`);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: config.indexName,
    textKey: "text",
    embeddingKey: "embedding",
  });

  vectorStoreCache.set(cacheKey, vectorStore);
  return vectorStore;
}
export function buildLangChainFilters(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  userData?: UserStore | null
): Filter | undefined {
  const filters: Filter = {};

  console.log(`🔍 Building filters for domain: ${domain}, query: "${query}"`);

  // Always add domain filter
  filters.domain = domain;

  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;

    if (domain === "courses") {
      // For courses, use exact metadata field names as per your vector index
      if (prefs.country && prefs.country.trim()) {
        filters.country = prefs.country.trim();
      }

      if (prefs.degree) {
        // Use exact degree matching first, then fallback to variations
        const degreeVariations: Record<string, string[]> = {
          Bachelor: [
            "Bachelor",
            "bachelor",
            "Bachelor's",
            "BS",
            "BSc",
            "BA",
            "B.S.",
            "B.A.",
          ],
          Master: [
            "Master",
            "master",
            "Master's",
            "MS",
            "MSc",
            "MA",
            "M.S.",
            "M.A.",
          ],
          PhD: ["PhD", "phd", "Doctorate", "doctorate", "Ph.D.", "Doctor"],
        };

        const userDegree = prefs.degree;
        if (degreeVariations[userDegree]) {
          filters.degree = { $in: degreeVariations[userDegree] };
        } else {
          filters.degree = userDegree;
        }
      }

      if (prefs.subject && prefs.subject.trim()) {
        // For Physics, also include variations
        const subjectVariations: Record<string, string[]> = {
          Physics: [
            "Physics",
            "physics",
            "BSc Physics",
            "BS Physics",
            "Bachelor of Science in Physics",
            "B.S. in Physics",
          ],
        };

        const userSubject = prefs.subject;
        if (subjectVariations[userSubject]) {
          filters.subject = { $in: subjectVariations[userSubject] };
        } else {
          filters.subject = userSubject;
        }
      }
    }

    if (domain === "universities") {
      if (prefs.country && prefs.country.trim()) {
        filters.country = prefs.country.trim();
      }
    }

    if (domain === "countries") {
      if (prefs.country && prefs.country.trim()) {
        filters.country = prefs.country.trim();
      }
    }
  }

  console.log(
    `🔍 Final filters for ${domain}:`,
    JSON.stringify(filters, null, 2)
  );
  return filters;
}
export async function semanticSearchWithUserPreferences(
  query: string,
  domain: keyof typeof COLLECTION_CONFIG,
  userData?: UserStore | null
): Promise<Document[]> {
  const client = await clientPromise;
  const db = client.db("wwah");
  const config = COLLECTION_CONFIG[domain];
  const collection = db.collection(config.name);

  // Build enhanced query with user preferences
  let enhancedQuery = query;
  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;

    // Weight user preferences heavily in the search query
    enhancedQuery = `${query} ${prefs.degree} ${prefs.subject} ${prefs.country}`;

    // For specific study abroad queries, be more explicit
    if (
      query.toLowerCase().includes("study abroad") ||
      query.toLowerCase().includes("suggest")
    ) {
      enhancedQuery = `${prefs.degree} in ${prefs.subject} in ${prefs.country} university course program`;
    }
  }

  console.log(`🔍 Enhanced query for ${domain}: "${enhancedQuery}"`);

  try {
    const vectorStore = await getDomainVectorStore(domain);

    // First, try with user preference filters
    const filters = buildLangChainFilters(query, domain, userData);

    // Test if filters work
    const testCount = await collection.countDocuments(filters || {});
    console.log(`🧪 Filter test for ${domain}: ${testCount} documents match`);

    let results = [];

    if (testCount > 0) {
      // Use filters if they work
      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: filters,
      });
      results = await retriever.getRelevantDocuments(enhancedQuery);
      console.log(
        `✅ Found ${results.length} documents with filters for ${domain}`
      );
    } else {
      // Fallback to semantic search only with domain filter
      console.log(
        `⚠️ No documents match filters for ${domain}, using semantic search only`
      );
      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: { domain },
      });
      results = await retriever.getRelevantDocuments(enhancedQuery);
      console.log(
        `✅ Found ${results.length} documents with semantic search for ${domain}`
      );
    }

    // ENHANCED: Post-process results to prioritize user preferences
    if (userData?.detailedInfo?.studyPreferenced && results.length > 0) {
      const prefs = userData.detailedInfo.studyPreferenced;

      results = results
        .map((doc) => {
          const content = doc.pageContent.toLowerCase();
          let score = 0;

          // Score based on user preferences
          if (prefs.country && content.includes(prefs.country.toLowerCase())) {
            score += 3;
          }
          if (prefs.subject && content.includes(prefs.subject.toLowerCase())) {
            score += 3;
          }
          if (prefs.degree && content.includes(prefs.degree.toLowerCase())) {
            score += 2;
          }

          return { ...doc, userPreferenceScore: score };
        })
        .sort((a, b) => b.userPreferenceScore - a.userPreferenceScore);

      console.log(
        `📊 Re-ranked ${results.length} results by user preference for ${domain}`
      );
    }

    return results;
  } catch (error) {
    console.error(`❌ Error in semantic search for ${domain}:`, error);
    throw error;
  }
}

// user vector store with caching
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

//Better domain detection for study abroad queries
function detectQueryDomains(
  query: string,
  userData?: UserStore | null
): (keyof typeof COLLECTION_CONFIG)[] {
  const lowerQuery = query.toLowerCase();

  console.log(
    `🎯 Analyzing query for domain detection: "${query}" for"${userData}" `
  );

  // Study abroad queries should prioritize courses first
  if (
    /study\s+abroad|want\s+to\s+study|looking\s+for\s+course|suggest.*course|recommend.*course|find.*course|course.*suggest|course.*recommend/i.test(
      lowerQuery
    )
  ) {
    console.log(`🎯 Study abroad query detected, prioritizing courses`);
    return ["courses", "universities", "countries"];
  }

  // University-specific queries
  if (
    /suggest.*university|recommend.*university|find.*university|university.*suggest|university.*recommend|best.*university|top.*university/i.test(
      lowerQuery
    )
  ) {
    console.log(`🎯 University query detected`);
    return ["universities", "courses", "countries"];
  }

  // Course-specific queries
  if (
    /course|courses|program|programs|degree|bachelor|master|phd|diploma|bsc|ba|msc|ma/i.test(
      lowerQuery
    )
  ) {
    console.log(`🎯 Course query detected`);
    return ["courses", "universities", "countries"];
  }

  // Default fallback - prioritize courses for study abroad context
  console.log(`🎯 Default domains, prioritizing courses`);
  return ["courses", "universities", "countries"];
}

// Improved ensemble retriever with better weighting
export async function createSmartEnsembleRetriever(
  query: string,
  userId?: string,
  userData?: UserStore | null
): Promise<EnsembleRetriever> {
  const detectedDomains = detectQueryDomains(query, userData);
  const retrievers = [];
  const weights = [];

  console.log(
    `🔄 Creating ensemble retriever for domains: ${detectedDomains.join(", ")}`
  );

  // Add user vector store if available (but with lower weight)
  if (userId) {
    try {
      const userVectorStore = await getUserVectorStore(userId);
      if (userVectorStore) {
        retrievers.push(userVectorStore.asRetriever({ k: 3 }));
        weights.push(0.05); // Lower weight for user store
        console.log("✅ Added user vector store");
      }
    } catch (error) {
      console.warn("⚠️ Failed to add user vector store:", error);
    }
  }

  // Add domain-specific retrievers with enhanced search
  for (const domain of detectedDomains) {
    try {
      const documents = await semanticSearchWithUserPreferences(
        query,
        domain,
        userData
      );

      if (documents.length > 0) {
        const vectorStore = await getDomainVectorStore(domain);
        const config = COLLECTION_CONFIG[domain];

        const retriever = vectorStore.asRetriever({
          k: config.k,
          filter: { domain },
        });

        retrievers.push(retriever);
        weights.push(config.priority);
        console.log(
          `✅ Added ${domain} retriever (k=${config.k}, docs=${documents.length})`
        );
      }
    } catch (error) {
      console.error(`❌ Failed to add ${domain} retriever:`, error);
    }
  }

  if (retrievers.length === 0) {
    throw new Error("No retrievers could be initialized");
  }

  // Normalize weights
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map((weight) => weight / totalWeight);

  console.log(`✅ Created ensemble with ${retrievers.length} retrievers`);
  console.log(`📊 Weights:`, normalizedWeights);

  return new EnsembleRetriever({
    retrievers,
    weights: normalizedWeights,
  });
}

// Better query function with improved filtering and context
export async function queryDocumentsWithUserContext(
  query: string,
  userData: UserStore | null = null,
  userId: string = "",
  conversationHistory: { role: string; content: string }[] = []
) {
  console.log(conversationHistory)
  console.log(`🔍 Processing query: "${query}"`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`📋 User data:`, userData?.detailedInfo?.studyPreferenced);

  // Check for cached results
  const cacheKey = generateVectorKey(query, userId);
  const cachedResults = await getCachedVectorResults(cacheKey);
  if (cachedResults) {
    console.log("✅ Returning cached results");
    return cachedResults;
  }

  // Create smart ensemble retriever
  const retriever = await createSmartEnsembleRetriever(query, userId, userData);

  // Enhanced query with strong user preference weighting
  let enhancedQuery = query;
  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;
    enhancedQuery = `Find ${prefs.degree} degree courses in ${prefs.subject} in ${prefs.country}. ${query}`;
  }

  console.log("🧪 Testing retriever with enhanced query...");
  const retrievalResults = await retriever.getRelevantDocuments(enhancedQuery);
  console.log(`🧪 Retriever returned ${retrievalResults.length} documents`);

  // ENHANCED: Better result filtering with user preferences
  let filteredResults = retrievalResults;
  if (userData?.detailedInfo?.studyPreferenced && retrievalResults.length > 0) {
    const prefs = userData.detailedInfo.studyPreferenced;

    // First, try strict matching
    const strictMatches = retrievalResults.filter((doc) => {
      const content = doc.pageContent.toLowerCase();
      const hasCountry = content.includes(prefs.country?.toLowerCase() || "");
      const hasSubject = content.includes(prefs.subject?.toLowerCase() || "");
      const hasDegree = content.includes(prefs.degree?.toLowerCase() || "");

      return hasCountry && hasSubject && hasDegree;
    });

    // If strict matches found, use them
    if (strictMatches.length > 0) {
      filteredResults = strictMatches;
      console.log(
        `📊 Strict filtered results: ${filteredResults.length} out of ${retrievalResults.length}`
      );
    } else {
      // Otherwise, use partial matching (2 out of 3 criteria)
      const partialMatches = retrievalResults.filter((doc) => {
        const content = doc.pageContent.toLowerCase();
        const hasCountry = content.includes(prefs.country?.toLowerCase() || "");
        const hasSubject = content.includes(prefs.subject?.toLowerCase() || "");
        const hasDegree = content.includes(prefs.degree?.toLowerCase() || "");

        return [hasCountry, hasSubject, hasDegree].filter(Boolean).length >= 2;
      });

      if (partialMatches.length > 0) {
        filteredResults = partialMatches;
        console.log(
          `📊 Partial filtered results: ${filteredResults.length} out of ${retrievalResults.length}`
        );
      }
    }
  }

  // Use filtered results if available, otherwise use all results
  const finalResults =
    filteredResults.length > 0 ? filteredResults : retrievalResults;

  // Log final results for debugging
  finalResults.forEach((doc, index) => {
    console.log(`📄 Document ${index + 1}:`, {
      domain: doc.metadata?.domain,
      preview: doc.pageContent.substring(0, 200) + "...",
    });
  });

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
    topP: 0.9,
  });

  const hasUserData = userData && userData.detailedInfo?.studyPreferenced;

  // ENHANCED: Better prompt template with stronger user preference emphasis
  const promptTemplate = new PromptTemplate({
    inputVariables: ["question", "context", "userPreferences"],
    template: `You are ZEUS, an AI assistant specialized in providing comprehensive information about universities, scholarships, and study abroad opportunities.

${
  hasUserData
    ? `
🎯 USER PREFERENCES (PRIORITIZE THESE):
- Preferred Country: ${userData.detailedInfo?.studyPreferenced.country}
- Preferred Degree Level: ${userData.detailedInfo?.studyPreferenced.degree}
- Preferred Subject: ${userData.detailedInfo?.studyPreferenced.subject}
- User Nationality: ${userData.detailedInfo?.nationality}

CRITICAL INSTRUCTIONS:
1. **ALWAYS prioritize courses/universities that match the user's exact preferences**
2. **Look for ${userData.detailedInfo?.studyPreferenced.degree} programs in ${userData.detailedInfo?.studyPreferenced.subject} in ${userData.detailedInfo?.studyPreferenced.country}**
3. **If you find matching courses in the context, mention them first and prominently**
4. **Be specific about course names, universities, and exact details from the context**

`
    : `
  CRITICAL INSTRUCTIONS:
        **When a user whose data is not available asks about studying abroad, ALWAYS ask them about their preferences first:**
   - What country are they interested in?
   - What degree level (Bachelor's, Master's, PhD)?
   - What subject/field of study?
`
}

IMPORTANT INSTRUCTIONS:
1. **Use the provided context extensively** - mention specific courses, universities, and details
2. **Be specific and detailed** - include exact names, locations, requirements, and fees
3. **Provide actionable information** - include application details and next steps
4. **If user asks for suggestions, provide concrete options from the context**
5. **Match user preferences exactly when possible**
6.**If a user asks anything about the application process or how to apply etc give them this clickable link to the dashboard http://localhost:3000/dashboard/overview **

Question: {question}

Available Information:
{context}

Please provide a comprehensive response that prioritizes the user's specific preferences and uses the provided context thoroughly:
`,
  });

  const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: true,
    prompt: promptTemplate,
  });

  try {
    // Better context organization
    const contextByDomain: Record<string, string[]> = {
      courses: [],
      universities: [],
      countries: [],
      user: [],
    };

    finalResults.forEach((doc) => {
      const content = doc.pageContent;
      const domain = doc.metadata?.domain || "general";

      if (contextByDomain[domain]) {
        contextByDomain[domain].push(content);
      } else {
        contextByDomain.courses.push(content); // Default to courses
      }
    });

    let organizedContext = "";

    // Prioritize courses in context organization
    if (contextByDomain.courses.length > 0) {
      organizedContext += "\n=== AVAILABLE COURSES ===\n";
      contextByDomain.courses.forEach((content, index) => {
        organizedContext += `\n--- Course ${index + 1} ---\n${content}\n`;
      });
    }

    if (contextByDomain.universities.length > 0) {
      organizedContext += "\n=== UNIVERSITIES ===\n";
      contextByDomain.universities.forEach((content, index) => {
        organizedContext += `\n--- University ${index + 1} ---\n${content}\n`;
      });
    }

    if (contextByDomain.countries.length > 0) {
      organizedContext += "\n=== COUNTRY INFORMATION ===\n";
      contextByDomain.countries.forEach((content, index) => {
        organizedContext += `\n--- Country ${index + 1} ---\n${content}\n`;
      });
    }

    console.log(
      `📄 Final context length: ${organizedContext.length} characters`
    );

    // Execute the chain
    const response = await chain.invoke({
      query: enhancedQuery,
      context: organizedContext || "No specific context found for this query.",
      userPreferences: hasUserData
        ? `User wants ${userData.detailedInfo?.studyPreferenced.degree} in ${userData.detailedInfo?.studyPreferenced.subject} in ${userData.detailedInfo?.studyPreferenced.country}`
        : "No user preferences available.",
    });

    // Cache the results
    await cacheVectorResults(cacheKey, response.text);

    console.log("✅ Query processed successfully");
    return response.text;
  } catch (error) {
    console.error("❌ Error in queryDocumentsWithUserContext:", error);
    throw error;
  }
}

// Clear cache functions
export function clearDomainCache(domain?: keyof typeof COLLECTION_CONFIG) {
  if (domain) {
    vectorStoreCache.delete(`domain_${domain}`);
  } else {
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
