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
