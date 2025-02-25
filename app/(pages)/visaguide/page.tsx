"use client"
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Faqsection from "./components/Faqsection";
import Guide from "./components/guide/Guide";
const Page = () => {
  interface VisaGuide {
    country_name: string;
    faqs: any[];
    // Add other properties as needed
  }

  const [visa, setVisa] = useState<VisaGuide | null>(null);
  const fetchData = async () => {
    try {
      const response = await fetch("/api/getVisaguide");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      setVisa(posts.visaguide);
      console.log(posts, "posts");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching visa guide:", error.message);
      } else {
        console.error("Error fetching visa guide:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {visa && (
        <>
          <Hero country={visa.country_name} />
          <Guide data={visa} />
          <Faqsection faqs={visa.faqs} />
        </>
      )}
    </>
  );
};

export default Page;
