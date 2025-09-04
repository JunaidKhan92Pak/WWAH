"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMailOutline } from "react-icons/io5";

const Page = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }

    setOtp(newOtp);

    // Focus on the last filled input or first empty one
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setMessage({
        type: "error",
        text: "Please enter the complete 6-digit OTP.",
      });
      return;
    }

    if (!email) {
      setMessage({
        type: "error",
        text: "Email not found. Please start the process again.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/verifyotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpString }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: result.message || "OTP verification failed.",
        });
        return;
      }

      // OTP verified successfully, redirect to reset password page
      router.push(
        `/referralportal/resetpassword?email=${encodeURIComponent(
          email
        )}&token=${result.resetToken}`
      );
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "New OTP has been sent to your email address.",
        });
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to resend OTP.",
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
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

          <h3 className="font-bold text-center text-gray-900 mb-2">
            Verify OTP
          </h3>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <IoMailOutline className="text-gray-400 mr-2" />
              <p className="text-gray-600 text-sm">We sent a code to</p>
            </div>
            <p className="text-gray-900 font-medium">{email}</p>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit code below to verify your email
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading || resendLoading}
                  className="md:w-12 md:h-12 w-8 h-8 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors"
                />
              ))}
            </div>

            {/* Timer */}
            {!canResend && (
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Resend OTP in{" "}
                  <span className="font-medium text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>
            )}

            {/* Resend Button */}
            {canResend && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            )}

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
              disabled={loading || resendLoading}
              className="w-full bg-red-600 text-white py-2 md:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/referralportal/forgotpassword"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Forgot Password
            </Link>
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
    </div>
  );
};

export default Page;
