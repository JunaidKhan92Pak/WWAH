"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  studiedAbroad: z.boolean(),
  notStudiedAbroad: z.boolean(),
  countryName: z.string().optional(),
  institution: z.string().optional(),
  visaType: z.string().optional(),
  expiryDate: z.date().optional(),
  duration: z.string().optional(),
});

const LearningExperienceAbroad = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      studiedAbroad: false,
      notStudiedAbroad: false,
      countryName: "",
      institution: "",
      visaType: "",
      expiryDate: undefined,
      duration: "",
    },
  });

  return (
    <div className="flex flex-col w-full xl:w-[80%] mx-auto my-6">
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Studied Abroad Yes/No Checkboxes */}
            <FormField
              control={form.control}
              name="studiedAbroad"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Have you studied or whether studying in any abroad country currently?
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-start bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                      <Checkbox
                        checked={!!field.value} // Ensure it is always a boolean
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          field.onChange(isChecked);
                          form.setValue("notStudiedAbroad", !isChecked);
                        }}
                      />

                      <span className="ml-2 text-[#313131] font-medium">Yes</span>
                    </div>
                    <div className="flex items-center justify-start bg-[#f1f1f1] rounded-lg py-3 px-4 border">
                      <Checkbox
                        checked={!!form.watch("notStudiedAbroad")}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          form.setValue("notStudiedAbroad", isChecked);
                          form.setValue("studiedAbroad", !isChecked);
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
              name="countryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      disabled={!form.watch("studiedAbroad")}
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
                      disabled={!form.watch("studiedAbroad")}
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
                      disabled={!form.watch("studiedAbroad")}
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
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full text-left font-normal bg-[#f1f1f1] rounded-lg py-3 px-4 border ${!field.value ? "text-[#313131]" : ""}`}
                          disabled={!form.watch("studiedAbroad")}
                        >
                          {field.value ? format(field.value, "yyyy/MM/dd") : <span>YYYY/MM/DD</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration of Studying Abroad */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration of Studying Abroad</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write..."
                      disabled={!form.watch("studiedAbroad")}
                      className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
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

export default LearningExperienceAbroad;
