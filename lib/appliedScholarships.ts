// lib/api/appliedScholarships.ts or services/appliedScholarships.ts
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";

// Types
interface Application {
  _id?: string;
  userId: string;
  scholarshipName: string;
  hostCountry: string;
  courseName: string;
  duration: string;
  language: string;
  universityName: string;
  scholarshipType: string;
  deadline: string;
  banner?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

interface CourseData {
  scholarshipName?: string;
  hostCountry?: string;
  courseName?: string;
  duration?: string;
  language?: string;
  universityName?: string;
  scholarshipType?: string;
  deadline?: string;
  banner?: string;
}

interface RequestHeaders {
  [key: string]: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  application?: Application;
  applications?: Application[];
  totalPages?: number;
  currentPage?: number;
  total?: number;
}

interface UpdateData {
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

// Helper function to get user ID from Zustand store
const getUserId = (): string | null => {
  // Check if we're in browser environment
  if (typeof window !== "undefined") {
    try {
      const state = useUserStore.getState();
      return state.user?._id || null;
    } catch (error) {
      console.error("Error accessing user store:", error);
      return null;
    }
  }
  return null;
};

// Helper function to create headers
const getHeaders = (): RequestHeaders => {
  const token = getAuthToken();
  const headers: RequestHeaders = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Apply for a scholarship course
export const applyCourse = async (
  courseData: CourseData
): Promise<ApiResponse> => {
  try {
    const userId = getUserId();

    console.log("Debug - getUserId result:", userId);

    if (!userId) {
      const token = getAuthToken();
      console.log("Debug - Token exists:", !!token);

      if (typeof window !== "undefined") {
        try {
          const state = useUserStore.getState();
          console.log("Debug - Store state:", {
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            userId: state.user?._id,
          });
        } catch (error) {
          console.error("Error accessing store for debug:", error);
        }
      }

      throw new Error("Please login to apply for courses");
    }

    console.log("Debug - Making request with userId:", userId);
    console.log("Debug - Received courseData:", courseData);

    // Ensure all required fields have values, provide meaningful defaults
    const applicationPayload = {
      userId: userId,
      scholarshipName:
        courseData.scholarshipName ||
        courseData.courseName ||
        "Scholarship Application",
      hostCountry: courseData.hostCountry || "Not specified",
      courseName: courseData.courseName || "Not specified",
      duration: courseData.duration || "Not specified",
      language: courseData.language || "Not specified",
      universityName: courseData.universityName || "Not specified",
      scholarshipType: courseData.scholarshipType || "Not specified",
      deadline: courseData.deadline || "Not specified",
      banner: courseData.banner || "",
    };

    console.log("Debug - Final payload:", applicationPayload);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/apply`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(applicationPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Debug - API Response:", result);

    if (!result.success) {
      throw new Error(result.message || "Application failed");
    }

    // Update user store after successful application
    if (result.success && result.application && typeof window !== "undefined") {
      try {
        const store = useUserStore.getState();
        // Add the new application to the store
        await store.addAppliedScholarshipCourse(result.application);
        console.log("Successfully updated user store with new application");

        // Also refresh the applications to ensure sync
        await store.refreshApplications();
      } catch (storeError) {
        console.error("Error updating user store:", storeError);
        // Don't throw here, as the application was successful
      }
    }

    return result;
  } catch (error) {
    console.error("Error applying for course:", error);
    throw error;
  }
};

// Get user's applied courses
export const getUserApplications = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse> => {
  try {
    const userId = getUserId();

    if (!userId) {
      throw new Error("Please login to view applications");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/my-applications/${userId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

// Get specific application by ID
export const getApplicationById = async (
  applicationId: string
): Promise<ApiResponse> => {
  try {
    const userId = getUserId();

    if (!userId) {
      throw new Error("Please login to view application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}/${userId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

// Update application status
export const updateApplication = async (
  applicationId: string,
  updateData: UpdateData
): Promise<ApiResponse> => {
  try {
    const userId = getUserId();

    if (!userId) {
      throw new Error("Please login to update application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          ...updateData,
          userId: userId,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

// Delete application
export const deleteApplication = async (
  applicationId: string
): Promise<ApiResponse> => {
  try {
    const userId = getUserId();

    if (!userId) {
      throw new Error("Please login to delete application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          userId: userId,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

// Hook version for use in React components
export const useAppliedScholarships = () => {
  const { user, isAuthenticated } = useUserStore();

  const applyCourseWithHook = async (
    courseData: CourseData
  ): Promise<ApiResponse> => {
    if (!isAuthenticated || !user?._id) {
      throw new Error("Please login to apply for courses");
    }

    // Ensure all required fields have values
    const applicationPayload = {
      userId: user._id,
      scholarshipName:
        courseData.scholarshipName ||
        courseData.courseName ||
        "Scholarship Application",
      hostCountry: courseData.hostCountry || "Not specified",
      banner: courseData.banner || "",
      courseName: courseData.courseName || "Not specified",
      duration: courseData.duration || "Not specified",
      language: courseData.language || "Not specified",
      universityName: courseData.universityName || "Not specified",
      scholarshipType: courseData.scholarshipType || "Not specified",
      deadline: courseData.deadline || "Not specified",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/apply`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(applicationPayload),
      }
    );
    console.log("Debug - API Response for applyCourse:", response);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Application failed");
    }

    // Update user store after successful application
    if (result.success && result.application) {
      try {
        const store = useUserStore.getState();
        // Add the new application to the store
        await store.addAppliedScholarshipCourse(result.application);
        console.log(
          "Successfully updated user store with new application via hook"
        );

        // Also refresh the applications to ensure sync
        await store.refreshApplications();
      } catch (storeError) {
        console.error("Error updating user store via hook:", storeError);
        // Don't throw here, as the application was successful
      }
    }

    return result;
  };

  const getUserApplicationsWithHook = async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse> => {
    if (!isAuthenticated || !user?._id) {
      throw new Error("Please login to view applications");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/my-applications/${user._id}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  };

  const getApplicationByIdWithHook = async (
    applicationId: string
  ): Promise<ApiResponse> => {
    if (!isAuthenticated || !user?._id) {
      throw new Error("Please login to view application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}/${user._id}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  };

  const updateApplicationWithHook = async (
    applicationId: string,
    updateData: UpdateData
  ): Promise<ApiResponse> => {
    if (!isAuthenticated || !user?._id) {
      throw new Error("Please login to update application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          ...updateData,
          userId: user._id,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  };

  const deleteApplicationWithHook = async (
    applicationId: string
  ): Promise<ApiResponse> => {
    if (!isAuthenticated || !user?._id) {
      throw new Error("Please login to delete application");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/${applicationId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          userId: user._id,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  };

  return {
    applyCourse: applyCourseWithHook,
    getUserApplications: getUserApplicationsWithHook,
    getApplicationById: getApplicationByIdWithHook,
    updateApplication: updateApplicationWithHook,
    deleteApplication: deleteApplicationWithHook,
    isAuthenticated,
    userId: user?._id,
    user,
  };
};

// Debug function to check user authentication from store
export const checkAuthFromStore = async (): Promise<{
  isAuthenticated: boolean;
  userId: string | undefined;
  user: {
    isAuthenticated: boolean;
    hasUser: boolean;
    userId: string | undefined;
    userEmail: string | undefined;
  } | null;
}> => {
  const token = getAuthToken();
  let storeData: {
    isAuthenticated: boolean;
    hasUser: boolean;
    userId: string | undefined;
    userEmail: string | undefined;
  } | null = null;

  if (typeof window !== "undefined") {
    try {
      const state = useUserStore.getState();
      storeData = {
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        userId: state.user?._id,
        userEmail: state.user?.email,
      };
    } catch (error) {
      console.error("Error accessing store:", error);
    }
  }

  console.log("Store Auth Debug:", {
    ...storeData,
    hasToken: !!token,
    token: token ? `${token.substring(0, 10)}...` : null,
  });

  return {
    isAuthenticated: !!(storeData?.isAuthenticated && storeData?.userId),
    userId: storeData?.userId,
    user: storeData,
  };
};
