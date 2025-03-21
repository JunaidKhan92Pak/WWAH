import React from "react";
import Image from "next/image";

function GlobalNetwork() {
  return (
    <div
    className="relative flex flex-col md:flex-row items-center justify-center w-full my-4 py-4  mt-12 bg-black text-white "
  >
    <div className="w-[90%]  px-6 md:px-8 lg:w-1/2">
      <div className="text-left pl-0 lg:pl-12">
        <h5 className="my-2 md:my-4">
          Join Our Global Network!
        </h5>
        <p className="mb-4">
          With over <span className="text-[#F0851D] font-semibold">1,000 Universities</span> worldwide in our network, we&#39;ve been driving growth and success for partners globally. Join us and expand your opportunities in the international education market.
        </p>
      </div>
    </div>
    <div className="w-[90%] lg:w-1/2 flex items-center justify-center mt-6 lg:mt-0">
      <Image
        src="/global.png"
        alt="Global Network"
        className="w-full max-w-sm md:max-w-md  xl:max-w-lg object-contain h-[200px] lg:h-[400px]"
        width={950}
        height={1100}
      />
    </div>
  </div>
  
  );
}

export default GlobalNetwork;
