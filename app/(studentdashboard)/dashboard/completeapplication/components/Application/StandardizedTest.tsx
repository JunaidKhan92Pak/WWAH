"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

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

const formSchema = z.object({
  standardizedtest: z
    .string()
    .min(1, { message: "Please select a standardized test." })
    .refine(
      (val) =>
        ["ielts", "toefl", "sat", "gre", "gmat", "pte", "none"].includes(val),
      {
        message: "Invalid selection",
      }
    ),
  overallScore: z
    .string()
    .min(1, { message: "Overall Score is required." })
    .refine((val) => /^[0-9]+(\.[0-9]*)?$/.test(val), {
      message: "Please enter a valid numeric score.",
    }),
  subScores: z
    .array(
      z
        .string()
        .min(1, { message: "Sub Score is required." })
        .refine((val) => /^[0-9]+(\.[0-9]*)?$/.test(val), {
          message: "Please enter a valid numeric score.",
        })
    )
    .length(4, { message: "Exactly four sub-scores are required." }),
});

const StandardizedTest = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standardizedtest: "",
      overallScore: "",
      subScores: ["", "", "", ""],
    },
  });

  return (
    <div className="flex flex-col my-4">
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              control={form.control}
              name="standardizedtest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which Standardized Test Have You Taken?</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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

            <FormField
              control={form.control}
              name="overallScore"
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

          <div>
            <FormLabel>Sub Score:</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {form.watch("subScores").map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`subScores.${index}` as const}
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
        </form>
      </Form>
      <div className="text-right mt-4">
        <Button
          type="submit"
          className="w-1/3 sm:w-1/4 bg-red-600 hover:bg-red-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default StandardizedTest;
