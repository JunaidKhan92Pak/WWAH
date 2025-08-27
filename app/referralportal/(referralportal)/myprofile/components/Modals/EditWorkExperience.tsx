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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRefUserStore } from "@/store/useRefDataStore";
import { WorkExp } from "@/types/reffertypes";

// Use the WorkExp interface from your store
// interface WorkExp {
//   hasWorkExperience: boolean;
//   hasBrandAmbassador: boolean;
//   jobDescription: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

const workExperienceSchema = z.object({
  hasWorkExperience: z.boolean(),
  jobDescription: z.string().optional(),
  hasBrandAmbassador: z.boolean(),
});

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

const EditWorkExperience = ({ data }: { data: WorkExp }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { updateDetailedInfo } = useRefUserStore();

  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      hasWorkExperience: data.hasWorkExperience || false,
      jobDescription: data.jobDescription || "",
      hasBrandAmbassador: data.hasBrandAmbassador || false,
    },
  });

  const hasWorkExperience = form.watch("hasWorkExperience");

  async function onSubmit(values: WorkExperienceFormData) {
    try {
      // Update the workExperience section of DetailedInfo
      const updateData = {
        workExperience: {
          hasWorkExperience: values.hasWorkExperience,
          jobDescription: values.jobDescription || "",
          hasBrandAmbassador: values.hasBrandAmbassador,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      };

      const response = await updateDetailedInfo(updateData);
      if (response) {
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[90vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Do you have any work experience? */}
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

              {/* Work Experience Details - Show only if user has work experience */}
              {hasWorkExperience && (
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Please describe your work experience
                      </FormLabel>
                      <Textarea
                        {...field}
                        placeholder="I have 1 year experience of teaching at Allied School"
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm min-h-[80px] resize-none"
                      />
                    </FormItem>
                  )}
                />
              )}

              {/* Brand Ambassador Experience */}
              <FormField
                control={form.control}
                name="hasBrandAmbassador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Have you worked as a brand ambassador before?
                    </FormLabel>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="brand-yes" />
                        <FormLabel htmlFor="brand-yes">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="brand-no" />
                        <FormLabel htmlFor="brand-no">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormItem>
                )}
              />

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
