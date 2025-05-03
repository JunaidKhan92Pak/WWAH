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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const workExperienceSchema = z.object({
  hasWorkExperience: z.boolean(),
  experiences: z.array(
    z
      .object({
        // jobTitle: z.string().min(1, "Job title is required"),
        // organizationName: z.string().min(1, "Organization name is required"),
        // dateFrom: z.date() ,
        // dateTo: z.date(),
        // isFullTime: z.boolean().default(false),
        // isPartTime: z.boolean().default(false),
        workexperience: z.union([z.string(), z.number()]),
        duration: z.number().min(0, "Duration must be a non-negative number"),
      })
    // .refine((data) => data.isFullTime || data.isPartTime, {
    //   message: "Please select either Full Time or Part Time",
    //   path: ["isFullTime"],
    // })
  ),
});

type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

interface WorkExperienceData {
    workexperience: number;
}

const EditWorkExperience = ({
  data,
  updatedAt,
}: {
  data: WorkExperienceData;
  updatedAt: string;
}) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      hasWorkExperience: undefined,

      experiences: [
        {
          // jobTitle: data?.jobTitle || "",
          // organizationName: data?.organizationName || "",
          // dateFrom: data?.startDate || undefined,
          // dateTo: data?.endDate || undefined,
          // isFullTime: data?.employmentType === "fullTime",
          // isPartTime: data?.employmentType === "partTime",
          workexperience: data?.workexperience || 0,
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const hasWorkExperience = form.watch("hasWorkExperience");

  async function onSubmit(values: WorkExperienceForm) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updateWorkExperience`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );
      const resData = await response.json();
      if (response.ok) {
        setOpen(false);
        setTimeout(() => setSuccessOpen(true), 300);
      } else {
        console.error("Error updating:", resData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      <p className="text-gray-600 text-base">Work Experience:</p>
      <div className="flex flex-row items-center gap-x-2">
        <Image
          src="/DashboardPage/work.svg"
          alt="Icon"
          width={16}
          height={16}
        />
        <p className="text-sm">last updated on {new Date(updatedAt).toLocaleDateString("en-GB")}</p>
        <Image
          src="/DashboardPage/pen.svg"
          alt="Edit"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              {hasWorkExperience &&
                fields.map((field, index) => (
                  <div key={field.id} className="grid gap-6">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor={`years-experience-${index}`}>
                            Years of Experience
                          </FormLabel>

                          <Input
                            {...field}
                            id={`years-experience-${index}`}
                            type="number"
                            min="0"
                            placeholder="Enter number of years"
                            className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm mt-2"
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

              <Button type="submit" className="w-full md:w-[40%] bg-[#C7161E]">
                Update Work Experience
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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