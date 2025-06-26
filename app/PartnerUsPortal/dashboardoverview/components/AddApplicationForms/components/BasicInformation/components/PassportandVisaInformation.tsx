"use client";

import { useFormContext, useWatch } from "react-hook-form";
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

const PassportandVisaInformation = () => {
  const { control, setValue } = useFormContext();
  const hasPassport = useWatch({ control, name: "hasPassport" });

  return (
    <div className="my-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
        Passport & Visa Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Has Passport Field */}
        <FormField
          control={control}
          name="hasPassport"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center bg-[#f1f1f1] pl-6 rounded-lg  border">
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={() => {
                      field.onChange(true);
                      setValue("noPassport", false);
                    }}
                  />
                  <Input
                    type="text"
                    value="I have a passport"
                    readOnly
                    className="bg-transparent text-[#313131] border-none focus:ring-0 flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* No Passport Field */}
        <FormField
          control={control}
          name="noPassport"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center bg-[#f1f1f1] pl-6 rounded-lg border">
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={() => {
                      field.onChange(true);
                      setValue("hasPassport", false);
                      setValue("passportNumber", "");
                      setValue("passportExpiryDate", undefined);
                      setValue("oldPassportNumber", "");
                      setValue("oldPassportExpiryDate", undefined);
                    }}
                  />
                  <Input
                    type="text"
                    value="I don’t have a passport"
                    readOnly
                    className="bg-transparent text-[#313131] border-none focus:ring-0 flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditionally show passport fields */}
        {hasPassport && (
          <>
            <FormField
              control={control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport No.</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      className="bg-[#f1f1f1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="passportExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Expiry Date</FormLabel>
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
              control={control}
              name="oldPassportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport No.</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      className="bg-[#f1f1f1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="oldPassportExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport Expiry Date</FormLabel>
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

export default PassportandVisaInformation;
