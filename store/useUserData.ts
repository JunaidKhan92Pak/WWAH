import { deleteAuthToken } from "@/utils/authHelper";
import { create } from "zustand";

// Core user profile data types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

// API response structures
interface ApiLanguageProficiency {
  test: string;
  score: string;
}

interface ApiStudyPreference {
  country: string;
  degree: string;
  subject: string;
}
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
  languageProficiency: ApiLanguageProficiency;
  workExperience: number;
  studyPreferenced: ApiStudyPreference;
}
export interface UserData {
  user: User;
}

// Store interface
export interface UserStore {
  user: UserData | null;
  detailedInfo: DetailedInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  fetchUserProfile: (token: string) => Promise<void>;
  // updateUserProfile: (token: string, updateData: Partial<UserData>) => Promise<void>;
  setUser: (userData: UserData) => void;
  logout: () => void;
}

// Create the store
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  detailedInfo: null,
  isAuthenticated: false,

  fetchUserProfile: async (token) => {
    if (!token) {
      set({ error: "No authentication token provided" });
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

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
      }

      const apiData = await response.json();
      if (!apiData.success) {
        throw new Error(apiData.message || "Failed to fetch user data");
      }
      console.log(apiData, "api");

      // Transform API response to match our UserData structure
      const userData: UserData = { user: apiData.user }
      // Store success chances data if available
      const detailedInfo: DetailedInfo | null = apiData?.detailedInfo || {
        livingCosts: { amount: 0, currency: '' },
        tuitionFee: { amount: 0, currency: '' },
        languageProficiency: { test: '', score: '' },
        studyPreferenced: { country: '', degree: '', subject: '' },
        studyLevel: '',
        gradeType: '',
        grade: 0,
        dateOfBirth: '',
        nationality: '',
        majorSubject: '',
        workExperience: 0,
      }
      set({
        user: userData,
        detailedInfo: detailedInfo,
        loading: false,
        isAuthenticated: true,
        error: null
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
      set({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
        isAuthenticated: false
      });
    }
  },

  // updateUserProfile: async (token, updateData) => {
  //   if (!token) {
  //     set({ error: "No authentication token provided" });
  //     return;
  //   }

  //   try {
  //     set({ loading: true, error: null });

  //     // Prepare data structure expected by backend
  //     const apiUpdateData = {
  //       basicInfo: {},
  //       detailedInfo: {}
  //     };

  //     // Map user basic info if it exists
  //     if (updateData.user) {
  //       apiUpdateData.basicInfo = {
  //         firstName: updateData.user.firstName,
  //         lastName: updateData.user.lastName,
  //         phone: updateData.user.phone,
  //         email: updateData.user.email,
  //         dob: updateData.user.dob,
  //         country: updateData.user.country,
  //         nationality: updateData.user.nationality,
  //         gender: updateData.user.gender,
  //         city: updateData.user.city,
  //         countryCode: updateData.user.countryCode,
  //       };
  //     }

  //     // Map academic info if it exists
  //     if (updateData.academicInfo) {
  //       apiUpdateData.detailedInfo.AcademicInfo = {
  //         studyLevel: updateData.academicInfo.highestQualification,
  //         gradeType: updateData.academicInfo.previousGradingScale,
  //         grade: parseFloat(updateData.academicInfo.previousGradingScore) || 0,
  //         majorSubject: updateData.academicInfo.majorSubject
  //       };
  //     }

  //     // Map personal info if it exists
  //     if (updateData.user || updateData.workExp) {
  //       apiUpdateData.detailedInfo.PersonalInfo = {
  //         dateOfBirth: updateData.user?.dob || "",
  //         nationality: updateData.user?.nationality || "",
  //         workExperience: updateData.workExp?.duration || 0
  //       };
  //     }

  //     // Map financial info if it exists
  //     if (updateData.userPref) {
  //       apiUpdateData.detailedInfo.FinancialInfo = {
  //         livingCosts: {
  //           amount: parseFloat(updateData.userPref.livingCost) || 0,
  //           currency: updateData.userPref.currency || "USD"
  //         },
  //         tuitionFee: {
  //           amount: parseFloat(updateData.userPref.tuitionFees) || 0,
  //           currency: updateData.userPref.currency || "USD"
  //         }
  //       };
  //     }

  //     // Map language proficiency if it exists
  //     if (updateData.languageProf) {
  //       apiUpdateData.detailedInfo.LanguageProf = {
  //         test: updateData.languageProf.proficiencyTest || "",
  //         score: updateData.languageProf.proficiencyTestScore || ""
  //       };
  //     }

  //     // Map study preferences if it exists
  //     if (updateData.userPref) {
  //       apiUpdateData.detailedInfo.UserPref = {
  //         country: updateData.userPref.preferredCountry || "",
  //         degree: updateData.userPref.degreeLevel || "",
  //         subject: updateData.userPref.fieldOfStudy || ""
  //       };
  //     }

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}profile/update`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify(apiUpdateData)
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Failed to update user profile: ${response.status} ${response.statusText}`);
  //     }

  //     const result = await response.json();

  //     if (!result.success) {
  //       throw new Error(result.message || "Failed to update profile");
  //     }

  //     // Refresh user data after successful update
  //     await get().fetchUserProfile(token);

  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     set({
  //       error: error instanceof Error ? error.message : "Unknown error occurred",
  //       loading: false
  //     });
  //   }
  // },

  setUser: (userData) => set({
    user: userData,
    isAuthenticated: !!userData
  }),

  logout: () => {
    deleteAuthToken();
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      detailedInfo: null,
      error: null
    });
  }
}));