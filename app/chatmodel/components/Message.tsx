// // app/chatmodel/components/Message.tsx
// import React from "react";
// import { Message as MessageType } from "@/lib/types";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import ReactMarkdown from "react-markdown";

// interface MessageProps {
//   message: MessageType;
// }

// const Message: React.FC<MessageProps> = ({ message }) => {
//   const isUser = message.role === "user";

//   // Safety check - if message content is undefined or empty
//   if (!message || !message.content) {
//     console.warn("Empty message detected:", message);
//     return null; // Don't render empty messages
//   }

//   // Process the content to ensure headers are on their own lines
//   // Generic processContent function that works with any content
//   const processContent = (content: string) => {
//     if (!content) return "";

//     let processed = content;

//     // Add line breaks before numbered lists (1., 2., 3., etc.)
//     processed = processed.replace(/(\d+\.\s)/g, "\n\n$1");

//     // Add line breaks before markdown headers (# ## ### etc.)
//     processed = processed.replace(/(?<!\n)(#{1,6}\s)/g, "\n\n$1");

//     // Add line breaks before words ending with colon (like "Language:", "Cost:", etc.)
//     // This handles any label followed by a colon
//     processed = processed.replace(/([A-Za-z\s]+:)/g, "\n\n**$1**");

//     // Add line breaks before country codes or similar patterns (2-4 uppercase letters followed by dash)
//     processed = processed.replace(/([A-Z]{2,4}-)/g, "\n\n$1");

//     // Add line breaks before sentences that start with capital letters after periods (new sections)
//     processed = processed.replace(/(\.)([A-Z][a-z]+)/g, "$1\n\n$2");

//     // Add line breaks before common section starters (words that typically start new sections)
//     processed = processed.replace(
//       /(^|\n)([A-Z][a-z]*\s+to\s+[A-Z][a-z]*)/g,
//       "$1\n\n## $2"
//     );

//     // Clean up multiple consecutive line breaks (more than 2)
//     processed = processed.replace(/\n{3,}/g, "\n\n");

//     // Clean up spaces before line breaks
//     processed = processed.replace(/\s+\n/g, "\n");

//     // Trim whitespace from start and end
//     processed = processed.trim();

//     return processed;
//   };
//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       {isUser ? (
//         <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
//           <p className="whitespace-pre-line md:text-[18px]">
//             {message.content}
//           </p>
//         </Card>
//       ) : (
//         <div className="flex gap-5 justify-center items-start max-w-[80%] sm:max-w-[55%]">
//           <div className="flex flex-col items-start justify-center pt-3">
//             <Image
//               src="/icons/zeusrobo.svg"
//               width={32}
//               height={32}
//               alt="Zeus Avatar"
//             />
//             <p className="font-bold text-gray-800 italic">ZEUS</p>
//           </div>
//           <Card className="px-4 py-3 bg-white text-black">
//             <div className="markdown-content">
//               <ReactMarkdown
//                 components={{
//                   // Style links to make them visually distinct
//                   a: (props) => (
//                     <a
//                       className="text-blue-600 underline hover:text-blue-800"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       {...props}
//                     />
//                   ),
//                   // Ensure headers have proper styling and spacing
//                   h1: (props) => (
//                     <h1
//                       className="text-2xl font-bold mt-4 mb-2 block"
//                       {...props}
//                     />
//                   ),
//                   h2: (props) => (
//                     <h2
//                       className="text-xl font-bold mt-4 mb-2 block"
//                       {...props}
//                     />
//                   ),
//                   h3: (props) => (
//                     <h3
//                       className="text-lg font-bold mt-3 mb-2 block"
//                       {...props}
//                     />
//                   ),
//                   h4: (props) => (
//                     <h4
//                       className="text-base font-bold mt-3 mb-1 block"
//                       {...props}
//                     />
//                   ),
//                   // Ensure paragraphs have proper spacing
//                   p: (props) => <p className="my-2 block" {...props} />,
//                   // Style lists properly
//                   ul: (props) => (
//                     <ul className="list-disc pl-5 my-2 block" {...props} />
//                   ),
//                   ol: (props) => (
//                     <ol className="list-decimal pl-5 my-2 block" {...props} />
//                   ),
//                   li: (props) => <li className="my-1" {...props} />,
//                 }}
//               >
//                 {processContent(message.content) || "No content available"}
//               </ReactMarkdown>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;
// app/chatmodel/components/Message.tsx
// import React from "react";
// import { Message as MessageType } from "@/lib/types";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import ReactMarkdown from "react-markdown";

// interface MessageProps {
//   message: MessageType;
// }

// const Message: React.FC<MessageProps> = ({ message }) => {
//   const isUser = message.role === "user";

//   // Safety check - if message content is undefined or empty
//   if (!message || !message.content) {
//     console.warn("Empty message detected:", message);
//     return null;
//   }

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
//       {isUser ? (
//         <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[65%] rounded-2xl">
//           <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//           </p>
//         </Card>
//       ) : (
//         <div className="flex gap-3 items-start max-w-[75%] sm:max-w-[65%]">
//           {/* Avatar Section */}
//           <div className="flex flex-col items-center justify-start pt-1 min-w-[48px]">
//             <div className="w-8 h-8 rounded-full  flex items-center justify-center mb-1">
//               <Image
//                 src="/icons/zeusrobo.svg"
//                 width={20}
//                 height={20}
//                 alt="Zeus Avatar"
//               />
//             </div>
//             <p className="text-xs font-semibold text-gray-600 tracking-wide">
//               ZEUS
//             </p>
//           </div>

//           {/* Message Content */}
//           <Card className="px-5 py-4 bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl flex-1">
//             <div className="prose prose-sm max-w-none">
//               {" "}
//               <ReactMarkdown>{message.content}</ReactMarkdown>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;
//app/chatmodel/components/Message.tsx
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
        <Card className="px-4 py-3 bg-[#D9D9D966] text-black max-w-[80%] sm:max-w-[55%]">
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
      ) : (
        <div className="flex  justify-center items-start max-w-[95%] sm:max-w-[80%] md:w-[65%] lg:w-[55%]">
          <div className=" w-[15%] hidden sm:flex sm:justify-end ">
           
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
