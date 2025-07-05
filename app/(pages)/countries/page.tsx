"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useCountry } from "@/store/useCountriesStore";
import Link from "next/link";
import ImageWithLoader from "@/components/ImageWithLoader";
import Loading from "@/app/loading";
// A dedicated spinner component for a smooth loading experience

const Page = () => {
  const [search, setSearch] = useState("");
  const { countries, fetchCountries, loading } = useCountry();

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = search
    ? countries.filter((country) =>
      country.country_name.toLowerCase().includes(search.toLowerCase()) ||
      country.short_name.toLowerCase().includes(search.toLowerCase())
    )
    : countries;

  return (
    <section className="container mx-auto px-4 pb-4 md:py-1">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center m-2 md:m-6">
        <h3 className="text-xl md:text-2xl font-bold">
          Explore the Most Viewed Study Destinations!
        </h3>
        <div className="mt-4 md:mt-0 flex items-center bg-gray-100 rounded-lg px-3">
          <Image src="/search.svg" width={16} height={16} alt="search" />
          <Input
            placeholder="Search..."
            onChange={handleFilter}
            value={search}
            name="search"
            className="border-none text-sm bg-gray-100 outline-none focus:ring-0 placeholder:text-[13px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 md:mx-6 mx-2 py-2">
        {loading ? (
          <div className="col-span-full flex justify-center items-center rounded-lg h-80">
            <Loading />
          </div>
        ) : filteredCountries.length === 0 ? (
          <p className="col-span-full text-center">No Countries found</p>
        ) : (
          filteredCountries.map((country) => (
            <Link
              target="blank"
              key={country._id}
              href={`/countries/${country._id}`}

              className="cursor-pointer"
            >
              <div className="overflow-hidden rounded-xl relative min-h-[255px] md:min-h-[250px]">
                <ImageWithLoader
                  src={`/countryarchive/${country.short_name}.png`}
                  alt={country.alt}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
