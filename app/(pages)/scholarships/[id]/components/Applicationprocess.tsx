import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import Banner from "@/components/ui/enrollment/Banner";
import { useScholarships } from "@/store/useScholarships";
interface ReadMoreProps {
  children: React.ReactNode;
}
const ReadMore: React.FC<ReadMoreProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className={`${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}>
        {children}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-red-500 underline underline-offset-4 font-normal hover:font-semibold my-2"
      >
        {isExpanded ? "Show Less" : "Read More..."}
      </button>
    </div>
  );
};
const Applicationprocess = () => {
  const {
    scholarships,
    fetchScholarships,
    // New setter
  } = useScholarships();
  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);
  // const sliderData = [
  //   {
  //     src: "/scholarshipdetail/slideee.png",
  //     title: "University of Oxford",
  //   },
  //   {
  //     src: "/scholarshipdetail/slideee.png",
  //     title: "University of Oxford",
  //   },
  //   {
  //     src: "/scholarshipdetail/slideee.png",
  //     title: "University of Oxford",
  //   },
  // ];
  return (
    <div>
      <section className="container mx-auto p-2 md:p-6 w-[90%]">
        <h2 className="md:mb-6 my-2 text-center font-bold">
          Application Process!
        </h2>
        <div className="flex flex-col lg:flex-row">
          <div className="md:space-y-3">
            {/* Step 1 */}
            <div>
              <h6 className="font-bold">Create an Account</h6>
              <p className="text-gray-700 mt-1">
                Click on{" "}
                <Link
                  href="/dashboard/overview"
                  className="text-red-500 hover:underline font-semibold"
                >
                  Apply Now
                </Link>{" "}
                after creating your personalized profile through a registered
                account. You can monitor your applications and receive regular
                updates.{" "}
                <Link
                  href="/signin"
                  className="text-red-500 hover:underline font-semibold"
                >
                  Register here.
                </Link>
              </p>
            </div>
            {/* Step 2 */}
            <div>
              <h6 className="mt-1 font-bold">Submit Your Application</h6>
              <p className="text-gray-700 mt-1">
                Complete your Personal and Educational details. Upload your
                documents and doublecheck all information before submission.
              </p>
            </div>
            {/* Step 3 */}
            <div>
              <h6 className="mt-1 font-bold">
                Pay the Application Fee (If required)
              </h6>
              <p className="text-gray-700 mt-1">
                Make sure to pay the application fee (if applicable) to finalize
                your submission. Payment can be made easily directly to the
                university through bank, money exchangers, online apps and WWAH
                secure online payment system.
              </p>
            </div>
            <ReadMore>
              {/* Step 4 */}
              <div>
                <h6 className="mt-1 font-bold">Track Your Application</h6>
                <p className="text-gray-700 mt-1">
                  Once your application is submitted, you can monitor its
                  progress through your personalized WWAH dashboard. Stay
                  informed with real-time updates and notifications.
                </p>
              </div>
              <div>
                <h6 className="mt-1 font-bold">Receive Your Offer Letter</h6>
                <p className="text-gray-700 mt-1">
                  If your application is successful, you&#39;ll receive an offer
                  letter from the university. Review the offer carefully and
                  accept it through our portal
                </p>
              </div>
              <div>
                <h6 className="mt-1 font-bold">Apply for a Visa</h6>
                <p className="text-gray-700 mt-1">
                  Once you&#39;ve accepted an offer and received your visa
                  letter, start the visa application process. We&#39;ll provide
                  guidance and resources to help you secure your student visa.{" "}
                </p>
              </div>
              <div>
                <h6 className="mt-1 font-bold">Plan Your Arrival</h6>
                <p className="text-gray-700 mt-1">
                  After your visa is approved, begin planning your journey. WWAH
                  offers tips on accommodation, travel, and settling into your
                  new environment.
                </p>
              </div>
              <div>
                <h6 className="mt-1 font-bold">Begin Your Academic Journey</h6>
                <p className="text-gray-700 mt-1">
                  Congratulations! You&#39;re all set to start your studies
                  abroad. Stay connected with WWAH team throughout your academic
                  journey for any assistance{" "}
                </p>
              </div>
            </ReadMore>
          </div>
        </div>
      </section>
      {/* <section
        className="relative my-5 text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:flex-row w-full py-9 md:px-12 lg:gap-10  sm:gap-0 gap-5">
          <div className="relative w-full md:w-1/2">
            <h6 className="text-[#313131] md:text-left text-center font-bold px-2">
              Schedules a free session with WWAH advisor to discuss eligibility
              or applications.{" "}
            </h6>
          </div>
          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
              {" "}
              Book a Free counselling session{" "}
            </Button>
          </div>
        </div>
      </section> */}
      <Banner
        title=" Schedules a free session with WWAH advisor to discuss eligibility
              or applications."
        buttonText="Book a Free counselling session!"
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
      <section className="relative flex flex-col lg:flex-row gap-2 items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

        <div className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center md:space-y-2 sm:px-4 text-left">
          <h4 className="">Explore More Scholarships!</h4>
          <p className="text-[#9D9D9D] leading-relaxed">
            Discover a range of scholarship opportunities from across the globe!
            Whether you&apos;re aiming to study in the United States, Europe, or
            beyond, there are countless scholarships designed to support your
            academic journey. These scholarships can help you access world-class
            education without financial barriers.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
          <div className="relative w-full flex justify-center overflow-hidden">
            <div
              className="flex overflow-x-auto hide-scrollbar gap-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {scholarships.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="relative w-[85%]  flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={"/uniar.svg"}
                    alt="University Image"
                    width={380}
                    height={350}
                    objectFit="cover"
                    className="rounded-xl w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 w-full  text-white px-4 py-3">
                    <p className="font-semibold mb-2"> {item.name}</p>
                    <p className=" flex items-center gap-1">
                      <Image
                        src="/location-white.svg"
                        alt="locationwhite"
                        width={100}
                        height={100}
                        className="w-4 h-4"
                      />
                      {/* {item.universityName} */}
                      {item.hostCountry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Applicationprocess;