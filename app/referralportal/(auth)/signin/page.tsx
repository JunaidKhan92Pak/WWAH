"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    generalError: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const newErrors = {
      generalError: "",
      email: !formData.email
        ? "Email is required."
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? ""
        : "Enter a valid email address.",
      password: !formData.password ? "Password is required." : "",
    };

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      setFormSubmitted(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setFormSubmitted(false);
      // Reset form or show success message as needed
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
    // Add your Google sign-in logic here
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook sign-in clicked");
    // Add your Facebook sign-in logic here
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[50%]">
        <div>
          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src="/logowwah.svg"
                alt="WWAH Logo"
                width={150}
                height={60}
              />
            </Link>
          </div>
          <h6 className="text-center font-semibold mb-1 mt-4">Welcome Back!</h6>
          <p className="text-gray-600 mb-4 text-center sm:px-8 md:mb-4 md:w-full  lg:mb-4  2xl:space-y-4">
            Track referrals, unlock rewards, and stay ahead in the Status Board
          </p>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {errors.generalError && (
              <p className="text-red-500 text-center mb-4">
                {errors.generalError}
              </p>
            )}

            {/* Email */}
            <div className="mb-3">
              <label className="block text-gray-800 font-normal">
                Email<span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                <input
                  type="email"
                  name="email"
                  className={`w-full p-1 lg:p-2 2xl:pl-16 pl-8 lg:pl-10 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg 2xl:p-3 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]`}
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-gray-800 font-normal">
                Password<span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full p-1 lg:pl-10 2xl:pl-16 pl-10 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg 2xl:p-3 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]`}
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
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <div className="flex">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 2xl:w-6 2xl:h-6"
                />
                <span className="text-[12px] 2xl:text-[24px]">Remember me</span>
              </div>
              <Link href="/forget" className="text-red-400">
                <span className="text-[12px] 2xl:text-[24px]">
                  Forget password?
                </span>
              </Link>
            </div>

            {/* "Or" Text */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Media Login Buttons */}
            <div className="flex gap-3 mb-4">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>

              {/* Facebook Sign-In Button */}
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formSubmitted}
              className={`w-full text-white p-2 rounded-xl mt-4 transition-opacity ${
                formSubmitted ? "bg-red-400" : "bg-red-700 hover:bg-red-800"
              } duration-200`}
            >
              {formSubmitted ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center mt-4 text-gray-600 mb-2 sm:px-8 md:mb-2 md:w-full lg:text-[14px] lg:mb-2 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/referralportal/signup"
                className="text-[#F0851D] hover:underline"
              >
                Register
              </Link>
            </p>
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
