"use client";
import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUniversityStore } from "@/store/useUniversitiesStore";
import { SkeletonCard } from "@/components/skeleton"
const Page = () => {

    const { universities, search, setSearch, countryFilter, setCountryFilter, fetchUniversities, loading } = useUniversityStore();
    // Fetch Universities
    useEffect(() => {
        fetchUniversities();
    }, []);
    // Handle Search
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    // Handle Checkbox Changes
    function handleCheckboxChange(destination: string): void {
        if (destination === "All") {
            if (countryFilter.length === countryFilter.length) {
                setCountryFilter([]); // Uncheck all
            } else {
                setCountryFilter(countryFilter); // Select all
            }
        } else {
            const updatedSelected = countryFilter.includes(destination)
                ? countryFilter.filter((item) => item !== destination) // Remove if exists
                : [...countryFilter, destination]; // Add if not exists
            setCountryFilter(updatedSelected); //  Set array directly
        }
    }

    return (
        <section className="w-[90%] mx-auto">
            <div className="md:flex md:justify-between py-5">
                <h3 className="font-bold">Discover Universities Worldwide</h3>
                <div className="sm:flex items-center">
                    <div className="w-full md:w-[70%] flex md:justify-end items-center p-2">
                        <div className="w-[95%] flex bg-[#F1F1F1] rounded-lg h-10">
                            <Image src="/search.svg" width={16} height={16} alt="search" className="ml-2" />
                            <Input
                                placeholder="Search..."
                                onChange={handleSearch}
                                value={search}
                                className="border-none bg-[#F1F1F1]"
                                aria-label="Search Universities"
                            />
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm text-gray-600 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[48%] h-11">
                            <Image src="/filterr.svg" width={16} height={16} alt="filter" /> Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 h-[260px]">
                            <ScrollArea className="p-2 ">
                                <p className="text-[16px]">Countries:</p>
                                <ul className="py-2 space-y-4">
                                    {["USA", "China", "Canada", "Italy", "United Kingdom", "Ireland", "New Zealand", "Denmark", "France"].map((country) => (
                                        <li key={country} className="flex justify-between ">
                                            <div className="flex gap-2">
                                                <Image src={`/${country.toLowerCase()}.png`} width={30} height={30} alt={country} />
                                                <label htmlFor={country}>{country}</label>
                                            </div>
                                            <input
                                                type="checkbox" id={country} value={country}
                                                checked={countryFilter.includes(country)}
                                                onChange={() => handleCheckboxChange(country)} />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2">
                    {universities.map((item) => (
                        <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`/Universities/${item._id}`} key={item._id}>
                            <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-3">
                                <div className="relative h-[200px]">
                                    <div className="absolute top-5 left-0 bg-gradient-to-r from-[#FCE7D2] to-[#CEC8C3] px-2 rounded-tr-lg">
                                        <p className="text-sm font-medium">QS World:</p>
                                        <p className="text-sm font-semibold">Ranking: {item.ranking[1]?.detail || "N/A"}</p>
                                    </div>
                                    <Image
                                        src={item.universityImages?.banner ?? "/banner.jpg"}
                                        width={400}
                                        height={250}
                                        className="h-[180px] w-[400px] object-cover rounded-xl"
                                        alt={`${item.university_name} Banner`}
                                    />
                                    <div className="absolute bottom-1 left-5 w-14 h-14">
                                        <Image src={item.universityImages?.logo ?? "/banner.jpg"} width={56} height={56} className="rounded-full bg-white border border-black" alt="University Logo" />
                                    </div>
                                </div>
                                <div className="px-4 h-[80px] flex flex-col justify-between">
                                    <p className="font-bold">{item.university_name}</p>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-600">{item.country_name}</p>
                                        <p className="text-sm text-gray-600">Public</p>
                                    </div>
                                </div>
                                <hr className="mx-4 my-3" />
                                <p className="text-sm font-bold pb-2">Acceptance Rate:</p>
                                <div className="relative bg-[#F1F1F1] rounded-md h-7">
                                    <div className="bg-[#16C47F] text-white flex items-center justify-center h-7 rounded-r-lg" style={{ width: item.acceptance_rate }}>
                                        <p className="text-sm font-normal">{item.acceptance_rate}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            )}
        </section>
    );
};

export default Page;
