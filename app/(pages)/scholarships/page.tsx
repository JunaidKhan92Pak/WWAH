"use client";
import { ChangeEvent, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { SkeletonCard } from "@/components/skeleton";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { useScholarships } from "@/store/useScholarships";
import { debounce } from "lodash";

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
import { Copy } from "lucide-react";

import { Label } from "@/components/ui/label";
import FilterSection from "./Components/FilterSection";
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";
import toast from "react-hot-toast";

const Page = () => {
  const [heartAnimation, setHeartAnimation] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // User store hooks
  const {
    user,
    fetchUserProfile,
    favoriteScholarships,
    favoriteScholarshipIds,
    loadingScholarships,
    toggleScholarshipFavorite,
    getScholarshipFavoriteStatus,
    fetchFavoriteScholarships,
  } = useUserStore();

  // Scholarship store hooks
  const { scholarships, loading, page, totalPages, setPage, setSearch } =
    useScholarships();

  // Initialize favorites from user store
  useEffect(() => {
    if (user && user.favouriteScholarship?.length > 0) {
      fetchFavoriteScholarships();
    }
  }, [user]);
  // console.log("favoriteScholarships object:", favoriteScholarships);

  // Fetch user profile on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, user]);

  // console.log("User favorite scholarships:", user?.favouriteScholarship);
  // console.log("Favorite scholarships data:", favoriteScholarships);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  // Updated to use store data
  const displayedScholarships = showFavorites
    ? Object.values(favoriteScholarships)
    : scholarships;

  const favoritesCount = favoriteScholarshipIds.length;
  // console.log(displayedScholarships, "displayedScholarships");
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  // Updated toggle function using store
  const toggleFavoriteInDB = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      // Handle login prompt if needed
      return;
    }

    try {
      const isCurrentlyFavorited = getScholarshipFavoriteStatus(id);
      const action = isCurrentlyFavorited ? "remove" : "add";

      // Animate heart
      setHeartAnimation(id);
      setTimeout(() => setHeartAnimation(null), 1000);

      // Call store function
      const success = await toggleScholarshipFavorite(id, action);

      if (success) {
        toast.success(
          action === "add"
            ? "Scholarship added to favorites!"
            : "Scholarship removed from favorites!",
          {
            duration: 2000,
            position: "top-center",
          }
        );
      } else {
        throw new Error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast.error("Failed to update favorites. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="w-[95%] mx-auto">
        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="lg:hidden block mb-2 mx-2 bg-gray-100 border-2 border-gray-200"
            >
              <div className="flex items-center w-[100px] justify-between">
                <div className="flex gap-2">
                  <Image
                    src="/filterr.svg"
                    width={12}
                    height={12}
                    alt="filter"
                  />
                  <p className="font-bold">Filters</p>
                </div>
                <Image
                  src="/right-arrow.png"
                  alt="arrow"
                  width={10}
                  height={10}
                />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0">
            <FilterSection isMobile={true} />
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Sidebar */}
        <div className="flex gap-2 pt-1">
          <section className="hidden lg:block lg:w-[35%] xl:w-[28%]">
            <div className="border-2 rounded-3xl p-4 md:p-0 bg-gray-100">
              <div className="hidden md:flex items-center gap-2 px-6 py-3">
                <Image src="/filterr.svg" width={20} height={20} alt="filter" />
                <h6 className="font-bold">Filters</h6>
              </div>
              <div className="flex justify-center">
                <div className="flex justify-evenly bg-white rounded-lg px-3 w-[85%]">
                  <Image
                    src="/search.svg"
                    width={16}
                    height={16}
                    alt="search"
                  />
                  <input
                    placeholder="Search Scholarships..."
                    name="search"
                    value={localSearch}
                    onChange={handleSearchChange}
                    className="border-none bg-white outline-none focus:ring-0 flex-1 p-2 placeholder:text-[12px] w-[50%] rounded-lg"
                  />
                </div>
              </div>
              <hr className="mx-6 my-4" />
              <FilterSection isMobile={false} />
            </div>
          </section>

          {/* Scholarship Display Section */}
          <section className="lg:w-[80%] w-[100%]">
            <div className="flex flex-col md:flex-row justify-between px-2">
              <div className="lg:px-3 flex flex-col">
                <h3 className="font-bold md:w-[70%] text-start">
                  Find the Right Scholarship for Your Academic Journey!
                </h3>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowFavorites((prev) => !prev)}
                  className={`text-sm flex items-center justify-center gap-1 xl:gap-2 bg-[#F1F1F1] rounded-lg p-2 px-4 md:px-6 xl:px-4 whitespace-nowrap h-10 ${
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

            {/* Show loading state for scholarships */}
            {loading || (showFavorites && loadingScholarships) ? (
              <SkeletonCard arr={9} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-2">
                  {displayedScholarships.length === 0 ? (
                    <p className="text-[20px] font-semibold col-span-4 text-center p-4">
                      {showFavorites
                        ? "No Favorite Scholarships Found"
                        : "No Scholarships Found"}
                    </p>
                  ) : (
                    displayedScholarships.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col p-3"
                      >
                        <div className="relative w-full">
                          {/* Background Image */}
                          <Image
                            src={item.banner || "/default-university.jpg"}
                            alt="University Image"
                            width={400}
                            height={250}
                            className="w-full object-cover h-[170px] md:h-[180px] rounded-lg"
                          />

                          {/* Logo Overlay */}
                          <div className="absolute bottom-3 left-4 z-10 w-14 h-14 rounded-full bg-white border border-gray-300 p-1 shadow-md">
                            <Image
                              unoptimized
                              src={item.logo || "/default-logo.png"}
                              alt="University Logo"
                              width={52}
                              height={52}
                              className="rounded-full object-contain w-full h-full"
                            />
                          </div>

                          {/* Share & Favorite Buttons */}
                          <div className="absolute z-10 top-4 right-4 flex space-x-1 py-2 px-3 bg-gray-200 bg-opacity-40 backdrop-blur-sm rounded-md">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button>
                                  <Image
                                    src="/university/Share.svg"
                                    width={21}
                                    height={21}
                                    alt="Share"
                                  />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Share link</DialogTitle>
                                  <DialogDescription>
                                    Anyone who has this link will be able to
                                    view this.
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
                                      }/scholarships/${item._id}`}
                                      readOnly
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="px-3"
                                    onClick={() => {
                                      const link = `${window.location.origin}/scholarships/${item._id}`;
                                      navigator.clipboard
                                        .writeText(link)
                                        .then(() => {
                                          setCopiedLinkId(item._id);
                                          setTimeout(
                                            () => setCopiedLinkId(null),
                                            2000
                                          );
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
                                      `${window.location.origin}/scholarships/${item._id}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:underline"
                                  >
                                    <BsWhatsapp className="text-2xl" />
                                  </a>
                                  <a
                                    href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                                      `${window.location.origin}/scholarships/${item._id}`
                                    )}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    <AiOutlineMail className="text-2xl text-red-600" />
                                  </a>
                                  <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                      `${window.location.origin}/scholarships/${item._id}`
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
                              onClick={() => toggleFavoriteInDB(item._id)}
                              disabled={loadingScholarships}
                              className={`relative ${
                                heartAnimation === item._id ? "animate-pop" : ""
                              } ${loadingScholarships ? "opacity-50" : ""}`}
                            >
                              {getScholarshipFavoriteStatus(item._id) ? (
                                <Image
                                  src="/redheart.svg"
                                  width={20}
                                  height={20}
                                  alt="Favorite"
                                />
                              ) : (
                                <Image
                                  src="/hearti.svg"
                                  width={20}
                                  height={20}
                                  alt="Favorite"
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className=" flex-grow">
                          <Link
                          target="blank"
                          href={`/scholarships/${item._id}`}
                          rel="noopener noreferrer"
                        >
<div className="relative group">
  <p
  className="font-bold leading-tight hover:underline underline-offset-4 cursor-pointer py-1 line-clamp-2"

>
    {item.name}
  </p>
  <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block 
                    bg-gray-200 text-black text-xs px-2 py-1 rounded shadow-lg z-10 w-[200px]">
    {item.name}
  </span>
</div>

                          </Link>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Min Requirements: 75%
                            </span>{" "}
                            {item.minRequirements}
                          </p>
                          <div className="flex flex-row justify-between flex-wrap">
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image
                                src={"/location.svg"}
                                alt="location"
                                width={17}
                                height={17}
                              />
                              <p className="text-sm text-gray-600 truncate">
                                {item.hostCountry || item.country}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:w-1/2">
                              <Image
                                src={"/scholarshipdetail/Money.svg"}
                                alt="scholarship type"
                                width={10}
                                height={10}
                              />
                            <div className="relative group w-24"> {/* Width small so first word fits */}
  <p className="text-sm text-gray-600 truncate">
    {item.type}
  </p>
  <span className="absolute right-2 bottom-full mb-1 hidden group-hover:block text-center
    bg-gray-200  text-xs px-2 py-1 rounded shadow-lg z-10 ">
    {item.type}
  </span>
</div>

                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between flex-wrap">
                            <div className="flex items-center gap-2 mt-2 md:w-1/2 group relative">
                              <Image
                                src={"/degree-icon.svg"}
                                alt="degree level"
                                width={16}
                                height={16}
                              />

                              {/* Text with responsive truncate on large screens */}
                              <p className="text-sm text-gray-600 lg:truncate lg:max-w-[180px]">
                                {item.programs
                                  ? item.programs
                                  : "Not Specified"}
                              </p>

                              {/* Tooltip (only appears on large screens and above) */}
                              {item.programs && (
                                <span className="hidden lg:group-hover:block absolute bottom-full left-0 mt-1 z-10 bg-gray-200 text-black text-xs p-2 rounded-md shadow-lg w-max max-w-xs whitespace-normal">
                                  {item.programs}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2 md:w-1/2 group relative">
                              <Image
                                src="/clock.svg"
                                alt="deadline"
                                width={16}
                                height={16}
                                className="flex-shrink-0"
                              />
                              <p
                                className="
      text-sm text-gray-600 
      lg:truncate
      max-w-full
    "
                              >
                                {item.deadline}
                              </p>

                              {/* Tooltip only for lg and above */}
                              <span
                                className="
      hidden lg:group-hover:block
      absolute bottom-full left-8 -translate-x-1/2 
      bg-gray-200 text-black text-xs p-2 rounded-md shadow-md 
      w-max max-w-[200px] z-10 
      text-center
    "
                              >
                                {item.deadline}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link
                          target="blank"
                          href={`/scholarships/${item._id}`}
                          rel="noopener noreferrer"
                          className=" mt-1 flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-lg text-white text-xs md:text-[13px] px-1 py-2 border border-red-500 text-center"
                        >
                          Explore Courses
                        </Link>
                      </div>
                    ))
                  )}
                </div>
                {/* Pagination Controls - Only show for "Show All" mode */}
                {!showFavorites && (
                  <div className="flex justify-center items-center m-4 gap-4 p-2">
                    <button
                      onClick={handlePrev}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:bg-red-300"
                    >
                      Previous
                    </button>
                    <span className="text-lg font-semibold text-gray-700">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:bg-red-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;
