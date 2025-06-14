import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import clientPromise from "./mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import {
  getCachedVectorResults,
  cacheVectorResults,
  generateVectorKey,
} from "./redis";
import { UserStore } from "@/store/useUserData";

// Setup and cache vector stores
let generalVectorStoreInstance: MongoDBAtlasVectorSearch | null = null;

export async function getGeneralVectorStore() {
  if (generalVectorStoreInstance) return generalVectorStoreInstance;

  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection("meta_embeddings");

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  generalVectorStoreInstance = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  return generalVectorStoreInstance;
}

// User vector store cache - keyed by user ID
const userVectorStoreCache = new Map();

export async function getUserVectorStore(userId: string) {
  if (!userId) return null;
  if (userVectorStoreCache.has(userId)) return userVectorStoreCache.get(userId);

  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection("user_embeddings");

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "user_vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  userVectorStoreCache.set(userId, vectorStore);
  return vectorStore;
}

export async function queryDocumentsWithUserContext(
  query: string,
  userData:UserStore | null = null,
  userId: string = "",
  conversationHistory: { role: string; content: string }[] = []
) {
  // Check for cached vector results first
  const cacheKey = generateVectorKey(query, userId);
  const cachedResults = await getCachedVectorResults(cacheKey);
  if (cachedResults) return cachedResults;

  // Get general vector store (singleton)
  const generalVectorStore = await getGeneralVectorStore();

  // Get user-specific vector store if user is logged in (cached)
  const userVectorStore = userId ? await getUserVectorStore(userId) : null;

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.4, // Reduced temperature for more deterministic responses
    topP: 0.9,
  });

  const hasUserData = userData && Object.keys(userData).length > 0;

  // Format conversation history
  const formattedConversationHistory = conversationHistory
    .map(
      (msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  // Enhanced prompt template that strictly uses only database content
  //   const promptTemplate = new PromptTemplate({
  //     inputVariables: [
  //       "question",
  //       "context",
  //       "userProfile",
  //       "conversationHistory",
  //     ],
  //     template: `
  // You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.

  // CRITICAL INSTRUCTIONS:
  // 1. ONLY provide information about universities, courses, scholarships, and countries that are EXPLICITLY mentioned in the context below.
  // 2. DO NOT mention any university, course, scholarship, or country that IS NOT in the context.
  // 3. If the user asks about something not in the context, suggest alternatives from what IS in the context.
  // 4. ALWAYS include ALL links that appear in the context when mentioning related entities, using proper markdown format [Title](URL).
  // 5. When discussing any university, course, or scholarship, include ALL relevant details from the context.
  // 6.DO NOT provide links to any other websites or resources outside the context.
  // User Information:
  // {userProfile}

  // Previous conversation:
  // {conversationHistory}

  // Be conversational and natural in your responses. For simple greetings like "hi" or "hello",
  // respond casually without mentioning user data. Remember the context of the conversation.

  // Always include appropriate emojis to make responses friendly and engaging.

  // Question: {question}

  // Context (ONLY use information from this context - do not reference anything not mentioned here):
  // {context}

  // Answer:
  // `,
  //   });
  const promptTemplate = new PromptTemplate({
    inputVariables: [
      "question",
      "context",
      "userProfile",
      "conversationHistory",
    ],
    template: `
You are ZEUS, an AI assistant specialized in helping users with university and scholarship information and any kind of information that they need as normal chat-gpt.

{userProfile}

{conversationHistory}

Be conversational and natural in your responses. For simple greetings like "hi" or "hello",
respond casually without mentioning user data. Remember the context of the conversation.

IMPORTANT:
guide the user about universities, courses, scholarships, or countries according to their preferecnces mentioned in the context.
1. If asked about universities, courses, scholarships, or countries, ALWAYS provide information that matches the query directly.
2. Don't limit responses to only the user's preferred country or profile. If they ask about a specific country, provide information about that country.
3. When information is not available in the context, clearly state that and offer what IS available instead.
4. Be comprehensive - include all relevant universities, courses, or scholarships from the context that match the query.
5. Always tailor your response to directly answer what was asked, while providing helpful context.

Always include appropriate emojis to make responses friendly and engaging.
Question: {question}

Context: {context}

Answer:
`,
  });
  // Setup retriever with increased k for more context
  let retriever;
  if (userVectorStore) {
    const generalRetriever = generalVectorStore.asRetriever({ k: 8 }); // Increased from 4
    const userRetriever = userVectorStore.asRetriever({ k: 8 }); // Increased from 3

    retriever = new EnsembleRetriever({
      retrievers: [userRetriever, generalRetriever],
      weights: [0.4, 0.6], // Keep weights as they were
    });
  } else {
    retriever = generalVectorStore.asRetriever({ k: 10 }); // Increased from 5 to ensure more context
  }

  const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: false,
    prompt: promptTemplate,
  });

  // Get more relevant documents to ensure comprehensive coverage
  const relevantDocs = await retriever.getRelevantDocuments(query);

  // Process the context to highlight available entities
  const availableEntities = {
    universities: new Set(),
    countries: new Set(),
    courses: new Set(),
    scholarships: new Set(),
    links: [] as string[],
  };

  // Extract and preserve URLs/links from context
  relevantDocs.forEach((doc) => {
    const content = doc.pageContent;

    // Extract URLs with common patterns (adjust as needed for your data format)
    const urlMatches = content.match(/https?:\/\/[^\s\)]+/g) || [];
    availableEntities.links.push(...urlMatches);

    // Extract potential markdown-formatted links
    const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    availableEntities.links.push(...markdownLinks);

    // You can add more extraction logic based on your data structure
  });

  // Join the context with explicit formatting
  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

  const response = await chain.invoke({
    query: query,
    context: context,
    userProfile: hasUserData
      ? `User Information:\n${JSON.stringify(userData, null, 2)}`
      : "The user is not logged in or has no saved information.",
    conversationHistory: formattedConversationHistory
      ? `Previous conversation:\n${formattedConversationHistory}`
      : "No previous conversation.",
  });

  // Cache the results
  await cacheVectorResults(cacheKey, response.text);

  return response.text;
}

// for vector search
// {
//   "fields": [
//     {
//       "type": "vector",
//       "path": "embedding",
//       "numDimensions": 1536,
//       "similarity": "cosine"
//     }
//   ]
// }
