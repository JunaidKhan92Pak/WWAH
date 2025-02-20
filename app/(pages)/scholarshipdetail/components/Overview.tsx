import React from "react";
import Image from "next/image";
const Overview = () => {
  
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
                <p className="text-gray-700 mb-2">
                  Applications for the Inje University 2024 Global Korea
                  Scholarship are now being accepted. International students are
                  welcome to apply for the 2024 Inje University GKS Scholarship.
                  It is a South Korean private university located in Gimhae. The
                  Inje University GKS Scholarship 2024 is offered for Research,
                  Master&apos;s, and Doctoral programs. Along with the degree
                  programs, a year of Korean language instruction is included.
                </p>
                <p className="text-gray-700  mb-2">
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
                </p>
                <p className="font-bold  mb-2">Duration of the Scholarship:</p>
                <p><strong>Degree:</strong> 1 Year Korean Language + Masters (2 Years), Doctoral (3 Years)</p>
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
