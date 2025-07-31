// pages/api/background/embedding-worker.ts
import { NextApiRequest, NextApiResponse } from "next";
import { setupChangeStreams } from "../../../../lib/change-stream-handler";

// This endpoint will be called periodically to ensure change streams are running
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify the request is from a trusted source (e.g., Vercel Cron)
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("🔄 Starting change stream worker...");

    // Start change streams
    const changeStreams = await setupChangeStreams();

    // Keep the function alive for a while to process changes
    // In a real deployment, you'd want this to run continuously
    // but Vercel functions have a 10-second timeout limit
    setTimeout(() => {
      console.log("⏰ Worker timeout reached, closing streams...");
      changeStreams.forEach((stream) => stream.close());
    }, 9000); // 9 seconds to stay under Vercel's limit

    res.status(200).json({
      success: true,
      message: "Change stream worker started",
      activeStreams: changeStreams.length,
    });
  } catch (error) {
    console.error("❌ Worker error:", error);
    res.status(500).json({
      error: "Worker failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
