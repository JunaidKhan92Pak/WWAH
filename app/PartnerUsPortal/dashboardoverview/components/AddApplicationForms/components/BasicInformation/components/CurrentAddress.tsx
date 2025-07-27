"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { countries } from "@/lib/countries";
import { Checkbox } from "@/components/ui/checkbox";
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
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "@/app/(studentdashboard)/dashboard/completeapplication/components/BasicInfo/components/Schema";
import { z } from "zod";
type FormValues = z.infer<typeof formSchema>;

const CurrentAddress = ({ form }: { form: UseFormReturn<FormValues> }) => {
  // Track checkbox state
  const [sameAsContact, setSameAsContact] = useState(false);

  // Function to copy contact details to current address
  const copyContactDetails = () => {
    // form.setValue(
    //   "currentcurrentAddress",
    //   form.getValues("currentAddress") || ""
    // );
    // form.setValue(
    //   "currentpermanentAddress",
    //   form.getValues("permanentAddress") || ""
    // );
    form.setValue("currentCountry", form.getValues("country") || "");
    form.setValue("currentCity", form.getValues("city") || "");
    form.setValue("currentZipCode", form.getValues("zipCode") || "");
    form.setValue("currentEmail", form.getValues("email") || "");
    form.setValue(
      "currentCountryCode",
      form.getValues("countryCode") || "+92-Pakistan"
    );
    form.setValue("currentPhoneNo", form.getValues("phoneNo") || "");
  };

  // Effect to update values when contact details change and checkbox is checked
  useEffect(() => {
    if (sameAsContact) {
      copyContactDetails();
    }
  }, [
    sameAsContact,
    // form.watch("currentAddress"),
    // form.watch("permanentAddress"),
    form.watch("country"),
    form.watch("city"),
    form.watch("zipCode"),
    form.watch("email"),
    form.watch("countryCode"),
    form.watch("phoneNo"),
  ]);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 gap-2 items-end">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="same-as-contact"
            checked={sameAsContact}
            onCheckedChange={(checked) => {
              setSameAsContact(!!checked);
              if (checked) {
                copyContactDetails();
              }
            }}
          />
          <label
            htmlFor="same-as-contact"
            className="text-base font-semibold cursor-pointer"
          >
            Same as Contact details
          </label>
        </div>

        {/* {[
          { name: "currentcurrentAddress" as const, label: "Current Address" },
          {
            name: "currentpermanentAddress" as const,
            label: "Permanent Address",
          },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  // disabled={sameAsContact}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))} */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* country */}
          <FormField
            control={form.control}
            name="currentCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Find selected country to update country code
                    const selectedCountry = countries.find(
                      (c) => c.name === value
                    );
                    if (selectedCountry) {
                      form.setValue("currentCountryCode", selectedCountry.code);
                    }
                  }}
                  value={field.value || ""}
                // disabled={sameAsContact}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
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
            name="currentCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                // disabled={sameAsContact}
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
            name="currentZipCode"
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
                  // disabled={sameAsContact}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* email */}
          <FormField
            control={form.control}
            name="currentEmail"
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
                    // disabled={sameAsContact}
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
        <FormField
          control={form.control}
          name="currentPhoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="currentCountryCode"
                  render={({ field: countryCodeField }) => (
                    <Select
                      value={countryCodeField.value || "+92-Pakistan"}
                      onValueChange={countryCodeField.onChange}
                    // disabled={sameAsContact}
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
                                {
                                  (
                                    countryCodeField.value || "+92-Pakistan"
                                  ).split("-")[0]
                                }
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
                  value={field.value || ""}
                  placeholder="Enter your phone number"
                  className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] text-sm"
                // disabled={sameAsContact}
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

export default CurrentAddress;
