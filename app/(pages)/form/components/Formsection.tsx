"use client";
import React, { useState, useEffect } from "react";
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
import { countries } from "@/lib/countries";

const Formsection = () => {
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

  // Function to detect and extract country code from phone number
  const detectCountryCodeFromPhone = (phoneNumber: string) => {
    if (!phoneNumber) return null;

    // Check if phone number starts with + and extract country code
    const phoneRegex = /^(\+\d{1,4})\s*(.*)$/;
    const match = phoneNumber.match(phoneRegex);

    if (match) {
      const extractedCode = match[1]; // e.g., "+92"
      const remainingNumber = match[2].replace(/\D/g, ""); // Remove non-digits

      // Find matching country in your countries array
      const matchingCountry = countries.find((c) => c.code === extractedCode);

      if (matchingCountry) {
        return {
          countryCode: `${matchingCountry.name}_${matchingCountry.code}`,
          cleanPhoneNumber: remainingNumber,
          country: matchingCountry,
        };
      }
    }

    return null;
  };

  // Find selected country OR fallback to Pakistan
  const selectedCountry =
    countries.find((c) => `${c.name}_${c.code}` === form.countryCode) ||
    countries.find((c) => c.name === "Pakistan" && c.code === "+92");

  // Enhanced handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Check if the phone number contains a country code
      const detectedCountry = detectCountryCodeFromPhone(value);

      if (detectedCountry) {
        // Auto-set country code, country, and clean phone number
        setForm({
          ...form,
          countryCode: detectedCountry.countryCode,
          country: detectedCountry.country.name, // FIXED: Also set country
          phoneNumber: detectedCountry.cleanPhoneNumber,
        });
      } else {
        // Just update phone number normally
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      // Handle other fields normally
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCountryCodeChange = (value: string) => {
    // Extract country name from the value
    const countryName = value.split("_")[0];

    setForm({
      ...form,
      countryCode: value,
      country: countryName, // FIXED: Sync country field when countryCode changes
    });
  };

  // Enhanced auto-detection for autofilled forms
  useEffect(() => {
    // Multiple checks for autofill detection
    const detectAutofill = () => {
      if (form.phoneNumber && !form.countryCode) {
        const detectedCountry = detectCountryCodeFromPhone(form.phoneNumber);

        if (detectedCountry) {
          setForm((prev) => ({
            ...prev,
            countryCode: detectedCountry.countryCode,
            country: detectedCountry.country.name, // FIXED: Also set country
            phoneNumber: detectedCountry.cleanPhoneNumber,
          }));
        }
      }
    };

    // Check immediately
    detectAutofill();

    // Check after small delays to catch browser autofill
    const timers = [100, 500, 1000].map((delay) =>
      setTimeout(detectAutofill, delay)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [form.phoneNumber]); // FIXED: Watch phoneNumber changes

  // Enhanced form processing function
  const processFormData = (formData: typeof form) => {
    let processedForm = { ...formData };

    // If phone number is filled but country code is empty, try to auto-detect
    if (formData.phoneNumber && !formData.countryCode) {
      const detectedCountry = detectCountryCodeFromPhone(formData.phoneNumber);

      if (detectedCountry) {
        processedForm = {
          ...formData,
          countryCode: detectedCountry.countryCode,
          country: detectedCountry.country.name, // FIXED: Set both fields
          phoneNumber: detectedCountry.cleanPhoneNumber,
        };
      }
    }

    // If countryCode is set but country is not, extract country from countryCode
    if (processedForm.countryCode && !processedForm.country) {
      const countryName = processedForm.countryCode.split("_")[0];
      processedForm.country = countryName;
    }

    // If country is set but countryCode is not, try to find matching countryCode
    if (processedForm.country && !processedForm.countryCode) {
      const matchingCountry = countries.find(
        (c) => c.name === processedForm.country
      );
      if (matchingCountry) {
        processedForm.countryCode = `${matchingCountry.name}_${matchingCountry.code}`;
      }
    }

    return processedForm;
  };

  // Improved handleSubmit with better validation for autofilled data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Process form data to handle autofill scenarios
    const processedForm = processFormData(form);

    // Update the form state with processed data
    setForm(processedForm);

    // Now validate with processed form data
    if (
      !processedForm.country ||
      !processedForm.countryCode ||
      !processedForm.email ||
      !processedForm.firstName ||
      !processedForm.format ||
      !processedForm.lastName ||
      !processedForm.phoneNumber ||
      !processedForm.test ||
      !processedForm.timing
    ) {
      // Show specific error message
      const missingFields = [];
      if (!processedForm.country) missingFields.push("Country");
      if (!processedForm.countryCode) missingFields.push("Country Code");
      if (!processedForm.email) missingFields.push("Email");
      if (!processedForm.firstName) missingFields.push("First Name");
      if (!processedForm.lastName) missingFields.push("Last Name");
      if (!processedForm.phoneNumber) missingFields.push("Phone Number");
      if (!processedForm.test) missingFields.push("Preferred Test");
      if (!processedForm.format) missingFields.push("Class Format");
      if (!processedForm.timing) missingFields.push("Preferred Timing");

      console.log("Missing fields:", missingFields);
      console.log("Form data:", processedForm); // ADDED: Debug log
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const formData = {
        ...processedForm,
        formType: formType,
      };

      console.log("Submitting form data:", formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}sendMail`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Form submitted successfully!");

        // Reset form after successful submission
        setForm({
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
      } else {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        alert("Server error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please check your connection.");
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

      <div className="relative z-10 bg-gray-700 bg-opacity-70 border text-white rounded-3xl shadow-lg p-3 md:p-10  w-[90%] mx-auto">
        <div className="flex gap-1 sm:space-y-0 sm:space-x-2 justify-center items-center text-center md:mb-6 mb-4">
          <Button
            onClick={() => setFormType("Register Now")}
            className={`text-white py-4 px-6 md:py-6 md:px-8 rounded-lg shadow-lg border border-[#C7161E] ${
              formType === "Register Now" ? "bg-white" : "bg-transparent"
            }`}
          >
            <h6
              className={
                formType === "Register Now" ? "text-[#C7161E]" : "text-white"
              }
            >
              Register Now
            </h6>
          </Button>
          <Button
            onClick={() => setFormType("Book a Demo")}
            className={`text-white py-4 px-6 md:py-6 md:px-8 rounded-lg shadow-lg border border-[#C7161E] ${
              formType === "Book a Demo" ? "bg-white" : "bg-transparent"
            }`}
          >
            <h6
              className={
                formType === "Book a Demo" ? "text-[#C7161E]" : "text-white"
              }
            >
              Book a Demo
            </h6>
          </Button>
        </div>

        <h2 className="text-center text-xl 2xl:text-3xl font-bold mb-8">
          {formType} Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formType === "Register Now" && (
              <>
                <div>
                  <label className="block  mb-2 font-semibold">
                    First Name
                  </label>
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
                  <label className="block mb-2 font-semibold">
                    Email Address
                  </label>
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
                  <label className="block mb-2 font-semibold">
                    Country of Residence
                  </label>
                  <Select
                    value={form.country}
                    onValueChange={(value) =>
                      handleSelectChange("country", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          <span className="text-sm truncate">
                            {country.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Contact Number
                  </label>
                  <div className="flex flex-row gap-2">
                    <div className="flex items-center justify-center w-[60%] lg:w-[30%] xl:w-[20%] bg-white bg-opacity-20 rounded-md">
                      <Select
                        onValueChange={handleCountryCodeChange}
                        value={form.countryCode}
                      >
                        <SelectTrigger className="flex items-center bg-transparent px-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                selectedCountry?.flag || "/fallback-flag.png"
                              }
                              alt={`${
                                selectedCountry?.name || "Pakistan"
                              } flag`}
                              width={20}
                              height={20}
                              className="rounded-full h-5 w-5 object-cover"
                            />
                            <p className="text-xs">
                              {form.countryCode?.split("_")[1] ||
                                selectedCountry?.code ||
                                "+92"}
                            </p>
                          </div>
                        </SelectTrigger>

                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.name}
                              value={`${country.name}_${country.code}`}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.name} Flag`}
                                  width={20}
                                  height={20}
                                  className="rounded-full h-5 w-5 object-cover"
                                />
                                <p className="text-xs">{country.code}</p>
                                <span className="text-xs truncate">
                                  ({country.name})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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
                  <label className="block mb-2 font-semibold">
                    Preferred Test (IELTS/PTE/TOEFL)
                  </label>
                  <Select
                    value={form.test}
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
                  <label className="block mb-2 font-semibold">
                    Class Format (In person/Online)
                  </label>
                  <Select
                    value={form.format}
                    onValueChange={(value) =>
                      handleSelectChange("format", value)
                    }
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
                  <label className="block mb-2 font-semibold">
                    Preferred Timing
                  </label>
                  <Select
                    value={form.timing}
                    onValueChange={(value) =>
                      handleSelectChange("timing", value)
                    }
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
                {/* Same fields as Register Now - keeping original structure */}
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
                  <label className="block mb-2 font-semibold">
                    Email Address
                  </label>
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
                  <label className="block mb-2 font-semibold">
                    Country of Residence
                  </label>
                  <Select
                    value={form.country}
                    onValueChange={(value) =>
                      handleSelectChange("country", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white bg-opacity-20 border">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          <span className="text-sm truncate">
                            {country.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Contact Number
                  </label>
                  <div className="flex flex-row gap-2">
                    <div className="flex items-center justify-center w-[60%] lg:w-[30%] xl:w-[20%] bg-white bg-opacity-20 rounded-md">
                      <Select
                        onValueChange={handleCountryCodeChange}
                        value={form.countryCode}
                      >
                        <SelectTrigger className="flex items-center bg-transparent px-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                selectedCountry?.flag || "/fallback-flag.png"
                              }
                              alt={`${
                                selectedCountry?.name || "Pakistan"
                              } flag`}
                              width={20}
                              height={20}
                              className="rounded-full h-5 w-5 object-cover"
                            />
                            <p className="text-xs">
                              {form.countryCode?.split("_")[1] ||
                                selectedCountry?.code ||
                                "+92"}
                            </p>
                          </div>
                        </SelectTrigger>

                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.name}
                              value={`${country.name}_${country.code}`}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.name} Flag`}
                                  width={20}
                                  height={20}
                                  className="rounded-full h-5 w-5 object-cover"
                                />
                                <p className="text-xs">{country.code}</p>
                                <span className="text-xs  truncate">
                                  ({country.name})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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
                  <label className="block mb-2 font-semibold">
                    Preferred Test (IELTS/PTE/TOEFL)
                  </label>
                  <Select
                    value={form.test}
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
                  <label className="block mb-2 font-semibold">
                    Class Format (In person/Online)
                  </label>
                  <Select
                    value={form.format}
                    onValueChange={(value) =>
                      handleSelectChange("format", value)
                    }
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
                  <label className="block mb-2 font-semibold">
                    Preferred Timing
                  </label>
                  <Select
                    value={form.timing}
                    onValueChange={(value) =>
                      handleSelectChange("timing", value)
                    }
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
            <Button
              type="submit"
              className="px-12 bg-red-700 hover:bg-red-500 transition text-white py-2 rounded-lg"
            >
              {formType === "Register Now" ? "Register" : "Book Demo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formsection;
