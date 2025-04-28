"use client";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  IoMailOutline,
  IoKeyOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { useAuth } from "../auth/authProvider";
import { useUserStore } from "@/store/userStore";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { loginAction } = useAuth(); // Get login function from context
  const { setUser, loading } = useUserStore();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState(false); // Add state for disabling button

  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError("");
    setIsDisabled(false); // Re-enable button when user types again
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      setGeneralError("Please fill in all fields.");
      setIsDisabled(false); // Enable the button again
      return;
    }
    setIsDisabled(true); // Disable the button only while processing
    try {
      const loginRes = await loginAction(userData);
      if (loginRes.success && loginRes.user) {
        setUser({
          id: loginRes.user._id,
          firstName: loginRes.user.firstName,
          lastName: loginRes.user.lastName,
          phone: loginRes.user.phone,
          email: loginRes.user.email,
        });
        if (loginRes.user) {
          router.push(callbackUrl);

        }
      } else {
        setGeneralError("Invalid credentials");
        setIsDisabled(false); // Re-enable the button so the user can try again
      }
    } catch (err) {
      setGeneralError("Login failed, please try again.");
      console.error("Login failed", err);
      setIsDisabled(false); // Enable button on failure
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="w-6/7 pt-5 md:pt-0 px-8 flex flex-col items-end justify-center">
          <div className="w-full sm:w-full lg:w-4/5">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="lg:mb-0 w-16 sm:w-24 mx-auto md:w-[120px] 2xl:w-40 2xl:h-36"
                unoptimized={true}
              />
            </Link>
            <h3 className="text-center lg:mb-2">Welcome back</h3>
            <p className="text-gray-600 mb-2 text-center sm:px-8 md:mb-2 md:w-full lg:text-[14px] lg:mb-2 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
              Achieve your study dreams in your ideal country with global
              support from Admission Hub.
            </p>
          </div>
          {generalError && (
            <p className="text-red-500 text-center mb-4">{generalError}</p>
          )}
          <form
            className="space-y-2 lg:space-y-4 w-full sm:w-full lg:w-4/5"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 2xl:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg 2xl:text-3xl" />
                <input
                  type="text"
                  className={`w-full pl-10 2xl:pl-16 pr-2 py-1 sm:py-2 2xl:py-6 border placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] ${errors.email || generalError
                    ? "border-red-600"
                    : "border-gray-300"
                    } rounded text-base 2xl:text-lg`}
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
                <IoKeyOutline className="absolute left-3 2xl:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg 2xl:text-3xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 2xl:pl-16 pr-10 py-1 sm:py-2 2xl:py-6 border placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] ${errors.password || generalError
                    ? "border-red-600"
                    : "border-gray-300"
                    } rounded`}
                  placeholder="Enter your password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <IoEyeOffOutline
                    className="absolute right-3 2xl:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg 2xl:text-3xl cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <IoEyeOutline
                    className="absolute right-3 2xl:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg 2xl:text-3xl cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <div className="flex">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 2xl:w-6 2xl:h-6"
                />
                <span className="text-[12px] 2xl:text-[24px]">Remember me</span>
              </div>
              <Link target="blank" href="/forget" className="text-red-400">
                <span className="text-[12px] 2xl:text-[24px]">
                  Forget password?
                </span>
              </Link>
            </div>

            <div className="flex items-center text-center text-gray-500 my-4">
              <hr className="flex-grow border-gray-300" />
              <p className="mx-3">or</p>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button
              type="submit"
              className={`w-full text-white p-2 rounded 2xl:p-4 transition-opacity duration-200 ${isDisabled
                ? "bg-red-600 opacity-30 cursor-not-allowed"
                : "bg-red-700"
                }`}
              disabled={isDisabled}
            >
              {loading ? "Processing..." : "Sign In"}
            </button>

            <span className="block text-[12px] lg:text-[14px] 2xl:text-[24px] text-center 2xl:w-full">
              Don&#39;t have an account?{" "}
              <Link
                target="blank"
                href="/signup"
                className="text-[#F0851D] text-[12px] 2xl:text-[24px] lg:text-[14px]"
              >
                Register
              </Link>
            </span>
          </form>
        </div>
      </div>
      <div className="hidden md:flex justify-center md:w-[50%] lg:w-[50%] lg:p-4">
        <div className="relative w-[80%] h-[100%]">
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
