"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

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
  const callbackUrl =
    searchParams.get("callbackUrl") || "/referralportal/overview";
  const [currentStep, setCurrentStep] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form state and validation errors
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState({
    generalError: "", // Fixed typo
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    referralCode: "",
  });
console.log(errors, "error state");
  const [otpData, setOtpData] = useState({
    emailOtp: "",
    phoneOtp: "",
  });

  // Handle Google Sign-In response
  const handleGoogleSignIn = useCallback(
    async (response: GoogleResponse) => {
      setGoogleLoading(true);
      setErrors((prev) => ({ ...prev, generalError: "" }));

      try {
        console.log("Attempting Google sign-in...");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include", // Important for CORS
            body: JSON.stringify({ credential: response.credential }),
          }
        );

        console.log("Google sign-in response status:", res.status);

        const data = await res.json();
        console.log("Google sign-in response data:", data);

        if (res.ok && data.success) {
          // The token is already set as a cookie by the backend
          // But also set it manually for immediate use
          const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

          // Set cookie with same settings as backend
          const isProduction = process.env.NODE_ENV === "production";
          document.cookie = `authToken=${
            data.token
          }; expires=${expireDate.toUTCString()}; path=/; ${
            isProduction ? "secure; samesite=none" : "samesite=lax"
          }`;

          console.log("Redirecting to:", callbackUrl);

          // Small delay to ensure cookie is set
          setTimeout(() => {
            router.push(callbackUrl);
          }, 100);
        } else {
          console.error("Google sign-in failed:", data);
          setErrors((prev) => ({
            ...prev,
            generalError:
              data.message || "Google sign-in failed. Please try again.",
          }));
        }
      } catch (error) {
        console.error("Google sign-in network error:", error);
        setErrors((prev) => ({
          ...prev,
          generalError:
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
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            callback: handleGoogleSignIn,
            auto_select: false,
          });

          // Render Google button
          const googleButton = document.getElementById("google-signin-button");
          if (googleButton) {
            googleButton.innerHTML = ""; // Clear existing content
            window.google.accounts.id.renderButton(googleButton, {
              theme: "outline",
              size: "large",
              width: "384",
              text: "signup_with",
            });
          }
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
        }
      }
    };

    // Load Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = (error) => {
        console.error("Failed to load Google Sign-In script:", error);
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [handleGoogleSignIn]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleOtpChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setOtpData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/signup/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        setCurrentStep("otp-verification");
        setSuccess("OTP sent to your Email");
        setCountdown(60);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Network error", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otpData.emailOtp) {
      setError("Please enter OTP");
      setLoading(false);
      return;
    }

    if (otpData.emailOtp.length !== 6) {
      setError("OTP must be 6 digits long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/signup/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sessionId,
            emailOtp: otpData.emailOtp,
            phoneOtp: otpData.phoneOtp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await completeRegistration();
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Network error", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!sessionId) {
      setError("Session expired. Please start registration again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const requestBody = { sessionId };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/signup/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("New OTP sent successfully to your email");
        setCountdown(60);
        setOtpData({ emailOtp: "", phoneOtp: "" });

        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Network error during resend:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/signup/complete-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sessionId,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("success");
        setSuccess("Account created successfully!");
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (err) {
      console.error("Network error", err);
      setError("Network error. Please try again.");
    }
  };

  const resetForm = () => {
    setCurrentStep("register");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    });
    setOtpData({ emailOtp: "", phoneOtp: "" });
    setError("");
    setSuccess("");
    setSessionId("");
    setCountdown(0);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sign-up Form Section */}
      <div className="w-full lg:w-1/2 pt-5 md:pt-0 px-4 sm:px-8 flex flex-col items-center justify-center lg:w-[60%] 2xl:px-20 my-2">
        <div className="w-full lg:w-2/3">
          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src="/logowwah.svg"
                alt="WWAH Logo"
                width={130}
                height={40}
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentStep === "register" && "Create an Account!"}
              {currentStep === "otp-verification" && "Verify OTP"}
              {currentStep === "success" && "Welcome!"}
            </h1>
            <p className="text-gray-600 text-sm">
              {currentStep === "register" &&
                "Please provide your information below to begin your learning journey"}
              {currentStep === "otp-verification" &&
                "Check your email and phone"}
              {currentStep === "success" && "Account created successfully"}
            </p>
          </div>

          {/* Google Sign-In Button */}
          {currentStep === "register" && (
            <div className="w-full mb-4">
              {googleLoading && (
                <div className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <Loader className="animate-spin w-5 h-5" />
                  <span>Signing in with Google...</span>
                </div>
              )}
              <div
                id="google-signin-button"
                className={`w-full ${googleLoading ? "hidden" : ""}`}
                style={{ minHeight: "44px" }}
              />
            </div>
          )}

          {/* Divider - only show during registration */}
          {currentStep === "register" && (
            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Registration Form */}
          {currentStep === "register" && (
            <div className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      name="firstName"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Enter First Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      name="lastName"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Enter your Email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Enter Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Enter your Password (min 6 characters)"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px] transition-all duration-200"
                      placeholder="Confirm your Password"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/referralportal/signin"
                    className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {currentStep === "otp-verification" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  We&apos;ve sent verification codes to:
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {formData.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email OTP
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="emailOtp"
                    value={otpData.emailOtp}
                    onChange={handleOtpChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-5 h-5 mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to Registration
              </button>
            </div>
          )}

          {/* Success */}
          {currentStep === "success" && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome, {formData.firstName}!
                </h3>
              </div>

              <button
                onClick={() =>
                  (window.location.href = "/referralportal/signin")
                }
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex justify-center md:w-[50%] ">
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
