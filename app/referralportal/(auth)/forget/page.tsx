"use client";

import { useState } from "react";
import Image from "next/image";
import { IoMailOutline } from "react-icons/io5";
import Link from "next/link";

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email address is required." });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Forgot password request for:", email);
      setMessage({
        type: "success",
        text: "OTP has been sent to your email address. Please check your inbox.",
      });
      setLoading(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[50%]">
        <div className="w-[90%] sm:w-[60%]">
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
            Forgot Password!
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Please enter your registered email address below to initiate
            password reset request.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-400"
            >
              {loading ? "Sending OTP..." : "Send OTP!"}
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
    </div>
  );
};

export default Page;
