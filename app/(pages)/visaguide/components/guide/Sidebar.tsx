import React from "react";
import choose from "../../../../../public/visaguide/choose.png";
import accommodation from "../../../../../public/visaguide/accommodation.png";
import desicion from "../../../../../public/visaguide/decision.png";
import fee from "../../../../../public/visaguide/fee.png";
import interview from "../../../../../public/visaguide/interview.png";
import offer from "../../../../../public/visaguide/offer.png";
import process from "../../../../../public/visaguide/process.png";
import recieve from "../../../../../public/visaguide/recieve.png";
import register from "../../../../../public/visaguide/register.png";
import submit from "../../../../../public/visaguide/submit.png";
import track from "../../../../../public/visaguide/track.png";

import Image from "next/image";

type SidebarProps = {
  activeStep: number;
  onStepClick: (id: number) => void;
};

export const steps = [
  {
    id: 1,
    icon: choose,
    title: "Choose your Program",
    content:
      "Choose the program and University you are interested in. Find out the Programs of your choice.",
    cta: "Get personalized guidance from ZEUS",
  },
  {
    id: 2,
    icon: register,
    title: "Register & Apply",
    content:
      "Click on Apply Now after creating your personalized profile through a registered account.",
  },
  {
    id: 3,
    icon: fee,
    title: "Pay the Application Fee",
  },
  {
    id: 4,
    icon: track,
    title: "Track Your Application ",
  },
  {
    id: 5,
    icon: offer,
    title: "Accept your offer",
  },
  {
    id: 6,
    icon: interview,
    title: "Online Interview",
  },
  {
    id: 7,
    icon: process,
    title: "Visa Application Process",
  },
  {
    id: 8,
    icon: submit,
    title: "Submit Your Application",
  },
  {
    id: 9,
    icon: desicion,
    title: "Await a Desicion",
  },
  {
    id: 10,
    icon: recieve,
    title: "Recieve Your Visa",
  },
  {
    id: 11,
    icon: accommodation,
    title: "Accommodation",
  },
  {
    id: 12,
    icon: accommodation,
    title: "Prepare for Arrival",
  },
  {
    id: 13,
    icon: accommodation,
    title: "Post Arrival process",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeStep, onStepClick }) => {
  return (
    <div className="w-full overflow-auto">
      <ul>
        {steps.map((step, index) => (
          <li key={step.id} className="cursor-pointer rounded">
            <div
              className={`cursor-pointer flex items-center justify-evenly lg:gap-4 lg:p-3 ${
                step.id === activeStep ? "bg-[#C7161E] text-white" : "bg-white"
              }`}
              onClick={() => {
                onStepClick(step.id);
                const target = document.getElementById(step.id.toString());
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Image
                src={step.icon}
                alt={step.title}
                width={30}
                height={30}
                className="object-contain md:w-[40px]"
              />
              <p className="w-[50%]">{step.title}</p>
            </div>
            {index !== steps.length - 1 && <hr />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
