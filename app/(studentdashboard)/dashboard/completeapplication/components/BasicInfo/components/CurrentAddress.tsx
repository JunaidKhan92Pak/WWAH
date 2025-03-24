// // "use client";

// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import * as z from "zod";
// // import Image from "next/image";
// // import { countries } from "@/lib/countries";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Input } from "@/components/ui/input";
// // import { toast } from "sonner";

// // const formSchema = z.object({
// //   address: z.string().min(1, "Home address is required."),
// //   detailedaddress: z.string().min(1, "Detailed address is required."),
// //   country: z.string().min(1, "Please select a country."),
// //   city: z.string().min(1, "Please select a city."),
// //   zipcode: z
// //     .string()
// //     .min(4, "Zip code must be at least 4 characters.")
// //     .max(10, "Zip code must be at most 10 characters.")
// //     .regex(/^[a-zA-Z0-9]+$/, "Zip code must contain only letters and numbers."), // Allows alphanumeric zip codes
// //   email: z.string().email("Please enter a valid email address."),
// //   phone: z
// //     .string()
// //     .min(10, { message: "Phone number must be at least 10 digits." })
// //     .regex(/^\+?\d+$/, "Phone number must contain only numbers and an optional '+' at the start."),
// //   countryCode: z.string().min(1, "Country code is required.").default("+92"),
// // });

// // const CurrentAddress = ({ form }) => {
// //   // const form = useForm<z.infer<typeof formSchema>>({
// //   //   resolver: zodResolver(formSchema),
// //   //   mode: "onChange", // Ensures validation feedback is shown as the user types
// //   //   defaultValues: {
// //   //     address: "",
// //   //     detailedaddress: "",
// //   //     country: "",
// //   //     city: "",
// //   //     zipcode: "",
// //   //     email: "",
// //   //     phone: "",
// //   //     countryCode: "+92",
// //   //   },
// //   // });

// //   // function onSubmit(values: z.infer<typeof formSchema>) {
// //   //   toast.success("Form submitted successfully!", {
// //   //     description: "We'll get back to you soon.",
// //   //   });
// //   //   console.log(values);
// //   // }

// //   return (
// //     <div className="my-4">
// //       <Form {...form}>
// //         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
// //           <div className="grid grid-cols-1  gap-2 items-end">
// //             <>
// //               {/* ShadCN Checkbox */}
// //               <div className="flex items-center gap-2">
// //                 <Checkbox id="confirm-name" />
// //                 <label
// //                   htmlFor="confirm-name"
// //                   className="text-base font-semibold cursor-pointer"
// //                 >
// //                   Same as Home Address
// //                 </label>
// //               </div>
// //               <FormField
// //                 control={form.control}
// //                 name="address"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Home Address</FormLabel>

// //                     <FormControl>
// //                       <Input
// //                         type="text"
// //                         placeholder="Write..."
// //                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />

// //               <FormField
// //                 control={form.control}
// //                 name="detailedaddress"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Detailed Address</FormLabel>

// //                     <FormControl>
// //                       <Input
// //                         type="text"
// //                         placeholder="Write..."
// //                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />

// //               <div className="grid grid-col2-1 md:grid-cols-2 gap-2">
// //                 <FormField
// //                   control={form.control}
// //                   name="country"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Country</FormLabel>
// //                       <Select
// //                         onValueChange={field.onChange}
// //                         defaultValue={field.value}
// //                       >
// //                         <FormControl>
// //                           <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
// //                             <SelectValue placeholder="Select Country" />
// //                           </SelectTrigger>
// //                         </FormControl>

// //                         <SelectContent>
// //                           <SelectItem value="USA">United States</SelectItem>
// //                           <SelectItem value="India">India</SelectItem>
// //                           <SelectItem value="Australia">Australia</SelectItem>
// //                           <SelectItem value="Italy">Italy</SelectItem>
// //                           <SelectItem value="Pakistan">Pakistan</SelectItem>
// //                           <SelectItem value="Canada">Canada</SelectItem>
// //                           <SelectItem value="UK">United Kingdom</SelectItem>
// //                           <SelectItem value="China">China</SelectItem>
// //                           <SelectItem value="Ireland">Ireland</SelectItem>
// //                           <SelectItem value="New Zealand">
// //                             New Zealand
// //                           </SelectItem>
// //                           <SelectItem value="Germany">Germany</SelectItem>
// //                           <SelectItem value="Malaysia">Malaysia</SelectItem>
// //                           <SelectItem value="France">France</SelectItem>
// //                           <SelectItem value="Denmark">Denmark</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="city"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>City</FormLabel>
// //                       <Select
// //                         onValueChange={field.onChange}
// //                         defaultValue={field.value}
// //                       >
// //                         <FormControl>
// //                           <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
// //                             <SelectValue placeholder="Select City" />
// //                           </SelectTrigger>
// //                         </FormControl>
// //                         <SelectContent>
// //                           <SelectItem value="london">London</SelectItem>
// //                           <SelectItem value="manchester">Manchester</SelectItem>
// //                           <SelectItem value="birmingham">Birmingham</SelectItem>
// //                           <SelectItem value="leeds">Leeds</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //                 <FormField
// //                   control={form.control}
// //                   name="zipcode"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Zip Code</FormLabel>

// //                       <FormControl>
// //                         <Input
// //                           type="text"
// //                           placeholder="Write..."
// //                           className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                           {...field}
// //                         />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="email"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Email</FormLabel>

// //                       <FormControl>
// //                         <div className="relative w-full">
// //                           {/* Input Field */}
// //                           <Input
// //                             type="text"
// //                             placeholder="Enter your email address"
// //                             className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
// //                             {...field}
// //                           />

// //                           {/* Image inside the Input using Next.js Image */}
// //                           <span className="absolute left-3 top-1/2 -translate-y-1/2">
// //                             <Image
// //                               src="/DashboardPage/letter.svg"
// //                               alt="User Icon"
// //                               width={20}
// //                               height={20}
// //                               className="w-5 h-5 text-black"
// //                             />
// //                           </span>
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <FormField
// //                   control={form.control}
// //                   name="phone"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Phone No.</FormLabel>
// //                       <div className="flex gap-2">
// //                         {/* Country Code Selector */}
// //                         <Select
// //                           value={form.watch("country") || "Pakistan"} // Default to Pakistan if no value is selected
// //                           onValueChange={(selectedCountry) => {
// //                             const countryData = countries.find(
// //                               (c) => c.name === selectedCountry
// //                             );
// //                             if (countryData) {
// //                               form.setValue("country", countryData.name);
// //                               form.setValue("countryCode", countryData.code);
// //                               form.trigger(["country", "countryCode"]);
// //                             }
// //                           }}
// //                         >
// //                           <FormControl>
// //                             <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
// //                               <SelectValue>
// //                                 <div className="flex items-center gap-2">
// //                                   <Image
// //                                     src={
// //                                       countries.find(
// //                                         (c) =>
// //                                           c.name ===
// //                                           (form.watch("country") || "Pakistan")
// //                                       )?.flag || "/default-flag.png"
// //                                     }
// //                                     alt="Country Flag"
// //                                     width={20}
// //                                     height={20}
// //                                     className="object-contain"
// //                                     unoptimized
// //                                   />
// //                                   <span className="text-sm">
// //                                     {form.watch("countryCode") || "+92"}
// //                                   </span>
// //                                 </div>
// //                               </SelectValue>
// //                             </SelectTrigger>
// //                           </FormControl>

// //                           <SelectContent>
// //                             {countries.map((country) => (
// //                               <SelectItem
// //                                 key={country.name}
// //                                 value={country.name}
// //                               >
// //                                 <div className="flex items-center gap-2">
// //                                   <Image
// //                                     src={country.flag}
// //                                     alt={`${country.name} Flag`}
// //                                     width={20}
// //                                     height={20}
// //                                     className="object-contain"
// //                                     unoptimized
// //                                   />
// //                                   <span className="text-sm">{`${country.code} (${country.name})`}</span>
// //                                 </div>
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>

// //                         {/* Phone Number Input */}
// //                         <Input
// //                           {...field}
// //                           className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
// //                           placeholder="Enter your phone no"
// //                         />
// //                       </div>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
// //             </>
// //           </div>
// //         </form>
// //       </Form>
// //     </div>
// //   );
// // };

// // export default CurrentAddress;

// // "use client";

// // import Image from "next/image";
// // import { countries } from "@/lib/countries";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Input } from "@/components/ui/input";

// // const CurrentAddress = ({ form }) => {
// //   return (
// //     <div className="my-4">
// //       <div className="grid grid-cols-1  gap-2 items-end">
// //         <>
// //           {/* ShadCN Checkbox */}
// //           <div className="flex items-center gap-2">
// //             <Checkbox id="confirm-name" />
// //             <label
// //               htmlFor="confirm-name"
// //               className="text-base font-semibold cursor-pointer"
// //             >
// //               Same as Home Address
// //             </label>
// //           </div>
// //           {/* currentHomeAddress */}
// //           <FormField
// //             control={form.control}
// //             name="currentHomeAddress"
// //             render={({ field }) => (
// //               <FormItem>
// //                 <FormLabel>Home Address</FormLabel>

// //                 <FormControl>
// //                   <Input
// //                     type="text"
// //                     placeholder="Write..."
// //                     className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                     {...field}
// //                   />
// //                 </FormControl>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />
// //           {/* currentDetailedAddress */}
// //           <FormField
// //             control={form.control}
// //             name="currentDetailedAddress"
// //             render={({ field }) => (
// //               <FormItem>
// //                 <FormLabel>Detailed Address</FormLabel>

// //                 <FormControl>
// //                   <Input
// //                     type="text"
// //                     placeholder="Write..."
// //                     className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                     {...field}
// //                   />
// //                 </FormControl>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />
// //           <div className="grid grid-col2-1 md:grid-cols-2 gap-2">
// //             {/* currentCountry */}
// //             <FormField
// //               control={form.control}
// //               name="currentCountry"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Country</FormLabel>
// //                   <Select
// //                     onValueChange={field.onChange}
// //                     defaultValue={field.value}
// //                   >
// //                     <FormControl>
// //                       <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
// //                         <SelectValue placeholder="Select Country" />
// //                       </SelectTrigger>
// //                     </FormControl>

// //                     <SelectContent>
// //                       <SelectItem value="USA">United States</SelectItem>
// //                       <SelectItem value="India">India</SelectItem>
// //                       <SelectItem value="Australia">Australia</SelectItem>
// //                       <SelectItem value="Italy">Italy</SelectItem>
// //                       <SelectItem value="Pakistan">Pakistan</SelectItem>
// //                       <SelectItem value="Canada">Canada</SelectItem>
// //                       <SelectItem value="UK">United Kingdom</SelectItem>
// //                       <SelectItem value="China">China</SelectItem>
// //                       <SelectItem value="Ireland">Ireland</SelectItem>
// //                       <SelectItem value="New Zealand">New Zealand</SelectItem>
// //                       <SelectItem value="Germany">Germany</SelectItem>
// //                       <SelectItem value="Malaysia">Malaysia</SelectItem>
// //                       <SelectItem value="France">France</SelectItem>
// //                       <SelectItem value="Denmark">Denmark</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //             {/* currentCity */}
// //             <FormField
// //               control={form.control}
// //               name="currentCity"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>City</FormLabel>
// //                   <Select
// //                     onValueChange={field.onChange}
// //                     defaultValue={field.value}
// //                   >
// //                     <FormControl>
// //                       <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
// //                         <SelectValue placeholder="Select City" />
// //                       </SelectTrigger>
// //                     </FormControl>
// //                     <SelectContent>
// //                       <SelectItem value="london">London</SelectItem>
// //                       <SelectItem value="manchester">Manchester</SelectItem>
// //                       <SelectItem value="birmingham">Birmingham</SelectItem>
// //                       <SelectItem value="leeds">Leeds</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //             {/* currentZipCode */}
// //             <FormField
// //               control={form.control}
// //               name="currentZipCode"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Zip Code</FormLabel>

// //                   <FormControl>
// //                     <Input
// //                       type="text"
// //                       placeholder="Write..."
// //                       className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
// //                       {...field}
// //                     />
// //                   </FormControl>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //             {/* currentEmail */}
// //             <FormField
// //               control={form.control}
// //               name="currentEmail"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Email</FormLabel>

// //                   <FormControl>
// //                     <div className="relative w-full">
// //                       {/* Input Field */}
// //                       <Input
// //                         type="text"
// //                         placeholder="Enter your email address"
// //                         className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
// //                         {...field}
// //                       />

// //                       {/* Image inside the Input using Next.js Image */}
// //                       <span className="absolute left-3 top-1/2 -translate-y-1/2">
// //                         <Image
// //                           src="/DashboardPage/letter.svg"
// //                           alt="User Icon"
// //                           width={20}
// //                           height={20}
// //                           className="w-5 h-5 text-black"
// //                         />
// //                       </span>
// //                     </div>
// //                   </FormControl>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <FormField
// //               control={form.control}
// //               name="currentPhoneNo"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Phone No.</FormLabel>
// //                   <div className="flex gap-2">
// //                     <FormField
// //                       control={form.control}
// //                       name="currentCountryCode"
// //                       render={({ field: countryCodeField }) => (
// //                         <Select
// //                           value={form.watch("countryCode") || "+92"}
// //                           onValueChange={countryCodeField.onChange}
// //                         >
// //                           <FormControl>
// //                             <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
// //                               <SelectValue>
// //                                 <div className="flex items-center gap-2">
// //                                   <Image
// //                                     src={
// //                                       countries.find(
// //                                         (c) => c.name === form.watch("country")
// //                                       )?.flag || "/default-flag.png"
// //                                     }
// //                                     alt="Country Flag"
// //                                     width={20}
// //                                     height={20}
// //                                     className="object-contain"
// //                                     unoptimized
// //                                   />
// //                                   <span className="text-sm">
// //                                     {form.watch("countryCode") || "+92"}
// //                                   </span>
// //                                 </div>
// //                               </SelectValue>
// //                             </SelectTrigger>
// //                           </FormControl>
// //                           <SelectContent>
// //                             {countries.map((country) => (
// //                               <SelectItem
// //                                 key={country.code}
// //                                 value={country.code}
// //                               >
// //                                 <div className="flex items-center gap-2">
// //                                   <Image
// //                                     src={country.flag}
// //                                     alt={`${country.name} Flag`}
// //                                     width={20}
// //                                     height={20}
// //                                     className="object-contain"
// //                                     unoptimized
// //                                   />
// //                                   <span className="text-sm">{`${country.code} (${country.name})`}</span>
// //                                 </div>
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       )}
// //                     />
// //                     <Input
// //                       {...field}
// //                       placeholder="Enter your phone number"
// //                       className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
// //                     />
// //                   </div>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //           </div>
// //         </>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CurrentAddress;
// "use client";

// import Image from "next/image";
// import { countries } from "@/lib/countries";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
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
// import { UseFormReturn } from "react-hook-form";
// import { formSchema } from "./Schema";
// import { z } from "zod";
// type FormValues = z.infer<typeof formSchema>;

// const CurrentAddress = ({ form }: { form: UseFormReturn<FormValues> }) => {
//   return (
//     <div className="my-4">
//       <div className="grid grid-cols-1 gap-2 items-end">
//         <div className="flex items-center gap-2">
//           <Checkbox id="confirm-name" />
//           <label
//             htmlFor="confirm-name"
//             className="text-base font-semibold cursor-pointer"
//           >
//             Same as Home Address
//           </label>
//         </div>

//         {[
//           { name: "currentHomeAddress", label: "Home Address" },
//           { name: "currentDetailedAddress", label: "Detailed Address" },
//           { name: "currentZipCode", label: "Zip Code" },
//         ].map(({ name, label }) => (
//           <FormField
//             key={name}
//             control={form.control}
//             name={name}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{label}</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder="Write..."
//                     className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         ))}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <FormField
//             control={form.control}
//             name="currentCountry"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Country</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
//                       <SelectValue placeholder="Select Country" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {countries.map((country) => (
//                       <SelectItem key={country.code} value={country.name}>
//                         {country.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="currentCity"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>City</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
//                       <SelectValue placeholder="Select City" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {/* Replace with dynamic city options based on selected country */}
//                     <SelectItem value="london">London</SelectItem>
//                     <SelectItem value="manchester">Manchester</SelectItem>
//                     <SelectItem value="birmingham">Birmingham</SelectItem>
//                     <SelectItem value="leeds">Leeds</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="currentEmail"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <div className="relative w-full">
//                   <Input
//                     type="text"
//                     placeholder="Enter your email address"
//                     className="bg-[#f1f1f1] placeholder-[#313131] pl-10"
//                     {...field}
//                   />
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2">
//                     <Image
//                       src="/DashboardPage/letter.svg"
//                       alt="Email Icon"
//                       width={20}
//                       height={20}
//                     />
//                   </span>
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="currentPhoneNo"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone No.</FormLabel>
//               <div className="flex gap-2">
//                 <FormField
//                   control={form.control}
//                   name="currentCountryCode"
//                   render={({ field: countryCodeField }) => (
//                     <Select
//                       value={form.watch("countryCode") || "+92"}
//                       onValueChange={countryCodeField.onChange}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
//                           <SelectValue>
//                             <div className="flex items-center gap-2">
//                               <Image
//                                 src={
//                                   countries.find(
//                                     (c) => c.name === form.watch("country")
//                                   )?.flag || "/default-flag.png"
//                                 }
//                                 alt="Country Flag"
//                                 width={20}
//                                 height={20}
//                               />
//                               <span className="text-sm">
//                                 {form.watch("countryCode") || "+92"}
//                               </span>
//                             </div>
//                           </SelectValue>
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {countries.map((country) => (
//                           <SelectItem key={country.code} value={country.code}>
//                             <div className="flex items-center gap-2">
//                               <Image
//                                 src={country.flag}
//                                 alt={`${country.name} Flag`}
//                                 width={20}
//                                 height={20}
//                               />
//                               <span className="text-sm">{`${country.code} (${country.name})`}</span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 <Input
//                   {...field}
//                   value={
//                     typeof field.value === "string" ||
//                     typeof field.value === "number"
//                       ? field.value
//                       : ""
//                   }
//                   placeholder="Enter your phone number"
//                   className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] text-sm"
//                 />
//               </div>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default CurrentAddress;
"use client";

import Image from "next/image";
import { countries } from "@/lib/countries";
import { Checkbox } from "@/components/ui/checkbox";
import {
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
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./Schema";
import { z } from "zod";
type FormValues = z.infer<typeof formSchema>;

const CurrentAddress = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="my-4">
      <div className="grid grid-cols-1 gap-2 items-end">
        <div className="flex items-center gap-2">
          <Checkbox
            id="confirm-name"
            onCheckedChange={(checked) => {
              if (checked) {
                // Copy home address fields to current address fields
                form.setValue(
                  "currentHomeAddress",
                  form.getValues("homeAddress") || ""
                );
                form.setValue(
                  "currentDetailedAddress",
                  form.getValues("detailedAddress") || ""
                );
                form.setValue(
                  "currentCountry",
                  form.getValues("country") || ""
                );
                form.setValue("currentCity", form.getValues("city") || "");
                form.setValue(
                  "currentZipCode",
                  form.getValues("zipCode") || ""
                );
                form.setValue("currentEmail", form.getValues("email") || "");
                form.setValue(
                  "currentCountryCode",
                  form.getValues("countryCode") || ""
                );
                form.setValue(
                  "currentPhoneNo",
                  form.getValues("phoneNo") || ""
                );
              }
            }}
          />
          <label
            htmlFor="confirm-name"
            className="text-base font-semibold cursor-pointer"
          >
            Same as Home Address
          </label>
        </div>

        {[
          { name: "currentHomeAddress" as const, label: "Home Address" },
          {
            name: "currentDetailedAddress" as const,
            label: "Detailed Address",
          },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="currentCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Find selected country to update country code
                    const selectedCountry = countries.find(
                      (c) => c.name === value
                    );
                    if (selectedCountry) {
                      form.setValue("currentCountryCode", selectedCountry.code);
                    }
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        {country.name}
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
            name="currentCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Replace with dynamic city options based on selected country */}
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="manchester">Manchester</SelectItem>
                    <SelectItem value="birmingham">Birmingham</SelectItem>
                    <SelectItem value="leeds">Leeds</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentZipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Enter your email address"
                      className="bg-[#f1f1f1] placeholder-[#313131] pl-10"
                      {...field}
                      value={field.value || ""}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/DashboardPage/letter.svg"
                        alt="Email Icon"
                        width={20}
                        height={20}
                      />
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="currentPhoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="currentCountryCode"
                  render={({ field: countryCodeField }) => (
                    <Select
                      value={countryCodeField.value || "+92"}
                      onValueChange={countryCodeField.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <Image
                                src={
                                  countries.find(
                                    (c) =>
                                      c.code ===
                                      (countryCodeField.value || "+92")
                                  )?.flag || "/default-flag.png"
                                }
                                alt="Country Flag"
                                width={20}
                                height={20}
                              />
                              <span className="text-sm">
                                {countryCodeField.value || "+92"}
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={country.flag}
                                alt={`${country.name} Flag`}
                                width={20}
                                height={20}
                              />
                              <span className="text-sm">{`${country.code} (${country.name})`}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter your phone number"
                  className="rounded-lg bg-[#f1f1f1] placeholder-[#313131] text-sm"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CurrentAddress;