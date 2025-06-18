// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import * as z from "zod";
// import { format } from "date-fns";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
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
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { countries } from "@/lib/countries";
// import { useEffect, useState } from "react";
// import { useUserStore } from "@/store/useUserData";

// const formSchema = z.object({
//   country: z.string({
//     required_error: "Please select a country.",
//   }),
//   university: z.string({
//     required_error: "Please select a university.",
//   }),
//   city: z.string({
//     required_error: "Please select a city.",
//   }),
//   accommodationType: z.string({
//     required_error: "Please select accommodation type.",
//   }),
//   startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
//     message: "Invalid start date",
//   }),
//   // startDate: z.string({
//   //   required_error: "Please select a date.",
//   // }),
//   distance: z.string({
//     required_error: "Please select preferred distance.",
//   }),
//   preferences: z.string().optional(),
//   currency: z.string({
//     required_error: "Please select currency.",
//   }),
//   budgetMin: z.string({
//     required_error: "Please enter minimum budget.",
//   }),
//   budgetMax: z.string({
//     required_error: "Please enter maximum budget.",
//   }),
//   phone: z.string({
//     required_error: "Phone number must be at least 10 digits.",
//   }),
//   countryCode: z.string().default("+92"),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
// });
// export default function Home() {
//   const { user, fetchUserProfile } = useUserStore();

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       countryCode: "+92",
//     },
//   });
//   const userName = user?.firstName + " " + user?.lastName;
//   const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
//     values,
//     event
//   ) => {
//     event?.preventDefault();
//     console.log("done", values, userName);
//     setIsSubmitting(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/accommodationBooking`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${getAuthToken()}`, // Add auth token if needed
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             ...values,
//             userName,
//             startDate: new Date(values.startDate).toISOString(),
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to submit form");
//       }

//       toast.success("Form submitted successfully!", {
//         description: "We'll get back to you soon.",
//       });
//       // Reset form with default values
//       form.reset({
//         country: "",
//         university: "",
//         city: "",
//         accommodationType: "",
//         startDate: "",
//         distance: "",
//         preferences: "",
//         currency: "",
//         budgetMin: "",
//         budgetMax: "",
//         phone: "",
//         countryCode: "+92",
//         email: "",
//       });
//       // form.reset();
//     } catch (error) {
//       toast.error("Submission failed", {
//         description: error instanceof Error ? error.message : "Unknown error",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <div className="p-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="text-center mb-2">
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Accommodation Booking Form
//           </h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Complete the form to secure your housing before arrival. Ensure all
//             details are accurate to avoid delays
//           </p>
//         </div>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-2 bg-white "
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
//               <FormField
//                 control={form.control}
//                 name="country"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Country</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
//                           <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="uk">United Kingdom</SelectItem>
//                         <SelectItem value="nz">New Zealand</SelectItem>
//                         <SelectItem value="au">Australia</SelectItem>
//                         <SelectItem value="ca">Canada</SelectItem>
//                         <SelectItem value="de">Germany</SelectItem>
//                         <SelectItem value="my">Malaysia</SelectItem>
//                         <SelectItem value="ie">Ireland</SelectItem>
//                         <SelectItem value="us">United States</SelectItem>
//                         <SelectItem value="cn">China</SelectItem>
//                         <SelectItem value="it">Italy</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="university"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>University</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Enter university name"
//                         className="bg-[#f1f1f1] placeholder:text-sm placeholder:text-black"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="city"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Enter city name"
//                         className="bg-[#f1f1f1] placeholder:text-sm placeholder:text-black"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="accommodationType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Type Of Accommodation</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
//                           <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="single">Single Apartment</SelectItem>
//                         <SelectItem value="shared">Shared Apartment</SelectItem>
//                         <SelectItem value="hostel">Hostel</SelectItem>
//                         <SelectItem value="homestay">Homestays</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Accommodation Start Date</FormLabel>
//                     <Input
//                       type="date"
//                       value={
//                         field.value ? format(field.value, "yyyy-MM-dd") : ""
//                       }
//                       onChange={field.onChange}
//                       onBlur={field.onBlur}
//                       name={field.name}
//                       ref={field.ref}
//                       className="bg-[#f1f1f1]"
//                     />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="distance"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Preferred Distance from Institution</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
//                           <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="0-1">0-1 miles</SelectItem>
//                         <SelectItem value="1-3">1-3 miles</SelectItem>
//                         <SelectItem value="3-5">3-5 miles</SelectItem>
//                         <SelectItem value="5+">5+ miles</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="space-y-2">
//               <FormField
//                 control={form.control}
//                 name="preferences"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Any Other Preference:</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Write..."
//                         className="resize-none bg-[#f1f1f1] placeholder-[#313131]  placeholder:text-sm text-sm h-10 min-h-[40px] py-2"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-base font-medium">Preferred Budget</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="currency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
//                             <SelectValue placeholder="Currency" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="usd">USD ($)</SelectItem>
//                           <SelectItem value="gbp">GBP (£)</SelectItem>
//                           <SelectItem value="eur">EUR (€)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="budgetMin"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input
//                           placeholder="Min"
//                           className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="budgetMax"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input
//                           placeholder="Max"
//                           className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone No.</FormLabel>
//                     <div className="flex">
//                       <FormField
//                         control={form.control}
//                         name="countryCode"
//                         render={({ field: countryField }) => (
//                           <Select
//                             onValueChange={countryField.onChange}
//                             defaultValue={countryField.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-r-none border-r-0">
//                                 <SelectValue>
//                                   <div className="flex items-center gap-2">
//                                     <Image
//                                       src={
//                                         countries.find(
//                                           (c) =>
//                                             c.code + c.name ===
//                                             countryField.value
//                                         )?.flag || countries[0].flag
//                                       }
//                                       alt="Country Flag"
//                                       width={20}
//                                       height={20}
//                                       className="object-contain"
//                                       unoptimized
//                                     />
//                                     <span className="text-sm">
//                                       {countryField.value}
//                                     </span>
//                                   </div>
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {countries.map((country) => (
//                                 <SelectItem
//                                   key={country.code}
//                                   value={country.code}
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     <Image
//                                       src={country.flag}
//                                       alt={`${country.name} Flag`}
//                                       width={20}
//                                       height={20}
//                                       className="object-contain"
//                                       unoptimized
//                                     />
//                                     <span className="text-sm">{`${country.code} (${country.name})`}</span>
//                                   </div>
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}
//                       />
//                       <Input
//                         {...field}
//                         className="rounded-l-none bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
//                         placeholder="Enter your phone number"
//                         name="phoneNumber"
//                       />
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="Enter your email address"
//                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="text-right">
//               <Button
//                 type="submit"
//                 className="w-1/3 sm:w-1/4 bg-red-600 hover:bg-red-700"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { countries } from "@/lib/countries";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserData";

const formSchema = z.object({
  country: z.string({
    required_error: "Please select a country.",
  }),
  university: z.string({
    required_error: "Please select a university.",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
  accommodationType: z.string({
    required_error: "Please select accommodation type.",
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  distance: z.string({
    required_error: "Please select preferred distance.",
  }),
  preferences: z.string().optional(),
  currency: z.string({
    required_error: "Please select currency.",
  }),
  budgetMin: z.string({
    required_error: "Please enter minimum budget.",
  }),
  budgetMax: z.string({
    required_error: "Please enter maximum budget.",
  }),
  phone: z.string({
    required_error: "Phone number must be at least 10 digits.",
  }),
  countryCode: z.string().default("+92"),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const { user, fetchUserProfile } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "+92",
      country: "",
      university: "",
      city: "",
      accommodationType: "",
      startDate: "",
      distance: "",
      preferences: "",
      currency: "",
      budgetMin: "",
      budgetMax: "",
      phone: "",
      email: "",
    },
  });

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "User";

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    console.log("Form submission started with values:", values);
    setIsSubmitting(true);

    try {
      // Basic form validation
      if (!userName || userName === "User") {
        throw new Error(
          "Unable to retrieve user information. Please refresh the page and try again."
        );
      }

      // Validate budget range
      const minBudget = parseFloat(values.budgetMin);
      const maxBudget = parseFloat(values.budgetMax);

      if (isNaN(minBudget) || isNaN(maxBudget)) {
        throw new Error("Please enter valid numeric values for budget range.");
      }

      if (minBudget >= maxBudget) {
        throw new Error("Maximum budget must be greater than minimum budget.");
      }

      // Validate start date is not in the past
      const startDate = new Date(values.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new Error("Start date cannot be in the past.");
      }

      const submitData = {
        ...values,
        userName,
        startDate: startDate.toISOString(),
        budgetMin: minBudget,
        budgetMax: maxBudget,
      };

      console.log("Submitting data to server:", submitData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/accommodationBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(submitData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Handle different response scenarios
      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
          console.log("Response data:", data);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          // If JSON parsing fails but response is OK, treat as success
          if (response.ok) {
            data = { success: true, message: "Form submitted successfully" };
          } else {
            throw new Error("Invalid response from server. Please try again.");
          }
        }
      } else {
        // Non-JSON response
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);

        if (response.ok) {
          data = { success: true, message: "Form submitted successfully" };
        } else {
          throw new Error(
            `Server error: ${textResponse || response.statusText}`
          );
        }
      }

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = "Failed to submit accommodation booking.";

        switch (response.status) {
          case 400:
            errorMessage =
              data?.message ||
              "Invalid form data. Please check your inputs and try again.";
            break;
          case 401:
            errorMessage =
              "You are not authorized. Please log in and try again.";
            break;
          case 403:
            errorMessage =
              "Access forbidden. You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = "Service not found. Please contact support.";
            break;
          case 409:
            errorMessage =
              data?.message || "A booking with similar details already exists.";
            break;
          case 422:
            errorMessage =
              data?.message ||
              "Invalid data provided. Please check your inputs.";
            break;
          case 429:
            errorMessage =
              "Too many requests. Please wait a moment and try again.";
            break;
          case 500:
            errorMessage =
              "Server error. Please try again later or contact support.";
            break;
          case 503:
            errorMessage =
              "Service temporarily unavailable. Please try again later.";
            break;
          default:
            errorMessage =
              data?.message ||
              `Server error (${response.status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      // If we reach here, the response was successful
      console.log("Form submission successful!");

      toast.success("Accommodation Booking Submitted Successfully! ✅", {
        description:
          data?.message ||
          "We've received your accommodation request and will get back to you soon with available options.",
        duration: 5000,
      });

      // Reset form to initial state
      form.reset({
        country: "",
        university: "",
        city: "",
        accommodationType: "",
        startDate: "",
        distance: "",
        preferences: "",
        currency: "",
        budgetMin: "",
        budgetMax: "",
        phone: "",
        countryCode: "+92",
        email: "",
      });

      // Optional: Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Form submission error:", error);

      let errorMessage = "An unexpected error occurred.";
      let errorDescription =
        "Please try again. If the problem persists, contact support.";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide more specific descriptions for certain errors
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorDescription =
            "Please check your internet connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorDescription = "The request took too long. Please try again.";
        } else if (error.message.includes("budget")) {
          errorDescription = "Please check your budget values and try again.";
        } else if (error.message.includes("date")) {
          errorDescription = "Please check your date selection and try again.";
        }
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
        action: {
          label: "Retry",
          onClick: () => {
            form.handleSubmit(onSubmit)();
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Accommodation Booking Form
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete the form to secure your housing before arrival. Ensure all
            details are accurate to avoid delays
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="nz">New Zealand</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="my">Malaysia</SelectItem>
                        <SelectItem value="ie">Ireland</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="cn">China</SelectItem>
                        <SelectItem value="it">Italy</SelectItem>
                      </SelectContent>
                    </Select>
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
                        {...field}
                        placeholder="Enter university name"
                        className="bg-[#f1f1f1] placeholder:text-sm placeholder:text-black"
                        disabled={isSubmitting}
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
                        {...field}
                        placeholder="Enter city name"
                        className="bg-[#f1f1f1] placeholder:text-sm placeholder:text-black"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accommodationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Of Accommodation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Apartment</SelectItem>
                        <SelectItem value="shared">Shared Apartment</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="homestay">Homestays</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Accommodation Start Date</FormLabel>
                    <Input
                      type="date"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="bg-[#f1f1f1]"
                      disabled={isSubmitting}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Distance from Institution</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 miles</SelectItem>
                        <SelectItem value="1-3">1-3 miles</SelectItem>
                        <SelectItem value="3-5">3-5 miles</SelectItem>
                        <SelectItem value="5+">5+ miles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any Other Preference:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write..."
                        className="resize-none bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm h-10 min-h-[40px] py-2"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium">Preferred Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] text-sm">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Min"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                          {...field}
                          disabled={isSubmitting}
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Max"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                          {...field}
                          disabled={isSubmitting}
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No.</FormLabel>
                    <div className="flex">
                      <FormField
<<<<<<< Updated upstream
                        control={form.control}
                        name="countryCode"
                        render={({ field: countryField }) => (
                          <Select
                            onValueChange={countryField.onChange}
                            value={countryField.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-r-none border-r-0">
                                <SelectValue>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={
                                        countries.find(
                                          (c) => c.code === countryField.value
                                        )?.flag || countries[0].flag
                                      }
                                      alt="Country Flag"
                                      width={20}
                                      height={20}
                                      className="object-contain"
                                      unoptimized
                                    />
                                    <span className="text-sm">
                                      {countryField.value}
                                    </span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={country.flag}
                                      alt={`${country.name} Flag`}
                                      width={20}
                                      height={20}
                                      className="object-contain"
                                      unoptimized
                                    />
                                    <span className="text-sm">{`${country.code} (${country.name})`}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
=======
  control={form.control}
  name="countryCode"
  render={({ field: countryField }) => (
    <Select
      onValueChange={(val) => {
        const code = val.split("-")[0]; 
        countryField.onChange(code);
      }}
      defaultValue={countryField.value}
    >
      <FormControl>
        <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-r-none border-r-0">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Image
                src={
                  countries.find((c) => c.code === countryField.value)?.flag ||
                  countries[0].flag
                }
                alt="Country Flag"
                width={20}
                height={20}
                className="object-contain"
                unoptimized
              />
              <span className="text-sm">
                {countryField.value}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
      </FormControl>

      <SelectContent>
        {countries.map((country) => (
          <SelectItem
            key={`${country.code}-${country.name}`}
            value={`${country.code}-${country.name}`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={country.flag}
                alt={`${country.name} Flag`}
                width={20}
                height={20}
                className="object-contain"
                unoptimized
              />
              <span className="text-sm">
                {`${country.code} (${country.name})`}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>

>>>>>>> Stashed changes
                      <Input
                        {...field}
                        className="rounded-l-none bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                        type="tel"
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
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right">
              <Button
                type="submit"
                className="w-1/3 sm:w-1/4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
