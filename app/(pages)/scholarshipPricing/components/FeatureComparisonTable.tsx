"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const features = [
  {
    id: "sop",
    name: "SOP/CV/Creative Portfolio",
    essential: "Template & Review",
    pro: "Formatting & Expert Review",
    premium: "Built from scratch, unlimited changes",
  },
  {
    id: "checklist",
    name: "Checklist of University Application Docs",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "docsPrep",
    name: "University Application Docs Prep",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "uniInterview",
    name: "University Interview Prep",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "uniMock",
    name: "University Mock Interviews",
    essential: false,
    pro: "1 Mock Interview",
    premium: "3 Mock Interviews",
  },
  {
    id: "embChecklist",
    name: "Embassy Documents Checklist",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "embDocs",
    name: "Embassy Documents Prep Guidance",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "embBook",
    name: "Embassy Appointment Booking Support (if slots available)",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "embInterview",
    name: "Embassy Interview Prep",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "embMock",
    name: "Embassy Mock Interviews",
    essential: false,
    pro: false,
    premium: true,
  },
  {
    id: "counselling",
    name: "One-on-One Counselling Sessions",
    essential: false,
    pro: "2 Sessions",
    premium: "Unlimited Sessions",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Chat Support",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "call",
    name: "Call Support",
    essential: false,
    pro: "1 Scheduled Call",
    premium: "Priority Call Support",
  },
  {
    id: "englishGuidance",
    name: "English Language Test Guidance",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "mockTest",
    name: "English Language Test Prep with Mock Test",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "scholarships",
    name: "No. of Scholarships to Apply",
    essential: "Up to 5",
    pro: "Up to 8",
    premium: "Up to 12",
  },
  {
    id: "profile",
    name: "Profile Check & Assessment",
    essential: false,
    pro: true,
    premium: "In-depth assessment with clear roadmap",
  },
  {
    id: "zoom",
    name: "Live Zoom Sessions",
    essential: "1 Group Session",
    pro: false,
    premium: false,
  },
  {
    id: "reviewTime",
    name: "Fast Review Time",
    essential: false,
    pro: "3 Business Days",
    premium: "24 Hours Review Time",
  },
  {
    id: "thousands",
    name: "Thousands of University Scholarship Alerts",
    essential: true,
    pro: true,
    premium: true,
  },
  {
    id: "curated",
    name: "Highly Curated Application Essays",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "community",
    name: "Community Intern Help",
    essential: false,
    pro: "Value Added Service",
    premium: "Unlimited Assistance",
  },
  {
    id: "interviewGuide",
    name: "Interview Guidance/Checklist",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "reference",
    name: "Reference Letter Templates",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "guidance",
    name: "In-House Application Help",
    essential: "10 hours",
    pro: "20 hours",
    premium: "30 hours",
  },
  {
    id: "scholarshipReview",
    name: "Scholarship Review & Assistance",
    essential: false,
    pro: false,
    premium: "5 Limited Reviews",
  },
  {
    id: "application",
    name: "Full Application Support",
    essential: false,
    pro: false,
    premium: true,
  },
  {
    id: "english",
    name: "English Language Test Assistance",
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "writing",
    name: "English Language Writing and Essay Help",
    essential: false,
    pro: true,
    premium: "5 Limited Assistance",
  },
  {
    id: "free",
    name: "Free of Scholarships to Apply",
    essential: "Up to 5",
    pro: "Up to 8",
    premium: "Up to 10",
  },
  {
    id: "visa",
    name: "Visa Application Assistance",
    essential: "Family Referral",
    pro: false,
    premium: "3 Limited Applications",
  },
  {
    id: "paper",
    name: "Paper Review & Help",
    essential: false,
    pro: false,
    premium: true,
  },
];

export default function FeatureComparisonTable() {
  const [activeTab, setActiveTab] = useState<"essential" | "pro" | "premium">(
    "essential"
  );

  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }

    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <>
      <div className="hidden md:block md:px-4 lg:px-6">
        <h1 className="text-center mb-6 mt-4">Compare Plans</h1>
        <table className="min-w-full divide-y divide-gray-300 border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-2 pl-4 pr-3 text-left  text-gray-900 sm:pl-0 w-[33%]"
              >
                <h3 className="  text-gray-900 mb-8">Scholarship Services</h3>
              </th>
              <th
                scope="col"
                className="text-center text-sm font-semibold text-gray-900 w-[22%]"
              >
<div className="flex flex-col items-center border-x border-t p-3 lg:p-4 border-gray-300 rounded-t-lg bg-white max-w-sm">

                  <span className="text-xl mb-4 leading-tight whitespace-nowrap">
                    Essential Plan
                  </span>
                  <div className="flex items-start mb-4">
                    <span className="text-base md:text-lg">$</span>
                    <span className="text-4xl lg:text-5xl font-bold text-red-700">16</span>
                    <span className="text-base md:text-lg text-gray-800">
                      /year
                    </span>
                  </div>
                  <Button className="px-6 lg:px-8 bg-white text-red-700 hover:bg-red-700 hover:text-white border border-red-700">
                    Buy Now
                  </Button>
                </div>
              </th>
              <th
                scope="col"
                className="text-center text-sm font-semibold text-gray-900 w-[22%]"
              >
<div className="flex flex-col items-center border-x border-t p-3 lg:p-4 border-gray-300 rounded-t-lg bg-white max-w-sm">

                  <span className="text-xl mb-4 leading-tight whitespace-nowrap">
                    Pro Plan
                  </span>
                  <div className="flex items-start mb-4">
                    <span className="text-base md:text-lg">$</span>
                    <span className="md:text-4xl lg:text-5xl font-bold text-red-700">26</span>
                    <span className="text-base md:text-lg text-gray-800">
                      /year
                    </span>
                  </div>
                  <Button className="px-6 lg:px-8 bg-white text-red-700 hover:bg-red-700 hover:text-white border border-red-700">
                    Buy Now
                  </Button>
                </div>
              </th>
              <th
                scope="col"
                className="text-center text-sm font-semibold text-gray-900 w-[22%]"
              >
<div className="flex flex-col items-center border-x border-t p-3 lg:p-4 border-gray-300 rounded-t-lg bg-white max-w-sm">

                  <span className="text-xl mb-4 leading-tight whitespace-nowrap">
                    Premium Plan
                  </span>
                  <div className="flex items-start mb-4">
                    <span className="text-base md:text-lg">$</span>
                    <span className="text-4xl lg:text-5xl font-bold text-red-600">34</span>
                    <span className="text-base md:text-lg text-gray-800">
                      /year
                    </span>
                  </div>
                  <Button className="px-6 lg:px-8 bg-white text-red-700 hover:bg-red-700 hover:text-white border border-red-700">
                    Buy Now
                  </Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature) => (
              <tr
  key={feature.id}
  className={cn("hover:bg-gray-50 transition-colors duration-150")}
>
  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 border-r border-gray-300">
    {feature.name}
  </td>
  <td className="px-3 py-4 text-center text-sm text-gray-500 border-r border-gray-300">
    {renderCell(feature.essential)}
  </td>
  <td className="px-3 py-4 text-center text-sm text-gray-500 border-r border-gray-300">
    {renderCell(feature.pro)}
  </td>
  <td className="px-3 py-4 text-center text-sm text-gray-500">
    {renderCell(feature.premium)}
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Tab Layout */}
      <div className="md:hidden w-full mt-6 md:mt-8 px-4">
        <h1 className="text-center mb-4">Compare Plans</h1>

        {/* Tab Buttons */}
        <div className="flex justify-start gap-2 mb-4 overflow-x-auto">
          {(["essential", "pro", "premium"] as const).map((plan) => {
            const price = plan === "essential" ? 16 : plan === "pro" ? 26 : 34;

            return (
              <div
                key={plan}
                className={`w-[50%] flex-shrink-0 px-4 py-2 rounded-md border text-sm text-center ${
                  activeTab === plan
                    ? "bg-red-600 text-white border-gray-600"
                    : "bg-white text-gray-700 border-gray-600"
                }`}
              >
                <button onClick={() => setActiveTab(plan)} className="w-full">
                  <div className="font-semibold">
                    {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                  </div>
                  <div className="flex justify-center items-center mb-1 gap-1">
                    <span className="text-base">$</span>
                    <span className="text-lg font-bold">{price}</span>
                    <span className="text-sm">/year</span>
                  </div>
                </button>

                <button
                  className={`px-2 py-1  text-sm rounded border ${
                    activeTab === plan
                         ? "bg-white text-red-600 border-white"
              : "bg-red-600 text-white border-red-600"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Active Plan Details */}
       <div className="rounded-lg border border-gray-200">
  <h4 className="text-center text-gray-900 my-4">Scholarship Services</h4>

  <div className="overflow-x-auto">
    <table className="min-w-full  text-sm">
      <tbody>
        {features.map((feature) => (
          <tr key={feature.id} className="border-b border-gray-200">
            <td className="w-[60%] px-3 py-3 border-r border-gray-200 text-gray-700 align-top">
              {feature.name}
            </td>
            <td className="w-[40%] py-3 text-center">
              {renderCell(feature[activeTab])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </>
  );
}
