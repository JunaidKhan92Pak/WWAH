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
import { useSearchParams } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiOutlineMail } from "react-icons/ai";
// import { TbBrandWhatsappFilled } from "react-icons/tb";
import { BsWhatsapp } from "react-icons/bs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FaFacebook } from "react-icons/fa";

const Page = () => {
  const countries = [
    { name: "USA", value: "USA", img: "/countryarchive/usa_logo.png" },
    { name: "China", value: "china", img: "/countryarchive/china_logo.png" },
    { name: "Canada", value: "canada", img: "/countryarchive/canada_logo.png" },
    { name: "Italy", value: "italy", img: "/countryarchive/italy_logo.png" },
    { name: "United Kingdom", value: "United Kingdom", img: "/ukflag.png" },
    {
      name: "Germany",
      value: "germany",
      img: "/countryarchive/ge_logo.png",
    },
    {
      name: "Ireland",
      value: "Ireland",
      img: "/countryarchive/ireland_logo.png",
    },
    { name: "Malaysia", value: "malaysia", img: "/countryarchive/my_logo.png" },
    {
      name: "New Zealand",
      value: "New Zealand",
      img: "/countryarchive/nz_logo.png",
    },
    {
      name: "Australia",
      value: "australia",
      img: "/countryarchive/australia_logo.png",
    },
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
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const initialCountrySet = React.useRef(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Handle country param from URL - consolidated logic from previous duplicate useEffects
  useEffect(() => {
    if (initialCountrySet.current) return;

    const countryParam = searchParams.get("country");
    if (countryParam && countryParam.length > 0) {
      // Find the country in our list to get the correct value (case insensitive)
      const countryObj = countries.find(
        (c) =>
          c.name.toLowerCase() === countryParam.toLowerCase() ||
          c.value.toLowerCase() === countryParam.toLowerCase()
      );

      if (countryObj) {
        initialCountrySet.current = true;
        setCountry([countryObj.value]);
      }
    }
  }, [searchParams, setCountry, countries]);

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
      if (country.length === countries.length) {
        setCountry([]); // Uncheck all
      } else {
        // Select all countries by mapping through the countries array
        setCountry(countries.map((c) => c.value));
      }
    } else {
      const updatedSelected = country.includes(destination)
        ? country.filter((item) => item !== destination)
        : [...country, destination];
      setCountry(updatedSelected);
    }
  }


  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [heartAnimation, setHeartAnimation] = useState<string | null>(null);

  // No need to load favorites from localStorage

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev, [id]: !prev[id] };

      // Update count
      const newCount = Object.values(updatedFavorites).filter(Boolean).length;
      setFavoritesCount(newCount);

      // Animate heart
      setHeartAnimation(id);
      setTimeout(() => setHeartAnimation(null), 1000);

      return updatedFavorites;
    });
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);
  // Filter universities by favorites if showFavorites is true
  const displayedUniversities = showFavorites
    ? universities.filter((uni) => favorites[uni._id])
    : universities;

  // Generate empty state message based on selected countries
  const getEmptyStateMessage = () => {
    if (showFavorites) {
      return "No Favorite Universities Found";
    } else if (country.length === 0 || country.length === countries.length) {
      return "No Universities Found";
    } else if (country.length === 1) {
      // Find the country name for the selected value
      const selectedCountry = countries.find((c) => c.value === country[0]);
      return `No universities found in ${selectedCountry?.name || country[0]}`;
    } else {
      return "No universities found for the selected countries";
    }
  };

  return (
    <section className="w-[90%] mx-auto">
      <div className="md:flex md:justify-between py-5 md:pt-10 gap-4">
        <h3 className="font-bold">Discover Universities Worldwide</h3>
        <div className="flex flex-col md:flex-row md:items-start gap-3">
          <div className="w-full md:w-[70%] flex bg-[#F1F1F1] rounded-lg h-10">
            <Image
              src="/search.svg"
              width={16}
              height={16}
              alt="search"
              className="ml-2"
              unoptimized
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
          <div className="flex flex-row gap-3 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-gray-600 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-full md:w-[60%] h-10">
                <Image src="/filterr.svg" width={16} height={14} alt="filter" />
                <div className="flex ">
                  Filter
                  {/* Always reserve space for count by using opacity instead of conditional rendering */}
                  <div
                    className="w-1/2 transition-opacity duration-200"
                    style={{ opacity: country.length > 0 ? 1 : 0 }}
                  >
                    {country.length > 0 ? `(${country.length})` : "(0)"}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 h-[260px]">
                <ScrollArea className="p-2">
                  <div className="flex justify-between">
                    <p>Countries:</p>
                    {/* Always reserve space for the clear button by using visibility instead of conditional rendering */}
                    <div
                      className="transition-opacity duration-200"
                      style={{
                        opacity: country.length > 0 && !showFavorites ? 1 : 0,
                      }}
                    >
                      <button
                        onClick={() => setCountry([])}
                        className="text-blue-500 hover:underline"
                        aria-hidden={!(country.length > 0 && !showFavorites)}
                        tabIndex={country.length > 0 && !showFavorites ? 0 : -1}
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
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
                          checked={country.includes(c.value)}
                          className="mr-2"
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setShowFavorites((prev) => !prev)}
              className={`text-sm flex items-center justify-start md:justify-center gap-1 xl:gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[82%] md:w-[95%] lg:w-[90%] xl:w-[70%] h-10 ${
                showFavorites ? "text-red-500 font-bold" : "text-gray-600"
              }`}
            >
              <Image
                src={favoritesCount > 0 ? "/redheart.svg" : "/hearti.svg"}
                width={20}
                height={18}
                alt="favorites"
              />
              {showFavorites ? "Show All" : "Favorites"}
              <span>({favoritesCount})</span>
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <SkeletonCard arr={12} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-2">
            {displayedUniversities.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8">
                <p className="text-[20px] font-semibold text-center text-gray-700">
                  {getEmptyStateMessage()}
                </p>
                {/* Use opacity for consistent layout */}
                <div
                  className="mt-4 transition-opacity duration-200 h-8"
                  style={{
                    opacity: country.length > 0 && !showFavorites ? 1 : 0,
                  }}
                >
                  {country.length > 0 && !showFavorites && (
                    <button
                      onClick={() => setCountry([])}
                      className="text-blue-500 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              displayedUniversities.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden p-3"
                >
                  <div className="relative h-[200px]">
                    <div className="absolute z-10 top-5 left-0 bg-gradient-to-r from-[#FCE7D2] to-[#CEC8C3] px-2 rounded-tr-xl w-1/2">
                      <p className="text-sm font-medium">
                        QS World Ranking:{" "}
                        {item.qs_world_university_ranking.toUpperCase() ||
                          "N/A"}
                      </p>
                    </div>

                    {/* Share & Favorite Buttons */}
                    <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-white bg-opacity-50 backdrop-blur-sm rounded-md">
                      {/* <Dialog>
                        <DialogTrigger asChild>
                          <button>
                            <Image
                              src="/share.svg"
                              width={20}
                              height={20}
                              alt="Share"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Share link</DialogTitle>
                            <DialogDescription>
                              Anyone who has this link will be able to view
                              this.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label
                                htmlFor={`link-${item._id}`}
                                className="sr-only"
                              >
                                Link
                              </Label>
                              <Input
                                id={`link-${item._id}`}
                                value={`${
                                  typeof window !== "undefined"
                                    ? window.location.origin
                                    : ""
                                }/Universities/${item._id}`}
                                readOnly
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="px-3"
                              onClick={() => {
                                const link = `${window.location.origin}/Universities/${item._id}`;
                                navigator.clipboard.writeText(link).then(() => {
                                  setCopiedLinkId(item._id);
                                  setTimeout(() => setCopiedLinkId(null), 2000); 
                                });
                              }}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy />
                            </Button>
                          </div>

                          {copiedLinkId === item._id && (
                            <p className="text-black text-sm mt-2">
                              Link copied to clipboard!
                            </p>
                          )}

                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button>
                            <Image
                              src="/share.svg"
                              width={20}
                              height={20}
                              alt="Share"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Share link</DialogTitle>
                            <DialogDescription>
                              Anyone who has this link will be able to view
                              this.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label
                                htmlFor={`link-${item._id}`}
                                className="sr-only"
                              >
                                Link
                              </Label>
                              <Input
                                id={`link-${item._id}`}
                                value={`${
                                  typeof window !== "undefined"
                                    ? window.location.origin
                                    : ""
                                }/Universities/${item._id}`}
                                readOnly
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="px-3"
                              onClick={() => {
                                const link = `${window.location.origin}/Universities/${item._id}`;
                                navigator.clipboard.writeText(link).then(() => {
                                  setCopiedLinkId(item._id);
                                  setTimeout(() => setCopiedLinkId(null), 2000);
                                });
                              }}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy />
                            </Button>
                          </div>

                          {copiedLinkId === item._id && (
                            <p className="text-black text-sm mt-2">
                              Link copied to clipboard!
                            </p>
                          )}

                          {/* Share buttons */}
                          <div className="mt-2 flex gap-4 justify-left">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `${window.location.origin}/Universities/${item._id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:underline"
                            >
                              <BsWhatsapp className="text-2xl" />{" "}
                            </a>
                            <a
                              href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                                `${window.location.origin}/Universities/${item._id}`
                              )}`}
                              className="text-blue-600 hover:underline"
                            >
                              <AiOutlineMail className="text-2xl text-red-600" />{" "}
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                `${window.location.origin}/Universities/${item._id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1877F2] hover:underline"
                            >
                              <FaFacebook className="text-blue-600 text-2xl" />
                            </a>
                          </div>

                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <button
                        onClick={() => toggleFavorite(item._id)}
                        className={`relative ${
                          heartAnimation === item._id ? "animate-pop" : ""
                        }`}
                      >
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
                        unoptimized
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
                      target="blank"
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
                      <p className="text-sm text-gray-600">
                        {item.university_type || "Public"}
                      </p>
                    </div>
                  </div>

                  <hr className="mx-4 my-3" />
                  <p className="text-sm font-bold pb-2">Acceptance Rate:</p>
                  <div className="relative bg-[#F1F1F1] rounded-md h-7">
                    {(() => {
                      const rate = item.acceptance_rate?.toString().trim();
                      let displayRate = rate;
                      let numericWidth = 0;
                      let isValidNumber = true;

                      // Normalize known non-numeric labels like "n/a"
                      if (rate?.toLowerCase() === "n/a") {
                        displayRate = "N/A";
                        isValidNumber = false;
                        numericWidth = 100; // Fallback width
                      } else if (rate.includes("to")) {
                        const [start, end] = rate
                          .split("to")
                          .map((val: string) => parseFloat(val.trim()));

                        if (isNaN(start) || isNaN(end)) {
                          isValidNumber = false;
                          numericWidth = 100;
                        } else {
                          const avg = ((start + end) / 2).toFixed(1);
                          numericWidth = parseFloat(avg);
                          displayRate = `${start}% - ${end}%`;
                        }
                      } else {
                        numericWidth = parseFloat(rate);
                        if (isNaN(numericWidth)) {
                          isValidNumber = false;
                          numericWidth = 100;
                        }
                      }

                      const bgColor = isValidNumber ? "#16C47F" : "#FFE5B4"; // green or soft yellow

                      return (
                        <div
                          className="text-white flex items-center justify-center h-7 rounded-lg transition-all duration-500"
                          style={{
                            width: `${numericWidth}%`,
                            backgroundColor: bgColor,
                          }}
                        >
                          <p className="text-sm font-normal leading-3 px-2 text-black">
                            {displayRate}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

        </>

      )}
      {/* Pagination Button  */}
      {displayedUniversities.length >= 0 && totalPages > 0 && (
        <div className="flex flex-wrap justify-center items-center my-8 gap-3">
          {/* Pagination controls always visible container */}
          <div className="flex items-center gap-3" >
            {/* First page button */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200 ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              aria-label="First page"
              disabled={currentPage <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={handlePrevPage}
              className={`text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200 ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              aria-label="Previous page"
              disabled={currentPage <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex space-x-2 ">
              {(() => {
                // Calculate pagination range
                let startPage = 1;
                let endPage = totalPages;

                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    // Show first 5 pages
                    endPage = 5;
                  } else if (currentPage + 2 >= totalPages) {
                    // Show last 5 pages
                    startPage = Math.max(totalPages - 4, 1);
                  } else {
                    // Show current page with neighbors
                    startPage = currentPage - 2;
                    endPage = currentPage + 2;
                  }
                }

                const pages = [];

                // Add ellipsis at the beginning if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key="start-ellipsis"
                      className="rounded-lg px-4 py-2 text-gray-500"
                      disabled
                    >
                      ...
                    </button>
                  );
                }

                // Add page buttons
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${currentPage === i
                        ? "bg-red-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100"
                        }`}
                      aria-current={currentPage === i ? "page" : undefined}
                    >
                      {i}
                    </button>
                  );
                }

                // Add ellipsis at the end if needed
                if (endPage < totalPages) {
                  pages.push(
                    <button
                      key="end-ellipsis"
                      className="rounded-lg px-4 py-2 text-gray-500"
                      disabled
                    >
                      ...
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            {/* Mobile-friendly current page indicator */}
            <div className="flex sm:hidden items-center border-2 border-red-600">
              <span className="text-gray-700 font-medium px-3">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Next button */}
            {currentPage < totalPages && (
              <button
                onClick={handleNextPage}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Last page button */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                aria-label="Last page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default Page;
