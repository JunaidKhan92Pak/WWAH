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
          <h2 className="text-center text-gray-800 pb-3">What Do We Stand For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#F1F1F1] md:p-6 p-3  rounded-3xl  border border-gray-200 shadow-sm">
              <div className="mb-2">
                <Image
                  src="/Wireless-Charge.png" // Replace with your actual image path
                  alt="Mission Image"
                  width={400}
                  height={400}
                  className="mx-auto w-12 h-12 md:w-50 md:h-50"
                />
              </div>
              <h4 className="text-gray-800 text-center">Our Mission!</h4>
              <p className="text-gray-700 leading-relaxed">{our_mission}</p>
            </div>

            {/* Values */}
            <div className="bg-[#F1F1F1] md:p-6 p-2  rounded-3xl text-center border border-gray-200 shadow-sm">
              <div className="mb-2">
                <Image
                  src="/Medal-Ribbon.png" // Replace with your actual image path
                  alt="Values Image"
                  width={400}
                  height={400}
                  className="mx-auto w-12 h-12 md:w-50 md:h-50"
                />
              </div>
            <h4 className="text-gray-800 text-center mb-2">Our Values!</h4>
<ul className="grid grid-cols-1 gap-2 text-gray-700 text-center">
  {values.map((item, index) => (
    <li key={index} className="flex justify-center">
      <span className="text-red-500 mr-2 text-2xl">•</span>
      <span>{item}</span>
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
