"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { RightSection } from "./RightSection";
import { ScrollArea } from "@/components/ui/scroll-area";

const Guide = () => {
  const [activeStep, setActiveStep] = useState(1);

 const handleStepClick = (id: number) => {
   setActiveStep(id);
 };
  // const activeContent = steps.find((step) => step.id === activeStep);
  return (
    <div className="w-full flex md:flex-row flex-col justify-around lg:justify-evenly py-5 lg:py-12 lg:px-4   md:gap-0 ">
      {/* left section */}
      <ScrollArea className="flex flex-col  border-2 w-full md:w-[25%] rounded-3xl shadow-md items-center h-[790px] md:h-[836px]">
        <h4 className="pt-2 lg:px-14 md:py-8 flex justify-center items-center text-center">
          Step by Step Guide!
        </h4>
        <Sidebar activeStep={activeStep} onStepClick={handleStepClick} />
      </ScrollArea>

      {/* right section */}
      <ScrollArea className="border-2 w-full md:w-[65%] rounded-3xl shadow-md  p-2 h-[836px]">
        <RightSection  />
      </ScrollArea>
    </div>
  );
};

export default Guide;
