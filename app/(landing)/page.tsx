"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, Headphones, Trophy, Users, Send } from "lucide-react";
import Footer from "@/components/Footer";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { FaCircleUser } from "react-icons/fa6";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { useUniversityStore } from "@/store/useUniversitiesStore";
import { SkeletonCard } from "@/components/skeleton";
import { useUserStore } from "@/store/userStore";
import Loading from "../loading";
// import Loading from "@/app/loading";

function Page() {
  const router = useRouter();
  // const Countries = [
  //   "USA",
  //   "China",
  //   "Canada",
  //   "Italy",
  //   "United Kingdom",
  //   "Ireland",
  //   "New Zealand",
  //   "Denmark",
  //   "France",
  // ];
  useEffect(() => {

    fetchUser(); // Fetch user on mount
  }, []);
  const [input, setInput] = useState("");
  // const { universities, country, setCountry, fetchUniversities, loading: uniLoading } =
  //   useUniversityStore();
  const {
    universities,
    fetchUniversities,
    loading: uniLoading,
  } = useUniversityStore();
  const { isAuthenticate, loading, logout, user, fetchUser } = useUserStore();
  useEffect(() => {
    if (universities.length === 0) fetchUniversities();
  }, [fetchUniversities]);

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI powered platform",
      description:
        "Our state-of-the-art, AI platform simplifies the admission process. For assessing your eligibility to matching you with suitable programs, our technology ensures a smooth and efficient application experience.",
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
  // function handleCheckboxChange(destination: string): void {


  //   if (destination === "All") {
  //     if (country.length === country.length) {
  //       setCountry([]); // Uncheck all
  //     } else {
  //       setCountry(country); // Select all
  //     }
  //   } else {
  //     const updatedSelected = country.includes(destination)
  //       ? country.filter((item) => item !== destination) // Remove if exists
  //       : [...country, destination]; // Add if not exists
  //     setCountry(updatedSelected); //  Set array directly
  //   }
  // }

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const [successOpen, setSuccessOpen] = useState(false);
  if (uniLoading || loading) {
    return <Loading />
  }

  const handleNavigate = () => {
    if (input.trim()) {
      router.push(`/chatmodel?message=${encodeURIComponent(input)}`);
    } else {
      router.push("/chatmodel"); // Navigate without message if input is empty
    }
  };
  return (
    // landing page container starts
    <div className="landingPage">
      <div className="landingPageBg bg-custom-gradient w-full flex flex-col justify-center items-center">
        {/* header section starts */}
        <header className="w-[90%] flex justify-between mt-5 ">
          <div className=" w-full  flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="WWAH Logo" width={112} height={45} />
            </Link>
            {isAuthenticate ? (
              // Profile Dropdown for Logged-in Users
              <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex text-sm bg-white  rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <FaCircleUser className="text-gray-800  w-8 h-8 text-xl 2xl:text-4xl" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        {user?.personalInfo?.firstName || "User12"}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {user?.personalInfo?.email || "user@gmail.com"}
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
                      {/* <li>
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Settings
                        </a>
                      </li> */}
                      <li>
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          onClick={logout}
                        >
                          Logout
                        </a>
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
                    // variant="outline"
                    size="lg"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>
        {/* header section ends */}
        {/* Hero Section Start */}
        <section className="HeroSection relative overflow-hidden flex flex-row items-center justify-center gap-4 lg:justify-evenly my-6 w-[95%] sm:w-[90%]">
          {/* hero Section Left Side starts */}
          <div className="HeroLeftSection w-[95%] md:w-[70%] lg:w-[50%] ">
            {/* Hero Content */}
            <div className="hero-content space-y-8 ">
              <div className="space-y-8">
                <h1 className=" text-white">
                  Hello! <em>Zeus</em> Here!
                  <br />
                  How can I Help You?
                </h1>
                <div className="HeroRightSide relative block lg:hidden">
                  <Image
                    src="/Hero_Robot.png"
                    alt="Robot"
                    width={499}
                    height={633}
                    className="2xl:w-[550px] 2xl:h-[700px]"
                  />
                </div>

                {/* Chat Input */}
                <div className="chat-input rounded-lg p-2 flex items-center gap-3 2xl:gap-5 2xl:justify-evenly bg-white bg-opacity-30">
                  <Bot className="h-6 w-6 text-white/80" />
                  <input
                    type="text"
                    placeholder="Chat with Zeus..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none  focus:outline-none text-white placeholder:text-white/60 placeholder:text-sm "
                  />
                  {/* <Link
                    href={`/chatmodel?message=${encodeURIComponent(input)}`}
                  > */}
                  <Send
                    onClick={handleNavigate}
                    className="h-5 w-5 text-white/80 cursor-pointer hover:text-white transition-colors"
                  />
                  {/* </Link> */}
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
                    passHref
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
                <div className="student flex flex-col  md:border-r border-dotted border-white mb-4 md:mr-2 pb-6 md:pr-6">
                  <h5>400k+</h5>
                  <p>Worldwide Students</p>
                </div>
                <div className="uni flex flex-col  md:border-r border-dotted border-white  mb-4 md:mr-4 pb-6 md:pr-10 font-medium">
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
          {/* hero Section Left Side ends */}
          {/* hero Section Right Side starts */}
          <div className="HeroRightSide relative h-[600px] hidden lg:block">
            <Image
              src="/Hero_Robot.png"
              alt="Robot"
              width={499}
              height={633}
              className="2xl:w-[550px] 2xl:h-[700px]"
            />
          </div>
        </section>
      </div>
      <section className="py-5 bg-gray-50">
        <div className=" mx-auto px-0 sm:px-4 w-[90%]">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold">Top Universities!</h3>
            {/* <Badge variant="outline" className=" bg-[#F1F1F1]">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-gray-900 flex items-center gap-2 bg-[#F1F1F1] rounded-lg p-2 w-[48%] h-8">
                  <Image
                    src="/filterr.svg"
                    width={16}
                    height={16}
                    alt="filter"
                  />{" "}
                  Filter
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 h-[360px]">
                  <ScrollArea className="p-2 ">
                    <p className="text-[16px]">Countries:</p>
                    <ul className="py-2 space-y-4">
                      {Countries.map((country) => (
                        <li key={country} className="flex justify-between ">
                          <div className="flex gap-2">
                            <Image
                              src={`/${country.toLowerCase()}.png`}
                              width={30}
                              height={30}
                              alt={country}
                            />
                            <label htmlFor={country}>{country}</label>
                          </div>
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(country)}
                            className="mr-2"
                          />
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </Badge> */}
          </div>
          {/* University Cards Grid */}
          {!uniLoading ? (
            <div
              className="flex gap-6 overflow-x-auto  scrollbar-hide p-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {universities.length === 0 ? (
                <p className="text-[20px] font-semibold text-center p-4 w-full">
                  No Universities Found
                </p>
              ) : (
                universities.slice(0, 4).map((uni, index) => (
                  <Card
                    key={index}
                    className="min-w-[300px] overflow-hidden group cursor-pointer rounded-2xl transition-all duration-300 hover:shadow-lg"
                  >
                    {/* University Image */}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/Universities/${uni._id}`}
                      key={uni._id}
                      className="relative h-48 block"
                    >
                      <Image
                        src={uni.universityImages.banner}
                        alt={uni.name}
                        layout="fill"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* University Logo Overlay */}
                      <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-md">
                        <Image
                          src={uni.universityImages.logo}
                          alt={`${uni.university_name} logo`}
                          width={40}
                          height={40}
                        />
                      </div>
                    </Link>
                    {/* University Details */}
                    <div className="p-4">
                      <h6 className="font-semibold mb-2">
                        {uni.university_name}
                      </h6>
                      <div className="flex flex-col justify-between items-start xl:items-center text-muted-foreground">
                        <div className="w-full flex items-center justify-between gap-2">
                          <p>{uni.country_name}</p>
                          <p>Public</p>
                        </div>
                        <p className="w-full">
                          Acceptance Rate: {uni.acceptance_rate}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <SkeletonCard arr={4} />
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="md:py-5 bg-muted/50">
        <div className=" mx-auto w-[90%]">
          <h2 className=" font-bold text-center mb-5 md:mb-5">
            Why Choose WWAH?
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
      <section className="flex justify-between items-center  bg-black text-white mt-10">
        <div className=" mx-auto pt-8 sm:pt-0  w-[90%]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-bold my-4">WWAH Mobile App:</h2>
              <p className="mb-8">
                Study Abroad dreams made simple: Just Download WWAH app, Upload
                & Travel.
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
                        The mobile app is coming soon!
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
