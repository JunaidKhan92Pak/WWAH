"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../auth/authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resetPasswordAction } = useAuth();

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

    try {
      setLoading(true);
      const resetResponse = await resetPasswordAction(newPassword);
      if (resetResponse.success) {
        setSuccessMessage(resetResponse.message);
        // Wait for the state to update before redirecting
        setTimeout(() => {
          router.push("/");
        }, 1500); // Redirect after 1.5 seconds
      } else {
        setErrorMessage(resetResponse.message);
      }
    } catch (error) {
      console.error("Error during reset:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex-1 max-w-2xl px-5 lg:px-20">
        <Link  href="/">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="Logo"
            className="mb-4 w-28 mx-auto"
          />
        </Link>
        <div className="mb-2 text-center">Reset Password</div>
        <p className="text-gray-600 text-center lg:px-20 mb-6">
          Please enter your new password to secure your account.
        </p>

        <form className="space-y-4 lg:w-4/5 mx-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-5"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Error or Success Messages */}
          {errorMessage && (
            <p className="text-red-600 mb-3 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 mb-3 text-center">{successMessage}</p>
          )}

          <button
            type="submit"
            className={`w-full bg-red-700 text-white p-2 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset my password"}
          </button>
        </form>
      </div>

      <div className="hidden  md:block">
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
