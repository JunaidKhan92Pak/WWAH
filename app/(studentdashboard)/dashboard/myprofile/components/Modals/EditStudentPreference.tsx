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
import { Combobox } from "@/components/ui/combobox";
import { studyDestinations } from "@/lib/constant";
import { majorsAndDisciplines } from "@/lib/constant";
import currency from "currency-codes";
import { useUserStore } from "@/store/useUserData";
const currencyOptions = currency.data.map(
  (c: { code: string; currency: string }) => `${c.code} - ${c.currency}`
);

// Define validation schema
const formSchema = z.object({
  country: z.string().min(1, "Country is required"),
  degreeLevel: z.string().min(1, "Degree level is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  tuitionBudget: z.string().min(1, "Tuition budget is required"),
  livingBudget: z.string().min(1, "Living budget is required"),
  tutionCurrency: z.string().min(1, "Currency is required"),
  livingCurrency: z.string().min(1, "Currency is required"),
});

interface ApiLanguageProficiency {
  test: string;
  score: string;
}
interface ApiStudyPreference {
  country: string;
  degree: string;
  subject: string;
}
// export interface DetailedInfo {
//   studyLevel: string;
//   gradeType: string;
//   grade: number;
//   dateOfBirth: string;
//   nationality: string;
//   majorSubject: string;
//   livingCosts: {
//     amount: number;
//     currency: string;
//   };
//   tuitionFee: {
//     amount: number;
//     currency: string;
//   };
//   languageProficiency: ApiLanguageProficiency;
//   workExperience: number;
//   studyPreferenced: ApiStudyPreference;
//   updatedAt: string;
// }
interface DetailedInfo {
  studyLevel: string;
  gradeType: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: {
    amount: number;
    currency: string;
  };
  tuitionFee: {
    amount: number;
    currency: string;
  };
  languageProficiency: ApiLanguageProficiency;
  studyPreferenced: ApiStudyPreference;
  workExperience: number;
  updatedAt: string;
}
const EditStudentPreference = ({ data }: { data: DetailedInfo }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { updateDetailedInfo } = useUserStore();
  console.log(data?.studyPreferenced, "data?.studyPreference");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: `${data?.studyPreferenced?.country} `,
      degreeLevel: `${data?.studyPreferenced?.degree}`,
      fieldOfStudy: `${data?.studyPreferenced?.subject}`,
      tuitionBudget: `${data?.tuitionFee.amount}`,
      tutionCurrency: `${data?.tuitionFee.currency}`,
      livingBudget: `${data?.livingCosts.amount}`,
      livingCurrency: `${data?.livingCosts.currency}`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const transformedValues = {
        studyPreferenced: {
          country: values.country,
          degree: values.degreeLevel,
          subject: values.fieldOfStudy,
        },
        tuitionFee: {
          amount: Number(values.tuitionBudget),
          currency: values.tutionCurrency,
        },
        livingCosts: {
          amount: Number(values.livingBudget),
          currency: values.livingCurrency,
        },
      };
      const response = await updateDetailedInfo(transformedValues);
      if (response !== undefined) {
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
          setOpen(false);
        }, 2000);
      } else {
        console.error("Failed to update work experience");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  // form.watch((value) => {
  //   console.log("Form values:", value); // Debugging
  // });

  return (
    <>
      <div className="flex flex-col items-start space-y-2">
        <p className="text-gray-600 text-base">Student Preference:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/Backpack.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on{" "}
            {new Date(data?.updatedAt).toLocaleDateString("en-GB")}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Student Preference</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* Country Selection */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Which country are you dreaming of studying in?
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={studyDestinations}
                          value={field.value} // Ensure this is connected to the form value
                          onChange={(val) => field.onChange(val)} // Handle the change event to update the form value
                          placeholder="Select country"
                          emptyMessage="No countries found"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="degreeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What level of study are you planning next?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select degree level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bachelor">Bachelor</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="PHD">PhD</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Certificate">
                            Certificate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Field of Study */}
                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What major or discipline are you interested in?
                      </FormLabel>

                      <FormControl>
                        <Combobox
                          options={majorsAndDisciplines}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select your major or field"
                          emptyMessage="No majors found"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Currency Field */}
                <FormField
                  control={form.control}
                  name="tutionCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What&apos;s your preferred annual tuition budget?
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={currencyOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Choose currency"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tuition Budget Field */}
                <FormField
                  control={form.control}
                  name="tuitionBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter tuition fee"
                          {...field}
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="livingCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      And your estimated cost of living per year?
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={currencyOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Choose currency"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Living Cost Budget */}
              <FormField
                control={form.control}
                name="livingBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter tuition fee"
                        {...field}
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-[40%] bg-[#C7161E]">
                Update My Preferences
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center  max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Preferences Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditStudentPreference;
