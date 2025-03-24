"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CurrentAddress from "./components/CurrentAddress";
import PassportAndVisaForm from "./components/PassportandVisaform";
import LearningExperienceAbroad from "./components/LearningExperienceAbroad";
import FinancialSponsorInformation from "./components/FinancialSponsorInformation";
import FamilyMembers from "./components/FamilyMembers";
import { useRouter } from "next/navigation";
import ContactDetailForm from "./components/ContactDetailform";
import { formSchema } from "./components/Schema";

const BasicInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalPages = 7;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyMembers: [],
      hasPassport: false,
      hasStudiedAbroad: false,
      countryCode: "+1",
      isFamilyNameEmpty: false,
    },
  });
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted"); // Check if it logs
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("jkj");
    try {
      setIsSubmitting(true);
      console.log("Form data:", data);
      // Format dates for API submission
      const formattedData = {
        ...data,
        DOB: data.DOB ? format(data.DOB, "yyyy-MM-dd") : undefined,
        passportExpiryDate: data.passportExpiryDate
          ? format(data.passportExpiryDate, "yyyy-MM-dd")
          : undefined,
        oldPassportExpiryDate: data.oldPassportExpiryDate
          ? format(data.oldPassportExpiryDate, "yyyy-MM-dd")
          : undefined,
        visaExpiryDate: data.visaExpiryDate
          ? format(data.visaExpiryDate, "yyyy-MM-dd")
          : undefined,
      };

      // Map familyMembers to match schema if present
      if (data.familyMembers && data.familyMembers.length > 0) {
        formattedData.familyMembers = data.familyMembers.map((member) => ({
          name: member.name,
          relationship: member.relationship,
          nationality: member.nationality,
          occupation: member.occupation,
          email: member.email,
          countryCode: member.countryCode,
          phoneNo: member.phoneNo,
        }));
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/basicInformation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        }
      );

      const result = await response.json();
      console.log(result, "hhk");

      if (result.success) {
        toast.success("Basic information saved successfully!");
        router.push("/completeprofile/academicinformation");
      } else {
        toast.error(result.message || "Failed to save information");
      }
    } catch (error) {
      console.error(`Error submitting form:`, error);
      toast.error("An error occurred while saving your information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextPage = () => {
    const currentPageIsValid = validateCurrentPage();
    if (currentPageIsValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const validateCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return form.trigger([
          "familyName",
          "givenName",
          "gender",
          "DOB",
          "nationality",
          "countryOfResidence",
          "maritalStatus",
          "religion",
        ]);
      case 2:
        return form.trigger([
          "homeAddress",
          "detailedAddress",
          "country",
          "city",
          "zipCode",
          "email",
          "countryCode",
          "phoneNo",
        ]);
      case 3:
        return form.trigger([
          "currentHomeAddress",
          "currentDetailedAddress",
          "currentCountry",
          "currentCity",
          "currentZipCode",
          "currentEmail",
          "currentCountryCode",
          "currentPhoneNo",
        ]);
      case 4:
        return form.trigger([
          "hasPassport",
          "passportNumber",
          "passportExpiryDate",
          "oldPassportNumber",
          "oldPassportExpiryDate",
        ]);
      case 5:
        return form.trigger([
          "hasStudiedAbroad",
          "visitedCountry",
          "studyDuration",
          "institution",
          "visaType",
          "visaExpiryDate",
          "durationOfStudyAbroad",
        ]);
      case 6:
        return form.trigger([
          "sponsorName",
          "sponsorRelationship",
          "sponsorsNationality",
          "sponsorsOccupation",
          "sponsorsEmail",
          "sponsorsCountryCode",
          "sponsorsPhoneNo",
        ]);
      case 7:
        return form.trigger(["familyMembers"]);
      // Add validation for other pages as needed
      default:
        return true;
    }
  };
  // Use watch to observe form values
  // const watchedValues = form.watch();
  // Log watched values dynamically
  // console.log("Watched Values:", watchedValues);
  return (
    <div className="w-[90%] xl:w-[60%] mx-auto mt-4">
      {/* Page Titles */}
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
        <form onSubmit={handleFormSubmit}>
          {/* Page 1: Personal Information */}
          {currentPage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end my-4">
              {/* familyName */}
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name (As per your Passport):</FormLabel>

                    <FormField
                      control={form.control}
                      name="isFamilyNameEmpty"
                      render={({ field: checkboxField }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="isFamilyNameEmpty"
                            checked={checkboxField.value}
                            onCheckedChange={(checked) => {
                              checkboxField.onChange(checked);
                              if (checked) {
                                form.setValue("familyName", "");
                              }
                            }}
                          />
                          <label
                            htmlFor="isFamilyNameEmpty"
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            The Family name in the passport is empty.
                          </label>
                        </div>
                      )}
                    />

                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Enter Family Name"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                          {...field}
                          disabled={form.watch("isFamilyNameEmpty")}
                        />
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
              {/* givenName */}
              <FormField
                control={form.control}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name (As per your Passport):</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Enter Given Name"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                          {...field}
                        />
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
              {/* gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* DOB */}
              <FormField
                control={form.control}
                name="DOB"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        // value={
                        //   field.value ? format(field.value, "yyyy-MM-dd") : ""
                        // }
                        // onChange={(e) => {
                        //   const date = e.target.value
                        //     ? new Date(e.target.value)
                        //     : undefined;
                        //   field.onChange(date);
                        // }}
                        value={
                          field.value
                            ? format(new Date(field.value), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        className="bg-[#f1f1f1]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* nationality */}
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              {/* countryOfResidence */}
              <FormField
                control={form.control}
                name="countryOfResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Residence:</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <SelectItem value="New Zealand">New Zealand</SelectItem>
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
              {/* maritalStatus */}
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* religion */}
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
            </div>
          )}

          {/* Component pages */}
          {currentPage === 2 && <ContactDetailForm form={form} />}
          {currentPage === 3 && <CurrentAddress form={form} />}
          {currentPage === 4 && <PassportAndVisaForm form={form} />}
          {currentPage === 5 && <LearningExperienceAbroad form={form} />}
          {currentPage === 6 && <FinancialSponsorInformation form={form} />}
          {currentPage === 7 && <FamilyMembers form={form} />}

          {/* Navigation and Submit */}
          <div className="mt-6 flex justify-between">
            {currentPage === totalPages ? (
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save and Continue"}
              </Button>
            ) : (
              <Pagination>
                <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={`p-2 text-sm ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      Previous
                    </PaginationPrevious>
                  </PaginationItem>

                  <span className="px-4 py-2 text-sm font-semibold rounded-lg border">
                    {currentPage} of {totalPages}
                  </span>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextPage();
                      }}
                      className={`p-2 text-sm ${
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
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BasicInfo;
