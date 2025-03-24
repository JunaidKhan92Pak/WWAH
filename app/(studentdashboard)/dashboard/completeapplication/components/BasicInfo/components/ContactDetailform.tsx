
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formSchema } from "./Schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const countries = [
  { name: "United States", code: "+1", flag: "/flags/us.png" },
  { name: "India", code: "+91", flag: "/flags/in.png" },
  { name: "Pakistan", code: "+92", flag: "/flags/pk.png" },
  { name: "United Kingdom", code: "+44", flag: "/flags/uk.png" },
  { name: "Canada", code: "+1", flag: "/flags/ca.png" },
  { name: "Australia", code: "+61", flag: "/flags/au.png" },
  { name: "China", code: "+86", flag: "/flags/cn.png" },
  { name: "Germany", code: "+49", flag: "/flags/de.png" },
];
type FormValues = z.infer<typeof formSchema>;

const ContactDetailForm =({ form }: { form: UseFormReturn<FormValues> })  => {
  const [selectedCountry, setSelectedCountry] = useState(
    form.watch("country") || "Pakistan"
  );

  useEffect(() => {
    const countryData = countries.find((c) => c.name === selectedCountry);
    if (countryData) {
      form.setValue("countryCode", countryData.code);
    }
  }, [selectedCountry]);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 gap-2 items-end">
        <FormField
          control={form.control}
          name="homeAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Write..."
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailedAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Write..."
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCountry(value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.name} value={country.name}>
                      {country.name}
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
          name="phoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field: countryCodeField }) => (
                    <Select
                      value={form.watch("countryCode") || "+92"}
                      onValueChange={countryCodeField.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <Image
                                src={
                                  countries.find(
                                    (c) => c.name === form.watch("country")
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
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={country.flag}
                                alt={`${country.name} Flag`}
                                width={20}
                                height={20}
                                className="object-contain"
                                unoptimized
                              />
                              <span className="text-sm">{`${country.code} (${country.name})`}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...field}
                  placeholder="Enter your phone number"
                  className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactDetailForm;