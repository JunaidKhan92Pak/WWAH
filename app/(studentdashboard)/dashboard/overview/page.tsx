import React from "react";
// import Image from "next/image"; // Import the Image component
// import { Button } from "@/components/ui/button";
import Herosection from "./components/Herosection";
import CounsellorSection from "./components/CounsellorSection";
import ApplyingSection from "./components/ApplyingSection";
import Coursesuggestion from "./components/Coursesuggestion";
import { StatusProgressBar } from "../components/StatusProgressBar";

const Page = () => {
  return (
    <>
      <div className="w-[94%] xl:w-[98%] mx-auto overflow-hidden">
        <Herosection />
        <div className="w-full mx-auto flex flex-col xl:flex-row gap-4  items-center md:items-stretch  my-6 justify-center">
          <div className="w-full xl:w-[70%] rounded-xl border  p-4 flex flex-col space-y-4">
            <ApplyingSection />
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <StatusProgressBar progress={70} />
              </div>
            </div>
            <Coursesuggestion />
          </div>

          <div className="w-full xl:w-[30%] rounded-xl border p-4">
            <CounsellorSection />
          </div>
        </div>
      </div>
   </> 
  );
};

export default Page;
