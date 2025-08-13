"use client";

import { useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { z } from "zod";
import { formSchema } from "./Schema";

const degrees = [
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Diploma",
  "Certificate",
];

interface Props {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const EducationalBackground: React.FC<Props> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "educationalBackground",
    control: form.control,
  });

  // ✅ Ensure one entry is there on mount
  useEffect(() => {
    const background = form.getValues("educationalBackground");
    if (!background || background.length === 0) {
      append({
        highestDegree: "",
        subjectName: "",
        institutionAttended: "",
        marks: "",
        degreeStartDate: undefined,
        degreeEndDate: undefined,
      });
    }
  }, [append, form]);

  return (
    <div className="mx-auto max-w-3xl my-4">
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="border p-4 rounded-md relative mb-4">
            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-base font-semibold text-center text-gray-900">
              Education Background {index + 1}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fields go here (unchanged) */}
            {/* Degree */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.highestDegree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {index === 0 ? "Highest Degree" : "Degree"}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            index === 0
                              ? "Select Highest Degree"
                              : "Select Degree"
                          }
                        />
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
            {/* Subject */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.subjectName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="placeholder:text-sm"
                      placeholder="Write..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Institution */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.institutionAttended`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Attended</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="placeholder:text-sm"
                      placeholder="Write..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Marks */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.marks`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGPA/Marks</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="placeholder:text-sm"
                      placeholder="Write..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Start Date */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.degreeStartDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Start Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      placeholder="YYYY/MM/DD"
                      value={
                        field.value
                          ? format(new Date(field.value), "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* End Date */}
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.degreeEndDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Completion Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      placeholder="YYYY/MM/DD"
                      value={
                        field.value
                          ? format(new Date(field.value), "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-[#C5C3C38A] rounded-full w-2/3 sm:w-1/3"
          onClick={() =>
            append({
              highestDegree: "",
              subjectName: "",
              institutionAttended: "",
              marks: "",
              degreeStartDate: undefined,
              degreeEndDate: undefined,
            })
          }
        >
          <Plus className="w-4 h-11" /> Add Qualification
        </Button>
      </div>
    </div>
  );
};

export default EducationalBackground;
