import React from "react";

interface HeroProps {
  country: string;
}

// Map of country names to adjectives
const countryAdjectives: Record<string, string> = {
  America: "American",
  "United States of America": "American",
  "United Kingdom": "British",
  Australia: "Australian",
  Canada: "Canadian",
  Malaysia: "Malaysian",
  Italy: "Italian",
  Ireland: "Irish",
  Germany: "German",
};

const getAdjectiveForm = (country: string): string => {
  return countryAdjectives[country] || country;
};

const Hero: React.FC<HeroProps> = ({ country }) => {
  const adjective = getAdjectiveForm(country);
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  return (
    <div>
      <section className="w-[90%] md:w-[95%] mx-auto">
        <div
          className="relative md:mt-4 h-[200px] md:h-[80vh] flex justify-center items-center text-center rounded-2xl text-white bg-cover bg-center"
          style={{
            backgroundImage: "url('/visaBg.png')",
          }}
        >
          <div className="w-4/5 ">
            <div className="flex flex-col items-start md:w-3/5">
              <h1 className="text-left lg:leading-tight">
                Your Comprehensive Guide to the {capitalizedAdjective} Visa Application
                Process!
              </h1>
              <p className="py-2">
                &quot;Step-by-Step Visa Application Process&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
