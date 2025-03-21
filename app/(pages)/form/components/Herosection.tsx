import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const Herosection = () => {
  return (
    <section className="mx-auto w-[90%] md:w-[95%] overflow-hidden mt-4">
      {/* Hero Section */}
      <div
        className="relative h-[270px] md:h-[80vh] flex flex-col justify-center items-center md:items-start text-white bg-cover bg-center rounded-3xl py-4 sm:p-0"
        style={{
          backgroundImage: "url('/Heroimg.png')",
          backgroundSize: "cover", // Ensures the image covers the entire container
          backgroundPosition: "center", // Centers the image
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
        }}
      >
        <div className="w-full md:w-[60%] lg:w-[40%] px-4 md:pl-20 text-center md:text-left">
          <h1 className="md:mb-4 ">Score Higher with Expert Guidance!</h1>
          <p className="md:mb-6 my-2">
            Book IELTS | PTE | TOEFL classes with WWAH
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center md:justify-start items-center md:items-start">
            <Link href="#book-demo">
              <Button className="bg-[#C7161E] rounded-lg text-white hover:bg-red-500 transition px-8 py-2 w-48 md:w-auto md:px-12 md:py-6 2xl:px-20 2xl:py-10 2xl:text-2xl">
                Register Now
              </Button>
            </Link>
            <Link href="#book-demo">
              <Button className="bg-white bg-opacity-20 text-white rounded-lg hover:bg-gray-200 hover:text-black transition px-8 py-2 w-48 md:w-auto md:px-12 md:py-6  2xl:px-20 2xl:py-10 2xl:text-2xl border border-transparent">
                Book a Free Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
