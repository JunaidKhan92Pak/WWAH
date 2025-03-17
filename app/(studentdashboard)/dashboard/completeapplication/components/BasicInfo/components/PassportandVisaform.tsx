"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    hasPassport: z.boolean(),
    noPassport: z.boolean(),
    passportno: z.string().optional(),
    oldpassportno: z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Z0-9]+$/.test(val), {
        message: "Old Passport No. must contain only letters and numbers.",
      }),
    passportexpiry: z
      .date()
      .nullable()
      .optional()
      .refine((date) => !date || date > new Date(), {
        message: "Passport expiry date must be a future date.",
      }),
    oldpassportexpiry: z
      .date()
      .nullable()
      .optional()
      .refine((date) => !date || date < new Date(), {
        message: "Old passport expiry date must be in the past.",
      }),
  })
  .superRefine((data, ctx) => {
    if (
      data.hasPassport &&
      (!data.passportno || data.passportno.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passportno"],
        message:
          "Passport number is required when 'I have a passport' is checked.",
      });
    }
  });

const PassportAndVisaForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      hasPassport: false,
      noPassport: false,
      passportno: "",
      passportexpiry: undefined,
    },
  });

  return (
    <div className="my-4">
      <Form {...form}>
        <form className="space-y-6">
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
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.setValue("noPassport", !checked); // Uncheck other field
                          if (!checked) {
                            form.setValue("passportno", ""); // Reset passport number if unchecked
                            form.setValue("passportexpiry", undefined); // Reset expiry date if unchecked
                          }
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
                    <div className="flex items-center bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm pl-6 rounded-lg py-0.5 border">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.setValue("hasPassport", !checked); // Uncheck other field
                        }}
                      />
                      <Input
                        type="text"
                        value="I don’t have a passport"
                        readOnly
                        className="bg-transparent text-[#313131] placeholder:text-sm border-none focus:ring-0 flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passport No. Field (Conditionally Required) */}
            <FormField
              control={form.control}
              name="passportno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport No.</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      disabled={!form.watch("hasPassport")} // Disable if "I have a passport" is unchecked
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passport Expiry Date */}
            <FormField
              control={form.control}
              name="passportexpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Expiry Date</FormLabel>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal bg-[#f1f1f1] ${!field.value ? "text-[#313131]" : ""}`}
                          disabled={!form.watch("hasPassport")}
                        >
                          {field.value ? format(field.value, "yyyy/MM/dd") : <span>YYYY/MM/DD</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}  // Ensure it is Date | undefined, not null
                        onSelect={(date) => field.onChange(date ?? undefined)} // Convert null to undefined
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="bg-[#f1f1f1]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oldpassportno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport No.</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      disabled={!form.watch("hasPassport")} // Disable if "I have a passport" is unchecked
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
              name="oldpassportexpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Passport Expiry Date:</FormLabel>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal bg-[#f1f1f1] ${
                            !field.value ? "text-[#313131]" : ""
                          }`}
                          disabled={!form.watch("hasPassport")}
                        >
                          {field.value ? (
                            format(field.value, "yyyy/MM/dd")
                          ) : (
                            <span>YYYY/MM/DD</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined} // Ensure it is Date | undefined, not null
                        onSelect={(date) => field.onChange(date ?? undefined)} // Convert null to undefined
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="bg-[#f1f1f1]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PassportAndVisaForm;
