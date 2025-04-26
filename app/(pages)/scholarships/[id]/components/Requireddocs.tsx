import Image from "next/image";
import { useCallback, useState } from "react";
import DOMPurify from "dompurify";
interface Document {
  document: string;
  details: string;
}
interface RequireddocsProps {
  requiredDocs: Document[]; // Adjust the type based on the actual structure of requiredDocs
}

const Requireddocs = ({ requiredDocs }: RequireddocsProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const handleMouseEnterDoc = useCallback(
    (doc: Document) => setSelectedDoc(doc),
    []
  );
  return (
    <div>
      <section className="flex flex-col items-center justify-center py-2 lg:py-5 px-4  lg:w-[90%] mx-auto">
        <h3 className="lg:mb-4">Required Documents!</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          {/* Text Section */}
          <div className="bg-white p-2 md:p-6 rounded-2xl shadow-lg h-full">
            <h5 className="lg:mb-2 mb-1">Required Document list:</h5>
            <ul className="grid grid-cols-2 lg:gap-4 md:gap-2 gap-1 text-gray-700 leading-snug ">
              {requiredDocs.map((doc) => (
                <li
                  key={doc.document}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span className="text-red-500 text-4xl">•</span>
                  <p
                    className="hover:underline"
                    onMouseEnter={() => handleMouseEnterDoc(doc)}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    {doc.document}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Section */}
          <div className="flex items-center justify-center rounded-3xl shadow-lg h-full  bg-red-50 p-4">
            {selectedDoc ? (
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedDoc.document} Details
                </h3>
                <p
                  className="text-gray-700 mt-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedDoc.details),
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
      </section>
    </div>
  );
};
export default Requireddocs;
