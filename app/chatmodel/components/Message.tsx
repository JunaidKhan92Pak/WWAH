// import React from "react";
// import ReactMarkdown from "react-markdown";
// import { Message as MessageType } from "@/lib/types";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";

// interface MessageProps {
//   message: MessageType;
// }
// const Message: React.FC<MessageProps> = ({ message }) => {
//   const isUser = message.role === "user";

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       {isUser ? (
//         <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
//           <p className="whitespace-pre-line md:text-[18px]">
//             {message.content}
//           </p>
//         </Card>
//       ) : (
//         <div className="flex gap-5 justify-center items-center max-w-[80%] sm:max-w-[55%]">
//           <div className="flex flex-col items-center justify-center">
//             <Image
//               src="/icons/zeusrobo.svg"
//               width={32}
//               height={32}
//               alt="Zeus Avatar"
//             />
//             <p className="font-bold text-gray-800 italic">ZEUS</p>
//           </div>
//           <Card className="px-4 py-3 bg-white text-black">
//             <p className="whitespace-pre-line font-medium md:text-[18px]"></p>
//             <ReactMarkdown
//               components={{
//                 p: ({ ...props }) => <p className="prose" {...props} />,
//               }}
//             >
//               {message.content}
//             </ReactMarkdown>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;
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

  // Debug - log the message content
  console.log("Rendering message:", message);

  // Safety check - if message content is undefined or empty
  if (!message || !message.content) {
    console.warn("Empty message detected:", message);
    return null; // Don't render empty messages
  }
  const processLinks = (content: string) => {
    return content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => `[${text}](${url})`
    );
  };
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {isUser ? (
        <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
          <p className="whitespace-pre-line md:text-[18px]">
            {message.content}
          </p>
        </Card>
      ) : (
        <div className="flex gap-5 justify-center items-start max-w-[80%] sm:max-w-[55%]">
          <div className="flex flex-col items-start justify-center pt-3">
            <Image
              src="/icons/zeusrobo.svg"
              width={32}
              height={32}
              alt="Zeus Avatar"
            />
            <p className="font-bold text-gray-800 italic">ZEUS</p>
          </div>
          <Card className="px-4 py-3 bg-white text-black">
            <p className="whitespace-pre-line font-medium md:text-[18px]"></p>
            <ReactMarkdown
              components={{
                p: ({ ...props }) => <p className="prose" {...props} />,
              }}
            >
              {processLinks(message.content || "No content available")}
            </ReactMarkdown>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Message;
