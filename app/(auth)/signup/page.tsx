"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../auth/authProvider";
import { CiUser } from "react-icons/ci";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUserStore } from "@/store/userStore";

const Page = () => {
  const router = useRouter();
  const { signupAction } = useAuth();
  const { setUser, loading } = useUserStore();
  // Form state and validation errors
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear specific error
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    const newErrors = {
      firstName: !formData.firstName ? "First name is required." : "",
      lastName: !formData.lastName ? "Last name is required." : "",
      email: !formData.email
        ? "Email is required."
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? ""
          : "Enter a valid email address.",
      password: !formData.password ? "Password is required." : "",
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Passwords do not match."
          : "",
    };

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }


    try {
      const res = await signupAction(formData);
      if (res.success) {
        setUser(res.user);
        router.push("/");

      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: res.message, // Correct reference of res.message
        }));
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sign-up Form Section */}
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[60%] 2xl:px-20 2xl:w-[60%]">
        <div>
          <Image
            src={logo}
            alt="Logo"
            width={80}
            height={80}
            className="w-16 sm:w-24 mx-auto"
          />

          <h4 className="text-center">Create an Account!</h4>
          <p className="text-gray-600 mb-2 text-center sm:px-8 md:mb-2 md:w-full lg:text-[14px] lg:mb-2 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
            Please provide your information below to begin your learning journey
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex w-full gap-4 2xl:gap-6">
              <div className="w-1/2">
                <label className="block text-gray-800 font-normal pt-2">
                  First Name
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                  <input
                    type="text"
                    name="firstName"
                    className="w-full p-1 lg:p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-800 font-normal pt-2">
                  Last Name
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                  <input
                    type="text"
                    name="lastName"
                    className="w-full p-1 lg:p-2 pl-8 lg:pl-10 2xl:pl-16 border border-gray-300 rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-800 font-normal pt-2">
                Email
              </label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                <input
                  type="email"
                  name="email"
                  className="w-full p-1 lg:p-2 2xl:pl-16 pl-8 lg:pl-10 border border-gray-300 rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-800 font-normal pt-2">
                Password
              </label>
              <div className="relative">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-1 lg:pl-10 2xl:pl-16 pl-10 border border-gray-300 rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                  placeholder="Enter your Password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-800 font-normal pt-2  mt-1">
                Confirm Password
              </label>
              <div className="relative mb-3">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full p-1 lg:pl-10 2xl:pl-16 pl-10 border border-gray-300 rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                  placeholder="Confirm your Password"
                  onChange={handleChange}
                  value={formData.confirmPassword}
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
              {errors.confirmPassword && (
                <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            {/* <button
              type="submit"
              className="w-full bg-red-700 text-white p-2 mt-4 rounded 2xl:p-6"
            >
              {loading ? "Processing..." : "Go to my dashboard"}
            </button> */}

            <button
              type="submit"
              className={`w-full text-white p-2 rounded 2xl:p-4 transition-opacity bg-red-700 duration-200`}

            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
            <p className="text-center mt-2 text-gray-600 mb-2 sm:px-8 md:mb-2 md:w-full lg:text-[14px] lg:mb-2 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
              Already have an account?{" "}
              <Link href="/signup" className="text-[#F0851D]">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex justify-center md:w-[50%] lg:w-[38%] p-4">
        <div className="relative xl:w-[100%] xl:h-[100%] h-[95%] w-[100%]">
          <Image
            src="/Group.png" // Replace with your decorative image
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
