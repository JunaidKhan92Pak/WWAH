"use client";
import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUniversityStore } from "@/store/useUniversitiesStore";
import { SkeletonCard } from "@/components/skeleton";
import { debounce } from "lodash";
import ImageWithLoader from "@/components/ImageWithLoader";

const Page = () => {
  const countries = [
    { name: "USA", value: "USA", img: "/countryarchive/usa_logo.png" },
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

  // Get zustand store values including pagination states
  const {
    universities,
    setSearch,
    country,
    setCountry,
    fetchUniversities,
    loading,
    totalPages,
  } = useUniversityStore();

  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fetch universities when the component mounts or when currentPage changes
  useEffect(() => {
    fetchUniversities(currentPage);
  }, [currentPage, fetchUniversities]);

  // Handle Search with debounce
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  // Handle checkbox changes for country filtering
  function handleCheckboxChange(destination: string): void {
    if (destination === "All") {
      if (country.length === country.length) {
        setCountry([]); // Uncheck all
      } else {
        setCountry(country); // Select all
      }
    } else {
      const updatedSelected = country.includes(destination)
        ? country.filter((item) => item !== destination)
        : [...country, destination];
      setCountry(updatedSelected);
    }
  }
  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/Universities/${id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
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
  const displayedUniversities = showFavorites
    ? universities.filter((uni) => favorites[uni._id])
    : universities;
  return (
    <section className="w-[90%] mx-auto">
      <div className="md:flex md:justify-between py-5 md:pt-10 gap-4">
        <h3 className="font-bold">Discover Universities Worldwide</h3>
        <div className="flex flex-col md:flex-row md:tems-center gap-3">
          <div className="w-[70%] flex bg-[#F1F1F1] rounded-lg h-10 ">
            <Image
              src="/search.svg"
              width={16}
              height={16}
              alt="search"
              className="ml-2"
            />
            <Input
              placeholder="Search..."
              onChange={(e) => {
                const value = e.target.value;
                setLocalSearch(value);
                handleSearch(value);
              }}
              value={localSearch}
              className="border-none bg-[#F1F1F1] placeholder:text-[13px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
              aria-label="Search Universities"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm text-gray-600 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[50%] h-10">
              <Image src="/filterr.svg" width={16} height={14} alt="filter" />
              Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 h-[260px]">
              <ScrollArea className="p-2">
                <p className="text-[16px]">Countries:</p>
                <ul className="py-2 space-y-4">
                  {countries.map((c, indx) => (
                    <li key={indx} className="flex justify-between">
                      <div className="flex gap-2">
                        <Image
                          src={c.img}
                          width={30}
                          height={30}
                          alt={c.name}
                        />
                        <label htmlFor={c.value}>{c.name}</label>
                      </div>
                      <input
                        type="checkbox"
                        id={c.value}
                        onChange={() => handleCheckboxChange(c.value)}
                        // Check if the store's country state includes this country's value
                        checked={country.includes(c.value)}
                        className="mr-2"
                      />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Favorites Button (Static) */}
          {/* <button className="text-sm text-gray-600 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[50%] h-10">
            <Image src="/hearti.svg" width={20} height={18} alt="favorites" />
            Favorites
          </button> */}
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className={`text-sm flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[50%] h-10 ${showFavorites ? "text-red-500 font-bold" : "text-gray-600"
              }`}
          >
            <Image src="/hearti.svg" width={20} height={18} alt="favorites" />
            {showFavorites ? "Show All" : "Favorites"}
          </button>
        </div>
      </div>
      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-2">
            {displayedUniversities.length === 0 ? (
              <p className="text-[20px] font-semibold col-span-4 text-center p-4">
                {showFavorites
                  ? "No Favorite Universities Found"
                  : "No Universities Found"}
              </p>
            ) : (
              displayedUniversities.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden p-3"
                >
                  <div className="relative h-[200px]">
                    <div className="absolute z-10 top-5 left-0 bg-gradient-to-r from-[#FCE7D2] to-[#CEC8C3] px-2 rounded-tr-xl w-1/2">
                      <p className="text-sm font-medium">
                        QS World Ranking: {item.qs_world_university_ranking || "N/A"}
                      </p>
                      <p className="text-sm font-semibold">
                        {/* Ranking: {item.times_higher_education_ranking || "N/A"} */}
                      </p>
                    </div>

                    {/* Share & Favorite Buttons */}
                    <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-white bg-opacity-50 backdrop-blur-sm rounded-md">
                      <button onClick={() => copyToClipboard(item._id)}>
                        <Image
                          src="/share.svg"
                          width={20}
                          height={20}
                          alt="Share"
                        />
                      </button>

                      <button onClick={() => toggleFavorite(item._id)}>
                        {favorites[item._id] ? (
                          <Image
                            src="/redheart.svg"
                            width={20}
                            height={20}
                            alt="Favorite"
                          />
                        ) : (
                          <Image
                            src="/whiteheart.svg"
                            width={20}
                            height={20}
                            alt="Favorite"
                          />
                        )}
                      </button>
                    </div>

                    <ImageWithLoader
                      src={item.universityImages?.banner ?? "/banner.jpg"}
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                      className="h-[180px] w-[400px] object-cover rounded-xl"
                      alt={`${item.university_name} Banner`}
                    />
                    <div className="absolute bottom-1 left-5">
                      <Image
                        src={item.universityImages?.logo ?? "/banner.jpg"}
                        width={100}
                        height={90}
                        className="rounded-full bg-white border border-black w-[56px] h-[56px]"
                        alt="University Logo"
                      />
                    </div>
                  </div>

                  <div className="px-4 h-[80px] flex flex-col justify-between">
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/Universities/${item._id}`}
                      key={item._id}
                    >
                      <p className="font-bold hover:underline underline-offset-2">
                        {item.university_name}
                      </p>

                    </Link>

                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">
                        {item.country_name}
                      </p>
                      <p className="text-sm text-gray-600">Public</p>
                    </div>
                  </div>

                  <hr className="mx-4 my-3" />
                  <p className="text-sm font-bold pb-2">Acceptance Rate:</p>
                  <div className="relative bg-[#F1F1F1] rounded-md h-7">
                    <div
                      className="bg-[#16C47F] text-white flex items-center justify-center h-7 rounded-lg"
                      style={{ width: item.acceptance_rate }}
                    >
                      <p className="text-sm font-normal">
                        {item.acceptance_rate}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center my-6 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Page;
