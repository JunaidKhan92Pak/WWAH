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
import { useState } from "react";

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
const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
];
const destinations = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
];
const degrees = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(isSubmitting);

  const [responseMessage, setResponseMessage] = useState("");
  console.log(responseMessage);

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
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  //   toast.success("Form submitted successfully!");
  // }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setResponseMessage("");
    console.log(values, "these will be send ")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/scheduleSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Corrected form submission
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Form submitted successfully!");
        form.reset(); // Reset form after successful submission
      } else {
        setResponseMessage(data.error || "Failed to send message.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again." + error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#FCE7D2] py-12 px-4 ">
      <div className="max-w-3xl mx-auto">
        <h5 className="text-center font-bold py-2">
          Schedule a session with WWAH Advisors
        </h5>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h6 className=" text-center mb-8">Enter Details:</h6>

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
                        <Input
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          placeholder="Enter your phone number"
                          {...field}
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
                          className="placeholder:text-gray-400 placeholder:text-sm w-full"
                          type="date"
                          placeholder="Select date"
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
                          placeholder="Select time"
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
                          placeholder="Select time"
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
                            <RadioGroupItem
                              value="Google Meet"
                              id="google-meet"
                            />
                            <label
                              htmlFor="google-meet"
                              className="text-gray-600"
                            >
                              Google Meet
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="WhatsApp Call"
                              id="whatsapp-call"
                            />
                            <label
                              htmlFor="whatsapp-call"
                              className="text-gray-600"
                            >
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
                  className="w-full md:w-auto bg-red-700 hover:bg-red-700"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
