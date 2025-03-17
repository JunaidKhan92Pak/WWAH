"use client";
import React from "react";
import FAQ from "@/components/ui/enrollment/FAQ";
import Image from "next/image";

import Banner from "@/components/ui/enrollment/Banner";

interface Faq {
  question: string;
  answer: string;
}

interface FaqsectionProps {
  faqs: Faq[];
}

const Faqsection: React.FC<FaqsectionProps> = ({ faqs }) => {
  const sliderArray1 = [
    {
      src: "/visaguide/germany.png",
      alt: "Visa Guidence",
      heading: "Germany Visa Guidence",
    },
    {
      src: "/visaguide/uk.jpg",
      alt: "Visa Guidence",
      heading: "UK Visa Guidence",
    },
    {
      src: "/visaguide/australiavisa.png",
      alt: "Visa Guidence",
      heading: "Australia Visa Guidence",
    },
    {
      src: "/visaguide/canadavisa.png",
      alt: "Visa Guidence",
      heading: "Canada Visa Guidence",
    },
    {
      src: "/visaguide/chinavisa.jpg",
      alt: "Visa Guidence",
      heading: "China Visa Guidence",
    },
    {
      src: "/visaguide/japanvisa.jpg",
      alt: "Visa Guidence",
      heading: "Japan Visa Guidence",
    },
  ];
  
  return (
    <div>
      <section className="relative flex flex-col justify-center items-center text-center text-white w-full bg-cover bg-center ">
        {/* <div className="absolute inset-0 bg-black opacity-90 z-0"></div> */}
        <div className="w-full">
          <FAQ title="Frequently Asked Questions:" items={faqs} />
        </div>
      </section>
      <section className="md:py-20 py-10">
        <h2 className="text-center mb-5">Our Blogs!</h2>
        <div
          className="flex overflow-x-auto space-x-4 p-4 hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sliderArray1.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 max-w-[200px] md:max-w-[400px] 2xl:max-w-[600px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={600}
                className="rounded-3xl shadow-lg w-[250px] h-[150px] md:w-[350px] md:h-[250px] xl:w-[500px] xl:h-[300px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90 rounded-3xl hidden sm:flex flex-col justify-end p-6">
                <p className="text-white text-lg font-semibold">
                  {image.heading}
                </p>
              </div>
              <div className="sm:hidden mt-2">
                <p className="text-[14px] font-semibold">{image.heading}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Banner
        title="Get Personalized Help with Your UK Visa Application!"
        buttonText="Schedule a Session with WWAH Advisors Now!"
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
      
    </div>
  );
};

export default Faqsection;
