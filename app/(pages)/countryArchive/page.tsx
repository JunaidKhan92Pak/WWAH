"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useCountry } from "@/store/useCountriesStore";
import Link from "next/link";
const Page = () => {
  const [search, setSearch] = useState("");
  const { countries, fetchCountries } = useCountry() as {
    countries: { _id: string; short_name: string; alt: string }[];
    fetchCountries: () => void;
  };
  const handelFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchCountries();
  }, []);
  return (
    <>
      <section className="w-[90%] mx-auto">
        <div className="flex justify-between md:py-5">
          <div className="space-y-2">
            <h3 className="leading-6 md:leading-10 md:mb-2 font-bold py-2">
              Explore the Most Viewed Study Destinations!
            </h3>
            {/* <p>Most viewed & all - time countires</p> */}
          </div>
          {/* <div className="bg-gray-100 rounded-lg px-4"> */}
          <div className="w-[90%] md:w-[60%] flex justify-end items-center gap-4 md:p-2">
            <div className="flex  bg-[#F1F1F1]   rounded-lg ">
              <Image
                src="/search.svg"
                width={16} // Adjust to match screenshot
                height={16}
                alt="search"
                className="2xl:w-[42px] 2xl:h-[42px] ml-2"
              />
              <Input
                placeholder="search..."
                onChange={handelFilter}
                value={search}
                name="search"
                className="border-none text-[14px] font-medium bg-[#F1F1F1]  outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {countries?.map((country, index) => (
            <Link
              target="blank"
           
              href={`/countries/${country._id}`}
              key={index}
            >
              <div className="flex-shrink-0 ">
                <Image
                  src={`/countryarchive/${country.short_name}.svg`}
                  alt={country.alt}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                  className="rounded-xl w-full h-auto max-w-[600px] md:max-w-[400px] xl:max-w-[400px] 2xl:max-w-[800px]"
                />
                {/* <p>{country.country_name}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Page;
