"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// Schema Validation using Zod
const workExperienceSchema = z.object({
  hasWorkExperience: z.boolean(),
  experiences: z.array(
    z
      .object({
        jobTitle: z.string().min(1, "Job title is required"),
        organizationName: z.string().min(1, "Organization name is required"),
        dateFrom: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid start date",
        }),
        dateTo: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid end date",
        }),
        // dateFrom: z.date(),
        // dateTo: z.date(),
        isFullTime: z.boolean().default(false),
        isPartTime: z.boolean().default(false),
      })
      .refine((data) => data.isFullTime || data.isPartTime, {
        message: "Please select either Full Time or Part Time",
        path: ["isFullTime"],
      })
    // .refine((data) => data.dateFrom < data.dateTo, {
    //   message: "End date must be after start date",
    //   path: ["dateTo"],
    // })
  ),
});

type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

interface WorkExperienceData {
  hasWorkExperience: boolean;
  jobTitle: string;
  organizationName: string;
  startDate: Date;
  endDate: Date;
  employmentType: string;
  updatedAt: Date;
}

const EditWorkExperience = ({ data }: { data: WorkExperienceData }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      hasWorkExperience: data?.hasWorkExperience,
      experiences: [
        {
          jobTitle: `${data?.jobTitle}`,
          organizationName: `${data?.organizationName}`,
          dateFrom: `${data?.startDate}`,
          dateTo: `${data?.endDate}`,
          isFullTime: data?.employmentType === "fullTime",
          isPartTime: data?.employmentType === "partTime",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  console.log(data?.organizationName, "organizationName data");
  const hasWorkExperience = form.watch("hasWorkExperience");

  async function onSubmit(values: z.infer<typeof workExperienceSchema>) {
    console.log("Submitting:", values); // Debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updateWorkExperience`,
        {
          method: "PUT",
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
    <div className="flex flex-col items-start space-y-4">
      <p className="text-gray-600 text-base">Work Experience:</p>
      <div className="flex flex-row items-center gap-x-2">
        <Image
          src="/DashboardPage/work.svg"
          alt="Icon"
          width={16}
          height={16}
        />
        <p className="text-sm">
          {" "}
          last updated on {new Date(data?.updatedAt).toLocaleDateString("en-GB")}
        </p>
        <Image
          src="/DashboardPage/pen.svg"
          alt="Edit"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => setOpen(true)} // Opens the modal
        />
      </div>

      {/* Edit Work Experience Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Work Experience Selection */}
              {/* <FormField
                control={form.control}
                name="hasWorkExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have any work experience?</FormLabel>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={
                        field.value
                          ? `${data.hasWorkExperience}`
                          : `${data.hasWorkExperience}`
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="yes" />
                        <FormLabel htmlFor="yes">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="no" />
                        <FormLabel htmlFor="no">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="hasWorkExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have any work experience?</FormLabel>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <FormLabel htmlFor="yes">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <FormLabel htmlFor="no">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormItem>
                )}
              />
              {/* Work Experience Fields */}
              {hasWorkExperience && (
                <>
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.jobTitle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter job title..."
                                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.organizationName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization Name</FormLabel>
                                <FormControl>
                                  <Input
                                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                    placeholder="Write..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                                {/* employmentType */}
                                <div className="flex space-x-6 justify-evenly">
                                  <FormField
                                    control={form.control}
                                    name={`experiences.${index}.isFullTime`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                              field.onChange(checked);
                                              if (checked) {
                                                form.setValue(
                                                  `experiences.${index}.isPartTime`,
                                                  false
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel>Full Time</FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`experiences.${index}.isPartTime`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                              field.onChange(checked);
                                              if (checked) {
                                                form.setValue(
                                                  `experiences.${index}.isFullTime`,
                                                  false
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel>Part Time</FormLabel>
                                        </div>
                                        <FormMessage>
                                          {
                                            form.formState.errors.experiences?.[
                                              index
                                            ]?.isPartTime?.message
                                          }
                                        </FormMessage>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.dateFrom`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  {/* <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full text-left font-normal justify-start text-[#313131] bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                      >
                                        {field.value ? (
                                          format(field.value, "yyyy/MM/dd")
                                        ) : (
                                          <span>YYYY/MM/DD</span>
                                        )}

                                        <CalendarIcon className="ml-auto h-4 w-4  opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        onSelect={(date) =>
                                          field.onChange(date)
                                        } // Ensures valid date
                                      />
                                    </PopoverContent>
                                  </Popover> */}
                                  <Input
                                    type="date"
                                    value={
                                      field.value
                                        ? format(field.value, "yyyy-MM-dd")
                                        : ""
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
                          <FormField
                            control={form.control}
                            name={`experiences.${index}.dateTo`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  {/* <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full text-left font-normal justify-start text-[#313131] bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                                      >
                                        {field.value ? (
                                          format(field.value, "yyyy/MM/dd")
                                        ) : (
                                          <span>YYYY/MM/DD</span>
                                        )}

                                        <CalendarIcon className="ml-auto h-4 w-4  opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        onSelect={(date) =>
                                          field.onChange(date)
                                        } // Ensures valid date
                                      />
                                    </PopoverContent>
                                  </Popover> */}
                                  <Input
                                    type="date"
                                    value={
                                      field.value
                                        ? format(field.value, "yyyy-MM-dd")
                                        : ""
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
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full md:w-[35%] bg-[#C7161E]">
                Update Work Experience
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Work Experience Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditWorkExperience;
