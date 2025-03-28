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

// Define validation schema
const formSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  degreeLevel: z.string().min(1, "Degree level is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  tuitionBudget: z.string().min(1, "Tuition budget is required"),
  // .regex(/^\d+$/, "Must be a valid number")
  // .transform((val) => parseFloat(val))
  // .refine((val) => val > 0, "Must be greater than 0"),

  livingBudget: z.string().min(1, "Living budget is required"),
  // .regex(/^\d+$/, "Must be a valid number")
  // .transform((val) => parseFloat(val))
  // .refine((val) => val > 0, "Must be greater than 0")
  studyMode: z.string().min(1, "Study mode is required"),
  currency: z.string().min(1, "Currency is required"),
});

interface StudentPreferenceData {
  perferredCountry: string;
  perferredCity: string;
  degreeLevel: string;
  fieldOfStudy: string;
  tutionfees: string;
  livingcost: string;
  studyMode: string;
  currency: string;
  updatedAt: Date;
}

const EditStudentPreference = ({ data }: { data: StudentPreferenceData }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [currency, setCurrency] = useState(data?.currency || "");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: `${data?.perferredCountry}`,
      city: `${data?.perferredCity}`,
      degreeLevel: `${data?.degreeLevel}`,
      fieldOfStudy: `${data?.fieldOfStudy}`,
      tuitionBudget: `${data?.tutionfees}`,
      livingBudget:`${data?.livingcost}`,
      studyMode: `${data?.studyMode}`,
      currency: "USD",
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  //   setOpen(false);
  //   // Show success modal
  //   setTimeout(() => {
  //     setSuccessOpen(true);
  //   }, 300);
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values); // Debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updateUserPreferences`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Updated successfully:", data);
        setOpen(false);
        setTimeout(() => {
          setSuccessOpen(true);
        }, 300);
      } else {
        console.error("Error updating:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  return (
    <>
      <div className="flex flex-col items-start space-y-4">
        <p className="text-gray-600 text-base">Student Preference:</p>
        <div className="flex flex-row items-center gap-x-2">
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
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh] overflow-y-auto ">
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
                        What is your preferred country for studying abroad?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="China">China</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Italy">Italy</SelectItem>
                          <SelectItem value="Malaysia">Malaysia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Ireland">Ireland</SelectItem>
                          <SelectItem value="New Zealand">
                            New Zealand
                          </SelectItem>
                          <SelectItem value="Denmark">Denmark</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City Selection */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your preferred city?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="London">London</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="Toronto">Toronto</SelectItem>
                          <SelectItem value="Sydney">Sydney</SelectItem>
                          <SelectItem value="Berlin">Berlin</SelectItem>
                          <SelectItem value="Tokyo">Tokyo</SelectItem>
                          <SelectItem value="Paris">Paris</SelectItem>
                          <SelectItem value="Dubai">Dubai</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                          <SelectItem value="Los Angeles">
                            Los Angeles
                          </SelectItem>
                          
                          <SelectItem value="Chicago">Chicago</SelectItem>
                          <SelectItem value="california">California</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Degree Level */}
                <FormField
                  control={form.control}
                  name="degreeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Which degree level are you interested in?
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
                          <SelectItem value="foundation">Foundation</SelectItem>
                          <SelectItem value="bachelor">Bachelor</SelectItem>
                          <SelectItem value="preMaster">Pre Master</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="certificate">
                            Certificate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Field of Study */}
                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Which field of study would you like to pursue?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select a field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Engineering">
                            Engineering
                          </SelectItem>

                          <SelectItem value="Business">Business</SelectItem>

                          <SelectItem value="Arts & Humanities">
                            Arts & Humanities
                          </SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Law">Law</SelectItem>
                          <SelectItem value="Information Technology">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="Social Sciences">
                            Social Sciences
                          </SelectItem>

                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Environmental Studies">
                            Environmental Studies
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tuition Fee Budget */}
                <FormField
                  control={form.control}
                  name="tuitionBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Tuition Fee Budget</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Select
                          // defaultValue="PKR"
                          // name="currency"
                          value={currency}
                          onValueChange={setCurrency}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                              <SelectValue placeholder="PKR" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pkr">PKR</SelectItem>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="euro">Euro</SelectItem>
                            <SelectItem value="sar">SAR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter tuition fee"
                            {...field}
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          />
                        </FormControl>
                      </div>
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
                      <FormLabel>Preferred Living Cost Budget</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Select
                          // defaultValue="PKR"
                          // name="currency"
                          value={currency}
                          onValueChange={setCurrency}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[140px] bg-[#f1f1f1] rounded-lg border-r-0">
                              <SelectValue placeholder="PKR" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pkr">PKR</SelectItem>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="euro">Euro</SelectItem>
                            <SelectItem value="sar">SAR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter living fee"
                            {...field}
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Study Mode */}
                <FormField
                  control={form.control}
                  name="studyMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which study mode would you prefer?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="onCampus">On Campus</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Hybrid">Blended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
