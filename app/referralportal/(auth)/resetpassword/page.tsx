"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Link from "next/link";
import { PiKeyLight } from "react-icons/pi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const resetToken = searchParams.get("token") || "";

  // Validate URL parameters on component mount
  useEffect(() => {
    if (!email || !resetToken) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please start the password reset process again.",
      });
    }
  }, [email, resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (!email || !resetToken) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please start the process again.",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Sending password reset request...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/resetpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            resetToken,
            newPassword: password,
          }),
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("Password reset response:", result);

      if (!response.ok) {
        setMessage({
          type: "error",
          text: result.message || "Failed to reset password. Please try again.",
        });
        return;
      }

      // Success - show modal and clear form
      setMessage({
        type: "success",
        text: result.message || "Your password has been reset successfully.",
      });
      setPassword("");
      setConfirmPassword("");
      setOpen(true);

      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/referralportal/signin");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[50%]">
        <div className="w-[90%] lg:w-[60%]">
          <div className="flex justify-center items-center mb-2">
            <Link href="/">
              <Image
                src="/logowwah.svg"
                alt="WWAH Logo"
                width={200}
                height={100}
              />
            </Link>
          </div>

          <h3 className="font-bold text-center text-gray-900 mb-2">
            Reset Password
          </h3>
          <p className="text-center text-gray-600 mb-5">
            Please enter your new password to secure your account.
          </p>

          {/* Email Display */}
          {email && (
            <div className="text-center mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Resetting password for:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PiKeyLight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base"
                  placeholder="Enter new password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                  disabled={loading}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="text-xl" />
                  ) : (
                    <HiOutlineEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PiKeyLight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg z-10" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <HiOutlineEyeOff className="text-xl" />
                  ) : (
                    <HiOutlineEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`p-3 rounded-lg text-center text-sm ${
                  message.type === "error"
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-green-100 border border-green-400 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !resetToken}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting Password...
                </>
              ) : (
                "Reset My Password"
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="text-center mt-6 space-y-2">
            <div>
              <Link
                href="/referralportal/signin"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to Sign In
              </Link>
            </div>
            <div>
              <Link
                href="/referralportal/forget"
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Start password reset again
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex justify-center md:w-[50%]">
        <div className="relative xl:w-[100%] xl:h-[100%] h-[95%] w-[100%]">
          <Image
            src="/Group.png"
            alt="Decorative"
            layout="fill"
            className="object-cover rounded-3xl p-1"
          />
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-80 !rounded-3xl">
          <div className="text-center">
            <Image
              src="/DashboardPage/success.svg"
              alt="Success"
              width={150}
              height={150}
            />
            <DialogHeader>
              <DialogTitle className="font-normal text-center mt-4">
                Password Reset Successful!
              </DialogTitle>
            </DialogHeader>
            <p className="text-center text-gray-600 text-sm mt-2">
              Your password has been successfully updated.
            </p>
            <p className="text-center text-red-600 text-sm mt-1 font-medium">
              Redirecting to sign in page...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
