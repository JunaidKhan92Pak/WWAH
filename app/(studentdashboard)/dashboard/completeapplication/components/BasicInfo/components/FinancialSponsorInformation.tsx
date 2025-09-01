"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { countries } from "@/lib/countries";
import { z } from "zod";
import { formSchema } from "./Schema";
import { UseFormReturn } from "react-hook-form";
import countrie from "world-countries";
type FormValues = z.infer<typeof formSchema>;

const FinancialSponsorInformation = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {

  const nationalityOptions = countrie.map((c) => ({
    label: c.demonyms?.eng?.m || c.name.common,
    value: c.demonyms?.eng?.m || c.name.common,
  }));
  return (
    <div className=" my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="sponsorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Name"
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Relationship with Student */}
        <FormField
          control={form.control}
          name="sponsorRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship with the student</FormLabel>
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

        {/* Nationality */}
        {/* <FormField
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
        /> */}
        <FormField
          control={form.control}
          name="sponsorsNationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {nationalityOptions.map((option, key) => (
                    <SelectItem key={key} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        {/* Email */}
        <FormField
          control={form.control}
          name="sponsorsEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <div className="relative w-full">
                  {/* Input Field */}
                  <Input
                    type="text"
                    placeholder="Enter your email address"
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                    {...field}
                    value={field.value || ""}
                  />

                  {/* Image inside the Input using Next.js Image */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/DashboardPage/letter.svg"
                      alt="User Icon"
                      width={20}
                      height={20}
                      className="w-5 h-5 text-black"
                    />
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        {/* <FormField
          control={form.control}
          name="sponsorsPhoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <div className="flex gap-2">
              
                <Select
                  value={form.watch("sponsorsCountryCode") || "+92"}
                  onValueChange={(value) =>
                    form.setValue("sponsorsCountryCode", value)
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Image
                            src={
                              countries.find(
                                (c) =>
                                  c.code === form.watch("sponsorsCountryCode")
                              )?.flag || "/default-flag.png"
                            }
                            alt="Country Flag"
                            width={20}
                            height={20}
                            className="object-contain"
                            unoptimized
                          />
                          <span className="text-sm">
                            {form.watch("sponsorsCountryCode") || "+92"}
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

           
                <Input
                  {...field}
                  placeholder="Enter your phone number"
                  className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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

export default FinancialSponsorInformation;
