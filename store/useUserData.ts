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

// Scholarship interface
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

// Applied Scholarship Course interface
interface AppliedScholarshipCourse {
  _id: string;
  scholarshipName: string;
  hostCountry: string;
  banner?: string;
  courseName: string;
  duration: string;
  language: string;
  universityName: string;
  scholarshipType: string;
  deadline: string;
  status?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Basic user profile data
export interface User {
  favouriteScholarship: string[];
  favouriteCourse: FavoriteCourse[];
  favouriteUniversity: string[];
  appliedScholarshipCourses: AppliedScholarshipCourse[];
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

  // Applied scholarship courses state
  appliedScholarshipCourses: Record<string, AppliedScholarshipCourse>;
  appliedScholarshipCourseIds: string[];
  loadingApplications: boolean;

  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updateData: Partial<User>) => Promise<boolean>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<boolean>;
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

  // Applied scholarship courses actions
  fetchAppliedScholarshipCourses: () => Promise<void>;
  addAppliedScholarshipCourse: (
    applicationData: AppliedScholarshipCourse
  ) => Promise<boolean>;
  refreshApplications: () => Promise<void>;
}

// Default empty detailed info
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

  // Applied scholarship courses state
  appliedScholarshipCourses: {},
  appliedScholarshipCourseIds: [],
  loadingApplications: false,

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
        favouriteUniversity: Array.isArray(apiData.user.favouriteUniversity)
          ? apiData.user.favouriteUniversity
          : [],
        appliedScholarshipCourses: Array.isArray(
          apiData.user.appliedScholarshipCourses
        )
          ? apiData.user.appliedScholarshipCourses
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
        appliedScholarshipCourseIds: userData.appliedScholarshipCourses.map(
          (app: AppliedScholarshipCourse) => app._id
        ),
      });

      // Fetch favorite universities details if there are any
      if (userData.favouriteUniversity.length > 0) {
        get().fetchFavoriteUniversities();
      }

      // Fetch favorite scholarships details if there are any
      if (userData.favouriteScholarship.length > 0) {
        get().fetchFavoriteScholarships();
      }

      // Convert applied courses array to Record for the appliedScholarshipCourses state
      if (userData.appliedScholarshipCourses.length > 0) {
        const applicationsMap: Record<string, AppliedScholarshipCourse> = {};
        userData.appliedScholarshipCourses.forEach(
          (app: AppliedScholarshipCourse) => {
            applicationsMap[app._id] = app;
          }
        );

        set({
          appliedScholarshipCourses: applicationsMap,
        });
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

      if (result.success && result.scholarships) {
        const scholarshipsMap: Record<string, FavoriteScholarship> = {};

        result.scholarships.forEach((scholarship: any) => {
          const transformedScholarship: FavoriteScholarship = {
            _id: scholarship._id,
            name: scholarship.name || "Unknown Scholarship",
            banner: scholarship.banner,
            logo: scholarship.logo,
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
            programs: Array.isArray(scholarship.programs)
              ? scholarship.programs.join(", ")
              : scholarship.programs || "Not specified",
            createdAt: scholarship.createdAt,
            updatedAt: scholarship.updatedAt,
          };

          scholarshipsMap[scholarship._id] = transformedScholarship;
        });

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

  fetchAppliedScholarshipCourses: async () => {
    const state = get();
    const token = getAuthToken();

    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    try {
      set({ loadingApplications: true });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/my-applications/${state.user?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch applied scholarship courses: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success && result.applications) {
        const applicationsMap: Record<string, AppliedScholarshipCourse> = {};
        const applicationIds: string[] = [];

        result.applications.forEach((application: any) => {
          const transformedApplication: AppliedScholarshipCourse = {
            _id: application._id,
            banner: application.banner || "",
            scholarshipName:
              application.scholarshipName || "Unknown Scholarship",
            hostCountry: application.hostCountry || "Not specified",
            courseName: application.courseName || "Not specified",
            duration: application.duration || "Not specified",
            language: application.language || "Not specified",
            universityName: application.universityName || "Not specified",
            scholarshipType: application.scholarshipType || "Not specified",
            deadline: application.deadline || "Not specified",
            status: application.status || "pending",
            appliedAt: application.appliedAt,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
          };

          applicationsMap[application._id] = transformedApplication;
          applicationIds.push(application._id);
        });

        console.log(
          "Number of applications in map:",
          Object.keys(applicationsMap).length
        );

        // Update both the Record and the user's array
        set({
          appliedScholarshipCourses: applicationsMap,
          appliedScholarshipCourseIds: applicationIds,
          loadingApplications: false,
          error: null,
          user: state.user
            ? {
                ...state.user,
                appliedScholarshipCourses: Object.values(applicationsMap),
              }
            : null,
        });
      } else {
        throw new Error(
          result.message || "Failed to fetch applied scholarship courses"
        );
      }
    } catch (error) {
      console.error("Error fetching applied scholarship courses:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingApplications: false,
      });
    }
  },

  // Add applied scholarship course after successful application
  addAppliedScholarshipCourse: async (
    applicationData: AppliedScholarshipCourse
  ): Promise<boolean> => {
    try {
      if (applicationData._id) {
        const newApplication: AppliedScholarshipCourse = {
          _id: applicationData._id,
          banner: applicationData.banner || "",
          scholarshipName:
            applicationData.scholarshipName || "Unknown Scholarship",
          hostCountry: applicationData.hostCountry || "Not specified",
          courseName: applicationData.courseName || "Not specified",
          duration: applicationData.duration || "Not specified",
          language: applicationData.language || "Not specified",
          universityName: applicationData.universityName || "Not specified",
          scholarshipType: applicationData.scholarshipType || "Not specified",
          deadline: applicationData.deadline || "Not specified",
          status: applicationData.status || "pending",
          appliedAt: applicationData.appliedAt || new Date().toISOString(),
          createdAt: applicationData.createdAt,
          updatedAt: applicationData.updatedAt,
        };

        set((currentState) => ({
          appliedScholarshipCourseIds: [
            ...currentState.appliedScholarshipCourseIds,
            applicationData._id,
          ],
          appliedScholarshipCourses: {
            ...currentState.appliedScholarshipCourses,
            [applicationData._id]: newApplication,
          },
          user: currentState.user
            ? {
                ...currentState.user,
                appliedScholarshipCourses: [
                  ...currentState.user.appliedScholarshipCourses,
                  newApplication,
                ],
              }
            : null,
        }));

        console.log("Successfully added new application to store");
        return true;
      }

      console.warn("Application data missing _id, cannot add to store");
      return false;
    } catch (error) {
      console.error("Error adding application to store:", error);
      return false;
    }
  },

  refreshApplications: async () => {
    await get().fetchAppliedScholarshipCourses();
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

  getScholarshipFavoriteStatus: (scholarshipId: string) => {
    const state = get();
    return state.favoriteScholarshipIds.includes(scholarshipId);
  },

  updateUserProfile: async (updateData: Partial<User>): Promise<boolean> => {
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

  updateDetailedInfo: async (
    updateData: Partial<DetailedInfo>
  ): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
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

      return true;
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

  setUser: (userData: User) =>
    set({
      user: {
        ...userData,
        favouriteCourse: userData.favouriteCourse || [],
        favouriteUniversity: userData.favouriteUniversity || [],
        favouriteScholarship: userData.favouriteScholarship || [],
        appliedScholarshipCourses: userData.appliedScholarshipCourses || [],
      },
      isAuthenticated: true,
      lastUpdated: userData.updatedAt || new Date().toISOString(),
      favoriteUniversityIds: userData.favouriteUniversity || [],
      favoriteScholarshipIds: userData.favouriteScholarship || [],
      appliedScholarshipCourseIds:
        userData.appliedScholarshipCourses?.map(
          (app: AppliedScholarshipCourse) => app._id
        ) || [],
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
      appliedScholarshipCourses: {},
      appliedScholarshipCourseIds: [],
      loadingApplications: false,
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
