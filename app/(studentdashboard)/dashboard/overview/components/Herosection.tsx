"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import the Image component

interface User {
  firstName: string | null;
  lastName: string | null;
}

const Herosection = ({ user }: { user: User }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative">
      {/* Large Banner Image */}
      <Image
        src="/DashboardPage/banner.svg"
        alt="banner image"
        width={1200}
        height={900}
        className="rounded-2xl object-cover w-full h-[230px] xl:h-[260px] hidden md:block"
      />

      <Image
        src="/DashboardPage/heroimg-min.jpg"
        alt="banner image"
        width={1000}
        height={700}
        className="block md:hidden object-cover rounded-2xl w-full h-[200px] md:h-[150px]"
      />

      {/* Text and Small Image in Top Left Corner */}
      <div className="absolute top-8 xl:top-9 left-4 sm:left-6 flex flex-col items-start w-[80%] sm:w-[70%] lg:w-[60%]">
        {/* Small Image */}
        <Image
          src="/DashboardPage/handframe.svg" // Path to the smaller image
          alt="Small Image"
          width={50} // Small image size
          height={50}
          className="rounded-xl w-[35px] h-[35px] sm:w-[50px] sm:h-[50px]" // Optional rounded image
        />
        {/* Text Below the Image */}
        <div className="mt-2 sm:mt-3 text-white">
          <h4>
            Hello, {user?.firstName || "user"} {user?.lastName || "name"} !
          </h4>
          <p className="md:mb-3 text-base">
            {/* Monday, 30 Dec, 2024 (07:09 PM)
             */}
            {/* day */}
            {time.toLocaleDateString("en-US", { weekday: "long" })} {/* date */}
            {time.toLocaleTimeString()}
          </p>
          <p className="text-base leading-tight  md:w-4/5">
            Get a real-time view of key business metrics to track performance at
            a glance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
