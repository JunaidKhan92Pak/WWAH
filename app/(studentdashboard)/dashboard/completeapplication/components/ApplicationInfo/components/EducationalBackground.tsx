"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const formSchema = z.object({
  qualifications: z.array(
    z.object({
      highestDegree: z.string().min(1, "Please select a degree"),
      subjectName: z.string().min(1, "Subject name is required"),
      institution: z.string().min(1, "Institution name is required"),
      cgpa: z.string().min(1, "CGPA/Marks are required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      studyYears: z.string().min(1, "Please select study years"),
    })
  ),
});

const degrees = ["Bachelor's Degree", "Master's Degree", "Ph.D.", "Diploma", "Certificate"];


export default function EducationalBackground() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qualifications: [
        {
          highestDegree: "",
          subjectName: "",
          institution: "",
          cgpa: "",
          startDate: "",
          endDate: "",
          studyYears: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "qualifications",
    control: form.control,
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="mx-auto max-w-3xl my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="mb-6">
                <h2 className="text-base font-semibold text-center text-gray-900">
                  Education Background {index + 1}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`qualifications.${index}.highestDegree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Degree</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="bg-[#f1f1f1]">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {degrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.subjectName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="placeholder:text-sm bg-[#f1f1f1]"
                          placeholder="Write..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Attended</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="placeholder:text-sm bg-[#f1f1f1]"
                          placeholder="Write..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.cgpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGPA/Marks</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="placeholder:text-sm bg-[#f1f1f1]"
                          placeholder="Write..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Start Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          placeholder="YYYY/MM/DD"
                          className="bg-[#f1f1f1]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Completion Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          placeholder="YYYY/MM/DD"
                          className="bg-[#f1f1f1]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
              onClick={() =>
                append({
                  highestDegree: "",
                  subjectName: "",
                  institution: "",
                  cgpa: "",
                  startDate: "",
                  endDate: "",
                  studyYears: "",
                })
              }
            >
              <Plus className="w-4 h-4" /> Add Qualification
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}