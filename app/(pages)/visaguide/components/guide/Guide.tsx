"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { RightSection } from "./RightSection";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the FAQ type
interface FAQ {
  question: string;
  answer: string;
}

// Define the VisaGuide type
interface VisaGuide {
  country_name: string;
  faqs: FAQ[];
  accept_offer: string;
  online_interview: string;
  visa_application_process: { title: string; description: string[] }[];
  submit_application: string;
  await_decision: string;
  Receive_your_visa: string;
  accommodation: string;
  prepare_for_arrival: string;
  collect_your_biometric_residence_permit: string;
  university_enrollment: string;
}

// Use the VisaGuide type for your data prop
interface GuideProps {
  data: VisaGuide;
}

const Guide: React.FC<GuideProps> = ({ data }) => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (id: number) => {
    setActiveStep(id);
  };

  return (
    <div className="w-full flex md:flex-row flex-col justify-evenly py-12 px-4 md:gap-0">
      {/* left section */}
      <ScrollArea className="flex flex-col border w-full md:w-[25%] rounded-3xl shadow-md items-center h-[836px]">
        <h4 className="py-8 lg:px-14 md:py-8 flex justify-center items-center text-center">
          Step by Step Guide!
        </h4>
        <Sidebar activeStep={activeStep} onStepClick={handleStepClick} />
      </ScrollArea>

      {/* right section */}
      <ScrollArea className="border w-full md:w-[65%] rounded-3xl shadow-md p-2 h-[836px]">
        <RightSection data={data} />
      </ScrollArea>
    </div>
  );
};

export default Guide;
