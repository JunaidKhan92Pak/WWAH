import Image from "next/image";
import React from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import Banner from "@/components/ui/enrollment/Banner";


interface ScholarshipsInUKProps {
  countryName: string;
}

export const ScholarshipsInUK: React.FC<ScholarshipsInUKProps> = ({
  countryName,
}) => {
  // Scholarships are defined inside the component, NOT as a prop
  const scholarships = [
    "Chevening Scholarships",
    "Rhodes Scholarships",
    "Great Scholarships",
    "Gates Cambridge Scholarships",
    "Rhodes Scholarships",
  ];

  const scholarshipItems = [
    { text: "Chevening Scholarships", image: "/countrypage/yellow.svg" },
    { text: "Rhodes Scholarships", image: "/countrypage/orange.svg" },
    { text: "Great Scholarships", image: "/countrypage/red.svg" },
    { text: "Gates Cambridge Scholarships", image: "/countrypage/sky.svg" },
    { text: "Rhodes Scholarships", image: "/countrypage/blue.svg" },
  ];

  return (
    <>
      {/* Scholarship Timeline Section */}
      <section className="hidden md:flex flex-col items-center bg-black text-white py-8">
        <h4>
          Scholarships in {countryName}!
        </h4>

        {/* Timeline Image */}
        <div className="relative w-full flex justify-center mt-4">
          <Image
            src="/countrypage/scholarship.svg"
            alt="Scholarships Timeline"
            width={900}
            height={300}
            className="w-full md:w-[80%]  lg:w-[70%]"
          />
        </div>

        {/* Scholarship List Below Image */}
        <div className="flex w-full md:w-[95%] lg:w-[85%] mt-4">
          {scholarships.map((scholarship, index) => (
            <p key={index} className="text-xs sm:text-sm lg:text-base text-center w-2/5">
              {scholarship}
            </p>
          ))}
        </div>
      </section>
      <div className="md:hidden flex flex-col items-start bg-black text-white py-8 px-6">
        <h4>
          Scholarships in {countryName}!
        </h4>

        <div className="flex flex-col space-y-3 mt-4">
          {scholarshipItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-">
              <Image src={item.image} alt={item.text} width={15} height={15} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Explore Scholarships Section */}
      {/* <section
        className="relative mt-10 text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",

          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:flex-row w-full py-9 md:px-12 lg:gap-10 sm:gap-0 gap-5">
          <div className="relative w-full lg:w-1/2">
            <h4 className="md:w-full text-gray-900 leading-6 text-center lg:text-left">
              Discover Scholarship Opportunities on our Scholarships Page!
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Link href="/scholarships">
              <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                Explore Scholarship Options
              </Button>
            </Link>
          </div>
        </div>
      </section> */}
      <Banner
              title="Get Personalized Help with Your UK Visa Application!"
              buttonText="Schedule a Session with WWAH Advisors Now!"
              buttonLink="/"
              backgroundImage="/bg-usa.png"
            />
    </>
  );
};
