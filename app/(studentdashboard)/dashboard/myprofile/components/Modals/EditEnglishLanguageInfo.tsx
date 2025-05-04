"use client";
import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  proficiencyLevel: z.enum(
    ["native speaker", "test", "willingToTest", "undefined", ""],
    { message: "Select a valid proficiency level" }
  ),
  testType: z
    .preprocess((val) => typeof val === "string" ? val.toUpperCase() : val,
      z.enum([
        "IELTS",
        "PTE",
        "TOEFL",
        "DUOLINGO",
        "Language Cert",
        "OTHERS",
        "",
        "UNDEFINED",
      ])
    ),
  score: z.string().optional().or(z.literal("")),
});


interface LanguageProficiency {
  test: string;
  score: string;
}

const EditEnglishLanguageInfo = ({
  data,
  updatedAt,
}: {
  data: LanguageProficiency;
  updatedAt: string;
}) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({
      proficiencyLevel: "",
      testType: `${data?.test}` || "",
      score: `${data?.score}` || "",
    }),
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("Submitting:", values); // Debugging

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/updateEnglishProficiency`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Updated successfully:", data);
        setOpen(false);
        setTimeout(() => {
          setSuccessOpen(true);
        }, 300);
      } else {
        console.error("Error updating:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start space-y-2">
        <p className="text-gray-600 text-base">English Language Proficiency:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/microphone.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on{" "}
            {new Date(updatedAt).toLocaleDateString("en-GB")}
          </p>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="native speaker">
                            Native Speaker
                          </SelectItem>
                          <SelectItem value="willingToTest">
                            Willing to take a test
                          </SelectItem>
                          <SelectItem value="test">Completed a test</SelectItem>
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
                        Which of the following English Proficiency tests have
                        you taken?
                      </FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Test" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IELTS">IELTS</SelectItem>
                          <SelectItem value="PTE">PTE</SelectItem>
                          <SelectItem value="TOEFL">TOEFL</SelectItem>

                          <SelectItem value="others">
                            Any others (Specify)
                          </SelectItem>
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
              <Button type="submit" className="w-full md:w-[45%] bg-[#C7161E]">
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
