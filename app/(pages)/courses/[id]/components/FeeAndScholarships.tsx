"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface FeeAndScholarshipsProps {
  data: {
    _id: string;
    countryname: string;
    universityname: string;
    course_link: string;
    course_title: string;
    required_ielts_score: string;
    required_pte_score: string;
    required_toefl_score: string;
    entry_requirement: string;
    education_level: string;
    course_level: string;
    intake: string;
    duration: string;
    start_date: string;
    degree_format: string;
    location_campus: string;
    annual_tuition_fee: {
      currency: string;
      amount: string;
    };
    initial_deposit: string;
    overview: string;
    course_structure: string;
    year_1?: string;
    year_2?: string;
    year_3?: string;
    year_4?: string;
    year_5?: string;
    year_6?: string;
    career_opportunity_1?: string;
    career_opportunity_2?: string;
    career_opportunity_3?: string;
    career_opportunity_4?: string;
    career_opportunity_5?: string;
  };
}

export const FeeAndScholarships = ({ data }: FeeAndScholarshipsProps) => {
  const [activeTab, setActiveTab] = useState("scholarship");
  return (
    <section className=" w-[90%] mx-auto my-4">
      <h2 className="pb-2">Fee and Scholarships!</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[24%_26%_46%] gap-2 md:gap-6">
        {/* Fee Information Card */}
        <Card className="md:p-6 p-2 bg-[#FCE7D2] flex flex-col justify-between">
          <div>
            <h5 className="mb-2">Total Fee:</h5>
            <ul className="space-y-4 leading-normal lg:leading-10">
              <li className="flex items-center space-x-2 ">
                <span className="vertical-line w-[1px] h-3 bg-black"></span>
                <p className="font-semibold">
                  {data.annual_tuition_fee.currency}{" "}
                  {data.annual_tuition_fee.amount}
                </p>
                <p className="text-gray-600">Annual Fee</p>
              </li>
              <li className="flex items-center space-x-2 ">
                <span className="vertical-line w-[1px] h-3 bg-black"></span>
                <p className="font-semibold">$0</p>
                <p className="text-gray-600">Server Fee (N/A)</p>
              </li>
              <li className="flex items-center space-x-2 ">
                <span className="vertical-line w-[1px] h-3 bg-black"></span>
                {/* <p className="font-semibold">{data.initial_deposit}</p> */}
                <div className="relative group w-[100px]">
                  <p className="text-sm truncate font-medium max-w-[100px] overflow-hidden">
                    {data.initial_deposit}
                  </p>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-200 text-black text-sm font-medium p-2 rounded-md w-[200px] text-center shadow-lg">
                    {data.initial_deposit}
                  </span>
                </div>
                <p className="text-gray-600">Initial Deposit</p>
                {/* Name with Tooltip */}
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <p>
              Have Questions about University Fee?{" "}
              <Link
                href="#"
                className="text-red-600 hover:underline font-semibold"
              >
                WWAH
              </Link>{" "}
              is here to help!
            </p>
          </div>
        </Card>

        {/* Scholarships Card */}
        <Card className="py-6 md:p-6 p-2 bg-[#FCE7D2] flex flex-col justify-between">
          <div>
            <h5 className="mb-4 leading-tight">
              Scholarships at {data.universityname}
            </h5>

            <div className="flex items-start space-x-2 pb-4">
              {/* <span className="vertical-line hidden lg:block w-[1px] h-36  bg-black"></span> */}
              <p className="text-gray-600 mb-4 leading-tight">
                For overseas students, {data.universityname} provides a variety
                of scholarships that may cover living expenses, travel expenses,
                tuition fees, or provide a partial award like a tuition fee
                remission or discount.
              </p>
            </div>
          </div>

          <div className="flex w-full rounded-lg bg-[#FDF2E8]">
            <button
              onClick={() => setActiveTab("scholarship")}
              className={`flex-1 py-2 px-1 text-center rounded-lg text-xs sm:text-sm transition-colors duration-300 ${activeTab === "scholarship"
                  ? "bg-[#F57C00] text-white"
                  : "bg-transparent text-black"
                }`}
            >
              <Link href="">
                Scholarship Details
              </Link>
            </button>
            <button
              onClick={() => setActiveTab("funding")}
              className={`flex-1 py-2 text-center rounded-lg text-xs sm:text-sm transition-colors duration-300 ${activeTab === "funding"
                  ? "bg-[#F57C00] text-white"
                  : "bg-transparent text-black"
                }`}
            >
              <Link href="https://mta.ca/current-students/student-finances/financial-aid-current-students">
                Funding Details
              </Link>
            </button>
          </div>

          <Link href="/contactus">
            <Button
              variant="outline"
              className="w-full mt-4 border-2 border-red-500 text-red-500 bg-[#FCEAD8] 
       rounded-lg text-xs sm:text-sm hover:bg-[#F0851D] hover:text-white transition-colors duration-300 py-4"
            >
              Contact with WWAH Advisor
            </Button>
          </Link>
        </Card>
        <div className="flex flex-col gap-2">
          {/* Payment Methods Card */}
          <Card className="p-4 bg-[#FCE7D2]">
            <h5 className="font-semibold mb-4 leading-tight">
              Payment method for International Students
            </h5>

            <p className=" text-gray-600 mb-2 leading-tight">
              There are three ways in which you can pay your tuition and related
              fee:
            </p>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-2">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <p className="text-bold">Online</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <p className="text-bold">Via Telephone</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <p className="text-bold">Bank</p>
              </div>
            </div>

            <p className=" text-gray-600 mb-4 leading-tight mt-2">
              To find out how to pay Your tuition fee, deposits & Accommodation
              fee at {data.universityname}.
            </p>

            <Link href="#">
              <Button
                variant="outline"
                className="w-full border-2 border-red-500 text-red-500 bg-[#FCEAD8] 
            rounded-lg font-medium hover:bg-[#F0851D] hover:text-white transition-colors duration-300 py-4"
              >
                Click here
              </Button>
            </Link>
          </Card>

          {/* Calculator Card */}
          <Card className="p-8 text-white col-span-full relative overflow-hidden rounded-lg bg-black/50">
            {/* Background Image */}
            <Image
              src="/calculate-bg.png"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
            />
            {/* Overlay Content */}
            <div className="relative z-10 text-center flex flex-col items-center justify-center space-y-2">
              <Calculator className="w-12 h-12" />
              <p>
                Calculate your Living Expense at <br /> {data.universityname}
              </p>
              <Link href="/trackexpense">
                <Button
                  variant="secondary"
                  className="w-full bg-white text-black  px-6 rounded-lg hover:bg-gray-200 transition duration-300 py-4"
                >
                  Calculate Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
