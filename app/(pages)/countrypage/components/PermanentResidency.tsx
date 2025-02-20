"use client";
import React, { useState } from "react";
import Image from "next/image";

const PermanentResidency = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // const toggleText = () => {
  //   setIsExpanded((prevState) => !prevState);
  // };
  return (
    <section
      className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center h-auto p-6 my-1 overflow-hidden"
      style={{
        backgroundImage: "url(&#39;/bg-usa.png')",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Content Section (50%) */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center space-y-2 sm:px-4 text-left">
        <h5>
          How to Get Permanent Residency in the United Kingdom as an
          International Student?
        </h5>
        <div className="text-[rgb(209,207,207)] space-y-3">
          <ul className="leading-relaxed">
            <li>
              • To get Permanent Residency in United Kingdom, first step is to
              obtain a Student Visa (Tier 4) to study in the UK.
            </li>
            <li>
              {" "}
              • Graduate with an undergraduate, postgraduate, or PhD degree.{" "}
            </li>
            <li>
              • Apply for a Graduate Visa. Post-study work visa valid for 2
              years (3 years for PhD). It Enables job searching or working
              without a sponsor. You Can switch to a Skilled Worker Visa during
              this time.
            </li>
            <li>
              {" "}
              • Secure a Skilled Worker Visa. The Requirements are a Job offer
              from a UK-licensed sponsor, Meet salary thresholds (£26,200/year
              or higher), Receive a Certificate of Sponsorship and is Valid for
              up to 5 years.
            </li>
            <li>
              • After Completing 5 years of continuous residence on eligible
              visas and Not more than 180 days/year absence, you will meet
              Residency requirements.
            </li>
          </ul>

          {isExpanded && (
            <>
              <ul className="leading-relaxed">
                <li>
                  {" "}
                  • Apply for Indefinite Leave to Remain (ILR). Documents needed
                  for this purpose are: Proof of 5-year continuous residence,
                  Continued employment or an eligible job, Pass the Life in the
                  UK Test and meet English language requirements and ILR grants
                  permanent residency rights.
                </li>

                <li>
                  • After 12 months of ILR, you can apply for British
                  Citizenship by Residing in the UK for 5+ years with limited
                  absences and Pass good character, English proficiency, and
                  Life in the UK tests.
                </li>
                <li>
                  • Take the Oath of Allegiance and receive your naturalization
                  certificate.
                </li>
                <li>
                  • Apply for a British Passport Submit your naturalization
                  certificate and ID to apply for a British Passport. Processing
                  time for this will be 3–6 weeks.
                </li>
              </ul>
            </>
          )}
          <p>
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-black-500 mt-0 underline underline-offset-4 font-normal cursor-pointer ml-2"
            >
              {isExpanded ? "...Read less" : "Read more..."}
            </span>
          </p>
        </div>
      </div>

      {/* Image Section (50%) */}
      <div className="relative z-10 lg:w-1/2 hidden lg:flex justify-center items-center mt-6 lg:mt-0">
        <Image
          src="/sideimg.png" // Ensure the image is in the `public` folder
          alt="Side Image"
          width={600}
          height={600}
          className="rounded-lg shadow-lg object-cover sm:w-[80%] md:w-[70%] lg:w-full max-w-[700px] overflow-hidden"
        />
      </div>
    </section>
  );
};

export default PermanentResidency;
