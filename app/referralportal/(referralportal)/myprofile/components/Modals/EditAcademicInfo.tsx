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

import { Input } from "@/components/ui/input";
import { useRefUserStore } from "@/store/useRefDataStore";
import { AcademicInfo, DetailedInfo } from "@/types/reffertypes";

const formSchema = z.object({
  currentDegree: z.string().min(1, { message: "Qualification is required" }),
  program: z.string().min(1, { message: "Program is required" }),
  universityName: z.string().min(1, { message: "University Name is required" }),
  currentSemester: z
    .string()
    .min(1, { message: "Current semester is required" }),
});

const EditAcademicInfo = ({ data }: { data: AcademicInfo }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { updateDetailedInfo } = useRefUserStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentDegree: `${data?.currentDegree}`,
      program: `${data?.program || ""}`,
      universityName: `${data?.uniName || ""}`,
      currentSemester: `${data?.currentSemester || ""}`,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values);

    // Structure the data according to DetailedInfo interface
    const apiData = {
      AcademicInformation: {
        currentDegree: values.currentDegree,
        program: values.program,
        uniName: values.universityName, // Note: backend expects 'uniName', not 'universityName'
        currentSemester: values.currentSemester,
      },
    } as Partial<DetailedInfo>;

    try {
      const response = await updateDetailedInfo(apiData);

      console.log(
        response,
        "response from updateUserProfile in EditAcademicInfo"
      );
      if (response !== undefined) {
        setOpen(false);
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <>
      {/* Academic Information */}
      <div className="flex flex-col items-start space-y-2">
        <p className="text-gray-600 text-base"> Educational Details:</p>
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
        <DialogContent className="!rounded-2xl max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Educational Details</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Qualification */}
                <FormField
                  control={form.control}
                  name="currentDegree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree (Currently Enrolled in)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="bachelors">Bachelors</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="Phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Program */}
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          placeholder="Enter your program"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* University Name */}
                <FormField
                  control={form.control}
                  name="universityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          placeholder="Enter university name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Current Semester */}
                <FormField
                  control={form.control}
                  name="currentSemester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current semester</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semester-1">1st</SelectItem>
                          <SelectItem value="semester-2">2nd</SelectItem>
                          <SelectItem value="semester-3">3rd</SelectItem>
                          <SelectItem value="semester-4">4th</SelectItem>

                          <SelectItem value="semester-5">5th</SelectItem>
                          <SelectItem value="semester-6">6th</SelectItem>
                          <SelectItem value="semester-7">7th</SelectItem>
                          <SelectItem value="semester-8">8th</SelectItem>
                          <SelectItem value="semester-9">9th</SelectItem>
                          <SelectItem value="semester-10">10th</SelectItem>
                          <SelectItem value="semester-11">11th</SelectItem>
                          <SelectItem value="semester-12">12th</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full md:w-[45%] bg-[#C7161E]">
                Update Educational Details
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
              Educational Details Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAcademicInfo;
