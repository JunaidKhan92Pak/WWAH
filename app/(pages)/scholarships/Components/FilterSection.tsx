import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useScholarships } from "@/store/useScholarships";

const countries = [
  // {
  //   name: "United States of America",
  //   value: "United States of America",
  //   img: "/countryarchive/usa_logo.png",
  // },
  // { name: "China", value: "china", img: "/countryarchive/china_logo.png" },
  // { name: "Canada", value: "canada", img: "/countryarchive/canada_logo.png" },
  // { name: "Italy", value: "italy", img: "/countryarchive/italy_logo.png" },
  // {
  //   name: "Ireland",
  //   value: "ireland",
  //   img: "/countryarchive/IR_logo.png",
  // },
  // {
  //   name: "New Zealand",
  //   value: "New Zealand",
  //   img: "/countryarchive/nz_logo.png",
  // },
  // {
  //   name: "Denmark",
  //   value: "denmark",
  //   img: "/countryarchive/denmark_logo.png",
  // },
  // { name: "France", value: "france", img: "/countryarchive/france_logo.png" },
  // {
  //   name: "Australia",
  //   value: "australia",
  //   img: "/countryarchive/australia_logo.png",
  // },
  // { name: "Austria", value: "austria", img: "/austria.svg" },
  // {
  //   name: "Germany",
  //   value: "germany",
  //   img: "/countryarchive/ge_logo.png",
  // },
  // { name: "Portugal", value: "portugal", img: "/portugal.svg" },
  // { name: "Poland", value: "poland", img: "/poland.svg" },
  // { name: "Norway", value: "norway", img: "/norway.svg" },
  // { name: "Europe", value: "europe", img: "/europe.svg" },
  // { name: "Hungary", value: "hungary", img: "/hungary.svg" },
  // { name: "South Korea", value: "South korea", img: "/south-korea.svg" },
  { name: "Japan", value: "japan", img: "/japan.svg" },
  // { name: "Romania", value: "romania", img: "/romania.svg" },
  { name: "Turkiye", value: "Turkiye", img: "/turkiye.svg" },
  { name: "United Kingdom", value: "United Kingdom", img: "/ukflag.png" },
];
const FilterSection = ({ isMobile = false }) => {
  const {
    minimumRequirements,
    setMinimumRequirements,
    scholarshipProviders: selectedProviders, // Add this to your store
    setScholarshipProviders, // Add this to your store
    fetchScholarships,
    setSearch,
    setCountry,
    programs,
    setPrograms,
    scholarshipType,
    setScholarshipType,
    deadlineFilters,
    setDeadlineFilters,

  } = useScholarships();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);


  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };
  const minimumRequirementsList = [
    "Excellent Academic Achievement",
    "2.5-3.0 CGPA",
    "3.0-3.5 CGPA",
    "3.5 & above CGPA",
    "60-70%",
    "70-75%",
    "80% or higher",
  ];

  const scholarshipProviders = [
    "Government-Funded",
    "University-Specific",
    "Private Organization",
  ];
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // For Programs
  const handleProgramChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrograms(
      programs.includes(value)
        ? programs.filter((item) => item !== value)
        : [...programs, value]
    );
  };
  const handleScholarshipTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScholarshipType(
      scholarshipType.includes(value)
        ? scholarshipType.filter((item) => item !== value)
        : [...scholarshipType, value]
    );
  };
  const handleDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeadlineFilters(
      deadlineFilters.includes(value)
        ? deadlineFilters.filter((item) => item !== value)
        : [...deadlineFilters, value]
    );
  };
  const handleRequirementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setMinimumRequirements(
      checked
        ? [...minimumRequirements, value]
        : minimumRequirements.filter((r) => r !== value)
    );
  };
  const handleProviderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setScholarshipProviders(
      checked
        ? [...selectedProviders, value]
        : selectedProviders.filter((p) => p !== value)
    );
  };

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);
  useEffect(() => {
    setCountry(selectedValues);
  }, [selectedValues, setCountry]);

  return (
    <>
      {" "}
      <div className={isMobile ? "p-1 md:p-2" : ""}>
       <section className="my-4">
  {/* Optional: Mobile-only search bar */}
  {isMobile && (
    <>
      <div className="flex bg-[#F1F1F1] mx-2 mb-3 md:mb-2 w-[80%] px-2 rounded-lg">
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
      <hr className="mx-4 " />
    </>
  )}

  <ScrollArea className=" md:px-4 pb-4 h-[500px] md:h-[800px] overflow-y-auto">
    {/* Country Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">
      <h6 className="text-base md:text-lg font-bold">Country:</h6>
      <ScrollArea className="h-[150px] overflow-y-auto md:p-2">
        <ul className="py-2 space-y-3 mb-2 pr-2">
          {countries.map((country) => (
            <li key={country.value} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={country.img}
                  width={18}
                  height={18}
                  alt={country.name}
                  className="w-[26px] border rounded-full"
                />
                <span className="text-[14px] truncate">{country.name}</span>
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
      </ScrollArea>
    </div>

    <hr className="my-3 md:my-0" />

    {/* Programs Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">

      <p className="text-base md:text-lg font-bold">Study Level:</p>
      <ul className="py-2 space-y-3 md:space-y-4 md:p-2">
        {["Bachelor's", "Master's", "PhD"].map((program) => (
          <li key={program} className="flex items-center justify-between">
            <span className="text-[14px] truncate">{program}</span>
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
    </div>

        <hr className="my-3 md:my-0" />


    {/* Scholarship Type Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">

      <p className="text-base md:text-lg font-bold">Scholarship Type:</p>
      <ul className="py-2 space-y-3 md:space-y-4 md:p-2">
        {["Fully Funded", "Partial Funded"].map((type) => (
          <li key={type} className="flex items-center justify-between">
            <span className="text-[14px] truncate">{type}</span>
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
    </div>

      <hr className="my-3 md:my-0" />


    {/* Application Deadline Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">

      <p className="text-base md:text-lg font-bold">Application Deadline:</p>
      <ScrollArea className="h-[200px] overflow-y-auto md:p-2">
        <ul className="py-2 space-y-3 md:space-y-4 pr-2">
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
          ].map((deadline) => (
            <li key={deadline} className="flex items-center justify-between">
              <span className="text-[14px] truncate">{deadline}</span>
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
      </ScrollArea>
    </div>

       <hr className="my-3 md:my-0" />


    {/* Minimum Requirement Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">

      <p className="text-base md:text-lg font-bold">Minimum Requirement:</p>
            <ScrollArea className="h-[150px] overflow-y-auto md:p-2">

      <ul className="py-2 space-y-3 md:p-2">
        {minimumRequirementsList.map((requirement) => (
          <li key={requirement} className="flex items-center justify-between">
            <span className="text-[14px] truncate">{requirement}</span>
            <input
              type="checkbox"
              name={requirement}
              value={requirement}
              onChange={handleRequirementChange}
              checked={minimumRequirements.includes(requirement)}
              className="ml-2"
            />
          </li>
        ))}
      </ul>
            </ScrollArea>

    </div>
            <hr className="my-3 md:my-0" />



    {/* Scholarship Provider Filter */}
    <div className="border border-gray-200 shadow-md rounded-xl bg-white my-2 p-3 md:p-2">

      <p className="text-base md:text-lg font-bold">Scholarship Provider:</p>
      <ScrollArea className="overflow-y-auto md:p-2">

        <ul className="py-2 space-y-3 md:space-y-4 pr-2">
          {scholarshipProviders.map((provider) => (
            <li key={provider} className="flex items-center justify-between">
              <span className="text-[16px] truncate">{provider}</span>
              <input
                type="checkbox"
                name={provider}
                value={provider}
                onChange={handleProviderChange}
                checked={selectedProviders?.includes(provider)}
                className="ml-2"
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  </ScrollArea>
</section>

      </div>
    </>
  );
};

export default FilterSection;
