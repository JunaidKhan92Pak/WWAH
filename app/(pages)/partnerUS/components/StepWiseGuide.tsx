import React from "react";
import Image from "next/image";

function StepWiseGuide() {
  return (
    <div className="bg-white w-[90%] xl:w-[80%] mx-auto my-5 sm:my-12">
      {/* Heading Section */}
      <div className="w-full flex flex-col md:flex-row justify-between md:gap-4">
        <div className="w-full">
          <h2 className=" text-gray-800">Partnering with WWAH!</h2>
          <p className=" text-gray-600 md:mb-8">(Step to Get Started)</p>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <span className="w-[1px] hidden md:block md:h-20 xl:h-16 bg-gray-500"></span>
            <p className="w-full mb-2 md:mb-0">
              We believe that collaboration is key to expanding opportunities for
              students and partners alike. Sign up to our Partner Portal to explore
              collaboration opportunities and access resources tailored for partners. Join
              our network of partners by following these simple steps:
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 relative">
        {/* Left Column */}
        <div className="leftCol flex flex-row gap-4 relative">
          {/* Left Divider Image */}
          <div
            className="dividerImg hidden md:flex items-center"
            style={{
              height: "100%", 
            }}
          >
            <Image
              src="/partnershipLeftDivider.png"
              alt="divider"
              width={50}
              height={100}
              className="h-full object-cover"

            />
          </div>
          <div className="space-y-4 md:space-y-20">
            <div className="flex items-start space-x-4">
              <span className="block md:hidden">-</span>
              <p className="text-gray-700 leading-tight">
                Sign up to our Partner Portal and fill out our online
                partnership application form, providing essential details about
                your organization, expertise, and how you envision collaborating
                with us.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="block md:hidden">-</span>
              <p className="text-gray-700 leading-tight">
                Once we receive your application, our team will conduct a
                preliminary assessment to understand your goals and alignment
                with our mission.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="block md:hidden">-</span>
              <p className="text-gray-700 leading-tight">
                If your application is successful, we will schedule a meeting to
                discuss partnership details, expectations, and potential
                collaboration strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="rightCol flex flex-row gap-4">
          {/* Right Divider Image */}
          <div
            className="dividerImg hidden md:flex items-center"
            style={{
              height: "68%",
            }}
          >
            <Image
              src="/partnershipRightDivider.png"
              alt="divider"
              width={100}
              height={100}
              className="h-full object-cover"
            />
          </div>
          <div className="space-y-4 md:space-y-16 ">
            <div className="flex items-start space-x-4">
              <span className="block md:hidden">-</span>
              <p className="text-gray-700 leading-tight">
                Upon agreement, our team will provide training and resources to
                help you effectively use our platform and tools, ensuring a
                smooth integration into the WWAH network.If your application is successful, we will schedule a meeting to discuss partnership
                details, expectations, and potential collaboration strategies.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="block md:hidden">-</span>
              <p className="text-gray-700 leading-tight">
                Take advantage of our networking events, webinars, and workshops
                designed to foster collaboration among partners and enhance
                recruitment strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepWiseGuide;
