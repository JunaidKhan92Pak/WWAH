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
import { UserStore } from "@/store/useUserData";

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
    k: 8, // Increased k for more results
  },
  universities: {
    name: "university_embeddings",
    indexName: "university_vector_index",
    priority: 0.3,
    k: 4,
  },
  countries: {
    name: "country_embeddings",
    indexName: "country_vector_index",
    priority: 0.1,
    k: 2,
  },
};

// Vector store instances cache
const vectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();
const userVectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();

// Initialize embeddings instance
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  batchSize: 512,
  maxConcurrency: 5,
});
function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddingsInstance) {
    embeddingsInstance = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      batchSize: 100, // Reduced batch size
      maxConcurrency: 3, // Reduced concurrency
      stripNewLines: true,
      timeout: 5000, // 5 second timeout
    });
  }
  return embeddingsInstance;
}
let embeddingsInstance: OpenAIEmbeddings | null = null;
let chatModelInstance: ChatOpenAI | null = null;
const vectorStoreInstances: Map<string, MongoDBAtlasVectorSearch> = new Map();
function getChatModel(): ChatOpenAI {
  if (!chatModelInstance) {
    chatModelInstance = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Faster model
      temperature: 0.1, // Lower temperature for faster response
      maxTokens: 400, // Reduced token limit
      timeout: 10000, // 10 second timeout
      streaming: false, // Disable streaming for faster processing
    });
  }
  return chatModelInstance;
}
async function getVectorStore(
  domain: keyof typeof COLLECTION_CONFIG
): Promise<MongoDBAtlasVectorSearch> {
  if (vectorStoreInstances.has(domain)) {
    return vectorStoreInstances.get(domain)!;
  }

  const client = await clientPromise;
  const db = client.db("wwah");
  const config = COLLECTION_CONFIG[domain];

  const vectorStore = new MongoDBAtlasVectorSearch(getEmbeddings(), {
    collection: db.collection(config.name),
    indexName: config.indexName,
    textKey: "text",
    embeddingKey: "embedding",
  });

  vectorStoreInstances.set(domain, vectorStore);
  return vectorStore;
}
function getRelevantDomains(
  query: string,
  userData?: UserStore | null
): (keyof typeof COLLECTION_CONFIG)[] {
  const lowerQuery = query.toLowerCase();
console.log(userData);
  // Quick keyword matching for domain selection
  if (/\b(course|program|degree|study)\b/i.test(lowerQuery)) {
    return ["courses"]; // Only search courses for better performance
  }

  if (/\b(university|college|institution)\b/i.test(lowerQuery)) {
    return ["universities", "courses"]; // Limit to 2 domains
  }

  if (/\b(country|location|where)\b/i.test(lowerQuery)) {
    return ["countries", "courses"];
  }

  // Default: prioritize courses only
  return ["courses"];
}
async function parallelVectorSearch(
  query: string,
  domains: (keyof typeof COLLECTION_CONFIG)[],
  userData?: UserStore | null
): Promise<Document[]> {
  const searchPromises = domains.map(async (domain) => {
    try {
      const vectorStore = await getVectorStore(domain);
      const config = COLLECTION_CONFIG[domain];

      // Build optimized filters with proper typing
      const filters: Record<string, string> = { domain };

      if (userData?.detailedInfo?.studyPreferenced) {
        const prefs = userData.detailedInfo.studyPreferenced;
        if (prefs.country) filters.country = prefs.country;
        if (prefs.subject && domain === "courses")
          filters.subject = prefs.subject;
        if (prefs.degree && domain === "courses") filters.degree = prefs.degree;
      }

      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: filters,
      });

      // Add timeout to each search
      const timeoutPromise = new Promise<Document[]>((_, reject) => {
        setTimeout(
          () => reject(new Error(`Search timeout for ${domain}`)),
          3000
        );
      });

      const searchPromise = retriever.getRelevantDocuments(query);
      const results = await Promise.race([searchPromise, timeoutPromise]);

      return results.map((doc) => ({
        ...doc,
        metadata: { ...doc.metadata, domain },
      }));
    } catch (error) {
      console.warn(`Search failed for ${domain}:`, error);
      return [];
    }
  });

  // Execute all searches in parallel with overall timeout
  const allResults = await Promise.allSettled(searchPromises);
  const successfulResults = allResults
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => (result as PromiseFulfilledResult<Document[]>).value);

  return successfulResults;
}
function buildOptimizedContext(
  documents: Document[],
  maxLength: number = 2000
): string {
  if (documents.length === 0) return "";

  let context = "";
  let currentLength = 0;

  // Prioritize documents by domain
  const prioritizedDocs = documents.sort((a, b) => {
    const aDomain = a.metadata?.domain || "";
    const bDomain = b.metadata?.domain || "";

    if (aDomain === "courses") return -1;
    if (bDomain === "courses") return 1;
    return 0;
  });

  for (const doc of prioritizedDocs) {
    const content = doc.pageContent;
    const truncatedContent =
      content.length > 500 ? content.substring(0, 500) + "..." : content;

    if (currentLength + truncatedContent.length > maxLength) {
      break;
    }

    context += `\n--- ${
      doc.metadata?.domain || "info"
    } ---\n${truncatedContent}\n`;
    currentLength += truncatedContent.length;
  }

  return context;
}
export async function optimizedQuery(
  query: string,
  userData?: UserStore | null,
): Promise<string> {
  console.log(`🚀 Processing optimized query: "${query}"`);

  try {
    // Step 1: Quick intent classification
    const isGreeting = /^(hi|hello|hey|thanks|thank you)$/i.test(query.trim());
    if (isGreeting) {
      const name = userData?.user?.firstName || "";
      return `Hello${
        name ? ` ${name}` : ""
      }! 👋 How can I help you with your study abroad journey today?`;
    }

    // Step 2: Get relevant domains (reduced scope)
    const domains = getRelevantDomains(query, userData);
    console.log(`🎯 Searching domains: ${domains.join(", ")}`);

    // Step 3: Parallel vector search with timeout
    const startTime = Date.now();
    const documents = await parallelVectorSearch(query, domains, userData);
    console.log(`⚡ Vector search completed in ${Date.now() - startTime}ms`);

    if (documents.length === 0) {
      return "I couldn't find specific information for your query. Could you please provide more details about what you're looking for?";
    }

    // Step 4: Build optimized context
    const context = buildOptimizedContext(documents, 1500); // Reduced context size

    // Step 5: Optimized prompt
    const prompt = new PromptTemplate({
      inputVariables: ["query", "context", "userInfo"],
      template: `You are ZEUS, a study abroad assistant. Be concise and helpful.

${
  userData?.detailedInfo?.studyPreferenced
    ? `
User Preferences: ${userData.detailedInfo.studyPreferenced.degree} in ${userData.detailedInfo.studyPreferenced.subject} in ${userData.detailedInfo.studyPreferenced.country}
`
    : ""
}

Query: {query}

Context: {context}

Provide a focused, actionable response (max 300 words). Include specific details from the context.`,
    });

    // Step 6: Generate response with timeout
    const model = getChatModel();
    const formattedPrompt = await prompt.format({
      query,
      context,
      userInfo: userData?.user?.firstName || "User",
    });

    const response = await model.invoke(formattedPrompt);

    console.log(`✅ Total processing time: ${Date.now() - startTime}ms`);
    return response.content as string;
  } catch (error) {
    console.error("❌ Optimized query error:", error);
    return "I'm having trouble processing your request right now. Please try again or rephrase your question.";
  }
}

// Connection cleanup function
export function cleanupConnections() {
  vectorStoreInstances.clear();
  embeddingsInstance = null;
  chatModelInstance = null;
}
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
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 500,
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
  const config = COLLECTION_CONFIG[domain];

  // Build enhanced query with user preferences
  let enhancedQuery = query;
  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;

    // Weight user preferences heavily in the search query
    enhancedQuery = `${query} ${prefs.degree} ${prefs.subject} ${prefs.country}`;
  }

  console.log(`🔍 Enhanced query for ${domain}: "${enhancedQuery}"`);

  try {
    const vectorStore = await getDomainVectorStore(domain);

    // First, try with user preference filters
    const filters = buildLangChainFilters(query, domain, userData);

    let results = [];

    try {
      // Use filters if they work
      const retriever = vectorStore.asRetriever({
        k: config.k,
        filter: filters,
      });
      results = await retriever.getRelevantDocuments(enhancedQuery);
      console.log(
        `✅ Found ${results.length} documents with filters for ${domain}`
      );
      // If no results with filters, try without filters
      if (results.length === 0) {
        const fallbackRetriever = vectorStore.asRetriever({
          k: config.k,
          filter: { domain },
        });
        console.log(
          `🔄 No results with filters, falling back to semantic search for ${domain}`
        );
        results = await fallbackRetriever.getRelevantDocuments(enhancedQuery);
      }
    } catch (error) {
      // Fallback to semantic search only with domain filter
      console.error(`❌ Error in vector search for ${domain}:`, error);
      return [];
    }

    if (results.length > 0 && userData?.detailedInfo?.studyPreferenced) {
      // Only re-score if we have many results
      if (results.length > 10) {
        const prefs = userData.detailedInfo.studyPreferenced;
        results = results
          .slice(0, 15)
          .map((doc) => {
            const content = doc.pageContent.toLowerCase();
            let score = 0;
            if (prefs.country && content.includes(prefs.country.toLowerCase()))
              score += 3;
            if (prefs.subject && content.includes(prefs.subject.toLowerCase()))
              score += 3;
            if (prefs.degree && content.includes(prefs.degree.toLowerCase()))
              score += 2;
            return { ...doc, userPreferenceScore: score };
          })
          .sort((a, b) => b.userPreferenceScore - a.userPreferenceScore);
      }
    }

    return results.slice(0, config.k);
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

//  ensemble retriever with better weighting
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
  console.log(conversationHistory);
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
    maxTokens: 800,
    timeout: 30000,
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

export function clearUserCache(userId?: string) {
  if (userId) {
    userVectorStoreCache.delete(`user_${userId}`);
  } else {
    userVectorStoreCache.clear();
  }
}
