import React from "react";
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
const Countrypage = () => {
  return (
    <div>
      <div className="w-[90%] mx-auto">
        <Hero />
      </div>
      <StudyInUs />
      <WorkOpportunity />
      <PermanentResidency />
      <PopularPrograms />
      
      <ScholarshipsInUK />

      <VisaRequirements />
      <AccomodationOptions />

      <Healthcare />

      <FAQ
        title="Frequently Asked Questions:"
        items={[
          {
            question: "Why should I study in the United Kingdom?",
            answer:
              "The UK is home to some of the world's best universities, known for their high academicstandards, innovative teaching methods, and research opportunities.",
          },
          {
            question: "What is the cost of studying in the UK for international students?",
            answer:
              "Tuition fees can range from £10,000 to £38,000 per year, depending on the course and university.",
          },
          {
            question:
              "What type of visa do I need to study in the UK?",
            answer:
              "You will need a Tier 4 (General) student visa for courses longer than 6 months. For shortercourses, a Short-term study visa may be required",
          },
          {
            question:
              "How long does it take to complete a degree in the UK",
            answer:
             ` 
      • Undergraduate degrees: Typically take 3–4 years.
      • Postgraduate degrees: Usually 1–2 years.
      • PhDs: Normally take 3–4 years.`,
          },
          {
            question:
              "What is the post-study work visa in the UK",
            answer:
              "The Graduate Route Visa allows international students to stay in the UK for up to 2 years (3years for PhD graduates) after completing their degree to work or look for employment.",
          },
          {
            question:
              "Is it safe to study and live in the UK?",
            answer:
              "Yes, the UK is generally safe for international students. Universities provide robust safety and security services, including campus security, emergency support, and safety apps to ensurestudent well-being.",
          },
        ]}
      />

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
            <h5  className="md:w-full text-gray-900 leading-10">
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
