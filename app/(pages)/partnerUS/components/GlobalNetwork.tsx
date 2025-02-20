import React from "react";
import Image from "next/image";

function GlobalNetwork() {
  return (
    <div
    className="relative flex flex-col lg:flex-row items-center justify-center h-auto lg:h-[400px] w-full my-4 mt-12 bg-black text-white"
  >
    <div className="w-[90%]  px-4 sm:px-6 lg:px-8 lg:w-1/2">
      <div className="text-left pl-0 lg:pl-16">
        <h5 className="my-4 w-full lg:w-[90%]">
          Join Our Global Network!
        </h5>
        <p className="mb-4 w-full xl:w-[90%] 2xl:w-3/4">
          With over <span className="text-[#F0851D]">1,000 universities</span> worldwide in our network, we’ve been driving growth and success for partners globally. Join us and expand your opportunities in the international education market.
        </p>
      </div>
    </div>
    <div className="w-[90%] lg:w-1/2 flex items-center justify-center mt-6 lg:mt-0">
      <Image
        src="/global.png"
        alt="Global Network"
        className="w-full max-w-sm lg:max-w-md object-contain h-[300px] lg:h-[400px]"
        width={950}
        height={1100}
      />
    </div>
  </div>
  
  );
}

export default GlobalNetwork;
