import { useState } from "react";
import Link from "next/link";
import { Headphones, MessageSquare, BookOpen, PenTool } from "lucide-react";

interface ExamSection {
  icon: keyof typeof icons;
  title: string;
}

const icons = {
  Headphones,
  MessageSquare,
  BookOpen,
  PenTool,
};

interface ExamStructureProps {
  textSectionTitle: string;
  textSectionDescription: string[];
  examSectionTitle: string;
  examSectionDescription1: string;
  examSectionDescription2: string;
  sections: ExamSection[];
}

export default function ExamStructure({
  textSectionTitle,
  textSectionDescription,
  examSectionTitle,
  examSectionDescription1,
  examSectionDescription2,
  sections,
}: ExamStructureProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center mt-6 lg:mt-14">
      <div className="w-[90%] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Text Section on the Left */}
        <div className="TextSection w-full lg:w-[90%]">
          <h4 className="font-bold mb-3">{textSectionTitle}</h4>
          <div className="text-gray-700 mb-3">
            {isExpanded
              ? textSectionDescription.map((point, index) => (
                  <p key={index}>
                    {point.includes("Click here") ? (
                      <Link href="/form" className="text-[#F0851D] underline">
                        {point}
                      </Link>
                    ) : (
                      point
                    )}
                  </p>
                ))
              : textSectionDescription.slice(0, 3).map((point, index) => (
                  <p key={index}>
                    {point.includes("Click here") ? (
                      <Link href="/form" className="text-[#F0851D] underline">
                        {point}
                      </Link>
                    ) : (
                      point
                    )}
                  </p>
                ))}
            {textSectionDescription.length > 3 && (
              <button
                onClick={toggleExpand}
                className="text-red-700 underline mt-2 block"
                aria-label={isExpanded ? "Read less" : "Read more"}
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        {/* Exam Section on the Right */}
        <div className="ExamSection w-full border rounded-3xl bg-[#FCE7D2] py-4 px-5 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h5 className="font-bold mb-4 text-center">{examSectionTitle}</h5>
            <p className="text-gray-600 leading-none text-center sm:text-left mb-3">
              {examSectionDescription1}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6">
            {sections.map((section, index) => {
              const IconComponent = icons[section.icon] || PenTool; 
              return (
                <div className="text-center" key={index}>
                  <div className="bg-[#F4D0D2] p-4 rounded-lg shadow-md inline-block">
                    <div className="inline-block p-3 bg-red-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                  </div>
                  <p className="font-semibold mt-2">{section.title}</p>
                </div>
              );
            })}
          </div>

          <div className="text-left mt-4">
            <p className="text-gray-600 text-center sm:text-left mt-3 leading-none">
              {examSectionDescription2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
