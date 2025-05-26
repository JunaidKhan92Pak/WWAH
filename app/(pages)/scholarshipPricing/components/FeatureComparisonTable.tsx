import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const features = [
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
    id: "interview",
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
    id: "review",
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
    name: "English Language Writing and Essay help",
    essential: false,
    pro: true,
    premium: "5 Limited Assistance",
  },
  {
    id: "free",
    name: "Free of scholarships to apply",
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 border-collapse">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left  text-gray-900 sm:pl-0 w-1/3"
            >
              <h3 className="  text-gray-900 mb-8">
                Scholarship Services
              </h3>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center  text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center">
                <span>Essential Plan</span>
                <span className="font-bold text-lg">$16</span>
                <span className="text-xs text-gray-500">per month</span>
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center relative">
                <span>Pro Plan</span>
                <span className="font-bold text-lg">$26</span>
                <span className="text-xs text-gray-500">per month</span>
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center">
                <span>Premium Plan</span>
                <span className="font-bold text-lg">$34</span>
                <span className="text-xs text-gray-500">per month</span>
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
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {feature.name}
              </td>
              <td className="px-3 py-4 text-center text-sm text-gray-500">
                {renderCell(feature.essential)}
              </td>
              <td className="px-3 py-4 text-center text-sm text-gray-500">
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
  );
}
