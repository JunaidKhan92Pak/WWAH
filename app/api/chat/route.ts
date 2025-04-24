// v1
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { queryDocuments } from "@/lib/langchain";
// import { Message } from "@/lib/types";
// import { ObjectId } from "mongodb";

// export async function POST(req: NextRequest) {
//   try {
//     const { message, sessionId } = await req.json();

//     const client = await clientPromise;
//     const db = client.db("test");
//     const sessions = db.collection("sessions");

//     // Create or find session
//     let session;
//     console.log("Received message:", message);

//     if (sessionId) {
//       session = await sessions.findOne({ _id: new ObjectId(sessionId) });
//       if (!session) {
//         return NextResponse.json(
//           { error: "Session not found" },
//           { status: 404 }
//         );
//       }
//     } else {
//       session = {
//         messages: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       const result = await sessions.insertOne(session);
//       console.log(result, "result");

//       session._id = result.insertedId;
//     }
//     // Add user message
//     const userMessage: Message = { role: "user", content: message };
//     session.messages.push(userMessage);

//     // Generate response with RAG
//      const response = await queryDocuments(message);
//      console.log("Got response:", response);
//     // Add assistant message
//     const assistantMessage: Message = { role: "assistant", content: response };
//     session.messages.push(assistantMessage);

//     // Update session
//     session.updatedAt = new Date();
//     await sessions.updateOne(
//       { _id: session._id },
//       { $set: { messages: session.messages, updatedAt: session.updatedAt } },
//       { upsert: true }
//     );

//     return NextResponse.json({
//       message: assistantMessage,
//       sessionId: session._id.toString(),
//     });
//   } catch (error) {
//     console.error("Error from queryDocuments:", error);
//     console.error("Error in chat API:", error);
//     return NextResponse.json(
//       { error: "Failed to process message" },
//       { status: 500 }
//     );
//   }
// }

// v2
// import { NextRequest, NextResponse } from "next/server";
// import { queryDocumentsWithUserContext } from "@/lib/langchain";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req: NextRequest) {
//   try {
//     const { message, userId, conversationHistory = [] } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }
//       console.log(userId, "userId from chat route");

//     // Get user preferences from database
//     const client = await clientPromise;
//     const db = client.db("test");

//     // Fetch user data including preferences
//     let userPreferences = {};
//     if (userId) {
//       const user = await db.collection("userdbs").findOne({
//         _id: new ObjectId(userId),
//       });
    
//       if (user) {
//         // Also fetch related user preference document
//         const userPref = await db.collection("userpreferences").findOne({
//           userId: userId,
//         });

//         if (userPref) {
//           userPreferences = userPref;
//         }
//       }
//     }

//     // Get response from LangChain with user context
//     const response = await queryDocumentsWithUserContext(
//       message,
//       userPreferences,
//       conversationHistory
//     );

//     return NextResponse.json({
//       message: {
//         role: "assistant",
//         content: response,
//       },
//     });
//   } catch (error) {
//     console.error("Chat API error:", error);
//     return NextResponse.json(
//       { error: "Failed to process message" },
//       { status: 500 }
//     );
//   }
// }

// v3
// import { NextRequest, NextResponse } from "next/server";
// import { queryDocumentsWithUserContext } from "@/lib/langchain";
// import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req: NextRequest) {
//   try {
//     const { message, userId, conversationHistory = [] } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }
//     console.log(userId, "userId from chat route");

//     // Get user data from database
//     const client = await clientPromise;
//     const db = client.db("test");

//     // Fetch user data from the two collections you mentioned
//     let userData = {};
//     if (userId) {
//       // Get data from userdbs collection
//       const user = await db.collection("userdbs").findOne({
//         _id: new ObjectId(userId),
//       });
      
//       // Get data from successchances collection
//       const successChances = await db.collection("successchances").find({
//         userId: userId,
//       }).toArray();

//       // Combine the data
//       if (user) {
//         userData = {
//           user: user,
//           successChances: successChances || []
//         };
//       }
//     }

//     // Get response from LangChain with user context
//     const response = await queryDocumentsWithUserContext(
//       message,
//       userData,  // Pass the combined userData
//       userId,
//       conversationHistory
//     );

//     return NextResponse.json({
//       message: {
//         role: "assistant",
//         content: response,
//       },
//     });
//   } catch (error) {
//     console.error("Chat API error:", error);
//     return NextResponse.json(
//       { error: "Failed to process message" },
//       { status: 500 }
//     );
//   }
// }


// // import { NextRequest, NextResponse } from "next/server";
// // import { queryDocumentsWithUserContext } from "@/lib/langchain";
// // import clientPromise from "@/lib/mongodb";
// // import { ObjectId, WithId, Document } from "mongodb";

// // export async function POST(req: NextRequest) {
// //   try {
// //     const { message, userId, conversationHistory = [] } = await req.json();

// //     if (!message) {
// //       return NextResponse.json(
// //         { error: "Message is required" },
// //         { status: 400 }
// //       );
// //     }
// //     console.log(userId, "userId from chat route");

// //     // Get user data from database
// //     const client = await clientPromise;
// //     const db = client.db("wwah");

// //     // Fetch user data from the two collections you mentioned
// //     let userData = {
// //       firstName: "",
// //       lastName: "",
// //       email: "",
// //       password: "",
// //       otpVerified: "",
// //       createdAt: "",
// //       updatedAt: "",
// //       city: "",
// //       contactNo: "",
// //       dob: "",
// //       country: "",
// //       nationality: "",
// //       successChances: [] as WithId<Document>[], // Ensure consistent usage of MongoDB's Document type
// //     };
// //     if (userId) {
// //       // Get data from userdbs collection
// //       const user = await db.collection("userdbs").findOne({
// //         _id: new ObjectId(userId),
// //       });

// //       // Get data from successchances collection
// //       const successChances = await db
// //         .collection("successchances")
// //         .find({
// //           userId: userId,
// //         })
// //         .toArray();

// //       // Combine the data
// //       if (user) {
// //         userData = {
// //           ...userData,
// //           firstName: user.firstName || "",
// //           lastName: user.lastName || "",
// //           email: user.email || "",
// //           password: user.password || "",
// //           otpVerified: user.otpVerified || "",
// //           createdAt: user.createdAt || "",
// //           updatedAt: user.updatedAt || "",
// //           city: user.city || "",
// //           contactNo: user.contactNo || "",
// //           dob: user.dob || "",
// //           country: user.country || "",
// //           nationality: user.nationality || "",
// //           successChances: successChances,
// //         };
// //       }
// //     }

// //     // Get response from LangChain with user context
// //     const response = await queryDocumentsWithUserContext(
// //       message,
// //       {
// //         ...userData,
// //         successChances: userData.successChances.map((item) =>
// //           item._id.toString()
// //         ),
// //       }, // Map successChances to string[]
// //       userId,
// //       conversationHistory
// //     );

// //     return NextResponse.json({
// //       message: {
// //         role: "assistant",
// //         content: response,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Chat API error:", error);
// //     return NextResponse.json(
// //       { error: "Failed to process message" },
// //       { status: 500 }
// //     );
// //   }
// // }
import { NextRequest, NextResponse } from "next/server";
import { queryDocumentsWithUserContext } from "@/lib/langchain";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { message, userId, conversationHistory = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    console.log(userId, "userId from chat route");

    // Get user data from database
    const client = await clientPromise;
    const db = client.db("wwah");

    // Fetch user data from the two collections you mentioned
    let userData = {};
    if (userId) {
      // Get data from userdbs collection
      const user = await db.collection("userdbs").findOne({
        _id: new ObjectId(userId),
      });

      // Get data from successchances collection
      const successChances = await db
        .collection("successchances")
        .find({
          userId: userId,
        })
        .toArray();

      // Combine the data
      if (user) {
        userData = {
          user: user,
          successChances: successChances || [],
        };
      }
    }

    // Get response from LangChain with user context
    const response = await queryDocumentsWithUserContext(
      message,
      userData, // Pass the combined userData
      userId,
      conversationHistory
    );

    return NextResponse.json({
      message: {
        role: "assistant",
        content: response,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
