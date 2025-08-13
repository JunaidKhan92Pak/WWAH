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
  "Earth and Environmental Sciences",
  "Astronomy",
  "Biotechnology",
  "Geology",
  "Oceanography",
  "Computer Science",
  "Information Technology",
  "Artificial Intelligence AI",
  "Cybersecurity",
  "Data Science and Analytics",
  "Software Engineering",
  "Game Development",
  "Engineering",
  "Robotics and Automation",
  "Mathematics",
  "Statistics",
  "Actuarial Science",
  "Medicine MBBS and MD",
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
  "Radiology",
  "Medical Imaging",
  "Nutrition and Dietetics",
  "Occupational Therapy",
  "Speech and Language Therapy",
  "Business Administration",
  "Marketing",
  "Human Resource Management",
  "Operations Management",
  "Supply Chain Management",
  "Financial Management",
  "Investment and Asset Management",
  "Banking",
  " Risk Management",
  "Accounting and  Auditing",
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
  "Theatre and Drama",
  "Film and Television",
  "Music Performance and Production",
  "Dance",
  "Journalism",
  "Public Relations (PR)",
  "Digital Media",
  "Advertising",
  "Education and Pedagogy",
  "Agricultural Sciences",
  "Food Science and Technology",
  "Tourism and Travel Management",
  "Event Management",
  "Culinary Arts",
  "Gender Studies",
  "Visual Arts",
  "Sports and Exercise Sciences",
  "Media and Communication",
];

const MIN = 0;
const MAX = 1000000;

export default function FilterContent() {
  const {
    filterUniversities,
    setSearch,
    setCountry,
    fetchAllUniversitiesForFilter,
    loading,
  } = useUniversityStore();
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

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, ""), 10) || 0;
  };

  const formatNumber = (value: number | string) => {
    return Number(value).toLocaleString("en-US");
  };

  const [values, setValues] = useState<number[]>([
    minBudget || MIN,
    maxBudget || MAX,
  ]);

  // Local state for immediate UI updates
  const [localStudyLevel, setLocalStudyLevel] = useState(studyLevel);
  const [localStudyMode, setLocalStudyMode] = useState(studyMode);
  const [localIntakeYear, setLocalIntakeYear] = useState(intakeYear);
  const [localCountryFilter, setLocalCountryFilter] = useState<string[]>(countryFilter);
  const [localSubjectAreaFilter, setLocalSubjectAreaFilter] = useState<string[]>(subjectAreaFilter);

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

  const debouncedUpdateStudyLevel = useCallback(
    debounce((value: string) => {
      setStudyLevel(value);
    }, 500),
    [setStudyLevel]
  );

  const debouncedUpdateStudyMode = useCallback(
    debounce((value: string) => {
      setStudyMode(value);
    }, 500),
    [setStudyMode]
  );

  const debouncedUpdateIntakeYear = useCallback(
    debounce((value: string) => {
      setIntakeYear(value);
    }, 500),
    [setIntakeYear]
  );

  const debouncedUpdateCountryFilter = useCallback(
    debounce((value: string[]) => {
      setCountryFilter(value);
    }, 500),
    [setCountryFilter]
  );

  const debouncedUpdateSubjectAreaFilter = useCallback(
    debounce((value: string[]) => {
      setSubjectAreaFilter(value);
    }, 500),
    [setSubjectAreaFilter]
  );

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    []
  );

  // Sync local state with store updates
  useEffect(() => {
    setValues([minBudget || MIN, maxBudget || MAX]);
  }, [minBudget, maxBudget]);

  useEffect(() => {
    setLocalStudyLevel(studyLevel);
  }, [studyLevel]);

  useEffect(() => {
    setLocalStudyMode(studyMode);
  }, [studyMode]);

  useEffect(() => {
    setLocalIntakeYear(intakeYear);
  }, [intakeYear]);

  useEffect(() => {
    setLocalCountryFilter(countryFilter);
  }, [countryFilter]);

  useEffect(() => {
    setLocalSubjectAreaFilter(subjectAreaFilter);
  }, [subjectAreaFilter]);

  const handleSliderChange = (vals: number[]) => {
    setValues(vals);
    debouncedUpdateMinBudget(vals[0]);
    debouncedUpdateMaxBudget(vals[1]);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsed = parseNumber(rawValue);
    const clamped = Math.min(parsed, values[1] - 1);
    setValues([clamped, values[1]]);
    debouncedUpdateMinBudget(clamped);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsed = parseNumber(rawValue);
    const clamped = Math.max(parsed, values[0] + 1);
    setValues([values[0], clamped]);
    debouncedUpdateMaxBudget(clamped);
  };

  const handleStudyLevelChange = (level: string) => {
    setLocalStudyLevel(level);
    debouncedUpdateStudyLevel(level);
  };

  const handleStudyModeChange = (mode: string) => {
    setLocalStudyMode(mode);
    debouncedUpdateStudyMode(mode);
  };

  const handleIntakeYearChange = (year: string) => {
    setLocalIntakeYear(year);
    debouncedUpdateIntakeYear(year);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const studyDestinations = useMemo(
    () => [
      "USA",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "New Zealand",
      "Ireland",
      "Malaysia",
      "Italy",
    ],
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const handleCheckboxChange = useCallback(
    (destination: string) => {
      let updatedSelected: string[];

      if (destination === "All") {
        if (localCountryFilter.length === studyDestinations.length) {
          updatedSelected = []; // Uncheck all
        } else {
          updatedSelected = studyDestinations; // Select all
        }
      } else {
        updatedSelected = localCountryFilter.includes(destination)
          ? localCountryFilter.filter((item) => item !== destination)
          : [...localCountryFilter, destination];
      }

      setLocalCountryFilter(updatedSelected);
      debouncedUpdateCountryFilter(updatedSelected);
    },
    [localCountryFilter, studyDestinations, debouncedUpdateCountryFilter]
  );

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setSearchTerm(val);
      debouncedSetSearch(val);
    },
    [debouncedSetSearch]
  );

  useEffect(() => {
    if (filterUniversities.length === 0) {
      fetchAllUniversitiesForFilter().catch((error) => {
        console.error("Failed to fetch universities:", error);
      });
    }
  }, [fetchAllUniversitiesForFilter, filterUniversities.length]);

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
      setCountry(localCountryFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [localCountryFilter, setCountry]);

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

  // Updated handler for Subject Area checkboxes with debouncing
  const handleSubjectCheckboxChange = useCallback(
    (subject: string) => {
      let updatedSelected: string[];

      if (subject === "All") {
        if (localSubjectAreaFilter.length === subjectAreas.length) {
          updatedSelected = []; // Uncheck all
        } else {
          updatedSelected = subjectAreas; // Select all
        }
      } else {
        updatedSelected = localSubjectAreaFilter.includes(subject)
          ? localSubjectAreaFilter.filter((item) => item !== subject)
          : [...localSubjectAreaFilter, subject];
      }

      setLocalSubjectAreaFilter(updatedSelected);
      debouncedUpdateSubjectAreaFilter(updatedSelected);
    },
    [localSubjectAreaFilter, debouncedUpdateSubjectAreaFilter]
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
              checked={localCountryFilter.length === studyDestinations.length}
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
                  checked={localCountryFilter.includes(destination)}
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
              checked={localStudyLevel === ""}
              onChange={() => handleStudyLevelChange("")}
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
                checked={localStudyLevel === level}
                onChange={() => handleStudyLevelChange(level)}
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
              checked={localSubjectAreaFilter.length === subjectAreas.length}
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
                checked={localSubjectAreaFilter.includes(subject)}
                onChange={() => handleSubjectCheckboxChange(subject)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label={`Select ${subject}`}
              />
              <span className="text-gray-700 text-[12px]">{subject}</span>
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
            debouncedSetSearch(value);
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
            ) : filterUniversities.length > 0 ? (
              filterUniversities.map((uni, index) => (
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
          value={localIntakeYear}
          onChange={(e) => handleIntakeYearChange(e.target.value)}
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
          value={localStudyMode}
          onChange={(e) => handleStudyModeChange(e.target.value)}
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
          <div className="flex justify-between items-center space-x-6">
            {/* Min Input */}
            <div className="flex-1 bg-white rounded-lg shadow p-2 text-center">
              <input
                type="text"
                value={formatNumber(values[0])}
                onChange={handleMinChange}
                className="w-full text-center text-xl font-medium focus:outline-none"
              />
            </div>

            {/* Max Input */}
            <div className="flex-1 bg-white rounded-lg shadow p-2 text-center">
              <input
                type="text"
                value={formatNumber(values[1])}
                onChange={handleMaxChange}
                className="w-full text-center text-xl font-medium focus:outline-none"
              />
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
                      colors: ["#d1d5db", "#F6B677", "#d1d5db"],
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
                    backgroundColor: "#F6B677",
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