"use client";
import { useState, ChangeEvent, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { useCourseStore } from "@/store/useCoursesStore";
import { useUniversityStore } from "@/store/useUniversitiesStore";

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

export default function FilterContent() {
  const { universities, search, setSearch, setCountry, fetchUniversities, loading } = useUniversityStore();
  const {
    minBudget,
    maxBudget,
    setMinBudget,
    setMaxBudget,
    selectedUniversity,
    setSelectedUniversity,
    studyMode,
    setStudyMode,
    countryFilter,
    setCountryFilter,
    studyLevel,
    setStudyLevel,
    intakeYear,
    setIntakeYear,

  } = useCourseStore();

  // Local state for budget inputs to allow immediate UI feedback
  const [localMinBudget, setLocalMinBudget] = useState(minBudget || 0);
  const [localMaxBudget, setLocalMaxBudget] = useState(maxBudget || 100000);

  const [searchTerm, setSearchTerm] = useState("");
  const studyDestinations = ["USA", "United Kingdom", "Canada", "Australia", "Germany"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounced functions for updating the global budget state
  const debouncedUpdateMinBudget = useCallback(
    debounce((value: number) => {
      setMinBudget(value);
    }, 300),
    [setMinBudget]
  );

  const debouncedUpdateMaxBudget = useCallback(
    debounce((value: number) => {
      setMaxBudget(value);
    }, 300),
    [setMaxBudget]
  );

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
      setCountryFilter(updatedSelected);
    }
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    if (universities.length === 0) {
      fetchUniversities(); // Fetch only if the list is empty
    }
  }, []);

  const handleSelect = (universityName: string) => {
    setSelectedUniversity(universityName);
    setSearch(""); // Clear input after selection
    setIsDropdownOpen(false);
  };

  // Debounce the update of the country filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setCountry(countryFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [countryFilter]);

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

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      {/* Study Destinations */}
      <section className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          Study Destination
        </label>
        <input
          type="text"
          placeholder="Search Study Destinations..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
        />
        <div className="mt-4 space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={countryFilter.length === studyDestinations.length}
              onChange={() => handleCheckboxChange("All")}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">All</span>
          </label>
          {studyDestinations
            .filter((destination) =>
              destination.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((destination) => (
              <label key={destination} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={countryFilter.includes(destination)}
                  onChange={() => handleCheckboxChange(destination)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{destination}</span>
              </label>
            ))}
        </div>
      </section>

      {/* Study Level */}
      <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Level</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="studyLevel"
              value=""
              checked={studyLevel === ""}
              onChange={() => setStudyLevel("")}
              className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">None</span>
          </label>
          {studyLevels.map((level) => (
            <label key={level} className="flex items-center space-x-3">
              <input
                type="radio"
                name="studyLevel"
                value={level}
                checked={studyLevel === level}
                onChange={() => setStudyLevel(level)}
                className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Filter by University */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 relative" ref={dropdownRef}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by University</h3>
        <input
          type="text"
          placeholder="Search or select a university..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
        />
        {isDropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48 overflow-y-auto">
            {loading ? (
              <li className="p-3 text-gray-500">Loading...</li>
            ) : universities.length > 0 ? (
              universities.map((uni, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                  onClick={() => handleSelect(uni.university_name)}
                >
                  {uni.university_name} ({uni.country_name})
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No universities found</li>
            )}
          </ul>
        )}
        {selectedUniversity && (
          <p className="mt-3 text-sm text-gray-600">Selected: {selectedUniversity}</p>
        )}
      </div>

      {/* Filter by Intake Year */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Intake Year</h3>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          value={intakeYear}
          onChange={(e) => setIntakeYear(e.target.value)}
        >
          <option value="">All Years</option>
          {intakeYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Filter by Intake Month */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Intake Month</h3>
        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
          {intakeMonths.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Filter by Mode of Study */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Mode of Study</h3>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          value={studyMode}
          onChange={(e) => setStudyMode(e.target.value)}
        >
          <option value="">All Modes</option>
          {studyModes.map((mode, index) => (
            <option key={index} value={mode}>{mode}</option>
          ))}
        </select>
      </div>

      {/* Filter by Budget */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Budget</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Currency</label>
        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>{currency}</option>
          ))}
        </select>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Minimum Budget</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              placeholder="Min Budget"
              value={localMinBudget}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 5000;
                setLocalMinBudget(value);
                debouncedUpdateMinBudget(value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Maximum Budget</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              placeholder="Max Budget"
              value={localMaxBudget}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 50000;
                setLocalMaxBudget(value);
                debouncedUpdateMaxBudget(value);
              }}
            />
          </div>
          {/* Min-Max Range Bar */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Budget Range</label>
            <div className="flex items-center justify-between text-gray-700 text-sm mb-2">
              <span>${localMinBudget}</span>
              <span>${localMaxBudget}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={50000}
              step={500}
              value={localMinBudget}
              onChange={(e) => {
                const value = Number(e.target.value);
                setLocalMinBudget(value);
                debouncedUpdateMinBudget(value);
              }}
              className="w-full cursor-pointer"
            />
            <input
              type="range"
              min={5000}
              max={50000}
              step={500}
              value={localMaxBudget}
              onChange={(e) => {
                const value = Number(e.target.value);
                setLocalMaxBudget(value);
                debouncedUpdateMaxBudget(value);
              }}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
