// /api/chat/preload/route.ts
import { NextRequest } from "next/server";
import { semanticSearchWithUserPreferences } from "@/lib/langchain";
import { getCachedUserData, cacheUserContext, getCachedUserContext } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    // Check if context is already cached
    const cachedContext = await getCachedUserContext(userId);
    if (cachedContext) {
      return Response.json(cachedContext);
    }

    // Fetch user data
    const userData = await getCachedUserData(userId);
    if (!userData?.detailedInfo?.studyPreferenced) {
      return Response.json({ error: "No user preferences found" });
    }

    const prefs = userData.detailedInfo.studyPreferenced;

    // Preload relevant data based on user preferences
    const [courses, universities, countries] = await Promise.all([
      semanticSearchWithUserPreferences(
        `${prefs.degree} ${prefs.subject} courses`,
        "courses",
        userData
      ),
      semanticSearchWithUserPreferences(
        `${prefs.country} universities ${prefs.subject}`,
        "universities",
        userData
      ),
      semanticSearchWithUserPreferences(
        `study in ${prefs.country} information`,
        "countries",
        userData
      ),
    ]);

    const context = {
      userRelevantCourses: courses.slice(0, 10), // Limit results
      userRelevantUniversities: universities.slice(0, 8),
      userCountryInfo: countries.slice(0, 5),
      userProfile: userData,
      preloadedAt: new Date().toISOString(),
    };

    // Cache for 30 minutes
    await cacheUserContext(userId, context, 1800);

    return Response.json(context);
  } catch (error) {
    console.error("Preload error:", error);
    return Response.json(
      { error: "Failed to preload context" },
      { status: 500 }
    );
  }
}

// // api/chat/route.ts /current chat route
// import { NextRequest } from "next/server";
// import { withCaching } from "@/middleware/api";
// import { UserStore } from "@/store/useUserData";
// import { queryDocumentsWithUserContext } from "@/lib/langchain";
// import { getCachedVectorResults, generateVectorKey } from "@/lib/redis";
// import { ChatOpenAI } from "@langchain/openai";

// interface ChatRequestBody {
//   message: string;
//   userData?: UserStore;
//   userId?: string;
//   conversationHistory?: { role: string; content: string }[];
//   preloadedContext?: PreloadedContext; // Added missing property
// }

// interface PreloadedContext {
//   userRelevantCourses: any[];
//   userRelevantUniversities: any[];
//   userCountryInfo: any[];
//   userProfile: UserStore;
// }

// // Helper function to validate user data
// function validateUserData(userData?: UserStore): {
//   hasValidUser: boolean;
//   hasValidDetailedInfo: boolean;
//   userSummary: string;
// } {
//   const hasValidUser = !!(userData?.user?._id && userData?.user?.firstName);
//   const hasValidDetailedInfo = !!(
//     userData?.detailedInfo &&
//     userData.detailedInfo.studyPreferenced &&
//     userData.detailedInfo.studyPreferenced.country &&
//     userData.detailedInfo.studyPreferenced.degree &&
//     userData.detailedInfo.studyPreferenced.subject
//   );

//   let userSummary = "User is not logged in";
//   if (hasValidUser) {
//     userSummary = `User: ${userData!.user!.firstName} ${
//       userData!.user!.lastName
//     }`;
//     if (hasValidDetailedInfo) {
//       const prefs = userData!.detailedInfo!.studyPreferenced;
//       const details = [];
//       if (prefs?.country) details.push(`Country: ${prefs.country}`);
//       if (prefs?.degree) details.push(`Degree: ${prefs.degree}`);
//       if (prefs?.subject) details.push(`Subject: ${prefs.subject}`);
//       if (userData!.detailedInfo!.nationality)
//         details.push(`Nationality: ${userData!.detailedInfo!.nationality}`);
//       if (details.length > 0) {
//         userSummary += ` (${details.join(", ")})`;
//       }
//     }
//   }

//   return { hasValidUser, hasValidDetailedInfo, userSummary };
// }

// // Enhanced function to detect general queries
// function isGeneralQuery(message: string): boolean {
//   const lowerMessage = message.toLowerCase().trim();

//   // First, check if it's study-related - if so, NOT a general query
//   const studyRelatedPatterns = [
//     /study abroad/i,
//     /study.*in.*(canada|uk|usa|australia|germany|france)/i,
//     /university/i,
//     /college/i,
//     /course/i,
//     /program/i,
//     /degree/i,
//     /bachelor/i,
//     /master/i,
//     /phd/i,
//     /admission/i,
//     /application/i,
//     /scholarship/i,
//     /biotechnology/i,
//     /engineering/i,
//     /medicine/i,
//     /physics/i,
//     /chemistry/i,
//     /biology/i,
//     /computer science/i,
//     /business/i,
//     /law/i,
//     /journalism/i,
//     /guide.*about.*study/i,
//     /how.*study.*in/i,
//     /where.*study/i,
//     /suggest.*course/i,
//     /recommend.*university/i,
//     /want.*study/i,
//     /looking.*course/i,
//     /find.*university/i,
//   ];

//   // If it's study-related, it's NOT a general query
//   if (studyRelatedPatterns.some((pattern) => pattern.test(lowerMessage))) {
//     return false;
//   }

//   // Expanded general query patterns
//   const generalPatterns = [
//     // Basic factual questions
//     /^what is the (radius|diameter|size|area|volume|mass|weight|height|width|length|distance) of/i,
//     /^how (big|small|large|tall|wide|long|far|high|deep) is/i,
//     /^what is.*capital of/i,
//     /^who is/i,
//     /^when (was|is|did|will)/i,
//     /^where is/i,
//     /^why (is|does|did|will)/i,
//     /^how (does|did|will|can|do)/i,

//     // Math and calculations
//     /^what is.*[0-9]+.*[+\-*/].*[0-9]+/i,
//     /^calculate.*[0-9]/i,
//     /^solve.*[0-9]/i,
//     /^convert.*[0-9]/i,
//     /^\d+\s*[+\-*/]\s*\d+/i,

//     // Time and weather
//     /^weather/i,
//     /^what time is it/i,
//     /^what.*time.*in/i,

//     // Entertainment
//     /^tell me a joke/i,
//     /^joke/i,
//     /^story/i,
//     /^riddle/i,

//     // Simple acknowledgments
//     /^(ok|okay|yes|no|fine|good|nice|cool|great|awesome|thanks|thank you)$/i,

//     // General knowledge
//     /^define/i,
//     /^explain.*(?!study|university|course|degree)/i,
//     /^what does.*mean/i,
//     /^history of(?!.*study)/i,
//     /^how to(?!.*study)/i,
//   ];

//   return generalPatterns.some((pattern) => pattern.test(lowerMessage));
// }

// // Enhanced function for general responses - Fixed to always return a string
// function getGeneralResponse(message: string, userName: string): string {
//   const lowerMessage = message.toLowerCase().trim();

//   // Simple acknowledgments
//   if (/^(ok|okay|yes|fine|good|nice|cool|great|awesome)$/i.test(lowerMessage)) {
//     return `${
//       userName ? `Great, ${userName}! ` : "Great! "
//     }Is there anything else I can help you with regarding universities, courses, or study abroad opportunities? 😊`;
//   }

//   // Thanks responses
//   if (/^(thanks|thank you)$/i.test(lowerMessage)) {
//     return `${
//       userName ? `You're welcome, ${userName}! ` : "You're welcome! "
//     }Feel free to ask me anything about studying abroad, universities, or courses anytime! 😊`;
//   }

//   // Default fallback for other general queries
//   return `${
//     userName ? `Hi ${userName}! ` : "Hi there! "
//   }I specialize in helping with study abroad guidance, universities, courses, and scholarships. How can I assist you with your educational journey? 🎓`;
// }

// // Enhanced simple response function for greetings - Fixed return type consistency
// function getSimpleResponse(
//   message: string,
//   userName: string,
//   hasValidUser: boolean,
//   hasValidDetailedInfo: boolean
// ): string | null {
//   // Only match very basic greetings - be more restrictive
//   const simpleQueryPatterns: RegExp[] = [
//     /^hi+\s*$/i,
//     /^hello+\s*$/i,
//     /^hey+\s*$/i,
//     /^how are you\?*\s*$/i,
//     /^good morning\s*$/i,
//     /^good afternoon\s*$/i,
//     /^good evening\s*$/i,
//   ];

//   const isSimpleQuery = simpleQueryPatterns.some((pattern) =>
//     pattern.test(message.trim())
//   );

//   if (!isSimpleQuery) return null;

//   // Handle different greeting patterns
//   if (/^(hi+|hello+|hey+)\s*$/i.test(message.trim())) {
//     if (hasValidUser) {
//       const greeting = hasValidDetailedInfo
//         ? `Hello ${userName}! 👋 I can see your study preferences. How can I help you today?`
//         : `Hello ${userName}! 👋 How can I help you with your university or scholarship search today?`;
//       return (
//         greeting +
//         " I can provide detailed information about countries, universities, courses, and scholarships! 🎓"
//       );
//     }
//     return `Hello there! 👋 How can I help you with your university or scholarship search today? I can provide detailed information about countries, universities, courses, and scholarships! 😊`;
//   }

//   if (/^how are you\?*\s*$/i.test(message.trim())) {
//     const personalizedPart = hasValidUser
//       ? `Nice to see you again, ${userName}! 🌟`
//       : "I'm doing great, thanks for asking! 🌟";
//     return (
//       personalizedPart +
//       " I'm ready to help you with comprehensive information about universities, courses, scholarships, and study abroad opportunities. What would you like to know? 🎓"
//     );
//   }

//   // Default fallback
//   const fallback = hasValidUser ? `Hello ${userName}! 🌍` : "Hello there! 🌍";
//   return (
//     fallback +
//     " How can I assist you today? I can provide detailed information about universities, courses, scholarships, and countries for studying abroad! ✨"
//   );
// }

// // Fixed async function with proper error handling
// async function generateResponseWithPreloadedContext(
//   message: string,
//   context: PreloadedContext,
//   conversationContext: string
// ): Promise<string> {
//   try {
//     // Determine which preloaded data is most relevant to the current query
//     const relevantData = selectRelevantPreloadedData(message, context);

//     const model = new ChatOpenAI({
//       modelName: "gpt-4o-mini",
//       temperature: 0.3,
//       maxTokens: 1000,
//     });

//     const prompt = `You are ZEUS, an AI assistant specialized in study abroad guidance.

// USER PREFERENCES:
// - Country: ${
//       context.userProfile.detailedInfo?.studyPreferenced?.country ||
//       "Not specified"
//     }
// - Degree: ${
//       context.userProfile.detailedInfo?.studyPreferenced?.degree ||
//       "Not specified"
//     }
// - Subject: ${
//       context.userProfile.detailedInfo?.studyPreferenced?.subject ||
//       "Not specified"
//     }

// ${conversationContext}

// CURRENT QUESTION: ${message}

// RELEVANT PRELOADED INFORMATION:
// ${relevantData}

// Provide a helpful, conversational response that:
// 1. Acknowledges the conversation history if relevant
// 2. Directly answers the current question
// 3. Uses the preloaded information effectively
// 4. Maintains natural conversation flow`;

//     const response = await model.invoke(prompt);
//     return response.content as string;
//   } catch (error) {
//     console.error("Error in generateResponseWithPreloadedContext:", error);
//     return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
//   }
// }

// function selectRelevantPreloadedData(
//   message: string,
//   context: PreloadedContext
// ): string {
//   const lowerMessage = message.toLowerCase();
//   let relevantData = "";

//   // Course-related queries
//   if (lowerMessage.includes("course") || lowerMessage.includes("program")) {
//     relevantData += "\n=== RELEVANT COURSES ===\n";
//     context.userRelevantCourses
//       ?.slice(0, 5)
//       .forEach((course: any, index: number) => {
//         relevantData += `${index + 1}. ${course.pageContent?.substring(
//           0,
//           300
//         )}...\n`;
//       });
//   }

//   // University-related queries
//   if (lowerMessage.includes("university") || lowerMessage.includes("college")) {
//     relevantData += "\n=== RELEVANT UNIVERSITIES ===\n";
//     context.userRelevantUniversities
//       ?.slice(0, 3)
//       .forEach((uni: any, index: number) => {
//         relevantData += `${index + 1}. ${uni.pageContent?.substring(
//           0,
//           300
//         )}...\n`;
//       });
//   }

//   // Country-related queries
//   if (lowerMessage.includes("country") || lowerMessage.includes("visa")) {
//     relevantData += "\n=== COUNTRY INFORMATION ===\n";
//     context.userCountryInfo
//       ?.slice(0, 2)
//       .forEach((country: any, index: number) => {
//         relevantData += `${index + 1}. ${country.pageContent?.substring(
//           0,
//           300
//         )}...\n`;
//       });
//   }

//   return relevantData;
// }

// function buildConversationContext(
//   conversationHistory: { role: string; content: string }[]
// ): string {
//   if (conversationHistory.length === 0) return "";

//   const recentHistory = conversationHistory.slice(-10);
//   let context = "\n=== CONVERSATION HISTORY ===\n";

//   recentHistory.forEach((msg) => {
//     context += `${msg.role.toUpperCase()}: ${msg.content}\n`;
//   });

//   return context;
// }

// // Main streaming chat handler - Fixed preloaded context handling
// async function streamingChatHandler(
//   req: NextRequest,
//   body: ChatRequestBody
// ): Promise<Response> {
//   try {
//     const {
//       message,
//       userData,
//       userId,
//       conversationHistory = [],
//       preloadedContext,
//     } = body;

//     // Validate inputs
//     if (!message || typeof message !== "string") {
//       return new Response(
//         JSON.stringify({
//           message: {
//             role: "assistant",
//             content: "I need a message to respond to. Please ask me something!",
//           },
//         }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     console.log(`📨 Processing message: "${message}"`);
//     console.log(`👤 User ID: ${userId || "Anonymous"}`);

//     const { hasValidUser, hasValidDetailedInfo, userSummary } =
//       validateUserData(userData);
//     console.log(`📋 ${userSummary}`);

//     // Handle preloaded context case first
//     if (preloadedContext) {
//       console.log(`🚀 Using preloaded context`);
//       try {
//         const response = await generateResponseWithPreloadedContext(
//           message,
//           preloadedContext,
//           buildConversationContext(conversationHistory)
//         );

//         return new Response(
//           JSON.stringify({
//             message: {
//               role: "assistant",
//               content: response,
//             },
//           }),
//           { status: 200, headers: { "Content-Type": "application/json" } }
//         );
//       } catch (error) {
//         console.error("Error with preloaded context:", error);
//         // Fall through to regular processing
//       }
//     }

//     // Check for simple greetings first
//     const simpleResponse = getSimpleResponse(
//       message,
//       userData?.user?.firstName || "there",
//       hasValidUser,
//       hasValidDetailedInfo
//     );

//     if (simpleResponse) {
//       console.log(`✅ Returning simple response`);
//       return new Response(
//         JSON.stringify({
//           message: {
//             role: "assistant",
//             content: simpleResponse,
//           },
//         }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Check for general queries
//     if (isGeneralQuery(message)) {
//       console.log(`✅ Returning general response`);
//       const generalResponse = getGeneralResponse(
//         message,
//         userData?.user?.firstName || ""
//       );
//       return new Response(
//         JSON.stringify({
//           message: {
//             role: "assistant",
//             content: generalResponse,
//           },
//         }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // ALL OTHER QUERIES go to vector search
//     console.log(`🔍 Processing query with vector search`);

//     try {
//       const response = await queryDocumentsWithUserContext(
//         message,
//         userData || null,
//         userId || "",
//         conversationHistory
//       );

//       console.log(`✅ Vector search completed successfully`);

//       return new Response(
//         JSON.stringify({
//           message: {
//             role: "assistant",
//             content: response,
//           },
//         }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     } catch (vectorError) {
//       console.error("❌ Vector search failed:", vectorError);

//       // Fallback response for vector search failures
//       const fallbackMessage = hasValidUser
//         ? `I'm sorry, ${userData?.user?.firstName}, I'm having trouble accessing my knowledge base right now. Please try again in a moment, or feel free to ask me something else about studying abroad! 😊`
//         : "I'm sorry, I'm having trouble accessing my knowledge base right now. Please try again in a moment, or feel free to ask me something else about studying abroad! 😊";

//       return new Response(
//         JSON.stringify({
//           message: {
//             role: "assistant",
//             content: fallbackMessage,
//           },
//         }),
//         { status: 200, headers: { "Content-Type": "application/json" } }
//       );
//     }
//   } catch (error) {
//     console.error("❌ Error in streamingChatHandler:", error);

//     return new Response(
//       JSON.stringify({
//         message: {
//           role: "assistant",
//           content:
//             "I'm sorry, something went wrong. Please try again later. 😔",
//         },
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// // Main POST handler
// export async function POST(req: NextRequest) {
//   try {
//     const handlerWithHeaders = async (
//       req: NextRequest,
//       body: ChatRequestBody
//     ): Promise<Response> => {
//       return await streamingChatHandler(req, body);
//     };

//     return await withCaching(req, handlerWithHeaders);
//   } catch (error) {
//     console.error("🔥 Middleware error:", error);
//     return new Response(
//       JSON.stringify({
//         message: {
//           role: "assistant",
//           content:
//             "I'm sorry, our systems are experiencing issues. Please try again later.",
//         },
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
