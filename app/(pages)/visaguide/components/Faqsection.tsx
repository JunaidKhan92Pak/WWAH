"use client";
import React, { useState } from "react";
import FAQ from "@/components/ui/enrollment/FAQ";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IoMailOutline } from "react-icons/io5";
import { BsPhone } from "react-icons/bs";
import { CiPen, CiUser } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Faq {
  question: string;
  answer: string;
}

interface FaqsectionProps {
  faqs: Faq[];
}

const Faqsection: React.FC<FaqsectionProps> = ({ faqs }) => {
  const sliderArray1 = [
    {
      src: "/visaguide/germany.png",
      alt: "Visa Guidence",
      heading: "Germany Visa Guidence",
    },
    {
      src: "/visaguide/uk.jpg",
      alt: "Visa Guidence",
      heading: "UK Visa Guidence",
    },
    {
      src: "/visaguide/australiavisa.png",
      alt: "Visa Guidence",
      heading: "Australia Visa Guidence",
    },
    {
      src: "/visaguide/canadavisa.png",
      alt: "Visa Guidence",
      heading: "Canada Visa Guidence",
    },
    {
      src: "/visaguide/chinavisa.jpg",
      alt: "Visa Guidence",
      heading: "China Visa Guidence",
    },
    {
      src: "/visaguide/japanvisa.jpg",
      alt: "Visa Guidence",
      heading: "Japan Visa Guidence",
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    from: "",
    to: "",
    country: "",
    location: "",
    destination: "",
    degree: "",
    major: "",
    budget: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const info = await fetch("http://localhost:8080/bookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (info.ok) {
        const response = await info.json();
        console.log(response);

        // Clear the form
        setUserInfo({
          name: "",
          email: "",
          phone: "",
          date: "",
          from: "",
          to: "",
          country: "",
          location: "google-meet",
          destination: "",
          degree: "",
          major: "",
          budget: "",
        });
      } else {
        console.error("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <section className="relative flex flex-col justify-center items-center text-center text-white w-full bg-cover bg-center ">
        {/* <div className="absolute inset-0 bg-black opacity-90 z-0"></div> */}
        <div className="w-full">

          <FAQ title="Frequently Asked Questions:" items={faqs} />

        </div>
      </section>
      <section className="md:py-20 py-10">
        <h2 className="text-center mb-5">Our Blogs!</h2>
        <div
          className="flex overflow-x-auto space-x-4 p-4 hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sliderArray1.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 max-w-[200px] md:max-w-[400px] 2xl:max-w-[600px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={600}
                className="rounded-3xl shadow-lg w-[250px] h-[150px] md:w-[350px] md:h-[250px] xl:w-[500px] xl:h-[300px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90 rounded-3xl hidden sm:flex flex-col justify-end p-6">
                <p className="text-white text-lg font-semibold">
                  {image.heading}
                </p>
              </div>
              <div className="sm:hidden mt-2">
                <p className="text-[14px] font-semibold">{image.heading}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        className="relative  text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",

          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:flex-row w-full py-9 md:px-12 lg:gap-10  sm:gap-0 gap-5">
          <div className="relative w-full md:w-1/2">
            <h4 className="text-[#313131] md:text-left text-center font-bold ">
              Get Personalized Help with Your UK Visa Application!
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Dialog>
              <DialogTrigger>
                <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                  Schedule a Session with WWAH Advisors Now!
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Enter Details
                  </DialogTitle>
                  <DialogDescription>
                    <ScrollArea className="h-[70vh] md:h-[80vh] p:0 md:p-4">
                      <form onSubmit={handleSubmit}>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* name */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Name
                            </label>
                            <div className="relative">
                              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <Input
                                type="text"
                                value={userInfo.name}
                                name="name"
                                onChange={handleChange}
                                className="w-full p-1 lg:p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6"
                                placeholder="Enter Name"
                              />
                            </div>
                          </div>
                          {/* email */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Email
                            </label>
                            <div className="relative">
                              <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <Input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                className="w-full p-1 lg:p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6"
                                placeholder="Enter Email"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* phone */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Phone
                            </label>
                            <div className="relative">
                              <BsPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <Input
                                type="number"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleChange}
                                className="w-full p-1 lg:p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6"
                                placeholder="Enter Phone Number"
                              />
                            </div>
                          </div>
                          {/* date */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Date
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="date"
                                value={userInfo.date}
                                onChange={handleChange}
                                className="w-full px-4 p-2 border border-gray-300 rounded-lg  "
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* from */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              From
                            </label>
                            <input
                              type="time"
                              name="from"
                              value={userInfo.from}
                              onChange={handleChange}
                              className="w-full px-4 p-2 border border-gray-300 rounded-lg  "
                            />
                          </div>
                          {/* to */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              To
                            </label>
                            <div className="relative">
                              <input
                                type="Time"
                                name="to"
                                value={userInfo.to}
                                onChange={handleChange}
                                className="w-full px-4 p-2 border border-gray-300 rounded-lg  "
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* country */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Country
                            </label>
                            <div className="relative">
                              <CiPen className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-start truncate w-full p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6">
                                  Select Country
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <ScrollArea className="h-[150px] p-4">
                                    {[
                                      "United States(USA)",
                                      "United Kingdom(UK)",
                                      "Canada",
                                      "New Zealand",
                                      "Ireland",
                                      "Italy",
                                      "France",
                                      "Malaysia",
                                      "Germany",
                                      "Denmark",
                                      "China",
                                      "Australia",
                                    ].map((country) => (
                                      <DropdownMenuItem
                                        key={country}
                                        onSelect={() => setUserInfo({ ...userInfo, country })}
                                      >
                                        {country}
                                      </DropdownMenuItem>
                                    ))}
                                  </ScrollArea>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {/* location */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Location
                            </label>
                            <div className="">
                              {/* //RadioGroupIte */}
                              <div className="flex  space-x-4 md:space-x-1 items-center justify-start md:justify-center h-8">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name="location"
                                    value="google-meet"
                                    id="google-meet"
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="google-meet"
                                    className="text-sm"
                                  >
                                    Google Meet
                                  </label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="location"
                                    value="whatsApp-call"
                                    id="whatsApp-call"
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="whatsApp-call"
                                    className="text-sm"
                                  >
                                    WhatsApp Call
                                  </label>
                                </div>
                                {/* <p className="mt-2">
                                  Selected Location: {userInfo.location}
                                </p> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* destination */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Preferred Study Destination
                            </label>
                            <div className="relative">
                              <CiPen className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-start w-full p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6">
                                  Select Destination
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <ScrollArea className="h-[150px] p-4">
                                    <DropdownMenuItem>
                                      United States(USA)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      United Kindgdom(UK)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Canada</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      New Zealand
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Ireland</DropdownMenuItem>
                                    <DropdownMenuItem>Italy</DropdownMenuItem>
                                    <DropdownMenuItem>France</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Malaysia
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Germany</DropdownMenuItem>
                                    <DropdownMenuItem>Denmark</DropdownMenuItem>
                                    <DropdownMenuItem>China</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Australia
                                    </DropdownMenuItem>
                                  </ScrollArea>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {/* degree */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Preferred Degree
                            </label>
                            <div className="relative">
                              <CiPen className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-start w-full truncate p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6">
                                  Select Degree
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <ScrollArea className="h-[150px] p-4">
                                    <DropdownMenuItem>
                                      Bachelor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Master</DropdownMenuItem>
                                    <DropdownMenuItem>PhD</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Certificate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Diploma</DropdownMenuItem>
                                  </ScrollArea>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row gap-2 text-left">
                          {/* major */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Preferred Major
                            </label>
                            <div className="relative">
                              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <input
                                type="text"
                                value={userInfo.major}
                                name="major"
                                onChange={handleChange}
                                className="w-full p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6"
                                placeholder="Enter Major"
                              />
                            </div>
                          </div>
                          {/* budget */}
                          <div className="md:w-1/2">
                            <label className="block text-gray-700 py-2 text-sm">
                              Preferred Budget
                            </label>
                            <div className="relative">
                              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                              <input
                                type="text"
                                value={userInfo.budget}
                                name="budget"
                                onChange={handleChange}
                                className="w-full p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6"
                                placeholder="Enter Budget"
                              />
                            </div>
                          </div>
                        </div>
                        {/* submit button */}
                        <div className="text-center mt-4">
                          <button
                            type="submit"
                            className=" px-12 py-3 sm:py-4 text-white bg-red-700 hover:bg-red-800 rounded-lg 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </form>
                    </ScrollArea>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faqsection;
