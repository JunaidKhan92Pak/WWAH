// utils/courseApplications.js
import { getAuthToken } from "@/utils/authHelper";
import toast from "react-hot-toast";

// Function to add a course to applied courses
export const addCourseToApplied = async (courseId) => {
  const token = getAuthToken();

  if (!token) {
    toast.error("Please login to apply for courses!", {
      duration: 4000,
      position: "top-center",
    });
    return { success: false, error: "No authentication token" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          action: "add",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to apply for course");
    }

    const data = await response.json();

    toast.success("Course added to your applications!", {
      duration: 3000,
      position: "top-center",
    });

    return {
      success: true,
      data: data.data,
      isApplied: data.data.isApplied,
    };
  } catch (error) {
    console.error("Error applying for course:", error);
    toast.error(
      error.message || "Failed to apply for course. Please try again.",
      {
        duration: 3000,
        position: "top-center",
      }
    );
    return { success: false, error: error.message };
  }
};

// Function to remove a course from applied courses
export const removeCourseFromApplied = async (courseId) => {
  const token = getAuthToken();

  if (!token) {
    toast.error("Please login to manage your applications!", {
      duration: 4000,
      position: "top-center",
    });
    return { success: false, error: "No authentication token" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          action: "remove",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to remove course from applications"
      );
    }

    const data = await response.json();

    toast.success("Course removed from applications!", {
      duration: 2000,
      position: "top-center",
    });

    return {
      success: true,
      data: data.data,
      isApplied: data.data.isApplied,
    };
  } catch (error) {
    console.error("Error removing course:", error);
    toast.error(error.message || "Failed to remove course. Please try again.", {
      duration: 3000,
      position: "top-center",
    });
    return { success: false, error: error.message };
  }
};

// Function to check if a course is already applied
export const checkCourseApplicationStatus = async (courseId) => {
  const token = getAuthToken();

  if (!token) {
    return { success: false, isApplied: false };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses/check/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check course application status");
    }

    const data = await response.json();
    return {
      success: true,
      isApplied: data.data.isApplied,
    };
  } catch (error) {
    console.error("Error checking course application status:", error);
    return { success: false, isApplied: false };
  }
};

// Function to fetch all applied courses
export const fetchAppliedCourses = async () => {
  const token = getAuthToken();

  if (!token) {
    return { success: false, appliedCourses: [] };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedcourses`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applied courses");
    }

    const data = await response.json();
    return {
      success: true,
      appliedCourses: data.data?.appliedCourses || [],
    };
  } catch (error) {
    console.error("Error fetching applied courses:", error);
    toast.error("Failed to fetch applied courses", {
      duration: 3000,
      position: "top-center",
    });
    return { success: false, appliedCourses: [] };
  }
};
