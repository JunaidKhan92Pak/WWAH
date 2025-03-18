import React from "react";
import Image from "next/image";

interface StandsectionProps {
  our_mission: string;
  values: string[];
}

const Standsection: React.FC<StandsectionProps> = ({ our_mission, values }) => {
  return (
    <>
      {/* section: What We Stand For */}
      <div className="md:py-12 py-6 w-full bg-white">
        <div className="md:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-800 pb-3">What we stand for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#F1F1F1] md:p-6 p-3 2xl:p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
              <div className="mb-4">
                <Image
                  src="/Wireless-Charge.png" // Replace with your actual image path
                  alt="Mission Image"
                  width={400}
                  height={400}
                  className="mx-auto w-12 h-12 md:w-50 md:h-50"
                />
              </div>
              <h3 className="text-gray-800">Our Mission!</h3>
              <p className="text-gray-700 leading-relaxed">{our_mission}</p>
            </div>

            {/* Values */}
            <div className="bg-[#F1F1F1] md:p-6 p-2 2xl:p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
              <div className="md:mb-4">
                <Image
                  src="/Medal-Ribbon.png" // Replace with your actual image path
                  alt="Values Image"
                  width={400}
                  height={400}
                  className="mx-auto w-12 h-12 md:w-50 md:h-50"
                />
              </div>
              <h3 className="text-gray-800">Our Values!</h3>
              <ul className="grid grid-cols-1 lg:grid-cols-2 md:gap-y-3 sm:gap-x-6 text-gray-700">
                {values.map((item, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <p className="text-red-500 mr-2 text-2xl">•</p>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Standsection;
