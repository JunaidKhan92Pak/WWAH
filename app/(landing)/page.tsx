'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, Headphones, Trophy, Users, Send } from "lucide-react";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Page() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const universities = [
    {
      name: "Massey University",
      location: "USA",
      image: "/university-1.png",
      acceptance: "70%",
      logo: "/massey-logo.png",
    },
    {
      name: "Massey University",
      location: "New Zealand",
      image: "/university-2.png",
      acceptance: "70%",
      logo: "/massey-logo.png",
    },
    {
      name: "Massey University",
      location: "China",
      image: "/university-3.png",
      acceptance: "70%",
      logo: "/massey-logo.png",
    },
    {
      name: "Massey University",
      location: "Canada",
      image: "/university-3.png",
      acceptance: "70%",
      logo: "/massey-logo.png",
    },
  ]
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
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Remove value if it's already stored
        : [...prev, value] // Add value if it's not already stored
    );
  };
  const visibleUniversities = universities.filter((course) => {
    if (selectedValues.length === 0) {
      return course; // No filters applied, return all
    }
    return (
      selectedValues.includes(course.location.toLowerCase())
    );
  });


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
            <Link href="/signin">
              <Button className="bg-red-700" variant="default" size="lg">
                Login
              </Button>
            </Link>
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
                {/* Chat Input */}
                <div className="chat-input rounded-lg p-2 flex items-center gap-3 2xl:gap-5 2xl:justify-evenly bg-white bg-opacity-30">
                  <Bot className="h-6 w-6 text-white/80" />
                  <input
                    type="text"
                    placeholder="Chat with Zeus..."
                    className="flex-1 bg-transparent border-none  focus:outline-none text-white placeholder:text-white/60 placeholder:text-sm "
                  />
                  <Link href="/chatmodel">
                    <Send className="h-5 w-5 text-white/80 cursor-pointer hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-1">
                {[
                  {
                    text: "Find Countries",
                    imageUrl: "/Earth--Streamline-Solar-Broken.svg",
                    href: "/countrypage",
                  },
                  {
                    text: "Find Universities",
                    imageUrl: "/Map-Point-School--Streamline-Solar-Broken.svg",
                    href: "/universityarchive",
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
            <Badge variant="outline" className=" bg-[#F1F1F1]">
              <DropdownMenu>
                <DropdownMenuTrigger className=" text-sm sm:text-base font-semibold text-gray-600 flex  items-center justify-center gap-2 bg-gray-100 p-2">Filter
                  <Image
                    src="/favi.png"
                    width={20} // Adjust to match screenshot
                    height={20}
                    alt="filter"
                  // className="2xl:w-[32px] 2xl:h-[32px]"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 h-[260px]">
                  <ScrollArea className="p-2 md:h-full">
                    <p className="text-md">Countries:</p>
                    <div className="pr-3">
                      <ul className="py-2 space-y-4">
                        <li className="flex justify-between g ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/usa.png"
                              width={18}
                              height={18}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">United States</label>
                          </div>
                          <input
                            type="checkbox"
                            name="usa"
                            value="usa"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/china.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">China</label>
                          </div>
                          <input
                            type="checkbox"
                            name="china"
                            value="china"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/canada.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">Canada</label>
                          </div>
                          <input
                            type="checkbox"
                            name="canada"
                            value="canada"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex  items-center gap-2">
                            <Image
                              src="/italy.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">Italy</label>
                          </div>
                          <input
                            type="checkbox"
                            name="italy"
                            value="italy"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between   gap-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/uk.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">United Kingdom</label>
                          </div>
                          <input
                            type="checkbox"
                            name="uk"
                            value="uk"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/ireland.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">Ireland</label>
                          </div>
                          <input
                            type="checkbox"
                            name="ireland"
                            value="ireland"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/new-zealand.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">New Zealand</label>
                          </div>
                          <input
                            type="checkbox"
                            name="new zealand"
                            value="new zealand"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/denmark.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">Denmark</label>
                          </div>
                          <input
                            type="checkbox"
                            name="denmark"
                            value="denmark"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                        <li className="flex justify-between ">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/france.png"
                              width={20}
                              height={20}
                              alt="favourite"
                              className="w-[28px]"
                            />
                            <label className="text-[16px]" htmlFor="us">France</label>
                          </div>
                          <input
                            type="checkbox"
                            name="france"
                            value="france"
                            onChange={handleCheckboxChange}
                          />
                        </li>
                      </ul>
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </Badge>
          </div>
          {/* University Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleUniversities.map((uni, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                {/* University Image */}
                <div className="relative h-48">
                  <Image
                    src={uni.image}
                    alt={uni.name}
                    fill
                    className="object-cover transition-transform  duration-300 group-hover:scale-105"
                  />
                  {/* University Logo Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-md">
                    <Image
                      src={uni.logo}
                      alt={`${uni.name} logo`}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                {/* University Details */}
                <div className="p-4">
                  <h6 className="font-semibold  mb-2">{uni.name}</h6>
                  <div className="flex  flex-col  justify-between items-start xl:items-center  text-muted-foreground">
                    <div className="w-full flex items-center justify-between gap-2">
                      <p>{uni.location}</p>
                      <p>Public</p>

                    </div>
                    <p className="w-full">Acceptance Rate: {uni.acceptance}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
              <div className="text-sm flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent  border-white text-white hover:bg-white hover:text-black  text-left"
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
                  className="bg-transparent  border-white text-white hover:bg-white hover:text-black  text-left"
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
