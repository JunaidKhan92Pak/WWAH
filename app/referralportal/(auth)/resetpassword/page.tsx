"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Page = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill out both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Password reset successful for:", { newPassword });
      setSuccessMessage("Password has been reset successfully!");
      setLoading(false);

      // Clear form after success
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("");
        console.log("Redirecting to login...");
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex-1 max-w-2xl px-5 lg:px-20">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <Link href="/">
            <Image
              src="/logowwah.svg"
              width={120}
              height={60}
              alt="Logo"
              className="mb-6 mx-auto"
            />
          </Link>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Please enter your new password to secure your account.
            </p>
          </div>

          <form className="space-y-4 lg:w-4/5 mx-auto" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                New Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </div>
            </div>

            {/* Error or Success Messages */}
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg transition-colors flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                "Reset my password"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block flex-1 max-w-md">
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
