import React from "react";
import Image from "next/image";

function ServiceBanner() {
  const arr2 = [
    {
      icon: "/notebook.svg",
      caption: "Comprehensive Course Listings",
    },
    {
      icon: "/applicationProcess.svg",
      caption: "Streamlined Application Process",
    },
    {
      icon: "/Laptopsvg.svg",
      caption: "Airport Transportation Service",
    },
    {
      icon: "/home.svg",
      caption: "Accommodation Booking Service",
    },
    {
      icon: "/resource.svg",
      caption: "Resources and Support",
    },
  ];

  return (
    <>
      <section
        className="relative  flex flex-col lg:flex-row justify-between items-center mx-auto text-white bg-[#FCE7D2] bg-cover bg-center mt-4 md:mt-16"
        style={{
          height: "auto",
          minHeight: "180.81px",
          backgroundImage: "url('/bg-usa.png')",
          padding: "10px 20px",
          imageRendering: "crisp-edges",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-60 z-0"></div>

        {/* <div className="relative flex flex-col lg:flex-row z-10 w-full items-center"> */}
        <div className="lg:flex z-10 w-full">
          <div className="lg:w-2/5 flex items-center justify-center text-center lg:text-left text-gray-900  mb-6 lg:mb-0">
            <h4 className="font-bold">What we Offer!</h4>
          </div>
          <div
            className="flex lg:w-3/5 md:grid md:grid-cols-5 gap-0 overflow-x-auto md:py-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr2.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 xl:gap-1 items-center text-black min-w-[100px]"
              >
                <div className="flex items-center justify-center px-4 py-2 md:w-20 md:h-17 xl:h-26 xl:w-26  sm:h-20 bg-white rounded-lg">
                  <Image
                    src={item.icon}
                    alt={item.caption}
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-center w-18 font-semibold sm:w-32 lg:w-28 md:py-3 lg:pt-3 text-[12px] md:text-[14px] ">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ServiceBanner;
