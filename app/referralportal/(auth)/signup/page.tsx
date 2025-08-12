"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
// import { MdOutlineRepeat } from "react-icons/md";
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

const Page = () => {
  const [currentStep, setCurrentStep] = useState("register"); // register, otp-verification, success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    referralCode: "",
  });

  // OTP data
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

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setCurrentStep("otp-verification");
      setSuccess("OTP sent to your Email");
      setCountdown(60);
      setLoading(false);
    }, 2000);
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

    // Simulate OTP verification
    setTimeout(() => {
      console.log("OTP verified:", otpData);
      setCurrentStep("success");
      setSuccess("Account created successfully!");
      setLoading(false);
    }, 2000);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate resend OTP
    setTimeout(() => {
      console.log("OTP resent");
      setSuccess("New OTP sent successfully to your email");
      setCountdown(60);
      setOtpData({ emailOtp: "", phoneOtp: "" });
      setLoading(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }, 1000);
  };

  // const handleGoogleSignIn = () => {
  //   console.log("Google sign-up clicked");
  //   // Add your Google sign-in logic here
  // };

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
    setCountdown(0);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sign-up Form Section */}
      <div className="w-full lg:w-1/2 pt-5 md:pt-0 px-4 sm:px-8 flex flex-col items-center justify-center lg:w-[60%] 2xl:px-20  my-2">
        <div className="w-full sm:w-[85%]">
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
          {/* <div className="w-full mb-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
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
              <span>Sign up with Google</span>
            </button>
          </div> */}

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
