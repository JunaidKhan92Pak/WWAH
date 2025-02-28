"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ContactDetailform from "./Basic/ContactDetailform";
import CurrentAddress from "./Basic/CurrentAddress";
import PassportAndVisaForm from "./Basic/PassportandVisaform";
import LearningExperienceAbroad from "./Basic/LearningExperienceAbroad";
import FinancialSponsorInformation from "./Basic/FinancialSponsorInformation";
import FamilyMembers from "./Basic/FamilyMembers";

// Form Validation Schema
const formSchema = z.object({
  country: z.string().nonempty("Please select a country."),
  religion: z.string().nonempty("Please enter your religion."),
  maritalStatus: z.enum(["single", "married"], {
    required_error: "Please select your marital status.",
  }),
  nationality: z.string().nonempty("Please select your nationality."), // Changed to string for flexibility
  dob: z
    .date()
    .refine((date) => date >= new Date("1900-01-01") && date <= new Date(), {
      message: "Please enter a valid date of birth.",
    }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender.",
  }),
  givenName: z.string().min(1, { message: "Please enter your given name." }),
  isFamilyNameEmpty: z.boolean().optional(),
  familyName: z.string().optional(),
});

const BasicInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7; // Change based on your form pages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!", {
      description: "We'll get back to you soon.",
    });
    console.log(values);
  }

  return (
    <div className="w-[90%] xl:w-[60%] mx-auto mt-4">
      {currentPage === 1 && (
        <h6 className="font-semibold text-center">Personal Information</h6>
      )}
      {currentPage === 2 && (
        <h6 className="font-semibold text-center">Contact Details</h6>
      )}
      {currentPage === 3 && (
        <h6 className="font-semibold text-center">Current Address</h6>
      )}
      {currentPage === 4 && (
        <h6 className="font-semibold text-center">
          Passport & Visa Information
        </h6>
      )}
      {currentPage === 5 && (
        <h6 className="font-semibold text-center">
          Learning Experience Abroad
        </h6>
      )}
      {currentPage === 6 && (
        <h6 className="font-semibold text-center">
          Financial Sponsor Information
        </h6>
      )}
      {currentPage === 7 && (
        <h6 className="font-semibold text-center">Family Members</h6>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end my-4">
            {/* Page 1 */}
            {currentPage === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Name (As per your Passport):</FormLabel>

                      {/* ShadCN Checkbox */}
                      <div className="flex items-center gap-2">
                        <Checkbox id="confirm-name" />
                        <label
                          htmlFor="confirm-name"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          The Family name in the passport is empty.
                        </label>
                      </div>

                      <FormControl>
                        <div className="relative w-full">
                          {/* Input Field */}
                          <Input
                            type="text"
                            placeholder="Enter Family Name"
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                            {...field}
                          />

                          {/* Image inside the Input using Next.js Image */}
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Image
                              src="/DashboardPage/User.svg"
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

                <FormField
                  control={form.control}
                  name="givenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Given Name (As per your Passport):</FormLabel>
                      {/* ShadCN Checkbox */}
                      <div className="flex items-center gap-2">
                        <Checkbox id="confirm-name" />
                        <label
                          htmlFor="confirm-name"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          The Family name in the passport is empty.
                        </label>
                      </div>
                      <FormControl>
                        <div className="relative w-full">
                          {/* Input Field */}
                          <Input
                            type="text"
                            placeholder="Enter Family Name"
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                            {...field}
                          />

                          {/* Image inside the Input using Next.js Image */}
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Image
                              src="/DashboardPage/User.svg"
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
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal bg-[#f1f1f1] ${
                                !field.value ? "text-[#313131]" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "yyyy/MM/dd")
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select Nationality" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="Australian">Australian</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Pakistani">Pakistani</SelectItem>
                          <SelectItem value="Canadian">Canadian</SelectItem>
                          <SelectItem value="British">British</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                          <SelectItem value="Irish">Irish</SelectItem>
                          <SelectItem value="New Zealander">
                            New Zealander
                          </SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Malaysian">Malaysian</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Danish">Danish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence:</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Italy">Italy</SelectItem>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="China">China</SelectItem>
                          <SelectItem value="Ireland">Ireland</SelectItem>
                          <SelectItem value="New Zealand">
                            New Zealand
                          </SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Malaysia">Malaysia</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Denmark">Denmark</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>

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
              </>
            )}
          </div>

          {currentPage === 2 && <ContactDetailform />}
          {currentPage === 3 && <CurrentAddress />}
          {currentPage === 4 && <PassportAndVisaForm />}
          {currentPage === 5 && <LearningExperienceAbroad />}
          {currentPage === 6 && <FinancialSponsorInformation />}
          {currentPage === 7 && <FamilyMembers />}

          {/* Pagination Controls */}
          <Pagination>
              {/* Previous Button */}
            <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`p-2 text-sm  ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>



              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={`p-2 text-sm  ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>



        </form>
      </Form>
    </div>
  );
};

export default BasicInfo;
