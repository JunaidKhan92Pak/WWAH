"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message"); // Get message from URL
  const { isAuthenticate, user } = useUserStore();
  // ✅ Handle sending input
  const handleSend = async (messageText?: string) => {
    const trimmedInput = messageText?.trim() || input.trim();
    if (!trimmedInput) return;

    const userMessage = { id: Date.now(), text: trimmedInput, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}chatZeus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userPrompt: trimmedInput }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch AI response");

      const data = await response.json();
      const aiMessage = { id: Date.now(), text: data.answer, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    }
  };
  const hasSentInitialMessage = useRef(false); // Track if initial message was sent

  // ✅ Automatically send the initial message if available
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true; // Mark as sent
      handleSend(initialMessage);
    }
  }, [initialMessage]); // Runs only if there's a message in the query

  // ✅ Scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/bg-usa.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
        />

        <div className="absolute inset-0 bg-[#FCE7D2] opacity-80 z-0"></div>

        {/* Header */}
        <header className="fixed top-0 w-full bg-white border-b z-10">
          <div className="w-[90%] mx-auto sm:px-4 py-2 flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={45} />
            </Link>
            <div className="ml-auto flex gap-2 items-center">
              {isAuthenticate ? (
                <>
                  <h6>Hello, {user?.personalInfo.firstName || "Newbie"}</h6>
                  <Image
                    src="/profile.png"
                    alt="profile"
                    width={30}
                    height={45}
                  />
                </>
              ) : (
                <Link href="/signin">
                  {" "}
                  <Button className="bg-[#FED7B1] text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                    SignIn
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="relative flex-1 w-[90%] mx-auto sm:px-4 pt-16 pb-18">
          <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden">
            <div className="space-y-4 py-0 pb-16">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] sm:max-w-[55%] ${
                      message.isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <div
                        className={`h-full w-full ${
                          message.isUser ? "bg-blue-500" : "bg-gray-500"
                        } flex items-center justify-center text-white`}
                      >
                        <Image
                          src={message.isUser ? "/user-dp.png" : "/zues-dp.png"}
                          width={50}
                          height={50}
                          alt="Avatar"
                        />
                      </div>
                    </Avatar>
                    <Card
                      className={`p-4 ${
                        message.isUser
                          ? "bg-[#F9CEA5] text-black"
                          : "bg-[#F9CEA5]"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                    </Card>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </main>
        {/* Chat Input */}
        <div className="fixed bottom-0 w-full">
          <div className="absolute inset-0 bg-[#FCE7D2] opacity-80 z-0 blur-2xl "></div>
          <div className="relative w-[90%] sm:[70%] lg:w-[58%] mx-auto pb-1 ">
            <div className="flex items-center rounded-xl shadow-sm bg-white gap-2 px-3 py-1">
              <Image
                src="/chatRobot.png"
                alt="chatrobot"
                width={20}
                height={20}
              />
              <Input
                placeholder="Chat with ZEUS"
                className="flex-1 border-none focus:ring-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                className="p-0 bg-transparent hover:bg-transparent rounded-full"
              >
                <Image
                  src="/Streamline-Solar-Broken.png"
                  alt="Send"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
            {/* Buttons */}
            <div className="flex flex-row justify-center overflow-x-auto hide-scrollbar gap-3 mt-2">
              <Link href="/Universities">
                <Button className="bg-[#FED7B1] text-sm text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                  Explore Top Universities
                </Button>
              </Link>
              <Link href="/countries">
                <Button className="bg-[#FED7B1] text-sm text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
                  Explore Study Destinations
                </Button>
              </Link>
              <Link href="/scholarships">
                <Button className="bg-[#FED7B1] text-sm text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
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
