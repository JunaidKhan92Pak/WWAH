"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Link from "next/link";
import { PiKeyLight } from "react-icons/pi";
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
  const [open, setOpen] = useState(false); // modal state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

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

    setLoading(true);

    // Simulate API call
   setTimeout(() => {
    console.log("Password reset successful!");
    setMessage({
      type: "success",
      text: "Your password has been reset successfully.",
    });
    setPassword("");          //  clear input fields
    setConfirmPassword("");   //  clear input fields
    setLoading(false);
    setOpen(true);            //  show success modal
  }, 2000);
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
          <h3 className=" font-bold text-center text-gray-900 mb-2">
            Reset Password
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Please enter your new password to secure your account.
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password */}
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                {/* Left Icon */}
                <PiKeyLight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                {/* Input */}
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {/* Right Icon (eye toggle) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
                Confirm Password
              </label>
              <div className="relative">
                <PiKeyLight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
                className={`p-3 rounded-lg text-center ${
                  message.type === "error"
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-green-100 border border-green-400 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-400"
            >
              {loading ? "Resetting..." : "Reset my password"}
            </button>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex justify-center md:w-[50%]  ">
        <div className="relative xl:w-[100%] xl:h-[100%] h-[95%] w-[100%]">
          <Image
            src="/Group.png"
            alt="Decorative"
            layout="fill"
            className="object-cover rounded-3xl p-1"
          />
        </div>
      </div>

      {/* ✅ Success Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-80 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="font normal text-center">
              Password Reset Successful!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
