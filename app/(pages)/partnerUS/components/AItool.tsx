import React from "react";
import Image from "next/image";

function AItool() {
  return (
    <div className="flex flex-col items-center w-full my-5 sm:my-12">
      {/* Header Section */}
      <div className="text-center mb-10 w-[85%] md:w-[80%]">
        <h1 className=" font-bold text-gray-800 mb-4">
          AI-Driven Partner Success!
        </h1>
        <p className=" text-gray-600 text-justify sm:text-center">
          <span className="text-red-500 font-semibold">Meet Zeus</span>, our
          cutting-edge AI-powered tool designed to revolutionize the way
          partners connect with students and streamline the recruitment process.
          With its advanced algorithms and data-driven insights, Zeus offers
          personalized university matching for students, ensuring that they find
          the perfect fit for their academic and career aspirations.
        </p>
      </div>

      {/* Content Section */}
      <div className="w-[85%] md:w-[90%]">
        {/* Features Section */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-0 justify-between items-center">
          {/* Left Side Features */}
          <div className="w-full lg:w-[26%] gap-5 md:gap-0 lg:gap-10 flex flex-col justify-between">
            {/* Feature 1 */}
            <div>
              <div className="headingAndIcon flex gap-1 items-center">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src="/partnerUs/AI-F1-Icon.svg"
                    alt="Centralized Application Management Icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h6 className="font-semibold   text-gray-800 mb-2">
                  Centralized Application Management
                </h6>
              </div>
              <p className="text-gray-600 leading-tight">
                Zeus allows students to submit a single application that can be
                tailored to multiple universities. Students only need to fill
                out their information once and make necessary adjustments for
                specific institutions.
              </p>
            </div>
            {/* Feature 2 */}
            <div>
              <div className="headingAndIcon flex gap-1 items-center">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src="/partnerUs/AI-F2-Icon.svg"
                    alt="Comprehensive Support Icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h6 className="font-semibold   text-gray-800 mb-2">
                  Comprehensive Support
                </h6>
              </div>
              <p className="text-gray-600 leading-tight">
                Zeus provides round-the-clock assistance, answering student
                queries and guiding them through the application process,
                reducing dropout rates and enhancing the overall experience.
              </p>
            </div>
          </div>
          {/* Central Image */}
          <div className="hidden lg:flex justify-center items-center lg:w-[40%] ">
            <Image
              src="/arrowleftp.png"
              alt="Zeus Robot and Arrows"
              width={0}
              height={0}
              sizes="45vw"
              className="w-[200px] h-auto"
            />
            <div className="flex justify-center mb-10">
              <Image
                src="/3@3x.png"
                alt="Zeus Robot and Arrows"
                width={0}
                height={0}
                sizes="45vw"
                className="w-[220px] h-auto"
              />
            </div>
            <Image
              src="/arrowrightp.png"
              alt="Zeus Robot and Arrows"
              width={0}
              height={0}
              sizes="45vw"
              className="w-[190px] h-auto"
            />
          </div>
          {/* Right Side Features */}
          <div className=" w-full lg:w-[25%] gap-5 md:gap-0 lg:gap-10 flex flex-col justify-between">
            {/* Feature 3 */}
            <div>
              <div className="headingAndIcon flex gap-1 items-center">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src="/partnerUs/AI-F3-Icon.svg"
                    alt="Personalized Student Icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h6 className="font-semibold   text-gray-800 mb-2">
                  Personalized Student Matching
                </h6>
              </div>
              <p className="text-gray-600 leading-tight">
                Zeus analyzes individual student profiles to recommend the most
                suitable universities, enhancing engagement and increasing
                application conversions for our partners.
              </p>
            </div>
            {/* Feature 4 */}
            <div>
              <div className="headingAndIcon flex gap-1 items-center">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src="/partnerUs/AI-F4-Icon.svg"
                    alt="Document Management Icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h6 className="font-semibold   text-gray-800 mb-2">
                  Document Management
                </h6>
              </div>

              <p className="text-gray-600 leading-tight">
                Our streamlined document management system allows partners and
                students to keep track of necessary application materials
                effortlessly, ensuring a smooth application journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AItool;
