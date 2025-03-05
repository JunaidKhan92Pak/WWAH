"use client";
import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useScholarships } from "@/store/useScholarships";
import { debounce } from "lodash";
import Link from "next/link";

const Page = () => {
  // List of countries for filters
  const countries = [
    { name: "United States", value: "usa", img: "/usa.png" },
    { name: "China", value: "china", img: "/china.png" },
    { name: "Canada", value: "canada", img: "/canada.png" },
    { name: "Italy", value: "italy", img: "/italy.png" },
    { name: "United Kingdom", value: "uk", img: "/uk.png" },
    { name: "Ireland", value: "ireland", img: "/ireland.png" },
    { name: "New Zealand", value: "new-zealand", img: "/new-zealand.png" },
    { name: "Denmark", value: "denmark", img: "/denmark.png" },
    { name: "France", value: "france", img: "/france.png" },
  ];

  // Extract actions and state from Zustand store
  const { scholarships, fetchscholarships, setSearch, setCountry } = useScholarships();

  useEffect(() => {
    fetchscholarships();
  }, [fetchscholarships]);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState("");
  console.log(selectedInfo);

  // Debounced search to optimize rapid input changes
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  // Sync country filter selections to Zustand state
  useEffect(() => {
    setCountry(selectedValues);
  }, [selectedValues, setCountry]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedInfo((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Handle search input change (used in both mobile and desktop)
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  return (
    <>
      <div className="w-[90%] mx-auto"></div>
      <Sheet>
        <SheetTrigger>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="md:hidden mb-4 mx-4 bg-gray-100 border-2 border-gray-200"
          >
            <div className="flex items-center w-[100px] justify-between">
              <div className="flex gap-2">
                <Image src="/filterr.svg" width={12} height={12} alt="filter" />
                <p className="font-bold">Filters</p>
              </div>
              <Image src="/right-arrow.png" alt="arrow" width={10} height={10} />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
          <div className="p-2">
            <section>
              <div className="flex bg-[#F1F1F1] mx-2 mb-2 w-[80%] px-2 rounded-lg">
                <Input
                  placeholder="Search Scholarships..."
                  name="search"
                  value={localSearch}
                  onChange={handleSearchChange}
                  className="border-none bg-[#F1F1F1] outline-none focus:ring-0 placeholder:text-[12px]"
                />
                <Image
                  src="/search.svg"
                  width={16}
                  height={16}
                  alt="search"
                  className="2xl:w-[40px] 2xl:h-[40px] ml-2"
                />
              </div>
              <hr className="mx-4" />
              <ScrollArea className="p-4 md:h-full h-[400px]">
                <h6 className="text-lg">Country:</h6>
                <div>
                  <ul className="py-2 space-y-4 mb-2">
                    {countries.map((country) => (
                      <li key={country.value} className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={country.img}
                            width={18}
                            height={18}
                            alt={country.name}
                            className="w-[26px]"
                          />
                          <label className="text-[16px]">{country.name}</label>
                        </div>
                        <input
                          type="checkbox"
                          value={country.value}
                          checked={selectedValues.includes(country.value)}
                          onChange={handleCheckboxChange}
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Programs:</p>
                  <ul className="py-2 space-y-4 mb-2">
                    {["Bachelors", "Master", "PhD"].map((program) => (
                      <li key={program} className="flex justify-between">
                        <label className="text-[16px]">{program}</label>
                        <input
                          type="checkbox"
                          name={program.toLowerCase()}
                          value={program.toLowerCase()}
                          onChange={handleInfoChange}
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Scholarship Type:</p>
                  <ul className="py-4 space-y-4 mb-2">
                    {["Fully Funded", "Partial Funded"].map((type) => (
                      <li key={type} className="flex justify-between">
                        <label className="text-[16px]">{type}</label>
                        <input type="checkbox" name={type} value={type} onChange={handleInfoChange} />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Application Deadline:</p>
                  <ul className="py-2 space-y-4">
                    {["Jan 2025", "Feb 2025", "March 2025"].map((deadline) => (
                      <li key={deadline} className="flex justify-between">
                        <label className="text-[16px]">{deadline}</label>
                        <input type="checkbox" name={deadline} value={deadline} onChange={handleInfoChange} />
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </section>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex justify-around gap-2">
        <section className="hidden md:block w-[20%] lg:w-[20%]">
          <div className="border-2 rounded-3xl p-4 md:p-0">
            <div className="hidden md:flex items-center gap-2 p-4">
              <Image src="/filterr.svg" width={20} height={20} alt="filter" />
              <h6 className="font-bold">Filters</h6>
            </div>
            <div className="flex justify-center">
              <div className="flex justify-evenly bg-[#F1F1F1] rounded-lg px-3 w-[80%]">
                <Image src="/search.svg" width={16} height={16} alt="search" />
                <input
                  placeholder="Search Scholarships..."
                  name="search"
                  value={localSearch}
                  onChange={handleSearchChange}
                  className="border-none bg-[#F1F1F1] outline-none focus:ring-0 flex-1 p-2 placeholder:text-[12px] w-[50%] rounded-lg"
                />
              </div>
            </div>
            <hr className="mx-4 md:m-6" />
            <ScrollArea className="p-4 h-[500px] md:h-full overflow-auto">
              <p className="font-bold">Country:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {countries.map((country) => (
                  <li key={country.value} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={country.img}
                        width={18}
                        height={18}
                        alt={country.name}
                        className="w-[26px]"
                      />
                      <label className="text-[16px]">{country.name}</label>
                    </div>
                    <input
                      type="checkbox"
                      value={country.value}
                      checked={selectedValues.includes(country.value)}
                      onChange={handleCheckboxChange}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Programs:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Bachelors", "Master", "PhD"].map((program) => (
                  <li key={program} className="flex justify-between items-center">
                    <label htmlFor={program.toLowerCase()} className="text-sm md:text-base">
                      {program}
                    </label>
                    <input
                      type="checkbox"
                      name={program.toLowerCase()}
                      value={program.toLowerCase()}
                      onChange={handleInfoChange}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Scholarship Type:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Fully Funded", "Partial Funded"].map((type) => (
                  <li key={type} className="flex justify-between items-center">
                    <label htmlFor={type} className="text-sm md:text-base">
                      {type}
                    </label>
                    <input type="checkbox" name={type} value={type} onChange={handleInfoChange} />
                  </li>
                ))}
              </ul>
              <p className="text-base md:text-xl">Application Deadline:</p>
              <ul className="py-4 space-y-4 md:space-y-6">
                {["Jan 2025", "Feb 2025", "March 2025"].map((deadline) => (
                  <li key={deadline} className="flex justify-between items-center">
                    <label htmlFor={deadline} className="text-sm md:text-base">
                      {deadline}
                    </label>
                    <input type="checkbox" name={deadline} value={deadline} onChange={handleInfoChange} />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </section>
        <section className="md:w-[75%] w-[90%]">
          {/* All University Section */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:py-2 flex flex-col">
              <h3 className="font-bold w-4/5 text-start">
                Find the Right Scholarship for Your Academic Journey!
              </h3>
              {/* <p className="text-sm">Showing Scholarships in United States:</p> */}
            </div>
            <div className="flex items-center justify-start md:justify-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg py-2 px-4 md:p-3">
                <Image src="/hearti.png" width={20} height={20} alt="favourite" />
                <span className="text-sm text-gray-600 pr-2">Favorites</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-2">
            {scholarships.map((item) => (
              <div key={item._id} className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3">
                {/* Image Section */}
                <div>
                  <Image
                    src={"/course1.svg"}
                    alt="University Image"
                    width={400}
                    height={250}
                    className="w-full object-cover"
                  />
                </div>
                {/* Content Section */}
                <div className="p-2 flex-grow">
                  <p className="font-bold">{item.name}</p>
                  <div className="flex justify-between flex-wrap">
                    <div className="flex items-center gap-2 mt-2">
                      <Image src={"/location.svg"} alt="location" width={16} height={16} />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {item.hostCountry}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Image src={"/money.svg"} alt="year" width={16} height={16} />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {item.scholarshipType}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <div className="flex items-center gap-2 mt-2">
                      <Image src={"/Notebook.svg"} alt="duration" width={16} height={16} />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {/* Duration */}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Image src={"/clock.svg"} alt="fees" width={16} height={16} />
                      <p className="text-sm md:text-base text-gray-600 font-bold">
                        {/* Application Deadline */}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <hr className="mx-4 mb-4" />
                {/* Buttons Section */}
                <div className="flex gap-2 flex-row justify-evenly mb-1 px-2">
                  <Link
                    href={`/scholarships/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex  items-center  justify-center md:w-[50%] w-[40%] bg-red-500  hover:bg-red-500 rounded-lg   hover:text-white text-[12px] md:text-md md:px-3 md:py-1 border text-center  border-[#F0851D] text-[#F0851D]  sm:w-auto"
                  >
                    <button className="">
                      View Details
                    </button>
                  </Link>
                  <button className="w-[50%] border border-[#F0851D] text-[#F0851D] text-[12px] hover:bg-red-500 hover:text-white md:text-md md:px-3 py-1 rounded-lg sm:w-auto">
                    Start Your Application
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-28 mx-auto py-10">
            <div className="flex justify-between items-center">
              <p>Show More</p>
              <Image src="/arrowDown.png" alt="arrow" width={20} height={20} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
