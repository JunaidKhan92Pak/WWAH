"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import plane from "@/public/plane.png";
import Image1 from "@/public/SigninImage1.png";
import { useAuth } from "../auth/authProvider";

const VerifyOtp = () => {
  const { verifyOtpAction } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(120); // Timer in seconds (2 minutes)
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsOtpExpired(true);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Onl    y allow numeric input
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only one digit is entered
    setOtp(newOtp);

    // Automatically move to the next input if a digit is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      return;
    }
    try {
      const verifyRes = await verifyOtpAction(enteredOtp);
      if (verifyRes?.success) {
        setSuccessMessage("OTP verified successfully!");
        console.log("OTP verified successfully! Redirecting...");
      } else {
        setErrorMessage(verifyRes?.message || "Invalid OTP. Please try again.");
      }
      router.push("/resetpassword");
    } catch (error) {
      setErrorMessage(`Something went wrong. Please try again `);
      console.log(`Something went wrong. Please try again ${error} `);
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(120); // Reset timer to 2 minutes
    setIsOtpExpired(false);
    setErrorMessage("");
    setSuccessMessage("A new OTP has been sent to your email!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Sign-in Form Section */}
      <div className="flex-1 max-w-2xl sm:pl-44 px-20 sm:pr-28">
        {/* <Image src={Logo} alt="Logo" className="mb-4 w-28 mx-auto" /> */}
        <Image src="/logowwah.svg" alt="WWAH Logo" width={150} height={60} />
        <div className="text-2xl font-bold mb-2 text-center">Verify OTP!</div>
        <p className="text-gray-600 text-center text-sm sm:px-10 mb-6">
          We have sent a 6-digit OTP to your email!
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex justify-between text-sm mb-3">
            {isOtpExpired ? (
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-600">
                OTP expires in {formatTime(timer)}
              </span>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm mb-3 text-center">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mb-3 text-center">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-700 text-white p-2 rounded-lg"
            disabled={isOtpExpired}
          >
            Verify OTP
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="flex-1 relative left-0 h-full md:flex items-center justify-center hidden overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-800 to-red-600 rounded-3xl max-w-2xl my-1">
          {/* Plane image in the background */}
          <Image
            src={plane}
            alt="plane"
            className="scale-x-[-1] absolute w-full bottom-44 right-7 -rotate-3 opacity-50 object-cover z-0"
            style={{ height: 500 }}
          />

          {/* Overlay image */}
          <div className="absolute top-10 -right-20 z-10 flex justify-center items-end">
            <Image
              src={Image1}
              alt="Image1"
              className="max-w-4xl"
              style={{ height: 600 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
