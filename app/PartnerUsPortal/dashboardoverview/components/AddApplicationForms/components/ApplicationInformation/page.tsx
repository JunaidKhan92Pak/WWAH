"use client";

import { useEffect } from "react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import WorkExperienceForm from "./components/WorkExperience";
import Languageproficiency from "./components/Languageproficiency";
import Standardizedtest from "./components/Standardizetest";

// ✅ Inline schema
const educationalEntrySchema = z.object({
  highestDegree: z.string().nonempty("Degree is required"),
  subjectName: z.string().nonempty("Subject name is required"),
  institutionAttended: z.string().nonempty("Institution is required"),
  marks: z.string().nonempty("CGPA/Marks are required"),
  degreeStartDate: z
    .string()
    .nonempty("Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start date must be a valid date",
    }),
  degreeEndDate: z
    .string()
    .nonempty("End date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "End date must be a valid date",
    }),
    yearsOfStudy: z.string().nonempty("Years of study is required"),

});

const formSchema = z.object({
  educationalBackground: z.array(educationalEntrySchema).nonempty(),
});

const degrees = [
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Diploma",
  "Certificate",
];

const EducationalBackground: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationalBackground: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "educationalBackground",
    control: form.control,
  });

  useEffect(() => {
    const background = form.getValues("educationalBackground");
    if (!background || background.length === 0) {
      append({
        highestDegree: "",
        subjectName: "",
        institutionAttended: "",
        marks: "",
        degreeStartDate: "",
        degreeEndDate: "",
        yearsOfStudy: "", 

      });
    }
  }, [append, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Submitted Data:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" my-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative mb-4">
            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-base font-semibold text-center text-gray-900 mb-4 border p-4 rounded-md">
              Education Background {index + 1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Highest Degree */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.highestDegree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Degree</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
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

              {/* Subject Name */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.subjectName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input {...field}
                                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                       placeholder="Write..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Institution Attended */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.institutionAttended`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Attended</FormLabel>
                    <FormControl>
                      <Input {...field} 
                                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                      placeholder="Write..." />
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
                  <FormItem >
                    <FormLabel>Degree Start Date</FormLabel>
                    <FormControl className="bg-[#f1f1f1] placeholder-[#313131]">
                      <Input
                        type="date"
                        {...field}
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
              {/* Marks */}
              <FormField
                control={form.control}
                name={`educationalBackground.${index}.marks`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA/Marks</FormLabel>
                    <FormControl>
                      <Input {...field}
                                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"

                      placeholder="Write..." />
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
                    <FormControl className="bg-[#f1f1f1] placeholder-[#313131]">
                      <Input
                        type="date"
                        {...field}
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
  name={`educationalBackground.${index}.yearsOfStudy`}
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-nowrap">
        How many years did you study this qualification for?
      </FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {["1", "2", "3", "4", "5", "6", "7+"].map((year) => (
            <SelectItem key={year} value={year}>
              {year} {year === "1" ? "year" : "years"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
                degreeStartDate: "",
                degreeEndDate: "",
                yearsOfStudy: "", 

              })
            }
          >
            <Plus className="w-4 h-11" /> Add Qualification
          </Button>
        </div>
<WorkExperienceForm />
<Languageproficiency />
<Standardizedtest />
        {/* <div className="mt-6 text-center">
          <Button type="submit" className="px-6">
            Submit
          </Button>
        </div> */}
      </form>
    </FormProvider>
  );
};

export default EducationalBackground;
