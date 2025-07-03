"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { RightSection } from "./RightSection";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { BiAlignLeft } from "react-icons/bi";

import { Button } from "@/components/ui/button";
// import { SidebarProfile } from "./SidebarProfile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu } from "lucide-react";
import { IoIosArrowDropright } from "react-icons/io";

interface Faq {
  question: string;
  answer: string;
}

// Update your interfaces in both files
interface StepSection {
  heading: string;
  points: string[];
  icon?: string; // Optional for custom icons
}

interface VisaGuide {
  _id: string;
  country_id: string;
  country_name: string;
  faqs: Faq[];
  steps: StepSection[]; // Replace all hardcoded fields with this
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="w-[90%] md:w-[100%] mx-auto mt-3 space-y-2">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="destructive" className="lg:hidden ">
              Step by Step Guide <IoIosArrowDropright className="text-2xl" />
            </Button>
            {/* <BiAlignLeft className="lg:hidden text-xl my-5 mx-3" /> */}
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {/* <SidebarProfile /> */}
            <Sidebar activeStep={activeStep} onStepClick={handleStepClick} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full flex md:flex-row flex-col justify-evenly lg:gap-5 md:py-12 lg:px-4 md:gap-0">
        {/* left section */}
        <ScrollArea className="hidden md:flex flex-col border w-full md:w-[25%] rounded-3xl shadow-md items-center h-[836px]">
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
    </div>
  );
};

export default Guide;
