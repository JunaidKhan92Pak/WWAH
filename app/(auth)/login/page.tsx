"use client";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  IoMailOutline,
  IoKeyOutline,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { useAuth } from "../auth/authProvider";

const Page = () => {
  const router = useRouter();
  const { loginAction } = useAuth();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(""); // Clear previous errors

    if (!userData.email || !userData.password) {
      setGeneralError("Please fill in all fields.");
      return;
    }

    try {
      const loginres = await loginAction(userData);
      // console.log("Login Response:", loginres); // 🔍 Debugging

      if (!loginres) {
        setGeneralError("No response from server.");
        return;
      }

      if (loginres.success) {
        router.push("/");
      } else {
        setGeneralError(loginres.message || "Invalid email or password.");
      }
    } catch (err) {
      setGeneralError("Login failed, please try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row  sm:min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center min-h-[90vh]">
        <div className="w-6/7 pt-5 md:pt-0 px-8 flex flex-col items-end justify-center">
          <div className="w-full sm:w-full lg:w-4/5">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={200}
              className="w-24 mx-auto mb-4 sm:mb-2"
            />
            <h3 className="text-center">Welcome back</h3>
            <p className="text-gray-600 text-center sm:px-8">
              Achieve your study dreams with Admission Hub.
            </p>
          </div>
          {generalError && (
            <p className="text-red-500 text-center mb-4">{generalError}</p>
          )}
          <form
            className="space-y-4 w-full sm:w-full lg:w-4/5"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className={`w-full pl-10  pr-2 py-1 sm:py-2  border ${
                    errors.email || generalError
                      ? "border-red-600"
                      : "border-gray-300"
                  } rounded text-base`}
                  placeholder="Enter your email address"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className={`w-full pl-10  pr-2 py-1 sm:py-2  border ${
                    errors.password || generalError
                      ? "border-red-600"
                      : "border-gray-300"
                  } rounded`}
                  placeholder="Enter your password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <div className="flex">
                <input type="checkbox" className="mr-2" />
                <span>Remember me</span>
              </div>
              <Link  href="/forget" className="text-red-400">
                Forget password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 text-white p-2 rounded"
            >
              Sign In
            </button>
            <span className="block text-center">
              Don&#39;t have an account?{" "}
              <Link target="blank" href="/signup" className="text-[#F0851D]">
                Register
              </Link>
            </span>
          </form>
        </div>
      </div>
      {/* image section */}
      <div className="hidden md:flex justify-center md:w-[50%] lg:w-[50%] p-4">
        <div className="relative w-[80%] h-[100%]">
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
