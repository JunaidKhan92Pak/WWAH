import React from "react";
import Image from "next/image";
interface OverviewProps {
  overview: string;
  duration: {
    undergraduate: string;
    bachelors: string;
    masters: string;
    phd: string;
    Diploma: string,
  };
  info_link: string;
}

const Overview: React.FC<OverviewProps> = ({ overview, duration, info_link }) => {
  return (
    <div>
      <section className="mt-2">
        <div className=" mx-auto w-[90%]">
          {/* Course Overview */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 md:py-10 ">
            {/* content side */}
            <div className="w-full lg:w-1/2">
              <div className=" mx-auto leading-snug p-2">
                <h2 className="font-bold">Scholarship Overview!</h2>
                <p className="text-gray-700 mb-2">{overview}</p>
                <p className="font-bold  mb-2">Duration of the Scholarship:</p>
                <p>
                  <strong>Degree:</strong> {duration?.bachelors}
                  {duration?.masters}  {duration?.phd}{" "}
                </p>
                {/* <p>
                  <strong>Research:</strong> 6 months or 1 year
                </p> */}
                <p className="">
                  <strong>Info Link:</strong>{" "}
         {info_link && info_link.startsWith("http") ? (
  <a
    href={info_link}
    target="_blank"
    rel="noopener noreferrer"
    className="
      text-blue-600 underline hover:text-blue-800 transition
      break-words whitespace-normal
      max-w-full block text-sm
    "
  >
    {info_link}
  </a>
) : (
  <span className="font bold">Not Available</span>
)}


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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
