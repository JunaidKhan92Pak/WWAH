"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MdOutlineRepeat } from "react-icons/md";
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
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [currentStep, setCurrentStep] = useState("register"); // register, otp-verification, success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [countdown, setCountdown] = useState(0);
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
    genralError: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    referralCode: "",
  });
  console.log(errors);
  // const [formSubmitted, setFormSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // console.log(errors);

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
            credentials: "include",
            body: JSON.stringify({ credential: response.credential }),
          }
        );

        const data = await res.json();

        if (data.success) {
          // Set token in the same way as regular signup
          const expireDate = new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toUTCString();
          document.cookie = `authToken=${data.token}; expires=${expireDate}; path=/`;

          // Redirect to callback URL
          router.push(callbackUrl);
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

        // Render Google button
        const googleButton = document.getElementById("google-signin-button");
        if (googleButton) {
          window.google.accounts.id.renderButton(googleButton, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signup_with",
          });
        }
      }
    };

    // Load Google Sign-In script
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


  // Handle form submission
  const [otpData, setOtpData] = useState({
    emailOtp: "",
    phoneOtp: "",
  });

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
    // Allow only numbers and limit to 6 digits
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
      setError("first name is required");
      setLoading(false);
      return;
    }
    if (!formData.lastName.trim()) {
      setError("last name is required");
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}signup/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        setCurrentStep("otp-verification");
        setSuccess("OTP sent to your Email");
        setCountdown(60); // 60 seconds countdown for resend
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}signup/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            emailOtp: otpData.emailOtp,
            phoneOtp: otpData.phoneOtp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Complete registration
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
    // console.log("Resend OTP clicked, sessionId:", sessionId);

    // Check if sessionId exists
    if (!sessionId) {
      setError("Session expired. Please start registration again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const requestBody = { sessionId };
      // console.log("Sending request to resend OTP:", requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}signup/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // console.log("Response status:", response.status);
      // console.log("Response headers:", response.headers);

      const data = await response.json();

      if (response.ok && data.success) {
        // console.log("OTP resent successfully");
        setSuccess("New OTP sent successfully to your email");
        setCountdown(60);
        setOtpData({ emailOtp: "", phoneOtp: "" });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        // console.error("Failed to resend OTP:", data.message);
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Network error during resend:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      // console.log("Resend OTP process completed");
    }
  };
  const completeRegistration = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}signup/complete-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[60%] 2xl:px-20 2xl:w-[60%] my-2">
        <div>
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
          <div className="w-full mb-4">
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
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
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
            <div className="space-y-2">
              {/* First Name and Last Name */}
              <div className="grid md:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="Enter your Email"
                    required
                  />
                </div>
              </div>

              {/* Phone and Referral Code */}
              <div className="grid md:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                      placeholder="Enter Phone Number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center">
                      <MdOutlineRepeat className="absolute  top-1/2 transform -translate-y-1/2 text-gray-400 2xl:text-2xl 2xl:w-10" />{" "}
                    </div>
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                      placeholder="Enter Referral Code (optional)"
                    />
                  </div>
                </div>
              </div>

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
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="Enter your Password (min 8 characters)"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="Confirm your Password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
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

              <div className="text-center mt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-red-600 hover:text-red-800 font-medium"
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
                {/* <p className="text-sm font-medium text-gray-800">
                  {formData.phone}
                </p> */}
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

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone OTP
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="phoneOtp"
                    value={otpData.phoneOtp}
                    onChange={handleOtpChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div> */}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
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
                onClick={() => (window.location.href = "/signin")}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Continue to Login
              </button>
            </div>
          )}
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
