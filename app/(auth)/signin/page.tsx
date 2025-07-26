"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../auth/authProvider";
import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUserStore } from "@/store/userStore";

// Declare Google API types
interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleResponse) => void;
  auto_select: boolean;
}

interface GoogleButtonConfig {
  theme: string;
  size: string;
  width: string;
  text: string;
}

interface GoogleResponse {
  credential: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { loginAction } = useAuth(); // Make sure you have signinAction
  const { loading } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    genralError: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle Google Sign-In response
  const handleGoogleSignIn = useCallback(
    async (response: GoogleResponse) => {
      setGoogleLoading(true);
      setErrors((prev) => ({ ...prev, genralError: "" }));
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}auth/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credential: response.credential }),
          }
        );

        const data = await res.json();
        if (data.success) {
          // Set token in the same way as regular signin
          const expireDate = new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toUTCString();
          document.cookie = `authToken=${data.token}; expires=${expireDate}; path=/`;
          window.location.href = callbackUrl;
        } else {
          setErrors((prev) => ({
            ...prev,
            genralError:
              data.message || "Google sign-in failed. Please try again.",
          }));
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
        setErrors((prev) => ({
          ...prev,
          genralError:
            "Network error. Please check your connection and try again.",
        }));
      } finally {
        setGoogleLoading(false);
      }
    },
    [router, callbackUrl]
  );

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleSignIn,
          auto_select: false,
        });

        const googleButton = document.getElementById("google-signin-button");
        if (googleButton) {
          window.google.accounts.id.renderButton(googleButton, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
          });
        }
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [handleGoogleSignIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const newErrors = {
      genralError: "",
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

    try {
      const res = await loginAction(formData);
      if (res.success) {
        window.location.href = callbackUrl;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          genralError: res.message,
        }));
      }
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        genralError: "Sign in failed, please try again.",
      }));
      console.error("Sign in failed", err);
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[60%] 2xl:px-20 2xl:w-[60%]">
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
          <h6 className="text-center font-semibold text-xl mb-1 mt-4">
            Welcome Back!
          </h6>
          <p className="text-gray-600 mb-4 text-center sm:px-8 md:mb-4 md:w-full lg:text-[14px] lg:mb-4 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
            Please sign in to your account to continue your learning journey
          </p>

          {/* Google Sign-In Button */}
          <div
            className="w-full mb-4 mx-auto
          "
          >
            <div
              id="google-signin-button"
              className={`w-full ${
                googleLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            ></div>
            {googleLoading && (
              <p className="text-center text-gray-600 mt-2">
                Signing in with Google...
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {errors.genralError && (
              <p className="text-red-500 text-center mb-4">
                {errors.genralError}
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
                  } rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]`}
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
                  } rounded-lg 2xl:p-6 placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]`}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formSubmitted}
              className={`w-full text-white p-2 rounded 2xl:p-4 mt-4 transition-opacity ${
                loading || formSubmitted
                  ? "bg-red-400"
                  : "bg-red-700 hover:bg-red-800"
              } duration-200`}
            >
              {loading || formSubmitted ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center mt-4 text-gray-600 mb-2 sm:px-8 md:mb-2 md:w-full lg:text-[14px] lg:mb-2 lg:leading-5 2xl:leading-10 2xl:text-[28px] 2xl:space-y-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#F0851D] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex justify-center md:w-[50%] lg:w-[38%] p-4">
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
