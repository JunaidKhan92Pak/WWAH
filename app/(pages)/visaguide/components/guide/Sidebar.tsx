import React from "react";
import choose from "../../../../../public/visaguide/choose.svg";
import accommodation from "../../../../../public/visaguide/accommodation.svg";
import desicion from "../../../../../public/visaguide/decision.svg";
import fee from "../../../../../public/visaguide/fee.svg";
import interview from "../../../../../public/visaguide/interview.svg";
import offer from "../../../../../public/visaguide/offer.svg";
import process from "../../../../../public/visaguide/process.svg";
import recieve from "../../../../../public/visaguide/recieve.svg";
import register from "../../../../../public/visaguide/register.svg";
import submit from "../../../../../public/visaguide/submit.svg";
import track from "../../../../../public/visaguide/track.svg";

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
// const handleScroll = (id: number) => {
//   const target = document.getElementById(id.toString());
//   if (target) {
//     const offset = 65; // Adjust this value based on your layout
//     const targetPosition = target.getBoundingClientRect().top + window.scrollY;
//     window.scrollTo({ top: targetPosition - offset, behavior: "smooth" });
//   }
// };

// const handleScroll = (id: number) => {
//   const rightSection = document.getElementById("right-section");
//   const target = document.getElementById(id.toString());

//   if (rightSection && target) {
//     rightSection.scrollTo({
//       top: target.offsetTop - rightSection.offsetTop,
//       behavior: "smooth",
//     });
//   }
// };

const handleScroll = (id: number) => {
  const rightSection = document.getElementById("right-section");
  const target = document.getElementById(id.toString());

  if (rightSection && target) {
    const offset = 20; // Adjust this value based on your design

    rightSection.scrollTo({
      top: target.offsetTop - rightSection.offsetTop - offset,
      behavior: "smooth",
    });
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeStep, onStepClick }) => {
  return (
    <div className="w-full overflow-auto">
      <ul>
        {steps.map((step, index) => (
          <li key={step.id} className="cursor-pointer rounded">
            <div
              className={`cursor-pointer flex items-center gap-4 p-3 ${
                step.id === activeStep ? "bg-[#C7161E] text-white" : "bg-white"
              }`}
              onClick={() => {
                onStepClick(step.id);
                handleScroll(step.id);

                // const target = document.getElementById(step.id.toString());
                // target?.scrollIntoView({ behavior: "smooth", block: "start" });
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
