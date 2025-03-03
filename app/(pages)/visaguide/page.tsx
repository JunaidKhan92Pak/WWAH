"use client"
import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Faqsection from "./components/Faqsection";
import Guide from "./components/guide/Guide";
interface Faq {
  question: string;
  answer: string;
  await_decision: string;
  Receive_your_visa: string;
  accommodation: string;
  prepare_for_arrival: string;
}

const Page = () => {
  interface VisaGuide {
    country_name: string;
    faqs: Faq[];
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

  const [visa, setVisa] = useState<VisaGuide | null>(null);
  const fetchData = async () => {
    try {
      const response = await fetch("/api/getVisaguide");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      setVisa(posts.visaguide);
      // console.log(posts, "posts");
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
