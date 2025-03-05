"use client";
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import StudyInUs from "./components/StudyInUk";
import WorkOpportunity from "./components/WorkOpportunity";
import PermanentResidency from "./components/PermanentResidency";
import PopularPrograms from "./components/PopularPrograms";
import { ScholarshipsInUK } from "./components/ScholarshipsInUK";
import { VisaRequirements } from "./components/VisaRequirements";
import AccomodationOptions from "./components/AccomodationOptions";
import DreamStudy from "./components/DreamStudy";
import Healthcare from "./components/Healthcare";
import Link from "next/link";
import FAQ from "@/components/ui/enrollment/FAQ";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AccCrousel from "./components/AccCrousel";
export default function Countrypage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  interface Country {
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
    teaching_and_learning_approach?: string;
    multicultural_environment?: string;
    faqs: [];
    accomodation_options: []
  }

  const [country, setCountry] = useState<Country>({
    id: "",
    country_name: "",
    capital: "",
    language: "",
    population: 0,
    healthcare: "",
    currency: "",
    international_students: 0,
    academic_intakes: "",
    dialing_code: 0,
    gdp: "",
    why_study: "",
    work_while_study: "",
    work_after_study: "",
    work_while_studying: "",
    residency: "",
    popular_programs: [],
    rent: "",
    groceries: "",
    transportation: "",
    eating_out: "",
    household_bills: "",
    miscellaneous: "",
    health: [{ name: "", description: [""] }],
    scholarships: [],
    visa_requirements: [],
    teaching_and_learning_approach: "",
    faqs: [],
    accomodation_options: []
  });
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/getCountry?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      setCountry(posts.country);
      console.log(posts, "posts");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching country:", error.message);
      } else {
        console.error("Error fetching country:", error);
      }
    }
  };
  console.log(country, "Country from Parent");
  useEffect(() => {
    fetchData();
  }, []);
  console.log(country.health, "Country from parent");

  return country ? (
    <div>
      <div className="w-[90%] mx-auto">
        <Hero country={country} />
      </div>
      <StudyInUs
        country={country.why_study}
        countryName={country.country_name || ""}
      />
      <WorkOpportunity
        whileStudying={country.work_while_studying}
        afterStudying={country.work_after_study}
      />
      <PermanentResidency
        residency={country.residency}
        countryName={country.country_name || ""}
      />
      <PopularPrograms country={country.popular_programs} />

      <ScholarshipsInUK
        scholarships={country.scholarships}
        countryName={country.country_name || ""}
      />

      <VisaRequirements
        visaRequirements={country.visa_requirements || []}
        countryName={country.country_name}
      />
      <AccomodationOptions accomodation={country?.accomodation_options} />
      <AccCrousel
        countryName={country.country_name}
        teaching_and_learning_approach={
          country.teaching_and_learning_approach
            ? [country.teaching_and_learning_approach]
            : []
        }
        multicultural_environment={
          country.multicultural_environment
            ? [country.multicultural_environment]
            : []
        }
      />

      <Healthcare health={country.health} countryName={country.country_name} />

      <FAQ title="Frequently Asked Questions:" items={country?.faqs} />
      <section className="relative w-full  h-auto lg:mt-10 flex items-center px-4 sm:px-8 md:px-12">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Image
            src="/bg-usa.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 z-0 bg-[#FCE7D2]"
          />
        </div>
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-60 z-0"></div>

        {/* Content */}
        <div className="relative z-10 gap-4 flex flex-col lg:flex-row items-center  justify-between w-full h-full space-y-4 sm:space-y-0 my-10">
          {/* Left Side - Text */}
          <div className="w-full sm:w-[65%] lg:w-[50%] text-center lg:text-left">
            <h5 className="md:w-full text-gray-900 leading-10">
              Make your dream of studying in the UK a reality with our expert
              guidance!
            </h5>
          </div>

          {/* Right Side - Button */}
          <div className="w-full sm:w-auto flex justify-center text-center sm:text-right">
            <Link href="/form">
              <Button className="px-4 sm:px-8 lg:px-8 py-3 sm:py-4  text-white bg-[#C7161E] rounded-lg shadow-lg hover:bg-[#A10E17] transition text-[10px] md:text-[12px]">
                Book a Counselling Session wth WWAH Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <DreamStudy />
    </div>
  ) : (
    <p>Loading....</p>
  );
}
