"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import FeatureComparisonTable from "./FeatureComparisonTable";

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "essential",
      name: "Essential Plan",
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find your perfect plan
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Subscribe to our services and explore the right scholarship plan
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="flex overflow-x-auto gap-6 justify-start items-stretch mb-16 px-4 sm:justify-center">
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

      {/* Feature Comparison */}
      <div>
        <FeatureComparisonTable />
      </div>
    </div>
  );
}
