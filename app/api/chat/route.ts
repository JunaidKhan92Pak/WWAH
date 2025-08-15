// Enhanced api/chat/route.ts 
import { NextRequest } from "next/server";
import { withCaching } from "@/middleware/api";
import { UserStore } from "@/store/useUserData";
import { handleUnifiedQuery } from "@/lib/langchain";

interface ChatRequestBody {
  message: string;
  userData?: UserStore;
  userId?: string;
  conversationHistory?: { role: string; content: string }[];
  preloadedContext?: unknown;
}

export const maxDuration = 60;

// Archive links configuration - Update these to match your actual routes
const ARCHIVE_LINKS = {
  universities: "/universities", // Your university archive page
  courses: "/courses", // Your course archive page
  scholarships: "/scholarships", // Your scholarship archive page
  dashboard: "/dashboard/overview", // Your dashboard page
};

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

// Function to create conversation context for LangChain
function buildConversationContext(
  conversationHistory: { role: string; content: string }[]
): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "This is the start of a new conversation.";
  }

  // Build a clear conversation context
  const contextLines = ["Previous conversation context:"];

  // Include last 10 messages or all if fewer
  const recentHistory = conversationHistory.slice(-10);

  recentHistory.forEach((msg, index) => {
    console.log(index);
    if (msg && msg.role && msg.content) {
      const speaker = msg.role === "user" ? "User" : "Assistant";
      contextLines.push(`${speaker}: ${msg.content.trim()}`);
    }
  });

  contextLines.push(
    "\nCurrent conversation context established. Please respond appropriately to maintain conversation flow and context."
  );

  return contextLines.join("\n");
}

// Enhanced function to post-process response and ensure archive links are properly formatted
function enhanceResponseWithArchiveLinks(
  response: string,
  query: string
): string {
  let enhancedResponse = response;

  // Check if response already has archive links
  const hasArchiveLinks = response.includes("[") && response.includes("](");

  if (!hasArchiveLinks) {
    const queryLower = query.toLowerCase();
    const relevantLinks = [];

    // Determine relevant links based on query content
    if (
      queryLower.includes("university") ||
      queryLower.includes("college") ||
      queryLower.includes("institution")
    ) {
      relevantLinks.push(
        `[🏛️ Explore All Universities](${ARCHIVE_LINKS.universities})`
      );
    }

    if (
      queryLower.includes("course") ||
      queryLower.includes("program") ||
      queryLower.includes("degree") ||
      queryLower.includes("study")
    ) {
      relevantLinks.push(`[📚 Browse All Courses](${ARCHIVE_LINKS.courses})`);
    }

    if (
      queryLower.includes("scholarship") ||
      queryLower.includes("funding") ||
      queryLower.includes("financial aid")
    ) {
      relevantLinks.push(
        `[💰 View All Scholarships](${ARCHIVE_LINKS.scholarships})`
      );
    }

    if (
      queryLower.includes("apply") ||
      queryLower.includes("application") ||
      queryLower.includes("dashboard")
    ) {
      relevantLinks.push(`[📋 Visit Dashboard](${ARCHIVE_LINKS.dashboard})`);
    }

    // If no specific matches, add general exploration links
    if (relevantLinks.length === 0) {
      relevantLinks.push(
        `[📚 Browse Courses](${ARCHIVE_LINKS.courses})`,
        `[🏛️ Explore Universities](${ARCHIVE_LINKS.universities})`
      );
    }

    // Add the links to the response
    if (relevantLinks.length > 0) {
      enhancedResponse += `\n\n**🔍 Explore More:**\n${relevantLinks.join(
        " • "
      )}`;
    }
  }

  return enhancedResponse;
}

// Enhanced function to add contextual follow-up suggestions
function addContextualFollowUp(response: string, userData?: UserStore): string {
  let enhancedResponse = response;

  // Check if user has preferences to suggest more targeted exploration
  if (userData?.detailedInfo?.studyPreferenced) {
    const prefs = userData.detailedInfo.studyPreferenced;

    if (
      !response.includes("Next Steps") &&
      !response.includes("Explore More")
    ) {
      enhancedResponse += `\n\n**💡 Personalized Suggestions:**\n`;
      enhancedResponse += `Based on your interest in ${prefs.degree} in ${prefs.subject} in ${prefs.country}:\n`;
      enhancedResponse += `• [Find ${prefs.subject} Courses](${ARCHIVE_LINKS.courses})\n`;
      enhancedResponse += `• [Explore ${prefs.country} Universities](${ARCHIVE_LINKS.universities})\n`;
      enhancedResponse += `• [Check Available Scholarships](${ARCHIVE_LINKS.scholarships})`;
    }
  }

  return enhancedResponse;
}

async function streamingChatHandler(
  req: NextRequest,
  body: ChatRequestBody
): Promise<Response> {
  try {
    const {
      message,
      userData,
      userId,
      conversationHistory = [],
      preloadedContext,
    } = body;

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
    console.log(
      `💬 Conversation history length: ${conversationHistory.length}`
    );

    const { hasValidUser, userSummary } = validateUserData(userData);
    console.log(`📋 ${userSummary}`);

    // Enhanced conversation history formatting
    const formattedHistory = conversationHistory
      .map((msg, index) => {
        // Validate message structure
        if (!msg || typeof msg !== "object" || !msg.role || !msg.content) {
          console.warn(`Invalid message at index ${index}:`, msg);
          return null;
        }

        return {
          role: msg.role,
          content: msg.content,
          timestamp: Date.now() - (conversationHistory.length - index) * 60000,
          index: index,
        };
      })
      .filter((msg) => msg !== null);

    console.log(
      `✅ Formatted ${formattedHistory.length} valid messages from history`
    );

    // Build conversation context string
    const conversationContext = buildConversationContext(formattedHistory);
    console.log(
      `🧠 Conversation context built with ${formattedHistory.length} messages`
    );

    // Add debugging for conversation context
    if (formattedHistory.length > 0) {
      console.log("📜 Conversation context preview:");
      formattedHistory.slice(-3).forEach((msg, idx) => {
        console.log(idx);
        console.log(`  ${msg.role}: ${msg.content.substring(0, 100)}...`);
      });
    }

    // Use unified query handler with enhanced context
    try {
      let response = await handleUnifiedQuery({
        message,
        userData: userData || null,
        userId: userId || "",
        conversationHistory: formattedHistory,
        conversationContext,
        preloadedContext,
      });

      // Post-process the response to ensure archive links are included
      response = enhanceResponseWithArchiveLinks(response, message);

      // Add contextual follow-up suggestions if user has preferences
      response = addContextualFollowUp(response, userData);

      console.log(
        `✅ Query processed successfully with context of ${formattedHistory.length} messages`
      );

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

      // Enhanced fallback response with archive links
      const fallbackMessage = hasValidUser
        ? `I'm sorry, ${userData?.user?.firstName}, I'm having trouble processing your request right now. Please try again in a moment, or feel free to explore our resources! 😊\n\n**🔍 Explore:**\n[Browse Courses](${ARCHIVE_LINKS.courses}) • [Explore Universities](${ARCHIVE_LINKS.universities}) • [View Scholarships](${ARCHIVE_LINKS.scholarships})`
        : `I'm sorry, I'm having trouble processing your request right now. Please try again in a moment, or feel free to explore our resources! 😊\n\n**🔍 Explore:**\n[Browse Courses](${ARCHIVE_LINKS.courses}) • [Explore Universities](${ARCHIVE_LINKS.universities}) • [View Scholarships](${ARCHIVE_LINKS.scholarships})`;

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

    // Enhanced error response with archive links
    const errorMessage = `I'm sorry, something went wrong. Please try again later. 😔\n\n**🔍 Meanwhile, explore:**\n[Browse Courses](${ARCHIVE_LINKS.courses}) • [Explore Universities](${ARCHIVE_LINKS.universities}) • [View Scholarships](${ARCHIVE_LINKS.scholarships})`;

    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content: errorMessage,
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

    // Enhanced middleware error response with archive links
    const middlewareErrorMessage = `I'm sorry, our systems are experiencing issues. Please try again later.\n\n**🔍 Explore our resources:**\n[Browse Courses](${ARCHIVE_LINKS.courses}) • [Explore Universities](${ARCHIVE_LINKS.universities}) • [View Scholarships](${ARCHIVE_LINKS.scholarships})`;

    return new Response(
      JSON.stringify({
        message: {
          role: "assistant",
          content: middlewareErrorMessage,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


