import React from 'react'
import Image from "next/image"; // Import the Image component

const Herosection = () => {
  return (
    <div className="relative w-full">
      {/* Large Banner Image */}
      <Image
        src="/DashboardPage/banner.svg"
        alt="banner image"
        width={1200}
        height={900}
        className="rounded-2xl object-cover w-full h-[220px] xl:h-[260px] hidden md:block"
      />

      <Image
        src="/DashboardPage/heroimg.jpg"
        alt="banner image"
        width={1000}
        height={700}
        className="block md:hidden object-cover rounded-2xl w-full h-[130px] sm:h-[150px]"
      />

      {/* Text and Small Image in Top Left Corner */}
      <div className="absolute top-2 sm:top-5 xl:top-10 left-4 sm:left-6 flex flex-col items-start w-[80%] sm:w-[70%] lg:w-[60%]">
        {/* Small Image */}
        <Image
          src="/DashboardPage/handframe.svg" // Path to the smaller image
          alt="Small Image"
          width={50} // Small image size
          height={50}
          className="rounded-xl w-[35px] h-[35px] sm:w-[50px] sm:h-[50px]" // Optional rounded image
        />
        {/* Text Below the Image */}
        <div className="sm:mt-4 text-white">
          <h5 className="font-semibold">Hello, Asma Kazmi!</h5>
          <p className="mb-1 md:mb-3 text-xs md:text-sm xl:text-lg">
            Monday, 30 Dec, 2024 (07:09 PM)
          </p>
          <p className="text-xs md:text-sm xl:text-lg leading-tight  md:w-4/5">
            Get a real-time view of key business metrics to track performance at a glance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Herosection
