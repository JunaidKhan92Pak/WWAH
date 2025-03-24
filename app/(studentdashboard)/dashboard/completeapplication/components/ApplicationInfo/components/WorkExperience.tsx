"use client";

import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./Schema";

interface Props {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}
const WorkExperience: React.FC<Props> = ({ form }) => {
  const { fields, append } = useFieldArray({
    name: "workExperience",
    control: form.control,
  });
  // export default function WorkExperience({
  //   form,
  // }: {
  //   form: UseFormReturn<{
  //     workExperience: {
  //       jobTitle: string;
  //       organizationName: string;
  //       isFullTime: boolean;
  //       isPartTime: boolean;
  //       employmentType: string | null;
  //       from: string;
  //       to: string;
  //     }[];
  //   }>;
  // }) {
  //   const { fields, append } = useFieldArray({
  //     control: form.control,
  //     name: "workExperience",
  //   });

  // Helper function to convert checkbox states to database value
  const convertCheckboxesToEmploymentType = (
    isFullTime: boolean,
    isPartTime: boolean
  ): "fullTime" | "partTime" | undefined => {
    if (isFullTime) return "fullTime";
    if (isPartTime) return "partTime";
    return undefined;
  };

  // Update the underlying employmentType field when checkboxes change
  const handleEmploymentTypeChange = (
    index: number,
    isFullTime: boolean,
    isPartTime: boolean
  ) => {
    form.setValue(
      `workExperience.${index}.employmentType`,
      convertCheckboxesToEmploymentType(isFullTime, isPartTime)
    );
  };

  // Effect to initialize checkboxes based on employmentType when fields change
  useEffect(() => {
    fields.forEach((field, index) => {
      const employmentType = form.getValues(
        `workExperience.${index}.employmentType`
      );
      if (employmentType) {
        if (employmentType === "fullTime") {
          form.setValue(`workExperience.${index}.isFullTime`, true);
          form.setValue(`workExperience.${index}.isPartTime`, false);
        } else if (employmentType === "partTime") {
          form.setValue(`workExperience.${index}.isFullTime`, false);
          form.setValue(`workExperience.${index}.isPartTime`, true);
        }
      }
    });
  }, [fields, form]);

  return (
    <div className="mx-auto max-w-3xl my-4">
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
                name={`workExperience.${index}.jobTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-sm"
                        placeholder="Write..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.organizationName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-sm"
                        placeholder="Write..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />

                    {/* employment type */}
                    <div className="flex space-x-6 justify-evenly">
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.isFullTime`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    form.setValue(
                                      `workExperience.${index}.isPartTime`,
                                      false
                                    );
                                  }
                                  handleEmploymentTypeChange(
                                    index,
                                    Boolean(checked),
                                    false
                                  );
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
                        name={`workExperience.${index}.isPartTime`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    form.setValue(
                                      `workExperience.${index}.isFullTime`,
                                      false
                                    );
                                  }
                                  handleEmploymentTypeChange(
                                    index,
                                    false,
                                    Boolean(checked)
                                  );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Part Time</FormLabel>
                            </div>
                            <FormMessage>
                              {
                                form.formState.errors.workExperience?.[index]
                                  ?.isPartTime?.message
                              }
                            </FormMessage>
                          </FormItem>
                        )}
                      />

                      {/* Hidden field for employmentType (this will be sent to the DB) */}
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.employmentType`}
                        render={({ field }) => (
                          <input
                            type="hidden"
                            {...field}
                            value={field.value ?? ""}
                          />
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
                name={`workExperience.${index}.from`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.to`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date To</FormLabel>
                    <FormControl>
                      value=
                      {field.value
                        ? field.value.toISOString().split("T")[0]
                        : ""}
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                      />
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
              from: undefined,
              to: undefined,
              employmentType: undefined,
              isFullTime: false,
              isPartTime: false,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Work Experience
        </Button>
      </div>
    </div>
  );
};
export default WorkExperience;
