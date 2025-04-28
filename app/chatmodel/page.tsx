"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
// import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserData";
import { Message as MessageType } from "@/lib/types";
import Message from "./components/Message";
import { Card } from "@/components/ui/card";
import { getAuthToken } from "@/utils/authHelper";
import { Navbar } from "./components/Navbar";

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
  // const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  // const initialMessage = searchParams.get("message");
  const { user, fetchUserProfile } = useUserStore();
  const abortController = useRef<AbortController | null>(null);
  const [streamingComplete, setStreamingComplete] = useState(false); 
  console.log(messages, "messages from chat component");
  console.log(streamingComplete)
  // Check if query matches a common pattern for instant response
  const checkForInstantResponse = (query: string): string | null => {
    const normalizedQuery = query.toLowerCase().trim();

    // Check exact matches first
    // if (INSTANT_RESPONSES[normalizedQuery]) {
    //   return INSTANT_RESPONSES[normalizedQuery];
    // }
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
      const token = getAuthToken();
      if (!token) return;
      fetchUserProfile(token);
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


  // submit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!input.trim() || isLoading) return;

  // Abort any ongoing request
  if (abortController.current) {
    abortController.current.abort();
    abortController.current = null;
  }

  // Reset streaming state
  setStreamingMessage("");
  setStreamingComplete(false);

  const userMessage: MessageType = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  // Check for instant response first
  const instantResponse = checkForInstantResponse(input);
  if (instantResponse) {
    // Add a slight delay for a better UX
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: instantResponse },
      ]);
      setIsLoading(false);
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
        userId: user?.user._id || null,
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
      // This additional check prevents adding empty messages
      if (completeResponse && completeResponse.trim() !== "") {
        // Use function form of setState to ensure we have the latest state
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
  }
};
  // Add this to your component:
  useEffect(() => {
    // Cleanup function to handle component unmount or query changes
    return () => {
      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }
    };
  }, []);

  // Then in your handleSubmit function:


  return (
    <div className="flex min-h-screen flex-col">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* Header */}
        <Navbar />
        {/* Chat Area */}
        <main className="relative flex-1 w-[90%] mx-auto sm:px-4 pt-16 pb-18">
          <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden p-6 scrollbar-hide">
            <div className="space-y-4 py-0 pb-16">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>Send a message to start chatting</p>
                </div>
              ) : (
                messages.map((message, index) =>
                  message && message.role ? (
                    <Message key={index} message={message} />
                  ) : null
                )
              )}

              {/* Show streaming message if available */}
              {streamingMessage && (
                <div className="flex gap-10 md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] max-w-[80%]">
                  <div className="flex items-start pt-3 gap-2 mb-3">
                    <Image
                      src="/icons/zeusrobo.svg"
                      width={32}
                      height={32}
                      alt="Zeus Avatar"
                    />
                    <h6 className="font-bold text-gray-800">ZEUS</h6>
                  </div>
                  <Card className="px-4 py-3 bg-white text-black">
                    <p className="whitespace-pre-line md:text-[18px]">
                      {streamingMessage}
                    </p>
                  </Card>
                </div>
              )}

              {/* Show "Thinking..." when loading but not streaming */}
              {isLoading && !streamingMessage && (
                <div className="flex gap-10 md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%] max-w-[100%]">
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src="/icons/zeusrobo.svg"
                      width={32}
                      height={32}
                      alt="Zeus Avatar"
                    />
                    <h6 className="font-bold text-gray-800">ZEUS</h6>
                  </div>
                  <Card className="px-4 py-3 bg-white text-black">
                    <p className="whitespace-pre-line italic text-center text-gray-500">
                      Zeus is Thinking...
                    </p>
                  </Card>
                </div>
              )}

              {/* keep your scroll anchor */}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </main>

        {/* Chat Input */}
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
                  disabled={isLoading}
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
            <div className="flex flex-row justify-center overflow-x-auto hide-scrollbar gap-3 mt-2">
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
      </div>
    </div>
  );
}