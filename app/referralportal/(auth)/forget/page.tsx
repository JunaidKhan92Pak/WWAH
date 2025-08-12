  "use client";

  import { useState } from "react";
  import Image from "next/image";
  import { IoMailOutline } from "react-icons/io5";
  import Link from "next/link";

  const Page = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage({ type: "", text: "" });

      if (!email.trim()) {
        setMessage({ type: "error", text: "Email address is required." });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({
          type: "error",
          text: "Please enter a valid email address.",
        });
        return;
      }

      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        console.log("Forgot password request for:", email);
        setMessage({
          type: "success",
          text: "OTP has been sent to your email address. Please check your inbox.",
        });
        setLoading(false);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
      }, 2000);
    };

    return (
      <div className="flex items-center justify-center h-[80vh] md:h-screen">
        {/* Form Section */}
        <div className="w-full md:w-1/2 pt-5 md:pt-0 px-8 flex flex-col items-center justify-center ">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <Image
                src="/logowwah.svg"
                alt="WWAH Logo"
                width={150}
                height={60}
                
              />
            </Link>
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="text-gray-600 text-center lg:px-4 mb-6">
            Enter your registered email to receive a password reset OTP.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email Address<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-[12px] placeholder:md:text-[12px] placeholder:lg:text-[14px]"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Display Message */}
            {message.text && (
              <div
                className={`p-3 rounded-lg text-center ${
                  message.type === "error"
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-green-100 border border-green-400 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white p-2 rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex justify-center md:w-[50%] ">
          <div className="relative xl:w-[100%] xl:h-[100%] h-[95%] w-[100%]">
            <Image
              src="/Group.png"
              width={400}
              height={400}
              alt="Decorative"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  export default Page;
