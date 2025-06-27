"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import FeatureComparisonTable from "./FeatureComparisonTable";

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const plans = [
    {
      id: "essential",
      name: "Essential Plan",
      subHeading: "Self-driven students who just need the essentials.",
      price: 16,
      isPopular: false,
      features: [
        "SOP & CV Template + Review",
        "University Interview Preparation",
        "WhatsApp Chat Support",
        "Live Group Sessions via Zoom",
        "Apply up to 5 Scholarships",
      ],
    },
    {
      id: "pro",
      name: "Pro Plan",
      subHeading: "Students who want guided support with key services.",
      price: 26,
      isPopular: true,
      features: [
        "SOP & CV Formatting + Expert Review",
        "University 1 Mock Interview",
        "Full Profile Review & Assessment",
        "Chat & Call Support",
        "2 one-on-one Counselling Sessions",
        "3 Business days Review time",
        "Apply up to 8 Scholarships",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      subHeading: "Students who want personalized support.",
      price: 34,
      isPopular: false,
      features: [
        "SOP & CV - Built from Scratch",
        "University 3 Mock Interviews with Feedback",
        "Profile in-depth Assessment",
        "Unlimited Chat & Priority Call Support",
        "Unlimited Counselling Sessions",
        "24 hours Review time",
        "Apply up to 12 Scholarships",
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    console.log(`Selected plan: ${planId}`);
    // This would typically trigger a checkout or registration flow
  };

  return (
    <div className="max-w-7xl mx-auto md:px-0">
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find your perfect plan
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Subscribe to our services and explore the right scholarship plan
        </p>
      </div>

      {/* Pricing Cards */}
      {/* <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 px-4 sm:px-0 mb-6 w-max sm:w-full ">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="min-w-[300px] sm:w-96 max-w-sm flex-shrink-0"
            >
              <PricingCard
                plan={plan}
                onSelect={() => handleSelectPlan(plan.id)}
                isSelected={selectedPlan === plan.id}
              />
            </div>
          ))}
        </div>
      </div> */}

      {/* Pricing Cards */}
<div className="w-full lg:px-6">
  {/* xl screen: show all cards side-by-side like before */}
  <div className="hidden lg:flex xl:gap-2 px-4 sm:px-0 mb-6">
    {plans.map((plan) => (
      <div
        key={plan.id}
        className="min-w-[300px] lg:w-72 xl:w-96 max-w-sm flex-shrink-0 mx-auto"
      >
        <PricingCard
          plan={plan}
          onSelect={() => handleSelectPlan(plan.id)}
          isSelected={selectedPlan === plan.id}
        />
      </div>
    ))}
  </div>

  {/* Below xl: only one card visible at a time with dots */}
  <div className="lg:hidden w-full flex flex-col items-center">
    <div className="w-full max-w-sm px-2 mb-4">
      <PricingCard
        plan={plans[activeIndex]}
        onSelect={() => handleSelectPlan(plans[activeIndex].id)}
        isSelected={selectedPlan === plans[activeIndex].id}
      />
    </div>

    {/* Dots */}
    <div className="flex justify-center space-x-2 mt-2">
      {plans.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activeIndex ? "bg-red-600" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  </div>
</div>


      {/* Feature Comparison */}
      <div>
        <FeatureComparisonTable />
      </div>
    </div>
  );
}
