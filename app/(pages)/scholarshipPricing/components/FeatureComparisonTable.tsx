import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const features = [
  {
    id: "sop",
    name: "SOP/CV/Creative Portfolio",
    essential: true,
    pro: true,
    premium: true,
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
    essential: false,
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
    essential: false,
    pro: true,
    premium: true,
  },
  {
    id: "embInterview",
    name: "Embassy Interview Prep",
    essential: false,
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
    essential: true,
    pro: true,
    premium: true,
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
    <div className="overflow-x-auto ">
      <table className="min-w-full divide-y divide-gray-300 border-collapse">
        <thead>
          <tr>
            <th
              scope="col"
              className=" pl-4 pr-3 text-left  text-gray-900 sm:pl-0 w-1/3"
            >
              <h3 className="  text-gray-900 mb-8">Scholarship Services</h3>
            </th>
            <th
              scope="col"
              className="px-3  text-center  text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center border-x-2 border-t-2 p-2 border-gray-300 rounded-t-lg bg-white max-w-sm">
                <span className="text-xl mb-4 leading-tight whitespace-nowrap">Essential Plan</span>
                <div className="flex items-start mb-4">
                  <span className="text-base md:text-lg">$</span>
                  <span className="text-3xl md:text-5xl font-bold ">16</span>
                  <span className="text-base md:text-lg text-gray-500">/year</span>
                </div>
                <Button className="border-red-700 bg-white hover:bg-transparent text-red-700 px-6 py-2 rounded border ">
                  Buy Now
                </Button>
              </div>
            </th>
            <th
              scope="col"
              className="px-3  text-center text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center border-x-2 border-t-2 p-2 border-gray-300 rounded-t-lg bg-white max-w-sm">
                <span className="text-xl mb-4 leading-tight whitespace-nowrap">Pro Plan</span>
                <div className="flex items-start mb-4">
                  <span className="text-base md:text-lg">$</span>
                  <span className="text-3xl md:text-5xl font-bold ">26</span>
                  <span className="text-base md:text-lg text-gray-500">/year</span>
                </div>
                <Button className="bg-red-700   text-white px-6 py-2 rounded border ">
                  Buy Now
                </Button>
              </div>
            </th>
            <th
              scope="col"
              className="px-3  text-center text-sm font-semibold text-gray-900 w-1/5"
            >
              <div className="flex flex-col items-center border-x-2 border-t-2 p-2 border-gray-300 rounded-t-lg bg-white max-w-sm">
                <span className="text-xl mb-4 leading-tight whitespace-nowrap">Premium Plan</span>
                <div className="flex items-start mb-4">
                  <span className="text-base md:text-lg">$</span>
                  <span className="text-3xl md:text-5xl font-bold ">34</span>
                  <span className="text-base md:text-lg text-gray-500">/year</span>
                </div>
                <Button className="border-red-700 bg-white hover:bg-transparent text-red-700 px-6 py-2 rounded border ">
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
