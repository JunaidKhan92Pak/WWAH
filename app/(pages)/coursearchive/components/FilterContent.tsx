"use client";
import {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Range, getTrackBackground } from "react-range";
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
const intakeMonths = [
  "January to April",
  "May to September",
  "October to December",
];
const studyModes = [
  "On Campus",
  "Online",
  "Hybrid",
  "Distance Learning",
  "Blended",
];
const currencies = [
  "US Dollar ($)",
  "Euro (€)",
  "British Pound (£)",
  "Canadian Dollar (CA$)",
  "Australian Dollar (A$)",
  "New Zealand Dollar (	NZ$)",
  "Indian Rupee (₹)",
  "Chinese Yuan (¥)",
  "Malaysian Ringgit (RM)",
  "Pakistani Rupees (PKR)",
];
// New filter options for Subject Area
const subjectAreas = [
  "Physics",
  "Chemistry",
  "Biology",
  "Earth & Environmental Sciences",
  "Astronomy",
  "Biotechnology",
  "Geology",
  "Oceanography",
  "Computer Science",
  "Information Technology",
  "Artificial Intelligence (AI)",
  "Cybersecurity",
  "Data Science & Analytics",
  "Software Engineering",
  "Game Development",
  "Engineering",
  "Robotics & Automation",
  "Mathematics",
  "Statistics",
  "Actuarial Science",
  "Medicine (MBBS, MD)",
  "Dentistry",
  "Nursing",
  "Pharmacy",
  "Physiotherapy",
  "Public Health",
  "Veterinary Science",
  "Biochemistry",
  "Molecular Biology",
  "Neuroscience",
  "Genetics",
  "Microbiology",
  "Immunology",
  "Radiology & Medical Imaging",
  "Nutrition & Dietetics",
  "Occupational Therapy",
  "Speech & Language Therapy",
  "Business Administration",
  "Marketing",
  "Human Resource Management",
  "Operations Management",
  "Supply Chain Management",
  "Financial Management",
  "Investment & Asset Management",
  "Banking & Risk Management",
  "Accounting & Auditing",
  "Economics",
  "Law",
  "International Law",
  "Political Science",
  "Public Administration",
  "International Relations",
  "Psychology",
  "Social Work",
  "Graphic Design",
  "Fashion Design",
  "Interior Design",
  "Architecture",
  "Theatre & Drama",
  "Film & Television",
  "Music Performance & Production",
  "Dance",
  "Journalism",
  "Public Relations (PR)",
  "Digital Media",
  "Advertising",
  "Education & Pedagogy",
  "Agricultural Sciences",
  "Food Science & Technology",
  "Tourism & Travel Management",
  "Event Management",
  "Culinary Arts",
  "Gender Studies",
  "Visual Arts",
  "Sports and Exercise Sciences",
  "Media & Communication",
];
const MIN = 0;
const MAX = 50000;
export default function FilterContent() {
  const { universities, setSearch, setCountry, fetchUniversities, loading } =
    useUniversityStore();
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
    setSubjectAreaFilter,
    subjectAreaFilter,
  } = useCourseStore();
  // const [localMinBudget, setLocalMinBudget] = useState(minBudget || 0);
  // const [localMaxBudget, setLocalMaxBudget] = useState(maxBudget || 0);
  const [values, setValues] = useState<number[]>([
    minBudget || MIN,
    maxBudget || MAX,
  ]);

  // Debounced store updates
  const debouncedUpdateMinBudget = useCallback(
    debounce((value: number) => {
      setMinBudget(value);
    }, 500),
    [setMinBudget]
  );

  const debouncedUpdateMaxBudget = useCallback(
    debounce((value: number) => {
      setMaxBudget(value);
    }, 500),
    [setMaxBudget]
  );

  // Sync with store updates
  useEffect(() => {
    setValues([minBudget || MIN, maxBudget || MAX]);
  }, [minBudget, maxBudget]);

  const handleSliderChange = (vals: number[]) => {
    setValues(vals);
    debouncedUpdateMinBudget(vals[0]);
    debouncedUpdateMaxBudget(vals[1]);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const clamped = Math.min(val, values[1] - 1);
    setValues([clamped, values[1]]);
    debouncedUpdateMinBudget(clamped);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const clamped = Math.max(val, values[0] + 1);
    setValues([values[0], clamped]);
    debouncedUpdateMaxBudget(clamped);
  };
  useEffect(() => {
    setValues([minBudget || MIN, maxBudget || MAX]);
  }, [minBudget, maxBudget]);

  const [searchTerm, setSearchTerm] = useState("");
  const studyDestinations = useMemo(
    () => [
      "USA",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "New Zealand",
    ],
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    []
  );
  const handleCheckboxChange = useCallback(
    (destination: string) => {
      if (destination === "All") {
        if (countryFilter.length === studyDestinations.length) {
          setCountryFilter([]); // Uncheck all
        } else {
          setCountryFilter(studyDestinations); // Select all
        }
      } else {
        const updatedSelected = countryFilter.includes(destination)
          ? countryFilter.filter((item) => item !== destination)
          : [...countryFilter, destination];
        setCountryFilter(updatedSelected);
      }
    },
    [countryFilter, setCountryFilter, studyDestinations]
  );
  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);
  useEffect(() => {
    if (universities.length === 0) {
      fetchUniversities().catch((error) => {
        console.error("Failed to fetch universities:", error);
        // Display an error message to the user if needed
      });
    }
  }, [fetchUniversities, universities.length]);
  const handleSelect = useCallback(
    (universityName: string) => {
      setSelectedUniversity(universityName);
      setSearch(""); // Clear input after selection
      setIsDropdownOpen(false);
    },
    [setSelectedUniversity, setSearch]
  );
  useEffect(() => {
    const handler = setTimeout(() => {
      setCountry(countryFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [countryFilter, setCountry]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // New handler for Subject Area checkboxes
  const handleSubjectCheckboxChange = useCallback(
    (subject: string) => {
      if (subject === "All") {
        if (subjectAreaFilter.length === subjectAreas.length) {
          setSubjectAreaFilter([]); // Uncheck all
        } else {
          setSubjectAreaFilter(subjectAreas); // Select all
        }
      } else {
        const updatedSelected = subjectAreaFilter.includes(subject)
          ? subjectAreaFilter.filter((item) => item !== subject)
          : [...subjectAreaFilter, subject];
        setSubjectAreaFilter(updatedSelected);
      }
    },
    [subjectAreaFilter, setSubjectAreaFilter]
  );
  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg h-full overflow-y-auto">
      {/* Study Destinations */}
      <FilterSection title="Study Destination">
        <input
          type="text"
          placeholder="Search Study Destinations..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
          aria-label="Search Study Destinations"
        />
        <div className="mt-4 space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={countryFilter.length === studyDestinations.length}
              onChange={() => handleCheckboxChange("All")}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              aria-label="Select All Destinations"
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
                  aria-label={`Select ${destination}`}
                />
                <span className="text-gray-700">{destination}</span>
              </label>
            ))}
        </div>
      </FilterSection>
      {/* Study Level */}
      <FilterSection title="Study Level">
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="studyLevel"
              value=""
              checked={studyLevel === ""}
              onChange={() => setStudyLevel("")}
              className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              aria-label="None"
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
                aria-label={`Select ${level}`}
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      {/* Subject Area Filter */}
      <FilterSection title="Subject Area">
        <div className="space-y-3 max-h-80 overflow-y-auto scroll-smooth overflow-hidden p-2 border border-gray-300 rounded-md">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={subjectAreaFilter.length === subjectAreas.length}
              onChange={() => handleSubjectCheckboxChange("All")}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              aria-label="Select All Subject Areas"
            />
            <span className="text-gray-700">All</span>
          </label>
          {subjectAreas.map((subject) => (
            <label key={subject} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={subjectAreaFilter.includes(subject)}
                onChange={() => handleSubjectCheckboxChange(subject)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label={`Select ${subject}`}
              />
              <span className="text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      {/* Filter by University */}
      <div
        className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 relative"
        ref={dropdownRef}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filter by University
        </h3>
        <input
          type="text"
          placeholder="Search or select a university..."
          value={localSearch}
          onChange={(e) => {
            const value = e.target.value;
            setLocalSearch(value);
            debouncedSetSearch(value); // Use the debounced function
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
          aria-label="Search or select a university"
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
                  role="option"
                  aria-selected={selectedUniversity === uni.university_name}
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
          <p className="mt-3 text-sm text-gray-600">
            Selected: {selectedUniversity}
          </p>
        )}
      </div>
      {/* Filter by Intake Year */}
      <FilterSection title="Filter by Intake Year">
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          value={intakeYear}
          onChange={(e) => setIntakeYear(e.target.value)}
          aria-label="Select Intake Year"
        >
          <option value="">All Years</option>
          {intakeYears.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </FilterSection>
      {/* Filter by Intake Month */}
      <FilterSection title="Filter by Intake Month">
        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
          {intakeMonths.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </FilterSection>
      {/* Filter by Mode of Study */}
      <FilterSection title="Filter by Mode of Study">
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          value={studyMode}
          onChange={(e) => setStudyMode(e.target.value)}
          aria-label="Select Mode of Study"
        >
          <option value="">All Modes</option>
          {studyModes.map((mode, index) => (
            <option key={index} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </FilterSection>
      {/* Filter by Budget */}
      <FilterSection title="Filter by Budget">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Currency
        </label>
        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700">
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <div className="mt-4 space-y-6">
          {/* Inputs */}
          <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <input
                  type="number"
                  value={values[0]}
                  onChange={handleMinChange}
                  className="w-full text-center text-2xl font-medium focus:outline-none"
                  min={MIN}
                  max={values[1] - 1}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <input
                  type="number"
                  value={values[1]}
                  onChange={handleMaxChange}
                  className="w-full text-center text-2xl font-medium focus:outline-none"
                  min={values[0] + 1}
                  max={MAX}
                />
              </div>
            </div>
          </div>
          {/* React-Range Slider */}
          <div className="mt-6 px-4">
            <Range
              step={100}
              min={MIN}
              max={MAX}
              values={values}
              onChange={handleSliderChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    background: getTrackBackground({
                      values,
                      colors: ["#d1d5db", "#0ea5e9", "#d1d5db"],
                      min: MIN,
                      max: MAX,
                    }),
                    borderRadius: "9999px",
                  }}
                  className="my-6"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "15px",
                    width: "15px",
                    borderRadius: "50%",
                    backgroundColor: "#0ea5e9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px #aaa",
                  }}
                ></div>
              )}
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}
function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </section>
  );
}
