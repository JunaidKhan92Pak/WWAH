"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  hasWorkExperience: z.boolean(),
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  employmentType: z.enum(["full-time", "part-time"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type WorkExperienceFormValues = z.infer<typeof formSchema>;

export function WorkExperienceForm() {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasWorkExperience: false,
    },
  });

  const watchHasExperience = form.watch("hasWorkExperience");

  return (
    <div className="">
      <h2 className="text-center text-xl font-semibold mb-4 mt-6">
        Work Experience
      </h2>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="hasWorkExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student have any work experience?</FormLabel>
                <div className="flex gap-3 mt-2">
                  <FormControl>
                    <div className="flex items-center gap-2 bg-[#f1f1f1] rounded-lg border  px-4 py-2 w-full">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(true)}
                      />
                      <span>Yes</span>
                    </div>
                  </FormControl>
                  <FormControl>
                    <div className="flex items-center gap-2 bg-[#f1f1f1] rounded-lg border  px-4 py-2 w-full">
                      <Checkbox
                        checked={!field.value}
                        onCheckedChange={() => field.onChange(false)}
                      />
                      <span>No</span>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {watchHasExperience && (
            <>
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write..."
                        className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Write..."
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-[#f1f1f1] rounded-lg border  px-4 py-2 w-full">
                          <Checkbox
                            checked={field.value === "full-time"}
                            onCheckedChange={() => field.onChange("full-time")}
                          />
                          <span>Full Time</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#f1f1f1] rounded-lg border  px-4 py-2 w-full">
                          <Checkbox
                            checked={field.value === "part-time"}
                            onCheckedChange={() => field.onChange("part-time")}
                          />
                          <span>Part Time</span>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                          type="date"
                          placeholder="YYYY/MM/DD"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                          type="date"
                          placeholder="YYYY/MM/DD"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
