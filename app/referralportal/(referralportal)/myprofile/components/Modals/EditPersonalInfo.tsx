"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types/reffertypes";
import { useRefUserStore } from "@/store/useRefDataStore";

const formSchema = z.object({
  contactNo: z.string().min(1, "Contact number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
});

export default function EditPersonalInfo({ data }: { data: User }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserProfile } = useRefUserStore();

  // Format date to YYYY-MM-DD for input if it exists
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    // Check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse the date and format it
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date

      // Format to YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNo: data?.contactNo || "",
      country: data?.country || "Pakistan",
      city: data?.city || "Lahore",
      dateOfBirth: formatDate(data?.dob) || "",
      facebook: data?.facebook || "",
      instagram: data?.instagram || "",
      linkedin: data?.linkedin || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitting with values:", values);
    setIsSubmitting(true);

    try {
      // Map form values to User object properties
      const userData = {
        contactNo: values.contactNo,
        country: values.country,
        city: values.city,
        dob: values.dateOfBirth,
        facebook: values.facebook || "",
        instagram: values.instagram || "",
        linkedin: values.linkedin || "",
      };

      const response = await updateUserProfile(userData);

      console.log("Update response:", response);

      if (response) {
        setOpen(false);
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
        }, 2000);
      } else {
        // Handle error case - you might want to show an error toast or message
        console.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error case - you might want to show an error toast or message
    } finally {
      setIsSubmitting(false);
    }
  }

  const countries = [
    { code: "+92", flag: "/pakflag.png", country: "Pakistan" },
    { code: "+1", flag: "/countryarchive/usa_logo.png", country: "USA" },
    { code: "+91", flag: "/countryarchive/india_logo.png", country: "India" },
    { code: "+61", flag: "/australia.png", country: "Australia" },
    { code: "+39", flag: "/countryarchive/italy_logo.png", country: "Italy" },
    {
      code: "+44",
      flag: "/countryarchive/uk_logo.png",
      country: "United Kingdom",
    },
    { code: "+1", flag: "/countryarchive/canada_logo.png", country: "Canada" },
    { code: "+86", flag: "/countryarchive/china_logo.png", country: "China" },
    {
      code: "+353",
      flag: "/countryarchive/IR_logo.png",
      country: "Ireland",
    },
    { code: "+64", flag: "/nz.png", country: "New Zealand" },
    {
      code: "+49",
      flag: "/countryarchive/germany_logo.png",
      country: "Germany",
    },
    { code: "+60", flag: "/countryarchive/my_logo.png", country: "Malaysia" },
    { code: "+33", flag: "/countryarchive/france_logo.png", country: "France" },
    {
      code: "+45",
      flag: "/countryarchive/denmark_logo.png",
      country: "Denmark",
    },
  ];

  const pakistanCities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
  ];

  return (
    <>
      <div className="flex flex-col items-start space-y-2">
        <p className="text-gray-600 text-base">Personal Information:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on{" "}
            {new Date(data?.updatedAt || Date.now()).toLocaleDateString(
              "en-GB"
            )}
          </p>
          <Image
            src="/DashboardPage/pen.svg"
            alt="Edit"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Basic Details</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Contact and Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact No.</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center bg-[#f1f1f1] px-3 rounded-l-md border-r">
                            <Image
                              src="/pakflag.png"
                              alt="Pakistan"
                              width={20}
                              height={20}
                              className="mr-1"
                            />
                            <span className="text-sm">+92</span>
                          </div>
                          <Input
                            {...field}
                            placeholder="3098487890"
                            className="bg-[#f1f1f1] rounded-l-none border-l-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] justify-between">
                          <div className="flex items-center">
                            <Image
                              src={
                                countries.find((c) => c.country === field.value)
                                  ?.flag || "/pakflag.png"
                              }
                              alt="Country flag"
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            <SelectValue placeholder="Select Country" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.country}
                              value={country.country}
                            >
                              {country.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City and Date of Birth Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1]">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {pakistanCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <Input
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Social Media Details */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Social Media Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Facebook */}
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="www.facebook.com/zakria12"
                            className="bg-[#f1f1f1] text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Instagram */}
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="www.instagram.com/zakria12"
                            className="bg-[#f1f1f1] text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn */}
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="www.linkedin.com/zakria24"
                            className="bg-[#f1f1f1] text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full md:w-[45%] bg-[#C7161E]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Basic Details"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Basic Details Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
