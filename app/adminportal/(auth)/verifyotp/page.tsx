"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OtpVerification = () => {
  // State for OTP input fields
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Function to handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.match(/^[0-9]?$|^$/)) { // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  return (
    <div
      className="relative w-[98%] my-4 mx-auto bg-cover bg-center bg-no-repeat rounded-3xl h-[96vh]  md:h-[96vh] flex justify-center items-center"
      style={{ backgroundImage: "url('/adminportal/loginbackgroundimg.svg')" }}
    >
      <div className="flex flex-col justify-center items-center text-center w-full p-4">
        {/* Logo */}
        <Image
          src="/adminportal/wwah.svg"
          alt="WWAH Logo"
          width={130}
          height={130}
          className="mb-4"
        />

        {/* Heading */}
        <h4 className="text-xl font-bold">Verify OTP!</h4>
        <p className="w-full md:w-[45%] xl:w-[25%]">
          We’ve sent a 6-digit OTP to your mail 
        </p>

        <p>johnduo@gmail.com</p>
        {/* OTP Input Fields */}
        <div className="w-full sm:w-[60%] lg:w-[40%] xl:w-[26%] ">
          <div className="flex flex-col items-center my-4">
            <h2 className="text-lg font-semibold mb-2 self-start">Enter OTP</h2>
            <div className="flex gap-3 md:gap-4 xl:gap-5 items-center justify-center w-full ">
              {otp.map((value, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full md:w-[20%] h-[5vh] md:h-[6vh] text-center border border-gray-300 rounded-lg"
                />
              ))}
            </div>
          </div>




          {/* Resend OTP Section */}
          <div className="flex justify-between items-center w-full">
            <p className="text-base text-red-600 cursor-pointer">Resend OTP</p>
            <div className="flex items-center gap-2">
              <Image
                src="/adminportal/clock.svg" // Update with your actual timer image path
                alt="Timer Icon"
                width={20}
                height={20}
              />
              <span className="text-gray-500">01:19</span>
            </div>
          </div>

          {/* Verify OTP Button */}
          <Button className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-lg text-base mt-4">
            Verify OTP!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
