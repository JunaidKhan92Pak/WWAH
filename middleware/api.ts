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

  // Create a complete UserStore compatible object
  const userData: UserStore = {
    // Core data
    user: user as User | null,
    detailedInfo: detailedInfo as DetailedInfo | null,
    loading: false,
    error: null,
    isAuthenticated: !!user,
    lastUpdated: user?.updatedAt || null,

    // Add totalFavourites property (default to 0 or appropriate value)
    totalFavourites: 0,

    // Favorite courses state
    favoriteCourses: {},
    favoriteCourseIds: (user as any)?.favouriteCourse || [],
    loadingFavoriteCourses: false,

    // Applied courses state
    appliedCourses: {},
    appliedCourseIds: ((user as any)?.appliedCourses || []).map((course: any) =>
      typeof course === "string" ? course : course.courseId
    ),
    loadingAppliedCourses: false,

    // MISSING: Confirmed courses state (NEW - ADDED)
    confirmedCourses: {},
    confirmedCourseIds: [],
    loadingConfirmedCourses: false,

    // Favorite universities state
    favoriteUniversities: {},
    favoriteUniversityIds: (user as any)?.favouriteUniversity || [],
    loadingFavorites: false,

    // Favorite scholarships state
    favoriteScholarships: {},
    favoriteScholarshipIds: (user as any)?.favouriteScholarship || [],
    loadingScholarships: false,

    // Applied scholarship courses state
    appliedScholarshipCourses: {},
    appliedScholarshipCourseIds: (
      (user as any)?.appliedScholarshipCourses || []
    ).map((app: any) =>
      typeof app === "string" ? app : app._id || app.toString()
    ),
    loadingApplications: false,

    // Confirmed scholarships properties
    confirmedScholarshipCourses: {},
    confirmedScholarshipCourseIds: [],
    loadingConfirmedApplications: false,

    // Embedding properties
    embeddingUpdateStatus: "idle" as const,
    lastEmbeddingUpdate: null,

    // Core action methods
    fetchUserProfile: async () => { },
    updateUserProfile: async () => false,
    updateDetailedInfo: async () => false,
    setUser: () => { },
    logout: () => { },
    getLastUpdatedDate: () => null,

    // Favorite courses actions
    fetchFavoriteCourses: async () => { },
    toggleCourseFavorite: async (
      _courseId: string,
      _action: "add" | "remove"
    ) => false,
    getCourseFavoriteStatus: (_courseId: string) => false,

    // Applied courses actions
    fetchAppliedCourses: async () => { },
    addAppliedCourse: async (_courseId: string, _applicationStatus?: number) =>
      false,
    updateAppliedCourse: async (
      _courseId: string,
      _applicationStatus: number
    ) => false,
    updateCourseConfirmation: async (
      _courseId: string,
      _isConfirmed: boolean
    ) => false,
    removeAppliedCourse: async (_courseId: string) => false,
    getAppliedCourseStatus: (_courseId: string) => false,
    getAppliedCourseDetails: (_courseId: string) => null,

    // MISSING: Confirmed courses actions (NEW - ADDED)
    fetchConfirmedCourses: async (_userId?: string) => { },
    getConfirmedCourseStatus: (_courseId: string) => false,
    getConfirmedCourseDetails: (_courseId: string) => null,

    // Favorite universities actions
    fetchFavoriteUniversities: async () => { },
    toggleUniversityFavorite: async (
      _universityId: string,
      _action: "add" | "remove"
    ) => false,
    getFavoriteStatus: (_universityId: string) => false,

    // Favorite scholarships actions
    fetchFavoriteScholarships: async () => { },
    toggleScholarshipFavorite: async (
      _scholarshipId: string,
      _action: "add" | "remove"
    ) => false,
    getScholarshipFavoriteStatus: (_scholarshipId: string) => false,

    // Applied scholarship courses actions
    fetchAppliedScholarshipCourses: async () => { },
    fetchAppliedScholarship: async (_id: string) => { },
    addAppliedScholarshipCourse: async (_applicationData: any) => false,
    refreshApplications: async () => { },
    getApplicationProgress: (_courseId: string) => 0,

    // Confirmed scholarships action
    fetchConfirmedScholarshipCourses: async (_userId: string) => { },

    // Embedding refresh method
    refreshEmbeddings: async () => false,
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
