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

import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import clientPromise from "./mongodb";
import { PromptTemplate } from "@langchain/core/prompts";

// Original setupVectorStore function remains the same
export async function setupVectorStore() {
  const client = await clientPromise;
  const db = client.db("test");
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

// New function that incorporates user preferences
// In lib/langchain.ts

export async function queryDocumentsWithUserContext(
  query: string,
  userPreferences: any,
  conversationHistory = []
) {
  const vectorStore = await setupVectorStore();

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
  });
  const hasPreferences =
    userPreferences && Object.keys(userPreferences).length > 0;
  // Add conversation history to the prompt
  const formattedConversationHistory = conversationHistory
    .map(
      (msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
    )
    .join("\n");
  // Create a prompt template that includes user preferences
  const promptTemplate = PromptTemplate.fromTemplate(`
    You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.
    
    ${
      hasPreferences
        ? `User Preferences Information:
    ${JSON.stringify(userPreferences, null, 2)}
    Previous conversation:
    ${
      formattedConversationHistory
        ? formattedConversationHistory
        : "No previous conversation."
    }
    When responding to the query, consider the user's preferences above.
    Personalize your response based on their academic interests, country preferences,
    language proficiencies, and other relevant information in their profile.`
        : "The user is not logged in or has no saved preferences."
    }
    
    Be conversational and natural in your responses. For simple greetings like "hi" or "hello", 
    respond casually without mentioning user data. Remember the context of the conversation.
    
    Question: \${question}
    
    Context: \${context}
    
    Answer:
  `);

  // Create a chain with the custom prompt
  const chain = RetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever({
      k: 3,
    }),
    {
      returnSourceDocuments: false,
      prompt: promptTemplate,
    }
  );

  // Here's the fix - pass the userPreferences as a string directly
  const response = await chain.invoke({
    query, // This becomes 'question' in the prompt
    userPreferences: JSON.stringify(userPreferences, null, 2),
  });

  return response.text;
}
