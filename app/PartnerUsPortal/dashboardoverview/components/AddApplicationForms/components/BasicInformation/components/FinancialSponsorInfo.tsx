"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { countries } from "@/lib/countries";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  sponsorName: z.string(),
  sponsorsNationality: z.string(),
  industryType: z.string(),
  institution: z.string(),
  sponsorRelationship: z.string(),
  sponsorsOccupation: z.string(),
  sponsorsPhoneNo: z.string(),
  sponsorsCountryCode: z.string(),
  sponsorsEmail: z.string(),
});


const FinancialSponsorInfo = () => {
  const form = useFormContext();

  return (
    <div>
       <h2 className="text-xl font-semibold mb-4 text-center">
Financial Sponsor Information
      </h2>
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Name */}
      <FormField
        control={form.control}
        name="sponsorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Name"
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nationality */}
      <FormField
        control={form.control}
        name="sponsorsNationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">

                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[
                  "American",
                  "Indian",
                  "Australian",
                  "Italian",
                  "Pakistani",
                  "Canadian",
                  "British",
                  "Chinese",
                  "Irish",
                  "New Zealander",
                  "German",
                ].map((nation) => (
                  <SelectItem key={nation} value={nation}>
                    {nation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Industry Type */}
      <FormField
        control={form.control}
        name="industryType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry Type</FormLabel>
            <FormControl>
              <Input
                placeholder="Write..."
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Institution */}
      <FormField
        control={form.control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution / Employer</FormLabel>
            <FormControl>
              <Input
                placeholder="Write..."
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Relationship */}
      <FormField
        control={form.control}
        name="sponsorRelationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship with the student</FormLabel>
            <FormControl>
              <Input
                placeholder="Write..."
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Occupation */}
      <FormField
        control={form.control}
        name="sponsorsOccupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input
                placeholder="Write..."
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone No. */}
      <FormField
                  control={form.control}
                  name="sponsorsPhoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="sponsorsCountryCode"
                          render={({ field: countryCodeField }) => (
                            <Select
                              value={countryCodeField.value}
                              onValueChange={countryCodeField.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[155px] bg-[#f1f1f1] rounded-lg border-r-0">
                                  <SelectValue>
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={
                                          countries.find(
                                            (c) =>
                                              `${c.code}-${c.name}` ===
                                              countryCodeField.value
                                          )?.flag || '/pakflag.png'
                                        }
                                        alt="Flag"
                                        width={20}
                                        height={20}
                                      />
                                      <span className="text-sm">
                                        {(countryCodeField.value || '').split('-')[0]}
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
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your phone number"
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

      {/* Email */}
      <FormField
        control={form.control}
        name="sponsorsEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src="/DashboardPage/letter.svg"
                  alt="Mail"
                  width={18}
                  height={18}
                />
              </span>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email address"
                className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"

/>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    </div>
  );
};

export default FinancialSponsorInfo;
