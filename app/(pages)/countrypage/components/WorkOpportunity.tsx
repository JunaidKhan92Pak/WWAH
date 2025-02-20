import React from "react";
import Image from "next/image";
const WorkOpportunity = () => {
  return (
    <div className="mx-auto w-full mb-10 px-4 2xl:my-20">
      <h3 className="text-center md:pt-10 py-4 font-bold">
        Work Opportunity in United Kingdom
      </h3>

      <div className="flex flex-col md:flex-row gap-5 justify-center">
        {/* Card 1 */}
        <div className="flex flex-col items-start md:items-start w-full lg:w-2/5 py-5 bg-[#F1F1F1] rounded-2xl">
          <div className="md:px-5 p-2">
            <Image src="/countrypage/diploma.png" alt="diploma" width={50} height={50} />
            <div className="mt-4 text-left">
              <h5 className="">Work while Studying</h5>
              <p className="mt-2">
                International students in the UK on a Student Visa (formerly Tier 4) are
                typically allowed to work part-time during their studies, up to 20 hours per week.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center md:items-start w-full lg:w-2/5 md:py-5 bg-[#F1F1F1] rounded-2xl">
          <div className="md:px-5 p-2">
            <Image src="/countrypage/suitecase.png" alt="suite" width={50} height={50} />

            <div className="mt-4 text-left">
              <h5>Post-Study Work Visa</h5>
              <p className="mt-2">
                After earning a bachelor&#39;s or master&#39;s degree, students are granted a two-year work
                visa. PhD holders are granted a three-year work visa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOpportunity;
