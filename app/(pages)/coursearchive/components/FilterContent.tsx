"use client";
const studyLevels = [
  "Foundation",
  "Pre-Master",
  "Bachelor",
  "Master",
  "PhD",
  "Diploma",
  "Certificates",
];

const intakeYears = ["2025", "2026", "2027", "2028"];

const intakeMonths = ["January to April", "May to September", "October to December"];

const studyModes = ["On Campus", "Online", "Hybrid", "Distance Learning", "Blended"];

const currencies = [
  "US Dollar (USD)", "Euro (EUR)", "British Pound (GBP)", "Canadian Dollar (CAD)",
  "Australian Dollar (AUD)", "New Zealand Dollar (NZD)", "Indian Rupee (INR)",
  "Chinese Yuan (CNY)", "Malaysian Ringgit (MYR)", "Pakistani Rupees (PKR)"
];

const budgetRanges = [
  "$5000-$10,000", "$11,000 -$15,000", "$16,000 to $20,000",
  "$21,000 to $25,000", "$26,000 to $35,000", "$36,000+"
];

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useCourseStore } from "@/store/useCoursesStore";
import { useUniversityStore } from "@/store/useUniversitiesStore";
export default function FilterContent() {
  const { universities, fetchUniversities } = useUniversityStore();
  const {
    minBudget, maxBudget, setMinBudget, setMaxBudget,
    selectedUniversity, setSelectedUniversity, studyMode, setStudyMode,
    countryFilter, setCountryFilter, studyLevel, setStudyLevel,
    intakeYear, setIntakeYear
  } = useCourseStore()
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermUni, setSearchTermUni] = useState("");
  const studyDestinations = ["USA", "United Kingdom", "Canada", "Australia", "Germany"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function handleCheckboxChange(destination: string): void {
    if (destination === "All") {
      if (countryFilter.length === studyDestinations.length) {
        setCountryFilter([]); // Uncheck all
      } else {
        setCountryFilter(studyDestinations); // Select all
      }
    } else {
      const updatedSelected = countryFilter.includes(destination)
        ? countryFilter.filter((item) => item !== destination) // Remove if exists
        : [...countryFilter, destination]; // Add if not exists
      setCountryFilter(updatedSelected); //  Set array directly
    }
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    fetchUniversities(); // Fetch universities when component mounts
  }, []);

  const filteredUniversities = universities.filter((uni) =>
    uni.university_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (universityName: string) => {
    setSelectedUniversity(universityName);
    setSearchTermUni(""); // Clear input after selection
    setIsDropdownOpen(false);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(minBudget);

  return (
    <>
      {/* studyDestinations */}
      <section className="w-full p-4 border rounded-lg shadow-md bg-white">
        <label className="block text-lg font-semibold mb-2">
          Study Destination
        </label>
        <input
          type="text"
          placeholder="Search Study Destinations..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded-lg mb-3 placeholder:text-[12px]  placeholder:md:text-[14px]" />

        <div className="flex flex-col space-y-2 ">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={countryFilter.length === studyDestinations.length}
              onChange={() => handleCheckboxChange("All")}
              className="mr-2"
            />
            All
          </label>
          {studyDestinations
            .filter((destination) =>
              destination.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((destination) => (
              <label key={destination} className="flex items-center">
                <input
                  type="checkbox"
                  checked={countryFilter.includes(destination)}
                  onChange={() => handleCheckboxChange(destination)}

                  className="mr-2"
                />
                {destination}
              </label>
            ))}
        </div>
      </section>
      {/* studyLevel */}
      <section>
        <div className="p-4 border rounded-md bg-white mt-4">
          <h3 className="font-semibold mb-2">Study Level</h3>
          <div className="flex flex-col space-y-2">
            {/* None Option to Deselect */}
            <label className="flex items-center">
              <input
                type="radio"
                name="studyLevel"
                value=""
                checked={studyLevel === ""} //  Checked when no selection
                onChange={() => setStudyLevel("")} //  Deselect by choosing "None"
              />
              <span className="ml-2">None</span>
            </label>

            {/* Other Study Levels */}
            {studyLevels.map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="studyLevel"
                  value={level}
                  checked={studyLevel === level}
                  onChange={() => setStudyLevel(level)}
                />
                <span className="ml-2">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
      {/* Fitler by University  */}
      <div className="p-4 border rounded bg-white shadow-md relative" ref={dropdownRef}>
        <h3 className="text-lg font-semibold">Filter by University</h3>

        {/* Searchable Dropdown Input */}
        <input
          type="text"
          placeholder="Search or select a university..."
          value={searchTermUni}
          onChange={(e) => {
            setSearchTermUni(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full p-2 border rounded mt-1 placeholder:text-sm"
        />

        {/* Dropdown List */}
        {isDropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-48 overflow-y-auto">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(uni.university_name)}
                >
                  {uni.university_name} ({uni.country_name})
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No universities found</li>
            )}
          </ul>
        )}

        {/* Display Selected University */}
        {selectedUniversity && (
          <p className="mt-2 text-sm text-gray-600">Selected: {selectedUniversity}</p>
        )}
      </div>
      <h3 className="text-lg font-semibold mt-4">Filter by Intake Year</h3>
      <select
        className="w-full p-2 border rounded"
        value={intakeYear} //  Controlled component
        onChange={(e) => setIntakeYear(e.target.value)} //  Update Zustand store
      >
        <option value="">All Years</option> {/* Allow all years */}
        {intakeYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
      <h3 className="text-lg font-semibold mt-4">Filter by Intake Month</h3>
      <select className="w-full p-2 border rounded">
        {intakeMonths.map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
      {/* Study mode  */}
      <h3 className="text-lg font-semibold mt-4">Filter by Mode of Study</h3>
      <select
        className="w-full p-2 border rounded"
        value={studyMode} //  Controlled component
        onChange={(e) => setStudyMode(e.target.value)} //  Update Zustand state
      >
        <option value="">All Modes</option> {/* Option to reset filter */}
        {studyModes.map((mode, index) => (
          <option key={index} value={mode}>{mode}</option>
        ))}
      </select>
      <h3 className="text-lg font-semibold mt-4">Filter by Budget</h3>
      <label className="block text-sm font-medium">Select Currency</label>
      <select className="w-full p-2 border rounded">
        {currencies.map((currency, index) => (
          <option key={index} value={currency}>{currency}</option>
        ))}
      </select>
      <div>
        <label className="block text-sm font-medium mt-2">Enter Minimum Budget</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          placeholder="Min Budget"
          value={minBudget || ""}
          onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : null)}
        />

        <label className="block text-sm font-medium mt-2">Enter Maximum Budget</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          placeholder="Max Budget"
          value={maxBudget || ""}
          onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : null)}
        />

        <label className="block text-sm font-medium mt-2">Select Budget Range</label>
        <select
          className="w-full p-2 border rounded"
        // value={selectedRange}
        // onChange={(e) => handleRangeChange(e.target.value)}
        >
          <option value="">Select Range</option>
          {budgetRanges.map((range, index) => (
            <option key={index} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
