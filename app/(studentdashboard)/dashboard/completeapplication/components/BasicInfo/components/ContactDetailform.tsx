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
import { countries } from "@/lib/countries";

type FormValues = z.infer<typeof formSchema>;
const ContactDetailForm = ({ form }: { form: UseFormReturn<FormValues> }) => {
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
        {/* detailedAddress  */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* country */}
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
          {/* city */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Replace with dynamic city options based on selected country */}
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="manchester">Manchester</SelectItem>
                    <SelectItem value="birmingham">Birmingham</SelectItem>
                    <SelectItem value="leeds">Leeds</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* zipCode */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Enter your email address"
                      className="bg-[#f1f1f1] placeholder-[#313131] pl-10"
                      {...field}
                      value={field.value || ""}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/DashboardPage/letter.svg"
                        alt="Email Icon"
                        width={20}
                        height={20}
                      />
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* phone number  */}
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
              value={countryCodeField.value || "+92-Pakistan"}
              onValueChange={countryCodeField.onChange}
            >
              <FormControl>
                <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          countries.find(
                            (c) =>
                              `${c.code}-${c.name}` ===
                              (countryCodeField.value || "+92-Pakistan")
                          )?.flag || "/default-flag.png"
                        }
                        alt="Country Flag"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm">
                        {(countryCodeField.value || "+92-Pakistan").split("-")[0]}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem
                    key={`${country.code}-${country.name}`}
                    value={`${country.code}-${country.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={country.flag}
                        alt={`${country.name} Flag`}
                        width={20}
                        height={20}
                      />
                      <span className="text-sm">
                        {`${country.code} (${country.name})`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          {...field}
          value={field.value || ""}
          placeholder="Enter your phone number"
          className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] text-sm"
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
