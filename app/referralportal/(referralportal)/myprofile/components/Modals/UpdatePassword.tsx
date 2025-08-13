// "use client"
// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// // import { PasswordInput } from "./PasswordInput";
// import { Label } from "@/components/ui/label";
// import { EyeIcon, EyeOffIcon } from 'lucide-react';
// import { z } from "zod";
// import Password from "./PasswordInput";

// // Define schema for validation
// const passwordSchema = z.object({
//     currentPassword: z.string().min(1, "Current password is required."),
//     newPassword: z
//         .string()
//         .min(8, "New password must be at least 8 characters long."),
//         // .regex(/[A-Z]/, "New password must contain at least one uppercase letter.")
//         // .regex(/\d/, "New password must contain at least one number."),
//     confirmPassword: z.string().min(1, "Please confirm your new password."),
// }).refine(data => data.newPassword === data.confirmPassword, {
//     message: "New password and confirm password do not match.",
//     path: ["confirmPassword"],
// });

// const UpdatePassword = ({ password }) => {
//   const [open, setOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordErrors, setPasswordErrors] = useState({
//     currentPassword: "dfd",
//     newPassword: "dfgd",
//     confirmPassword: "dgvgd",
//   });

//   const [storedPassword, setStoredPassword] = useState("");

//   // Check if window is available (for client-side rendering)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("password");
//       setStoredPassword(stored || "");
//     }
//   }, []);

//   const handleUpdatePassword = () => {
//     const result = passwordSchema.safeParse({
//       currentPassword,
//       newPassword,
//       confirmPassword,
//     });

//     if (!result.success) {
//       const errors = {
//         currentPassword: "fdf",
//         newPassword: "fd",
//         confirmPassword: "dg",
//       };

//       result.error.errors.forEach((err) => {
//         if (err.path[0] === "currentPassword") {
//           errors.currentPassword = err.message;
//         } else if (err.path[0] === "newPassword") {
//           errors.newPassword = err.message;
//         } else if (err.path[0] === "confirmPassword") {
//           errors.confirmPassword = err.message;
//         }
//       });

//       setPasswordErrors(errors);
//       return;
//     }

//     setStoredPassword(newPassword);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("password", newPassword);
//     }

//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");

//     setOpen(false);
//     setTimeout(() => setConfirmOpen(true), 300);
//   };
// console.log(password)
//   return (
//     <>
//       {/* Password Info Section */}
//       <div className="flex flex-col items-start">
//         <p className="text-gray-600 text-base">Password:</p>
//         <div className="flex items-center">
//           <span className="text-sm relative">
//             {passwordVisible
//               ? storedPassword
//               : "*".repeat(storedPassword.length)}
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               className="hover:bg-transparent hover:text-inherit focus:ring-0"
//               onClick={() => setPasswordVisible((prev) => !prev)}
//             >
//               {passwordVisible ? (
//                 <EyeIcon className="h-4 w-4" aria-hidden="true" />
//               ) : (
//                 <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
//               )}
//               <span className="sr-only">
//                 {passwordVisible ? "Hide password" : "Show password"}
//               </span>
//             </Button>
//           </span>
//         </div>
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

//       {/* Update Password Modal */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="!rounded-2xl  max-w-[300px] md:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Update Password</DialogTitle>
//             <p className="text-sm text-gray-500">
//               You can change your password once in 20 days.
//             </p>
//           </DialogHeader>

//           {/* Password Fields */}
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="current_password">Current Password</Label>
//               <Password
//                 id="current_password"
//                 value={currentPassword}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   setCurrentPassword(e.target.value)
//                 }
//                 autoComplete="current-password"
//                 showPassword={passwordVisible} // Pass the showPassword prop
//                 togglePasswordVisibility={() =>
//                   setPasswordVisible((prev) => !prev)
//                 } // Pass the togglePasswordVisibility prop
//               />

//               {passwordErrors.currentPassword && (
//                 <p className="text-red-600 text-sm">
//                   {passwordErrors.currentPassword}
//                 </p>
//               )}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               <div>
//                 <Label htmlFor="password">New Password</Label>
//                 <PasswordInput
//                   id="password"
//                   value={newPassword}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     setNewPassword(e.target.value)
//                   }
//                   autoComplete="new-password"
//                   showPassword={newPasswordVisible}
//                   togglePasswordVisibility={() =>
//                     setNewPasswordVisible((prev) => !prev)
//                   }
//                 />
//                 {passwordErrors.newPassword && (
//                   <p className="text-red-600 text-sm">
//                     {passwordErrors.newPassword}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="password_confirmation">Confirm Password</Label>
//                 <PasswordInput
//                   id="password_confirmation"
//                   value={confirmPassword}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     setConfirmPassword(e.target.value)
//                   }
//                   autoComplete="new-password"
//                   showPassword={confirmPasswordVisible}
//                   togglePasswordVisibility={() =>
//                     setConfirmPasswordVisible((prev) => !prev)
//                   }
//                 />
//                 {passwordErrors.confirmPassword && (
//                   <p className="text-red-600 text-sm">
//                     {passwordErrors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <Button
//               onClick={handleUpdatePassword}
//               className="w-full md:w-[30%] bg-[#C7161E]"
//             >
//               Update Password
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Modal */}
//       <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
//         <DialogContent className="flex flex-col justify-center items-center  max-w-72 md:max-w-96 !rounded-3xl">
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

// export default UpdatePassword;
