//app/chatmodel/page.tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Message as MessageType } from "@/lib/types";
import Message from "./components/Message";
import { Card } from "@/components/ui/card";
import { Navbar } from "./components/Navbar";
import { UserStore, useUserStore } from "@/store/useUserData";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreloadedContext {
  userRelevantCourses: unknown[];
  userRelevantUniversities: unknown[];
  userCountryInfo: unknown[];
  userProfile: UserStore;
}

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
  const [context, setContext] = useState<PreloadedContext | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const { user, fetchUserProfile } = useUserStore();
  const abortController = useRef<AbortController | null>(null);
  const [streamingComplete, setStreamingComplete] = useState(false);

  console.log(messages, "messages from chat component");
  console.log(streamingComplete);

  useEffect(() => {
    // Initialize context loading based on user status
    if (user?._id) {
      // User is logged in - preload their context
      preloadUserContext();
    } else {
      // No user - skip context loading and allow chat to work
      setContextLoading(false);
      setContext(null);
    }
  }, [user?._id]);

  const preloadUserContext = async () => {
    if (!user?._id) {
      setContextLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/chat/preload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setContext(data);
      } else {
        console.warn("Failed to preload context, continuing without it");
        setContext(null);
      }
    } catch (error) {
      console.error("Failed to preload context:", error);
      setContext(null);
    } finally {
      setContextLoading(false);
    }
  };

  // Process content for better formatting (same as in Message component)
  const processContent = (content: string) => {
    // Add type checking and fallback
    if (typeof content !== "string") {
      console.warn("processContent received non-string content:", content);
      return String(content || ""); // Convert to string or return empty string
    }

    let processed = content.replace(/(\d+\.\s)/g, "\n$1");
    processed = processed.replace(/(?<!\n)(#{1,6}\s)/g, "\n$1");
    return processed;
  };

  const isValidMessage = (message: MessageType): boolean => {
    return (
      message &&
      message.role &&
      typeof message.content === "string" &&
      message.content.trim().length > 0
    );
  };

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
      await fetchUserProfile();
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Don't block the chat if user fetching fails
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    // Try to fetch user but don't block if it fails
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  // Updated submit function
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
          userId: user?._id || null, // Send null if no user
          conversationHistory: messages,
          preloadedContext: context, // Will be null for non-logged-in users
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

  // Show loading state only when we're actually loading context for logged-in users
  if (contextLoading && user?._id) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 mb-3">
              <Image
                src="/zeus_face.png"
                width={32}
                height={32}
                alt="Zeus Avatar"
              />
              <p className="font-bold text-gray-800 italic">ZEUS</p>
            </div>
            <p className="text-lg font-semibold text-gray-700">
              Loading your personalized chat context...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ZEUS is preparing your customized experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get welcome message based on user status
  const getWelcomeMessage = () => {
    if (user?._id) {
      return {
        title: "Ready to help with your education journey!",
        subtitle: context 
          ? "Your personalized context is loaded" 
          : "Send a message to start chatting"
      };
    } else {
      return {
        title: "Welcome to ZEUS!",
        subtitle: "Start chatting to get help with universities and scholarships"
      };
    }
  };

  const welcomeMessage = getWelcomeMessage();

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
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <Image
                        src="/zeus_face.png"
                        width={32}
                        height={32}
                        alt="Zeus Avatar"
                      />
                      <p className="font-bold text-gray-800 italic">ZEUS</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {welcomeMessage.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {welcomeMessage.subtitle}
                    </p>
                    {!user?._id && (
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Sign in for personalized recommendations
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                messages.map((message, index) =>
                  isValidMessage(message) ? (
                    <Message key={index} message={message} />
                  ) : null
                )
              )}

              {/* Show streaming message with proper formatting */}
              {streamingMessage && (
                <div className="flex gap-5 justify-center items-start max-w-[80%] sm:max-w-[55%]">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <Image
                      src="/zeus_face.png"
                      width={32}
                      height={32}
                      alt="Zeus Avatar"
                    />
                    <p className="font-bold text-gray-800 italic">ZEUS</p>
                  </div>
                  <Card className="px-4 py-3 bg-white text-black">
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          // Style links to make them visually distinct
                          a: (props) => (
                            <a
                              className="text-blue-600 underline hover:text-blue-800"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          // Ensure headers have proper styling and spacing
                          h1: (props) => (
                            <h1
                              className="text-2xl font-bold mt-4 mb-2 block"
                              {...props}
                            />
                          ),
                          h2: (props) => (
                            <h2
                              className="text-xl font-bold mt-4 mb-2 block"
                              {...props}
                            />
                          ),
                          h3: (props) => (
                            <h3
                              className="text-lg font-bold mt-3 mb-2 block"
                              {...props}
                            />
                          ),
                          h4: (props) => (
                            <h4
                              className="text-base font-bold mt-3 mb-1 block"
                              {...props}
                            />
                          ),
                          // Ensure paragraphs have proper spacing
                          p: (props) => <p className="my-2 block" {...props} />,
                          // Style lists properly
                          ul: (props) => (
                            <ul
                              className="list-disc pl-5 my-2 block"
                              {...props}
                            />
                          ),
                          ol: (props) => (
                            <ol
                              className="list-decimal pl-5 my-2 block"
                              {...props}
                            />
                          ),
                          li: (props) => <li className="my-1" {...props} />,
                        }}
                      >
                        {processContent(streamingMessage)}
                      </ReactMarkdown>
                    </div>
                  </Card>
                </div>
              )}

              {/* Show "Thinking..." when loading but not streaming */}
              {isLoading && !streamingMessage && (
                <div className="flex gap-10 md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%] max-w-[100%]">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <Image
                      src="/zeus_face.png"
                      width={32}
                      height={32}
                      alt="Zeus Avatar"
                    />
                    <p className="font-bold text-gray-800 italic">ZEUS</p>
                  </div>
                  <div className="flex items-center px-4 py-1 border border-gray-100 bg-white text-black">
                    <p className=" italic text-center text-gray-500">
                      Zeus is Thinking...
                    </p>
                  </div>
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
              {user?._id
                ? "ZEUS adapts to your preferences — change them anytime!"
                : "ZEUS provides general education guidance — sign in for personalized help!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}