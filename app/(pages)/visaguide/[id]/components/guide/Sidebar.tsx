import React from "react";
// import choose from ;


import Image from "next/image";

type SidebarProps = {
  activeStep: number;
  onStepClick: (id: number) => void;
};

export const steps = [
  {
    id: 1,
    icon: "/visaguide/choose.svg",
    title: "Choose your Program",
    content:
      "Choose the program and University you are interested in. Find out the Programs of your choice.",
    cta: "Get personalized guidance from ZEUS",
  },
  {
    id: 2,
    icon: "/visaguide/register.svg",
    title: "Register & Apply",
    content:
      "Click on Apply Now after creating your personalized profile through a registered account.",
  },
  {
    id: 3,
    icon: "/visaguide/fee.svg",
    title: "Pay the Application Fee",
  },
  {
    id: 4,
    icon: "/visaguide/track.svg",
    title: "Track Your Application ",
  },
  {
    id: 5,
    icon: "/visaguide/offer.svg",
    title: "Accept your offer",
  },
  {
    id: 6,
    icon: "/visaguide/interview.svg",
    title: "Online Interview",
  },
  {
    id: 7,
    icon: "/visaguide/process.svg",
    title: "Visa Application Process",
  },
  {
    id: 8,
    icon: "/visaguide/submit.svg",
    title: "Submit Your Application",
  },
  {
    id: 9,
    icon: "/visaguide/decision.svg",
    title: "Await a Desicion",
  },
  {
    id: 10,
    icon: "/visaguide/recieve.svg",
    title: "Recieve Your Visa",
  },
  {
    id: 11,
    icon: "/visaguide/accommodation.svg",
    title: "Accommodation",
  },
  {
    id: 12,
    icon: "/visaguide/accommodation.svg",
    title: "Prepare for Arrival",
  },
  {
    id: 13,
    icon: "/visaguide/accommodation.svg",
    title: "Post Arrival process",
  },
];

 
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
              className={`cursor-pointer flex items-center gap-4 p-3 ${step.id === activeStep ? "bg-[#C7161E] text-white" : "bg-white"
                }`}
              onClick={() => {
                onStepClick(step.id);
                handleScroll(step.id);

                
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
