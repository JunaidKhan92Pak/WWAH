"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Hero from "./components/Hero";
import Faqsection from "./components/Faqsection";
import Guide from "./components/guide/Guide";

interface Faq {
  question: string;
  answer: string;
}

interface StepSection {
  heading: string;
  points: string[];
}

interface VisaGuide {
  _id: string;
  country_id: string;
  country_name: string;
  faqs: Faq[];
  steps: StepSection[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Page = () => {
  const params = useParams();
  const id = params.id as string; // Extract id from URL params

  const [visa, setVisa] = useState<VisaGuide | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/visaguide?id=${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setVisa(data.visaguide); // Set the visa guide data
      console.log(data, "API Response");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching visa guide:", error.message);
        setError(error.message);
      } else {
        console.error("Error fetching visa guide:", error);
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Add id as dependency

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading visa guide...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  // No data state
  if (!visa) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No visa guide found</div>
      </div>
    );
  }

  return (
    <>
      <Hero country={visa.country_name} />
      <Guide data={visa} />
      <Faqsection faqs={visa.faqs} />
    </>
  );
};

export default Page;
