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
import { countries } from "@/lib/countries";

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
  ticket: z
    .any()
    .refine((files) => files?.length >= 1, "Ticket file is required."),
});

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phoneCountry: "Pakistan|+92",
      phoneNo: "",
      country: "",
      university: "",
      city: "",
      pickupOption: "",
      dropOffLocation: "",
      additionalPreference: "",
    },
  });

  // Synchronize country selection with phone country code
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        const selectedCountry = countries.find((c) => c.name === value.country);
        if (selectedCountry) {
          form.setValue(
            "phoneCountry",
            `${selectedCountry.name}|${selectedCountry.code}`
          );
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
    setOpen(false);
  };

  const handleCancel = () => {
    setFlightData({
      arrivalDate: "",
      time: "",
      airportName: "",
      flightNumber: "",
      airlineName: "",
    });
    setOpen(false);
  };

  // Form submission function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitMessage({ type: "", message: "" });

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all form fields (excluding ticket)
      Object.keys(values).forEach((key) => {
        if (key !== "ticket") {
          const value = values[key as keyof typeof values];
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      // Add file - Fixed file handling
      const fileInput = values.ticket;
      if (fileInput && fileInput.length > 0) {
        formData.append("ticket", fileInput[0]);
        console.log("File selected:", fileInput[0].name, fileInput[0].size);
      } else {
        throw new Error("Please select a ticket file");
      }

      // Add flight details as JSON string
      formData.append("flightDetails", JSON.stringify(flightData));

      // Log form data for debugging
      console.log("Submitting form with data:");
      for (const [key, value] of formData.entries()) {
        if (key === "ticket") {
          console.log(key, "File:", value);
        } else {
          console.log(key, value);
        }
      }

      // Submit the form to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/airportPickup`,
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header when using FormData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);

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
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Improved CountryFlag component with error handling
  const CountryFlag = ({ url }: { url: string }) => {
    const [imageError, setImageError] = useState(false);

    if (!url || imageError) {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">🌍</span>
        </div>
      );
    }

    return (
      <div className="relative w-5 h-5 rounded-full overflow-hidden">
        <Image
          src={url}
          alt="Country flag"
          fill
          className="object-cover"
          sizes="24px"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mx-auto max-w-3xl">
        <div className="md:w-[70%] mx-auto mb-2">
          <h6 className=" text-gray-900 text-center font-semibold leading-snug">
            Fill out the airport pickup form below with your travel details so
            we can arrange a hassle-free pickup for you.{" "}
          </h6>
        </div>

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
                {/* <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1]">
                            <SelectValue placeholder="Select country">
                              {field.value && (
                                <span className="flex items-center gap-2">
                                  <span>{field.value}</span>
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              <span className="flex items-center gap-2">
                                <span>{country.name}</span>
                              </span>
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter country"
                          className="bg-[#f1f1f1] placeholder-[#313131]  placeholder:text-sm text-sm"
                          {...field}
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          placeholder="Enter university"
                          {...field}
                          className="bg-[#f1f1f1] placeholder:text-sm"
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          className="bg-[#f1f1f1] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Document Upload Section - Fixed */}
                <FormField
                  control={form.control}
                  name="ticket"
                  render={({ field: { onChange, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Upload Ticket *</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          name={name}
                          ref={ref}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-[#f1f1f1] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
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
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dropOffLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Off Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter drop off location"
                          {...field}
                          className="bg-[#f1f1f1] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
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
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional preferences or requirements"
                        {...field}
                        className="bg-[#f1f1f1] placeholder:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
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
                                <SelectTrigger className="w-[150px] bg-[#f1f1f1]">
                                  <SelectValue>
                                    {countryField.value && (
                                      <span className="flex items-center gap-2">
                                        <CountryFlag
                                          url={
                                            countries.find(
                                              (c) =>
                                                `${c.name}|${c.code}` ===
                                                countryField.value
                                            )?.flag || ""
                                          }
                                        />
                                        <span>
                                          {
                                            countries.find(
                                              (c) =>
                                                `${c.name}|${c.code}` ===
                                                countryField.value
                                            )?.code
                                          }
                                        </span>
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={`${country.name}|${country.code}`}
                                    value={`${country.name}|${country.code}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <CountryFlag url={country.flag} />
                                      <span>
                                        {country.name} ({country.code})
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter phone number"
                          className="flex-1 bg-[#f1f1f1] placeholder:text-sm"
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
                          placeholder="Enter your email address"
                          {...field}
                          className="bg-[#f1f1f1] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="bg-[#FCE7D2] hover:bg-[#FCE7D2] text-black"
                  >
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                      Save
                    </Button>
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
