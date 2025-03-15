"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
// import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Ensure the path is correct and the module exists
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { countries } from "@/lib/countries";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserData";
import { getAuthToken } from "@/authHelper";
// import { getAuthToken } from "@/authHelper";

const formSchema = z.object({
  country: z.string({
    required_error: "Please select a country.",
  }),
  university: z.string({
    required_error: "Please select a university.",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
  accommodationType: z.string({
    required_error: "Please select accommodation type.",
  }),
  startDate: z.string({
    required_error: "Please select a date.",
  }),
  distance: z.string({
    required_error: "Please select preferred distance.",
  }),
  preferences: z.string().optional(),
  currency: z.string({
    required_error: "Please select currency.",
  }),
  budgetMin: z.string({
    required_error: "Please enter minimum budget.",
  }),
  budgetMax: z.string({
    required_error: "Please enter maximum budget.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  countryCode: z.string().default("+92"),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function Home() {
  const { user, fetchUserProfile } = useUserStore();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "+92",
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   toast.success("Form submitted successfully!", {
  //     description: "We'll get back to you soon.",
  //   });
  //   console.log(values);
  // }
  const userName = user?.user.firstName + " " + user?.user.lastName;
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
    event
  ) => {
    event?.preventDefault();
    console.log("done", values, userName);
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/accommodationBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${getAuthToken()}`, // Add auth token if needed
          },
          credentials: "include",
          body: JSON.stringify({
            ...values,
            userName,
            startDate: new Date(values.startDate).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      toast.success("Form submitted successfully!", {
        description: "We'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast.error("Submission failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Accommodation Booking Form
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete the form to secure your housing before arrival. Ensure all
            details are accurate to avoid delays
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 bg-white "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oxford">
                          Oxford University
                        </SelectItem>
                        <SelectItem value="cambridge">
                          Cambridge University
                        </SelectItem>
                        <SelectItem value="harvard">
                          Harvard University
                        </SelectItem>
                        <SelectItem value="mit">MIT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              <FormField
                control={form.control}
                name="accommodationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Of Accommodation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Apartment</SelectItem>
                        <SelectItem value="shared">Shared Apartment</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="homestay">Homestays</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Accommodation Start Date</FormLabel>
                    {/* <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal bg-[#f1f1f1] placeholder-[#313131] text-sm ${
                              !field.value && "text-[#313131]"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "YYYY/MM/DD")
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
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
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Distance from Institution</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 miles</SelectItem>
                        <SelectItem value="1-3">1-3 miles</SelectItem>
                        <SelectItem value="3-5">3-5 miles</SelectItem>
                        <SelectItem value="5+">5+ miles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any Other Preference:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write..."
                        className="resize-none bg-[#f1f1f1] placeholder-[#313131]  placeholder:text-sm text-sm h-10 min-h-[40px] py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium">Preferred Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Min"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Max"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No.</FormLabel>
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field: countryField }) => (
                          <Select
                            onValueChange={countryField.onChange}
                            defaultValue={countryField.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-r-none border-r-0">
                                <SelectValue>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={
                                        countries.find(
                                          (c) => c.code === countryField.value
                                        )?.flag || countries[0].flag
                                      }
                                      alt="Country Flag"
                                      width={20}
                                      height={20}
                                      className="object-contain"
                                      unoptimized
                                    />
                                    <span className="text-sm">
                                      {countryField.value}
                                    </span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
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
                        className="rounded-l-none bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                        placeholder="Enter your phone number"
                        name="phoneNumber"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right">
              <Button
                type="submit"
                className="w-1/3 sm:w-1/4 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
