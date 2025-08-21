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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/store/useUserData";

const workExperienceSchema = z.object({
  hasWorkExperience: z.boolean(),
  workExperience: z.string().optional(),
});

type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

interface WorkExperienceData {
  workExperience: number;
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
  const { updateDetailedInfo } = useUserStore();

  console.log(`${data.workExperience} `, "workExperience");

  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      // Fix: Set hasWorkExperience based on actual data
      hasWorkExperience: data.workExperience > 0,
      // Fix: Convert number to string properly
      workExperience:
        data.workExperience > 0 ? data.workExperience.toString() : "0",
    },
  });

  const hasWorkExperience = form.watch("hasWorkExperience");

  async function onSubmit(values: WorkExperienceForm) {
    try {
      // Fix: Send the correct field name and handle the boolean logic
      const transformedValues = {
        // Send 'years' instead of 'workExperience' to match backend expectation
        years: values.hasWorkExperience
          ? Number(values.workExperience || 0)
          : 0,
      };

      console.log("Sending to backend:", transformedValues);

      const response = await updateDetailedInfo(transformedValues);
      if (response !== undefined && response === true) {
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

  // Fix: Reset workExperience field when hasWorkExperience changes
  const handleWorkExperienceChange = (value: boolean) => {
    form.setValue("hasWorkExperience", value);
    if (!value) {
      form.setValue("workExperience", "0");
    }
  };

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
        <p className="text-sm">
          {/* Fix: Show proper work experience text */}
          {data.workExperience > 0
            ? `${data.workExperience} year${
                data.workExperience !== 1 ? "s" : ""
              } - `
            : "No work experience - "}
          last updated on {new Date(updatedAt).toLocaleDateString("en-GB")}
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
                      onValueChange={(value) =>
                        handleWorkExperienceChange(value === "yes")
                      }
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

              {hasWorkExperience && (
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="workExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="50"
                          step="1"
                          placeholder="Enter number of years"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm mt-2"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              )}

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
