import React from "react";
import Image from "next/image";
interface HeroProps {
  country: {
    id: string;
    country_name: string;
    capital: string;
    language: string;
    population: number;
    currency: string;
    international_students: number;
    academic_intakes: string;
    dialing_code: number;
    gdp: string;
    why_study: string;
    work_while_study: string;
    work_after_study: string;
    residency: string;
    popular_programs: string[];
    rent: string;
    groceries: string;
    transportation: string;
    eating_out: string;
    household_bills: string;
    miscellaneous: string;
    healthcare: string;
    health: { name: string; description: string[] }[];
    scholarships: string[];
    visa_requirements: string[];
    work_while_studying: string;
    // accomodation_options: { name: string; description: string }[];
    teaching_and_learning_approach?: string;
    multicultural_environment?: string;
    faqs?: string[];
  }

  //   id: string;
  //   country_name: string;
  //   capital: string;
  //   language: string;
  //   population: number;
  //   currency: string;
  //   international_students: number;
  //   academic_intakes: string;
  //   dialing_code: number;
  //   gdp: string;
  //   why_study: string;
  //   work_while_study: string;
  //   work_after_study: string;
  //   residency: string;
  //   popular_programs: string[];
  //   rent: string;
  //   groceries: string;
  //   transportation: string;
  //   eating_out: string;
  //   household_bills: string;
  //   miscellaneous: string;
  //   health: { name: string; description: string[] }[];
  //   scholarships: string[];
  //   visa_requirements: string[];
  //   work_while_studying: string;
  //   accomodation_options?: string;
  //   teaching_and_learning_approach?: string;
  //   multicultural_environment?: string;
  //   faqs?: string[];
  //   healthcare: string;
  // };
}

const Hero: React.FC<HeroProps> = ({ country }) => {
  const arr1 = [
    {
      img: "/countrypage/capital.svg",
      Heading: "Capital",
      Name: `${country.capital}`,
    },
    {
      img: "/countrypage/language.svg",
      Heading: "Language",
      Name: `${country.language}`,
    },
    {
      img: "/countrypage/population.svg",
      Heading: "Population",
      Name: `${country.population}`,
    },
    {
      img: "/countrypage/currency.svg",
      Heading: "Currency",
      Name: `${country.currency}`,
    },
    {
      img: "/countrypage/international.svg",
      Heading: "International Students",
      Name: `${country.international_students}`,
    },
    {
      img: "/countrypage/acdm.svg",
      Heading: "Academic Intakes",
      Name: `${country.academic_intakes}`,
    },
    {
      img: "/countrypage/code.svg",
      Heading: "Dialing Codes",
      Name: `${country.dialing_code}`,
    },
    {
      img: "/countrypage/gdp.svg",
      Heading: "GDP",
      Name: `${country.gdp}`,
    },
  ];

  return (
    <section className="mx-auto">
      {/* Hero Section */}
      <div
        className="relative h-[150px] sm:h-[75vh] flex justify-center items-center text-center rounded-2xl text-white bg-cover bg-center md:mt-4"
        style={{
          backgroundImage: "url('/countrypage/bg-image.png')",
        }}
      >
        <div className="w-4/5 text-left my-5">
          <div className="flex items-center gap-2 md:gap-5">
            <Image
              src="/flag.png"
              alt="flag"
              width={80}
              height={80}
              className="object-cover w-[55px] md:w-[40px] lg:w-1/10 xl:w-1/12"
            />
            <h1>Study In {country.country_name}</h1>
          </div>
          <p className="py-2">
            Step Into Success with a{" "}
            <span className="text-[#F6B677] font-bold">World-Class</span>{" "}
            Education in the {country.country_name}.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <section className="relative mt-6 md:my-6">
        <div
          className="
      flex lg:grid lg:grid-cols-4 md:gap-6  overflow-x-auto bg-white shadow-lg rounded-2xl mx-auto 
      w-[90%] md:w-[80%] md:py-6 md:px-4 p-2 whitespace-nowrap lg:whitespace-normal lg:overflow-visible sm:relative md:absolute md:-top-20 md:left-1/2 md:transform md:-translate-x-1/2 "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {arr1.map((item, index) => (
            <div
              key={index}
              className="
          inline-block lg:flex lg:flex-row lg:gap-2 flex-col min-w-[80px]"
            >
              {/* Image Wrapper */}
              <div
                className="
            flex items-center justify-center h-12 w-12 sm:h-18 sm:w-18 
            rounded-md overflow-hidden"
              >
                <Image
                  src={item.img}
                  alt={item.Heading}
                  className="object-contain"
                  width={50} // Ensure consistent size
                  height={50}
                />
              </div>
              {/* Text Content */}
              <div className="flex flex-col pt-2">
                <p className="font-bold md:text-sm text-[12px] text-wrap">
                  {item.Heading}
                </p>
                <p className="md:text-sm text-[12px] text-wrap">{item.Name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Hero;
