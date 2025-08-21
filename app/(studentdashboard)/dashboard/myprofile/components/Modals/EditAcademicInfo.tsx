"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Combobox } from "@/components/ui/combobox";
import { majorsAndDisciplines } from "./../../../../../../lib/constant";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserData";

const formSchema = z.object({
  qualification: z.string().min(1, { message: "Qualification is required" }),
  majorSubject: z.string().min(1, { message: "Major Subject is required" }),
  // gradingScale: z.string().min(1, { message: "Major Subject is required" }),
  gradeType: z.string().min(1, { message: "Field of study is required" }),
  grade: z.string().optional(), // <-- Ensure it's part of the schema
});
interface ApiLanguageProficiency {
  test: string;
  score: string;
}

interface ApiStudyPreference {
  country: string;
  degree: string;
  subject: string;
}
export interface detailedInfo {
  studyLevel: string;
  gradeType: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: {
    amount: number;
    currency: string;
  };
  tuitionFee: {
    amount: number;
    currency: string;
  };
  languageProficiency: ApiLanguageProficiency;
  workExperience: number;
  studyPreferenced: ApiStudyPreference;
  updatedAt: string;
}

const EditAcademicInfo = ({ data }: { data: detailedInfo }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { updateDetailedInfo } = useUserStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qualification: `${data?.studyLevel}`,
      majorSubject: `${data?.majorSubject}`,
      gradeType: `${data?.gradeType}`,
      grade: data?.grade?.toString() || "",
      // fieldofstudy: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("Submitting:", values); // Debugging
    const gradeScore = Number(values.grade);
    const apiData = {
      studyLevel: values.qualification,
      majorSubject: values.majorSubject,
      grade: gradeScore, // This should be the correct field name
      gradeType: values.gradeType,
    };
    try {
      const response = await updateDetailedInfo(apiData);

      console.log(
        response,
        "response from updateUserProfile in EditAcademicInfo"
      );
      if (response !== undefined) {
        setOpen(false);
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
        }, 2000); // Close after 2 seconds
      }
      // Handle success response here (e.g., show a success message)
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const [selectedScale, setSelectedScale] = useState("");

  return (
    <>
      {/* Academic Information */}
      <div className="flex flex-col items-start space-y-2">
        <p className="text-gray-600 text-base">Academic Information:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/academic-cap.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            Last updated on{" "}
            {new Date(data?.updatedAt).toLocaleDateString("en-GB")}
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Academic Info</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Qualification */}
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your current level of study?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm">
                          <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matric">Matric</SelectItem>
                          <SelectItem value="O Levels">O Levels</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="A Levels">A Levels</SelectItem>
                          <SelectItem value="Bachelors">Bachelors</SelectItem>
                          <SelectItem value="Masters">Master</SelectItem>
                          <SelectItem value="MPhil">MPhil</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Any Other">
                            Any Other (Specify)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {/* MAjor or Field of Study */}
                <FormField
                  control={form.control}
                  name="majorSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What is your Major or field of study?
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={majorsAndDisciplines}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select your major or field"
                          emptyMessage="No majors found"
                          className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* Standardized Test */}
              <FormField
                control={form.control}
                name="gradeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Obtained Grades/CGPA in your previous study?
                    </FormLabel>

                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedScale(value); // Save selected value
                      }}
                      value={field.value || ""} // Ensure it defaults to empty string when no value is selected
                    >
                      <SelectTrigger className="bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm w-full flex justify-between items-center">
                        <SelectValue>
                          {/* Display default text when no value is selected */}
                          {field.value === "" || !field.value
                            ? "Select an option"
                            : field.value === "percentage"
                            ? "Percentage Grade scale"
                            : field.value === "cgpa"
                            ? "Grade Point Average (GPA) Scale"
                            : field.value === "letter"
                            ? "Letter Grade Scale (A-F)"
                            : field.value === "passfail"
                            ? "Pass/Fail"
                            : field.value === "other"
                            ? "Any other (Specify)"
                            : "Select an option"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="percentage">
                          Percentage Grade scale
                        </SelectItem>
                        <SelectItem value="cgpa">
                          Grade Point Average (GPA) Scale
                        </SelectItem>
                        <SelectItem value="letter">
                          Letter Grade Scale (A-F)
                        </SelectItem>
                        <SelectItem value="passfail">Pass/Fail</SelectItem>
                        <SelectItem value="other">
                          Any other (Specify)
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* ✅ Show input for ANY selected option */}
                    {selectedScale && (
                      <Input
                        className="mt-2"
                        placeholder="Enter your grades/CGPA"
                        {...form.register("grade")}
                      />
                    )}
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <Button type="submit" className="w-full md:w-[45%] bg-[#C7161E]">
                Update Academic Information
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center  max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Academic Info Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAcademicInfo;
