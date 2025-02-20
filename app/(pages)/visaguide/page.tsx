import React from "react";
import Hero from "./components/Hero";
// import FAQ from "@/components/ui/enrollment/FAQ";
// import Faqsection from "./components/Faqsection";
import Faqsection from "./components/Faqsection";
import Guide from "./components/guide/Guide";
const page = () => {
  return (
    <>
          <Hero />
          <Guide/>
      <Faqsection />
    </>
  );
};

export default page;
