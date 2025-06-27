"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { countries } from "@/lib/countries";
import AcademicInformation from "./components/AcademicInformation";
import { WorkExperienceForm } from "./components/WorkExperience";
import EnglishLanguageProficiency from "./components/EnglishLanguageProficiency";
import StudentPreferenceForm from "./components/StudentPreference";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
export type WorkExperienceFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  country: z.string().min(1, "Country is required"),
  nationality: z.string().min(1, "Nationality is required"),
  city: z.string().min(1, "City is required"),
  phoneCode: z.string().optional(),

  // Academic
  qualification: z.string().min(1, "Select a qualification"),
  subject: z.string().min(1, "Required"),
  gradingScale: z.string().min(1, "Select a grading scale"),
  scores: z.string().min(1, "Required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  institution: z.string().min(1, "Required"),
  // Work experience
  //     hasWorkExperience: z.boolean(),
  // jobTitle: z.string().optional(),
  // organization: z.string().optional(),
  // employmentType: z.enum(["full-time", "part-time"]).optional(),
  // StartDate: z.date().optional(),
  // EndDate: z.date().optional(),

  // english language proficiency
  englishProficiency: z.string().min(1, "Select proficiency level"),
  englishTest: z.string().min(1, "Select English test"),
  obtainedScores: z.string().min(1, "Enter your scores"),

  // Student preference
  preferredCountry: z.string().min(1, "Please select a country"),
  preferredCity: z.string().min(1, "Please select a city"),
  degreeLevel: z.string().min(1, "Please select degree level"),
  fieldOfStudy: z.string().min(1, "Please enter field of study"),
  studyMode: z.string().min(1, "Please select study mode"),
  tuitionCurrency: z.string().min(1, "Required"),
  tuitionBudget: z.string().min(1, "Please enter tuition budget"),
  livingCurrency: z.string().min(1, "Required"),
  livingBudget: z.string().min(1, "Please enter living budget"),
  trackinginfo: z.string().min(1, "Tracking info is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddNewStudentModal({
  open,
  onOpenChange,
}: AddStudentModalProps) {
  const [studentId] = useState(
    `#${Math.floor(10000000 + Math.random() * 90000000)}`
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId,
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      country: "",
      nationality: "",
      city: "",
      phoneCode: "+92",
      // acdemic
      qualification: "",
      subject: "",
      gradingScale: "",
      scores: "",
      startDate: undefined,
      endDate: undefined,
      institution: "",
      // Work experience
      // hasWorkExperience: false,

      // english language proficiency
      englishProficiency: "",
      englishTest: "",
      obtainedScores: "",

      // Student preference
      preferredCountry: "",
      preferredCity: "",
      degreeLevel: "",
      fieldOfStudy: "",
      studyMode: "",
      tuitionCurrency: "",
      tuitionBudget: "",
      livingCurrency: "",
      livingBudget: "",
      trackinginfo: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    onOpenChange(false);
    form.reset(); // optional: reset after submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[300px] md:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Personal Information
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Student ID */}
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-3">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                          placeholder="Enter Full Name"
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

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="email"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-10"
                          placeholder="Enter your email address"
                          {...field}
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

            <div className="grid md:grid-cols-2 gap-3">
              {/* Phone + Code */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone No.</FormLabel>
                    <div className="flex gap-2">
                      {/* Country Code Select */}
                      <FormField
                        control={form.control}
                        name="phoneCode"
                        render={({ field: phoneCodeField }) => {
                          const [selectedCode, selectedName] =
                            phoneCodeField.value?.split("|") || [];
                          const selectedCountry = countries.find(
                            (c) =>
                              c.code === selectedCode && c.name === selectedName
                          );

                          return (
                            <Select
                              onValueChange={phoneCodeField.onChange}
                              value={phoneCodeField.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[170px] bg-[#f1f1f1]">
                                  <SelectValue>
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={
                                          selectedCountry?.flag ||
                                          "/default-flag.png"
                                        }
                                        alt="Flag"
                                        width={20}
                                        height={20}
                                      />
                                      <span className="text-sm">
                                        {selectedCode}
                                      </span>
                                    </div>
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={`${country.code}-${country.name}`}
                                    value={`${country.code}|${country.name}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={20}
                                        height={20}
                                      />
                                      <span className="text-sm">{`${country.code} (${country.name})`}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                      {/* Phone Number Input */}
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter phone number"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="bg-[#f1f1f1]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selected = countries.find(
                            (c) => c.name === value
                          );
                          if (selected)
                            form.setValue("phoneCode", selected.code); // auto update phone code
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1]">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              <div className="flex items-center gap-2">
                                {/* <Image
                    src={country.flag}
                    alt={country.name}
                    width={20}
                    height={20}
                  /> */}
                                <span className="text-sm">{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1]">
                          <SelectValue placeholder="Select Nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* City */}
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
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AcademicInformation />
            <WorkExperienceForm />
            <EnglishLanguageProficiency />
            <StudentPreferenceForm />

            <DialogFooter>
              <Button
                type="submit"
                className="md:w-[20%] bg-red-600 hover:bg-red-500"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
