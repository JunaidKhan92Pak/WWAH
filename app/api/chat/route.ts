import { NextRequest } from "next/server";
import { withCaching } from "@/middleware/api";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getGeneralVectorStore, getUserVectorStore } from "@/lib/langchain";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { UserStore } from "@/store/useUserData";

// Custom streaming handler function (without depending on LangChainAdapter)
interface ChatRequestBody {
  message: string;
  userData?: UserStore;
  userId?: string;
  conversationHistory?: { role: string; content: string }[];
}

async function streamingChatHandler(req: NextRequest, body: ChatRequestBody) {
  try {
    const { message, userData, userId, conversationHistory = [] } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // For simple queries that don't need streaming, maintain the current approach
    const { isSimpleQuery, retriever } = await prepareQueryComponents(
      message,
      userId
    );

    if (isSimpleQuery) {
      // Use your existing simple response mechanism
      const simpleResponse = getSimpleResponse(
        message,
        userData?.user?.firstName || "there"
      );
      return new Response(
        JSON.stringify({
          message: {
            role: "assistant",
            content: simpleResponse,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format conversation history
    const formattedConversationHistory = conversationHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const hasUserData = userData && Object.keys(userData).length > 0;

    const promptTemplate = PromptTemplate.fromTemplate(`
    You are ZEUS, an AI assistant specialized in helping users with university and scholarship information.
    
    {userProfile}
    Previous conversation:
    {conversationHistory}
    IMPORTANT:
    try to just give the countries, universities, courses, or scholarships according to the user preferences mentioned in the context.
     try to just give the countries, universities, courses, or scholarships given in the context. 
    Be conversational and natural in your responses. For simple greetings like "hi" or "hello",
    1.When responding to the query, consider the user's preferences above.
    2.Personalize your response based on their academic interests, country preferences,
    3.language proficiencies, and other relevant information in their profile.
    4. Be comprehensive - include all relevant universities, courses, or scholarships from the context that match the query.
    5. Always tailor your response to directly answer what was asked, while providing helpful context.
   6.Always include ALL links that appear in the context when mentioning related entities, using proper markdown format [Title](URL).
    7. Always include ALL relevant details from the context when discussing any university, course, or scholarship.
    8.DONOT provide links to external sources or websites unless explicitly mentioned in the context.
    9.Always include appropriate emojis to make responses friendly and engaging.
    
    Be conversational and natural in your responses. For simple greetings like "hi" or "hello", 
    respond casually without mentioning user data. Remember the context of the conversation.
    
    Question: \${question}
    
    Context: \${context}
    
    Answer:
  `);
    // Get context for the query - increase k for more comprehensive results
    // In streamingChatHandler.js
    const relevantDocs = await retriever.getRelevantDocuments(message);
    console.log(
      `Retrieved ${relevantDocs.length} documents for query: "${message}"`
    );

    // NEW: Better formatting of context content
    let contextContent = "";
    if (relevantDocs.length > 0) {
      contextContent = relevantDocs
        .map((doc, index) => {
          // Extract metadata if available
          const metadata = doc.metadata || {};
          const docType = metadata.type || "Information";
          const title = metadata.title || `Document ${index + 1}`;

          // Format document with clear structure
          return `--- ${docType}: ${title} ---\n${doc.pageContent}\n`;
        })
        .join("\n\n");

      console.log("Context preview:", contextContent.substring(0, 200) + "...");
    } else {
      console.warn("No documents found in vector store for this query");
      contextContent = "No specific information available in the database.";
    }
    // Create a custom ReadableStream for streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Rest of your streaming code remains the same...
        controller.enqueue(encoder.encode(`data:\n\n`));

        // Create the LangChain model with custom callbacks for streaming
        const model = new ChatOpenAI({
          modelName: "gpt-4o",
          temperature: 0.2, // Reduced temperature for more focused responses
          topP: 0.9,
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken(token) {
                // Send each token to the stream
                controller.enqueue(encoder.encode(`data: ${token}\n\n`));
              },

              handleLLMEnd() {
                // Signal the end of the stream
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              },
              handleLLMError(error) {
                console.error("LLM streaming error:", error);
                controller.error(error);
              },
            },
          ],
        });

        try {
          // Create and call the chain
          const chain = promptTemplate
            .pipe(model)
            .pipe(new StringOutputParser());

          // Invoke the chain without awaiting (it will stream through callbacks)
          chain
            .invoke({
              question: message,
              context: contextContent,
              userProfile: hasUserData
                ? `User Information:\n${JSON.stringify(userData, null, 2)}`
                : "The user is not logged in or has no saved information.",
              conversationHistory: formattedConversationHistory
                ? `Previous conversation:\n${formattedConversationHistory}`
                : "No previous conversation.",
            })
            .catch((error) => {
              console.error("Chain invocation error:", error);
              controller.error(error);
            });
        } catch (error) {
          console.error("Stream initialization error:", error);
          controller.error(error);
        }
      },
    });

    // Return a streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Streaming Chat API error:", error);
    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content: "I'm sorry, something went wrong. Please try again later.",
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Helper function to prepare query components
interface QueryComponents {
  isSimpleQuery: boolean;
  retriever: EnsembleRetriever;
}

async function prepareQueryComponents(
  message: string,
  userId?: string
): Promise<QueryComponents> {
  // Keep simple query detection the same
  const simpleQueryPatterns: RegExp[] = [
    /^hi+\s*$/i,
    /^hello+\s*$/i,
    /^hey+\s*$/i,
    /^how are you/i,
    /^good morning/i,
    /^good afternoon/i,
    /^good evening/i,
    /^thanks/i,
    /^thank you/i,
  ];

  const isSimpleQuery: boolean = simpleQueryPatterns.some((pattern) =>
    pattern.test(message.trim())
  );

  // Get vector stores and retrievers - increase k values
  const generalVectorStore = await getGeneralVectorStore();
  const userVectorStore = userId ? await getUserVectorStore(userId) : null;
  console.log("General vector store initialized:", !!generalVectorStore);
  console.log("User vector store initialized:", !!userVectorStore);

  let retriever: EnsembleRetriever;
  if (userVectorStore) {
    const generalRetriever = generalVectorStore.asRetriever({ k: 8 }); // Increased
    const userRetriever = userVectorStore.asRetriever({ k: 5 }); // Increased

    retriever = new EnsembleRetriever({
      retrievers: [userRetriever, generalRetriever],
      weights: [0.4, 0.6],
    });
  } else {
    retriever = new EnsembleRetriever({
      retrievers: [generalVectorStore.asRetriever({ k: 10 })],
      weights: [1],
    }); // Wrapped in EnsembleRetriever
  }

  return { isSimpleQuery, retriever };
}

// Helper function to prepare query components

// Simple response function for greetings
function getSimpleResponse(message: string, userName: string): string {
  if (/^(hi+|hello+|hey+)\s*$/i.test(message.trim())) {
    return `Hello ${userName}! How can I help you with your university or scholarship search today? 😊`;
  }

  if (/^how are you/i.test(message.trim())) {
    return "I'm doing well, thanks for asking! Ready to help you with university and scholarship information. What would you like to know? 🎓";
  }

  if (/^(thanks|thank you)/i.test(message.trim())) {
    return "You're welcome! Let me know if you need any more help with universities or scholarships. 👍";
  }

  return `Hello ${userName}! How can I assist you with university or scholarship information today? 🌍`;
}

// Export the POST function with streaming support
export async function POST(req: NextRequest) {
  try {
    // Set high priority headers if supported by your hosting
    const handlerWithHeaders = async (
      req: NextRequest,
      body: ChatRequestBody
    ) => {
      const response = await streamingChatHandler(req, body);

      // Add your headers to the response
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      };

      return new Response(response.body, {
        status: response.status,
        headers: { ...response.headers, ...headers },
      });
    };
    return await withCaching(req, handlerWithHeaders);
  } catch (error) {
    console.error("Middleware error:", error);
    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content:
            "I'm sorry, our systems are experiencing issues. Please try again later.",
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
