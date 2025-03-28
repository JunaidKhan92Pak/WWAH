"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
const degrees = [
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Diploma",
  "Certificate",
];
import { z } from "zod";
import { formSchema } from "./Schema";

interface Props {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}
const EducationalBackground: React.FC<Props> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "educationalBackground",
    control: form.control,
  });

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
            <FormField
              control={form.control}
              name={`educationalBackground.${index}.highestDegree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest Degree</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
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

            <FormField
              control={form.control}
              name={`educationalBackground.${index}.degreeStartDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Start Date</FormLabel>
                  <FormControl>
                    {/* <Input
                      {...field}
                      type="date"
                      placeholder="YYYY/MM/DD"
                      // value={
                      //   field.value
                      //     ? field.value.toISOString().split("T")[0]
                      //     : ""
                      // }
                      value={
                        field.value
                          ? format(new Date(field.value), "yyyy-MM-dd")
                          : ""
                      }
                    /> */}
                    <Input
                      {...field}
                      type="date"
                      placeholder="YYYY/MM/DD"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
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
                          ? new Date(field.value).toISOString().split("T")[0]
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
              institutionAttended: "",
              marks: "",
              degreeStartDate: undefined,
              degreeEndDate: undefined,
            })
          }
        >
          <Plus className="w-4 h-4" /> Add Qualification
        </Button>
      </div>
    </div>
  );
};
export default EducationalBackground;
