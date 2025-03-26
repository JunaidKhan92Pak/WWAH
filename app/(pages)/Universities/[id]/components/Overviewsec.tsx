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
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 justify-center items-center w-full px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row justify-between w-full max-w-6xl">
                {/* Overview Section */}
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="mb-2 md:mb-4 text-xl md:text-2xl font-semibold">
                    Overview!
                  </h2>
                  <p className="text-[#9D9D9D] text-justify">{overview}</p>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg w-full sm:w-[80%] h-[200px] sm:h-[250px] md:h-[200px] lg:h-[280px] 2xl:h-[600px]">
                    <Image
                      src={image}
                      alt="University Image"
                      layout="fill"
                      objectFit="cover"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex justify-center items-end text-center bg-black/50 p-4 md:p-6">
                      <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[85%] space-y-3">
                        <p className="text-white text-sm md:text-base">
                          Get a glimpse of your future at {name}!
                        </p>
                        <Link
                          href={univideo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-white text-[#C7161E] px-3 md:px-5 py-1.5 rounded-md hover:bg-gray-300 transition">
                            Discover More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ReadMore Section */}
              <div className="w-full max-w-6xl">
                <ReadMore image={image}>
                  <h3 className="font-bold text-white pt-5 md:pt-0 text-lg md:text-xl">
                    History
                  </h3>
                  <p className="text-[#F6B677] font-semibold">
                    ({year}) Origins and Establishment
                  </p>
                  <p className="text-[#9D9D9D] text-justify">
                    {origin_and_establishment}
                  </p>
                  <p className="text-[#F6B677] font-semibold mt-3">
                    Modern Day Development
                  </p>
                  <p className="text-[#9D9D9D] text-justify">{modrenday}</p>
                </ReadMore>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Overviewsection;
