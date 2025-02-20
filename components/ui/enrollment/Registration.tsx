import Image from "next/image";

interface Step {
  icon: string;
  alt: string;
  text: string;
}

interface RegistrationProps {
  title: string;
  steps: Step[];
  feeTitle: string;
  feeDescription: string;
}

export default function Registration({
  title,
  steps,
  feeTitle,
  feeDescription,
}: RegistrationProps) {
  return (
    <section className="relative bg-black h-auto flex flex-col lg:flex-row items-center justify-center mt-12">
      {/* Background Image */}
      {/* <div className="absolute inset-0 z-0"> */}
        {/* <Image
          src="/bg-usa.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="bg-[#000000]"
        /> */}
      {/* </div>
      <div className="absolute inset-0 bg-[#000000] opacity-80 z-0"></div> */}

      {/* Content Section */}
      <div className="relative gap-6 lg:gap-14 z-10 flex flex-col lg:flex-row w-[90%] justify-center items-center lg:items-start my-7 lg:my-16 space-y-6 lg:space-y-0">
        {/* Left Side - Steps */}
        <div className="w-full lg:w-[50%] text-left flex flex-col items-center lg:items-start ">
          <h4 className=" font-bold text-white text-center lg:text-left">
            {title}
          </h4>
          <ol className="mt-2 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center">
                <Image
                  src={step.icon}
                  alt={step.alt}
                  width={30}
                  height={30}
                  className="mr-4"
                />
                <span className="text-[#9D9D9D]">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right Side - Fee Info */}
        <div className="w-full lg:w-[50%] text-left flex flex-col items-center lg:items-start">
          <h5 className=" font-bold text-white text-center lg:text-left">
            {feeTitle}
          </h5>
          <p className="text-[#9D9D9D]  mt-2 sm:mt-6 text-justify  lg:text-left ">
            {/* Replace currency values with span and color them */}
            {feeDescription.split("$").map((part, index) => {
              if (index === 0) return part; // First part before $ symbol
              return (
                <>
                  <span className="text-[#DD7378]">${part.split(" ")[0]}</span>
                  {part.substring(part.split(" ")[0].length)} {/* Remainder of the sentence */}
                </>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
