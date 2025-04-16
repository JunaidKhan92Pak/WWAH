import { Input } from "@/components/ui/input";

import Image from "next/image";
// import React from "react";

export const Sidebar = () => {
  return (
    <div className="border-2 rounded-3xl md:p-0 p-4">
      <div className="md:flex items-center gap-2 p-6  hidden">
        <Image
          src="/filterr.svg"
          width={30}
          height={30}
          alt="favourite"
          className="2xl:w-[42px] 2xl:h-[42px]"
        />
        <p className="text-2xl">Filters</p>
      </div>
      <div className="flex bg-[#F1F1F1] p-2 rounded-lg mx-6 mb-6 ">
        <Image
          src="/search.svg"
          width={20}
          height={20}
          alt="favourite"
          className="2xl:w-[42px] 2xl:h-[42px] ml-2"
        />
        <Input
          placeholder="Search Scholarships..."
          className="border-none bg-[#F1F1F1] outline-none focus:ring-0 "
        />
      </div>
      <hr className="mx-6" />

      {/* <ScrollArea className="md:p-4 md:h-full h-[500px] bg-red-300 ">
        <p className="text-xl">Country:</p>
        <div className="">
          <ul className="py-4 space-y-6">
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/countryarchive/usa_logo.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">United States</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/china.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">China</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/canada.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">Canada</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/italy.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">Italy</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/ukflag.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="uk">United Kingdom</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/ireland.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">Ireland</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/new-zealand.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">New Zealand</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/denmark.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">Denmark</label>
              </div>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/france.png"
                  width={20}
                  height={20}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px] ml-2"
                />
                <label htmlFor="us">France</label>
              </div>
              <Checkbox />
            </li>
          </ul>
          <p className="text-xl">Programs:</p>
          <ul className="py-4 space-y-6">
            <li className="flex justify-between ">
              <label htmlFor="us">Bachelors</label>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <label htmlFor="us">Master</label>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <label htmlFor="us">PhD</label>
              <Checkbox />
            </li>
          </ul>
          <p className="text-xl">Scholarship Type:</p>
          <ul className="py-4 space-y-6">
            <li className="flex justify-between ">
              <label htmlFor="us">Fully Funded </label>
              <Checkbox />
            </li>
            <li className="flex justify-between ">
              <label htmlFor="us">Partial Funded</label>
              <Checkbox />
            </li>
          </ul>
          <p className="text-xl">Application Deadline:</p>
          <ul className="py-4 space-y-6">
            <li className="flex justify-between">
              <label htmlFor="deadline-jan">January-2024</label>
              <Checkbox id="deadline-jan" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-feb">February-2024</label>
              <Checkbox id="deadline-feb" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-mar">March-2024</label>
              <Checkbox id="deadline-mar" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-apr">April-2024</label>
              <Checkbox id="deadline-apr" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-may">May-2024</label>
              <Checkbox id="deadline-may" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-jun">June-2024</label>
              <Checkbox id="deadline-jun" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-jul">July-2024</label>
              <Checkbox id="deadline-jul" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-aug">August-2024</label>
              <Checkbox id="deadline-aug" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-sep">September-2024</label>
              <Checkbox id="deadline-sep" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-oct">October-2024</label>
              <Checkbox id="deadline-oct" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-nov">November-2024</label>
              <Checkbox id="deadline-nov" />
            </li>
            <li className="flex justify-between">
              <label htmlFor="deadline-dec">December-2024</label>
              <Checkbox id="deadline-dec" />
            </li>
          </ul>

        </div>
      </ScrollArea> */}
    </div>
  );
};
