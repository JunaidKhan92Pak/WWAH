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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type FormValues = z.infer<typeof formSchema>;
import countries from "world-countries";
const LearningExperienceAbroad = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const hasStudiedAbroad = form.watch("hasStudiedAbroad");
  const countryOptions = countries.map((c) => ({
    label: c.name.common,
    value: c.cca2,
    id: c.cca3,
  }));
  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hasStudiedAbroad"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                Have you studied or are you currently studying in any abroad
                country?
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      field.onChange(isChecked);
                    }}
                  />
                  <span className="ml-2 text-[#313131] font-medium">Yes</span>
                </div>
                <div className="flex items-center bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                  <Checkbox
                    checked={!field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      if (isChecked) {
                        form.setValue("hasStudiedAbroad", false);
                        // Clear related fields
                        form.setValue("visitedCountry", "");
                        form.setValue("institution", "");
                        form.setValue("visaType", "");
                        form.setValue("visaExpiryDate", undefined);
                        form.setValue("durationOfStudyAbroad", "");
                      }
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

      {hasStudiedAbroad && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <FormField
            control={form.control}
            name="visitedCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Residence:</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {countryOptions.map((option) => (
                      <SelectItem key={option.id} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="visitedCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write..."
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visaExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa Expiry Date</FormLabel>
                <Input
                  type="date"
                  className="bg-[#f1f1f1]"
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
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationOfStudyAbroad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration of Studying Abroad</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm rounded-lg border px-3 py-2 w-full"
                  >
                    <option value="" disabled>
                      Select duration
                    </option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
      )}
    </div>
  );
};

export default LearningExperienceAbroad;
