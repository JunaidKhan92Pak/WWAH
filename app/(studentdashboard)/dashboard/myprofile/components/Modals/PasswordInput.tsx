// 'use client'

// import * as React from 'react'
// import { EyeIcon, EyeOffIcon } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { cn } from '@/lib/utils'

// // Extend InputProps to include showPassword and togglePasswordVisibility
// interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   showPassword: boolean;
//   togglePasswordVisibility: () => void;
// }

// const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, showPassword, togglePasswordVisibility, ...props }, ref) => {
//   const disabled = props.value === '' || props.value === undefined || props.disabled

//   return (
//     <div className="relative">
//       <Input
//         type={showPassword ? 'text' : 'password'}
//         className={cn('hide-password-toggle pr-10', className)}
//         ref={ref}
//         {...props}
//       />
//       <Button
//         type="button"
//         variant="ghost"
//         size="sm"
//         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//         onClick={togglePasswordVisibility}
//         disabled={disabled}
//       >
//         {showPassword && !disabled ? (
//           <EyeIcon className="h-4 w-4" aria-hidden="true" />
//         ) : (
//           <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
//         )}
//         <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
//       </Button>

//       {/* hides browsers password toggles */}
//       <style>{`
//         .hide-password-toggle::-ms-reveal,
//         .hide-password-toggle::-ms-clear {
//           visibility: hidden;
//           pointer-events: none;
//           display: none;
//         }
//       `}</style>
//     </div>
//   )
// })
// PasswordInput.displayName = 'PasswordInput'

// export { PasswordInput }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import { z } from "zod";

// // Define schema for validation
// const passwordSchema = z
//   .object({
//     currentPassword: z.string().min(1, "Current password is required."),
//     newPassword: z
//       .string()
//       .min(8, "New password must be at least 8 characters long."),
//       // .regex(
//       //   /[A-Z]/,
//       //   "New password must contain at least one uppercase letter."
//       // )
//       // .regex(/\d/, "New password must contain at least one number."),
//     confirmPassword: z.string().min(1, "Please confirm your new password."),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "New password and confirm password do not match.",
//     path: ["confirmPassword"],
//   });

// const Password = () => {
//   const [open, setOpen] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false); // Success modal state

//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({
//     currentPassword: "dfd",
//     newPassword: "dfgd",
//     confirmPassword: "dgvgd",
//   });

//   const [storedPassword, setStoredPassword] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("password") || "";
//       setStoredPassword(stored);
//     }
//   }, []);

//   const handleUpdatePassword = () => {
//     const result = passwordSchema.safeParse({
//       currentPassword,
//       newPassword,
//       confirmPassword,
//     });

//     if (!result.success) {
//       const errors: Record<string, string> = {
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       };

//       result.error.errors.forEach((err) => {
//         if (err.path.length > 0 && typeof err.path[0] === "string") {
//           errors[err.path[0]] = err.message;
//         }
//       });

//       setPasswordErrors(errors);
//       return;
//     }

//     // Store the new password
//     setStoredPassword(newPassword);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("password", newPassword);
//     }

//     // Reset state
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setPasswordErrors({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setOpen(false);
//     setSuccessOpen(true); // Show success modal

//     // Auto-close success modal after 3 seconds
//     setTimeout(() => setSuccessOpen(false), 3000);
//   };

//   return (
//     <>
//       <div className="flex flex-col items-start">
//         <p className="text-gray-600 text-base">Password:</p>
//         <div className="flex items-center"></div>
//         <div className="flex flex-row items-center gap-x-2">
//           <Image
//             src="/DashboardPage/key.svg"
//             alt="Icon"
//             width={18}
//             height={18}
//           />
//           <p className="text-sm">Last updated on 21st Sep, 2024</p>
//           <Image
//             src="/DashboardPage/pen.svg"
//             alt="Edit"
//             width={18}
//             height={18}
//             className="cursor-pointer"
//             onClick={() => setOpen(true)}
//           />
//         </div>
//       </div>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Update Password</DialogTitle>
//             <p className="text-sm text-gray-500">
//               You can change your password once in 20 days.
//             </p>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Current Password</Label>
//               <div className="relative">
//                 <Input
//                   type={passwordVisible ? "text" : "password"}
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 -translate-y-1/2"
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                 >
//                   {passwordVisible ? (
//                     <EyeIcon className="h-4 w-4" />
//                   ) : (
//                     <EyeOffIcon className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//               {passwordErrors.currentPassword && (
//                 <p className="text-red-600 text-sm">
//                   {passwordErrors.currentPassword}
//                 </p>
//               )}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label>New Password</Label>
//                 <div className="relative">
//                   <Input
//                     type={newPasswordVisible ? "text" : "password"}
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-2 top-1/2 -translate-y-1/2"
//                     onClick={() => setNewPasswordVisible(!newPasswordVisible)}
//                   >
//                     {newPasswordVisible ? (
//                       <EyeIcon className="h-4 w-4" />
//                     ) : (
//                       <EyeOffIcon className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//                 {passwordErrors.newPassword && (
//                   <p className="text-red-600 text-sm">
//                     {passwordErrors.newPassword}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Confirm Password</Label>
//                 <div className="relative">
//                   <Input
//                     type={confirmPasswordVisible ? "text" : "password"}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-2 top-1/2 -translate-y-1/2"
//                     onClick={() =>
//                       setConfirmPasswordVisible(!confirmPasswordVisible)
//                     }
//                   >
//                     {confirmPasswordVisible ? (
//                       <EyeIcon className="h-4 w-4" />
//                     ) : (
//                       <EyeOffIcon className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//                 {passwordErrors.confirmPassword && (
//                   <p className="text-red-600 text-sm">
//                     {passwordErrors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <Button
//               onClick={handleUpdatePassword}
//               className="w-full md:w-[30%] bg-[#C7161E]"
//             >
//               Update Password
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       {/* Success Modal */}
//       <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
//         <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
//           <Image
//             src="/DashboardPage/success.svg"
//             alt="Success"
//             width={150}
//             height={150}
//           />
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold text-gray-900">
//               Password Updated Successfully!
//             </DialogTitle>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Password;

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/app/(auth)/auth/authProvider";

// Define schema for validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match.",
    path: ["confirmPassword"],
  });

interface PasswordData {
  updatedAt: string;
}

const Password = ({ data }: { data: PasswordData }) => {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false); // Success modal state

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const { user } = useAuth(); // Get user from auth context
  const userId = user?.id; // Assuming `id` is in user object

  const handleUpdatePassword = async () => {
    const result = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0 && typeof err.path[0] === "string") {
          errors[err.path[0]] = err.message;
        }
      });

      setPasswordErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Reset state after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});

      setOpen(false);
      setSuccessOpen(true); // Show success modal

      setTimeout(() => setSuccessOpen(false), 3000);
    } catch (error: unknown) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-gray-600 text-base">Password:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/key.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            last updated on{" "}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change your password once in 20 days.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-600 text-sm">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={newPasswordVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  >
                    {newPasswordVisible ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-600 text-sm">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleUpdatePassword}
              className="w-full md:w-[30%] bg-[#C7161E]"
            >
              Update Password
            </Button>
          </div>
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
              Password Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Password;
