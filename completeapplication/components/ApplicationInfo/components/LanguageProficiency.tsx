"use client";
import { UseFormReturn } from "react-hook-form";
import {
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
import { z } from "zod";
import { formSchema } from "./Schema";
type FormValues = z.infer<typeof formSchema>;

const LanguageProficiency = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="flex flex-col  my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        {/* Country Selector */}
        <FormField
          control={form.control}
          name="countryOfStudy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select the Country of study:</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="bg-[#f1f1f1]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proficiencyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your Language Proficiency Level?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="bg-[#f1f1f1]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="native">Native Speaker</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proficiencyTest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Which language proficiency test have you taken?
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-[#f1f1f1]">
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ielts">IELTS</SelectItem>
                    <SelectItem value="toefl">TOEFL</SelectItem>
                    <SelectItem value="pte">PTE</SelectItem>
                    <SelectItem value="duolingo">
                      Duolingo English Test
                    </SelectItem>
                    <SelectItem value="cambridge">
                      Cambridge English Exam
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overAllScore"
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

        <FormField
          control={form.control}
          name="listeningScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Listening:</FormLabel>
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
        <FormField
          control={form.control}
          name="writingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Writing:</FormLabel>
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

        <FormField
          control={form.control}
          name="readingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Reading:</FormLabel>
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

        <FormField
          control={form.control}
          name="speakingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score in Speaking:</FormLabel>
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
    </div>
  );
};

export default LanguageProficiency;
