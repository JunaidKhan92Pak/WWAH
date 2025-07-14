// api/chat/route.ts
import { NextRequest } from "next/server";
import { withCaching } from "@/middleware/api";
import { UserStore } from "@/store/useUserData";
import { handleUnifiedQuery } from "@/lib/langchain";

interface ChatRequestBody {
  message: string;
  userData?: UserStore;
  userId?: string;
  conversationHistory?: { role: string; content: string }[];
}
export const maxDuration = 60;
// Helper function to validate user data
function validateUserData(userData?: UserStore): {
  hasValidUser: boolean;
  hasValidDetailedInfo: boolean;
  userSummary: string;
} {
  const hasValidUser = !!(userData?.user?._id && userData?.user?.firstName);
  const hasValidDetailedInfo = !!(
    userData?.detailedInfo &&
    userData.detailedInfo.studyPreferenced &&
    userData.detailedInfo.studyPreferenced.country &&
    userData.detailedInfo.studyPreferenced.degree &&
    userData.detailedInfo.studyPreferenced.subject
  );

  let userSummary = "User is not logged in";
  if (hasValidUser) {
    userSummary = `User: ${userData!.user!.firstName} ${
      userData!.user!.lastName
    }`;
    if (hasValidDetailedInfo) {
      const prefs = userData!.detailedInfo!.studyPreferenced;
      const details = [];
      if (prefs?.country) details.push(`Country: ${prefs.country}`);
      if (prefs?.degree) details.push(`Degree: ${prefs.degree}`);
      if (prefs?.subject) details.push(`Subject: ${prefs.subject}`);
      if (userData!.detailedInfo!.nationality)
        details.push(`Nationality: ${userData!.detailedInfo!.nationality}`);
      if (details.length > 0) {
        userSummary += ` (${details.join(", ")})`;
      }
    }
  }

  return { hasValidUser, hasValidDetailedInfo, userSummary };
}

// Main streaming chat handler - now simplified with unified query handling
async function streamingChatHandler(
  req: NextRequest,
  body: ChatRequestBody
): Promise<Response> {
  try {
    const { message, userData, userId, conversationHistory = [] } = body;

    // Validate inputs
    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({
          message: {
            role: "assistant",
            content: "I need a message to respond to. Please ask me something!",
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📨 Processing message: "${message}"`);
    console.log(`👤 User ID: ${userId || "Anonymous"}`);

    const { hasValidUser, userSummary } = validateUserData(userData);
    console.log(`📋 ${userSummary}`);

    // Use unified query handler - this now handles all query types internally
    try {
      const response = await handleUnifiedQuery({
        message,
        userData: userData || null,
        userId: userId || "",
        conversationHistory,
      });

      console.log(`✅ Query processed successfully`);

      return new Response(
        JSON.stringify({
          message: {
            role: "assistant",
            content: response,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (queryError) {
      console.error("❌ Query processing failed:", queryError);

      // Fallback response for query processing failures
      const fallbackMessage = hasValidUser
        ? `I'm sorry, ${userData?.user?.firstName}, I'm having trouble processing your request right now. Please try again in a moment, or feel free to ask me something else! 😊`
        : "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment, or feel free to ask me something else! 😊";

      return new Response(
        JSON.stringify({
          message: {
            role: "assistant",
            content: fallbackMessage,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("❌ Error in streamingChatHandler:", error);

    // Always return a response, even on error
    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content:
            "I'm sorry, something went wrong. Please try again later. 😔",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Main POST handler
export async function POST(req: NextRequest) {
  try {
    const handlerWithHeaders = async (
      req: NextRequest,
      body: ChatRequestBody
    ): Promise<Response> => {
      return await streamingChatHandler(req, body);
    };

    return await withCaching(req, handlerWithHeaders);
  } catch (error) {
    console.error("🔥 Middleware error:", error);
    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content:
            "I'm sorry, our systems are experiencing issues. Please try again later.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
