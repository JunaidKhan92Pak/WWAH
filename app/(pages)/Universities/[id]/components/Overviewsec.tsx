import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
interface ReadMoreProps {
  children: React.ReactNode;
  image: string;
}
const ReadMore: React.FC<ReadMoreProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div
        className={`text-[#9D9D9D] leading-relaxed ${
          isExpanded ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {children}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-red-500 underline underline-offset-4 font-normal hover:font-semibold my-2"
      >
        {isExpanded ? "Show Less" : "Read More..."}
      </button>
    </div>
  );
};
interface OverviewSectionProps {
  overview: string;
  origin_and_establishment: string;
  name: string;
  year: string | number;
  modrenday: string;
  univideo: string;
  image: string; // ✅ Add this line
}
const Overviewsection: React.FC<OverviewSectionProps> = ({
  overview,
  origin_and_establishment,
  name,
  year,
  modrenday,
  univideo,
  image,
}) => {
  return (
    <div>
      <section>
        {/* First Section: Overview & History */}
        <div className="relative text-white py-5 md:py-12 px-2">
          {/* Background Image */}
          <div className="absolute inset-0 -z-10 bg-black"></div>
          <div className="w-[90%] mx-auto">
            <div className="flex flex-col md:flex-row md:gap-4 justify-between items-center">
              <div className="w-full md:w-1/2 ">
                <h2 className="mb-2 md:mb-4">Overview!</h2>
                {/* Wrap all content after overview inside ReadMore */}
                <ReadMore image={image}>
                  <p>{overview}</p>
                  {/* History Section */}
                  <h3 className="font-bold text-white pt-5 md:pt-0">History</h3>
                  {/* Origins and Establishment */}
                  <p className="text-[#F6B677] font-semibold">
                    ({year}) Origins and Establishment
                  </p>
                  <p className="text-[#9D9D9D]">{origin_and_establishment}</p>
                  {/* Modern Day Development */}
                  <p className="text-[#F6B677] font-semibold">
                    Modern Day Development
                  </p>
                  <p className="text-[#9D9D9D]">{modrenday}</p>
                </ReadMore>
              </div>

              <div className="w-full md:w-1/2">
                {/* Image Section */}
                <div className="flex flex-col items-center">
                  {" "}
                  {/* <div className="relative rounded-3xl overflow-hidden shadow-lg w-full h-[200px] md:h-[300px] lg:h-[250px] 2xl:h-[600px]"> */}
                  <div className="relative rounded-3xl overflow-hidden shadow-lg w-[100%] sm:w-[80%] h-[200px] sm:h-[250px] md:h-[200px] lg:h-[280px]  2xl:h-[600px]">
                    {" "}
                    <Image
                      src={image}
                      alt="University Image"
                      layout="fill"
                      objectFit="cover"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex justify-center items-end text-center bg-black/50 p-4 md:p-6">
                      <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[85%]">
                        <p className="text-white px-4 mb-3">
                          Get a glimpse of your future at {name}!
                        </p>
                        <Link
                          href={univideo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-white text-[#C7161E] px-2 md:px-4 py-1 rounded-md hover:bg-gray-300 transition">
                            Watch ? Discover More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Overviewsection;
