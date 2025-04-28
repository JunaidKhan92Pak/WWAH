"use client";
// import useUser from "@/hooks/useUser";
import { deleteAuthToken } from "@/utils/authHelper";
import React, { createContext, useContext, useState } from "react";
import { useUserStore } from "@/store/userStore";
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const { setUser } = useUserStore(); // ✅ Zustand state management
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(null);
  // const { fetchUser } = useUserStore();
  // useEffect(() => {
  //   fetchUser(); // Fetch once when app loads
  // }, []);

  const loginAction = async (userData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const loggedInUser = await res.json();
      if (!loggedInUser.success) {
        return { success: false, message: loggedInUser.message || "Login failed." };
      }
      document.cookie = `authToken=${loggedInUser.token}; path=/`;
      setToken(loggedInUser.token);
      return loggedInUser;
    } catch (err) {
      console.error("Login error", err);
      return { success: false, message: "Login failed" };
    }
  };

  // Signup function
  const signupAction = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const res = await response.json();
      if (!response.ok || !res.signup) {
        return { success: false, message: res.message || "Sign-up failed." };
      }
      document.cookie = `authToken=${res.token}; path=/`;
      setToken(res.token);
      return res;
    } catch (err) {
      console.error("Signup error", err);
      return { success: false, message: "Server error occurred during sign-up." };
    }
  };
  //create admin action
  // const createAdminAction = async (userData) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}createAdmin`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(userData),
  //       }
  //     );

  //     const res = await response.json();
  //   if (!response.ok || !res.adminId) {
  //     return { success: false, message: res.message || "Admin not created." };
  //   }

  //     document.cookie = `authToken=${res.token}; path=/`;
  //     setToken(res.token);
  //     return { success: true };
  //   } catch (err) {
  //     console.error("create admin error", err);
  //     return { success: false, message: "An error occurred while creating error." };
  //   }
  // };
  const createAdminAction = async (userData) => {
    console.log("Sending request to backend with data:", userData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}createAdmin`, // Ensure correct API URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      console.log("Response received:", response);

      const res = await response.json();
      console.log("Response JSON:", res);

      if (!response.ok || !res.adminId) {
        return { success: false, message: res.message || "Admin not created." };
      }

      document.cookie = `authToken=${res.token}; path=/`;
      return { success: true };
    } catch (err) {
      console.error("Create admin error:", err);
      return {
        success: false,
        message: "An error occurred while creating admin.",
      };
    }
  };

  // Forget Password function

  const forgetAction = async (email) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorRes = await response.json();
        console.error(
          `Error ${response.status}: ${errorRes.message || "Unknown error"}`
        );
        return {
          success: false,
          message: errorRes.message || "Failed to process request.",
        };
      }

      // Ensure the structure of the response is consistent
      const forgotRes = await response.json();
      return {
        success: forgotRes.success || false,
        message: forgotRes.message || "Unexpected response structure.",
      };
    } catch (error) {
      console.error("Network or server error in forgetAction:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  };
  const verifyOtpAction = async (enteredOtp) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}verifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enteredOtp }),
          credentials: "include",
        }
      );
      const verifyRes = await response.json();
      return verifyRes;
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  const resetPasswordAction = async (newPassword) => {
    try {
      console.log("Sending reset request with payload:", { newPassword });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}resetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const errorRes = await response.json();
        console.error("Backend error:", errorRes);
        throw new Error(errorRes.message || "Failed to reset password");
      }

      const data = await response.json();
      console.log("Successful response:", data);
      return data;
    } catch (error) {
      console.error("Error during password reset:", error);
      throw new Error("Something went wrong. Please try again later.");
    }
  };
  // Logout function
  const logout = async () => {
    console.log("Logging out...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}logout`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      deleteAuthToken();
      setUser(null); // ✅ Clear Zustand
      setUserState(null); // ✅ Clear local state
      setToken(null);

      const res = await response.json();
      return res;
    } catch (error) {
      console.log(`There was an error during logout: ${error}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginAction,
        signupAction,
        forgetAction,
        verifyOtpAction,
        createAdminAction,
        resetPasswordAction,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
