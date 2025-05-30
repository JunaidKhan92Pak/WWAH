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
    <Card
      className=
        "relative flex flex-col justify-between h-full transition-all duration-200 cursor-pointer"
    >

      <CardHeader className={cn("pt-8", isHighlighted && "pt-10")}>
        <div className="text-left">
          <span className=" text-3xl font-bold text-gray-900">{plan.name}</span>
          <p className="text-base">{plan.subHeading}</p>
          <div className="mt-4 flex items-start justify-left">
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
        </div>
        <Button
          className={cn(
            "w-full font-medium",
            isHighlighted
              ? "bg-red-700 text-white hover:bg-red-700"
              : "bg-white text-red-700 hover:bg-transparent border-2 border-red-700 "
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          Buy now
        </Button>
      </CardHeader>

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
