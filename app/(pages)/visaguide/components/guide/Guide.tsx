"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { RightSection } from "./RightSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuideProps {
  data: any; // Replace 'any' with the appropriate type if known
}

const Guide: React.FC<GuideProps> = ({ data }) => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (id: number) => {
    setActiveStep(id);
  };
  // const activeContent = steps.find((step) => step.id === activeStep);
  return (
    <div className="w-full flex md:flex-row flex-col justify-evenly py-12 px-4   md:gap-0 ">
      {/* left section */}
      <ScrollArea className="flex flex-col  border w-full md:w-[25%] rounded-3xl shadow-md items-center  h-[836px]">
        <h4 className=" py-8 lg:px-14 md:py-8 flex justify-center items-center text-center">
          Step by Step Guide!
        </h4>
        <Sidebar activeStep={activeStep} onStepClick={handleStepClick} />
      </ScrollArea>

      {/* right section */}
      <ScrollArea className="border w-full md:w-[65%] rounded-3xl shadow-md  p-2  h-[836px]">
        <RightSection data={data} />
      </ScrollArea>
    </div>
  );
};

export default Guide;
