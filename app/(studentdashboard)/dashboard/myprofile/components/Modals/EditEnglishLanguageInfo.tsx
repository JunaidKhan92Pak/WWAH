"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
    proficiencyLevel: z.enum(["native", "fluent", "intermediate", "beginner"], { message: "Select a valid proficiency level" }),
    testType: z.enum(["ielts", "toefl", "pte", "none"], { message: "Select a valid test type" }),
    score: z.string().optional().or(z.literal("")), // Allows an empty string
});


const EditEnglishLanguageInfo = () => {
    const [open, setOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: formSchema.parse({
            proficiencyLevel: "native",
            testType: "ielts",
        }),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setOpen(false);

        // Show success modal
        setTimeout(() => {
            setSuccessOpen(true);
        }, 300);
    }

    return (
      <>
        <div className="flex flex-col items-start space-y-4">
          <p className="text-gray-600 text-base">
            English Language Proficiency:
          </p>
          <div className="flex flex-row items-center gap-x-2">
            <Image
              src="/DashboardPage/microphone.svg"
              alt="Icon"
              width={18}
              height={18}
            />
            <p className="text-sm">Last updated on 21st Sep, 2024</p>
            <Image
              src="/DashboardPage/pen.svg"
              alt="Edit"
              width={18}
              height={18}
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[600px] max-h-[85vh] justify-center">
            <DialogHeader>
              <DialogTitle>Edit English Language Info</DialogTitle>
              <p className="text-sm text-gray-500">
                You can change this information once in 20 days.
              </p>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                  <FormField
                    name="proficiencyLevel"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          What is your English proficiency level?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="native speaker">
                              Native Speaker
                            </SelectItem>
                            <SelectItem value="test">
                              Completed a test
                            </SelectItem>
                            <SelectItem value="willingToTest">
                              Willing to take a test
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="testType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Which English proficiency test have you taken?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                            <SelectValue placeholder="Select test" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IELTS">IELTS</SelectItem>
                            <SelectItem value="PTE">PTE</SelectItem>
                            <SelectItem value="TOEFL">TOEFL</SelectItem>
                            <SelectItem value="DUOLINGO">DUOLINGO</SelectItem>
                            <SelectItem value="Language Cert">
                              Language Cert
                            </SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="score"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Scores</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter score"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full md:w-[50%] bg-[#C7161E]"
                >
                  Update English Language Information
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {/* Success Modal */}
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
            <Image
              src="/DashboardPage/success.svg"
              alt="Success"
              width={150}
              height={150}
            />
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                English Language Info Updated Successfully!
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
};

export default EditEnglishLanguageInfo;
