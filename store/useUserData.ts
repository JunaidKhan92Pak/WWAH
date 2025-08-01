//store/useUserData.ts
import { create } from "zustand";
import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";

// Course interface (you might want to move this to a separate types file)
interface FavoriteCourse {
  _id: string;
  course_title: string;
  universityData?: {
    university_name: string;
    universityImages: {
      logo: string;
      banner: string;
    };
  };
  countryname: string;
  intake: string;
  duration: string;
  annual_tuition_fee: {
    amount: number;
    currency: string;
  };
  // Add other course properties as needed
}

// Basic user profile data
export interface User {
  appliedCourse: never[];
  favouriteCourse: FavoriteCourse[]; // Changed from never[] to FavoriteCourse[]
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

// Detailed profile information
export interface DetailedInfo {
  studyLevel: string;
  gradeType: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: {
    amount: number;
    currency: string;
  };
  tuitionFee: {
    amount: number;
    currency: string;
  };
  languageProficiency: {
    test: string;
    score: string;
  };
  workExperience: number;
  studyPreferenced: {
    country: string;
    degree: string;
    subject: string;
  };
  updatedAt: string;
}

// Complete user store interface
export interface UserStore {
  // State
  user: User | null;
  detailedInfo: DetailedInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updateData: Partial<User>) => Promise<void>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<void>;
  setUser: (userData: User) => void;
  logout: () => void;
}

// Helper function to get current date and time in ISO format
const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

// Default empty detailed
const defaultDetailedInfo: DetailedInfo = {
  livingCosts: { amount: 0, currency: "" },
  tuitionFee: { amount: 0, currency: "" },
  languageProficiency: { test: "", score: "" },
  studyPreferenced: { country: "", degree: "", subject: "" },
  studyLevel: "",
  gradeType: "",
  grade: 0,
  dateOfBirth: "",
  nationality: "",
  majorSubject: "",
  workExperience: 0,
  updatedAt: "",
};

// Create the unified store
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  detailedInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  fetchUserProfile: async () => {
    const token = getAuthToken();
    if (!token) {
      set({
        error: "No authentication token found",
        loading: false,
        isAuthenticated: false,
      });
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}profile/data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      console.log(response, "response from fetchUserProfile");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`
        );
      }

      const apiData = await response.json();
      console.log(apiData, "apiData from fetchUserProfile");

      if (!apiData.success) {
        throw new Error(apiData.message || "Failed to fetch user data");
      }

      // Set user data and detailed info
      set({
        user: {
          ...apiData.user,
          favouriteCourse: apiData.user.favouriteCourse || [], // Ensure it's always an array
        },
        detailedInfo: apiData.detailedInfo || { ...defaultDetailedInfo },
        loading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  updateUserProfile: async (updateData) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/update-personal-infomation`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      console.log(response, "response from updateUserProfile");

      if (!response.ok) {
        alert("Error updating profile. Please try again.");
        throw new Error(
          `Failed to update profile: ${response.status} ${response.statusText}`
        );
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      // Update the local store with new user data and current timestamp
      const currentDateTime = getCurrentDateTime();
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              ...updateData,
              updatedAt: currentDateTime,
            }
          : null,
        // Also update detailedInfo updatedAt to keep them in sync
        detailedInfo: state.detailedInfo
          ? {
              ...state.detailedInfo,
              updatedAt: currentDateTime,
            }
          : null,
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      });
    }
  },

  updateDetailedInfo: async (updateData) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    try {
      set({ loading: true, error: null });
      // Format the data structure as expected by your API
      const apiUpdateData = {
        detailedInfo: updateData,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}success-chance/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(apiUpdateData.detailedInfo),
        }
      );
      console.log(response, "response from updateDetailedInfo");
      const result = await response.json();
      const res = result.success;
      // Return the result for further processing if needed
      console.log(result, "result from updateDetailedInfo");
      if (!response.ok) {
        return res;
      }

      if (!result.success) {
        return res;
      }

      // Update the local store with new detailed info and current timestamp
      const currentDateTime = getCurrentDateTime();
      set((state) => ({
        detailedInfo: state.detailedInfo
          ? {
              ...state.detailedInfo,
              ...updateData,
              updatedAt: currentDateTime,
            }
          : {
              ...defaultDetailedInfo,
              ...updateData,
              updatedAt: currentDateTime,
            },
        // Also update user updatedAt to keep them in sync
        user: state.user
          ? {
              ...state.user,
              updatedAt: currentDateTime,
            }
          : null,
        loading: false,
      }));
      return res; // Return the result for further processing if needed
    } catch (error) {
      console.error("Error updating detailed info:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      });
    }
  },

  setUser: (userData) =>
    set({
      user: {
        ...userData,
        favouriteCourse: userData.favouriteCourse || [], // Ensure it's always an array
      },
      isAuthenticated: true,
    }),

  logout: () => {
    deleteAuthToken();
    set({
      user: null,
      detailedInfo: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },
}));
