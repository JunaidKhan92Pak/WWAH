"use client"; // Add this line at the top
import React from "react";
import { GoShareAndroid } from "react-icons/go";
import { PiPersonSimpleCircleLight } from "react-icons/pi";
import Image from "next/image";
import { IoDiamondOutline } from "react-icons/io5";
import { TbCloudStorm } from "react-icons/tb";
import { BsBagCheck } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Page = () => {
  const expenseItems = [
    {
      id: 1,
      bgColor: "#F4D0D2",
      imageSrc: "/trackexpense/rent.png",
      alt: "rent",
      title: "Rent",
      price: "£1,300-1,430 (468,221-515,043 PKR)",
    },
    {
      id: 2,
      bgColor: "#FCE7D2",
      imageSrc: "/trackexpense/utilities.png",
      alt: "utilities",
      title: "Utilities",
      price: "£140-154 (50,424-55,466 PKR)",
    },
    {
      id: 3,
      bgColor: "#F4D0D2",
      imageSrc: "/trackexpense/internet.png",
      alt: "internet",
      title: "Internet",
      price: "£40-44 (14,407-15,847 PKR)",
    },
    {
      id: 4,
      bgColor: "#FCE7D2",
      imageSrc: "/trackexpense/mobile.png",
      alt: "mobile",
      title: "Mobile",
      price: "£40-44 (14,407-15,847 PKR)",
    },
    {
      id: 5,
      bgColor: "#F4D0D2",
      imageSrc: "/trackexpense/Groceries.png",
      alt: "groceries",
      title: "Groceries",
      price: "£280-308 (100,848-110,932 PKR)",
    },
    {
      id: 6,
      bgColor: "#FCE7D2",
      imageSrc: "/trackexpense/transport.png",
      alt: "public transport",
      title: "Public Transport",
      price: "£200-220 (72,034-79,237 PKR)",
    },
  ];

  return (
    <>
      <section className="w-full mx-auto mt-5">
        <div
          className="relative w-[90%] mx-auto md:h-[80vh] h-[80%] flex justify-center md:py-2 items-center text-center rounded-2xl text-white bg-cover bg-center"
          style={{
            backgroundImage: "url('/heroimg.png')",
          }}
        >
          <div className="w-4/5 text-left my-5">
            <div className="md:w-3/5 flex flex-col ">
              <div className="flex items-center gap-2 md:gap-5">
                <h1>Plan Your Study Abroad Living Expenses with Ease!</h1>
              </div>
              <p className="py-2">
                Get complete estimates and Budget smartly for housing, food,
                travel, and more.{" "}
              </p>
              <Button className="bg-red-700 w-36 md:mt-2">Calculate Now</Button>
            </div>
          </div>
        </div>
        <section>
          {/* Additional Section */}
          <div className="w-full md:w-3/4 md:mt-6 mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 bg-white text-center">
            {/* Heading Section */}
            <div className="mx-auto mb-4">
              <h2 className="text-gray-800 tracking-normal">
                Understand Your Living Costs in Just a Few Simple Steps!
              </h2>
            </div>
            <div className="w-full mx-auto">
              <p className="text-[#313131] text-justify lg:text-center">
                Planning your study abroad journey? We ve made budgeting easy!
                With our living expense calculator, you can break down your
                expected costs in no time. Just follow these quick steps to get
                an accurate snapshot of your monthly expenses for housing, food,
                transportation, and more.
              </p>
            </div>
          </div>

          {/* cards image Section */}
          <div className="flex justify-center items-start mb-10">
            <div className="w-full xl:w-3/5">
              {" "}
              <Image
                src="/img7.png"
                alt="Background"
                layout="responsive"
                width={150}
                height={100}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="w-full min-h-screen bg-[#FCE7D2] relative lg:px-8 ">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
              <Image
                src="/bg-usa.png" // Path to your image
                alt="Background Image" // Alt text for the image
                layout="fill" // Fills the parent container
                objectFit="cover" // Ensures the image covers the container while maintaining its aspect ratio
                className="absolute top-0 left-0 z-0 bg-[#FCE7D2]" // Tailwind classes for positioning
              />
            </div>
            <div className="absolute inset-0 bg-[#FCE7D2] opacity-60 z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full mx-auto p-6">
              <div className="w-full md:w-[50%] md:space-y-2">
                <section>
                  <h3 className="font-bold text-gray-800">Country Selection</h3>
                  <Carousel>
                    <CarouselContent>
                      <CarouselItem>
                        <div className="flex justify-evenly pt-7">
                          <div className="flex flex-col items-center">
                            <Image
                              src="/uk.png"
                              alt="uk"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              UK
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image
                              src="/usa.png"
                              alt="usa"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              USA
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image
                              src="/australia.png"
                              alt="australia"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Australia
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image
                              src="/china.png"
                              alt="China"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              China
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image
                              src="/canada.png"
                              alt="Canada"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Canada
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image
                              src="/japan.png"
                              alt="Japan"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Japan
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="flex flex-wrap justify-around pt-6 md:px-5">
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/ireland.png"
                              alt="Ireland"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Ireland
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/new-zealand.png"
                              alt="NewZealand"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 leading-4 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              New Zealand
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/france.png"
                              alt="France"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              France
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/italy.png"
                              alt="italy"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Italy
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/malaysia.png"
                              alt="malaysia"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              Malaysia
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/france.png"
                              alt="France"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                              France
                            </p>
                          </div>
                          <div className="w-[12%] flex flex-col items-center">
                            <Image
                              src="/denmark.png"
                              alt="denmark"
                              width={200}
                              height={200}
                              className="md:w-10 w-8"
                            />
                            <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[11px]">
                              Denmark
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <div className="absolute top-1/2 -translate-y-1/2 -left-8 md:-left-10 ">
                      <CarouselPrevious />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:-right-10">
                      <CarouselNext />
                    </div>
                  </Carousel>
                </section>
                {/* Select University */}
                <div className="px-6">
                  <h5 className="text-gray-800 mt-4 mb-2">Select University</h5>
                  <select className="w-full p-2 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600">
                    <option>Select University</option>
                    <option>University A</option>
                    <option>University B</option>
                    <option>University C</option>
                  </select>
                </div>
                {/* Accommodation Type */}
                <div>
                  <h5 className=" text-gray-800 mb-2 mt-4">
                    Accommodation Type
                  </h5>
                  <div className="grid grid-cols-2 gap-6">
                    <button className="flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <GoShareAndroid className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Shared</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>

                    <button className="flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <PiPersonSimpleCircleLight className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Single</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
                {/* Lifestyle */}
                <div>
                  <h5 className="text-gray-800 mt-4 mb-2">Lifestyle</h5>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Button 1: Student Budget */}
                    <button className="flex flex-col items-center px-2 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <BsBagCheck className="w-8 h-8 mb-2 text-gray-700" />
                      <p className="font-normal text-gray-700">
                        Student Budget
                      </p>
                    </button>

                    {/* Button 2: Moderate */}
                    <button className="flex flex-col items-center px-2 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <TbCloudStorm className="w-8 h-8 mb-2 text-gray-700" />
                      <p className="font-normal text-gray-700">Moderate</p>
                    </button>

                    {/* Button 3: Luxury (Spanning Full Row) */}
                    <button className="flex flex-col items-center px-6 py-6  border border-gray-300 rounded-lg hover:bg-gray-100 col-span-2">
                      <IoDiamondOutline className="w-8 h-8 mb-2 text-gray-700" />
                      <span className="text-sm sm:text-lg font-medium text-gray-700">
                        Luxury
                      </span>
                    </button>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center">
                  <Button className="px-8 mt-3 sm:mt-2 bg-red-700">
                    Calculate
                  </Button>{" "}
                </div>
              </div>

              {/* Right Section - Results */}
              <div className="flex flex-col justify-around w-full md:w-[50%] bg-white px-2 md:p-6 rounded-lg">
                {/* Expense Header */}
                <div>
                  <h4 className="w-full md:w-4/5 font-bold text-gray-800 my-4">
                    Your Estimated Living Expense will be:
                  </h4>
                  <input
                    type="text"
                    placeholder="£ 1140 - 1840"
                    className="w-full border border-gray-300 rounded-lg text-start font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 px-4 py-2"
                  />
                  <p className="text-[#9D9D9D] text-[14px] pt-4">
                    = (PKR 517,334 - PKR 661,038)
                  </p>
                </div>

                {/* Breakdown Section */}
                <div className="bg-[#F1F1F1] rounded-2xl md:px-2 lg:px-5 ">
                  <h3 className="font-bold text-center pt-4 sm:py-6">
                    Breakdown
                  </h3>

                  {/* <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3 lg:gap-y-16 gap-y-3 px-4 sm:py-6 py-4 rounded-lg">
                    <div className="flex flex-col items-center text-left md:text-center rounded-lg">
                      <div className="bg-[#F4D0D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/rent.png"
                          alt="rent"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2 text-bold">Rent</p>
                      <p className="md:text-center text-left">
                        £1,300-1,430 (468,221-515,043 PKR)
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-left md:text-center rounded-lg">
                      <div className="bg-[#FCE7D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/utilities.png"
                          alt="utilities"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2 text-bold">Utilities</p>
                      <p className="md:text-center text-left">
                        £140-154 (50,424-55,466 PKR)
                      </p>
                    </div>

                    <div className="flex flex-col items-center  text-left md:text-center rounded-lg">
                      <div className="bg-[#F4D0D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/internet.png"
                          alt="internet"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2 text-bold">Internet</p>
                      <p className="md:text-center text-left">
                        £40-44 (14,407-15,847 PKR)
                      </p>
                    </div>

                    <div className="flex flex-col items-center  text-left md:text-center rounded-lg">
                      <div className="bg-[#FCE7D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/mobile.png"
                          alt="mobile"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2">Mobile</p>
                      <p className="md:text-center text-left">
                        £40-44 (14,407-15,847 PKR)
                      </p>
                    </div>

                    <div className="flex flex-col items-center  text-left md:text-center rounded-lg">
                      <div className="bg-[#F4D0D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/Groceries.png"
                          alt="groceries"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2">Groceries</p>
                      <p className="md:text-center text-left">
                        £280-308 (100,848-110,932 PKR)
                      </p>
                    </div>

                    <div className="flex flex-col items-center  text-left md:text-center rounded-lg">
                      <div className="bg-[#FCE7D2] p-6 sm:px-12 sm:py-6 md:px-10 lg:px-12 lg:py-8 rounded-xl">
                        <Image
                          src="/trackexpense/transport.png"
                          alt="public transport"
                          width={100}
                          height={100}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="font-bold mt-2">Public Transport</p>
                      <p className="md:text-center text-left">
                        £200-220 (72,034-79,237 PKR)
                      </p>
                    </div>
                  </div> */}
                  <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 lg:gap-y-8 gap-y-3 lg:px-4 sm:py-6 py-4 rounded-lg"
                     style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {expenseItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 w-[calc(100%/3)] sm:w-auto flex flex-col items-center text-left md:text-center rounded-lg"
                      >
                        <div
                          className={`p-4 sm:px-12 sm:py-6 md:px-6 lg:px-8 xl:px-10 lg:py-8 rounded-xl`}
                          style={{ backgroundColor: item.bgColor }}
                        >
                          <Image
                            src={item.imageSrc}
                            alt={item.alt}
                            width={300}
                            height={300}
                            className="h-6 w-6 md:w-6 md:h-6"
                          />
                        </div>
                        <p className="font-bold mt-2">{item.title}</p>
                        <p className="text-justify lg:text-center leading-4 md:leading-5 text-sm lg:text-md">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Page;
