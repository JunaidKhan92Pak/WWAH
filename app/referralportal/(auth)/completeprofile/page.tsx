"use client";
import React, { useState, useEffect } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { countries } from "@/lib/countries";
import { getCitiesByCountry } from "@/lib/cities";

const countryCodes = countries
  .filter((c) => c.code)
  .map((c) => ({
    value: `${c.code}-${c.iso2}`, // unique value for React key
    code: c.code, // ✅ keep the dialing code
    iso2: c.iso2,
    flag: c.flag,
    name: c.name,
  }));

// Zod validation schema for specific fields
const validationSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

// Props interface for CityComboBox
interface CityComboBoxProps {
  personalInfo: {
    country: string;
    city: string;
  };
  availableCities: Array<{ id: string; name: string }>;
  handleSelectChange: (name: string, value: string) => void;
  errors: {
    city?: string;
  };
}

// Separate CityComboBox component
function CityComboBox({
  personalInfo,
  availableCities,
  handleSelectChange,
  errors,
}: CityComboBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between px-4 py-2 h-10 text-sm bg-[#F1F1F1] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.city ? "border-red-500" : "border-gray-300",
            !personalInfo.country ? "opacity-50 cursor-not-allowed" : ""
          )}
          disabled={!personalInfo.country || availableCities.length === 0}
        >
          {personalInfo.city
            ? personalInfo.city
            : !personalInfo.country
            ? "Select country first"
            : availableCities.length === 0
            ? "No cities available"
            : "Select a city"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {availableCities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => {
                    handleSelectChange("city", city.name);
                    setOpen(false);
                  }}
                >
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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

  const [availableCities, setAvailableCities] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Update available cities when country changes
  useEffect(() => {
    if (personalInfo.country) {
      const cities = getCitiesByCountry(personalInfo.country);
      setAvailableCities(
        cities.map((c, idx) => ({
          id: `${personalInfo.country}-${c.name}-${idx}`,
          name: c.name,
        }))
      );

      // Clear city selection if the previously selected city is not available in the new country
      if (
        personalInfo.city &&
        !cities.find((city) => city.name === personalInfo.city)
      ) {
        setPersonalInfo((prev) => ({ ...prev, city: "" }));
        // Clear city error when country changes
        if (errors.city) {
          setErrors((prev) => ({ ...prev, city: undefined }));
        }
      }
    } else {
      setAvailableCities([]);
      // Clear city when no country is selected
      if (personalInfo.city) {
        setPersonalInfo((prev) => ({ ...prev, city: "" }));
      }
    }
  }, [personalInfo.country, personalInfo.city, errors.city]);

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
                  <SelectTrigger className="py-2 w-2/5 md:w-1/2  bg-[#F1F1F1] text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((cc) => (
                      <SelectItem key={cc.value} value={cc.value}>
                        <span className="flex items-center gap-2">
                          <img src={cc.flag} alt="" className="w-5 h-4" />
                          {cc.code} ({cc.name})
                        </span>
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
              <label className="block text-gray-700 text-sm pb-1">Country</label>
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
                    <SelectItem key={country.id} value={country.name}>
                      <span className="flex items-center gap-2">
                        <img src={country.flag} alt="" className="w-5 h-4" />
                        {country.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <span className="text-red-500 text-xs">{errors.country}</span>
              )}
            </div>
            <div className="md:w-1/2 ">
              <label className="block text-gray-700 text-sm pb-1">City</label>
              <CityComboBox
                personalInfo={personalInfo}
                availableCities={availableCities}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />
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
              <div className="w-[95%] mt-2">
                <label className="block text-gray-700 text-sm pb-1">Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook profile link"
                  value={personalInfo.facebook}
                  onChange={handleChange}
                  className="w-full px-4 md:py-2 py-1 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm "
                />
              </div>
              <div className="w-[95%] mt-2">
                <label className="block text-gray-700 text-sm pb-1">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn profile link"
                  value={personalInfo.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 md:py-2 py-1 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
                />
              </div>
              <div className="w-[95%] mt-2">
                <label className="block text-gray-700 text-sm pb-1">Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram profile link"
                  value={personalInfo.instagram}
                  onChange={handleChange}
                  className="w-full px-4 md:py-2 py-1 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
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
