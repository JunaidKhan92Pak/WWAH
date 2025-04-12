"use client";
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import WhyStudy from "./components/WhyStudy";
import WorkOpportunity from "./components/WorkOpportunity";
import PermanentResidency from "./components/PermanentResidency";
import PopularPrograms from "./components/PopularPrograms";
import { ScholarshipsInUK } from "./components/ScholarshipsInUK";
import { VisaRequirements } from "./components/VisaRequirements";
import AccomodationOptions from "./components/AccomodationOptions";
import DreamStudy from "./components/DreamStudy";
import Healthcare from "./components/Healthcare";
import Banner from "@/components/ui/enrollment/Banner";
import FAQ from "@/components/ui/enrollment/FAQ";
import AccCrousel from "./components/AccCrousel";
import Loading from "@/app/loading";
export default function Countrypage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  interface Country {
    id: string;
    country_name: string;
    short_name: string;
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
    residency: string[];
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
    teaching_and_learning_approach?: [];
    multicultural_environment?: [];
    faqs: [];
    
    accomodation_options: [];
  }
  // Initialize as null to avoid rendering before data is fetched.
  const [country, setCountry] = useState<Country | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/getCountry?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      setCountry(posts.country);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching country:", error.message);
      } else {
        console.error("Error fetching country:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Only display the loading screen until country data is available.
  if (!country) {
    return <Loading />;
  }

  return (
    <div>
      <div className="w-[90%] md:w-[95%] mx-auto">
        <Hero country={country} />
      </div>
      <WhyStudy
        country={country.why_study}
        countryName={country.country_name || ""}
      />
      <WorkOpportunity
        whileStudying={country.work_while_studying}
        afterStudying={country.work_after_study}
        countryName={country.country_name || ""}
      />
      <PermanentResidency
        residency={country.residency}
        countryName={country.country_name || ""}
        country={{ short_name: country.short_name }}
      />
      <PopularPrograms
        country={country.popular_programs}
        countryName={country.country_name}
      />
      <ScholarshipsInUK
        scholarships={country.scholarships}
        countryName={country.country_name || ""}
      />
      <VisaRequirements
        visaRequirements={country.visa_requirements || []}
        countryName={country.country_name}
        country={{ short_name: country.short_name }}
      />
      <AccomodationOptions accomodation={country.accomodation_options} />
      <AccCrousel
        countryName={country.country_name}
        teaching_and_learning_approach={
          country.teaching_and_learning_approach || [""]
        }
        multicultural_environment={
          country.multicultural_environment || [""]
        }
      />
      <Healthcare health={country.health} countryName={country.country_name} />
      <FAQ title="Frequently Asked Questions:" items={country.faqs} />
      <Banner
        title={`Make your dream of studying in the ${country.country_name} a reality with our expert guidance!`}
        buttonText="Book a Counselling Session with WWAH Advisor!"
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
      <DreamStudy />
    </div>
  );
}
