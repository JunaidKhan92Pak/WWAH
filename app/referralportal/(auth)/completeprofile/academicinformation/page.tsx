"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AcademicInformation = () => {
  return (
    <div className="w-full">
      <section>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Degree */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="degree">Degree (Currently Enrolled in)</Label>
            <Select>
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
              placeholder="Write...."
              className="bg-gray-50"
            />
          </div>

          {/* University Name */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="university">University Name</Label>
            <Input
              id="university"
              placeholder="Write...."
              className="bg-gray-50"
            />
          </div>

          {/* Current Semester */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="semester">Current Semester</Label>
            <Select>
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
        </form>
        <div className="text-left">
          <Button
            type="submit"
            size={"lg"}
            className="py- mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
          >
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AcademicInformation;
