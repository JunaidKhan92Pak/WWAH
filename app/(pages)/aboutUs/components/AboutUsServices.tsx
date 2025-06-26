"use client";

import Image from "next/image";

export default function AboutUsServices() {
  // Define the type for the state keys
  // type SectionKeys = "application" | "transportation" | "accommodation";

  // const [isExpanded, setIsExpanded] = useState<Record<SectionKeys, boolean>>({
  //   application: false,
  //   transportation: false,
  //   accommodation: false,
  // });

  // const toggleReadMore = (key: SectionKeys) => {
  //   setIsExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] mx-auto py-4 md:py-10">
      {/* Left Column */}
      <div className="leftCol flex flex-row gap-2">
        {/* Left Divider Image */}
        <div className="dividerImg hidden md:flex items-start">
          <Image
            src="/AbtUsRightDiv.svg"
            alt="divider"
            width={100}
            height={10}
            className="h-full"
          />
        </div>
        <div className="space-y-6 flex flex-col justify-normal md:justify-between">
          <div className="flex items-start space-x-2">
            <span className="block md:hidden">-</span>
            <p className="text-gray-900 leading-tight">
              <p className="font-bold">Comprehensive Course Listings: </p>Browse
              thousands of courses from institutions worldwide, categorized for
              easy navigation.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="block md:hidden">-</span>
            <p className="text-gray-900 leading-tight">
              <p className="font-bold">Streamlined Application Process: </p>
              At WWAH, we believe in making the application process as
              straightforward and efficient as possible, ensuring that you can
              focus on preparing for your educational journey rather than
              navigating complex procedures.
              {/* {isExpanded.application && (
                <> */}
                  <br />
                  Our team provides dedicated support to help you every step of
                  the way, from initial inquiry to final acceptance.
                {/* </>
              )}
              <span
                className="text-red-600 font-semibold hover:font-bold cursor-pointer"
                onClick={() => toggleReadMore("application")}
              >
                {isExpanded.application ? " Show less" : " Read more..."}
              </span> */}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="block md:hidden">-</span>
            <p className="text-gray-900 leading-tight">
              <p className="font-bold">Airport Transportation Service:</p>
              At WWAH, we understand that traveling to and from the airport can
              be stressful, especially when starting your educational journey.
              {/* {isExpanded.transportation && (
                <> */}
                  <br />
                  Our airport transportation service ensures you have a smooth
                  and stress-free arrival and departure experience.
                {/* </>
              )}
              <span
                className="text-red-600 font-semibold hover:font-bold cursor-pointer"
                onClick={() => toggleReadMore("transportation")}
              >
                {isExpanded.transportation ? " Show less" : " Read more..."}
              </span> */}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="rightCol flex flex-row gap-2">
        {/* Right Divider Image */}
        <div className="dividerImg hidden md:flex items-start">
          <Image
            src="/AbtUsLeftDiv.svg"
            alt="divider"
            width={40}
            height={100}
            className="h-max "
          />
        </div>
        <div className="space-y-8">
          <div className="flex items-start space-x-2">
            <span className="block md:hidden">-</span>
            <p className="text-gray-900 leading-tight">
              <p className="font-bold">Accommodation Booking Service:</p>
              At WWAH, we understand that finding suitable accommodation is an
              essential part of your student experience.
              {/* {isExpanded.accommodation && (
                <> */}
                  <br />
                  We assist you in locating safe, affordable, and convenient
                  housing options tailored to your needs.
                {/* </>
              )}
              <span
                className="text-red-600 font-semibold hover:font-bold cursor-pointer"
                onClick={() => toggleReadMore("accommodation")}
              >
                {isExpanded.accommodation ? " Show less" : " Read more..."}
              </span> */}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="block md:hidden">-</span>
            <p className="text-gray-900 leading-tight">
              <p className="font-bold">Resources and Support:</p>Access a wealth
              of resources, including application tips, scholarship information,
              and career advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
