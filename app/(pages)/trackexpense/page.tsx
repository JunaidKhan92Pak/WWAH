"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoShareAndroid } from "react-icons/go";
import { PiPersonSimpleCircleLight } from "react-icons/pi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUniversityStore } from "@/store/useUniversitiesStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useExpenseStore } from "@/store/trackexpenes";
import { BsBagCheck } from "react-icons/bs";
import { TbCloudStorm } from "react-icons/tb";
import { IoDiamondOutline } from "react-icons/io5";

// Static country images
const images = [
  { src: "/countryarchive/uk_logo.png", name: "UK", alt: "United Kingdom" },
  { src: "/countryarchive/usa_logo.png", name: "USA", alt: "USA" },
  { src: "/countryarchive/aus_logo.png", name: "Australia", alt: "Australia" },
  { src: "/countryarchive/china_logo.png", name: "China", alt: "China" },
  { src: "/countryarchive/canada_logo.png", name: "Canada", alt: "Canada" },
  // { src: "/japan.png", name: "Japan", alt: "Japan" },
  { src: "/countryarchive/ireland_logo.png", name: "Ireland", alt: "Ireland" },
  {
    src: "/countryarchive/nz_logo.png",
    name: "New Zealand",
    alt: "New Zealand",
  },
  { src: "/countryarchive/france_logo.png", name: "France", alt: "France" },
  { src: "/countryarchive/italy_logo.png", name: "Italy", alt: "Italy" },
  { src: "/countryarchive/my_logo.png", name: "Malaysia", alt: "Malaysia" },
  { src: "/countryarchive/france_logo.png", name: "France", alt: "France" },
];

// Dynamic mapping for lifestyle icons
const lifestyleIcons = {
  student_budget: BsBagCheck,
  moderate_lifestyle: TbCloudStorm,
  luxury_lifestyle: IoDiamondOutline,
};

// Define the shape for cost ranges
interface Cost {
  min: number;
  max: number;
}

// Reusable Breakdown Item Component
interface BreakdownItemProps {
  iconSrc: string;
  label: string;
  cost: Cost;
  bgColor: string;
  currency: string;
}
const BreakdownItem: React.FC<BreakdownItemProps> = ({
  iconSrc,
  label,
  cost,
  bgColor,
  currency,
}) => (
  <div className="flex-shrink-0 w-[calc(100%/3)] sm:w-auto flex flex-col items-center text-left md:text-center rounded-lg">
    <div
      className={`p-4 sm:px-12 sm:py-6 md:px-6 lg:px-8 xl:px-10 lg:py-8 rounded-xl ${bgColor}`}
    >
      <Image
        src={iconSrc}
        alt={label}
        width={300}
        height={300}
        className="h-6 w-6 md:w-6 md:h-6"
      />
    </div>
    <p className="font-bold mt-2">{label}</p>
    <p className="text-justify lg:text-center leading-4 md:leading-5 text-sm lg:text-md">
      {currency} {cost.min} - {cost.max}
    </p>
  </div>
);

const Page = () => {
  const { expenses, loading, error, setUniversity, fetchExpenses } =
    useExpenseStore();
  const { universities, fetchUniversities } = useUniversityStore();
  // Fetch universities on mount
  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Lifestyle selection
  const [selectedLifestyle, setSelectedLifestyle] = useState("student_budget");
  const selectedData =
    expenses &&
    expenses[0]?.lifestyles.find((life) => life.type === selectedLifestyle);
  // University search and dropdown state
  const [searchTermUni, setSearchTermUni] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // Memoize filtered universities for performance
  const filteredUniversities = useMemo(() => {
    return universities.filter(
      (uni) =>
        (!selectedCountry ||
          uni.country_name.toLowerCase() === selectedCountry.toLowerCase()) &&
        uni.university_name.toLowerCase().includes(searchTermUni.toLowerCase())
    );
  }, [universities, selectedCountry, searchTermUni]);

  const handleSelectUniversity = useCallback((universityName: string) => {
    setSearchTermUni(universityName);
    setIsDropdownOpen(false);
    setUniversity(universityName);
    fetchExpenses();
  }, []);

  const handleSelectCountry = useCallback((country: string) => {
    setSelectedCountry((prev) => (prev === country ? null : country));
    setSearchTermUni(""); // Reset search when country changes
  }, []);

  const [showData, setShowData] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const toggleOption = (option: string) => {
    setActiveOption((prev) => (prev === option ? null : option));
  };

  return (
    <>
      <section className="w-full mx-auto md:  mt-5">
        {/* Hero Section */}
        <div
          className="relative w-[90%] md:w-[95%] mx-auto md:h-[80vh] h-[270px] flex justify-center md:py-2 items-center text-center rounded-2xl text-white bg-cover bg-center"
          style={{ backgroundImage: "url('/heroimg.png')" }}
        >
          <div className="w-4/5 text-left my-5">
            <div className="md:w-1/2 flex flex-col">
              <div className="flex items-center gap-2 md:gap-5">
                <h1 className="text-white text-start font-bold">
                  Plan Your Study Abroad Living Expenses with Ease!
                </h1>
              </div>
              <p className="py-2 md:w-[80%]">
                Get complete estimates and budget smartly for housing, food,
                travel, and more.
              </p>
              {/* <Button id="calculate" className="bg-red-700 w-36 md:mt-2">
                Calculate Now
              </Button> */}
              <Button
                className="bg-red-700 w-36 md:mt-2"
                onClick={() => {
                  const section = document.getElementById("calculate");
                  if (section) {
                    const offset = 100; // Adjust based on your navbar height
                    const elementPosition =
                      section.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                Calculate Now
              </Button>
            </div>
          </div>
        </div>

        <section>
          {/* Additional Section */}
          <div className="w-full md:w-3/5 md:mt-6 mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 bg-white text-center">
            <div className="mx-auto mb-4 w-4/5">
              <h2 className="text-gray-800 tracking-normal font-extrabold">
                Understand Your Living Costs in Just a Few Simple Steps!
              </h2>
            </div>
            <div className="w-full mx-auto">
              <p className="text-[#313131] text-justify lg:text-center">
                Planning your study abroad journey? We&#39;ve made budgeting
                easy! With our living expense calculator, you can break down
                your expected costs in no time. Just follow these quick steps to
                get an accurate snapshot of your monthly expenses for housing,
                food, transportation, and more.
              </p>
            </div>
          </div>

          {/* Cards Image Section */}
          <div className="flex justify-center items-start mb-10">
            <div className="w-full xl:w-3/5">
              <Image
                src="/img7.png"
                alt="Background"
                layout="responsive"
                width={150}
                height={100}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        <section id="calculate">
          {/* <div className="w-full min-h-screen bg-[#FCE7D2] relative lg:px-8"> */}
          <div className="relative w-full h-auto mt-10 flex items-center justify-center px-4 sm:px-8 md:px-12">
            <div className="absolute top-0 left-0 w-full h-full z-0">
              <Image
                src="/bg-usa.png"
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 z-0 bg-[#FCE7D2]"
              />
            </div>
            {/* Background Overlay */}
            <div className="absolute top-0 left-0 w-full h-full z-0"></div>
            <div className="absolute inset-0 bg-[#FCE7D2] opacity-80 z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full mx-auto p-6">
              <div className="w-full md:w-[50%] md:space-y-2">
                {/* Country Selection */}
                <section>
                  <h3 className="font-bold text-gray-800">Country Selection</h3>
                  <div className="w-full">
                    <Carousel opts={{ align: "start" }} className="w-full p-2">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem
                            key={index}
                            className="basis-1/4 md:basis-1/4 lg:basis-1/6 2xl:basis-1/12"
                          >
                            <div className="flex aspect-square items-center justify-center">
                              <div className="flex flex-col items-center">
                                <div className="w-[60px] flex justify-center items-center">
                                  <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={200}
                                    height={200}
                                    onClick={() =>
                                      handleSelectCountry(image.name)
                                    }
                                    className={`md:w-10 w-8 rounded-full cursor-pointer ${
                                      selectedCountry === image.name
                                        ? "border-[#F0851D] border-2"
                                        : "border-0"
                                    }`}
                                  />
                                </div>
                                <p className="pt-2 tracking-wide text-center text-[8px] font-bold md:text-[13px]">
                                  {image.name}
                                </p>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </section>

                {/* Filter by University */}
                <div
                  className="p-4 border rounded bg-[#FCE7D2]/50 shadow-md relative backdrop-blur-60"
                  ref={dropdownRef}
                >
                  <h3 className="text-lg font-semibold">
                    Filter by University
                  </h3>
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
                  {isDropdownOpen && (
                    <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                      {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((uni, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              handleSelectUniversity(uni.university_name)
                            }
                          >
                            {uni.university_name} ({uni.country_name})
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">
                          No universities found
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Accommodation Type */}
                <div>
                  <h5 className="text-gray-800 mb-2 mt-4">
                    Accommodation Type
                  </h5>
                  {/* <div className="grid grid-cols-2 gap-6">
                    <button className="flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <GoShareAndroid className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Shared</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>
                    <button className="flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <PiPersonSimpleCircleLight className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Single</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>
                  </div> */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => toggleOption("shared")}
                      className={`flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg ${
                        activeOption === "shared" ? "bg-gray-100" : ""
                      }`}
                    >
                      <GoShareAndroid className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Shared</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => toggleOption("single")}
                      className={`flex flex-col items-center px-6 py-4 border border-gray-300 rounded-lg ${
                        activeOption === "single" ? "bg-gray-100" : ""
                      }`}
                    >
                      <PiPersonSimpleCircleLight className="w-8 h-8 mb-2" />
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 font-normal">Single</p>
                        <p className="text-gray-700 font-normal">
                          Accommodation
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
                {/* Lifestyle Selection */}
                {/* <div>
                  <h5 className="text-gray-800 mt-4 mb-2">Lifestyle</h5>
                  <div className="grid grid-cols-2 gap-6">
                    {expenses && expenses[0]?.lifestyles.map(
                        (lifestyle: { type: keyof typeof lifestyleIcons }) => {
                          const LifestyleIcon = lifestyleIcons[lifestyle.type] || BsBagCheck;
                          return (
                            <button
                              key={lifestyle.type}
                              className={`flex flex-col items-center px-2 py-4 border border-gray-300 rounded-lg hover:bg-gray-100 w-full ${
                                lifestyle.type === "luxury_lifestyle"
                                  ? "col-span-2"
                                  : "col-span-1"
                              } ${
                                selectedLifestyle === lifestyle.type
                                  ? "bg-gray-100"
                                  : "bg-none"
                              }`}
                              onClick={() =>
                                setSelectedLifestyle(lifestyle.type)
                              }
                            >
                              <LifestyleIcon className="w-8 h-8 mb-2 text-gray-700" />
                              <p className="font-normal text-gray-700">
                                {lifestyle.type.replace("_", " ").toUpperCase()}
                              </p>
                            </button>
                          );
                        }
                      )}
                  </div>
                </div> */}
                <div className="mt-6">
                  <h5 className="text-gray-800 mb-2">Lifestyle</h5>
                  <div className="grid grid-cols-2 gap-6">
                    {(expenses && expenses[0]?.lifestyles?.length > 0
                      ? expenses[0].lifestyles
                      : [
                          { type: "basic_lifestyle" },
                          { type: "moderate_lifestyle" },
                          { type: "luxury_lifestyle" },
                        ]
                    ).map(
                      (lifestyle: { type: keyof typeof lifestyleIcons }) => {
                        const LifestyleIcon =
                          lifestyleIcons[lifestyle.type] || BsBagCheck;
                        return (
                          <button
                            key={lifestyle.type}
                            className={`flex flex-col items-center px-2 py-4 border border-gray-300 rounded-lg hover:bg-gray-100 w-full ${
                              lifestyle.type === "luxury_lifestyle"
                                ? "col-span-2"
                                : "col-span-1"
                            } ${
                              selectedLifestyle === lifestyle.type
                                ? "bg-gray-100"
                                : "bg-none"
                            }`}
                            onClick={() => setSelectedLifestyle(lifestyle.type)}
                          >
                            <LifestyleIcon className="w-8 h-8 mb-2 text-gray-700" />
                            <p className="font-normal text-gray-700">
                              {lifestyle.type.replace("_", " ").toUpperCase()}
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="w-full flex items-center justify-center">
                  <Button
                    className="px-8 mt-3 sm:mt-2 bg-red-700 hover:bg-red-800"
                    onClick={() => setShowData(true)}
                  >
                    Calculate
                  </Button>
                </div>
                {/* Right Section - Results */}
              </div>
              <div className="flex flex-col justify-around w-full md:w-[50%] bg-white px-2 md:p-6 rounded-lg">
                {loading ? (
                  <p>Loading expenses...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : showData && selectedData ? (
                  <>
                    <div>
                      <h4 className="w-full md:w-4/5 font-bold text-gray-800 my-4">
                        Your Estimated Living Expense will be:
                      </h4>
                      <input
                        value={`${selectedData.currency} ${selectedData.total_estimated_cost.min} - ${selectedData.total_estimated_cost.max}`}
                        type="text"
                        disabled
                        placeholder="£ 1140 - 1840"
                        className="w-full border border-gray-300 rounded-lg text-start font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 px-4 py-2"
                      />
                      <p className="text-[#9D9D9D] text-[14px] pt-4">
                        = (PKR 517,334 - PKR 661,038)
                      </p>
                    </div>
                    <div className="bg-[#F1F1F1] rounded-2xl md:px-2 lg:px-5">
                      <h3 className="font-bold text-center pt-4 sm:py-6">
                        Breakdown
                      </h3>
                      <div
                        className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 lg:gap-y-8 gap-y-3 lg:px-4 sm:py-6 py-4 rounded-lg"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <BreakdownItem
                          iconSrc="/trackexpense/rent.png"
                          label="Rent"
                          cost={selectedData.rent}
                          bgColor="bg-[#F4D0D2]"
                          currency={selectedData.currency}
                        />
                        <BreakdownItem
                          iconSrc="/trackexpense/utilities.png"
                          label="Utilities"
                          cost={selectedData.utilities}
                          bgColor="bg-[#FCE7D2]"
                          currency={selectedData.currency}
                        />
                        <BreakdownItem
                          iconSrc="/trackexpense/internet.png"
                          label="Internet"
                          cost={selectedData.internet}
                          bgColor="bg-[#F4D0D2]"
                          currency={selectedData.currency}
                        />
                        <BreakdownItem
                          iconSrc="/trackexpense/mobile.png"
                          label="Mobile"
                          cost={selectedData.mobile}
                          bgColor="bg-[#FCE7D2]"
                          currency={selectedData.currency}
                        />
                        <BreakdownItem
                          iconSrc="/trackexpense/Groceries.png"
                          label="Groceries"
                          cost={selectedData.groceries}
                          bgColor="bg-[#F4D0D2]"
                          currency={selectedData.currency}
                        />
                        <BreakdownItem
                          iconSrc="/trackexpense/transport.png"
                          label="Public Transport"
                          cost={selectedData.public_transport}
                          bgColor="bg-[#FCE7D2]"
                          currency={selectedData.currency}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-around w-full bg-white px-2 p-4 lg:p-6 rounded-lg space-y-4">
                    <h4 className="w-full lg:w-2/3 font-bold text-gray-800 leading-tight">
                      Your Estimated Living Expense will be:
                    </h4>
                    <input
                      type="text"
                      disabled
                      placeholder="EX: £ 0 - 100"
                      className="w-full border border-gray-300 rounded-lg text-start font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 px-4 py-2"
                    />
                    <p className="text-gray-500 ">
                      = (PKR 517,334 - PKR 661,038)
                    </p>
                    <div className=" bg-gray-100 rounded-lg p-2 md:p-6">
                      <div className="flex justify-center">
                        <Image
                          src="/trackexpense/calculator.svg"
                          alt="Calculator Illustration"
                          width={200}
                          height={200}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-gray-700  text-center font-semibold">
                        Your Expense Breakdowns will be shown here...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Page;
