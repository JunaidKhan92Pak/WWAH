"use client"
import { useState } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
export default function ContactUs() {
  const countries = [
    { code: "+92", flag: "/pakflag.png", country: "Pakistan" },
    { code: "+1", flag: "/usa.png", country: "USA" },
    { code: "+91", flag: "/india.png", country: "India" },
    { code: "+61", flag: "/australia.png", country: "Australia" },
    { code: "+39", flag: "/italy.png", country: "Italy" },
    { code: "+44", flag: "/ukflag.png", country: "United Kingdom" },
    { code: "+1", flag: "/canada.png", country: "Canada" },
    { code: "+86", flag: "/china.png", country: "China" },
    { code: "+353", flag: "/ireland.png", country: "Ireland" },
    { code: "+64", flag: "/new-zealand.png", country: "New Zealand" },
    { code: "+49", flag: "/germany.png", country: "Germany" },
    { code: "+60", flag: "/malaysia.png", country: "Malaysia" },
    { code: "+33", flag: "/france.png", country: "France" },
    { code: "+45", flag: "/denmark.png", country: "Denmark" },
  ];
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    message: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleCountryCodeChange = (value: string) => {
    setForm({
      ...form,
      countryCode: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validate form data before submitting
    if (!form.firstName || !form.lastName || !form.phoneNumber || !form.message) {
      setResponseMessage("Please fill out all fields before submitting.");
      setIsSubmitting(false); // Stop submitting
      return; // Prevent form submission
    }
    // Clear any previous error messages
    setResponseMessage("");
    console.log(form, "Hi hello");
    // Make API request to send data
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}contactus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setResponseMessage("Message sent successfully!");
        setForm({
          firstName: "",
          lastName: "",
          countryCode: "",
          phoneNumber: "",
          message: "",
          country: "",
        });
      } else {
        setResponseMessage(data.error || "Failed to send message.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again." + error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="sm:w-[90%] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 py-5 md:py-10 justify-center items-stretch p-2">
        {/* Left Section */}
        <div className="w-full md:lg:w-1/2 bg-white rounded-2xl p-2 md:p-6 border flex flex-col xl:space-y-4">
          <h6 className="text-red-500 ">Contact Us</h6>
          <h4>Let&#39;s Chat, Reach Out to Us!</h4>
          <p className="text-gray-600 mb-3 xl:mb-0">
            Have questions or feedback? We&#39;re here to help. Send us a message, and
            we&#39;ll respond within 24 hours.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 flex-1 flex flex-col">
            <div className="grid md:grid-cols-2 gap-2">
              <label htmlFor="firstname" className="block text-gray-700">
                First Name
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
                />
              </label>
              <label htmlFor="lastname" className="block text-gray-700">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"

                />
              </label>
            </div>
            <div>
              <label htmlFor="phonenumber" className="block text-gray-700">
                Phone Number
              </label>
              <div className="flex flex-row gap-2">
                {/* Dropdown for Country Code */}
                                    <div className="flex items-center justify-center w-[50%] md:w-[25%]   bg-white bg-opacity-20 rounded-md">

                      <Select onValueChange={handleCountryCodeChange}>
                    <SelectTrigger className="flex items-center  border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 bg-[#F1F1F1]">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={countries.find(c => `${c.country}_${c.code}` === form.countryCode)?.flag || countries[0].flag}
                              alt="Country Flag"
                              width={20}
                              height={20}
                              className="object-cover"
                            />
                            <p className="text-xs">{form.countryCode?.split('_')[1] || countries[0].code}</p> {/* Show only code */}
                          </div>
                        </SelectTrigger>

                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.country} value={`${country.country}_${country.code}`}>
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.country} Flag`}
                                  width={20}
                                  height={20}
                                  className="object-cover"
                                />
                                <p className="text-xs truncate">{country.code}</p> 
                                <p className="text-xs truncate">({country.country})</p> 
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                </div>
                {/* Input Field for Phone Number */}
                <div className="w-full">
                  <Input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
                  />
                </div>
              </div>
            </div>
            <label htmlFor="message" className="block text-gray-700">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Leave us a message..."
                rows={4}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 bg-[#F1F1F1] placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
              />
            </label>
            <div className="flex gap-2">
              <input type="checkbox" id="privacyPolicy" />
              <label htmlFor="privacyPolicy" className="text-gray-600">
                I agree to our friendly{" "}
                <span className="text-red-500">privacy policy</span>
              </label>
            </div>
            <Button
              className="bg-[#C7161E] text-white text-base"
              variant="outline"
              size="lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message!"}
            </Button>
            {responseMessage && (
              <div className="text-center text-gray-700 mt-4">
                {responseMessage}
              </div>
            )}
          </form>
        </div>
        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 items-center justify-center bg-white rounded-2xl flex-1">
          <div className="w-full hidden lg:block">
            <Image
              src="/ContactUsPage/contactus.svg"
              alt="Contact Person"
              width={560}
              height={400}
              className="w-[700px] h-[290px] xl:h-[410px] 2xl:w-full 2xl:h-[500px] object-cover rounded-2xl"
            />
          </div>
          <div className="w-full border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-4 rounded-lg bg-[#F1F1F1] p-4">
              <div className="p-4 bg-white rounded-lg">
                <Image
                  src="/ContactUsPage/letter.svg"
                  alt="Email Icon"
                  width={26}
                  height={26}
                  className="text-red-500"
                />
              </div>
              <div>
                <p>Email Address</p>
                <p className="text-gray-600">info@worldwidehub.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-[#F1F1F1] p-2">
              <div className="p-4 bg-white rounded-lg">
                <Image
                  src="/ContactUsPage/phone.svg"
                  alt="Phone Icon"
                  width={26}
                  height={26}
                  className="text-red-500"
                />
              </div>
              <div>
                <p>Phone Number</p>
                <p className="text-gray-600">+92 328 99 11 998</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-[#F1F1F1] p-2">
              <div className="p-4 bg-white rounded-lg">
                <Image
                  src="/ContactUsPage/global.svg"
                  alt="Website Icon"
                  width={26}
                  height={26}
                  className="text-red-500"
                />
              </div>
              <div>
                <p>Website</p>
                <p className="text-gray-600">www.worldwidehub.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
