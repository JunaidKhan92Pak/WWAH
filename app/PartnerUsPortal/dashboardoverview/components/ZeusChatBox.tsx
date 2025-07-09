"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";
import { useRouter } from "next/navigation";
const ZeusChatBox = () => {
 const router = useRouter();

  const [input, setInput] = useState("");

  const handleNavigate = () => {
    if (input.trim()) {
      router.push(`/chatmodel?message=${encodeURIComponent(input)}`);
    } else {
      router.push("/chatmodel"); // Navigate without message if input is empty
    }
  };

  return (
    <>
      <Card className="bg-[#313131] text-white h-auto xl:h-[470px] rounded-xl">
            <CardContent className="flex flex-col justify-end h-full">
              <div className="flex flex-col items-center w-full">
                {/* Robot and Text */}
                <div className="flex flex-col items-center">
                  <Image
                    src="/zeus.gif"
                    alt="AI Robot"
                    width={400}
                    height={400}
                    className="w-full xl:w-[80%]  h-[340px] object-cover"
                  />
                  <p className="text-center text-sm mb-2">
                    Experience AI driven course matching with Zeus 
                  </p>
                </div>

                {/* Chat input */}
                <div className="chat-input rounded-lg p-2 flex items-center gap-3 bg-white bg-opacity-30 w-full">
                  <Bot className="h-5 w-5 text-white/80 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Chat with Zeus..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNavigate();
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-white/60 placeholder:text-sm min-w-0"
                  />
                  <Send
                    onClick={handleNavigate}
                    className="h-5 w-5 text-white/80 cursor-pointer hover:text-white transition-colors flex-shrink-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card> 
    </>
  )
}

export default ZeusChatBox
