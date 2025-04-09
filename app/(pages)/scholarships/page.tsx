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
import { SkeletonCard } from "@/components/skeleton";

const Page = () => {
  // List of countries for filters
  const countries = [
    { name: "United States of America", value: "United States of America", img: "/countryarchive/usa_logo.png" },
    { name: "China", value: "china", img: "/countryarchive/china_logo.png" },
    { name: "Canada", value: "canada", img: "/countryarchive/canada_logo.png" },
    { name: "Italy", value: "italy", img: "/countryarchive/italy_logo.png" },
    { name: "United Kingdom", value: "United Kingdom", img: "/ukflag.png" },
    { name: "Ireland", value: "ireland", img: "/countryarchive/ireland_logo.png" },
    { name: "New Zealand", value: "New Zealand", img: "/countryarchive/nz_logo.png" },
    { name: "Denmark", value: "denmark", img: "/countryarchive/denmark_logo.png" },
    { name: "France", value: "france", img: "/countryarchive/france_logo.png" },
    { name: "Australia", value: "australia", img: "/countryarchive/australia_logo.png" },
    { name: "Austria", value: "austria", img: "/austria.svg" },
    { name: "Germany", value: "germany", img: "/countryarchive/germany_logo.png" },
    { name: "Portugal", value: "portugal", img: "/portugal.svg" },
    { name: "Poland", value: "poland", img: "/poland.svg" },
    { name: "Norway", value: "norway", img: "/norway.svg" },
    { name: "Europe", value: "europe", img: "/europe.svg" },
    { name: "Hungary", value: "hungary", img: "/hungary.svg" },
    { name: "South Korea", value: "South korea", img: "/south-korea.svg" },
    { name: "Japan", value: "japan", img: "/japan.svg" },
    { name: "Romania", value: "romania", img: "/romania.svg" },
    { name: "Turkiye", value: "Turkey", img: "/turkiye.svg" },
  ];
  // const deadlines = ["Jan 2025", "Feb 2025", "March 2025"];
  // const deadlines = ["Jan 2025", "Feb 2025", "March 2025"];
  const minimumRequirements = [
    "Excellent Academic Achievement",
    "2.5-3.0 CGPA",
    "3.0-3.5 CGPA",
    "3.5 & above CGPA",
    "60-70%",
    "70-75%",
    "80% or higher",
  ];
  // Extract actions and state from Zustand store (including new filter states)
  const {
    scholarships,
    loading,
    fetchScholarships,
    setSearch,
    setCountry,
    programs,
    setPrograms,
    scholarshipType, // New: current scholarship type filters
    setScholarshipType, // New setter
    deadlineFilters, // New: current application deadline filters
    setDeadlineFilters,
    page,
    totalPages,
    setPage, // New setter
  } = useScholarships();

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // We'll still use local state for search input; others are synced with Zustand.
  const [localSearch, setLocalSearch] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    []
  );

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
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // For Programs, update directly using store values
  const handleProgramChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrograms(
      programs.includes(value)
        ? programs.filter((item) => item !== value)
        : [...programs, value]
    );
  };

  // New: Scholarship Type filter handler
  const handleScholarshipTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScholarshipType(
      scholarshipType.includes(value)
        ? scholarshipType.filter((item) => item !== value)
        : [...scholarshipType, value]
    );
  };

  // New: Application Deadline filter handler
  const handleDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeadlineFilters(
      deadlineFilters.includes(value)
        ? deadlineFilters.filter((item) => item !== value)
        : [...deadlineFilters, value]
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [showFavorites, setShowFavorites] = useState(false);

  // const toggleFavorite = (id: string) => {
  //   setFavorites((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev, [id]: !prev[id] };

      // Store favorites in local storage to persist on refresh
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Filtered list based on "Favorites" button
  const displayedScholarships = showFavorites
    ? scholarships.filter((item) => favorites[item._id])
    : scholarships;

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handleRequirementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setSelectedRequirements(
      checked
        ? [...selectedRequirements, value]
        : selectedRequirements.filter((r) => r !== value)
    );
  };

  return (
    <>
      <div className="w-[95%] mx-auto">
        <Sheet>
          <SheetTrigger>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="lg:hidden block mb-2 mx-2 bg-gray-100 border-2 border-gray-200"
            >
              <div className="flex items-center w-[100px] justify-between">
                <div className="flex gap-2">
                  <Image
                    src="/filterr.svg"
                    width={12}
                    height={12}
                    alt="filter"
                  />
                  <p className="font-bold">Filters</p>
                </div>
                <Image
                  src="/right-arrow.png"
                  alt="arrow"
                  width={10}
                  height={10}
                />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 ">
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
                  <ul className="py-2 space-y-3 mb-2">
                    {countries.map((country) => (
                      <li
                        key={country.value}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={country.img}
                            width={18}
                            height={18}
                            alt={country.name}
                            className="w-[26px]"
                          />
                          <span className="text-[16px] truncate">
                            {country.name}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          value={country.value}
                          checked={selectedValues.includes(country.value)}
                          onChange={handleCheckboxChange}
                          className="ml-2"
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Programs:</p>
                  <ul className="py-2 space-y-3 mb-2">
                    {["Bachelors", "Master", "PhD"].map((program) => (
                      <li
                        key={program}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[16px] truncate">{program}</span>
                        <input
                          type="checkbox"
                          name={program.toLowerCase()}
                          value={program.toLowerCase()}
                          onChange={handleProgramChange}
                          checked={programs.includes(program.toLowerCase())}
                          className="ml-2"
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Scholarship Type:</p>
                  <ul className="py-3 space-y-3 mb-2">
                    {["Fully Funded", "Partial Funded"].map((type) => (
                      <li
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[16px] truncate">{type}</span>
                        <input
                          type="checkbox"
                          name={type}
                          value={type}
                          onChange={handleScholarshipTypeChange}
                          checked={scholarshipType.includes(type)}
                          className="ml-2"
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Application Deadline:</p>
                  <ul className="py-2 space-y-3">
                    {["Jan 2025", "Feb 2025", "March 2025"].map((deadline) => (
                      <li
                        key={deadline}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[16px] truncate">{deadline}</span>
                        <input
                          type="checkbox"
                          name={deadline}
                          value={deadline}
                          onChange={handleDeadlineChange}
                          checked={deadlineFilters.includes(deadline)}
                          className="ml-2"
                        />
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="text-lg mt-4">Minimum Requirement:</p>
                  <ul className="py-2 space-y-3">
                    {[
                      "Excellent Academic Achievement",
                      "2.5-3.0 CGPA",
                      "3.0-3.5 CGPA",
                      "3.5 & above CGPA",
                      "60-70%",
                      "70-75%",
                      "80% or higher",
                    ].map((requirement) => (
                      <li
                        key={requirement}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[16px] truncate">
                          {requirement}
                        </span>
                        <input
                          type="checkbox"
                          name={requirement}
                          value={requirement}
                          onChange={handleRequirementChange}
                          checked={selectedRequirements.includes(requirement)}
                          className="ml-2"
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </section>
            </div>
          </SheetContent>
        </Sheet>
        {/* Desktop Filter Sidebar */}
        <div className="flex gap-2 pt-1">
          <section className="hidden lg:block lg:w-[25%] w-[25%]">
            <div className="border-2 rounded-3xl p-4 md:p-0">
              <div className="hidden md:flex items-center gap-2 p-4">
                <Image src="/filterr.svg" width={20} height={20} alt="filter" />
                <h6 className="font-bold">Filters</h6>
              </div>
              <div className="flex justify-center">
                <div className="flex justify-evenly bg-[#F1F1F1] rounded-lg px-3 w-[80%]">
                  <Image
                    src="/search.svg"
                    width={16}
                    height={16}
                    alt="search"
                  />
                  <input
                    placeholder="Search Scholarships..."
                    name="search"
                    value={localSearch}
                    onChange={handleSearchChange}
                    className="border-none bg-[#F1F1F1] outline-none focus:ring-0 flex-1 p-2 placeholder:text-[12px] w-[50%] rounded-lg"
                  />
                </div>
              </div>
              <hr className="mx-4 md:m-4" />
              <ScrollArea className="p-4 h-[500px] md:h-screen overflow-y-auto">
                {/* Desktop Country Filter */}
                <p className="font-bold text-base md:text-xl">Country:</p>
                <ul className="py-4 space-y-3 md:space-y-4">
                  {countries.map((country) => (
                    <li
                      key={country.value}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={country.img}
                          width={18}
                          height={18}
                          alt={country.name}
                          className="w-[26px]"
                        />
                        <span className="text-[16px] truncate">
                          {country.name}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        value={country.value}
                        checked={selectedValues.includes(country.value)}
                        onChange={handleCheckboxChange}
                        className="ml-2"
                      />
                    </li>
                  ))}
                </ul>
                {/* Desktop Programs Filter */}
                <p className="text-base md:text-xl font-medium">Programs:</p>
                <ul className="py-4 space-y-3 md:space-y-4">
                  {["Bachelors", "Master", "PhD"].map((program) => (
                    <li
                      key={program}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[16px] truncate">{program}</span>
                      <input
                        type="checkbox"
                        name={program.toLowerCase()}
                        value={program.toLowerCase()}
                        onChange={handleProgramChange}
                        checked={programs.includes(program.toLowerCase())}
                        className="ml-2"
                      />
                    </li>
                  ))}
                </ul>
                {/* Desktop Scholarship Type Filter */}
                <p className="text-base md:text-xl font-medium">
                  Scholarship Type:
                </p>
                <ul className="py-4 space-y-3 md:space-y-4">
                  {["Fully Funded", "Partial Funded"].map((type) => (
                    <li
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[16px] truncate">{type}</span>
                      <input
                        type="checkbox"
                        name={type}
                        value={type}
                        onChange={handleScholarshipTypeChange}
                        checked={scholarshipType.includes(type)}
                        className="ml-2"
                      />
                    </li>
                  ))}
                </ul>
                {/* Desktop Application Deadline Filter */}
                <p className="text-base md:text-xl font-medium">
                  Application Deadline:
                </p>
                <ul className="py-4 space-y-3 md:space-y-4">
                  {[
                    "January-2025",
                    "February-2025",
                    "March-2025",
                    "April-2025",
                    "May-2025",
                    "June-2025",
                    "July-2025",
                    "August-2025",
                    "September-2025",
                    "October-2025",
                    "November-2025",
                    "December-2025",
                  ].map((deadline) => (
                    <li
                      key={deadline}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[16px] truncate">{deadline}</span>
                      <input
                        type="checkbox"
                        name={deadline}
                        value={deadline}
                        onChange={handleDeadlineChange}
                        checked={deadlineFilters.includes(deadline)}
                        className="ml-2"
                      />
                    </li>
                  ))}
                </ul>
                <p className="text-base md:text-xl font-medium">
                  Minimum Requirement:
                </p>
                <ul className="py-2 space-y-3">
                  {minimumRequirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[16px] truncate">
                        {requirement}
                      </span>
                      <input
                        type="checkbox"
                        value={requirement}
                        checked={selectedRequirements.includes(requirement)}
                        onChange={handleRequirementChange}
                        className="ml-2"
                      />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </section>
          {/* Scholarship Display Section */}
          <section className="lg:w-[80%] w-[100%]">
            <div className="flex flex-col md:flex-row justify-between px-2">
              <div className="lg:px-3 flex flex-col">
                <h3 className="font-bold w-4/5 text-start">
                  Find the Right Scholarship for Your Academic Journey!
                </h3>
              </div>
              <div className="flex items-start justify-start mt-4 md:mt-0">
                <div className="flex items-center justify-center gap-1 lg:gap-2 bg-gray-100 rounded-lg    ">
                  <button
                    onClick={() => setShowFavorites((prev) => !prev)}
                    className={`text-sm flex items-center justify-center gap-1 lg:gap-2 bg-gray-100 rounded-lg py-2 px-4   ${showFavorites
                      ? "text-red-500 font-semibold"
                      : "text-gray-600"
                      }`}
                  >
                    <Image
                      src="/hearti.svg"
                      width={20}
                      height={20}
                      alt="favorites"
                    />
                    {showFavorites ? "ShowAll" : "Favorites"}
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              <SkeletonCard arr={8} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-2">
                  {displayedScholarships.length === 0 ? (
                    <p className="text-[20px] font-semibold col-span-4 text-center p-4">
                      {showFavorites
                        ? "No Favorite Scholarships Found"
                        : "No Scholarships Found"}
                    </p>
                  ) : (
                    displayedScholarships.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3"
                      >
                        <div className="relative w-full">
                          {/* Background Image */}
                          <Image
                            src={"/uniar.svg"}
                            alt="University Image"
                            width={400}
                            height={250}
                            className="w-full object-cover rounded-lg"
                          />

                          {/* Logo Overlay */}
                          <div className="absolute top-8">
                            <Image
                              src="/unilogo.svg"
                              alt="University Logo"
                              width={180}
                              height={130}
                              className="object-contain"
                            />
                          </div>

                          {/* Share & Favorite Buttons */}
                          <div className="absolute top-4 right-2 md:right-4 flex items-center space-x-1 py-2 px-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-md">
                            <button>
                              <Image
                                src="/share.svg"
                                width={24}
                                height={24}
                                alt="Share"
                              />
                            </button>
                            <button onClick={() => toggleFavorite(item._id)}>
                              {favorites[item._id] ? (
                                <Image
                                  src="/redheart.svg"
                                  width={24}
                                  height={24}
                                  alt="Favorite"
                                />
                              ) : (
                                <Image
                                  src="/whiteheart.svg"
                                  width={24}
                                  height={24}
                                  alt="Favorite"
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-2 flex-grow">
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Min Requirements:
                            </span>{" "}
                            {item.minRequirements}
                          </p>
                          <div className="flex flex-col md:flex-row justify-between flex-wrap">
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image
                                src={"/location.svg"}
                                alt="location"
                                width={16}
                                height={16}
                              />
                              <p className="text-sm md:text-base text-gray-600 font-bold truncate">
                                {item.hostCountry}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image
                                src={"/money.svg"}
                                alt="scholarship type"
                                width={16}
                                height={16}
                              />
                              <p className="text-sm md:text-base text-gray-600 font-bold truncate">
                                {item.scholarshipType}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between flex-wrap">
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image src={"/Notebooksvg.svg"} alt="degree level" width={16} height={16} />
                              <p className="text-sm md:text-base text-gray-600 font-bold truncate">
                                {item.programs
                                  ? item.programs
                                  : "Not Specified"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image
                                src={"/clock.svg"}
                                alt="deadline"
                                width={16}
                                height={16}
                              />
                              <p className="text-sm md:text-base text-gray-600 font-bold truncate">
                                {item.deadline}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <hr className="mx-4 mb-4" />

                        {/* Buttons Section */}
                        <div className="flex gap-2 w-full">
                          <Link
                            href={`/scholarships/${item._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-lg text-white text-xs md:text-[13px] px-1 py-2 border border-red-500 text-center"
                          >
                            View Details
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex-1 flex items-center justify-center border border-[#F0851D] text-[#F0851D] text-xs md:text-[13px] px-1 py-2 rounded-lg hover:bg-red-500 hover:text-white text-center"
                          >
                            Start Your Application
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center m-4 gap-4 p-2">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:bg-blue-300"
                  >
                    Previous
                  </button>
                  <span className="text-lg font-semibold text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:bg-blue-300"
                  >
                    Next
                  </button>
                </div>

              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;
