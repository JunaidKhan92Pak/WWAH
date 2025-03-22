"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Formsection = () => {
  const countries = [
    {
      code: "+92", flag: "/pakflag.png",
      country: "Pakistan"
    },
    {
      code: "+1", flag: "/usa.png",
      country: "USA"
    },
    {
      code: "+91", flag: "/india.png",
      country: "India"
    },
    {
      code: "+61", flag: "/australia.png",
      country: "Australia"
    },
    {
      code: "+39", flag: "/italy.png",
      country: "Italy"
    },
    {
      code: "+44", flag: "/uk.png",
      country: "United Kingdom"
    },
    {
      code: "+1", flag: "/canada.png",
      country: "Canada"
    },
    {
      code: "+86", flag: "/china.png",
      country: "China"
    },
    {
      code: "+353", flag: "/ireland.png",
      country: "Ireland"
    },
    {
      code: "+64", flag: "/new-zealand.png",
      country: "New Zealand"
    },
    {
      code: "+49", flag: "/germany.png",
      country: "Germany"
    },
    {
      code: "+60", flag: "/malaysia.png",
      country: "Malaysia"
    },
    {
      code: "+33", flag: "/france.png",
      country: "France"
    },
    {
      code: "+45", flag: "/denmark.png",
      country: "Denmark"
    },
  ];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    countryCode: "",
    phoneNumber: "",
    test: "",
    format: "",
    timing: "",
  });

  const [formType, setFormType] = useState("Register Now");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCountryCodeChange = (value: string) => {
    setForm({
      ...form,
      countryCode: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.country || !form.countryCode || !form.email || !form.firstName || !form.format || !form.lastName || !form.phoneNumber || !form.test || !form.timing) {
      console.log("Hello");
    }
    else {
      const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}sendMail`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (data.ok) {
        const response = await data.json();
        console.log(response);
      }
    }
  };

  return (
    <div
      id="book-demo"
      className="relative flex flex-col items-center text-white bg-black bg-cover bg-center py-10  overflow-hidden justify-center w-full"
      style={{
        backgroundImage: "url('/bg-usa.png')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      <div className="relative z-10 bg-gray-700 bg-opacity-70 border text-white rounded-3xl shadow-lg p-3 md:p-10 2xl:p-20 w-[90%] mx-auto">
        <div className="flex gap-1 sm:space-y-0 sm:space-x-2 justify-center items-center text-center md:mb-12 mb-4">
          <Button
            onClick={() => setFormType("Register Now")}
            className={`text-white p-6 2xl:p-14 w-full md:w-[30%] xl:w-[20%] rounded-lg shadow-lg border border-[#C7161E] ${formType === "Register Now" ? "bg-white" : "bg-transparent"
              }`}
          >
            <h6 className={formType === "Register Now" ? "text-[#C7161E]" : "text-white"}>
              Register Now
            </h6>
          </Button>
          <Button
            onClick={() => setFormType("Book a Demo")}
            className={`text-white p-6 2xl:p-14 w-full md:w-[30%] xl:w-[20%] rounded-lg shadow-lg border border-[#C7161E] ${formType === "Book a Demo" ? "bg-white" : "bg-transparent"
              }`}
          >
            <h6 className={formType === "Book a Demo" ? "text-[#C7161E]" : "text-white"}>
              Book a Demo
            </h6>
          </Button>
        </div>

        <h2 className="text-center text-xl 2xl:text-3xl font-bold mb-8">{formType} Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formType === "Register Now" && (
              <>
                <div>
                  <label className="block  mb-2 font-semibold">First Name</label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    type="text"
                    placeholder="Enter first name"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Last Name</label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    type="text"
                    placeholder="Enter last name"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Email Address</label>
                  <Input
                    name="email"
                    value={form.email}
                    type="email"
                    placeholder="Enter email address"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Country of Residence</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.country} value={country.country}>
                          {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Contact Number</label>
                  <div className="flex flex-row gap-2">
                    {/* Dropdown for Country Code */}
                    <div className="flex items-center justify-center w-[60%] lg:w-[30%] xl:w-[20%]  bg-white bg-opacity-20 rounded-md">
                      <Select onValueChange={handleCountryCodeChange}>
                        <SelectTrigger className="flex items-center bg-transparent 2xl:py-8">
                          {/* Conditionally render Pakistan's country code, name, and flag as the placeholder */}
                          <SelectValue placeholder={
                            form.countryCode
                              ? `${form.countryCode} (${countries.find(c => c.code === form.countryCode)?.country || ''})`
                              : (
                                <div className="flex items-center space-x-2">
                                  <Image
                                    src={countries[0].flag}
                                    alt="Pakistan Flag"
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                  <p className="text-xs">{`${countries[0].code} `}</p>

                                </div>
                              )
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Dynamically render options from the countries array */}
                          {countries.map((country) => (
                            <SelectItem key={`${country.code}-${country.country}`} value={`${country.code}-${country.country}`}>

                              <div className="flex items-center space-x-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.country} Flag`}
                                  width={20}
                                  height={20}
                                  className="object-cover"
                                />
                                <p className="text-xs truncate">{`${country.code} (${country.country})`}</p> {/* Show country code and country name with smaller text */}

                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


                    {/* Input Field for Phone Number */}
                    <div className="w-full sm:w-4/5">
                      <Input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        type="text"
                        placeholder="Enter phone number"
                        className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Preferred Test (IELTS/PTE/TOEFL)

                  </label>
                  <Select
                    onValueChange={(value) => handleSelectChange("test", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select test name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IELTS">IELTS</SelectItem>
                      <SelectItem value="PTE">PTE</SelectItem>
                      <SelectItem value="TOEFL">TOEFL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Class Format (In person/Online)</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("format", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In person">In person</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Preferred Timing</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("timing", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {formType === "Book a Demo" && (
              <>
                <div>
                  <label className="block mb-2 font-semibold">First Name</label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    type="text"
                    placeholder="Enter first name"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Last Name</label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    type="text"
                    placeholder="Enter last name"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Email Address</label>
                  <Input
                    name="email"
                    value={form.email}
                    type="email"
                    placeholder="Enter email address"
                    className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Country of Residence</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.country} value={country.country}>
                          {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Contact Number</label>
                  <div className="flex flex-row gap-2">
                    {/* Dropdown for Country Code */}
                    <div className="flex items-center justify-center w-2/5 sm:w-1/2 lg:w-1/3  bg-white bg-opacity-20 rounded-md">
                      <Select onValueChange={handleCountryCodeChange}>
                        <SelectTrigger className="flex items-center bg-transparent 2xl:py-8">
                          {/* Conditionally render Pakistan's country code, name, and flag as the placeholder */}
                          <SelectValue placeholder={
                            form.countryCode
                              ? `${form.countryCode} ${countries.find(c => c.code === form.countryCode)?.country}`
                              : (
                                <div className="flex items-center space-x-4">
                                  <Image
                                    src={countries[0].flag}
                                    alt="Pakistan Flag"
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                  <span>{`${countries[0].code}`}</span>

                                </div>
                              )
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Dynamically render options from the countries array */}
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.country} Flag`}
                                  width={20}
                                  height={20}
                                  className="object-cover"
                                />
                                <p className="text-xs truncate">{`${country.code} (${country.country})`}</p> {/* Show country code and country name with smaller text */}

                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


                    {/* Input Field for Phone Number */}
                    <div className="w-full sm:w-4/5">
                      <Input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        type="text"
                        placeholder="Enter phone number"
                        className="w-full bg-white bg-opacity-20 border placeholder:text-[12px] placeholder:lg:text-[14px] placeholder:text-slate-200"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Preferred Test (IELTS/PTE/TOEFL)</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("test", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select test name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IELTS">IELTS</SelectItem>
                      <SelectItem value="PTE">PTE</SelectItem>
                      <SelectItem value="TOEFL">TOEFL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Class Format (In person/Online)</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("format", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In person">In person</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Preferred Timing</label>
                  <Select
                    onValueChange={(value) => handleSelectChange("timing", value)}
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="pt-6 text-center">
            <Button type="submit" className="px-12 bg-red-700 hover:bg-red-500 transition text-white py-2 rounded-lg">
              {formType === "Register Now" ? "Register" : "Book Demo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formsection;
