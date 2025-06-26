"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ Inline Zod Schema
const formSchema = z.object({
  standardizedTest: z.string().min(1, { message: "Test is required" }),
  standardizedOverallScore: z
    .string()
    .min(1, { message: "Overall score is required" })
    .refine(val => !isNaN(Number(val)), { message: "Must be a number" }),
  standardizedSubScore: z
    .array(
      z
        .string()
        .min(1, { message: "Required" })
        .refine(val => !isNaN(Number(val)), { message: "Must be a number" })
    )
    .min(1, { message: "At least one sub-score is required" }),
});

type FormValues = z.infer<typeof formSchema>;

// ✅ Component
const Standardizedtest = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standardizedTest: "",
      standardizedOverallScore: "",
      standardizedSubScore: ["", "", "", ""],
    },
  });

//   const onSubmit = (data: FormValues) => {
//     console.log("Submitted data:", data);
//   };

  return (
    <Form {...form}>
      <form>
        
            <h2 className="text-xl font-semibold my-6 text-center">
                Standardized Test
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          {/* Standardized Test Selection */}
          <FormField
            control={form.control}
            name="standardizedTest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which Standardized Test Have You Taken?</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#f1f1f1]">
                      <SelectValue placeholder="Select a test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="toefl">TOEFL</SelectItem>
                      <SelectItem value="sat">SAT</SelectItem>
                      <SelectItem value="gre">GRE</SelectItem>
                      <SelectItem value="gmat">GMAT</SelectItem>
                      <SelectItem value="pte">PTE</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Overall Score */}
          <FormField
            control={form.control}
            name="standardizedOverallScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Score:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
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

        {/* Subscores */}
        <div className="pt-3">
          <FormLabel>Sub Score:</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {form.watch("standardizedSubScore", []).map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`standardizedSubScore.${index}` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Write..."
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* <Button type="submit" className="w-fit mt-4">
          Submit
        </Button> */}
      </form>
    </Form>
  );
};

export default Standardizedtest;
