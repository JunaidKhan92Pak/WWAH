"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { countries } from "@/lib/countries";
import Image from "next/image";
import ContactDetails from "./components/ContactDetails";
import PassportandVisaInformation from "./components/PassportandVisaInformation";
// import CurrentAddress from "./components/CurrentAddress";
import { FormProvider } from "react-hook-form";
import LearningExperience from "./components/LearningExperience";
import FinancialSponsorInfo from "./components/FinancialSponsorInfo";
import FamilyMembers from "./components/FamilyMembers";

const formSchema = z.object({
  studentId: z.string().optional(),
  applicationId: z.string().optional(),
  familyName: z.string().optional(),
  givenName: z.string().optional(),

  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  nationality: z.string(),
  countryOfResidence: z.string(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  religion: z.string().optional(),
  email: z.string().email(),

  // Passport
  hasPassport: z.boolean().optional(),
  noPassport: z.boolean().optional(),
  passportNumber: z.string().max(50).optional(),
  passportExpiryDate: z.date().optional().nullable(),
  oldPassportNumber: z.string().max(50).optional(),
  oldPassportExpiryDate: z.date().optional().nullable(),

  // Financial Sponsor
  sponsorName: z.string().min(1, "Sponsor name is required"),
  sponsorsNationality: z.string().min(1, "Nationality is required"),
  industryType: z.string().optional(),
  institution: z.string().optional(),
  sponsorRelationship: z.string().optional(),
  sponsorsOccupation: z.string().optional(),
  sponsorsPhoneNo: z.string().optional(),
  sponsorsCountryCode: z.string().optional(),
  sponsorsEmail: z.string().email("Invalid email").optional(),
}).superRefine((data, ctx) => {
  if (data.hasPassport && data.noPassport) {
    ["hasPassport", "noPassport"].forEach(field =>
      ctx.addIssue({ path: [field], code: z.ZodIssueCode.custom, message: "Cannot select both" })
    );
  }
  if (data.hasPassport) {
    if (!data.passportNumber?.trim()) {
      ctx.addIssue({ path: ["passportNumber"], code: z.ZodIssueCode.custom, message: "Passport number required" });
    }
    if (!data.passportExpiryDate) {
      ctx.addIssue({ path: ["passportExpiryDate"], code: z.ZodIssueCode.custom, message: "Expiry date required" });
    }
  }
});


type PersonalInfoFormValues = z.infer<typeof formSchema>;

export default function PersonalInformationForm() {
  const [emptyFamilyName, setEmptyFamilyName] = useState(false);
  const [emptyGivenName, setEmptyGivenName] = useState(false);

 const form = useForm<PersonalInfoFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    familyName: "",
    givenName: "",
    gender: "Male", // or "" if you want empty initially
    dateOfBirth: "",
    nationality: "",
    countryOfResidence: "",
    maritalStatus: "Single", // or ""
    religion: "",

    email: "",

    hasPassport: false,
    noPassport: false,
    passportNumber: "",
    passportExpiryDate: undefined,
    oldPassportNumber: "",
    oldPassportExpiryDate: undefined,

    sponsorName: "",
    sponsorsNationality: "",
    industryType: "",
    institution: "",
    sponsorRelationship: "",
    sponsorsOccupation: "",
    sponsorsPhoneNo: "+92-Pakistan",
    sponsorsCountryCode: "+92",
    sponsorsEmail: "",
  },
});


  const onSubmit = (data: PersonalInfoFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="mt-2">
        <FormProvider {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Search by Student Name or ID" 
                                                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
{...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Write..." 
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
{...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-xl font-semibold text-center">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Family Name */}
            <div>
             
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                     <div className="flex items-center gap-2 mb-1">
                <Checkbox
                  checked={emptyFamilyName}
                  onCheckedChange={(checked) => setEmptyFamilyName(!!checked)}
                />
                <span className="text-sm">The Family name in the passport is empty.</span>
              </div>
                    <FormControl>
                                            <div className="relative w-full">

                      <Input
                        placeholder="Enter Family Name"
                        {...field}
                        disabled={emptyFamilyName}
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"

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
                  </FormItem>
                )}
              />
            </div>

            {/* Given Name */}
            <div>
            
              <FormField
                control={form.control}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name</FormLabel>
                      <div className="flex items-center gap-2 mb-1">
                <Checkbox
                  checked={emptyGivenName}
                  onCheckedChange={(checked) => setEmptyGivenName(!!checked)}
                />
                <span className="text-sm">The Family name in the passport is empty.</span>
              </div>
                    <FormControl>
                                                                  <div className="relative w-full">

                      <Input
                        placeholder="Enter Given Name"
                        {...field}
                        disabled={emptyGivenName}
                                                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"

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
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" 
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field} />
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
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />

              {/* Country of Residence */}
  <FormField
    control={form.control}
    name="countryOfResidence"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Country of Residence</FormLabel>
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Write..." 
                                                                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
{...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                    <Input placeholder="Enter your email address"
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10" {...field} />
                       <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                              <Image
                        src="/DashboardPage/letter.svg"

alt="User Icon"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 text-black"
                                              />
                                            </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <ContactDetails />
{/* <CurrentAddress form={form}/> */}
         <PassportandVisaInformation />
         <LearningExperience />
         <FinancialSponsorInfo />
         <FamilyMembers />

          {/* <button
            type="submit"
            className="bg-black text-white rounded-lg px-6 py-2 mt-4"
          >
            Submit
          </button> */}
        </form>
      </FormProvider>
    </div>
  );
}
