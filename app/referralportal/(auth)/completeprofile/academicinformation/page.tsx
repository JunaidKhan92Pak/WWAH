"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Step2 = () => {
  const router = useRouter();
  const [academicInfo, setAcademicInfo] = useState({
    currentDegree: "",
    program: "",
    uniName: "",
    currentSemester: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAcademicInfo({ ...academicInfo, [name]: value });
    console.log(value);
  };

  // Handler for Select components
  const handleSelectChange = (field: string, value: string) => {
    setAcademicInfo({ ...academicInfo, [field]: value });
    console.log(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/academicInformation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(academicInfo),
        }
      );
      const res = await response.json();
      console.log(res);
      router.push("/referralportal/completeprofile/academicinformation");
    } catch (error) {
      console.log(`There Is Some Error ${error}`);
    }
  };

  return (
    <div className="w-full">
      <section>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Degree */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="degree">Degree (Currently Enrolled in)</Label>
            <Select
              value={academicInfo.currentDegree}
              onValueChange={(value) =>
                handleSelectChange("currentDegree", value)
              }
            >
              <SelectTrigger id="degree" className="bg-gray-50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelors">Bachelors</SelectItem>
                <SelectItem value="masters">Masters</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Program */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="program">Program</Label>
            <Input
              id="program"
              name="program"
              placeholder="Write...."
              className="bg-gray-50"
              onChange={handleChange}
              value={academicInfo.program}
            />
          </div>

          {/* University Name */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="university">University Name</Label>
            <Input
              id="university"
              name="uniName"
              placeholder="Write...."
              className="bg-gray-50"
              onChange={handleChange}
              value={academicInfo.uniName}
            />      
          </div>

          {/* Current Semester */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="semester">Current Semester</Label>
            <Select
              value={academicInfo.currentSemester}
              onValueChange={(value) =>
                handleSelectChange("currentSemester", value)
              }
            >
              <SelectTrigger id="semester" className="bg-gray-50">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={`semester-${sem}`}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-left">
            <Button
              type="submit"
              size={"lg"}
              className="py- mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Continue
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Step2;
