import React from "react";
import { Message as MessageType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

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

  // Process the content to ensure headers are on their own lines
  const processContent = (content: string) => {
    // Add line breaks before numbers followed by dot and space (likely numbered headers)
    let processed = content.replace(/(\d+\.\s)/g, "\n$1");

    // Add line breaks before header indicators like "# " or "## "
    processed = processed.replace(/(?<!\n)(#{1,6}\s)/g, "\n$1");

    return processed;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {isUser ? (
        <Card className="md:px-3 px-3 py-2 md:py-1 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
          <p className="whitespace-pre-line md:text-[18px]">
            {message.content}
          </p>
        </Card>
      ) : (
        <div className="flex  justify-center items-start max-w-[95%] sm:max-w-[80%] md:w-[65%] lg:w-[55%]">
          <div className=" w-[15%] hidden sm:flex sm:justify-end ">
            {/* <Image
              src="/zeus_face.png"
              width={800}
              height={800}
              alt="Zeus Avatar"
              className="sm:w-[44px] sm:h-[36px] w-[36px] h-[30px]"
            /> */}
            <Image
              src="/zeus_face.png"
              width={800}
              height={800}
              alt="Zeus Avatar"
              className="lg:w-[44px] lg:h-[36px] md:w-[44px] md:h-[34px] w-[32px] h-[28px]"
              priority={true}
              quality={95}
            />
          </div>

          <Card className="w-[100%]  md:px-3 px-2 py-1 md:py-1 bg-white text-black">
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
                    <ul className="list-disc pl-5 my-2 block" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-5 my-2 block" {...props} />
                  ),
                  li: (props) => <li className="my-1" {...props} />,
                }}
              >
                {processContent(message.content) || "No content available"}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Message;
