"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import countriesData from 'world-countries';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number (add with country code)"),
  date: z.string().min(1, "Please select a date"),
  fromTime: z.string().min(1, "Please select time"),
  toTime: z.string().min(1, "Please select time"),
  country: z.string().min(1, "Please select a country"),
  meetingType: z.enum(["Google Meet", "WhatsApp Call"], {
    required_error: "Please select a meeting type",
  }),
  studyDestination: z.string().min(1, "Please select a study destination"),
  degree: z.string().min(1, "Please select a degree"),
  major: z.string().min(2, "Major must be at least 2 characters"),
  budget: z.string().min(1, "Please enter your budget"),
});

const destinations = [
  "United Kingdom",
  "New Zealand",
  "Australia",
  "Canada",
  "Germany",
  "Malaysia",
  "Ireland",
  "USA",
  "China",
  "Italy",
];

const degrees = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamically generated countries list
  const countries = useMemo(
    () =>
      countriesData
        .map((country) => country.name.common)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      fromTime: "",
      toTime: "",
      country: "",
      meetingType: "Google Meet",
      studyDestination: "",
      degree: "",
      major: "",
      budget: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setResponseMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}scheduleSession`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setIsSuccess(true);
          setResponseMessage(data.message || "Email sent successfully!");
          toast.success(data.message || "Email sent successfully!");
          form.reset();
        } else {
          setIsSuccess(false);
          setResponseMessage(data.message || "Something went wrong. Please try again.");
          toast.error(data.message || "Something went wrong. Please try again.");
        }
      } else {
        setIsSuccess(false);
        setResponseMessage(data.message || data.error || "Failed to send message.");
        toast.error(data.message || data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSuccess(false);
      setResponseMessage("An error occurred. Please check your connection and try again.");
      toast.error("An error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE7D2] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h5 className="text-center font-bold py-2">
          Schedule a session with WWAH Advisors
        </h5>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h6 className="text-center mb-8">Enter Details:</h6>

          {responseMessage && (
            <div className={`mb-6 p-4 rounded-lg ${isSuccess
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
              <p className="text-sm font-medium">{responseMessage}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
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
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="pk"
                          value={field.value}
                          onChange={field.onChange}
                          inputProps={{
                            name: 'phone',
                            required: true,
                          }}
                          inputStyle={{
                            width: '92%',
                            height: '36px',
                            padding: '8px',
                          }}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full py-1"
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fromTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          type="time"
                          {...field}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-gray-500 w-full">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
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
                  name="meetingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row justify-evenly items-center space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Google Meet" id="google-meet" />
                            <label htmlFor="google-meet" className="text-gray-600">
                              Google Meet
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="WhatsApp Call" id="whatsapp-call" />
                            <label htmlFor="whatsapp-call" className="text-gray-600">
                              WhatsApp Call
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studyDestination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Study Destination</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-gray-500 w-full">
                            <SelectValue placeholder="Select Destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((destination) => (
                            <SelectItem key={destination} value={destination}>
                              {destination}
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
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Degree</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-gray-500 w-full">
                            <SelectValue placeholder="Select Degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {degrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
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
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Major</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          placeholder="Enter your preferred major"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Budget</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          type="number"
                          placeholder="Enter your budget"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-red-700 hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
