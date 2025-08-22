"use client";
// import { useEffect, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
import { startCase } from "lodash";
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
// import { toast } from "sonner";
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
// import { formSchema } from "./components/Schema";
import countries from "world-countries";
// import { getAuthToken } from "@/utils/authHelper";
import CompleteApplicationModal from "../CompleteApplicationModal";
import SubmissionSuccessModal from "../SubmissionSuccessModal";

// const BasicInfo = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const totalPages = 6;
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const stepFromQuery = parseInt(searchParams.get("step") || "1", 10);
//   const step = searchParams.get("step") || "1";
//   console.log("Step from query:", step);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//   const [hasAcceptedConsent, setHasAcceptedConsent] = useState(false);
//   const [isSubmitted] = useState(false);
//   // console.log("Step from query:", hasAcceptedConsent);
//   // setCurrentPage(parseInt(step));
//   useEffect(() => {
//     if (!isNaN(stepFromQuery)) {
//       setCurrentPage(stepFromQuery);
//     }
//   }, [stepFromQuery]);
//   // Get unique nationalities and country names
//   const countryOptions = countries.map((c) => ({
//     label: c.name.common,
//     value: c.cca2,
//     id: c.cca3, // Unique 3-letter code
//   }));

//   const nationalityOptions = countries.map((c) => ({
//     label: c.demonyms?.eng?.m || c.name.common, // fallback to country name
//     value: c.demonyms?.eng?.m || c.name.common,
//   }));

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: "onChange", // Enable real-time validation
//     defaultValues: {
//       familyMembers: [],
//       hasPassport: false,
//       hasStudiedAbroad: false,
//       countryCode: "+1",
//       isFamilyNameEmpty: false,
//       isGivenNameEmpty: false,
//       religion: "",
//       nativeLanguage: "",
//     },
//   });

//   const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setValidationErrors([]);

//     console.log("Form submitted");

//     // Check if the form is valid
//     const isValid = await form.trigger();
//     console.log("Form valid?", isValid);

//     if (isValid) {
//       const formData = form.getValues();
//       await onSubmit(formData);
//     } else {
//       // Collect all validation errors
//       const errors = form.formState.errors;
//       const errorMessages: string[] = [];

//       Object.keys(errors).forEach((key) => {
//         const error = errors[key as keyof typeof errors];
//         if (error?.message) {
//           errorMessages.push(`${key}: ${error.message}`);
//         }
//       });

//       setValidationErrors(errorMessages);
//       console.log("Form validation failed:", errors);

//       // Show validation errors in toast
//       toast.error("Please add the following field:", {
//         description:
//           errorMessages.slice(0, 3).join(", ") +
//           (errorMessages.length > 3 ? "..." : ""),
//         duration: 5000,
//         position: "top-center",
//       });
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     router.replace(`/dashboard/completeapplication?tab=basicinfo&step=${page}`);
//   };
//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     console.log("Starting form submission...");

//     try {
//       setIsSubmitting(true);
//       setValidationErrors([]);

//       console.log("Form data:", data);

//       // Format dates for API submission
//       const formattedData = {
//         ...data,
//         DOB: data.DOB ? format(data.DOB, "yyyy-MM-dd") : undefined,
//         passportExpiryDate: data.passportExpiryDate
//           ? format(data.passportExpiryDate, "yyyy-MM-dd")
//           : undefined,
//         oldPassportExpiryDate: data.oldPassportExpiryDate
//           ? format(data.oldPassportExpiryDate, "yyyy-MM-dd")
//           : undefined,
//         visaExpiryDate: data.visaExpiryDate
//           ? format(data.visaExpiryDate, "yyyy-MM-dd")
//           : undefined,
//       };

//       // Map familyMembers to match schema if present
//       if (data.familyMembers && data.familyMembers.length > 0) {
//         formattedData.familyMembers = data.familyMembers.map((member) => ({
//           name: member.name,
//           relationship: member.relationship,
//           nationality: member.nationality,
//           occupation: member.occupation,
//           email: member.email,
//           countryCode: member.countryCode,
//           phoneNo: member.phoneNo,
//         }));
//       }

//       console.log("Sending formatted data:", formattedData);

//       const token = getAuthToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/basicInformation`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify(formattedData),
//         }
//       );

//       console.log("Response status:", response.status);
//       console.log("Response headers:", response.headers);

//       // Check if response is ok
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (result.success) {
//         // Show success modal instead of toast and navigation
//         console.log("API call successful, showing success modal");
//         setIsSuccessModalOpen(true);
//       } else {
//         // Handle API error response
//         const errorMessage =
//           result.message || result.error || "Failed to save information";
//         console.error("API Error:", errorMessage);

//         toast.error(errorMessage, {
//           duration: 5000,
//           position: "top-center",
//           style: {
//             backgroundColor: "#ef4444",
//             color: "white",
//             fontSize: "16px",
//             padding: "16px",
//             borderRadius: "8px",
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);

//       let errorMessage = "An error occurred while saving your information";

//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       // Enhanced error toast for exceptions
//       toast.error(errorMessage, {
//         duration: 6000,
//         position: "top-center",
//         style: {
//           backgroundColor: "#ef4444",
//           color: "white",
//           fontSize: "16px",
//           padding: "16px",
//           borderRadius: "8px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//         },
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleNextPage = async () => {
//     const currentPageIsValid = await validateCurrentPage();
//     if (currentPageIsValid) {
//       goToPage(Math.min(currentPage + 1, totalPages));
//       setValidationErrors([]);
//     } else {
//       // Show validation errors for current page
//       const errors = form.formState.errors;
//       const errorMessages: string[] = [];

//       Object.keys(errors).forEach((key) => {
//         const error = errors[key as keyof typeof errors];
//         if (error?.message) {
//           errorMessages.push(`${key}: ${error.message}`);
//         }
//       });

//       setValidationErrors(errorMessages);

//       toast.error("Please fix the errors on this page before continuing", {
//         duration: 4000,
//         position: "top-center",
//       });
//     }
//   };

//   const validateCurrentPage = async () => {
//     switch (currentPage) {
//       case 1:
//         return await form.trigger(
//           form.watch("isGivenNameEmpty")
//             ? [
//               "familyName",
//               "gender",
//               "DOB",
//               "nationality",
//               "countryOfResidence",
//               "maritalStatus",
//             ]
//             : [
//               "familyName",
//               "givenName",
//               "gender",
//               "DOB",
//               "nationality",
//               "countryOfResidence",
//               "maritalStatus",
//             ]
//         );
//       case 2:
//         return await form.trigger([
//           "currentAddress",
//           "permanentAddress",
//           "country",
//           "city",
//           "zipCode",
//           "email",
//           "countryCode",
//           "phoneNo",
//         ]);
//       case 3:
//         return await form.trigger([
//           "hasPassport",
//           "passportNumber",
//           "passportExpiryDate",
//           "oldPassportNumber",
//           "oldPassportExpiryDate",
//         ]);
//       case 4:
//         return await form.trigger([
//           "hasStudiedAbroad",
//           "visitedCountry",
//           "institution",
//           "visaType",
//           "visaExpiryDate",
//           "durationOfStudyAbroad",
//         ]);
//       case 5:
//         return await form.trigger([
//           "sponsorName",
//           "sponsorRelationship",
//           "sponsorsNationality",
//           "sponsorsOccupation",
//           "sponsorsEmail",
//           "sponsorsCountryCode",
//           "sponsorsPhoneNo",
//         ]);
//       case 6:
//         return await form.trigger(["familyMembers"]);
//       default:
//         return true;
//     }
//   };

//   // Use watch to observe form values
//   const watchedValues = form.watch();
//   console.log("Watched Values:", watchedValues);
//   useEffect(() => {
//     // For testing purposes, clear the sessionStorage to always show modal
//     // Remove this line in production if you want to remember consent
//     sessionStorage.removeItem("applicationSubmitted");

//     const hasAccepted =
//       sessionStorage.getItem("applicationSubmitted") === "true";
//     setHasAcceptedConsent(hasAccepted);

//     // Always show modal if consent hasn't been accepted
//     if (!hasAccepted) {
//       // Add a small delay to ensure the component is fully mounted
//       setTimeout(() => {
//         setIsModalOpen(true);
//       }, 100);
//     }
//   }, []);
//   const handleSaveAndContinue = async (event: React.MouseEvent) => {
//     event.preventDefault(); // Prevent form submission

//     if (!hasAcceptedConsent) {
//       setIsModalOpen(true);
//       return;
//     }

//     // If consent is already accepted, proceed with form submission
//     console.log("Save and Continue clicked, checking form validity...");
//     const isValid = await form.trigger();
//     console.log("Form is valid:", isValid);

//     if (isValid) {
//       const formData = form.getValues();
//       console.log("Calling onSubmit with form data...");
//       await onSubmit(formData);
//     } else {
//       console.log("Form validation failed");
//       toast.error("Please fix the form errors before submitting", {
//         duration: 4000,
//         position: "top-center",
//       });
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleCompleteApplication = () => {
//     console.log("Application Completed!");
//     setIsModalOpen(false); // Close the consent modal
//     setHasAcceptedConsent(true); // Mark consent as accepted
//     // Don't show success modal here - it will be shown after API submission
//   };

//   const handleCloseSuccessModal = () => {
//     setIsSuccessModalOpen(false);
//     // Navigate to dashboard after closing success modal
//     router.push("/dashboard/completeapplication?tab=appinfo&step=1");
//   };
//   const token = getAuthToken();
//   useEffect(() => {
//     async function loadSaved() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getBasicInformation`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           }
//         );
//         console.log("Response status:", res.status);

//         if (!res.ok) return;
//         const result = await res.json();
//         if (result.success && result.data) {
//           // 4️⃣ Transform dates and nested data
//           const data = result.data;
//           const formatted = {
//             ...data,
//             DOB: data.DOB ? new Date(data.DOB) : null,
//             passportExpiryDate: data.passportExpiryDate
//               ? new Date(data.passportExpiryDate)
//               : null,
//             oldPassportExpiryDate: data.oldPassportExpiryDate
//               ? new Date(data.oldPassportExpiryDate)
//               : null,
//             visaExpiryDate: data.visaExpiryDate
//               ? new Date(data.visaExpiryDate)
//               : null,
//             familyMembers: data.familyMembers ?? [],
//             religion: data.religion ?? "",
//             nativeLanguage: data.nativeLanguage ?? "",
//           };
//           // 5️⃣ Reset RHF with fetched values
//           form.reset(formatted);
//         }
//       } catch (err) {
//         console.error("Failed to load saved application", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadSaved();
//   }, [form]);

//   // 6️⃣ Show a loading state until data is ready
//   if (isLoading) {
//     return <div className="text-center py-10">Loading your application…</div>;
//   }

//   return (
//     <div className="w-[90%] xl:w-[60%] mx-auto mt-4">
//       {/* Page Titles */}
//       {currentPage === 1 && (
//         <h6 className="font-semibold text-center">Personal Information</h6>
//       )}
//       {currentPage === 2 && (
//         <h6 className="font-semibold text-center">Contact Details</h6>
//       )}
//       {currentPage === 3 && (
//         <h6 className="font-semibold text-center">
//           Passport & Visa Information
//         </h6>
//       )}
//       {currentPage === 4 && (
//         <h6 className="font-semibold text-center">
//           Learning Experience Abroad
//         </h6>
//       )}
//       {currentPage === 5 && (
//         <h6 className="font-semibold text-center">
//           {" "}
//           Financial Sponsor Information{" "}
//         </h6>
//       )}
//       {currentPage === 6 && (
//         <h6 className="font-semibold text-center">Family Members</h6>
//       )}

//       {/* Display validation errors */}
//       {validationErrors.length > 0 && (
//         <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
//           <h4 className="text-red-800 font-semibold mb-2">
//             Please fix the following errors:
//           </h4>
//           <ul className="text-red-700 text-sm space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index} className="flex items-start">
//                 <span className="text-red-500 mr-2">•</span>
//                 {startCase(error)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <Form {...form}>
//         <form onSubmit={handleFormSubmit}>
//           {/* Page 1: Personal Information */}
//           {currentPage === 1 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end my-4">
//               {/*  Family Name field  */}
//               <FormField
//                 control={form.control}
//                 name="familyName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Family Name (As per your Passport):</FormLabel>

//                     <FormField
//                       control={form.control}
//                       name="isFamilyNameEmpty"
//                       render={({ field: checkboxField }) => (
//                         <div className="flex items-center gap-2">
//                           <Checkbox
//                             id="isFamilyNameEmpty"
//                             checked={checkboxField.value}
//                             onCheckedChange={(checked) => {
//                               checkboxField.onChange(checked);
//                               form.setValue(
//                                 "familyName",
//                                 checked === true ? "" : field.value || ""
//                               );
//                             }}
//                           />
//                           <label
//                             htmlFor="isFamilyNameEmpty"
//                             className="text-sm text-gray-600 cursor-pointer"
//                           >
//                             The Family name in the passport is empty.
//                           </label>
//                         </div>
//                       )}
//                     />

//                     <FormControl>
//                       <div className="relative w-full">
//                         <Input
//                           type="text"
//                           placeholder="Enter Family Name"
//                           className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
//                           value={field.value || ""}
//                           onChange={field.onChange}
//                           onBlur={field.onBlur}
//                           name={field.name}
//                           ref={field.ref}
//                           disabled={form.watch("isFamilyNameEmpty")}
//                         />
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2">
//                           <Image
//                             src="/DashboardPage/User.svg"
//                             alt="User Icon"
//                             width={20}
//                             height={20}
//                             className="w-5 h-5 text-black"
//                           />
//                         </span>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/*  Given Name field  */}
//               <FormField
//                 control={form.control}
//                 name="givenName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Given Name (As per your Passport):</FormLabel>
//                     <FormField
//                       control={form.control}
//                       name="isGivenNameEmpty"
//                       render={({ field: checkboxField }) => (
//                         <div className="flex items-center gap-2">
//                           <Checkbox
//                             id="isGivenNameEmpty"
//                             checked={checkboxField.value}
//                             onCheckedChange={(checked) => {
//                               checkboxField.onChange(checked);
//                               form.setValue(
//                                 "givenName",
//                                 checked === true ? "" : field.value || ""
//                               );
//                             }}
//                           />
//                           <label
//                             htmlFor="isGivenNameEmpty"
//                             className="text-sm text-gray-600 cursor-pointer"
//                           >
//                             The Given name in the passport is empty.
//                           </label>
//                         </div>
//                       )}
//                     />
//                     <FormControl>
//                       <div className="relative w-full">
//                         <Input
//                           type="text"
//                           placeholder="Enter Given Name"
//                           className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
//                           value={field.value || ""}
//                           onChange={field.onChange}
//                           onBlur={field.onBlur}
//                           name={field.name}
//                           ref={field.ref}
//                           disabled={form.watch("isGivenNameEmpty")}
//                         />
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2">
//                           <Image
//                             src="/DashboardPage/User.svg"
//                             alt="User Icon"
//                             width={20}
//                             height={20}
//                             className="w-5 h-5 text-black"
//                           />
//                         </span>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* gender */}
//               <FormField
//                 control={form.control}
//                 name="gender"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Gender</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
//                           <SelectValue placeholder="Select Gender" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Male">Male</SelectItem>
//                         <SelectItem value="Female">Female</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                         <SelectItem value="Prefer not to say">
//                           Prefer not to say
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* DOB */}
//               <FormField
//                 control={form.control}
//                 name="DOB"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Date of Birth</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="date"
//                         value={
//                           field.value
//                             ? format(new Date(field.value), "yyyy-MM-dd")
//                             : ""
//                         }
//                         onChange={(e) =>
//                           field.onChange(
//                             e.target.value ? new Date(e.target.value) : null
//                           )
//                         }
//                         onBlur={field.onBlur}
//                         name={field.name}
//                         className="bg-[#f1f1f1]"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* nationality */}
//               <FormField
//                 control={form.control}
//                 name="nationality"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nationality</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
//                           <SelectValue placeholder="Select Nationality" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="max-h-[300px] overflow-y-auto">
//                         {nationalityOptions.map((option, key) => (
//                           <SelectItem key={key} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* countryOfResidence */}
//               <FormField
//                 control={form.control}
//                 name="countryOfResidence"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Country of Residence:</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
//                           <SelectValue placeholder="Select Country" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="max-h-[300px] overflow-y-auto">
//                         {countryOptions.map((option) => (
//                           <SelectItem key={option.id} value={option.label}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* maritalStatus */}
//               <FormField
//                 control={form.control}
//                 name="maritalStatus"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Marital Status</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
//                           <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Single">Single</SelectItem>
//                         <SelectItem value="Married">Married</SelectItem>
//                         <SelectItem value="Divorced">Divorced</SelectItem>
//                         <SelectItem value="Widowed">Widowed</SelectItem>
//                         <SelectItem value="Separated">Separated</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="religion"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Religion</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="text"
//                         value={field.value || ""}
//                         onChange={field.onChange}
//                         onBlur={field.onBlur}
//                         name={field.name}
//                         ref={field.ref}
//                         placeholder="Write..."
//                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="nativeLanguage"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Native Language</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="text"
//                         value={field.value || ""}
//                         onChange={field.onChange}
//                         onBlur={field.onBlur}
//                         name={field.name}
//                         ref={field.ref}
//                         placeholder="Write..."
//                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           )}
//           {/* Component pages */}
//           {currentPage === 2 && <ContactDetailForm form={form} />}
//           {currentPage === 3 && <PassportAndVisaForm form={form} />}
//           {currentPage === 4 && <LearningExperienceAbroad form={form} />}
//           {currentPage === 5 && <FinancialSponsorInformation form={form} />}
//           {currentPage === 6 && <FamilyMembers form={form} />}
//           <div className="mt-6 flex justify-between">
//             <Pagination>
//               <PaginationContent className="flex justify-center mt-4 gap-4 items-center">
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       goToPage(Math.max(currentPage - 1, 1));
//                       setValidationErrors([]);
//                     }}
//                     className={`p-2 text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
//                       }`}
//                   >
//                     Previous
//                   </PaginationPrevious>
//                 </PaginationItem>

//                 <span className="px-4 py-2 text-sm font-semibold rounded-lg border">
//                   {currentPage} of {totalPages}
//                 </span>

//                 {currentPage !== totalPages && (
//                   <PaginationItem>
//                     <PaginationNext
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleNextPage();
//                       }}
//                       className="p-2 text-sm"
//                     >
//                       Next
//                     </PaginationNext>
//                   </PaginationItem>
//                 )}
//               </PaginationContent>
//             </Pagination>

//             {currentPage === totalPages && (
//               <Button
//                 type="submit"
//                 className="bg-red-700 hover:bg-red-700"
//                 disabled={isSubmitting}
//                 onClick={handleSaveAndContinue}
//               >
//                 {isSubmitting
//                   ? "Submitting..."
//                   : isSubmitted
//                     ? "Submitted"
//                     : "Save and Continue"}
//               </Button>
//             )}
//             <CompleteApplicationModal
//               isOpen={isModalOpen}
//               onClose={handleCloseModal}
//               onCompleteApplication={handleCompleteApplication}
//             />

//             <SubmissionSuccessModal
//               isOpen={isSuccessModalOpen}
//               onClose={handleCloseSuccessModal}
//             />
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default BasicInfo;
// Enhanced BasicInfo component with persistence
// SIMPLIFIED BasicInfo Component - ONLY LOCAL PERSISTENCE


import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
// import { Checkbox } from "@/components/ui/checkbox";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
// import { startCase } from "lodash";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import PassportAndVisaForm from "./components/PassportandVisaform";
// import LearningExperienceAbroad from "./components/LearningExperienceAbroad";
// import FinancialSponsorInformation from "./components/FinancialSponsorInformation";
// import FamilyMembers from "./components/FamilyMembers";
// import { useRouter } from "next/navigation";
// import ContactDetailForm from "./components/ContactDetailform";
import { formSchema } from "./components/Schema";
// import countries from "world-countries";
// import { getAuthToken } from "@/utils/authHelper";
// import CompleteApplicationModal from "../CompleteApplicationModal";
// import SubmissionSuccessModal from "../SubmissionSuccessModal";
import { useSimpleFormPersistence } from "@/hooks/useFormPersistence";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import { getAuthToken } from "@/utils/authHelper";
import toast from "react-hot-toast";

const BasicInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [hasAcceptedConsent, setHasAcceptedConsent] = useState(false);
  const totalPages = 6;
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepFromQuery = parseInt(searchParams.get("step") || "1", 10);

  // Get country options
  const countryOptions = countries.map((c) => ({
    label: c.name.common,
    value: c.cca2,
    id: c.cca3,
  }));

  const nationalityOptions = countries.map((c) => ({
    label: c.demonyms?.eng?.m || c.name.common,
    value: c.demonyms?.eng?.m || c.name.common,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      familyMembers: [],
      hasPassport: false,
      hasStudiedAbroad: false,
      countryCode: "+1",
      isFamilyNameEmpty: false,
      isGivenNameEmpty: false,
      religion: "",
      nativeLanguage: "",
    },
  });

  // Enhanced form persistence with server data loading
  const { clearSavedData, isDataLoaded } = useSimpleFormPersistence({
    key: 'basic-info-form',
    form,
    debounceMs: 1000,
  });

  // Load server data on mount
  useEffect(() => {
    async function loadServerData() {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getBasicInformation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            // Check if we have local data that's newer
            const localData = sessionStorage.getItem('basic-info-form');

            if (!localData) {
              // No local data, use server data
              const serverData = result.data;
              const formatted = {
                ...serverData,
                DOB: serverData.DOB ? new Date(serverData.DOB) : null,
                passportExpiryDate: serverData.passportExpiryDate
                  ? new Date(serverData.passportExpiryDate)
                  : null,
                oldPassportExpiryDate: serverData.oldPassportExpiryDate
                  ? new Date(serverData.oldPassportExpiryDate)
                  : null,
                visaExpiryDate: serverData.visaExpiryDate
                  ? new Date(serverData.visaExpiryDate)
                  : null,
                familyMembers: serverData.familyMembers ?? [],
                religion: serverData.religion ?? "",
                nativeLanguage: serverData.nativeLanguage ?? "",
              };

              form.reset(formatted);
              console.log("Loaded data from server");
            } else {
              console.log("Local data found, skipping server data");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load server data", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Only load server data if local data isn't already loaded
    if (!isDataLoaded) {
      loadServerData();
    } else {
      setIsLoading(false);
    }
  }, [form, isDataLoaded]);

  // Handle page navigation from URL
  useEffect(() => {
    if (!isNaN(stepFromQuery)) {
      setCurrentPage(stepFromQuery);
    }
  }, [stepFromQuery]);

  // Save current page to sessionStorage
  useEffect(() => {
    if (isDataLoaded) {
      sessionStorage.setItem('basic-info-current-page', currentPage.toString());
    }
  }, [currentPage, isDataLoaded]);

  // Restore current page from sessionStorage
  useEffect(() => {
    const savedPage = sessionStorage.getItem('basic-info-current-page');
    if (savedPage && !isNaN(parseInt(savedPage))) {
      const page = parseInt(savedPage);
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        router.replace(`/dashboard/completeapplication?tab=basicinfo&step=${page}`, { scroll: false });
      }
    }
  }, [isDataLoaded]);

  // Handle consent modal
  useEffect(() => {
    const hasAccepted = sessionStorage.getItem("applicationSubmitted") === "true";
    setHasAcceptedConsent(hasAccepted);

    if (!hasAccepted) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 100);
    }
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationErrors([]);

    if (!hasAcceptedConsent) {
      setIsModalOpen(true);
      return;
    }

    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    } else {
      const errors = form.formState.errors;
      const errorMessages: string[] = [];
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          errorMessages.push(`${startCase(key)}: ${error.message}`);
        }
      });
      setValidationErrors(errorMessages);
      toast.error(
        "Please fix the form errors: " +
        errorMessages.slice(0, 3).join(", ") +
        (errorMessages.length > 3 ? "..." : ""),
        {
          duration: 5000,
        }
      );
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setValidationErrors([]);

      const token = getAuthToken();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("API call successful, showing success modal");
        setIsSuccessModalOpen(true);
        // Don't clear data here - wait until success modal is closed
      } else {
        const errorMessage = result.message || result.error || "Failed to save information";
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "An error occurred while saving your information";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    router.replace(`/dashboard/completeapplication?tab=basicinfo&step=${page}`, { scroll: false });
  };

  const handleNextPage = async () => {
    const currentPageIsValid = await validateCurrentPage();
    if (currentPageIsValid) {
      goToPage(Math.min(currentPage + 1, totalPages));
      setValidationErrors([]);
    } else {
      const errors = form.formState.errors;
      const errorMessages: string[] = [];
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          errorMessages.push(`${startCase(key)}: ${error.message}`);
        }
      });
      setValidationErrors(errorMessages);
      toast.error("Please fix the errors on this page before continuing", {
        duration: 4000,
      });
    }
  };

  const validateCurrentPage = async () => {
    switch (currentPage) {
      case 1:
        return await form.trigger(
          form.watch("isGivenNameEmpty")
            ? [
              "familyName",
              "gender",
              "DOB",
              "nationality",
              "countryOfResidence",
              "maritalStatus",
            ]
            : [
              "familyName",
              "givenName",
              "gender",
              "DOB",
              "nationality",
              "countryOfResidence",
              "maritalStatus",
            ]
        );
      case 2:
        return await form.trigger([
          "currentAddress",
          "permanentAddress",
          "country",
          "city",
          "zipCode",
          "email",
          "countryCode",
          "phoneNo",
        ]);
      case 3:
        return await form.trigger([
          "hasPassport",
          "passportNumber",
          "passportExpiryDate",
          "oldPassportNumber",
          "oldPassportExpiryDate",
        ]);
      case 4:
        return await form.trigger([
          "hasStudiedAbroad",
          "visitedCountry",
          "institution",
          "visaType",
          "visaExpiryDate",
          "durationOfStudyAbroad",
        ]);
      case 5:
        return await form.trigger([
          "sponsorName",
          "sponsorRelationship",
          "sponsorsNationality",
          "sponsorsOccupation",
          "sponsorsEmail",
          "sponsorsCountryCode",
          "sponsorsPhoneNo",
        ]);
      case 6:
        return await form.trigger(["familyMembers"]);
      default:
        return true;
    }
  };

  const handleSaveAndContinue = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!hasAcceptedConsent) {
      setIsModalOpen(true);
      return;
    }

    console.log("Save and Continue clicked, checking form validity...");
    const isValid = await form.trigger();

    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    } else {
      console.log("Form validation failed");
      toast.error("Please fix the form errors before submitting", {
        duration: 4000,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCompleteApplication = () => {
    console.log("Application Completed!");
    setIsModalOpen(false);
    setHasAcceptedConsent(true);
    sessionStorage.setItem("applicationSubmitted", "true");
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // Clear local data only after successful submission and modal close
    clearSavedData();
    sessionStorage.removeItem('basic-info-current-page');
    router.push("/dashboard/completeapplication?tab=appinfo&step=1");
  };

  // Show loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading your application...</div>;
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
      {currentPage === 3 && (
        <h6 className="font-semibold text-center">
          Passport & Visa Information
        </h6>
      )}
      {currentPage === 4 && (
        <h6 className="font-semibold text-center">
          Learning Experience Abroad
        </h6>
      )}
      {currentPage === 5 && (
        <h6 className="font-semibold text-center">
          Financial Sponsor Information
        </h6>
      )}
      {currentPage === 6 && (
        <h6 className="font-semibold text-center">Family Members</h6>
      )}

      {/* Display validation errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-semibold mb-2">
            Please fix the following errors:
          </h4>
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
              {/* Family Name field */}
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

              {/* Given Name field */}
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

              {/* Gender */}
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

              {/* Nationality */}
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

              {/* Country of Residence */}
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

              {/* Marital Status */}
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

              {/* Religion */}
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

              {/* Native Language */}
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
                      goToPage(Math.max(currentPage - 1, 1));
                      setValidationErrors([]);
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
                {isSubmitting ? "Submitting..." : "Save and Continue"}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <CompleteApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCompleteApplication={handleCompleteApplication}
      />

      <SubmissionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
};

export default BasicInfo;