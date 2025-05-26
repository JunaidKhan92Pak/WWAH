"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// interface PlanFeature {
//   text: string;
// }

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: plan.id === "essential" ? 0 : plan.id === "pro" ? 0.1 : 0.2,
      }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative flex flex-col justify-between h-full transition-all duration-200 cursor-pointer",
          isHighlighted
            ? "border-2 border-red-700 shadow-lg scale-105"
            : "border border-border hover:scale-102 hover:shadow-md",
          "hover:shadow-lg"
        )}
        onClick={onSelect}
      >
        {isHighlighted && (
          <div className="absolute -top-3 inset-x-0 flex justify-center">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-700 text-white">
              {isSelected ? "Selected Plan" : "Pro Plan"}
            </span>
          </div>
        )}

        <CardHeader className={cn("pt-8", isHighlighted && "pt-10")}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
            <div className="mt-4 flex items-baseline justify-center">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                ${plan.price}
              </span>
              <span className="ml-1 text-xl font-medium text-gray-500">
                /mo
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
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

        <CardFooter className="pb-8">
          <Button
            className={cn(
              "w-full font-medium",
              isHighlighted
                ? "bg-red-700 text-white hover:bg-red-700"
                : "bg-red-700 text-white hover:bg-red-700"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Buy now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
