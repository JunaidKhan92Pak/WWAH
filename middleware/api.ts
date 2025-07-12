// // middleware/api.ts

// import { NextRequest } from "next/server";
// import {
//   getCachedUserData,
//   cacheUserData,
//   getCachedVectorResults,
//   cacheVectorResults,
// } from "@/lib/redis";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { DetailedInfo, User, UserStore } from "@/store/useUserData";

// // More restrictive simple query patterns - only first message greetings
// const simpleQueryPatterns = [/^hi+\s*!*$/i, /^hello+\s*!*$/i, /^hey+\s*!*$/i];
// interface RequestBody {
//   message: string;
//   userId?: string;
//   userData?: UserStore;
//   conversationHistory?: { role: string; content: string }[];
// }

// // Smarter cache key generation that considers conversation flow
// function generateSmartCacheKey(
//   message: string,
//   userId?: string,
//   conversationHistory: any[] = []
// ): string {
//   // Never cache if there's conversation history - always fresh responses
//   if (conversationHistory.length > 0) {
//     return `no-cache-conversation-${Date.now()}`;
//   }

//   // Never cache for logged-in users to ensure personalization
//   if (userId) {
//     return `no-cache-user-${Date.now()}`;
//   }

//   // Only cache very simple first-time greetings for anonymous users
//   const normalizedMessage = message.toLowerCase().trim();
//   if (
//     normalizedMessage === "hi" ||
//     normalizedMessage === "hello" ||
//     normalizedMessage === "hey"
//   ) {
//     return `simple:${normalizedMessage}`;
//   }

//   // Everything else gets fresh response
//   return `no-cache-${Date.now()}`;
// }

// export async function withCaching(
//   req: NextRequest,
//   handler: (req: NextRequest, body: RequestBody) => Promise<Response>,
//   options?: { headers?: Record<string, string> }
// ) {
//   const body = await req.json();
//   const { message, userId, conversationHistory = [] } = body;

//   console.log(
//     `⚡ Processing: "${message.substring(0, 50)}..." (History: ${
//       conversationHistory.length
//     } messages)`
//   );

//   // Only fast-track very simple greetings with no conversation history
//   const isSimpleFirstGreeting =
//     simpleQueryPatterns.some((pattern) => pattern.test(message.trim())) &&
//     conversationHistory.length === 0 &&
//     !userId; // Don't fast-track for logged-in users

//   if (isSimpleFirstGreeting) {
//     console.log("🔥 Fast-tracked simple greeting for anonymous user");
//     const simpleResponse = getGenericGreeting();

//     return new Response(
//       JSON.stringify({
//         message: { role: "assistant", content: simpleResponse },
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//           ...(options?.headers || {}),
//         },
//       }
//     );
//   }

//   // Smart caching - very conservative
//   const cacheKey = generateSmartCacheKey(message, userId, conversationHistory);
//   let cachedResponse = null;

//   // Only check cache for very simple queries
//   if (cacheKey.startsWith("simple:") && !userId) {
//     try {
//       cachedResponse = (await Promise.race([
//         getCachedVectorResults(cacheKey),
//         new Promise((resolve) => setTimeout(() => resolve(null), 300)),
//       ])) as string | null;
//     } catch (error) {
//       console.warn("Cache check failed:", error);
//     }

//     if (cachedResponse && typeof cachedResponse === "string") {
//       console.log("📋 Using cached simple response");
//       return new Response(
//         JSON.stringify({
//           message: { role: "assistant", content: cachedResponse },
//         }),
//         {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json",
//             ...(options?.headers || {}),
//           },
//         }
//       );
//     }
//   }

//   // Always fetch fresh user data for logged-in users
//   let userData = null;
//   if (userId) {
//     try {
//       console.log("👤 Fetching user data...");
//       userData = await fetchUserDataOptimized(userId);
//       if (userData) {
//         console.log(
//           `✅ User data loaded for ${userData.user?.firstName || "user"}`
//         );
//         // Cache user data but don't rely on it for responses
//         cacheUserData(userId, userData).catch(console.warn);
//       }
//     } catch (error) {
//       console.warn(
//         "User data fetch failed, continuing without profile:",
//         error
//       );
//     }
//   }

//   // Attach user data and continue
//   body.userData = userData;

//   // Execute handler
//   try {
//     const response = await handler(req, body);

//     // Only cache very simple responses
//     if (response.ok && cacheKey.startsWith("simple:")) {
//       // Cache simple responses in background
//       setTimeout(() => {
//         if (cacheKey.startsWith("simple:")) {
//           cacheVectorResults(cacheKey, getGenericGreeting()).catch(
//             console.warn
//           );
//         }
//       }, 100);
//     }

//     return response;
//   } catch (error) {
//     console.error("Handler execution failed:", error);
//     return new Response(
//       JSON.stringify({
//         message: {
//           role: "assistant",
//           content:
//             "I'm experiencing some technical difficulties. Please try again in a moment.",
//         },
//       }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// // Lightning-fast user data fetch with minimal fields
// async function fetchUserDataOptimized(
//   userId: string
// ): Promise<UserStore | null> {
//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");

//     console.log(`👤 Fetching optimized data for user: ${userId}`);

//     // Parallel queries with comprehensive fields
//     const [user, detailedInfo] = await Promise.all([
//       db.collection("userdbs").findOne(
//         { _id: new ObjectId(userId) },
//         {
//           projection: {
//             firstName: 1,
//             lastName: 1,
//             email: 1,
//             _id: 1,
//           },
//         }
//       ),
//       // FIX: Use ObjectId for userId field since it's defined as ObjectId in schema
//       db.collection("successchances").findOne(
//         { userId: new ObjectId(userId) }, // Convert string to ObjectId
//         {
//           projection: {
//             preferredCountries: 1,
//             interestedSubjects: 1,
//             degreeLevel: 1,
//             budget: 1,
//             englishProficiency: 1,
//             academicBackground: 1,
//             targetScore: 1,
//             userId: 1,
//             // Add the actual fields from your schema
//             studyLevel: 1,
//             gradeType: 1,
//             grade: 1,
//             dateOfBirth: 1,
//             nationality: 1,
//             majorSubject: 1,
//             livingCosts: 1,
//             tuitionFee: 1,
//             languageProficiency: 1,
//             workExperience: 1,
//             studyPreferenced: 1,
//           },
//         }
//       ),
//     ]);

//     if (!user) {
//       console.log(`❌ User not found for ID: ${userId}`);
//       return null;
//     }

//     const userData: UserStore = {
//       detailedInfo: detailedInfo as DetailedInfo | null,
//       user: user as User | null,
//       loading: false,
//       error: null,
//       isAuthenticated: true,
//       fetchUserProfile: async () => {},
//       setUser: () => {},
//       logout: () => {},
//       updateUserProfile: async () => {},
//       updateDetailedInfo: async () => {},
//     };

//     console.log(userData, " userData from api middleware");

//     console.log(`✅ User profile loaded:`, {
//       name: user.firstName,
//       hasDetailedInfo: !!detailedInfo,
//       // Log actual schema fields
//       studyLevel: detailedInfo?.studyLevel || "none",
//       nationality: detailedInfo?.nationality || "none",
//       majorSubject: detailedInfo?.majorSubject || "none",
//     });

//     return userData;
//   } catch (error) {
//     console.error("❌ Optimized user data fetch failed:", error);
//     return null;
//   }
// }
// // Generic greeting for anonymous users only
// function getGenericGreeting(): string {
//   return `Hi there! 👋 I'm ZEUS, and I'm here to help with whatever you need. Whether it's about studying abroad, university questions, or just chatting - what's on your mind?`;
// }
// middleware/api.ts
import { NextRequest } from "next/server";
import {
  getCachedUserData,
  cacheUserData,
  getCachedVectorResults,
  generateVectorKey,
} from "@/lib/redis";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DetailedInfo, User, UserStore } from "@/store/useUserData";

// Simple query classifier
const simpleQueryPatterns = [
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

interface RequestBody {
  message: string;
  userId?: string;
  userData?: UserStore; // Replace 'any' with a more specific type if known
}

export async function withCaching(
  req: NextRequest,
  handler: (req: NextRequest, body: RequestBody) => Promise<Response>,
  options?: { headers?: Record<string, string> }
) {
  const body = await req.json();
  const { message, userId } = body;

  // Fast path for simple queries
  const isSimpleQuery = simpleQueryPatterns.some((pattern) =>
    pattern.test(message.trim())
  );

  if (isSimpleQuery) {
    let userName = "there";

    // If we have a userId, try to get name from cache
    if (userId) {
      const cachedUserData = await getCachedUserData(userId);
      if (cachedUserData) {
        userName = cachedUserData.user?.firstName || "there";
      }
    }

    // Return fast response
    const simpleResponse = getSimpleResponse(message, userName);
    const responseBody = JSON.stringify({
      message: {
        role: "assistant",
        content: simpleResponse,
      },
    });

    // Use provided headers if they exist
    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
  }

  // For complex queries, check if we have user data cached
  let userData = null;
  if (userId) {
    userData = await getCachedUserData(userId);

    // If not cached, fetch and cache it
    if (!userData) {
      userData = await fetchAndCacheUserData(userId);
    }
  }

  // Check if we have a cached vector response
  const vectorCacheKey = generateVectorKey(message, userId);
  const cachedResponse = await getCachedVectorResults(vectorCacheKey);

  if (cachedResponse) {
    const responseBody = JSON.stringify({
      message: {
        role: "assistant",
        content: cachedResponse,
      },
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
  }

  // If no cache, continue to the handler with userData attached
  body.userData = userData;
  return handler(req, body);
}

// Helper function to fetch and cache user data
async function fetchAndCacheUserData(userId: string) {
  const client = await clientPromise;
  const db = client.db("wwah");

  // Fetch user data from MongoDB
  const [user, detailedInfo] = await Promise.all([
    db.collection("userdbs").findOne({ _id: new ObjectId(userId) }),
    db.collection("successchances").findOne({ userId: new ObjectId(userId) }),
  ]);

  // Create a UserStore compatible object
  // ✅ RIGHT
  const userData: UserStore = {
    detailedInfo: detailedInfo as DetailedInfo | null,
    user: user as User | null,
    loading: false,
    error: null,
    isAuthenticated: !!user,
    fetchUserProfile: async () => {}, // stub
    setUser: () => {}, // stub
    logout: () => {}, // stub
    updateUserProfile: async () => {}, // stub
    updateDetailedInfo: async () => {}, // stub
  };

  console.log("userData", userData);
  // Cache the data
  await cacheUserData(userId, userData);

  return userData;
}

// Get simple response for general queries
function getSimpleResponse(message: string, userName: string): string {
  if (/^(hi+|hello+|hey+)\s*$/i.test(message.trim())) {
    return `Hello ${userName}! How can I help you with your university or scholarship search today?`;
  }

  if (/^how are you/i.test(message.trim())) {
    return "I'm doing well, thanks for asking! Ready to help you with university and scholarship information. What would you like to know?";
  }

  if (/^(thanks|thank you)/i.test(message.trim())) {
    return "You're welcome! Let me know if you need any more help with universities or scholarships.";
  }

  return `Hello ${userName}! How can I assist you with university or scholarship information today?`;
}
