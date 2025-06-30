"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import FeatureComparisonTable from "./FeatureComparisonTable";
import { X } from "lucide-react";

export default function PricingSection() {
  const [isOpen, setIsOpen] = useState(true); // modal opens on load
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
  };

  return (
    <div className="max-w-7xl mx-auto md:px-0">
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm relative shadow-xl text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center mb-4">
              <div className="text-orange-500 bg-orange-100 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">
              <strong>Members with Free Package</strong> can apply for{" "}
              <strong>2 scholarships only</strong>. To apply for more and get
              help with SOPs, CVs, documents, and expert advice, check out our
              affordable plans.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find your perfect plan
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Subscribe to our services and explore the right scholarship plan
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="w-full lg:px-6">
        {/* Desktop View */}
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

        {/* Mobile View */}
        <div className="lg:hidden w-full flex flex-col items-center">
          <div className="w-full max-w-sm px-2 mb-4">
            <PricingCard
              plan={plans[activeIndex]}
              onSelect={() => handleSelectPlan(plans[activeIndex].id)}
              isSelected={selectedPlan === plans[activeIndex].id}
            />
          </div>

          {/* Navigation Dots */}
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

      {/* Feature Table */}
      <div>
        <FeatureComparisonTable />
      </div>
    </div>
  );
}
