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
        <div className=" mx-auto w-[90%]">
          {/* Course Overview */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 md:py-10">
            {/* content side */}
            <div className="w-full lg:w-1/2">
              <div className=" mx-auto leading-snug">
                <h2 className="font-bold">Course Overview!</h2>
                <p className="text-gray-700 mb-2">{overview}</p>

                <p className="font-bold  mb-2">Duration of the Scholarship:</p>
                <p>
                  <strong>Degree:</strong> {duration?.undergraduate},
                  {duration?.master} , {duration?.phd}{" "}
                </p>
                <p>
                  <strong>Research:</strong> 6 months or 1 year
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2  md:block hidden">
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
