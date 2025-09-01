// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { getAuthToken } from "@/utils/authHelper";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const Step2 = () => {
//   const router = useRouter();
//   const [academicInfo, setAcademicInfo] = useState({
//     currentDegree: "",
//     program: "",
//     uniName: "",
//     currentSemester: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setAcademicInfo({ ...academicInfo, [name]: value });
//     console.log(value);
//   };

//   // Handler for Select components
//   const handleSelectChange = (field: string, value: string) => {
//     setAcademicInfo({ ...academicInfo, [field]: value });
//     console.log(value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const token = getAuthToken();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/academicInformation`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(academicInfo),
//         }
//       );
//       const res = await response.json();
//       console.log(res);
//       router.push("/referralportal/completeprofile/workexperience");
//     } catch (error) {
//       console.log(`There Is Some Error ${error}`);
//     }
//   };

//   return (
//     <div className="w-full">
//       <section>
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* Degree */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="degree">Degree (Currently Enrolled in)</Label>
//             <Select
//               value={academicInfo.currentDegree}
//               onValueChange={(value) =>
//                 handleSelectChange("currentDegree", value)
//               }
//             >
//               <SelectTrigger id="degree" className="bg-gray-50">
//                 <SelectValue placeholder="Select" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="bachelors">Bachelors</SelectItem>
//                 <SelectItem value="masters">Masters</SelectItem>
//                 <SelectItem value="phd">PhD</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Program */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="program">Program</Label>
//             <Input
//               id="program"
//               name="program"
//               placeholder="Write...."
//               className="bg-gray-50"
//               onChange={handleChange}
//               value={academicInfo.program}
//             />
//           </div>

//           {/* University Name */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="university">University Name</Label>
//             <Input
//               id="university"
//               name="uniName"
//               placeholder="Write...."
//               className="bg-gray-50"
//               onChange={handleChange}
//               value={academicInfo.uniName}
//             />      
//           </div>

//           {/* Current Semester */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="semester">Current Semester</Label>
//             <Select
//               value={academicInfo.currentSemester}
//               onValueChange={(value) =>
//                 handleSelectChange("currentSemester", value)
//               }
//             >
//               <SelectTrigger id="semester" className="bg-gray-50">
//                 <SelectValue placeholder="Select" />
//               </SelectTrigger>
//               <SelectContent>
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
//                   <SelectItem key={sem} value={`semester-${sem}`}>
//                     {sem}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="text-left">
//             <Button
//               type="submit"
//               size={"lg"}
//               className="py- mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
//             >
//               Continue
//             </Button>
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default Step2;
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
import { z } from "zod";

// Zod validation schema for all fields
const validationSchema = z.object({
  currentDegree: z.string().min(1, "Degree is required"),
  program: z.string().min(1, "Program is required"),
  uniName: z.string().min(1, "University name is required"),
  currentSemester: z.string().min(1, "Current semester is required"),
});

const Step2 = () => {
  const router = useRouter();
  const [academicInfo, setAcademicInfo] = useState({
    currentDegree: "",
    program: "",
    uniName: "",
    currentSemester: "",
  });

  const [errors, setErrors] = useState<{
    currentDegree?: string;
    program?: string;
    uniName?: string;
    currentSemester?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAcademicInfo({ ...academicInfo, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }

    console.log(value);
  };

  // Handler for Select components
  const handleSelectChange = (field: string, value: string) => {
    setAcademicInfo({ ...academicInfo, [field]: value });

    // Clear error when user selects value
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }

    console.log(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    try {
      validationSchema.parse(academicInfo);

      // Clear errors if validation passes
      setErrors({});

      // Proceed with API call
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
        router.push("/referralportal/completeprofile/workexperience");
      } catch (apiError) {
        console.log(`There Is Some Error ${apiError}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors - prevent form submission
        const newErrors: {
          currentDegree?: string;
          program?: string;
          uniName?: string;
          currentSemester?: string;
        } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        setErrors(newErrors);
        // Don't proceed with API call if validation fails
        return;
      }
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
              <SelectTrigger
                id="degree"
                className={`bg-gray-50 ${
                  errors.currentDegree ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelors">Intermediate</SelectItem>
                <SelectItem value="bachelors">Bachelors</SelectItem>
                <SelectItem value="masters">Masters</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
            {errors.currentDegree && (
              <span className="text-red-500 text-xs">
                {errors.currentDegree}
              </span>
            )}
          </div>

          {/* Program */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="program">Program</Label>
            <Input
              id="program"
              name="program"
              placeholder="Write...."
              className={`bg-gray-50 ${errors.program ? "border-red-500" : ""}`}
              onChange={handleChange}
              value={academicInfo.program}
            />
            {errors.program && (
              <span className="text-red-500 text-xs">{errors.program}</span>
            )}
          </div>

          {/* University Name */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="university">University Name</Label>
            <Input
              id="university"
              name="uniName"
              placeholder="Write...."
              className={`bg-gray-50 ${errors.uniName ? "border-red-500" : ""}`}
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
              <SelectTrigger
                id="semester"
                className={`bg-gray-50 ${
                  errors.currentSemester ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                  <SelectItem key={sem} value={`semester-${sem}`}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currentSemester && (
              <span className="text-red-500 text-xs">
                {errors.currentSemester}
              </span>
            )}
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