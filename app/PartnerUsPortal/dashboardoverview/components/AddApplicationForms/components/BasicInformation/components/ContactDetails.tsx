"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
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
import { countries } from "@/lib/countries";
import Image from "next/image";

// ✅ Schema
const formSchema = z.object({
  currentAddress: z.string().min(3, "Required"),
  permanentAddress: z.string().min(3, "Required"),
  country: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  zipCode: z.string().min(3, "Required"),
  email: z.string().email("Invalid email"),
  phoneNo: z.string().min(6, "Invalid number"),
  countryCode: z.string().min(2, "Required"),
  phoneCode: z.string().min(2, "Required"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactDetailsForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      currentAddress: "",
      permanentAddress: "",
      country: "",
      city: "",
      zipCode: "",
      email: "",
      phoneNo: "",
      countryCode: "+92-Pakistan",
      phoneCode: "+92",
    },
  });

  const { control } = form;

  return (
    <Form {...form}>
      <form>
        <h2 className="text-center text-xl font-semibold my-4">
          Contact Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Current Address */}
          <FormField
            control={control}
            name="currentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Address</FormLabel>
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

          {/* Permanent Address */}
          <FormField
            control={control}
            name="permanentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permanent Address</FormLabel>
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

          {/* Country */}
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          <div className="flex items-center gap-2">
                            {country.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City/Province */}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Province</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                      <SelectValue placeholder="Select City/Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Lahore", "Islamabad", "Karachi"].map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zip Code */}
          <FormField
            control={control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
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

          {/* Email */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                      {...field}
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

          {/* Phone Number with Country Code */}
          <FormField
            control={control}
            name="phoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone No.</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={control}
                    name="countryCode"
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
                                    )?.flag || "/default-flag.png"
                                  }
                                  alt="Flag"
                                  width={20}
                                  height={20}
                                />
                                <span className="text-sm">
                                  {(countryCodeField.value || "").split("-")[0]}
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
        </div>
      </form>
    </Form>
  );
}
