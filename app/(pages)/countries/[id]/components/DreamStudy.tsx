import Image from "next/image";
import React from "react";

const DreamStudy = () => {
  // const arr3 = ["/turk.png", "/studycanada.png", "/edin.png", "/manch.png"];
  const arr3 = [
    { src: "/country1.png", alt: "United States(US) " },
    { src: "/country2.png", alt: "China " },
    { src: "/country3.png", alt: "Canada" },
    { src: "/country4.png", alt: "Italy " },
    { src: "/country5.png", alt: "United Kingdom(UK) " },
    { src: "/country6.png", alt: "Ireland " },
    { src: "/country7.png", alt: "New Zealand " },
    { src: "/country8.png", alt: "Denmark " },
    { src: "/country9.png", alt: "France" },
  ];

  return (
    <div>
      <section
        className="relative flex justify-center items-center text-center text-white bg-5 bg-black bg-cover bg-center  mt-10"
        style={{
          backgroundImage: "url('/bg-usa.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
        <div className="my-10 2xl:my-20 z-10">
          <h3 className="text-center text-white text-xl md:text-2xl 2xl:text-3xl 2xl:my-10">
            Choose your Dream Study Abroad Destination!
          </h3>
          <section className="w-[90%] mx-auto">
            <div
              className="flex overflow-x-auto space-x-4 p-4 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {arr3.map((item, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 max-w-[300px] md:max-w-[400px] 2xl:max-w-[600px]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600} // Set a base width
                    height={400} // Set a base height
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 100vw, 200vw"
                    className="rounded-xl shadow-lg w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default DreamStudy;
