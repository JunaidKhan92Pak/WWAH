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
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./Schema";
import { z } from "zod";

type FormValues = z.infer<typeof formSchema>;

const PassportAndVisaForm = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const hasPassport = form.watch("hasPassport");

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Has Passport Field */}
        <FormField
          control={form.control}
          name="hasPassport"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-6 rounded-lg py-0.5 border">
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={() => {
                      field.onChange(true);
                      form.setValue("noPassport", false);
                    }}
                  />
                  <Input
                    type="text"
                    value="I have a passport"
                    readOnly
                    className="bg-transparent text-[#313131] placeholder:text-sm border-none focus:ring-0 flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* No Passport Field */}
        <FormField
          control={form.control}
          name="noPassport"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center bg-[#f1f1f1] pl-6 rounded-lg border">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(!!checked);
                      if (checked) {
                        form.setValue("hasPassport", false);
                        form.setValue("passportNumber", "");
                        form.setValue("passportExpiryDate", undefined);
                        form.setValue("oldPassportNumber", "");
                        form.setValue("oldPassportExpiryDate", undefined);
                      } else {
                        form.setValue("hasPassport", true);
                      }
                    }}
                  />
                  <Input
                    type="text"
                    value="I don’t have a passport"
                    readOnly
                    className="bg-transparent text-[#313131] border-none focus:ring-0 flex-1 placeholder:text-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show these fields only if hasPassport is true */}
        {hasPassport && (
          <>
            {/* Passport Number */}
            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport No.</FormLabel>
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

            {/* Passport Expiry Date */}
            <FormField
              control={form.control}
              name="passportExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Expiry Date</FormLabel>
                  <Input
                    type="date"
                    className="bg-[#f1f1f1]"
                    min={format(new Date(), "yyyy-MM-dd")}   // 👈 disables past dates
                    value={
                      field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""
                    }
                    onChange={(e) =>
                      field.onChange(e.target.value ? new Date(e.target.value) : null)
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Old Passport Number */}
            <FormField
              control={form.control}
              name="oldPassportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport No.</FormLabel>
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

            {/* Old Passport Expiry Date */}
            <FormField
              control={form.control}
              name="oldPassportExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport Expiry Date:</FormLabel>
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
          </>
        )}
      </div>
    </div>
  );
};

export default PassportAndVisaForm;
