"use client"
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
const Countrypage = () => {
      // const [visa, setVisa] = useState({});
      const [country, setCountry] = useState({});
      const fetchData = async () => {
        try {
          const response = await fetch("/api/getCountry");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const posts = await response.json();
          setCountry(posts.country);
          console.log(posts, "posts");
        } catch (error) {
          console.error("Error fetching country:", error.message);
        }
      };
      console.log(country, "Country from Parent");
      useEffect(() => {
        fetchData();
      }, []);
  return (
    <div>
      <div className="w-[90%] mx-auto">
        <Hero country={country} />
      </div>
      <StudyInUs
        country={country.why_study}
        countryName={country.country_name}
      />
      <WorkOpportunity
        whileStudying={country.work_while_studying}
        afterStudying={country.work_after_study}
      />
      <PermanentResidency
        residency={country.residency}
        countryName={country.country_name}
      />
      <PopularPrograms country={country} />

      <ScholarshipsInUK
        scholarships={country.scholarships}
        countryName={country.country_name}
      />

      <VisaRequirements
        visaRequirements={country.visa_requirements}
        countryName={country.country_name}
      />
      <AccomodationOptions accomodation={country.accomodation_options} />
      <AccCrousel
        countryName={country.country_name}
        teaching_and_learning_approach={country.teaching_and_learning_approach}
        multicultural_environment={country.multicultural_environment}
      />

      <Healthcare health={country.health} countryName={country.country_name} />

      {/* <FAQ title="Frequently Asked Questions:" items={country.faqs } /> */}
      <FAQ title="Frequently Asked Questions:" items={country?.faqs || []} />

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
  );
};

export default Countrypage;
