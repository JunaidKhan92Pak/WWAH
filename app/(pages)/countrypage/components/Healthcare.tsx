import React from "react";
import Image from "next/image";
const Healthcare = () => {
  return (
    <>
      <section className="bg-gray-50 py-4 lg:pt-6 w-full">
        <div className="w-[90%] mx-auto">
          <div className="lg:w-4/5 mx-auto">          
          <h2 className="lg:w-4/5 mx-auto text-gray-800 text-center mb-4 md:mb-8">
            Healthcare & Safety Facilities in United Kingdom!{" "}
          </h2></div>

          {/* row 1 */}
          <div className="flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-20">
            {/* Image Section */}

            {/* Text Section */}
            <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8">
              <h3 className=" text-gray-900 mb-2">
                National Health Service (NHS)
              </h3>
              <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                The National Health Service (NHS) is the UK&#39;s publicly funded
                healthcare system, and international students who are studying
                in the UK for more than six months have access to its services.
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
          <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-20">
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
            <div className="text-center md:text-left w-full md:w-[50%] ">
              <h3 className=" text-gray-900 mb-2">How it works:</h3>
              <p className="text-gray-700 leading-relaxed w-full lg:w-[85%]">
                Healthcare Surcharge: When applying for a student visa,
                international students are required to pay an Immigration Health
                Surcharge (IHS), which grants them access to NHS services
                throughout their stay. General Practitioner (GP): Students
                should register with a local GP (family doctor) upon arrival in
                the UK. The GP is the first point of contact for non-emergency
                medical issues, routine check-ups, and referrals to specialists.
                Read more...
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Healthcare;
