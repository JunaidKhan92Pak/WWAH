"use client";

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
// import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const workExperienceSchema = z.object({
  experiences: z.array(
    z
      .object({
        jobTitle: z.string().min(1, "Job title is required"),
        organizationName: z.string().min(1, "Organization name is required"),
        dateFrom: z.string().min(1, "Start date is required"),
        dateTo: z.string().min(1, "End date is required"),
        isFullTime: z.boolean().default(false),
        isPartTime: z.boolean().default(false),
      })
      .refine((data) => data.isFullTime || data.isPartTime, {
        message: "Please select either Full Time or Part Time",
        path: ["isFullTime"],
      })
  ),
});

type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

export default function Home() {
  const form = useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences: [
        {
          jobTitle: "",
          organizationName: "",
          dateFrom: "",
          dateTo: "",
          isFullTime: false,
          isPartTime: false,
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  function onSubmit(data: WorkExperienceForm) {
    console.log(data);
  }

  return (
      <div className="mx-auto max-w-3xl my-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white">
                <div className="mb-6">
                    <h2 className="text-base font-semibold text-center text-gray-900">
                      Work Experience {index + 1}
                    </h2>
                  </div>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.jobTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input className="placeholder:text-sm" placeholder="Write..." {...field} />
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
                            <Input className="placeholder:text-sm" placeholder="Write..." {...field} />
                          </FormControl>
                          <FormMessage />
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
                                      form.formState.errors.experiences?.[index]
                                        ?.isPartTime?.message
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
                          <FormLabel>Date From</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.dateTo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date To</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2  bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
                onClick={() =>
                  append({
                    jobTitle: "",
                    organizationName: "",
                    dateFrom: "",
                    dateTo: "",
                    isFullTime: false,
                    isPartTime: false,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Work Experiencee
              </Button>

            </div>
          </form>
        </Form>
    </div>
  );
}
