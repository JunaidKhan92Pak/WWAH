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
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import countriesData from "world-countries";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid phone number (add with country code)"
    ),
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
  "Italy",
];

const degrees = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  console.log(responseMessage);
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
          setResponseMessage(
            data.message ||
              "Your counseling session has been booked successfully!"
          );
          setShowModal(true);

          // Show toast notification
          toast.success("🎉 Session Booked Successfully!", {
            description:
              "Your counseling session has been scheduled. Check your email for details.",
            duration: 5000,
          });

          form.reset();

          // Scroll to top smoothly to show success message
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setIsSuccess(false);
          setResponseMessage(
            data.message || "Something went wrong. Please try again."
          );

          // Show error toast
          toast.error("❌ Booking Failed", {
            description:
              data.message || "Something went wrong. Please try again.",
            duration: 5000,
          });
        }
      } else {
        setIsSuccess(false);
        setResponseMessage(
          data.message || data.error || "Failed to send message."
        );

        // Show error toast
        toast.error("❌ Booking Failed", {
          description: data.message || data.error || "Failed to send message.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSuccess(false);
      setResponseMessage(
        "An error occurred. Please check your connection and try again."
      );

      // Show error toast
      toast.error("❌ Connection Error", {
        description: "Please check your connection and try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Schedule Your Counseling Session
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with WWAH Advisors for personalized guidance
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Book Your Session
            </h2>
            <p className="text-red-100 text-center mt-2">
              Fill in your details to get started
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Please provide your contact details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                              placeholder="Enter your full name"
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
                          <FormLabel className="text-gray-700 font-medium">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                              type="email"
                              placeholder="Enter your email address"
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
                          <FormLabel className="text-gray-700 font-medium">
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              defaultCountry="pk"
                              value={field.value}
                              onChange={field.onChange}
                              inputProps={{
                                name: "phone",
                                required: true,
                              }}
                              inputStyle={{
                                width: "92%",
                                height: "44px",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #d1d5db",
                                fontSize: "14px",
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Country *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-gray-500 w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg">
                                <SelectValue placeholder="Select your country" />
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
                  </div>
                </div>

                {/* Session Details Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Session Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Choose your preferred time and platform
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const minDate = tomorrow.toISOString().split("T")[0];

                        return (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Session Date *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                                type="date"
                                min={minDate}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="fromTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Start Time *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                              type="time"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const selectedTime = e.target.value;
                                if (selectedTime) {
                                  const [hour, minute] = selectedTime
                                    .split(":")
                                    .map(Number);
                                  const startDate = new Date();
                                  startDate.setHours(hour);
                                  startDate.setMinutes(minute + 30);

                                  const endHour = String(
                                    startDate.getHours()
                                  ).padStart(2, "0");
                                  const endMinute = String(
                                    startDate.getMinutes()
                                  ).padStart(2, "0");
                                  form.setValue(
                                    "toTime",
                                    `${endHour}:${endMinute}`
                                  );
                                }
                              }}
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
                          <FormLabel className="text-gray-700 font-medium">
                            End Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 bg-gray-50 border-gray-300 cursor-not-allowed rounded-lg"
                              type="time"
                              value={field.value}
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="meetingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Meeting Platform *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row gap-8 mt-2"
                          >
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                              <RadioGroupItem
                                value="Google Meet"
                                id="google-meet"
                                className="text-red-600"
                              />
                              <label
                                htmlFor="google-meet"
                                className="text-gray-700 font-medium cursor-pointer"
                              >
                                Google Meet
                              </label>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                              <RadioGroupItem
                                value="WhatsApp Call"
                                id="whatsapp-call"
                                className="text-red-600"
                              />
                              <label
                                htmlFor="whatsapp-call"
                                className="text-gray-700 font-medium cursor-pointer"
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
                </div>

                {/* Study Preferences Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Study Preferences
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tell us about your educational goals
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="studyDestination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Study Destination *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-gray-500 w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg">
                                <SelectValue placeholder="Select your preferred destination" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {destinations.map((destination) => (
                                <SelectItem
                                  key={destination}
                                  value={destination}
                                >
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
                          <FormLabel className="text-gray-700 font-medium">
                            Degree Level *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-gray-500 w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg">
                                <SelectValue placeholder="Select your degree level" />
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
                          <FormLabel className="text-gray-700 font-medium">
                            Field of Study *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                              placeholder="e.g., Computer Science, Business, Medicine"
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
                          <FormLabel className="text-gray-700 font-medium">
                            Budget Range *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-lg font-medium">
                                  $
                                </span>
                              </div>
                              <Input
                                className="placeholder:text-gray-400 placeholder:text-sm w-full h-11 pl-8 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                                type="number"
                                placeholder="Enter your budget (USD)"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Please enter your total budget for studies in USD
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Booking Session...</span>
                      </div>
                    ) : (
                      "Book My Session"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center p-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Session Booked Successfully!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your counseling session has been scheduled successfully. You
                will receive a confirmation email shortly with all the session
                details and meeting information.
              </p>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Perfect, Thank You!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
