import { create } from "zustand";
import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";

// University interface
interface FavoriteUniversity {
  _id: string;
  university_name: string;
  country_name: string;
  university_type: string;
  qs_world_university_ranking: string;
  acceptance_rate: string | number;
  universityImages: {
    logo: string;
    banner: string;
  };
}

// Course interface
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
}

// Scholarship interface - updated to match your API response
interface FavoriteScholarship {
  _id: string;
  name: string;
  banner?: string;
  logo?: string;
  minRequirements?: string;
  description?: string;
  amount?: number;
  deadline?: string;
  eligibility?: string[];
  university?: string;
  hostCountry?: string;
  country?: string;
  category?: string;
  type?: string;
  duration?: string;
  programs?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Basic user profile data
export interface User {
  favouriteScholarship: string[]; // Changed to array of IDs to match your logic
  favouriteCourse: FavoriteCourse[];
  favourite: FavoriteCourse[];
  favouriteUniversity: string[]; // Array of university IDs
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
  lastUpdated: string | null;

  // Favorite universities state
  favoriteUniversities: Record<string, FavoriteUniversity>;
  favoriteUniversityIds: string[];
  loadingFavorites: boolean;

  // Favorite scholarships state
  favoriteScholarships: Record<string, FavoriteScholarship>;
  favoriteScholarshipIds: string[];
  loadingScholarships: boolean;

  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updateData: Partial<User>) => Promise<boolean>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<void>;
  setUser: (userData: User) => void;
  logout: () => void;
  getLastUpdatedDate: () => string | null;

  // Favorite universities actions
  fetchFavoriteUniversities: () => Promise<void>;
  toggleUniversityFavorite: (
    universityId: string,
    action: "add" | "remove"
  ) => Promise<boolean>;
  getFavoriteStatus: (universityId: string) => boolean;

  // Favorite scholarships actions
  fetchFavoriteScholarships: () => Promise<void>;
  toggleScholarshipFavorite: (
    scholarshipId: string,
    action: "add" | "remove"
  ) => Promise<boolean>;
  getScholarshipFavoriteStatus: (scholarshipId: string) => boolean;
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

  // Favorite universities state
  favoriteUniversities: {},
  favoriteUniversityIds: [],
  loadingFavorites: false,

  // Favorite scholarships state
  favoriteScholarships: {},
  favoriteScholarshipIds: [],
  loadingScholarships: false,

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

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`
        );
      }

      const apiData = await response.json();

      if (!apiData.success) {
        throw new Error(apiData.message || "Failed to fetch user data");
      }

      const userData: User = {
        ...apiData.user,
        favouriteScholarship: Array.isArray(apiData.user.favouriteScholarship)
          ? apiData.user.favouriteScholarship
          : [],
        favouriteCourse: Array.isArray(apiData.user.favouriteCourse)
          ? apiData.user.favouriteCourse
          : [],
        favourite: Array.isArray(apiData.user.favourite)
          ? apiData.user.favourite
          : [],
        favouriteUniversity: Array.isArray(apiData.user.favouriteUniversity)
          ? apiData.user.favouriteUniversity
          : [],
      };

      // Set user data and update favorite IDs
      set({
        user: userData,
        detailedInfo: apiData.detailedInfo || { ...defaultDetailedInfo },
        loading: false,
        isAuthenticated: true,
        error: null,
        lastUpdated: apiData.user.updatedAt || new Date().toISOString(),
        favoriteUniversityIds: userData.favouriteUniversity,
        favoriteScholarshipIds: userData.favouriteScholarship,
      });

      // Fetch favorite universities details if there are any
      if (userData.favouriteUniversity.length > 0) {
        get().fetchFavoriteUniversities();
      }

      // Fetch favorite scholarships details if there are any
      if (userData.favouriteScholarship.length > 0) {
        get().fetchFavoriteScholarships();
      }
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

  fetchFavoriteUniversities: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    try {
      set({ loadingFavorites: true });

      const response = await fetch("/api/universities/favourites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch favorite universities: ${response.status}`
        );
      }

      const result = await response.json();
      // console.log(result, "Favorite universities result");

      if (result.success) {
        set({
          favoriteUniversities: result.favouriteUniversitiesMap || {},
          favoriteUniversityIds: result.favouriteUniversityIds || [],
          loadingFavorites: false,
        });
      } else {
        throw new Error(
          result.message || "Failed to fetch favorite universities"
        );
      }
    } catch (error) {
      console.error("Error fetching favorite universities:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingFavorites: false,
      });
    }
  },

  // Updated fetchFavoriteScholarships function for your store
  // Replace your fetchFavoriteScholarships method in the store with this:

  fetchFavoriteScholarships: async () => {
    const state = get();
    const token = getAuthToken();

    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    if (
      !state.favoriteScholarshipIds ||
      state.favoriteScholarshipIds.length === 0
    ) {
      console.log("No favorite scholarship IDs found, setting empty state");
      set({ favoriteScholarships: {}, loadingScholarships: false });
      return;
    }

    try {
      set({ loadingScholarships: true });
      // console.log(
      //   "Fetching scholarships for IDs:",
      //   state.favoriteScholarshipIds
      // );

      // FIXED: Use the correct API endpoint that matches your actual API file
      const idsString = state.favoriteScholarshipIds.join(",");
      const response = await fetch(`/api/getfavscholarship?ids=${idsString}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch favorite scholarships: ${response.status}`
        );
      }

      const result = await response.json();
      // console.log("API Response:", result);

      if (result.success && result.scholarships) {
        // Convert array to map for easy lookup with proper field mapping
        const scholarshipsMap: Record<string, FavoriteScholarship> = {};

        result.scholarships.forEach((scholarship: any) => {
          // FIXED: Map all fields correctly including field name mismatches
          const transformedScholarship: FavoriteScholarship = {
            _id: scholarship._id,
            name: scholarship.name || "Unknown Scholarship",
            banner: scholarship.banner,
            logo: scholarship.logo,
            // FIXED: Handle both field names
            minRequirements:
              scholarship.minRequirements ||
              scholarship.minimumRequirements ||
              "Not specified",
            description: scholarship.description,
            amount: scholarship.amount,
            deadline: scholarship.deadline || "Not specified",
            eligibility: scholarship.eligibility || [],
            university: scholarship.university,
            hostCountry: scholarship.hostCountry || scholarship.country,
            country: scholarship.country,
            category: scholarship.category,
            type: scholarship.type || "Not specified",
            duration: scholarship.duration,
            // FIXED: Handle programs field - convert array to string if needed
            programs: Array.isArray(scholarship.programs)
              ? scholarship.programs.join(", ")
              : scholarship.programs || "Not specified",
            createdAt: scholarship.createdAt,
            updatedAt: scholarship.updatedAt,
          };

          scholarshipsMap[scholarship._id] = transformedScholarship;
        });

        // console.log("Transformed scholarships map:", scholarshipsMap);
        console.log(
          "Number of scholarships in map:",
          Object.keys(scholarshipsMap).length
        );

        set({
          favoriteScholarships: scholarshipsMap,
          loadingScholarships: false,
          error: null,
        });
      } else {
        // console.error("API response unsuccessful:", result);
        throw new Error(
          result.message || "Failed to fetch favorite scholarships"
        );
      }
    } catch (error) {
      console.error("Error fetching favorite scholarships:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingScholarships: false,
      });
    }
  },

  toggleUniversityFavorite: async (
    universityId: string,
    action: "add" | "remove"
  ) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}universities/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UniversityId: universityId,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        set((state) => {
          const newFavoriteIds = result.favouriteUniversity || [];

          return {
            favoriteUniversityIds: newFavoriteIds,
            user: state.user
              ? {
                  ...state.user,
                  favouriteUniversity: newFavoriteIds,
                }
              : null,
          };
        });

        // Refresh favorite universities if we're removing and need to update the map
        if (action === "remove") {
          get().fetchFavoriteUniversities();
        }

        return true;
      } else {
        throw new Error(result.message || "Failed to update favorites");
      }
    } catch (error) {
      console.error("Error toggling university favorite:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },

  // NEW: Toggle scholarship favorite function
  toggleScholarshipFavorite: async (
    scholarshipId: string,
    action: "add" | "remove"
  ) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}scholarships/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarshipId,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update scholarship favorites");
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        set((state) => {
          const newFavoriteIds = result.favouriteScholarship || [];

          return {
            favoriteScholarshipIds: newFavoriteIds,
            user: state.user
              ? {
                  ...state.user,
                  favouriteScholarship: newFavoriteIds,
                }
              : null,
          };
        });

        // Refresh favorite scholarships if we're removing and need to update the map
        if (action === "remove") {
          get().fetchFavoriteScholarships();
        }

        return true;
      } else {
        throw new Error(
          result.message || "Failed to update scholarship favorites"
        );
      }
    } catch (error) {
      console.error("Error toggling scholarship favorite:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },

  getFavoriteStatus: (universityId: string) => {
    const state = get();
    return state.favoriteUniversityIds.includes(universityId);
  },

  // NEW: Get scholarship favorite status function
  getScholarshipFavoriteStatus: (scholarshipId: string) => {
    const state = get();
    return state.favoriteScholarshipIds.includes(scholarshipId);
  },

  updateUserProfile: async (updateData) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
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

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      if (!result.success) {
        throw new Error(result.message || "API returned success: false");
      }

      const currentTimestamp = new Date().toISOString();

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              ...updateData,
              updatedAt: currentTimestamp,
            }
          : null,
        loading: false,
        lastUpdated: currentTimestamp,
        error: null,
      }));

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      set({
        error: errorMessage,
        loading: false,
      });

      return false;
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
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update detailed info: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update detailed info");
      }

      const currentTimestamp = new Date().toISOString();

      set((state) => ({
        detailedInfo: state.detailedInfo
          ? {
              ...state.detailedInfo,
              ...updateData,
              updatedAt: currentTimestamp,
            }
          : {
              ...defaultDetailedInfo,
              ...updateData,
              updatedAt: currentTimestamp,
            },
        loading: false,
        lastUpdated: currentTimestamp,
        error: null,
      }));

      return result.success;
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
        favouriteCourse: userData.favouriteCourse || [],
        favouriteUniversity: userData.favouriteUniversity || [],
        favouriteScholarship: userData.favouriteScholarship || [],
      },
      isAuthenticated: true,
      lastUpdated: userData.updatedAt || new Date().toISOString(),
      favoriteUniversityIds: userData.favouriteUniversity || [],
      favoriteScholarshipIds: userData.favouriteScholarship || [],
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
      favoriteUniversities: {},
      favoriteUniversityIds: [],
      loadingFavorites: false,
      favoriteScholarships: {},
      favoriteScholarshipIds: [],
      loadingScholarships: false,
    });
  },

  getLastUpdatedDate: () => {
    const state = get();
    if (!state.lastUpdated) return null;

    try {
      const date = new Date(state.lastUpdated);
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting last updated date:", error);
      return null;
    }
  },
}));
