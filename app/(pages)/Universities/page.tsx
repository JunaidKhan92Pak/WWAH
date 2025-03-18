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
    const Countries = [
        "USA",
        "China",
        "Canada",
        "Italy",
        "United Kingdom",
        "Ireland",
        "New Zealand",
        "Denmark",
        "France",
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

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <section className="w-[90%] mx-auto">
            <div className="md:flex md:justify-between py-5">
                <h3 className="font-bold">Discover Universities Worldwide</h3>
                <div className="sm:flex items-center">
                    <div className="w-full md:w-[70%] flex md:justify-end items-center py-2 md:p-2">
                        <div className="w-[95%] flex bg-[#F1F1F1] rounded-lg h-10">
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
                                className="border-none bg-[#F1F1F1]"
                                aria-label="Search Universities"
                            />
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm text-gray-600 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[48%] h-11">
                            <Image src="/filterr.svg" width={16} height={14} alt="filter" />{" "}
                            Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 h-[260px]">
                            <ScrollArea className="p-2 ">
                                <p className="text-[16px]">Countries:</p>
                                <ul className="py-2 space-y-4">
                                    {Countries.map((countryName) => (
                                        <li key={countryName} className="flex justify-between ">
                                            <div className="flex gap-2">
                                                <Image
                                                    src={`/${countryName.toLowerCase()}.png`}
                                                    width={30}
                                                    height={30}
                                                    alt={countryName}
                                                />
                                                <label htmlFor={countryName}>{countryName}</label>
                                            </div>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(countryName)}
                                                className="mr-2"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {loading ? (
                <SkeletonCard arr={12} />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2">
                        {universities.length === 0 ? (
                            <p className="text-[20px] font-semibold col-span-4 text-center p-4">
                                No Universities Found
                            </p>
                        ) : (
                            universities.map((item) => (
                                 <Link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`/Universities/${item._id}`}
                                    key={item._id}
                                >
                                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-3">
                                        <div className="relative h-[200px]">
                                            <div className="absolute z-10 top-5 left-0 bg-gradient-to-r from-[#FCE7D2] to-[#CEC8C3] px-2 rounded-tr-lg">
                                                <p className="text-sm font-medium">QS World:</p>
                                                <p className="text-sm font-semibold">
                                                    Ranking: {item.ranking[1]?.detail || "N/A"}
                                                </p>
                                            </div>
                                            <ImageWithLoader
                                                src={item.universityImages?.banner ?? "/banner.jpg"}
                                                // width={400}
                                                // height={250}
                                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 50vw, 40vw"
                                                className="h-[180px] w-[400px] object-cover rounded-xl"
                                                // className="w-full h-52 md:h-56 lg:h-60 object-cover"
                                                alt={`${item.university_name} Banner`}
                                            />
                                            <div className="absolute bottom-1 left-5 w-14 h-14">
                                                <Image
                                                    src={item.universityImages?.logo ?? "/banner.jpg"}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-full bg-white border border-black"
                                                    alt="University Logo"
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 h-[80px] flex flex-col justify-between">
                                            <p className="font-bold">{item.university_name}</p>
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
                                                className="bg-[#16C47F] text-white flex items-center justify-center h-7 rounded-r-lg"
                                                style={{ width: item.acceptance_rate }}
                                            >
                                                <p className="text-sm font-normal">
                                                    {item.acceptance_rate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-6 gap-4">
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
