"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Bot, Headphones, Trophy, Users, Send } from "lucide-react";
import Footer from "@/components/Footer";

import { useUniversityStore } from "@/store/useUniversitiesStore";
import { SkeletonCard } from "@/components/skeleton";
import { useUserStore } from "@/store/useUserData"; // Import the new unified store
import Loading from "../loading";

function Page() {
  const countries = [
    { name: "USA", value: "USA", img: "/countryarchive/usa_logo.png" },
    // { name: "China", value: "china", img: "/countryarchive/china_logo.png" },
    { name: "Canada", value: "canada", img: "/countryarchive/canada_logo.png" },
    { name: "Italy", value: "italy", img: "/countryarchive/italy_logo.png" },
    { name: "United Kingdom", value: "United Kingdom", img: "/ukflag.png" },
    {
      name: "New Zealand",
      value: "New Zealand",
      img: "/New Zealand.png",
    },
    {
      name: "Australia",
      value: "australia",
      img: "/countryarchive/australia_logo.png",
    },
    {
      name: "Germany",
      value: "germany",
      img: "/countryarchive/ge_logo.png",
    },
    {
      name: "Ireland",
      value: "Ireland",
      img: "/countryarchive/IR_logo.png",
    },
    { name: "Malaysia", value: "malaysia", img: "/countryarchive/my_logo.png" },
  ];
  const router = useRouter();

  // Use the unified store
  const { user, isAuthenticated, loading, logout, fetchUserProfile } =
    useUserStore();
  const [input, setInput] = useState("");

  const {
    universities,
    fetchUniversities,
    country,
    setCountry,
    loading: uniLoading,
  } = useUniversityStore();

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (universities.length === 0) fetchUniversities();
  }, [fetchUniversities, universities.length]);

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

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI powered platform",
      description:
        "Our state-of-the-art, AI platform simplifies the admission process. By assessing your eligibility, it matches you with suitable programs ensuring a smooth and efficient application experience.",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Comprehensive support services",
      description:
        "Our support goes beyond admissions. We offer a full suite of services including test preparation, application assistance, scholarship guidance, and pre-departure orientations.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Success stories and proven track record",
      description:
        "Through many years of dedicated guidance, we've curated a gallery of study abroad success stories, where every destination is a masterpiece tailored to student ambitions.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Commitment to your future",
      description:
        "At WWAH, we are committed to your long-term success. Our career counseling support ensure that you're not only prepared for your studies but also equipped for a successful career.",
    },
  ];

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const [successOpen, setSuccessOpen] = useState(false);

  // Updated handleNavigate function to properly pass the message
  const handleNavigate = () => {
    if (input.trim()) {
      // Store the message in sessionStorage for the chat model to pick up
      sessionStorage.setItem("initialMessage", input.trim());
      router.push("/chatmodel");
    } else {
      router.push("/chatmodel"); // Navigate without message if input is empty
    }
  };

  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  // Show loading state
  if (loading) {
    return <Loading />;
  }

  return (
    // landing page container starts
    <div className="landingPage">
      <div
        className="landingPageBg relative w-full flex flex-col justify-center items-center"
        style={{
          backgroundImage: 'url("/bg-blu.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10 z-0"></div>

        {/* header section starts */}
        <header className="w-[90%] flex justify-between mt-5 z-20">
          <div className=" w-full  flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logofooter.svg"
                alt="WWAH Logo"
                width={160}
                height={70}
              />
            </Link>
            {isAuthenticated ? (
              // Profile Dropdown for Logged-in Users
              <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex text-sm bg-white rounded-full focus:ring-1 focus:ring-gray-100 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src={user?.profilePicture || "/icons/userred.svg"}
                    alt="user"
                    width={40}
                    height={40}
                    className="rounded-full w-8 h-8"
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        {user?.firstName || "User"}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/dashboard/overview"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/chatmodel"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Chat with ZEUS
                        </Link>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // Login/Signup Buttons for Guests
              <>
                <Link href="/signin">
                  <Button
                    className="bg-[#C7161E] hover:bg-[#C7161E] text-white text-base"
                    size="lg"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="HeroSection relative overflow-hidden flex flex-row items-center justify-center gap-4 lg: lg:justify-evenly mt-6 w-[95%] sm:w-[100%] z-10">
          <div className="HeroLeftSection w-[95%] md:w-[70%] lg:w-[50%] ">
            {/* Hero Content */}
            <div className="hero-content space-y-2 md:space-y-8 ">
              <div className="space-y-8">
                <div className="text-center lg:text-left space-y-2">
                  <h1 className="text-white leading-snug">
                    <Typewriter
                      words={["Hey, Zeus Here!"]}
                      loop={1}
                      typeSpeed={120}
                      deleteSpeed={40}
                      delaySpeed={1000}
                    />
                  </h1>
                  <h3 className="text-white leading-snug">
                    <Typewriter
                      words={[
                        "Let's explore your study options.",
                        "I simplify your university search.",
                        "Find courses that truly fit.",
                        "Smart scholarship search starts here.",
                        "Know your success chances first.",
                      ]}
                      loop={true}
                      cursor
                      cursorStyle="|"
                      typeSpeed={120}
                      deleteSpeed={40}
                      delaySpeed={1000}
                    />
                  </h3>
                </div>

                <div className="HeroRightSide relative lg:hidden flex items-center justify-center w-full h-[230px]">
                  {/* <Image
                    src="/Zeushicomp.png"
                    alt="Robot"
                    width={0}
                    height={0}
                    sizes="60vw"
                    className="w-[190px] h-auto"
                  /> */}
                  <img
                    src="/zeus.gif"
                    alt="Animated Robot"
                    width={0}
                    height={0}
                    sizes="60vw"
                    className="w-[250px] h-auto"
                  />
                </div>

                <div className="chat-input rounded-lg p-2 flex items-center gap-3 2xl:gap-5 2xl:justify-evenly bg-white bg-opacity-30">
                  <Bot className="h-6 w-6 text-white/80" />
                  <input
                    type="text"
                    placeholder="Chat with Zeus..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNavigate();
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-white/60 placeholder:text-sm"
                  />

                  <Send
                    onClick={handleNavigate}
                    className="h-5 w-5 text-white/80 cursor-pointer hover:text-white transition-colors"
                  />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-1">
                {[
                  {
                    text: "Find Countries",
                    imageUrl: "/Earth--Streamline-Solar-Broken.svg",
                    href: "/countries",
                  },
                  {
                    text: "Find Universities",
                    imageUrl: "/Map-Point-School--Streamline-Solar-Broken.svg",
                    href: "/Universities",
                  },
                  {
                    text: "Find Scholarships",
                    imageUrl:
                      "/Square-Academic-Cap--Streamline-Solar-Broken.svg",
                    href: "/scholarships",
                  },
                  {
                    text: "Find Courses",
                    imageUrl:
                      "/Notebook-Minimalistic--Streamline-Solar-Broken.svg",
                    href: "/coursearchive",
                  },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="bg-white bg-opacity-30 text-white flex items-center justify-center space-x-2 py-2 rounded border"
                  >
                    <Image
                      src={item.imageUrl}
                      alt="icon"
                      width={16}
                      height={16}
                    />
                    <span className="text-xs sm:text-sm">{item.text}</span>
                  </Link>
                ))}
              </div>

              {/* horizontal dotted line */}
              <div className="border-t border-dotted border-white mb-4"></div>
              <div className="StudentsUniScholarship flex flex-row text-white gap-4 md:gap-5 sm:justify-evenly px-5 sm:px-0">
                <div className="student flex flex-col md:border-r border-dotted border-white mb-4 md:mr-2 pb-6 md:pr-6">
                  <h5>400k+</h5>
                  <p>Worldwide Students</p>
                </div>
                <div className="uni flex flex-col md:border-r border-dotted border-white mb-4 md:mr-4 pb-6 md:pr-10 font-medium">
                  <h5>1000+</h5>
                  <p>Worldwide Universities</p>
                </div>
                <div className="scholarships flex flex-col font-medium">
                  <h5>1000+</h5>
                  <p>Free Scholarships</p>
                </div>
              </div>
            </div>
          </div>
          <div className="HeroRightSide relative hidden lg:block">
            <Link href="/chatmodel" passHref>
              <img
                src="/zeus.gif"
                alt="Animated Robot"
                width={0}
                height={0}
                // sizes="60vw"
                className="w-[440px]"
              />
            </Link>
          </div>
        </section>
      </div>
      <section className="md:py-5 pt-5 bg-gray-50 z-10">
        <div className="mx-auto px-0 sm:px-4 w-[93%]">
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Top Universities!</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-gray-600 flex items-center justify-center gap-2 bg-[#F1F1F1] rounded-lg  w-[30%] md:w-[14%] xl:w-[9%] h-10 text-center">
                <Image src="/filterr.svg" width={16} height={14} alt="filter" />
                <div className="flex items-center gap-1">
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
                        opacity: country.length > 0 ? 1 : 0,
                      }}
                    >
                      <button
                        onClick={() => setCountry([])}
                        className="text-blue-500 hover:underline"
                        aria-hidden={!(country.length > 0)}
                        tabIndex={country.length > 0 ? 0 : -1}
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                  <ul className="py-2 space-y-4">
                    {countries.map((c, indx) => (
                      <li key={indx} className="flex justify-between gap-2">
                        <div className="flex gap-2">
                          <Image
                            src={c.img}
                            width={24}
                            height={24}
                            alt={c.name}
                            unoptimized
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
          </div>

          {!uniLoading ? (
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll("left")}
                className="absolute md:-left-5 z-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
              >
                <FaArrowLeft />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll("right")}
                className="absolute -right-0 md:-right-5 z-10 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full hover:bg-gray-100 border border-gray-200"
              >
                <FaArrowRight />
              </button>

              <div
                ref={sliderRef}
                className="flex items-center space-x-3 md:space-x-6 overflow-x-auto py-3 scrollbar-hide"
                style={{
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {universities.length === 0 ? (
                  <p className="text-[20px] font-semibold text-center p-4 w-full">
                    No Universities Found
                  </p>
                ) : (
                  universities.slice(1, 7).map((uni) => (
                    <div
                      key={uni._id}
                      className="flex-shrink-0 w-[260px] md:w-[300px] h-[328px] md:h-[364px] bg-white shadow-md rounded-2xl overflow-hidden p-3 
             transform transition-transform duration-300 hover:scale-[1.02]"
                    >
                      {/* Image + Logo */}
                      <Link
                        href={`/Universities/${uni._id}`}
                        className="relative h-44 md:h-52 block"
                      >
                        <Image
                          src={uni.universityImages.banner}
                          alt={uni.name}
                          layout="fill"
                          className="object-cover rounded-xl"
                          unoptimized
                        />
                        <div className="absolute bottom-1 left-5">
                          <Image
                            src={uni.universityImages.logo}
                            alt={`${uni.university_name} logo`}
                            width={56}
                            height={56}
                            className="rounded-full bg-white border border-black"
                            unoptimized
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex flex-col justify-between">
                        <div className="mt-1 mb-2 md:mb-3">
                          <Link href={`/Universities/${uni._id}`}>
                            {/* <p className="hover:underline underline-offset-2 pt-1 text-md truncate font-semibold max-w-[300px] overflow-hidden"> */}

                            <div className="relative group w-fit">
                              <p className="cursor-pointer text-md truncate font-semibold max-w-[250px] overflow-hidden">
                                {uni.university_name}
                              </p>
                              <span className="absolute md:left-8 mt-1 hidden group-hover:block bg-gray-100 text-black text-sm font-medium p-2 rounded-md w-[200px] text-center shadow-lg z-10">
                                {uni.university_name}
                              </span>
                            </div>
                          </Link>
                        </div>
                        {/* <div className="text-muted-foreground text-sm space-y-1"> */}
                        <div className="mt-1 flex justify-between">
                          <span className="text-sm text-gray-600">
                            {uni.country_name}
                          </span>
                          <span className="text-sm text-gray-600">Public</span>
                        </div>
                        {/* <div>Acceptance Rate: {uni.acceptance_rate}</div> */}
                        <hr className="my-1" />
                        <p className="text-sm font-bold pb-2 text-black">
                          Acceptance Rate:
                        </p>
                        <div className="relative bg-[#F1F1F1] rounded-md h-7">
                          {(() => {
                            const rate = uni.acceptance_rate?.toString().trim();
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

                            const bgColor = isValidNumber
                              ? "#16C47F"
                              : "#FFE5B4"; // green or soft yellow

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
                        {/* </div> */}
                      </div>
                    </div>
                  ))
                )}

                {/* Explore All */}
                <div className="relative flex items-center border-2 border-gray-200 h-[328px] md:h-[364px] p-2 group cursor-pointer rounded-2xl ">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-400 to-transparent opacity-30 rounded-2xl pointer-events-none"></div>

                  <Link
                    href="/Universities"
                    className="relative z-10 w-full flex justify-center"
                  >
                    <div className="rounded-lg text-black leading-tight flex flex-col items-center gap-2 px-3 font-extrabold text-[18px] w-[260px] mx-0 transition-transform duration-300 group-hover:scale-105 hover:underline underline-offset-4">
                      Explore all Universities
                      <FaArrowUpRightFromSquare />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonCard arr={4} />
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="md:pb-5 bg-muted/50 z-10">
        <div className=" mx-auto w-[90%]">
          <h2 className="font-extrabold text-center mb-1 md:mb-5">
            Why Choose{" "}
            <Link href="/aboutUs">
              <Image
                src="/logowwah.svg"
                alt="WWAH"
                width={100}
                height={40}
                className="inline-block align-middle h-[45px] md:h-[90px]  xl:h-[100px] w-[70px] md:w-[15%] lg:w-[13%] xl:w-[11%]"
              />
            </Link>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 bg-[#FCE7D2]">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <p className="font-bold mb-2">{feature.title}</p>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Mobile App Section */}
      <section className="flex justify-between items-center bg-black text-white mt-10">
        <div className=" mx-auto pt-8 sm:pt-0  w-[90%]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-bold my-4">WWAH Mobile App:</h2>
              <p className="mb-8">
                Study Abroad dreams made simple! Just Download the WWAH app,
                Upload & Travel.
              </p>
              <div>
                <div className="text-sm flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-gray-900 hover:text-white text-left"
                    onClick={() => setSuccessOpen(true)}
                  >
                    <Image
                      src="/google-play.png"
                      alt="Get it on Google Play"
                      width={18}
                      height={14}
                    />
                    Get it on Google Play
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-gray-900 hover:text-white text-left"
                    onClick={() => setSuccessOpen(true)}
                  >
                    <Image
                      src="/app-store.png"
                      alt="Download on App Store"
                      width={18}
                      height={14}
                    />
                    Download on the App Store
                  </Button>
                </div>

                {/* Modal */}
                <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                  <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
                    <Image
                      src="/DashboardPage/success.svg"
                      alt="Success"
                      width={150}
                      height={150}
                    />
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold text-gray-900">
                        The WWAH mobile app is coming soon!
                      </DialogTitle>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/mobile-app.png"
                alt="WWAH Mobile App"
                width={600}
                height={600}
                className="w-full min-h-full"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
export default Page;
