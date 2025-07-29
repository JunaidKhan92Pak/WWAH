
"use client";
import { useEffect, useState } from "react";
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
// import CurrentAddress from "./components/CurrentAddress";
import PassportAndVisaForm from "./components/PassportandVisaform";
import LearningExperienceAbroad from "./components/LearningExperienceAbroad";
import FinancialSponsorInformation from "./components/FinancialSponsorInformation";
import FamilyMembers from "./components/FamilyMembers";
import { useRouter } from "next/navigation";
import ContactDetailForm from "./components/ContactDetailform";
import { formSchema } from "./components/Schema";
import CompleteApplicationModal from "../CompleteApplicationModal";
import countries from "world-countries";
import { getAuthToken } from "@/utils/authHelper";



const BasicInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = 6;
  const router = useRouter();
  // Get unique nationalities and country names
  const countryOptions = countries.map((c) => ({
    label: c.name.common,
    value: c.cca2,
    id: c.cca3, // Unique 3-letter code
  }));

  const nationalityOptions = countries.map((c) => ({
    label: c.demonyms?.eng?.m || c.name.common, // fallback to country name
    value: c.demonyms?.eng?.m || c.name.common,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      familyMembers: [],
      hasPassport: false,
      hasStudiedAbroad: false,
      countryCode: "+1",
      isFamilyNameEmpty: false,
      isGivenNameEmpty: false,
    },
  });
  const token = getAuthToken();
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationErrors([]);

    console.log("Form submitted");

    // Check if the form is valid
    const isValid = await form.trigger();
    console.log("Form valid?", isValid);

    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    } else {
      // Collect all validation errors
      const errors = form.formState.errors;
      const errorMessages: string[] = [];

      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          errorMessages.push(`${key}: ${error.message}`);
        }
      });

      setValidationErrors(errorMessages);
      console.log("Form validation failed:", errors);

      // Show validation errors in toast
      toast.error("Please fix the following errors:", {
        description:
          errorMessages.slice(0, 3).join(", ") +
          (errorMessages.length > 3 ? "..." : ""),
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Starting form submission...");

    try {
      setIsSubmitting(true);
      setValidationErrors([]);

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

      console.log("Sending formatted data:", formattedData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/basicInformation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        }
      );

      // console.log("Response status:", response.status);
      // console.log("Response headers:", response.headers);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        toast.success("Basic information saved successfully!", {
          duration: 4000,
          position: "top-center",
          style: {
            backgroundColor: "#10b981",
            color: "white",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
        });

        // Wait a bit before navigation to show the success message
        setTimeout(() => {
          router.push("/dashboard/completeapplication");
        }, 1500);
      } else {
        // Handle API error response
        const errorMessage =
          result.message || result.error || "Failed to save information";
        console.error("API Error:", errorMessage);

        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
          style: {
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "An error occurred while saving your information";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Enhanced error toast for exceptions
      toast.error(errorMessage, {
        duration: 6000,
        position: "top-center",
        style: {
          backgroundColor: "#ef4444",
          color: "white",
          fontSize: "16px",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextPage = async () => {
    const currentPageIsValid = await validateCurrentPage();
    if (currentPageIsValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      setValidationErrors([]); // Clear errors when moving to next page
    } else {
      // Show validation errors for current page
      const errors = form.formState.errors;
      const errorMessages: string[] = [];

      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          errorMessages.push(`${key}: ${error.message}`);
        }
      });

      setValidationErrors(errorMessages);

      toast.error("Please fix the errors on this page before continuing", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const validateCurrentPage = async () => {
    switch (currentPage) {
      case 1:
        return await form.trigger([
          "familyName",
          "givenName",
          "gender",
          "DOB",
          "nationality",
          "countryOfResidence",
          "maritalStatus",
          // "religion",
          // "nativeLanguage",
        ]);
      case 2:
        return await form.trigger([
          "homeAddress",
          "detailedAddress",
          "country",
          "city",
          "zipCode",
          "email",
          "countryCode",
          "phoneNo",
        ]);
      case 4:
        return await form.trigger([
          "hasPassport",
          "passportNumber",
          "passportExpiryDate",
          "oldPassportNumber",
          "oldPassportExpiryDate",
        ]);
      case 5:
        return await form.trigger([
          "hasStudiedAbroad",
          "visitedCountry",
          "studyDuration",
          "institution",
          "visaType",
          "visaExpiryDate",
          "durationOfStudyAbroad",
        ]);
      case 6:
        return await form.trigger([
          "sponsorName",
          "sponsorRelationship",
          "sponsorsNationality",
          "sponsorsOccupation",
          "sponsorsEmail",
          "sponsorsCountryCode",
          "sponsorsPhoneNo",
        ]);
      case 7:
        return await form.trigger(["familyMembers"]);
      default:
        return true;
    }
  };

  // Use watch to observe form values
  const watchedValues = form.watch();
  console.log("Watched Values:", watchedValues);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSaveAndContinue = () => {
    setIsModalOpen(true);
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCompleteApplication = () => {
    console.log("Application Completed!");
  };

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getBasicInformation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        console.log("Response status:", res.status);

        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data) {
          // 4️⃣ Transform dates and nested data
          const data = result.data;
          const formatted = {
            ...data,
            DOB: data.DOB ? new Date(data.DOB) : null,
            passportExpiryDate: data.passportExpiryDate
              ? new Date(data.passportExpiryDate)
              : null,
            oldPassportExpiryDate: data.oldPassportExpiryDate
              ? new Date(data.oldPassportExpiryDate)
              : null,
            visaExpiryDate: data.visaExpiryDate
              ? new Date(data.visaExpiryDate)
              : null,
            familyMembers: data.familyMembers ?? [],
          };
          // 5️⃣ Reset RHF with fetched values
          form.reset(formatted);
        }
      } catch (err) {
        console.error("Failed to load saved application", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, [form]);

  // 6️⃣ Show a loading state until data is ready
  if (isLoading) {
    return <div className="text-center py-10">Loading your application…</div>;
  }

  return (
    <div className="w-[90%] xl:w-[60%] mx-auto mt-4">
      {/* Page Titles */}
      {currentPage === 1 && (
        <h6 className="font-semibold text-center">Personal Information</h6>
      )}
      {currentPage === 2 && (
        <h6 className="font-semibold text-center">Contact Details</h6>
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

      {/* Display validation errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleFormSubmit}>
          {/* Page 1: Personal Information */}
          {currentPage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end my-4">
              {/*  Family Name field  */}
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
                              form.setValue(
                                "familyName",
                                checked === true ? "" : field.value || ""
                              );
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
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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

              {/*  Given Name field  */}
              <FormField
                control={form.control}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name (As per your Passport):</FormLabel>
                    <FormField
                      control={form.control}
                      name="isGivenNameEmpty"
                      render={({ field: checkboxField }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="isGivenNameEmpty"
                            checked={checkboxField.value}
                            onCheckedChange={(checked) => {
                              checkboxField.onChange(checked);
                              form.setValue(
                                "givenName",
                                checked === true ? "" : field.value || ""
                              );
                            }}
                          />
                          <label
                            htmlFor="isGivenNameEmpty"
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            The Given name in the passport is empty.
                          </label>
                        </div>
                      )}
                    />
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Enter Given Name"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={form.watch("isGivenNameEmpty")}
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
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {nationalityOptions.map((option, key) => (
                          <SelectItem key={key} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
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
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {countryOptions.map((option) => (
                          <SelectItem key={option.id} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
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

              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        placeholder="Write..."
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nativeLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Native Language</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        placeholder="Write..."
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
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
          {currentPage === 3 && <PassportAndVisaForm form={form} />}
          {currentPage === 4 && <LearningExperienceAbroad form={form} />}
          {currentPage === 5 && <FinancialSponsorInformation form={form} />}
          {currentPage === 6 && <FamilyMembers form={form} />}
          <div className="mt-6 flex justify-between">
            <Pagination>
              <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      setValidationErrors([]); // Clear errors when going back
                    }}
                    className={`p-2 text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      }`}
                  >
                    Previous
                  </PaginationPrevious>
                </PaginationItem>

                <span className="px-4 py-2 text-sm font-semibold rounded-lg border">
                  {currentPage} of {totalPages}
                </span>

                {currentPage !== totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextPage();
                      }}
                      className="p-2 text-sm"
                    >
                      Next
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>

            {currentPage === totalPages && (
              <Button
                type="submit"
                className="bg-red-700 hover:bg-red-700"
                disabled={isSubmitting}
                onClick={handleSaveAndContinue}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isSubmitted
                    ? "Submitted"
                    : "Save and Continue"}
              </Button>
            )}

            <CompleteApplicationModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onCompleteApplication={handleCompleteApplication}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BasicInfo;
