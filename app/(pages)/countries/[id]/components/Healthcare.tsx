"use client";
import React, { useState } from "react";
import Image from "next/image";
interface HealthcareProps {
  health: { name: string; description: string[] }[];
  countryName: string;
}

const Healthcare: React.FC<HealthcareProps> = ({ health, countryName }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <section className="bg-gray-50 py-4 lg:pt-6 w-full">
        <div className="w-[90%] mx-auto">
          <div className="lg:w-4/5 mx-auto">
            <h2 className="lg:w-4/5 mx-auto text-gray-800 text-center mb-4 md:mb-8">
              Healthcare & Safety Facilities in {countryName}!{" "}
            </h2>
          </div>

          {/* row 1 */}
          <div className="flex flex-col gap-5 ">
            <div className="flex flex-col md:flex-row items-center gap-5 ">
              {/* Image Section */}

              {/* Text Section */}
              <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8">
                <h3 className=" text-gray-900 mb-2">
                  {/* National Health Service (NHS) */}
                  {health ? health[0].name : "nill"}
                </h3>
                <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                  {health ? health[0].description : "nill"}
                </p>
              </div>
              <div className="w-full md:w-[50%] rounded-2xl">
                <Image
                  src="/carehealth.png"
                  alt="Missionicon"
                  width={400}
                  height={297}
                  className="w-full rounded-3xl"
                />
              </div>
            </div>
            {/* row 2 */}
            <div className="flex items-start flex-col-reverse md:flex-row  gap-5 ">
              {/* Text Section */}

              {/* Image Section */}
              <div className="w-full md:w-[50%]">
                <Image
                  src="/healthcare.png"
                  alt="visionicon"
                  className="w-full rounded-3xl"
                  width={400}
                  height={297}
                />
              </div>
              {/* <div className="text-center md:text-left w-full md:w-[50%] ">
                {health?.slice(1).map((item, index) => (
                  <div key={index}>
                    <h3 className="text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                      {item.description ? (
                        <ul className="list-disc pl-5">
                          {item.description.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div> */}
              <div className="text-left w-full md:w-[50%]">
                {/* First Item (Visible by Default) */}
                <div>
                  {/* <h3 className="text-gray-900 mb-2">{health[1].name}</h3> */}
                  <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                    {/* {health[1].description ? (
                      <ul className="list-disc pl-5">
                        {health[1].description.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    ) : null} */}
                  </p>
                </div>

                {/* Read More Section */}
                {health?.length > 2 && (
                  <>
                    {/* Always show health[1] */}
                    <div className="md:mt-4 mt-2">
                      <h3 className="text-gray-900 mb-2 px-4 md:px-0">
                        {health[1].name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                        {health[1].description && (
                          <ul className="list-disc pl-5">
                            {health[1].description.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        )}
                      </p>
                    </div>

                    {/* Show items from health[2] onwards only when showMore is true */}
                    {health.length > 2 && (
                      <>
                        {!showMore && (
                          <button
                            onClick={() => setShowMore(true)}
                            // className="text-blue-600 hover:underline mt-2 block"
                            className="text-red-600 font-semibold underline hover:font-bold underline-offset-4 cursor-pointer ml-2"
                          >
                            Read more...
                          </button>
                        )}

                        {showMore &&
                          health.slice(2).map((item, index) => (
                            <div key={index + 2} className="mt-4">
                              <h3 className="text-gray-900 mb-2">
                                {item.name}
                              </h3>
                              <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                                {item.description && (
                                  <ul className="list-disc pl-5">
                                    {item.description.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                )}
                              </p>
                            </div>
                          ))}

                        {showMore && (
                          <button
                            onClick={() => setShowMore(false)}
                            className="text-red-600 font-semibold underline hover:font-bold underline-offset-4 cursor-pointer ml-2"
                          >
                            Show less
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Healthcare;
{/* <Healthcare health={country.health} countryName={country?.country_name} /> */ }
