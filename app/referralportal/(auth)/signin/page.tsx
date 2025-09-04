"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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

// Facebook SDK types
interface FacebookLoginResponse {
  authResponse?: {
    accessToken: string;
    userID: string;
  };
  status: string;
}

interface FacebookInitParams {
  appId: string | undefined;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}

interface FacebookLoginOptions {
  scope: string;
}

interface FacebookUserInfo {
  id: string;
  name: string;
  email: string;
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
    FB: {
      init: (params: FacebookInitParams) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options?: FacebookLoginOptions
      ) => void;
      api: (
        path: string,
        callback: (response: FacebookUserInfo) => void
      ) => void;
    };
    fbAsyncInit: () => void;
  }
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || "/referralportal/overview";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  // const [facebookLoading, setFacebookLoading] = useState(false);
console.log(googleLoading);
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
        console.log("Google sign-in response:", data);

        if (res.ok && data.success) {
          // Set token in cookie with same settings as backend
          const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
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

  // Handle Facebook Sign-In
  // const handleFacebookSignIn = useCallback(async () => {
  //   if (!window.FB) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       generalError: "Facebook SDK not loaded. Please try again.",
  //     }));
  //     return;
  //   }

  //   setFacebookLoading(true);
  //   setErrors((prev) => ({ ...prev, generalError: "" }));

  //   window.FB.login(
  //     async (response: FacebookLoginResponse) => {
  //       try {
  //         if (response.status === "connected" && response.authResponse) {
  //           // Get user data from Facebook
  //           window.FB.api("/me?fields=email,name", async (userInfo) => {
  //             try {
  //               const res = await fetch(
  //                 `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/facebook-login`,
  //                 {
  //                   method: "POST",
  //                   headers: {
  //                     "Content-Type": "application/json",
  //                   },
  //                   credentials: "include",
  //                   body: JSON.stringify({
  //                     accessToken: response.authResponse!.accessToken,
  //                     userID: response.authResponse!.userID,
  //                     email: userInfo.email,
  //                     name: userInfo.name,
  //                   }),
  //                 }
  //               );

  //               const data = await res.json();

  //               if (res.ok && data.success) {
  //                 const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  //                 const isProduction = process.env.NODE_ENV === "production";

  //                 document.cookie = `authToken=${
  //                   data.token
  //                 }; expires=${expireDate.toUTCString()}; path=/; ${
  //                   isProduction ? "secure; samesite=none" : "samesite=lax"
  //                 }`;

  //                 router.push(callbackUrl);
  //               } else {
  //                 setErrors((prev) => ({
  //                   ...prev,
  //                   generalError:
  //                     data.message ||
  //                     "Facebook sign-in failed. Please try again.",
  //                 }));
  //               }
  //             } catch (error) {
  //               console.error("Facebook sign-in error:", error);
  //               setErrors((prev) => ({
  //                 ...prev,
  //                 generalError: "Network error. Please try again.",
  //               }));
  //             } finally {
  //               setFacebookLoading(false);
  //             }
  //           });
  //         } else {
  //           setErrors((prev) => ({
  //             ...prev,
  //             generalError: "Facebook login was cancelled or failed.",
  //           }));
  //           setFacebookLoading(false);
  //         }
  //       } catch (error) {
  //         console.error("Facebook login error:", error);
  //         setErrors((prev) => ({
  //           ...prev,
  //           generalError: "Facebook login failed. Please try again.",
  //         }));
  //         setFacebookLoading(false);
  //       }
  //     },
  //     { scope: "email" }
  //   );
  // }, [router, callbackUrl]);

  // Initialize Facebook SDK
  useEffect(() => {
    // Facebook SDK initialization
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load Facebook SDK
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

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

          const googleButton = document.getElementById("google-signin-button");
          if (googleButton) {
            googleButton.innerHTML = ""; // Clear existing content

            window.google.accounts.id.renderButton(googleButton, {
              theme: "outline",
              size: "large",
              width: googleButton.offsetWidth.toString(),
              text: "signin_with",
            });

            // Custom CSS for button styling
            setTimeout(() => {
              const style = document.createElement("style");
              style.textContent = `
                #google-signin-button iframe {
                  margin: 0 auto !important;
                  display: block !important;
                }
                #google-signin-button > div {
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                }
                #google-signin-button button {
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  margin: 0 auto !important;
                }
              `;
              document.head.appendChild(style);
            }, 100);
          }
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
        }
      }
    };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      generalError: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setErrors((prev) => ({ ...prev, generalError: "" }));

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

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        console.log(`Sign-in response:`, data.token);
        // Set token in cookie
        const expireDate = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toUTCString();
        // Set the authToken cookie to expire in one day:
        // const isProduction = process.env.NODE_ENV === "production";
        // document.cookie = `authToken=${data.token}; path=/; samesite=lax`;
        document.cookie = `authToken=${data.token}; expires=${expireDate}; path=/`;

        router.push(callbackUrl);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          generalError: data.message || "Sign in failed. Please try again.",
        }));
      }
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        generalError: "Sign in failed, please try again.",
      }));
      console.error("Sign in failed", err);
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center lg:w-[50%]">
        <div className="w-full md:w-2/3">
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
          <p className="text-gray-600 mb-4 text-center sm:px-8 md:mb-4 md:w-full lg:mb-4 2xl:space-y-4">
            Track referrals, unlock rewards, and stay ahead in the Status Board
          </p>

          {/* Display general error */}
          {errors.generalError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.generalError}
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
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

            <div className="flex justify-between items-center text-gray-600 mb-4">
              <div className="flex">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 2xl:w-6 2xl:h-6"
                />
                <span className="text-[12px] 2xl:text-[24px]">Remember me</span>
              </div>
              <Link href="/referralportal/forget" className="text-red-400">
                <span className="text-[12px] 2xl:text-[24px]">
                  Forget password?
                </span>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formSubmitted}
              className={`w-full text-white p-2 rounded-xl mb-4 transition-opacity ${
                formSubmitted ? "bg-red-400" : "bg-red-700 hover:bg-red-800"
              } duration-200`}
            >
              {formSubmitted ? "Signing In..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Media Login Buttons */}
            <div className=" w-full mb-4">
              {/* Google Sign-In Button */}

              {/* Facebook Sign-In Button */}
              {/* <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={facebookLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span className="text-sm">
                  {facebookLoading ? "Loading..." : "Facebook"}
                </span>
              </button> */}
            </div>

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
      <div className="hidden md:flex justify-center md:w-[50%]">
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
