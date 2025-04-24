//v1 on test database with test data
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { ChatOpenAI } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import { Document as LangchainDocument } from "langchain/document";
// import clientPromise from "./mongodb";

// export async function setupVectorStore() {
//   const client = await clientPromise;
//   const db = client.db("ragchatbot");
//   const collection = db.collection("documents");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//      collection,
//      indexName: "vector_index",
//      textKey: "text", // Field containing the original text
//      embeddingKey: "embedding", // Field containing the vector embeddings
//    });

//   return vectorStore;
// }

// export async function createDocumentEmbeddings(
//   documents: { name: string; content: string }[]
// ) {
//   const vectorStore = await setupVectorStore();

//   // Convert to LangChain document format
//   const langchainDocs = documents.map(
//     (doc) =>
//       new LangchainDocument({
//         pageContent: doc.content,
//         metadata: { name: doc.name },
//       })
//   );

//   // Add documents to vector store
//   await vectorStore.addDocuments(langchainDocs);
// }

// export async function queryDocuments(query: string) {
//   const vectorStore = await setupVectorStore();
//     const retriever = vectorStore.asRetriever();
//     const relevantDocs = await retriever.getRelevantDocuments(query);
//     console.log("Retrieved documents:", relevantDocs.length);
//     console.log(
//       "First document sample:",
//       relevantDocs[0]?.pageContent.substring(0, 100)
//     );
//   const model = new ChatOpenAI({
//     modelName: "gpt-3.5-turbo",
//     temperature: 0.2,
//   });

//   const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

//   const response = await chain.invoke({
//     query,
//   });

//   return response.text;
// }

// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { ChatOpenAI } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import { Document as LangchainDocument } from "langchain/document";
// import clientPromise from "./mongodb";

// export async function setupVectorStore() {
//   const client = await clientPromise;
//   const db = client.db("test");
//   const collection = db.collection("meta_embeddings");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "vector_index",
//     textKey: "text", // Field containing the original text
//     embeddingKey: "meta_embeddings", // Field containing the vector embeddings
//   });

//   return vectorStore;
// }

// export async function createDocumentEmbeddings(
//   documents: { name: string; content: string }[]
// ) {
//   const vectorStore = await setupVectorStore();

//   // Convert to LangChain document format
//   const langchainDocs = documents.map(
//     (doc) =>
//       new LangchainDocument({
//         pageContent: doc.content,
//         metadata: { name: doc.name },
//       })
//   );

//   // Add documents to vector store
//   await vectorStore.addDocuments(langchainDocs);
// }

// export async function queryDocuments(query: string) {
//   const client = await clientPromise;
//   const db = client.db("test"); // Use "test" database consistently
//   const collection = db.collection("meta_embeddings");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "vector_index",
//     textKey: "text", // Make sure this matches the field name in your documents
//     embeddingKey: "embedding", // This appears correct from your screenshot
//   });

//   const model = new ChatOpenAI({
//     modelName: "gpt-3.5-turbo",
//     temperature: 0.2,
//   });

//   const chain = RetrievalQAChain.fromLLM(
//     model,
//     vectorStore.asRetriever({
//       k: 8,
//     })
//   );

//   const response = await chain.invoke({
//     query,
//   });

//   return response.text;
// }

//v2 with test database with single single combined search index
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { ChatOpenAI } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import clientPromise from "./mongodb";
// import { PromptTemplate } from "@langchain/core/prompts";

// // Original setupVectorStore function remains the same
// export async function setupVectorStore() {
//   const client = await clientPromise;
//   const db = client.db("test");
//   const collection = db.collection("meta_embeddings");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//   });

//   return vectorStore;
// }

// // New function that incorporates user preferences
// // In lib/langchain.ts

// export async function queryDocumentsWithUserContext(
//   query: string,
//   userPreferences: any,
//   conversationHistory = []
// ) {
//   const vectorStore = await setupVectorStore();

//   const model = new ChatOpenAI({
//     modelName: "gpt-4o",
//     temperature: 0.2,
//   });
//   const hasPreferences =
//     userPreferences && Object.keys(userPreferences).length > 0;
//   // Add conversation history to the prompt
//   const formattedConversationHistory = conversationHistory
//     .map(
//       (msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
//     )
//     .join("\n");
//   // Create a prompt template that includes user preferences
//   const promptTemplate = PromptTemplate.fromTemplate(`
//     You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.

//     ${
//       hasPreferences
//         ? `User Preferences Information:
//     ${JSON.stringify(userPreferences, null, 2)}
//     Previous conversation:
//     ${
//       formattedConversationHistory
//         ? formattedConversationHistory
//         : "No previous conversation."
//     }
//     When responding to the query, consider the user's preferences above.
//     Personalize your response based on their academic interests, country preferences,
//     language proficiencies, and other relevant information in their profile.`
//         : "The user is not logged in or has no saved preferences."
//     }

//     Be conversational and natural in your responses. For simple greetings like "hi" or "hello",
//     respond casually without mentioning user data. Remember the context of the conversation.

//     Question: \${question}

//     Context: \${context}

//     Answer:
//   `);

//   // Create a chain with the custom prompt
//   const chain = RetrievalQAChain.fromLLM(
//     model,
//     vectorStore.asRetriever({
//       k: 3,
//     }),
//     {
//       returnSourceDocuments: false,
//       prompt: promptTemplate,
//     }
//   );

//   // Here's the fix - pass the userPreferences as a string directly
//   const response = await chain.invoke({
//     query, // This becomes 'question' in the prompt
//     userPreferences: JSON.stringify(userPreferences, null, 2),
//   });

//   return response.text;
// }
//v3 actual database with 2 search indexes
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { ChatOpenAI } from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";
// import clientPromise from "./mongodb";
// import { PromptTemplate } from "@langchain/core/prompts";

// // Original setupVectorStore function remains the same
// export async function setupVectorStore() {
//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const collection = db.collection("meta_embeddings");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//   });

//   return vectorStore;
// }
// // In lib/langchain.ts
// // Add this new function
// export async function setupUserVectorStore(userId) {
//   if (!userId) return null;

//   const client = await clientPromise;
//   const db = client.db("wwah");
//   const collection = db.collection("user_embeddings");

//   const embeddings = new OpenAIEmbeddings({
//     modelName: "text-embedding-3-small",
//   });

//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "user_vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//     filter: { userId: userId }, // This filter ensures we only get this user's data
//   });

//   return vectorStore;
// }
// // New function that incorporates user preferences
// // In lib/langchain.ts

// export async function queryDocumentsWithUserContext(
//   query: string,
//   userData: any, // Change from userPreferences to userData
//   userId: string = "",
//   conversationHistory = []
// ) {
//   // Get general vector store
//   const generalVectorStore = await setupVectorStore();
//   console.log(userData, "userData from langchain.ts");
//   // Get user-specific vector store if user is logged in
//   let userVectorStore = null;
//   if (userId) {
//     userVectorStore = await setupUserVectorStore(userId);
//   }

//   const model = new ChatOpenAI({
//     modelName: "gpt-4o",
//     temperature: 0.2,
//   });

//   const hasUserData = userData && Object.keys(userData).length > 0;

//   // Format conversation history
//   const formattedConversationHistory = conversationHistory
//     .map(
//       (msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
//     )
//     .join("\n");

//   // Create prompt template with updated user data reference
//   const promptTemplate = new PromptTemplate({
//     inputVariables: [
//       "question",
//       "context",
//       "userProfile",
//       "conversationHistory",
//     ],
//     template: `
// You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.

// {userProfile}

// {conversationHistory}

// Be conversational and natural in your responses. For simple greetings like "hi" or "hello", 
// respond casually without mentioning user data. Remember the context of the conversation.

// Question: {question}

// Context: {context}

// Answer:
// `,
//   });

//   // The rest of the function remains the same
//   let retriever;
//   if (userVectorStore) {
//     const generalRetriever = generalVectorStore.asRetriever({ k: 2 });
//     const userRetriever = userVectorStore.asRetriever({ k: 2 });

//     retriever = {
//       getRelevantDocuments: async (query) => {
//         const [generalDocs, userDocs] = await Promise.all([
//           generalRetriever.getRelevantDocuments(query),
//           userRetriever.getRelevantDocuments(query),
//         ]);
//         return [...userDocs, ...generalDocs].slice(0, 4);
//       },
//     };
//   } else {
//     retriever = generalVectorStore.asRetriever({ k: 3 });
//   }

//   const chain = RetrievalQAChain.fromLLM(model, retriever, {
//     returnSourceDocuments: false,
//     prompt: promptTemplate,
//   });

//   const response = await chain.invoke({
//     query: query, // ✅ matches `question` in PromptTemplate
//     context: "", // Replace with actual retrieved context if needed
//     userProfile: hasUserData
//       ? `User Information:\n${JSON.stringify(userData, null, 2)}`
//       : "The user is not logged in or has no saved information.",
//     conversationHistory: formattedConversationHistory
//       ? `Previous conversation:\n${formattedConversationHistory}`
//       : "No previous conversation.",
//   });

//   return response.text;
// }

import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import clientPromise from "./mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
interface userDataProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  otpVerified?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  contactNo?: string;
  dob?: string;
  country?: string;
  nationality?: string;
  successChances?: string[];
}
// Original setupVectorStore function remains the same
export async function setupVectorStore() {
  const client = await clientPromise;
  const db = client.db("wwah");
  const collection = db.collection("meta_embeddings");

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
  });

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  return vectorStore;
}
// In lib/langchain.ts
// Add this new function
export async function setupUserVectorStore(userId: string) {
  if (!userId) return null;

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
    // filterEntity: { userId: userId }, // This filter ensures we only get this user's data
  });

  return vectorStore;
}
// New function that incorporates user preferences
// In lib/langchain.ts

export async function queryDocumentsWithUserContext(
  query: string,
  userData: userDataProps, // Change from userPreferences to userData
  userId: string = "",
  conversationHistory: { role: string; content: string }[] = []
) {
  // Get general vector store
  const generalVectorStore = await setupVectorStore();
  console.log(userData, "userData from langchain.ts");
  // Get user-specific vector store if user is logged in
  let userVectorStore = null;
  if (userId) {
    userVectorStore = await setupUserVectorStore(userId);
  }

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  });

  const hasUserData = userData && Object.keys(userData).length > 0;

  // Format conversation history
  const formattedConversationHistory = conversationHistory
    .map(
      (msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  // Create prompt template with updated user data reference
  const promptTemplate = new PromptTemplate({
    inputVariables: [
      "question",
      "context",
      "userProfile",
      "conversationHistory",
    ],
    template: `
You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.

{userProfile}

{conversationHistory}

Be conversational and natural in your responses. For simple greetings like "hi" or "hello",
respond casually without mentioning user data. Remember the context of the conversation.

Question: {question}

Context: {context}

Answer:
`,
  });

  // The rest of the function remains the same
  let retriever;
  if (userVectorStore) {
    const generalRetriever = generalVectorStore.asRetriever({ k: 2 });
    const userRetriever = userVectorStore.asRetriever({ k: 2 });

    retriever = new EnsembleRetriever({
      retrievers: [userRetriever, generalRetriever],
      weights: [0.5, 0.5], // Adjust weights as needed
    });
  } else {
    retriever = generalVectorStore.asRetriever({ k: 3 });
  }
  const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: false,
    prompt: promptTemplate,
  });

  const response = await chain.invoke({
    query: query, // ✅ matches `question` in PromptTemplate
    context: "", // Replace with actual retrieved context if needed
    userProfile: hasUserData
      ? `User Information:\n${JSON.stringify(userData, null, 2)}`
      : "The user is not logged in or has no saved information.",
    conversationHistory: formattedConversationHistory
      ? `Previous conversation:\n${formattedConversationHistory}`
      : "No previous conversation.",
  });

  return response.text;
}
