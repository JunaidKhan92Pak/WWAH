"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { countries } from "@/lib/countries";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  nationality: z.string().min(1, "Nationality is required"),
  occupation: z.string().min(1, "Occupation is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\+?\d+$/, "Phone number must contain only numbers and an optional '+' at the start."),
  country: z.string().min(1, "Country is required.").default("Pakistan"),
  countryCode: z.string().min(1, "Country code is required.").default("+92"),
});

const FinancialSponsorInformation = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      relationship: "",
      nationality: "",
      occupation: "",
      email: "",
      phone: "",
      country: "Pakistan", // Default country set
      countryCode: "+92", // Default country code set
    },
  });

  return (
    <div className="flex flex-col w-full xl:w-[80%] mx-auto my-6">
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Name"
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship with Student */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship with the student</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
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
              name="nationality"
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
                      {["American", "Indian", "Australian", "Italian", "Pakistani", "Canadian", "British", "Chinese", "Irish", "New Zealander", "German"].map((nation) => (
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

            {/* Occupation */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No.</FormLabel>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(selectedCountry) => {
                            const countryData = countries.find((c) => c.name === selectedCountry);
                            if (countryData) {
                              form.setValue("country", countryData.name);
                              form.setValue("countryCode", countryData.code);
                              form.trigger(["country", "countryCode"]);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                              <SelectValue placeholder="Select Country">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={
                                      countries.find((c) => c.name === form.watch("country"))
                                        ?.flag || "/default-flag.png"
                                    }
                                    alt="Country Flag"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    unoptimized
                                  />
                                  <span className="text-sm">{form.watch("countryCode") || "+92"}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.name} value={country.name}>
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

                    {/* Phone Number Input */}
                    <Input
                      {...field}
                      className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FinancialSponsorInformation;
