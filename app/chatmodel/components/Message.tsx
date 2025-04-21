import React from "react";
import ReactMarkdown from "react-markdown";
import { Message as MessageType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface MessageProps {
  message: MessageType;
}
const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {isUser ? (
        <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
          <p className="whitespace-pre-line md:text-[18px]">
            {message.content}
          </p>
        </Card>
      ) : (
        <div className="max-w-[80%] sm:max-w-[55%]">
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
            <p className="whitespace-pre-line font-medium md:text-[18px]"></p>
            <ReactMarkdown
              components={{
                p: ({ ...props }) => <p className="prose" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Message;
