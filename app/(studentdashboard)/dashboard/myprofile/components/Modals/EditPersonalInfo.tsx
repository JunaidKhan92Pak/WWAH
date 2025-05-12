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
import { useUserStore } from "@/store/useUserData";

const formSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

interface ApiLanguageProficiency {
  test: string;
  score: string;
}

interface ApiStudyPreference {
  country: string;
  degree: string;
  subject: string;
}

interface DetailedInfo {
  studyLevel: string;
  gradeType: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: {
    amount: number;
    currency: string;
  };
  tuitionFee: {
    amount: number;
    currency: string;
  };
  languageProficiency: ApiLanguageProficiency;
  workExperience: number;
  studyPreferenced: ApiStudyPreference;
  updatedAt: string;
}

export default function EditPersonalInfo({ data }: { data: DetailedInfo }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateDetailedInfo } = useUserStore();

  // Format date to YYYY-MM-DD for input if it exists
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    // Check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse the date and format it
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date

      // Format to YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: formatDate(data?.dateOfBirth) || "",
      nationality: data?.nationality || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // Make sure dateOfBirth is properly formatted
      const formattedValues = {
        dateOfBirth: values.dateOfBirth,
        nationality: values.nationality,
      };

      console.log("Submitting:", formattedValues);

      await updateDetailedInfo(formattedValues);

      setSuccessOpen(true);
      setOpen(false);
    } catch (error) {
      console.error("Error updating personal info:", error);
      // Add error handling UI here if needed
    } finally {
      setIsSubmitting(false);
    }
  }

  const countries = [
    { code: "+92", flag: "/pakflag.png", country: "Pakistan" },
    { code: "+1", flag: "/countryarchive/usa_logo.png", country: "USA" },
    { code: "+91", flag: "/countryarchive/india_logo.png", country: "India" },
    { code: "+61", flag: "/australia.png", country: "Australia" },
    { code: "+39", flag: "/countryarchive/italy_logo.png", country: "Italy" },
    {
      code: "+44",
      flag: "/countryarchive/uk_logo.png",
      country: "United Kingdom",
    },
    { code: "+1", flag: "/countryarchive/canada_logo.png", country: "Canada" },
    { code: "+86", flag: "/countryarchive/china_logo.png", country: "China" },
    {
      code: "+353",
      flag: "/countryarchive/ireland_logo.png",
      country: "Ireland",
    },
    { code: "+64", flag: "/nz.png", country: "New Zealand" },
    {
      code: "+49",
      flag: "/countryarchive/germany_logo.png",
      country: "Germany",
    },
    { code: "+60", flag: "/countryarchive/my_logo.png", country: "Malaysia" },
    { code: "+33", flag: "/countryarchive/france_logo.png", country: "France" },
    {
      code: "+45",
      flag: "/countryarchive/denmark_logo.png",
      country: "Denmark",
    },
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

  return (
    <>
      <div className="flex flex-col items-start space-y-2">
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
            {new Date(data?.updatedAt || Date.now()).toLocaleDateString(
              "en-GB"
            )}
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
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
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
                            <SelectValue placeholder="Select Nationality">
                              {field.value && (
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={
                                      nationalities.find(
                                        (n) => n.name === field.value
                                      )?.flag || "/pakflag.png"
                                    }
                                    alt="Nationality Flag"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    unoptimized
                                  />
                                  {field.value}
                                </div>
                              )}
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

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full md:w-[40%] bg-[#C7161E]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Personal Information"}
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
          <Button
            onClick={() => setSuccessOpen(false)}
            className="mt-2 bg-[#C7161E]"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
