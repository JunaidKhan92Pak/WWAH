//app/chatmodel/components/Message.tsx
import React from "react";
import { Message as MessageType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 
import remarkBreaks from "remark-breaks"; 

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  // Safety check - if message content is undefined or empty
  if (!message || !message.content) {
    console.warn("Empty message detected:", message);
    return null; // Don't render empty messages
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {isUser ? (
        <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
          <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                // Minimal custom components - let Tailwind prose do the heavy lifting
                a: ({ children, ...props }) => (
                  <a
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </Card>
      ) : (
        <div className="flex justify-center items-start max-w-[95%] sm:max-w-[80%] md:w-[65%] lg:w-[55%]">
          <div className="flex flex-col items-center gap-2 mb-3 w-[15%]">
            <Image
              src="/zeus_face.png"
              width={32}
              height={32}
              alt="Zeus Avatar"
            />
            <p className="font-bold text-gray-800 italic">ZEUS</p>
          </div>

          <Card className="w-[100%] md:px-3 px-2 py-1 md:py-1 bg-white text-black">
            <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  // Clean components that work with Tailwind prose
                  a: ({ children, ...props }) => (
                    <a
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  // Let prose handle all other styling
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className="border-l-4 border-gray-300 pl-4 italic"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                  // Tables (from remarkGfm)
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto">
                      <table
                        className="min-w-full border-collapse border border-gray-300"
                        {...props}
                      >
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th
                      className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold"
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="border border-gray-300 px-3 py-2" {...props}>
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Message;
