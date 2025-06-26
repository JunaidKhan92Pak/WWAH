"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// interface PlanFeature {
//   text: string;
// }

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    subHeading: string;
    price: number;
    isPopular: boolean;
    features: string[];
  };
  onSelect: () => void;
  isSelected: boolean;
}

export default function PricingCard({
  plan,
  onSelect,
  isSelected,
}: PricingCardProps) {
  const isHighlighted = isSelected || plan.isPopular;

  return (
    <Card className="relative flex flex-col justify-between h-full transition-all duration-200 cursor-pointer">
      <div className="flex flex-col justify-between min-h-[260px]">
        {" "}
        {/* Make sure all cards have same height */}
        <CardHeader
          className={cn("pt-4 lg:pt-6 pb-6 flex flex-col justify-between flex-1")}
        >
          {/* Top content */}
          <div className="text-left flex flex-col gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {plan.name}
            </span>
            <p className="text-lg text-gray-700">{plan.subHeading}</p>
          </div>

          {/* Price section - fixed height for alignment */}
          <div className="mt-4 min-h-[50px] flex items-center">
            <span className="text-3xl pr-1 font-bold tracking-tight text-gray-900">
              $
            </span>
            <span className="text-5xl font-bold tracking-tight text-red-700">
              {plan.price}
            </span>
            <span className="ml-1 text-2xl font-medium text-gray-500">
              /year
            </span>
          </div>

          {/* Button - always at bottom */}
          <Button
            className={cn(
              "w-full font-semibold mt-6 transition-colors duration-300",
              isHighlighted
                ? "bg-white text-red-700 hover:bg-red-700 hover:text-white border-2 border-red-700"
                : "bg-white text-red-700 hover:bg-red-700 hover:text-white border-2 border-red-700"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Buy now
          </Button>
        </CardHeader>
      </div>

      <CardContent className="flex-grow">
        <h4>Main Services:</h4>
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>

              <span className="ml-3 text-base text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-8"></CardFooter>
    </Card>
  );
}
