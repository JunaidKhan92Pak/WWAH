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
  lastUpdated: string | null; // Add last updated timestamp
  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updateData: Partial<User>) => Promise<boolean>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<void>;
  setUser: (userData: User) => void;
  logout: () => void;
  getLastUpdatedDate: () => string | null; // Helper to get formatted last updated date
}

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
  lastUpdated: null,

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
      // console.log(response, "response from fetchUserProfile");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`
        );
      }

      const apiData = await response.json();
      // console.log(apiData, "apiData from fetchUserProfile");

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
        lastUpdated: apiData.user.updatedAt || new Date().toISOString(),
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
      return false;
    }

    try {
      set({ loading: true, error: null });
      
      // console.log("Sending update data:", updateData);
      // console.log("API URL:", `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/update-personal-infomation`);
      
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

      // console.log("Response status:", response.status);
      // console.log("Response headers:", response.headers);

      // Always try to get response text first for debugging
      const responseText = await response.text();
      // console.log("Raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      // console.log("Parsed result:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      if (!result.success) {
        throw new Error(result.message || "API returned success: false");
      }

      // Get current timestamp for update
      const currentTimestamp = new Date().toISOString();

      // Update the local store with new user data and timestamp
      set((state) => ({
        user: state.user ? { 
          ...state.user, 
          ...updateData,
          updatedAt: currentTimestamp // Update the user's updatedAt field
        } : null,
        loading: false,
        lastUpdated: currentTimestamp, // Update the store's lastUpdated field
        error: null,
      }));

      // console.log("Profile updated successfully");
      return true; // Return success
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      set({
        error: errorMessage,
        loading: false,
      });
      
      return false; // Return failure
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}success-chance/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData), // Send updateData directly, not nested
        }
      );
      
      // console.log(response, "response from updateDetailedInfo");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update detailed info: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      // console.log(result, "result from updateDetailedInfo");

      if (!result.success) {
        throw new Error(result.message || "Failed to update detailed info");
      }

      // Get current timestamp for update
      const currentTimestamp = new Date().toISOString();

      // Update the local store with new detailed info and timestamp
      set((state) => ({
        detailedInfo: state.detailedInfo
          ? { 
              ...state.detailedInfo, 
              ...updateData,
              updatedAt: currentTimestamp // Update the detailedInfo's updatedAt field
            }
          : { 
              ...defaultDetailedInfo, 
              ...updateData,
              updatedAt: currentTimestamp
            },
        loading: false,
        lastUpdated: currentTimestamp, // Update the store's lastUpdated field
        error: null,
      }));

      return result.success; // Return the result for further processing if needed
    } catch (error) {
      console.error("Error updating detailed info:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      });
      return false;
    }
  },

  setUser: (userData) =>
    set({
      user: {
        ...userData,
        favouriteCourse: userData.favouriteCourse || [], // Ensure it's always an array
      },
      isAuthenticated: true,
      lastUpdated: userData.updatedAt || new Date().toISOString(),
    }),

  logout: () => {
    deleteAuthToken();
    set({
      user: null,
      detailedInfo: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  },

  getLastUpdatedDate: () => {
    const state = get();
    if (!state.lastUpdated) return null;
    
    try {
      const date = new Date(state.lastUpdated);
      return date.toLocaleString(); // Returns formatted date string
    } catch (error) {
      console.error("Error formatting last updated date:", error);
      return null;
    }
  },
}));