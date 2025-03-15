"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import EditfirstandlastName from "./EditfirstandlastName";
const formSchema = z.object({
  // fullName: z.string().min(2, "Full name is required"),
  // email: z.string().email("Invalid email"),
  contactNo: z.string().min(10, "Invalid contact number"),
  dob: z.string().min(1, "Date of Birth is required"),
  country: z.string().min(1, "Country is required"),
  nationality: z.string().min(1, "Nationality is required"),
  city: z.string().min(1, "City is required"),
  countryCode: z.string().min(1, "Country code is required"), // Added countryCode to the schema
});

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  dob: string;
  country: string;
  nationality: string;
  city: string;
  updatedAt: string;
  countryCode: string;
}

export default function EditPersonalInfo({ data }: { data: PersonalInfoData }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  // console.log(data , "personal info")
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNo: `${data.contactNo}`,
      dob: `${data.dob}`,
      country: `${data.country}`,
      nationality: `${data.nationality}`,
      city: `${data.city}`,
      countryCode: `${data.countryCode}`, // Default country code set
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values); // Debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updatePersonalInformation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Updated successfully:", data);
        setOpen(false);
        setTimeout(() => {
          setSuccessOpen(true);
        }, 300);
      } else {
        console.error("Error updating:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  const countries = [
    { code: "+92", flag: "/pakflag.png", country: "Pakistan" },
    { code: "+1", flag: "/usa.png", country: "USA" },
    { code: "+91", flag: "/india.png", country: "India" },
    { code: "+61", flag: "/australia.png", country: "Australia" },
    { code: "+39", flag: "/italy.png", country: "Italy" },
    { code: "+44", flag: "/uk.png", country: "United Kingdom" },
    { code: "+1", flag: "/canada.png", country: "Canada" },
    { code: "+86", flag: "/china.png", country: "China" },
    { code: "+353", flag: "/ireland.png", country: "Ireland" },
    { code: "+64", flag: "/new-zealand.png", country: "New Zealand" },
    { code: "+49", flag: "/germany.png", country: "Germany" },
    { code: "+60", flag: "/malaysia.png", country: "Malaysia" },
    { code: "+33", flag: "/france.png", country: "France" },
    { code: "+45", flag: "/denmark.png", country: "Denmark" },
  ];

  // Function to get nationality from country
  const getNationality = (country: string): string => {
    const nationalityMap: { [key: string]: string } = {
      USA: "American",
      "United Kingdom": "British",
      China: "Chinese",
      Germany: "German",
      France: "French",
      Italy: "Italian",
      India: "Indian",
      Pakistan: "Pakistani",
      Canada: "Canadian",
      Australia: "Australian",
      "New Zealand": "New Zealander",
      Ireland: "Irish",
      Malaysia: "Malaysian",
      Denmark: "Danish",
    };

    return nationalityMap[country] || `${country}-ian`;
  };

  // Generate nationalities dynamically from countries
  const nationalities = countries.map(({ country, flag }) => ({
    name: getNationality(country),
    flag,
  }));

  // console.log(nationalities); // Check the output

  return (
    <>
      {/* <EditfirstandlastName
        firstName={data.firstName}
        lastName={data.lastName}
        setFirstName={setData.setFirstName}
        setLastName={setData.setLastName}
      /> */}

      {/* Email Address */}
      {/* <div className="flex flex-col items-start space-y-4">
        <p className="text-gray-600 text-base">Email Address:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/letter.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">{data.email}</p>
        </div>
      </div> */}

      <div className="flex flex-col items-start space-y-4">
        <p className="text-gray-600 text-base">Personal Information:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on{" "}
            {new Date(data.updatedAt).toLocaleDateString("en-GB")}
          </p>
          <Image
            src="/DashboardPage/pen.svg"
            alt="Edit"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh]  overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Personal Info</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact No.</FormLabel>
                      <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <Select
                          value={form.watch("country")} // Watch country changes
                          onValueChange={(selectedCountry) => {
                            const countryData = countries.find(
                              (c) => c.country === selectedCountry
                            );
                            if (countryData) {
                              form.setValue("country", countryData.country);
                              form.setValue("countryCode", countryData.code);
                              form.trigger(["country", "countryCode"]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[150px] bg-[#f1f1f1] rounded-lg border-r-0">
                              <SelectValue placeholder="Select Country">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={
                                      countries.find(
                                        (c) =>
                                          c.country === form.watch("country")
                                      )?.flag || "/default-flag.png"
                                    }
                                    alt="Country Flag"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    unoptimized
                                  />
                                  <span className="text-sm">
                                    {form.watch("countryCode") || "+92"}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.country}
                                value={country.country}
                              >
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={country.flag}
                                    alt={`${country.country} Flag`}
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    unoptimized
                                  />
                                  <span className="text-sm">{`${country.code} (${country.country})`}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Phone Number Input */}
                        <Input
                          {...field}
                          className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm truncate"
                          placeholder="Enter your contact no"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      {/* <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal bg-[#f1f1f1]  ${
                                !field.value ? "text-[#313131]" : ""
                              }`}
                            >
                              {field.value ? (
                                format(parseISO(field.value), "yyyy/MM/dd")
                              ) : (
                                <span>YYYY/MM/DD</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? parseISO(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover> */}
                      <Input
                        type="date"
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(selectedCountry) => {
                          const countryData = countries.find(
                            (c) => c.country === selectedCountry
                          );
                          if (countryData) {
                            form.setValue("country", countryData.country);
                            form.setValue("countryCode", countryData.code); // Update country code
                            form.trigger(["country", "countryCode"]);
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={
                                    countries.find(
                                      (c) => c.country === field.value
                                    )?.flag || "/default-flag.png"
                                  }
                                  alt="Country Flag"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  unoptimized
                                />
                                {field.value || "Select Country"}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.country}
                              value={country.country}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={country.flag}
                                  alt={`${country.country} Flag`}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  unoptimized
                                />
                                <span>{`(${country.country})`}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="nationality"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={
                                    countries.find(
                                      (c) => c.country === field.value
                                    )?.flag || "/default-flag.png"
                                  }
                                  alt="Nationality Flag"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  unoptimized
                                />
                                {field.value || "Select Nationality"}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {nationalities.map(({ name, flag }) => (
                            <SelectItem key={name} value={name}>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={flag}
                                  alt={`${name} Flag`}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  unoptimized
                                />
                                {name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue>
                            {field.value || "Select City"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="newyork">New York</SelectItem>
                        <SelectItem value="losangeles">Los Angeles</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        {/* Add more cities here */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-[40%] bg-[#C7161E]">
                Update Personal Information
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
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
              Personal Info Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
