"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/authProvider";

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" }); // Unified state for messages
  const { forgetAction } = useAuth();
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
      console.log("ForgetAction Response:", response); // Debugging
  
      if (response?.success) {
        setMessage({ type: "success", text: response.message });
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to send OTP." });
      }
      router.push("/verifyotp");

    } catch (error) {
      console.error("Forget password error", error);
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Form Section */}
      <div className="flex-1 max-w-xl px-10 lg:px-20 ">
        <Image src={Logo} alt="Logo" className="mb-4 w-28 mx-auto" />
        <h2 className="mb-2 text-center">Forget Password</h2>
        <p className="text-gray-600 text-center lg:px-4 mb-6">
          Enter your registered email to receive a password reset OTP.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg mb-3"
              placeholder="e.g., example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
