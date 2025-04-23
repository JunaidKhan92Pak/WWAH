import React from "react";
import Image from "next/image";
interface WorkOpportunityProps {
  whileStudying: string;
  afterStudying: string;
  countryName: string;
}

const WorkOpportunity: React.FC<WorkOpportunityProps> = ({
  whileStudying,
  afterStudying,
  countryName,
}) => {
  return (
    <div className="mx-auto w-full mb-10 px-4">
      <h3 className="text-center md:pt-10 py-4 font-bold">
        Work Opportunity in {countryName}
      </h3>
      <div className="flex flex-col md:flex-row gap-5 justify-center">
        {/* Card 1 */}
        <div className="flex flex-col items-start md:items-start w-full lg:w-2/5 py-5 bg-[#F1F1F1] rounded-2xl">
          <div className="md:px-5 p-2">
            <Image
              src="/countrypage/suitcase.svg"
              alt="diploma"
              width={50}
              height={50}
            />
            <div className="mt-4 text-left">
              <h5 className="">Work while Studying</h5>
              <p className="mt-2">{whileStudying}</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center md:items-start w-full lg:w-2/5 md:py-5 bg-[#F1F1F1] rounded-2xl">
          <div className="md:px-5 p-2">
            <Image
              src="/countrypage/diploma.svg"
              alt="suite"
              width={50}
              height={50}
            />

            <div className="mt-4 text-left">
              <h5>Post-Study Work Visa</h5>
              <p className="mt-2">{afterStudying}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOpportunity;
