import { NextRequest } from "next/server";
import {
  getCachedUserData,
  cacheUserData,
  getCachedVectorResults,
  generateVectorKey,
} from "@/lib/redis";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { SuccessData, user, UserStore } from "@/store/useUserData";

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
  const [user, successChances] = await Promise.all([
    db.collection("userdbs").findOne({ _id: new ObjectId(userId) }),
    db.collection("successchances").findOne({ userId }),
  ]);

  // Create a UserStore compatible object
  const userData: UserStore = {
    user: user
      ? {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          user: user as unknown as user,
          AcademmicInfo: user.AcademmicInfo || null,
          LanguageProf: user.LanguageProf || null,
          UserPref: user.UserPref || null,
          workExp: user.workExp || null,
        }
      : null,
    loading: false,
    error: null,
    successChances: successChances as unknown as SuccessData | null,
    isAuthenticate: !!user,
    fetchUserProfile: async () => {}, // Placeholder function
    setUser: () => {}, // Placeholder function
    logout: () => {}, // Placeholder function
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
