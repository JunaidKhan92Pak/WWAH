import Image from "next/image";
import { useCallback, useState } from "react";
import DOMPurify from "dompurify";

interface Document {
  document: string;
  details: string;
}

interface RequireddocsProps {
  requiredDocs: Document[];
}

const Requireddocs = ({ requiredDocs }: RequireddocsProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleMouseEnterDoc = useCallback(
    (doc: Document) => setSelectedDoc(doc),
    []
  );

  return (
    <div className="w-full">
      <section className="flex flex-col items-center justify-center py-4 lg:py-8 px-4 lg:w-[90%] mx-auto">
        {/* Main Title */}
        <h3 className="lg:mb-4 mb-3">Required Documents!</h3>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-7xl">
          {/* Document List Section */}
          <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg h-full flex flex-col">
            <h5 className="lg:mb-2 mb-1">Required Document list:</h5>

            {/* Documents Grid */}
            <div className="flex-1 overflow-hidden">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:gap-4 md:gap-2 gap-1 text-gray-700 leading-snug">
                {requiredDocs.map((doc) => (
                  <li
                    key={doc.document}
                    className="flex items-center  space-x-2 cursor-pointer  "
                  >
                    <span className="text-red-500 text-4xl leading-none flex-shrink-0 ">
                      •
                    </span>
                    <p
                      className="hover:underline break-words  "
                      onMouseEnter={() => handleMouseEnterDoc(doc)}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      {doc.document}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Details/Image Section */}
          <div className="flex items-center justify-center rounded-2xl lg:rounded-3xl shadow-lg h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-[#ffe7cd] overflow-hidden">
            {selectedDoc ? (
              <div className="w-full h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-start overflow-y-auto">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                  {selectedDoc.document} Details
                </h3>

                <div className="flex-1 overflow-y-auto">
                  <div
                    className="text-gray-700 mt-4 text-sm sm:text-base lg:text-lg text-left leading-relaxed whitespace-pre-line break-words"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedDoc.details),
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-md max-h-md">
                  <Image
                    src="/scholarshipdetail/illustration.png"
                    alt="Illustration - Select a document to view details"
                    className="w-full h-full object-contain rounded-2xl"
                    width={500}
                    height={500}
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Requireddocs;