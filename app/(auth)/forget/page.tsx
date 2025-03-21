"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/authProvider";
import { z } from "zod";
import { IoMailOutline } from "react-icons/io5";

// Define password validation schema
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const { forgetAction, user } = useAuth(); // Assuming user contains userId
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email address is required." });
      return;
    }

    try {
      const response = await forgetAction(email);
      if (response?.success) {
        setMessage({ type: "success", text: response.message });
        router.push("/verifyotp");
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to send OTP.",
        });
      }
    } catch (error) {
      console.error("Forget password error", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

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
    console.log(passwordErrors, open, successOpen);
    try {
      const response = await fetch("/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id, // Fetch user ID dynamically
          currentPassword,
          newPassword,
        }),
      });

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
      setSuccessOpen(true);

      setTimeout(() => setSuccessOpen(false), 3000);
    } catch (error: unknown) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: (error as Error).message,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] md:h-screen">
      {/* Form Section */}
      <div className="flex-1 max-w-xl px-10 lg:px-20">
        <Image src={Logo} alt="Logo" className="mb-4 w-28 mx-auto" />
        <h2 className="mb-2 text-center">Forget Password</h2>
        <p className="text-gray-600 text-center lg:px-4 mb-6">
          Enter your registered email to receive a password reset OTP.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>

            {/* <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> */}
            <div className="relative">
              {/* <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" /> */}
              <IoMailOutline className="absolute left-3 text-gray-400 text-lg top-1/4" />

              <input
                type="email"
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg mb-3 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Display Message */}
          {message.text && (
            <p
              className={`mb-3 text-center ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            onSubmit={handleUpdatePassword}
            className="w-full bg-red-700 text-white p-2 rounded-lg hover:bg-red-800 transition"
          >
            Send OTP
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center my-2">
          <Image
            src="/Group.png"
            width={400}
            height={400}
            alt="Decorative"
            className="object-contain h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
