"use client"
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useState, useCallback, useMemo, useRef } from "react";
import DOMPurify from "dompurify";

interface Document {
  name: string;
  detail: string;
}
interface Degree {
  doc: Document[];
}
interface Data {
  universityDocuments: Degree[];
  embassyDocuments: Document[];
}

export const RequiredDocuments = ({ data }: { data: Data }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedDocUni, setSelectedDocUni] = useState<Document | null>(null);
  const [activeTabUni, setActiveTabUni] = useState("University Application Docs");

  const scrollRef = useRef<HTMLDivElement | null>(null); // 👈 For smooth scroll

  const universityDocs = useMemo(
    () => (data?.universityDocuments || []).flatMap((degree) => degree.doc || []),
    [data]
  );
  const embassyDocs = useMemo(() => data?.embassyDocuments || [], [data]);

  const handleMouseEnterUni = useCallback((doc: Document) => setSelectedDocUni(doc), []);
  const handleMouseEnterEmbassy = useCallback((doc: Document) => setSelectedDoc(doc), []);

  const handleTabClick = (tab: string) => {
    setActiveTabUni(tab);
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  if (!data) return null;

  return (
    <section className="flex flex-col items-center justify-center md:my-14">
      <h1 className="md:mb-6 mb-2">Required Documents!</h1>

      {/* Tab Buttons */}
      <div className="flex flex-col md:flex-row gap-2 md:mb-8">
        <Button
          variant="outline"
          className={`px-4 py-2 rounded-lg text-base md:text-lg  border-2 h-12 hover:bg-red-700 hover:text-white ${
            activeTabUni === "University Application Docs"
              ? "border-red-700 text-red-700 font-semibold bg-transparent"
              : "border-gray-900 text-gray-900 bg-transparent"
          }`}
          onClick={() => handleTabClick("University Application Docs")}
        >
          University Application Docs
        </Button>
        <Button
          variant="outline"
          className={`px-4 py-2 rounded-lg text-base md:text-lg border-2 h-12 ${
            activeTabUni === "Embassy Documents"
              ? "border-red-500 text-red-700 font-semibold bg-transparent"
              : "border-gray-900 text-gray-900 bg-transparent"
          }`}
          onClick={() => handleTabClick("Embassy Documents")}
        >
          Embassy Documents
        </Button>
      </div>

      {/* University Application Docs */}
            {/* Scroll target */}
      <div ref={scrollRef} className="w-full flex justify-center">
        <div className="w-full flex flex-col items-center">

      {activeTabUni === "University Application Docs" && (
        <>
          {/* Mobile Accordion View (below sm) */}
          <div className="block sm:hidden w-[90%] ">
            <div className="bg-white p-4 rounded-xl my-4 shadow-md">
              <h5 className="mb-4">University Application Docs:</h5>
              <h6 className="mb-4">Required Documents:</h6>
              <Accordion type="single" collapsible className="w-full ">
                {universityDocs.map((doc, index) => (
                  <AccordionItem key={doc.name} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-xl">•</span>
                        <span>{doc.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="text-gray-700 px-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(doc.detail),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Desktop Grid View (sm and above) */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-[90%]">
            {/* Text Section */}
            <div className="bg-white p-6 rounded-xl shadow-md h-full">
              <h5 className="md:mb-4">University Application Docs:</h5>
              <h6 className="md:mb-4">Required Documents:</h6>
              <ul className="grid grid-cols-2 gap-2 md:gap-4 text-gray-700">
                {universityDocs.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="text-red-500 text-4xl">•</span>
                    <p
                      className="hover:underline"
                      onMouseEnter={() => handleMouseEnterUni(doc)}
                      onClick={() => setSelectedDocUni(doc)}
                    >
                      {doc.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center rounded-3xl shadow-lg h-full  bg-[#ffe7cd] min-h-[300px] sm:min-h-[400px]  ">
              {selectedDocUni ? (
                <div className="text-center px-4 sm:px-8 lg:px-16">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    {selectedDocUni.name} Details
                  </h3>
                  <p
                    className="text-gray-700 mt-2 text-sm sm:text-base lg:text-lg"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedDocUni.detail),
                    }}
                  ></p>
                </div>
              ) : (
                <Image
                  src="/scholarshipdetail/illustration.png"
                  alt="Illustration"
                  className="w-full h-full object-cover rounded-3xl"
                  width={500}
                  height={500}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Embassy Documents */}
      {activeTabUni === "Embassy Documents" && (
        <>
          {/* Mobile Accordion View (below sm) */}
          <div className="block sm:hidden w-[90%]">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="mb-4">Embassy Documents:</h5>
              <h6 className="mb-4">Required Documents:</h6>
              <Accordion type="single" collapsible className="w-full">
                {embassyDocs.map((doc, index) => (
                  <AccordionItem key={doc.name} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-xl">•</span>
                        <span>{doc.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="text-gray-700 pl-6"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(doc.detail),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Desktop Grid View (sm and above) */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-[90%]">
            {/* Text Section */}
            <div className="bg-white p-6 rounded-xl shadow-md h-full">
              <h5 className="md:mb-4">Embassy Documents:</h5>
              <h6 className="md:mb-4">Required Documents:</h6>
              <ul className="grid grid-cols-2 gap-2 md:gap-4 text-gray-700">
                {embassyDocs.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-start space-x-2 cursor-pointer"
                  >
                    <span className="text-red-500 text-4xl">•</span>
                    <p
                      className="hover:underline"
                      onMouseEnter={() => handleMouseEnterEmbassy(doc)}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      {doc.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Show Image or Document Details */}
            <div className="flex items-center justify-center rounded-3xl shadow-lg h-full  bg-[#ffe7cd] min-h-[300px] sm:min-h-[400px] ">
              {selectedDoc ? (
                <div className="text-center px-4 sm:px-8 lg:px-16">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    {selectedDoc.name} Details
                  </h3>
                  <p
                    className="text-gray-700 mt-2 text-sm sm:text-base lg:text-lg"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedDoc.detail),
                    }}
                  ></p>
                </div>
              ) : (
                <Image
                  src="/scholarshipdetail/illustration.png"
                  alt="Illustration"
                  className="w-full h-auto object-cover rounded-3xl"
                  width={500}
                  height={500}
                />
              )}
            </div>
          </div>
        </>
      )}
          </div>
      </div>
    </section>
  );
};
