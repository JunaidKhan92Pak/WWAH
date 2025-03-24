"use client";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { formSchema } from "./Schema";
import { UseFormReturn } from "react-hook-form";
type FormValues = z.infer<typeof formSchema>;
const LearningExperienceAbroad = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Studied Abroad Yes/No Checkboxes */}
        <FormField
          control={form.control}
          name="hasStudiedAbroad"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                Have you studied or whether studying in any abroad country
                currently?
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-start bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                  <Checkbox
                    checked={!!field.value} // Ensure it is always a boolean
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      field.onChange(isChecked);
                      form.setValue("hasStudiedAbroad", isChecked);
                    }}
                  />
                  <span className="ml-2 text-[#313131] font-medium">Yes</span>
                </div>
                <div className="flex items-center justify-start bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                  <Checkbox
                    checked={!form.watch("hasStudiedAbroad")}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      form.setValue("hasStudiedAbroad", !isChecked);
                    }}
                  />
                  <span className="ml-2 text-[#313131] font-medium">No</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Country Name */}
        <FormField
          control={form.control}
          name="visitedCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Write..."
                  disabled={!form.watch("hasStudiedAbroad")}
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Institution */}
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution You Have Attended</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Write..."
                  disabled={!form.watch("hasStudiedAbroad")}
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Visa Type */}
        <FormField
          control={form.control}
          name="visaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visa Type</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Write..."
                  disabled={!form.watch("hasStudiedAbroad")}
                  className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expiry Date */}
        <FormField
          control={form.control}
          name="visaExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="date"
                // value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                // onChange={field.onChange}
                value={
                  field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""
                }
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration of Studying Abroad */}
        <FormField
          control={form.control}
          name="durationOfStudyAbroad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration of Studying Abroad</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Write..."
                  disabled={!form.watch("hasStudiedAbroad")}
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

export default LearningExperienceAbroad;
