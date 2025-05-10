"use client";
import React from "react";
import Image from "next/image";

interface PermanentResidencyProps {
  residency: string[];
  countryName: string;
  country: { short_name: string }; // Add country prop
}

const PermanentResidency: React.FC<PermanentResidencyProps> = ({
  residency,
  countryName,
  country,
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="relative justify-between flex flex-col lg:flex-row lg:gap-5 items-center text-white bg-black bg-cover bg-center h-auto p-6 my-1 overflow-hidden"
      style={{
        backgroundImage: "url('/bg-usa.png')",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-90 z-0"></div>

      {/* Content Section (50%) */}
      <div className="relative z-10 leading-tight w-full lg:w-1/2 flex flex-col justify-center space-y-2 sm:px-4 text-left lg:px-4">
        <h5>
          How to Get Permanent Residency in the {countryName} as an
          International Student?
        </h5>

        <div className="text-[rgb(209,207,207)] space-y-3 max-h-60 overflow-y-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 transparent', 
          }}>
          {Array.isArray(residency) &&
            residency.map((item, index) => (
              <p
                key={index}
                className="leading-snug p-1 border-gray-600 rounded"
              >
                {item}
              </p>
            ))}
        </div>
      </div>

      {/* Image Section (50%) */}
      <div className="relative z-10 lg:w-[43%] hidden lg:flex justify-center items-center mt-6 lg:mt-0">
        <Image
          src={`/countryarchive/${country?.short_name}_visa.png`}
          alt={`${countryName} Visa`}
          width={600}
          height={600}
          className="rounded-3xl shadow-lg object-cover sm:w-[80%] md:w-[70%] lg:w-full max-w-[700px] overflow-hidden"
        />
      </div>
    </section>
  );
};

export default PermanentResidency;
