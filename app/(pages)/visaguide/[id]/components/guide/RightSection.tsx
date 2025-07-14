import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

// Update your interfaces in both files
interface StepSection {
  heading: string;
  points: string[];
  icon?: string; // Optional for custom icons
}
interface Faq {
  question: string;
  answer: string;
}
interface DataType {
  _id: string;
  country_id: string;
  country_name: string;
  faqs: Faq[];
  steps: StepSection[]; // Replace all hardcoded fields with this
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export const RightSection = ({ data }: { data: DataType }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Default icons mapping (you can customize this)
  const getStepIcon = (index: number, customIcon?: string) => {
    if (customIcon) return customIcon;

    const defaultIcons = [
      "/visaguide/choose.svg",
      "/visaguide/register.svg",
      "/visaguide/submit.svg",
      "/visaguide/fee.svg",
      "/visaguide/process.svg",
      "/visaguide/submit.svg",
      "/visaguide/track.svg",
      "/visaguide/recieve.svg",
      "/visaguide/accommodation.svg",
      "/visaguide/recieve.svg",
      "/visaguide/process.svg",
    ];

    return defaultIcons[index] || "/visaguide/choose.svg";
  };

  // Special sections that need custom styling/content
  const renderSpecialContent = (stepIndex: number, step: StepSection) => {
    // Add custom content for specific steps
    if (step.heading.toLowerCase().includes("program") || stepIndex === 0) {
      return (
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="md:w-1/2">
            <p className="font-semibold">
              Not sure which Program or University is right for you?
            </p>
          </div>
          <div className="md:w-1/2 flex md:justify-end justify-center items-center">
            <Link href="/dashboard">
              <button className="bg-[#C7161E] text-xs md:text-sm 2xl:text-xl text-white rounded-lg p-3">
                Get in touch with WWAH advisor
              </button>
            </Link>
          </div>
        </div>
      );
    }

    if (
      step.heading.toLowerCase().includes("visa application") ||
      step.heading.toLowerCase().includes("process")
    ) {
      return (
        <>
          {/* <div className="flex justify-end mt-4">
            <p className="md:w-[55%] p-6 rounded-2xl bg-[#FCE7D2]">
              Prepare the necessary documents mentioned in the required
              documents section of your desired course page.
            </p>
          </div> */}
          <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
            <div>
              <p className="font-semibold">
                If you need any help with your embassy process, Contact with{" "}
                <Link
                  target="blank"
                  href="/dashboard"
                  className="text-[#F0851D] underline font-bold"
                >
                  WWAH advisor
                </Link>{" "}
                and get a quick reply!
              </p>
            </div>
          </div>
        </>
      );
    }

    if (step.heading.toLowerCase().includes("accommodation")) {
      return (
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-end my-4 gap-2">
          <div className="md:w-1/2">
            <p className="font-semibold">
              To find the right Accommodation for you
            </p>
          </div>

          <div className="md:w-1/2 flex md:justify-end justify-center items-center">
            <Link href="/dashboard">
              <button className="bg-[#C7161E] text-xs md:text-sm 2xl:text-xl text-white rounded-lg p-3">
                Get in touch with WWAH advisor
              </button>
            </Link>
          </div>
        </div>
      );
    }

    if (
      step.heading.toLowerCase().includes("arrival") ||
      step.heading.toLowerCase().includes("prepare")
    ) {
      return (
        <div className="flex md:flex-row flex-col bg-[#F1F1F1] p-4 rounded-2xl w-full justify-center my-4 gap-2">
          <div>
            <p className="font-semibold">
              <Link
                target="blank"
                href="/dashboard"
                className="text-[#C7161E] underline font-bold"
              >
                Reach out to your WWAH Advisor
              </Link>{" "}
              to organize your travel arrangements.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div id="right-section" className="py-4 px-4">
      {data.steps.map((step, index) => (
        <div key={index}>
          <div id={`${index + 1}`} className="pb-4" ref={targetRef}>
            <div className="flex items-center gap-4 p-3">
              <Image
                src={getStepIcon(index, step.icon)}
                alt={step.heading}
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="font-bold">{step.heading}</p>
            </div>

            <div className="space-y-2">
              {step.points.map((point, pointIndex) => (
                <div
                  key={pointIndex}
                  className="prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium hover:[&_a]:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: point }}
                />
              ))}
            </div>

            {renderSpecialContent(index, step)}
          </div>

          {/* Add hr except for last item */}
          {index < data.steps.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};
