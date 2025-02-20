import React from "react";
// import Image from "next/image"; // Import the Image component
// import { Button } from "@/components/ui/button";
import Herosection from "./components/Herosection";
import CounsellorSection from "./components/CounsellorSection";
import ApplyingSection from "./components/ApplyingSection";
// import PaymentSection from "./components/PaymentSection";
// import Accomodationbooking from "./components/Accomodationbooking";

const Page = () => {
  // const documents = Array(5).fill({
  //   title: "Asma's Passport",
  //   dateUploaded: "31 Dec, 2024",
  // });

  return (
    <>
      <Herosection />
      <div className="w-full mx-auto flex flex-col xl:flex-row gap-4  items-center md:items-stretch  mt-4 justify-center">

        <div className="w-full xl:w-[70%] rounded-xl border p-4">
          <ApplyingSection />
        </div>
        <div className="w-full xl:w-[30%] rounded-xl border p-4">
          <CounsellorSection />
        </div>


      </div>
    </>
  );
};

export default Page;
