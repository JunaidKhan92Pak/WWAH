import React from "react";
import Image from "next/image";
interface OverviewProps {
  overview: string;
  duration: {
    undergraduate: string;
    master: string;
    phd: string;
  };
}

const Overview: React.FC<OverviewProps> = ({ overview, duration }) => {

  return (
    <div>
      <section className="mt-2">
        <div className=" mx-auto w-[88%]">

          {/* Course Overview */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 md:py-10">
            {/* content side */}
            <div className="w-full md:w-1/2">
              <div className=" mx-auto leading-snug">
                <h2 className="font-bold">Course Overview!</h2>
                <p className="text-gray-700 mb-2">{overview}</p>
                {/* <p className="text-gray-700  mb-2">
                  This GKS 2024 scholarship is offering programs of medicine,
                  engineering, social sciences, and humanities at INJE
                  University of Korea. In collaboration with the National
                  Institute for International Education, this scholarship seeks
                  to develop world leaders (NIIED). The scholarship guarantees a
                  comprehensive educational experience in South Korea&apos;s dynamic
                  academic environment, including research funding and health
                  insurance.
                </p>
                <p className="text-gray-700  mb-2">
                  As of March 2024, 11,090 students are enrolled. 620 of whom
                  are students from abroad. 345 employees, 937 professors, and
                  119 teaching assistants. Under the GKS scholarship programs,
                  which is run by the Korean government, 2,200 scholarships to
                  study in Korean universities will be given to foreign students
                  in 2024.
                </p> */}
                <p className="font-bold  mb-2">Duration of the Scholarship:</p>
                <p><strong>Degree:</strong>  {duration?.undergraduate},{duration?.master} , {duration?.phd} </p>
                <p><strong>Research:</strong> 6 months or 1 year</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:h-screen md:block hidden">
              <Image
                src="/imeg.png"
                alt="postgraduate"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

            <div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
