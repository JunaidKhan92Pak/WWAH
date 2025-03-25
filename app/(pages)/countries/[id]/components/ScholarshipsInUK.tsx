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
      <section className="hidden md:flex flex-col items-center bg-black text-white py-8 mt-10">
        <h4>Scholarships in {countryName}!</h4>

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
            <p
              key={index}
              className="text-xs sm:text-sm lg:text-base text-center w-2/5"
            >
              {scholarship}
            </p>
          ))}
        </div>
      </section> 

       <div className="md:hidden flex flex-col items-start bg-black text-white py-8 px-6 mt-10">
         <h4>Scholarships in {countryName}!</h4>

         <div className="flex flex-col space-y-3 mt-4">
           {scholarshipItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Image src={item.image} alt={item.text} width={15} height={15} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
   

     
      <Banner
        title={`Get Personalized Help with Your ${countryName} Visa Application!`}
        buttonText="Schedule a Session with WWAH Advisors Now!"
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
    </>
  );
};
