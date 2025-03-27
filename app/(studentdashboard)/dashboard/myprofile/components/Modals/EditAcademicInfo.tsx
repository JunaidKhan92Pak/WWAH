"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const formSchema = z
  .object({
    qualification: z.string().min(1, { message: "Qualification is required" }),
    subject: z.string().min(1, { message: "Major Subject is required" }),
    gradingScale: z.string().min(1, { message: "Grading Scale is required" }),
    obtainedScore: z
      .string()
      .regex(/^\d+%?$/, { message: "Enter a valid percentage (e.g., 65%)" }),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date",
    }),
    institution: z.string().min(1, { message: "Institution name is required" }),
    test: z.string().min(1, { message: "Test selection is required" }),
    testScore: z
      .string()
      .regex(/^\d+%?$/, { message: "Enter a valid percentage (e.g., 65%)" }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"], // Show error on End Date field
  });
interface AcademicData {
  highestQualification: string;
  majorSubject: string;
  previousGradingScale: string;
  previousGradingScore: string;
  standardizedTest: string;
  standardizedTestScore: string;
  institutionName: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EditAcademicInfo = ({ data }: { data: AcademicData }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  // console.log(data.highestQualification);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qualification: `${data?.highestQualification}`,
      subject: `${data?.majorSubject}`,
      gradingScale: `${data?.previousGradingScale}`,
      obtainedScore: `${data?.previousGradingScore}`,
      startDate: `${data?.startDate}`,
      endDate: `${data?.endDate}`,
      institution: `${data?.institutionName}`,
      test: `${data?.standardizedTest}`,
      testScore: `${data?.standardizedTestScore}`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values); // Debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updateAcademicInformation`,
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
      {/* Academic Information */}
      <div className="flex flex-col items-start space-y-4">
        <p className="text-gray-600 text-base">Academic Information:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/academic-cap.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            Last updated on{" "}
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Academic Info</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                {/* Qualification */}
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your Highest Qualification Obtained?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matric">
                            Matric/O Levels/Secondary School Certificates
                          </SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate/A Levels/High School
                          </SelectItem>
                          <SelectItem value="IB Diploma">IB Diploma</SelectItem>
                          <SelectItem value="GCSE">GCSE</SelectItem>
                          <SelectItem value="Bachelors">Bachelors</SelectItem>
                          <SelectItem value="Masters">Master/MPhil</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Major Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What was your Major Subject/Field?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subject"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Grading Scale */}
                <FormField
                  control={form.control}
                  name="gradingScale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which grading scale was used?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select grading scale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage Grade Scale
                          </SelectItem>
                          <SelectItem value="gpa">
                            Grade Point Average (GPA) Scale
                          </SelectItem>
                          <SelectItem value="letter">
                            Letter Grade Scale (A-F)
                          </SelectItem>
                          <SelectItem value="pass/fail">Pass/Fail</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Obtained Score */}
                <FormField
                  control={form.control}
                  name="obtainedScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Scores</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter obtained score"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Start Date</FormLabel>
                      <FormControl>
                        {/* <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left font-normal justify-start text-[#313131] bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                            >
                              {field.value ? (
                                format(new Date(field.value), "yyyy/MM/dd")
                              ) : (
                                <span>YYYY/MM/DD</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : ""
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover> */}
                        <Input
                          type="date"
                          value={
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree End Date</FormLabel>
                      <FormControl>
                        {/* <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left font-normal justify-start text-[#313131] bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                            >
                              {field.value ? (
                                format(new Date(field.value), "yyyy/MM/dd")
                              ) : (
                                <span>YYYY/MM/DD</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : ""
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover> */}
                        <Input
                          type="date"
                          value={
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Institution */}
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter institution name"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                {/* Standardized Test */}
                <FormField
                  control={form.control}
                  name="test"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Which Standardized tests have you taken?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Test" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAT">SAT</SelectItem>
                          <SelectItem value="ACT">ACT</SelectItem>
                          <SelectItem value="GRE">GRE</SelectItem>
                          <SelectItem value="GMAT">GMAT</SelectItem>
                          <SelectItem value="LSAT">LSAT</SelectItem>
                          <SelectItem value="MCAT">MCAT</SelectItem>
                          <SelectItem value="GAMSAT">GAMSAT</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Test Score */}
                <FormField
                  control={form.control}
                  name="testScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Score</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter test score"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full md:w-[40%] bg-[#C7161E]">
                Update Academic Information
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
              Academic Info Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAcademicInfo;
