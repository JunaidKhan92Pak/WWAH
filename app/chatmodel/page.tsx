"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
// import ReactMarkdown from "react-markdown";
interface Message {
  id: number;
  text: string;
  isUser: boolean;
}
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    const userMessage = { id: Date.now(), text: trimmedInput, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const response = await fetch("http://localhost:8080/chatZeus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userPrompt: trimmedInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }
      const data = await response.json();
      const aiMessage = { id: Date.now(), text: data.answer, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        id: Date.now(),
        text: "Something went wrong. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white border-b z-10">
          <div className="w-[90%] mx-auto px-4 py-3 flex items-center">
            <div>
              <Image src="/logo.png" alt="Logo" width={113} height={45} />
            </div>
            <div className="ml-auto flex gap-2 items-center">
              <h4>Hello, Asma Kazmi!</h4>
              <Image src="/profile.png" alt="profile" width={45} height={45} />
            </div>
          </div>
        </header>
        {/* Chat Area */}
        <main className="flex-1 w-[90%] mx-auto px-4 pt-20 pb-24">
          <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden">
            <div className="space-y-4 py-4 pb-16">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[55%] ${
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
                        message.isUser ? "bg-white-500 text-black" : "bg-white"
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
        <div className="fixed bottom-0 w-full bg-white">
          <div className="w-[90%] sm:[70%] lg:w-[58%] mx-auto py-2">
            <div className="flex items-center border rounded-3xl shadow-sm gap-2 px-3 py-1">
              <Image
                src="/chatRobot.png"
                alt="chatrobot"
                width={20}
                height={20}
              />
              <Input
                placeholder="Chat with ZEUS"
                className="flex-1 border-none focus:ring-0 focus:outline-none outline:none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="p-0 bg-transparent rounded-full "
              >
                <Image
                  src="/Streamline-Solar-Broken.png"
                  alt="Send"
                  width={24}
                  height={24}
                  className="h-6 w-6 "
                />
              </Button>
            </div>
            {/* Red Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <Button
                variant="outline"
                className="bg-[#FED7B1] text-sm 2xl:text-lg text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl px-4 py-2 hover:bg-red-700"
              >
                Explore Top Universities
              </Button>
              <Button
                variant="outline"
                className="bg-[#FED7B1] text-sm 2xl:text-lg text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl px-4 py-2 hover:bg-red-700"
              >
                Explore Study Destinations
              </Button>
              <Button
                variant="outline"
                className="bg-[#FED7B1] text-sm 2xl:text-lg text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl px-4 py-2 hover:bg-red-700"
              >
                Explore Latest Scholarships
              </Button>
            </div>
            <p className="text-gray-500 mt-4 text-center">
              ZEUS adapts to your preferences — change them anytime!
            </p>
          </div>
        </div>
      </div>
      {/* <style jsx>{`
        #chat-history {
          scroll-behavior: smooth;
        }
        #chat-history::-webkit-scrollbar {
          display: none;
        }
      `}</style> */}
    </>
  );
}






