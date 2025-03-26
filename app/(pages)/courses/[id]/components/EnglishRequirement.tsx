import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface EnglishRequirementProps {
  data: {
    required_ielts_score: string;
    required_toefl_score: string;
    required_pte_score: string;
  };
}

export const EnglishRequirement: React.FC<EnglishRequirementProps> = ({
  data,
}) => {
  const requirements = [
    {
      name: "IELTS",
      link: "ilets",
      description: `${data.required_ielts_score}`,
    },
    {
      name: "TOEFL iBET",
      link: "pte",
      description: `${data.required_toefl_score}`,
    },
    {
      name: "PTE",
      link: "toefl",
      description: `${data.required_pte_score}`,
    },
  ];
  return (
    <section className="bg-black text-white p-8">
      <div className="mx-auto flex flex-col lg:flex-row gap-8">
        {/* Requirements Section */}
        <div className="flex flex-col flex-grow">
          <h3 className="mb-2 sm:mb-0">English Language Requirements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white place-content-center">
            {requirements.map((req, index) => (
              <div key={req.name} className="sm:p-6 rounded-lg">
                <h6 className="flex justify-between items-start">
                  <div>
                    {index + 1}. {req.name}
                  </div>
                </h6>
                <p className="text-gray-400 mb-4">{req.description}</p>
                <a
                  href={`/${req.link}`}
                  className="text-red-500 hover:text-red-400 underline"
                >
                  View Detail
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* Call to Action Section */}
        <div className="bg-[#2A2A2A] bg-opacity-90 border border-zinc-800 text-white p-6 rounded-2xl w-full lg:w-[70%]">
          <div className="mb-4">
            <h5>Struggling with your English Proficiency Score?</h5>
          </div>
          <div>
            <p className="text-gray-400 mb-4">
              Book your IELTS/PTE Classes with us and Start preparing Today!
            </p>
            <Link href="/form">
              <Button
                className="w-full bg-[#545454] hover:bg-zinc-700 text-white py-2 rounded"
                onClick={() => {}}
              >
                Register Now!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
