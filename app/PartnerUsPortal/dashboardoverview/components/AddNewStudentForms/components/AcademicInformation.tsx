"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

const qualifications = [
  { value: "matric", label: "Matric/O Levels/Secondary School Certificates" },
  { value: "intermediate", label: "Intermediate/A Levels/High School" },
  { value: "ib", label: "IB Diploma" },
  { value: "gcse", label: "GCSE" },
  { value: "bachelors", label: "Bachelors" },
  { value: "masters", label: "Master/MPhil" },
  { value: "phd", label: "PhD" },
  { value: "others", label: "Others" },
];
const gradingOptions = [
  { value: "4.0", label: "4.0 Scale" },
  { value: "100", label: "Percentage (100%)" },
  { value: "10.0", label: "10.0 Scale" },
];


export default function AcademicInformation() {
 
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Academic Information
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Qualification */}
   <FormField
  control={control}
  name="qualification"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium mb-2">
        What is your Highest Qualification Obtained?
      </FormLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
  variant="outline"
  className="pl-2 w-full bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm text-wrap justify-between"
>
  <span>
    {
      qualifications.find((item) => item.value === field.value)?.label ??
      "Select your qualification"
    }
  </span>
  <ChevronDown className="h-4 w-4 text-muted-foreground" />
</Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-xl border border-gray-200 shadow-md bg-white p-0 w-full">
          {qualifications.map((item) => (
            <div
              key={item.value}
              className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
              onClick={() => field.onChange(item.value)}
            >
              <span className="text-sm text-gray-800">{item.label}</span>
             <Checkbox
  checked={field.value === item.value}
  className="pointer-events-none"
/>

            </div>
          ))}
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  )}
/>

          {/* Subject */}
          <FormField
            control={control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major Subject/Field</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grading Scale */}
<FormField
  control={control}
  name="gradingScale"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium mb-2">
        Grading scale used in Previous studies
      </FormLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-[#f1f1f1] placeholder-[#313131] text-sm justify-between px-4 py-2 border"
          >
            <span>
              {
                gradingOptions.find((item) => item.value === field.value)?.label ??
                "Select"
              }
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="rounded-xl border border-gray-200 shadow-md bg-white p-0 w-full">
          {gradingOptions.map((item) => (
            <div
              key={item.value}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
              onClick={() => field.onChange(item.value)}
            >
              <span className="text-sm text-gray-800 text-left">{item.label}</span>
              <div className="flex-shrink-0">
                <Checkbox
                  checked={field.value === item.value}
                  className="pointer-events-none"
                />
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  )}
/>
          {/* Scores */}
          <FormField
            control={control}
            name="scores"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Obtained Scores</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree Start Date</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
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

          {/* End Date */}
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree End Date</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
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

          {/* Institution */}
          <FormField
            control={control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </div>
    </div>
  );
}
