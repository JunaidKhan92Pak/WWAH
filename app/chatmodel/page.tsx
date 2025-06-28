"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Message as MessageType } from "@/lib/types";
// import Message from "./components/Message";
// import { Card } from "@/components/ui/card";
// import { Navbar } from "./components/Navbar";
import { useUserStore } from "@/store/useUserData";
import ZeusMaintenance from "./components/Zeusmain";

// Precompiled answers for common queries
const INSTANT_RESPONSES = {
  hi: "Hello! How can I help you with your university or scholarship search today? 😊",
  hello:
    "Hi there! I'm ZEUS, ready to assist with your education queries. What would you like to know? 🎓",
  hey: "Hey! How can I help you with universities or scholarships today? 👋",
  thanks:
    "You're welcome! Let me know if you need any more help with universities or scholarships. 👍",
  "thank you":
    "You're welcome! I'm here if you need anything else about education opportunities. 🌟",
};

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, fetchUserProfile } = useUserStore();
  const abortController = useRef<AbortController | null>(null);
  const [streamingComplete, setStreamingComplete] = useState(false);
  console.log(streamingComplete, "streamingComplete");

  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] =
    useState(false);

  // Add a ref to prevent multiple submissions
  const isProcessingRef = useRef(false);

  // Check if query matches a common pattern for instant response
  const checkForInstantResponse = (query: string): string | null => {
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery in INSTANT_RESPONSES) {
      return INSTANT_RESPONSES[
        normalizedQuery as keyof typeof INSTANT_RESPONSES
      ];
    }
    // Check patterns
    if (/^how are you/i.test(normalizedQuery)) {
      return "I'm doing well, thanks for asking! Ready to help you with university and scholarship information. What would you like to know? 🎓";
    }

    return null;
  };

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      fetchUserProfile();
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  // Function to send a message (extracted for reuse)
  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || isProcessingRef.current) return;

    // Set processing flag to prevent duplicate calls
    isProcessingRef.current = true;

    // Abort any ongoing request
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }

    // Reset streaming state
    setStreamingMessage("");
    setStreamingComplete(false);

    const userMessage: MessageType = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Check for instant response first
    const instantResponse = checkForInstantResponse(messageContent);
    if (instantResponse) {
      // Add a slight delay for a better UX
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: instantResponse },
        ]);
        setIsLoading(false);
        isProcessingRef.current = false; // Reset processing flag
      }, 300);
      return;
    }

    // Create new abort controller for this request
    abortController.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: abortController.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: user?._id || null,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Check if we got a streaming response
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("text/event-stream")) {
        // Handle streaming response
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Failed to get reader from response");
        }

        // Accumulate the complete response
        let completeResponse = "";

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Mark streaming as complete
            setStreamingComplete(true);
            break;
          }

          // Decode the stream chunk
          const text = new TextDecoder().decode(value);

          // Process the SSE format
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = line.slice(6);

                // Check for the end of stream marker
                if (data === "[DONE]") continue;

                // Add to accumulated response and update state
                completeResponse += data;
                setStreamingMessage(completeResponse);
              } catch (e) {
                console.error("Error parsing streaming data:", e);
              }
            }
          }
        }

        // When streaming is done, add the message to the state ONLY if we have content
        if (completeResponse && completeResponse.trim() !== "") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "assistant", content: completeResponse },
          ]);
        }
      } else {
        // Handle regular JSON response
        const data = await response.json();
        if (data.message && data.message.content) {
          setMessages((prev) => [...prev, data.message]);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, there was an error processing your request. Please try again.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
      abortController.current = null;
      isProcessingRef.current = false; // Reset processing flag
    }
  };

  // Fixed useEffect for initial message processing
  useEffect(() => {
    const processInitialMessage = async () => {
      if (hasProcessedInitialMessage) return;

      const initialMessage = sessionStorage.getItem("initialMessage");
      if (initialMessage) {
        console.log("Processing initial message:", initialMessage);

        // Mark as processed immediately
        setHasProcessedInitialMessage(true);
        sessionStorage.removeItem("initialMessage");

        // Set input and send message
        setInput(initialMessage);

        // Small delay to ensure state is updated
        setTimeout(async () => {
          await sendMessage(initialMessage);
          setInput(""); // Clear input after sending
        }, 100);
      } else {
        setHasProcessedInitialMessage(true);
      }
    };

    processInitialMessage();
  }, []); // Empty dependency array - only run once

  // submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isProcessingRef.current) return;

    const messageToSend = input;
    setInput(""); // Clear input immediately
    await sendMessage(messageToSend);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }
      isProcessingRef.current = false;
    };
  }, []);
  const [condition] = useState(true);
  return (
    <div className="flex min-h-screen flex-col">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* Header */}
        {/* <Navbar /> */}
        {/* Chat Area */}
        {condition ? (<ZeusMaintenance />) : (

          <div className="fixed bottom-0 w-full">
            <div className="absolute inset-0 bg-[#D9D9D966] opacity-80 z-0 blur-2xl "></div>
            <div className="relative w-[90%] sm:w-[70%] lg:w-[58%] mx-auto pb-1 ">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center rounded-xl shadow-sm bg-white gap-2 px-3 py-1">
                  <Image
                    src="/chatbot.svg"
                    alt="chatrobot"
                    width={20}
                    height={20}
                  />
                  <Input
                    placeholder="Chat with ZEUS"
                    className="flex-1 border-none focus:ring-0 xl:placeholder:text-[16px]"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || isProcessingRef.current}
                    className="p-0 bg-transparent hover:bg-transparent rounded-full"
                  >
                    <Image
                      src="/icons/sendicon.svg"
                      alt="Send"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </form>
              {/* Buttons */}
              <div className="flex flex-row sm:justify-center overflow-x-auto hide-scrollbar gap-1 sm:gap-3 mt-2">
                <Link target="blank" href="/Universities">
                  <Button className="bg-red-700 text-sm md:text-md text-white hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                    Explore Top Universities
                  </Button>
                </Link>
                <Link target="blank" href="/countries">
                  <Button className="bg-red-700 text-sm md:text-md text-white hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                    Explore Study Destinations
                  </Button>
                </Link>
                <Link target="blank" href="/scholarships">
                  <Button className="bg-red-700 text-sm md:text-md text-white hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                    Explore Latest Scholarships
                  </Button>
                </Link>
              </div>
              <p className="text-gray-500 mt-1 text-[13px] text-center">
                ZEUS adapts to your preferences — change them anytime!
              </p>
            </div>
          </div>
        )
        }
      </div>
    </div>
  );
}
