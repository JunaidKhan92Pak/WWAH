"use client";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { useEffect } from "react";
import Image from "next/image";
import { FaPlaneDeparture } from "react-icons/fa6";

// Comprehensive country data with flag image URLs
const countries = [
  {
    code: "US",
    name: "United States",
    phoneCode: "+1",
    flagUrl: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "GB",
    name: "United Kingdom",
    phoneCode: "+44",
    flagUrl: "https://flagcdn.com/w40/gb.png",
  },
  {
    code: "AU",
    name: "Australia",
    phoneCode: "+61",
    flagUrl: "https://flagcdn.com/w40/au.png",
  },
  {
    code: "CA",
    name: "Canada",
    phoneCode: "+1",
    flagUrl: "https://flagcdn.com/w40/ca.png",
  },
];

const formSchema = z.object({
  // Personal Information
  email: z.string().email("Invalid email address"),
  phoneCountry: z.string().min(1, "Country code is required"),
  phoneNo: z.string().min(1, "Phone number is required"),
  // Location Details
  country: z.string().min(1, "Country is required"),
  university: z.string().min(1, "University is required"),
  city: z.string().min(1, "City is required"),
  // Pickup Details
  pickupOption: z.string().min(1, "Pickup option is required"),
  dropOffLocation: z.string().min(1, "Drop off location is required"),
  // Additional Information
  additionalPreference: z.string().optional(),
  ticket: z.any().optional(), // Change to any to handle file upload
});

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Personal Information
      email: "",
      phoneCountry: "+1",
      phoneNo: "",
      // Location Details
      country: "",
      university: "",
      city: "",
      // Pickup Details
      pickupOption: "",
      dropOffLocation: "",
      // Additional Information
      additionalPreference: "",
    },
  });

  // Synchronize country selection with phone country code
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        const selectedCountry = countries.find((c) => c.code === value.country);
        if (selectedCountry) {
          form.setValue("phoneCountry", selectedCountry.phoneCode);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Flight details modal state
  const [open, setOpen] = useState(false);
  const [flightData, setFlightData] = useState({
    arrivalDate: "",
    time: "",
    airportName: "",
    flightNumber: "",
    airlineName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlightData({ ...flightData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved Flight Details:", flightData);
    setOpen(false); // Close modal after saving
  };

  const handleCancel = () => {
    setFlightData({
      arrivalDate: "",
      time: "",
      airportName: "",
      flightNumber: "",
      airlineName: "",
    });
    setOpen(false); // Close modal on cancel
  };

  // Form submission function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitMessage({ type: "", message: "" });

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all form fields
      Object.keys(values).forEach((key) => {
        if (key !== "ticket") {
          formData.append(key, values[key as keyof typeof values] as string);
        }
      });

      // Add file if it exists
      const ticketField = form.getValues("ticket");
      if (ticketField && ticketField[0]) {
        formData.append("ticket", ticketField[0]);
      }
      // Add flight details as JSON string
      formData.append("flightDetails", JSON.stringify(flightData));
      // Submit the form to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/airportPickup`,
        {
          method: "POST",
          body: formData,
          // Note: Don't set Content-Type header when using FormData
        }
      );
      const data = await response.json();
      if (data.success) {
        setSubmitMessage({
          type: "success",
          message:
            "Your airport pickup request has been submitted successfully.",
        });
        // Reset form
        form.reset();
        setFlightData({
          arrivalDate: "",
          time: "",
          airportName: "",
          flightNumber: "",
          airlineName: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({
        type: "error",
        message: "Failed to submit your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const CountryFlag = ({ url }: { url: string }) => (
    <div className="relative w-4 h-4 rounded-full overflow-hidden">
      <Image
        src={url}
        alt="Country flag"
        fill
        className="object-cover"
        sizes="24px"
      />
    </div>
  );
  return (
    <div className="p-4">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xl font-semibold">
          Fill out the airport pickup form below with your travel details so we
          can arrange a hassle-free pickup for you.
        </p>

        {submitMessage.message && (
          <div
            className={`p-4 my-4 rounded ${
              submitMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitMessage.message}
          </div>
        )}

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Location Information Section */}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                          <SelectTrigger className="bg-[#f1f1f1]">
                            <SelectValue placeholder="Select country">
                              {field.value && (
                                <span className="flex items-center gap-2">
                                  <CountryFlag
                                    url={
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.flagUrl || ""
                                    }
                                  />
                                  <span>
                                    {
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.name
                                    }
                                  </span>
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country, index) => (
                            <SelectItem key={index} value={country.code}>
                              <span className="flex items-center gap-2">
                                <CountryFlag url={country.flagUrl} />
                                <span>{country.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.country?.message}
                      </FormMessage>
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
                          <SelectTrigger className="bg-[#f1f1f1]">
                            <SelectValue placeholder="Select university" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="harvard">
                            Harvard University
                          </SelectItem>
                          <SelectItem value="mit">MIT</SelectItem>
                          <SelectItem value="stanford">
                            Stanford University
                          </SelectItem>
                          <SelectItem value="oxford">
                            Oxford University
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.university?.message}
                      </FormMessage>
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
                          <SelectTrigger className="bg-[#f1f1f1]">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="newyork">New York</SelectItem>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="toronto">Toronto</SelectItem>
                          <SelectItem value="sydney">Sydney</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.city?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/* Document Upload Section */}
                <FormField
                  control={form.control}
                  name="ticket"
                  render={({ field: { onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Upload Ticket</FormLabel>
                      <FormControl className="bg-[#f1f1f1]">
                        <Input
                          type="file"
                          {...fieldProps}
                          onChange={(e) => {
                            // Only update if files exist
                            onChange(e.target.files ? e.target.files : null);
                          }}
                          // Important: Explicitly set value to undefined
                          value={undefined}
                        />
                      </FormControl>
                      <FormMessage>
                        {String(form.formState.errors.ticket?.message || "")}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/* Pickup Details Section */}
                <FormField
                  control={form.control}
                  name="pickupOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose your Pickup Option</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1]">
                            <SelectValue placeholder="Select pickup option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard Pickup
                          </SelectItem>
                          <SelectItem value="premium">
                            Premium Pickup
                          </SelectItem>
                          <SelectItem value="group">Group Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.pickupOption?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropOffLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Off Location</FormLabel>
                      <FormControl className="bg-[#f1f1f1]">
                        <Input
                          placeholder="Enter drop off location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.dropOffLocation?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Preferences Section */}

              <FormField
                control={form.control}
                name="additionalPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Preference</FormLabel>
                    <FormControl className="bg-[#f1f1f1] placeholder:text-sm ">
                      <Textarea
                        placeholder="Enter any additional preferences or requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.additionalPreference?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Contact Information Section */}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="phoneCountry"
                          render={({ field: countryField }) => (
                            <Select
                              onValueChange={countryField.onChange}
                              value={countryField.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[120px] bg-[#f1f1f1] ">
                                  <SelectValue>
                                    {countryField.value && (
                                      <span className="flex items-center gap-2">
                                        <CountryFlag
                                          url={
                                            countries.find(
                                              (c) =>
                                                c.phoneCode ===
                                                countryField.value
                                            )?.flagUrl || ""
                                          }
                                        />
                                        <span>{countryField.value}</span>
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.phoneCode}
                                  >
                                    <span className="flex items-center gap-2 ">
                                      <CountryFlag url={country.flagUrl} />
                                      <span>{country.phoneCode}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormControl className="bg-[#f1f1f1] placeholder:text-sm">
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage>
                        {form.formState.errors.phoneNo?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl className="bg-[#f1f1f1] placeholder:text-sm">
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FCE7D2] hover:bg-[#FCE7D2] text-black">
                    <FaPlaneDeparture className="mr-2" /> Add Flight Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-6">
                  <DialogHeader>
                    <DialogTitle>Flight Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="arrivalDate">Arrival Date</Label>
                      <Input
                        type="date"
                        id="arrivalDate"
                        name="arrivalDate"
                        value={flightData.arrivalDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        type="time"
                        id="time"
                        name="time"
                        value={flightData.time}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="airportName">Airport Name</Label>
                      <Input
                        type="text"
                        id="airportName"
                        name="airportName"
                        value={flightData.airportName}
                        onChange={handleChange}
                        placeholder="Write..."
                        className="placeholder:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightNumber">Flight Number</Label>
                      <Input
                        type="text"
                        id="flightNumber"
                        name="flightNumber"
                        value={flightData.flightNumber}
                        onChange={handleChange}
                        placeholder="Write..."
                        className="placeholder:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="airlineName">Airline Name</Label>
                      <Input
                        type="text"
                        id="airlineName"
                        name="airlineName"
                        value={flightData.airlineName}
                        onChange={handleChange}
                        placeholder="Write..."
                        className="placeholder:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-right">
                <Button
                  type="submit"
                  className="w-1/3 sm:w-1/4 bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
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
