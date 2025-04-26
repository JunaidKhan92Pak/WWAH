// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useUserStore } from "@/store/userStore";
// import { FaUser } from "react-icons/fa";
// import { Message as MessageType } from "@/lib/types";
// import Message from "./components/Message";

// export default function Home() {
//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [input, setInput] = useState("");
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const initialMessage = searchParams.get("message"); // Get message from URL
//   const { isAuthenticate, user } = useUserStore();
//   const scrollToBottom = () => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   const handleInitialMessage = async (message: string) => {
//     if (!message.trim()) return;

//     const userMessage: MessageType = { role: "user", content: message };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       const data = await response.json();
//       setMessages((prev) => [...prev, data.message]);
//     } catch (error) {
//       console.error(error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, there was an error processing your request.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!input.trim() || isLoading) return;

//     const userMessage: MessageType = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//       if (initialMessage) {
//         handleInitialMessage(initialMessage);
//       }

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: input,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       const data = await response.json();
//       setMessages((prev) => [...prev, data.message]);
//     } catch (error) {
//       console.error(error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, there was an error processing your request.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const hasSentInitialMessage = useRef(false); // Track if initial message was sent

//   // ✅ Automatically send the initial message if available
//   useEffect(() => {
//     if (initialMessage && !hasSentInitialMessage.current) {
//       hasSentInitialMessage.current = true; // Mark as sent
//       handleInitialMessage(initialMessage);
//     }
//   }, [initialMessage]);
//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Background */}
//       <div className="absolute top-0 left-0 w-full h-full z-0">
//         {/* Header */}
//         <header className="fixed top-0 w-full bg-white border-b z-10">
//           <div className="w-[90%] mx-auto sm:px-4 py-2 flex items-center">
//             <Link target="blank" href="/">
//               <div className="flex items-center gap-4">
//                 <Image
//                   src="/icons/zeusrobo.svg"
//                   alt="zeus"
//                   width={40}
//                   height={20}
//                 />
//                 <h4>Zeus by WWAH</h4>
//               </div>
//             </Link>
//             <div className="ml-auto flex gap-2 items-center">
//               {isAuthenticate ? (
//                 <>
//                   <h6>Hello, {user?.personalInfo.firstName || "Newbie"}</h6>

//                   <FaUser className="text-gray-800  w-8 h-8 text-xl p-1 border border-gray-400 rounded-full" />
//                 </>
//               ) : (
//                 <Link target="blank" href="/signin">
//                   {" "}
//                   <Button className=" text-white border-[#F0851D] rounded-xl bg-red-700">
//                     Log In
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Chat Area */}
//         <main className="relative flex-1 w-[90%] mx-auto sm:px-4 pt-16 pb-18">
//           <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden p-6 scrollbar-hide">
//             <div className="space-y-4 py-0 pb-16">

//               {messages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full">
//                   <p>Send a message to start chatting</p>
//                 </div>
//               ) : (
//                 messages.map((message, index) => (
//                   <Message key={index} message={message} />
//                 ))
//               )}
//               {isLoading && (
//                 <div className="flex justify-start mb-4">
//                   <div className="bg-gray-600 p-3 rounded-lg">
//                     <p>Thinking...</p>
//                   </div>
//                 </div>
//               )}
//               {/* keep your scroll anchor */}
//               <div ref={scrollRef} />
//             </div>
//           </ScrollArea>
//         </main>
//         {/* Chat Input */}
//         <div className="fixed bottom-0 w-full">
//           <div className="absolute inset-0 bg-[#D9D9D966] opacity-80 z-0 blur-2xl "></div>
//           <div className="relative w-[90%] sm:[70%] lg:w-[58%] mx-auto pb-1 ">
//             <form onSubmit={handleSubmit}>
//               <div className="flex items-center rounded-xl shadow-sm bg-white gap-2 px-3 py-1">
//                 <Image
//                   src="/chatbot.svg"
//                   alt="chatrobot"
//                   width={20}
//                   height={20}
//                 />
//                 <Input
//                   placeholder="Chat with ZEUS"
//                   className="flex-1 border-none focus:ring-0 xl:placeholder:text-[16px]"
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   // onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//                   disabled={isLoading}
//                 />
//                 <Button
//                   type="submit"
//                   size="icon"
//                   disabled={isLoading}
//                   className="p-0 bg-transparent hover:bg-transparent rounded-full"
//                 >
//                   <Image
//                     src="/icons/sendicon.svg"
//                     alt="Send"
//                     width={24}
//                     height={24}
//                   />
//                 </Button>
//               </div>
//             </form>
//             {/* Buttons */}
//             <div className="flex flex-row justify-center overflow-x-auto hide-scrollbar gap-3 mt-2">
//               <Link target="blank" href="/Universities">
//                 <Button className="bg-[#FED7B1] text-sm md:text-md text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
//                   Explore Top Universities
//                 </Button>
//               </Link>
//               <Link target="blank" href="/countries">
//                 <Button className="bg-[#FED7B1] text-sm md:text-md text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
//                   Explore Study Destinations
//                 </Button>
//               </Link>
//               <Link target="blank" href="/scholarships">
//                 <Button className="bg-[#FED7B1] text-sm md:text-md text-[#C7161E] hover:text-[#FED7B1] border-[#F0851D] rounded-xl hover:bg-red-700">
//                   Explore Latest Scholarships
//                 </Button>
//               </Link>
//             </div>
//             <p className="text-gray-500 mt-1 text-[13px] text-center">
//               ZEUS adapts to your preferences — change them anytime!
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserData";
import { FaUser } from "react-icons/fa";
import { Message as MessageType } from "@/lib/types";
import Message from "./components/Message";
import { Card } from "@/components/ui/card";
import { getAuthToken } from "@/utils/authHelper";
export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const initialMessage = searchParams.get("message"); // Get message from URL
  const { user, fetchUserProfile } = useUserStore();
  const store = useUserStore();
  console.log("User store:", store);
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        // router.push("/login"); // Redirect if not authenticated
        console.log("Token not found, redirecting to login...");
        return;
      }
      fetchUserProfile(token);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  console.log(user, "user data from chat component");
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(user?.user._id, "userId from chat model");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}chatZeus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: user?.user._id || null, // Include user ID here
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  // Similarly update handleInitialMessage function to include user ID
  const handleInitialMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: MessageType = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user?.user._id, // Include user ID here too
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (initialMessage) {
      handleInitialMessage(initialMessage);
    }
  }, [initialMessage]);
  return (
    <div className="flex min-h-screen flex-col">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white border-b z-10">
          <div className="w-[90%] mx-auto sm:px-4 py-2 flex items-center">
            <Link target="blank" href="/">
              <div className="flex items-center gap-4">
                <Image
                  src="/icons/zeusrobo.svg"
                  alt="zeus"
                  width={40}
                  height={20}
                />
                <div className="flex gap-2 items-center">
                  <h4>Zeus by </h4>
                  <Link
                    target="blank"
                    href="/"
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src="/logofooter.svg"
                      alt="WWAH Logo"
                      width={130}
                      height={70}
                    />
                  </Link>
                </div>
              </div>
            </Link>
            <div className="ml-auto flex gap-2 items-center">
              {user ? (
                <>
                  <h6>Hello, {user?.user.firstName || "Newbie"}!</h6>

                  <FaUser className="text-gray-800  w-8 h-8 text-xl p-1 border border-gray-400 rounded-full" />
                </>
              ) : (
                <Link target="blank" href="/signin">
                  {" "}
                  <Button className=" text-white border-[#F0851D] rounded-xl bg-red-700">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        {/* Chat Area */}
        <main className="relative flex-1 w-[90%] mx-auto sm:px-4 pt-16 pb-18">
          <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden p-6 scrollbar-hide">
            <div className="space-y-4 py-0 pb-16">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>Send a message to start chatting</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <Message key={index} message={message} />
                ))
              )}


              {isLoading && (
                <div className="flex gap-10 md:max-w-[20%] lg:max-w-[15%] xl:max-w-[10%] max-w-[50%]">
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
                    <p className="whitespace-pre-line italic  text-center text-gray-500">
                      Thinking...
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
                  // onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
