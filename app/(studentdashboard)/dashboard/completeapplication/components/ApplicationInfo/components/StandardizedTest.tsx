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

import { UseFormReturn } from "react-hook-form";
// import { formSchema } from "../page";
import { z } from "zod";
import { formSchema } from "./Schema";
type FormValues = z.infer<typeof formSchema>;

const StandardizedTest = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <Form {...form}>
      <div className="flex flex-col my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            control={form.control}
            name="standardizedTest"
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
                      {/* <SelectItem value="ielts">IELTS</SelectItem> */}
                      {/* <SelectItem value="toefl">TOEFL</SelectItem> */}
                      <SelectItem value="sat">SAT</SelectItem>
                      <SelectItem value="gre">GRE</SelectItem>
                      <SelectItem value="gmat">GMAT</SelectItem>
                      {/* <SelectItem value="pte">PTE</SelectItem> */}
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
        <div>
          <FormLabel>Sub Score:</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {form.watch("standardizedSubScore", [])?.map((_, index) => (
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
      </div>
    </Form>
  );
};

export default StandardizedTest;
