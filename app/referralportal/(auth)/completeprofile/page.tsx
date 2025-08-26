
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

const countries = [
  { value: "USA", label: "United States" },
  { value: "India", label: "India" },
  { value: "Australia", label: "Australia" },
  { value: "Italy", label: "Italy" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Canada", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "China", label: "China" },
  { value: "Ireland", label: "Ireland" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Germany", label: "Germany" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "France", label: "France" },
  { value: "Denmark", label: "Denmark" },
];

const cities = [
  { value: "Lahore", label: "Lahore" },
  { value: "Okara", label: "Okara" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Karachi", label: "Karachi" },
  { value: "Nepal", label: "Nepal" },
];

const countryCodes = [
  { value: "+44", label: "🇬🇧 +44 (UK)" },
  { value: "+86", label: "🇨🇳 +86 (China)" },
  { value: "+61", label: "🇦🇺 +61 (Australia)" },
  { value: "+1", label: "🇨🇦 +1 (Canada)" },
  { value: "+1", label: "🇺🇸 +1 (USA)" },
  { value: "+353", label: "🇮🇪 +353 (Ireland)" },
  { value: "+64", label: "🇳🇿 +64 (New Zealand)" },
  { value: "+49", label: "🇩🇪 +49 (Germany)" },
  { value: "+39", label: "🇮🇹 +39 (Italy)" },
  { value: "+60", label: "🇲🇾 +60 (Malaysia)" },
  { value: "+33", label: "🇫🇷 +33 (France)" },
  { value: "+45", label: "🇩🇰 +45 (Denmark)" },
];

// Zod validation schema for specific fields
const validationSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

const Step1 = () => {
  const router = useRouter();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    countryCode: "",
    contactNo: "",
    dob: "",
    country: "",
    city: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const [errors, setErrors] = useState<{
    dob?: string;
    country?: string;
    city?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }

    console.log(value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setPersonalInfo({ ...personalInfo, [name]: value });

    // Clear error when user selects value
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }

    console.log(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate only specific fields
    try {
      validationSchema.parse({
        dob: personalInfo.dob,
        country: personalInfo.country,
        city: personalInfo.city,
      });

      // Clear errors if validation passes
      setErrors({});

      // Proceed with API call
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/personalInformation`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(personalInfo),
          }
        );
        const res = await response.json();
        console.log(res);
        router.push("/referralportal/completeprofile/academicinformation");
      } catch (apiError) {
        console.log(`There Is Some Error ${apiError}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors - prevent form submission
        const newErrors: { dob?: string; country?: string; city?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        setErrors(newErrors);
        // Don't proceed with API call if validation fails
        return;
      }
    }
  };

  return (
    <div className="w-full">
      <section className="w-full">
        <form
          onSubmit={handleSubmit}
          className="w-[100%] bg-white rounded-md space-y-2 mx-auto l:p-8"
        >
          <div className="grid md:grid-cols-2 gap-2 w-full">
            {/* Column 1 */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={personalInfo.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={personalInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Column 1 - Second Row */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">Contact</label>
              <div className="flex space-x-2">
                <Select
                  value={personalInfo.countryCode}
                  onValueChange={(value) =>
                    handleSelectChange("countryCode", value)
                  }
                >
                  <SelectTrigger className="py-2 w-2/5 md:w-1/2 xl:w-1/4 bg-[#F1F1F1] text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((code, index) => (
                      <SelectItem
                        key={`${code.value}-${index}`}
                        value={code.value}
                      >
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Phone"
                  value={personalInfo.contactNo}
                  onChange={handleChange}
                  className="w-3/4 px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Column 2 - Second Row */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={personalInfo.dob}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-sm bg-[#F1F1F1] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dob && (
                <span className="text-red-500 text-xs">{errors.dob}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-end">
            <div className="md:w-1/2">
              <label className="block text-gray-700 text-sm">Country</label>
              <Select
                value={personalInfo.country}
                onValueChange={(value) => handleSelectChange("country", value)}
              >
                <SelectTrigger
                  className={`w-full px-4 py-2 text-sm bg-[#F1F1F1] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <span className="text-red-500 text-xs">{errors.country}</span>
              )}
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-700 text-sm">City</label>
              <Select
                value={personalInfo.city}
                onValueChange={(value) => handleSelectChange("city", value)}
              >
                <SelectTrigger
                  className={`w-full px-4 py-2 text-sm bg-[#F1F1F1] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <span className="text-red-500 text-xs">{errors.city}</span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center">
              <div className="w-[95%]">
                <label className="block text-gray-700 text-sm">Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook profile link"
                  value={personalInfo.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-[95%]">
                <label className="block text-gray-700 text-sm">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn profile link"
                  value={personalInfo.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-[95%]">
                <label className="block text-gray-700 text-sm">Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram profile link"
                  value={personalInfo.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="text-left">
            <Button
              type="submit"
              size={"lg"}
              className="py- mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Continue
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Step1;