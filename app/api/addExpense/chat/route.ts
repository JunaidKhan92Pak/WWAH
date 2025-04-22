import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { queryDocuments } from "@/lib/langchain";
import { Message } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    const client = await clientPromise;
    const db = client.db("test");
    const sessions = db.collection("sessions");

    // Create or find session
    let session;
    console.log("Received message:", message);

    if (sessionId) {
      session = await sessions.findOne({ _id: new ObjectId(sessionId) });
      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    } else {
      session = {
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await sessions.insertOne(session);
      console.log(result, "result");

      session._id = result.insertedId;
    }
    // Add user message
    const userMessage: Message = { role: "user", content: message };
    session.messages.push(userMessage);

    // Generate response with RAG
     const response = await queryDocuments(message);
     console.log("Got response:", response);
    // Add assistant message
    const assistantMessage: Message = { role: "assistant", content: response };
    session.messages.push(assistantMessage);

    // Update session
    session.updatedAt = new Date();
    await sessions.updateOne(
      { _id: session._id },
      { $set: { messages: session.messages, updatedAt: session.updatedAt } },
      { upsert: true }
    );

    return NextResponse.json({
      message: assistantMessage,
      sessionId: session._id.toString(),
    });
  } catch (error) {
    console.error("Error from queryDocuments:", error);
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
