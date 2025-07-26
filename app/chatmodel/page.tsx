//app/chatmodel/page.tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Message as MessageType } from "@/lib/types";
import Message from "./components/Message";
import { Card } from "@/components/ui/card";
import { Navbar } from "./components/Navbar";
import { UserStore, useUserStore } from "@/store/useUserData";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { SigninRequiredMessage } from "./components/RequireAuth";

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

const MAX_MESSAGES_WITHOUT_SIGNIN = 8;

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
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] =
    useState(false);

  // New state for signin requirement
  const [requiresSignin, setRequiresSignin] = useState(false);

  // Initialization states
  const [isInitialized, setIsInitialized] = useState(false);
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);

  // Add a ref to prevent multiple submissions
  const isProcessingRef = useRef(false);

  console.log(messages, "messages from chat component");
  console.log(streamingComplete);

  // Step 1: Load user profile first
  useEffect(() => {
    const initializeUser = async () => {
      if (userProfileLoaded) return;

      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setUserProfileLoaded(true);
      }
    };

    initializeUser();
  }, [fetchUserProfile, userProfileLoaded]);

  // Step 2: Restore conversation after user profile is loaded
  useEffect(() => {
    if (!userProfileLoaded || isInitialized) return;

    const restoreConversation = () => {
      const savedConversation = localStorage.getItem("pendingConversation");

      if (savedConversation) {
        try {
          const parsedConversation = JSON.parse(savedConversation);
          console.log(
            "🔄 Restoring conversation:",
            parsedConversation.length,
            "messages"
          );

          // Validate the conversation data
          if (
            Array.isArray(parsedConversation) &&
            parsedConversation.length > 0
          ) {
            // Filter out invalid messages and ensure proper format
            const validMessages = parsedConversation.filter(
              (msg: { role: string; content: string }) =>
                msg &&
                typeof msg === "object" &&
                msg.role &&
                msg.content &&
                typeof msg.content === "string" &&
                (msg.role === "user" || msg.role === "assistant")
            );

            if (validMessages.length > 0) {
              setMessages(validMessages);
              console.log(
                "✅ Conversation restored successfully:",
                validMessages.length,
                "messages"
              );

              // Log a preview of the restored conversation
              console.log("📜 Restored conversation preview:");
              validMessages
                .slice(-3)
                .forEach(
                  (msg: { role: string; content: string }, idx: number) => {
                    console.log(
                      ` ${idx} ${msg.role}: ${msg.content.substring(0, 100)}...`
                    );
                  }
                );
            }
          }
        } catch (error) {
          console.error("❌ Failed to restore conversation:", error);
          localStorage.removeItem("pendingConversation"); // Clear corrupted data
        }
      } else {
        console.log("ℹ️ No saved conversation found");
      }

      setIsInitialized(true);
    };

    restoreConversation();
  }, [userProfileLoaded, isInitialized]);

  // Step 3: Load context after conversation is restored
  useEffect(() => {
    if (!isInitialized) return;

    const initializeContext = async () => {
      if (user?._id) {
        // User is logged in - preload their context
        await preloadUserContext();
      } else {
        // No user - skip context loading
        setContextLoading(false);
        setContext(null);
      }
    };

    initializeContext();
  }, [isInitialized, user?._id]);

  useEffect(() => {
    if (!isInitialized) return;

    if (messages.length > 0) {
      localStorage.setItem("pendingConversation", JSON.stringify(messages));
      console.log(
        "💾 Conversation saved to localStorage:",
        messages.length,
        "messages"
      );
    } else {
      localStorage.removeItem("pendingConversation");
      console.log("🗑️ Cleared empty conversation from localStorage");
    }
  }, [messages, isInitialized, user?._id]);
  useEffect(() => {
    if (!user?._id && isInitialized && userProfileLoaded) {
      // User has logged out - clear everything
      localStorage.removeItem("pendingConversation");

      // Reset chat state
      setMessages([]);
      setStreamingMessage("");
      setContext(null);
      setRequiresSignin(false);
      setInput("");

      // Abort any ongoing requests
      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }

      // Reset processing flag
      isProcessingRef.current = false;

      console.log(
        "🗑️ User logged out - cleared all chat data and localStorage"
      );
    }
  }, [user?._id, isInitialized, userProfileLoaded]);
  // Check if signin is required based on message count
  const checkSigninRequirement = useCallback(() => {
    if (user?._id) {
      setRequiresSignin(false);
      return false;
    }

    if (messages.length >= MAX_MESSAGES_WITHOUT_SIGNIN) {
      setRequiresSignin(true);
      return true;
    }

    return false;
  }, [user?._id, messages.length]);

  useEffect(() => {
    if (isInitialized) {
      checkSigninRequirement();
    }
  }, [checkSigninRequirement, isInitialized]);

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
        console.log("User context loaded successfully");
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

  const isValidMessage = (message: MessageType): boolean => {
    return (
      message &&
      message.role &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      (message.role === "user" || message.role === "assistant")
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  // Improved streaming message display component with proper markdown
  const StreamingMessageDisplay = ({
    content,
    isComplete,
  }: {
    content: string;
    isComplete: boolean;
  }) => (
    <div className="flex gap-5 justify-start items-start max-w-full">
      <div className="flex flex-col items-center gap-2 mb-3 flex-shrink-0">
        <Image src="/zeus_face.png" width={32} height={32} alt="Zeus Avatar" />
        <p className="font-bold text-gray-800 italic text-sm">ZEUS</p>
      </div>
      <Card className="px-4 py-3 bg-white text-black flex-1 max-w-[calc(100%-80px)]">
        <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              // Remove all custom styling - let Tailwind prose handle it
              h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
              h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
              h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
              h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
              p: ({ children, ...props }) => <p {...props}>{children}</p>,
              ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
              ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
              li: ({ children, ...props }) => <li {...props}>{children}</li>,
              a: ({ children, ...props }) => (
                <a
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
              strong: ({ children, ...props }) => (
                <strong {...props}>{children}</strong>
              ),
              em: ({ children, ...props }) => <em {...props}>{children}</em>,
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
          {!isComplete && (
            <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1">
              |
            </span>
          )}
        </div>
      </Card>
    </div>
  );

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || isProcessingRef.current) return;

    if (requiresSignin && !user?._id) {
      return;
    }

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
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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
        isProcessingRef.current = false;
      }, 300);
      return;
    }

    // Create new abort controller for this request
    abortController.current = new AbortController();

    try {
      console.log(
        "Sending conversation history:",
        updatedMessages.length,
        "messages"
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        signal: abortController.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: user?._id || null,
          userData: user || null,
          conversationHistory: updatedMessages,
          preloadedContext: context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("text/event-stream")) {
        // Simplified streaming handler
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("Failed to get reader from response");
        }

        let completeResponse = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              setStreamingComplete(true);
              break;
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });

            // Split by lines and process each line
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.trim() === "" || !line.startsWith("data: ")) continue;

              const data = line.slice(6); // Remove 'data: ' prefix

              if (data === "[DONE]") {
                setStreamingComplete(true);
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                let contentToAdd = "";

                // Handle different response formats
                if (typeof parsed === "string") {
                  contentToAdd = parsed;
                } else if (parsed.choices?.[0]?.delta?.content) {
                  contentToAdd = parsed.choices[0].delta.content;
                } else if (parsed.delta?.content) {
                  contentToAdd = parsed.delta.content;
                } else if (parsed.content) {
                  contentToAdd = parsed.content;
                }

                if (contentToAdd) {
                  completeResponse += contentToAdd;
                  setStreamingMessage(completeResponse);
                }
              } catch (parseError) {
                console.log(parseError);
                if (data.trim()) {
                  completeResponse += data;
                  setStreamingMessage(completeResponse);
                }
              }
            }
          }

          // Add final message to conversation history
          if (completeResponse.trim()) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "assistant", content: completeResponse },
            ]);
          }
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          throw streamError;
        } finally {
          reader.releaseLock();
        }
      } else {
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
      isProcessingRef.current = false;
    }
  };

  // Handle initial message processing
  useEffect(() => {
    if (!isInitialized || hasProcessedInitialMessage) return;

    const processInitialMessage = async () => {
      const initialMessage = sessionStorage.getItem("initialMessage");
      if (initialMessage) {
        console.log("Processing initial message:", initialMessage);

        setHasProcessedInitialMessage(true);
        sessionStorage.removeItem("initialMessage");
        setInput(initialMessage);

        setTimeout(async () => {
          await sendMessage(initialMessage);
          setInput("");
        }, 100);
      } else {
        setHasProcessedInitialMessage(true);
      }
    };

    processInitialMessage();
  }, [isInitialized, hasProcessedInitialMessage]);

  // Updated submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isProcessingRef.current) return;

    // Check if signin is required
    if (requiresSignin && !user?._id) {
      return;
    }

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

  // Don't render until initialized
  if (!isInitialized) {
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
              Initializing chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get welcome message based on user status
  const getWelcomeMessage = () => {
    if (user?._id) {
      const firstName = user?.firstName || "there";
      return {
        title: `Welcome back, ${firstName}! Ready to help with your education journey!`,
        subtitle: context
          ? "Your personalized context is loaded and conversation restored"
          : "Send a message to start chatting",
      };
    } else {
      return {
        title: "Welcome to ZEUS!",
        subtitle:
          "Start chatting to get help with universities and scholarships",
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
              {messages.length === 0 && !streamingMessage ? (
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
                      {hasProcessedInitialMessage
                        ? welcomeMessage.subtitle
                        : "Loading..."}
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

              {/* Show signin required message */}
              {requiresSignin && !user?._id && (
                <SigninRequiredMessage currentMessages={messages} />
              )}

              {/* Show streaming message with proper formatting */}
              {streamingMessage && (
                <StreamingMessageDisplay
                  content={streamingMessage}
                  isComplete={streamingComplete}
                />
              )}

              {/* Show "Thinking..." when loading but not streaming */}
              {isLoading && !streamingMessage && (
                <div className="flex gap-5 justify-start items-start max-w-full">
                  <div className="flex flex-col items-center gap-2 mb-3 flex-shrink-0">
                    <Image
                      src="/zeus_face.png"
                      width={32}
                      height={32}
                      alt="Zeus Avatar"
                    />
                    <p className="font-bold text-gray-800 italic text-sm">
                      ZEUS
                    </p>
                  </div>
                  <div className="flex items-center px-4 py-3 border border-gray-100 bg-white text-black rounded-lg">
                    <p className="italic text-center text-gray-500">
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
          <div className="absolute inset-0 bg-[#D9D9D966] opacity-80 z-0 blur-2xl"></div>
          <div className="relative w-[90%] sm:w-[70%] lg:w-[58%] mx-auto pb-1">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center rounded-xl shadow-sm bg-white gap-2 px-3 py-1">
                <Image
                  src="/chatbot.svg"
                  alt="chatrobot"
                  width={20}
                  height={20}
                />
                <Input
                  placeholder={
                    requiresSignin && !user?._id
                      ? "Sign in to continue chatting..."
                      : "Chat with ZEUS"
                  }
                  className="flex-1 border-none focus:ring-0 xl:placeholder:text-[16px]"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || (requiresSignin && !user?._id)}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    isLoading ||
                    isProcessingRef.current ||
                    (requiresSignin && !user?._id)
                  }
                  className="p-0 bg-transparent hover:bg-transparent rounded-full"
                >
                  <Image
                    src="/icons/sendicon.svg"
                    alt="Send"
                    width={24}
                    height={24}
                    className={requiresSignin && !user?._id ? "opacity-50" : ""}
                  />
                </Button>
              </div>
            </form>
            {/* Buttons */}
            <div className="flex flex-row lg:justify-center overflow-x-auto hide-scrollbar gap-3 mt-2">
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
              {requiresSignin && !user?._id
                ? "🔒 Sign in required to continue chatting"
                : user?._id
                ? "ZEUS adapts to your preferences — change them anytime!"
                : `ZEUS provides general education guidance — sign in for personalized help! (${messages.length}/${MAX_MESSAGES_WITHOUT_SIGNIN} messages)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
