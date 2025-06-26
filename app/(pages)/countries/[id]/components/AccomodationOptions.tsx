"use client";
import Image from "next/legacy/image";
import Banner from "@/components/ui/enrollment/Banner";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
interface Accomodation {
  accomodation: { name: string; detail: string }[];
}

const AccomodationOptions = ({ accomodation }: Accomodation) => {
  const arr2 = [
    {
      src: "/countrypage/uniAccomodation.jpg",
      alt: "Private Accommodation",
      heading: "University/College-Managed Accommodation",
      p: "Private student accommodation providers offer purpose-built housing with modern amenities, specifically for students. These can be a bit more expensive than university-managed accommodation but often come with additional features like gyms, social spaces, and organized events.",
    },

    {
      src: "/countrypage/privateAcc.jpg",
      alt: "Private Accommodation",
      heading: "Private Student Accommodation",
      p: "For students who prefer independent living, renting a private flat or house is a popular option, especially for those in their second or third year. You can rent alone or share with friends or other students.",
    },
    {
      src: "/countrypage/Privaterentals.jpg",
      alt: "Private Accommodation",
      heading: "Private Rentals (Flats and Houses)",
      p: "For students who prefer independent living, renting a private flat or house is a popular option, especially for those in their second or third year. You can rent alone or share with friend or other students",
    },
    {
      src: "/countrypage/Homestay.jpeg",
      alt: "Private Accommodation",
      heading: "Homestay",
      p: "Living with a local UK family is another accommodation option for international students. This provides a cultural immersion experience and a more familyoriented living arrangement.",
    },
    {
      src: "/countrypage/shortterm.jpeg",
      alt: "Private Accommodation",
      heading: "Short-Term Accommodation",
      p: "For students who need temporary accommodation (e.g., for a short course, study abroad, or before securing permanent housing), there are options like Hostels and Hotels.",
    },
  ];
  const name = accomodation?.map((acc) => acc.name);
  const description = accomodation?.map((acc) => acc.detail);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 100; // Adjust scroll distance
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <div>
        <div className="md:my-10 my-5 w-[95%] mx-auto">
          <h3 className="text-center mb-2 md:mb-4">Accommodation Options!</h3>
          <div className="relative p-2 md:p-0">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-1 md:-left-4 z-10 top-24 md:top-32 -translate-y-1/2 bg-white border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {arr2.map((image, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 max-w-[250px] md:max-w-[400px]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg md:h-[250px] h-[150px] w-[200px] md:w-[350px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-100 rounded-xl hidden sm:flex flex-col justify-end p-4">
                    <p className="text-white text-lg font-bold">
                      {name ? name[index] : ""}
                    </p>
                    <p className="text-white text-sm leading-4">
                      {description ? description[index] : ""}
                    </p>
                  </div>
                  <Accordion
                    type="single"
                    collapsible
                    className="sm:hidden mt-2 border rounded-md px-2"
                  >
                    <AccordionItem value="item-1 ">
                      <AccordionTrigger className=" font-bold ">
                        {name ? name[index] : "Details"}
                      </AccordionTrigger>
                      <AccordionContent className="text-[13px] leading-4">
                        {description
                          ? description[index]
                          : "No description available"}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-1 md:-right-4 z-10 top-24 md:top-32 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full hover:bg-gray-100 border border-gray-200"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Advisor Section */}
        <div className="my-2 md:my-6">
          <Banner
            title="Need help finding the perfect place to live abroad? Ask the WWAH Advisor now!"
            buttonText="Consult with WWAH Advisor"
            buttonLink="/contactus"
            backgroundImage="/bg-usa.png"
          />
        </div>
      </div>
    </>
  );
};

export default AccomodationOptions;
