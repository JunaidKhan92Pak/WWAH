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
type UniversityData = {
  _id: string;
  name: string;
  country: string;
  // Add other university properties as needed
};
// Course interface for favorites
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

// Applied Course interface - ALIGNED WITH YOUR SCHEMA
export interface AppliedCourse {
  courseId: string;
  applicationStatus: number; // 1-7 numeric status (only field from your schema)
  isConfirmed: boolean; // ✅ NEW: Added confirmation field

  createdAt?: string;
  updatedAt?: string;
}

// Enhanced applied course with course details
export interface AppliedCourseWithDetails extends AppliedCourse {
  courseDetails: {
    _id: string;
    course_title: string;
    universityData?: any;
    countryname: string;
    intake?: string;
    duration?: string;
    annual_tuition_fee?: any;
    application_deadline?: string;
  };
}

export const getApplicationProgress = (applicationStatus: number): number => {
  return Math.round((applicationStatus / 7) * 100);
};

export const getApplicationSteps = () => [
  { step: 1, label: "Application Started", key: "started" },
  { step: 2, label: "Documents Prepared", key: "documentsReady" },
  { step: 3, label: "Application Submitted", key: "submitted" },
  { step: 4, label: "Under Review", key: "underReview" },
  { step: 5, label: "Interview Scheduled", key: "interview" },
  { step: 6, label: "Decision Pending", key: "pending" },
  { step: 7, label: "Final Decision", key: "decided" },
];

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
  applicationStatus: number;
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
  appliedDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // applicationStatus:number;
}

// Basic user profile data
export interface User {
  favouriteScholarship: string[];
  favouriteCourse: string[];
  favouriteUniversity: string[];
  appliedCourses: AppliedCourse[]; // Only courseId and applicationStatus
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

  // Favorite courses state
  favoriteCourses: Record<string, FavoriteCourse>;
  favoriteCourseIds: string[];
  loadingFavoriteCourses: boolean;

  // Applied courses state
  appliedCourses: Record<string, AppliedCourseWithDetails>;
  appliedCourseIds: string[];
  loadingAppliedCourses: boolean;

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

  // Favorite courses actions
  fetchFavoriteCourses: () => Promise<void>;
  toggleCourseFavorite: (
    courseId: string,
    action: "add" | "remove"
  ) => Promise<boolean>;
  getCourseFavoriteStatus: (courseId: string) => boolean;

  // Applied courses actions
  fetchAppliedCourses: () => Promise<void>;
  addAppliedCourse: (
    courseId: string,
    applicationStatus?: number
  ) => Promise<boolean>;
  updateAppliedCourse: (
    courseId: string,
    applicationStatus: number
  ) => Promise<boolean>;
  updateCourseConfirmation: (
    courseId: string,
    isConfirmed: boolean
  ) => Promise<boolean>;
  removeAppliedCourse: (courseId: string) => Promise<boolean>;
  getAppliedCourseStatus: (courseId: string) => boolean;
  getAppliedCourseDetails: (
    courseId: string
  ) => AppliedCourseWithDetails | null;

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
  fetchAppliedScholarship: (id: string) => Promise<void>;
  addAppliedScholarshipCourse: (
    applicationData: AppliedScholarshipCourse
  ) => Promise<boolean>;
  refreshApplications: () => Promise<void>;
  getApplicationProgress: (courseId: string) => number;
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

function normalizeAppliedCourses(appliedCourses: any[]): AppliedCourse[] {
  if (!Array.isArray(appliedCourses)) return [];

  return appliedCourses.map((item) => {
    // Handle old string format (fallback)
    if (typeof item === "string") {
      return {
        courseId: item,
        applicationStatus: 1, // Default to first status
        isConfirmed: false, // ✅ NEW: Default confirmation status
      };
    }

    // Handle object format - ONLY use schema fields
    return {
      courseId: item.courseId,
      applicationStatus: item.applicationStatus || 1,
      isConfirmed: item.isConfirmed || false, // ✅ NEW: Added isConfirmed field
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
}
// Create the unified store
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  detailedInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  lastUpdated: null,

  // Favorite courses state
  favoriteCourses: {},
  favoriteCourseIds: [],
  loadingFavoriteCourses: false,

  // Applied courses state
  appliedCourses: {},
  appliedCourseIds: [],
  loadingAppliedCourses: false,

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

      // Normalize applied courses from backend
      const normalizedAppliedCourses = normalizeAppliedCourses(
        apiData.user.appliedCourses || []
      );

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
        appliedCourses: normalizedAppliedCourses,
        appliedScholarshipCourses: Array.isArray(
          apiData.user.appliedScholarshipCourses
        )
          ? apiData.user.appliedScholarshipCourses
          : [],
      };

      // Set user data and update IDs
      set({
        user: userData,
        detailedInfo: apiData.detailedInfo || { ...defaultDetailedInfo },
        loading: false,
        isAuthenticated: true,
        error: null,
        lastUpdated: apiData.user.updatedAt || new Date().toISOString(),
        favoriteCourseIds: userData.favouriteCourse,
        appliedCourseIds: normalizedAppliedCourses.map(
          (course) => course.courseId
        ),
        favoriteUniversityIds: userData.favouriteUniversity,
        favoriteScholarshipIds: userData.favouriteScholarship,
        appliedScholarshipCourseIds: userData.appliedScholarshipCourses.map(
          (app: AppliedScholarshipCourse) => app._id
        ),
      });

      // Fetch details for favorite courses if there are any
      if (userData.favouriteCourse.length > 0) {
        get().fetchFavoriteCourses();
      }

      // Fetch details for applied courses if there are any
      if (normalizedAppliedCourses.length > 0) {
        get().fetchAppliedCourses();
      }

      // Fetch favorite universities details if there are any
      if (userData.favouriteUniversity.length > 0) {
        get().fetchFavoriteUniversities();
      }

      // Fetch favorite scholarships details if there are any
      if (userData.favouriteScholarship.length > 0) {
        get().fetchFavoriteScholarships();
      }

      // Convert applied scholarship courses array to Record
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

  fetchFavoriteCourses: async () => {
    const state = get();
    const token = getAuthToken();

    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    if (!state.favoriteCourseIds || state.favoriteCourseIds.length === 0) {
      console.log("No favorite course IDs found, setting empty state");
      set({ favoriteCourses: {}, loadingFavoriteCourses: false });
      return;
    }

    try {
      set({ loadingFavoriteCourses: true });

      const idsString = state.favoriteCourseIds.join(",");
      const response = await fetch(
        `/api/courses?type=favourite&ids=${idsString}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch favorite courses: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.favouriteCourses) {
        const coursesMap: Record<string, FavoriteCourse> = {};

        result.favouriteCourses.forEach((course: any) => {
          coursesMap[course._id] = {
            _id: course._id,
            course_title: course.course_title,
            universityData: course.universityData,
            countryname: course.countryname,
            intake: course.intake,
            duration: course.duration,
            annual_tuition_fee: course.annual_tuition_fee,
          };
        });

        set({
          favoriteCourses: coursesMap,
          loadingFavoriteCourses: false,
          error: null,
        });
      } else {
        throw new Error(result.message || "Failed to fetch favorite courses");
      }
    } catch (error) {
      console.error("Error fetching favorite courses:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingFavoriteCourses: false,
      });
    }
  },

  // Updated fetchAppliedCourses method in your Zustand store
  fetchAppliedCourses: async () => {
    console.log("Fetching applied courses...");
    const state = get();
    const token = getAuthToken();

    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    try {
      set({ loadingAppliedCourses: true, error: null });

      // Step 1: Fetch applied courses with tracking data from your backend
      const appliedCoursesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!appliedCoursesResponse.ok) {
        throw new Error(
          `Failed to fetch applied courses: ${appliedCoursesResponse.status}`
        );
      }

      const appliedCoursesResult = await appliedCoursesResponse.json();

      if (
        !appliedCoursesResult.success ||
        !appliedCoursesResult.data?.appliedCourses
      ) {
        console.log("No applied courses found, setting empty state");
        set({
          appliedCourses: {},
          appliedCourseIds: [],
          loadingAppliedCourses: false,
          user: state.user
            ? {
                ...state.user,
                appliedCourses: [],
              }
            : null,
        });
        return;
      }

      const appliedCoursesData = appliedCoursesResult.data.appliedCourses;
      console.log("Applied courses data:", appliedCoursesData);

      // Step 2: Update user state with the fetched applied courses
      set({
        user: state.user
          ? {
              ...state.user,
              appliedCourses: appliedCoursesData,
            }
          : null,
      });

      if (appliedCoursesData.length === 0) {
        set({
          appliedCourses: {},
          appliedCourseIds: [],
          loadingAppliedCourses: false,
        });
        return;
      }

      // Step 3: Prepare course IDs and tracking data for detailed course fetch
      const courseIds = appliedCoursesData.map(
        (course: any) => course.courseId
      );

      // Create tracking data map
      const trackingDataMap = new Map();
      appliedCoursesData.forEach((course: any) => {
        trackingDataMap.set(course.courseId, {
          applicationStatus: course.applicationStatus,
          isConfirmed: course.isConfirmed || false, // ✅ NEW: Added isConfirmed

          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        });
      });

      console.log("Course IDs to fetch details:", courseIds);

      // Step 4: Fetch detailed course information using your API
      const detailedCoursesResponse = await fetch(
        `/api/getfavouritecourse?ids=${encodeURIComponent(
          JSON.stringify(appliedCoursesData)
        )}&type=applied&includeApplicationData=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!detailedCoursesResponse.ok) {
        throw new Error(
          `Failed to fetch course details: ${detailedCoursesResponse.status}`
        );
      }

      const detailedCoursesResult = await detailedCoursesResponse.json();
      console.log("Detailed courses result:", detailedCoursesResult);

      if (
        detailedCoursesResult.success &&
        detailedCoursesResult.appliedCourses
      ) {
        // const coursesMap = {};
        const coursesMap: Record<string, AppliedCourseWithDetails> = {};

        const courseIdsList: string[] = [];
detailedCoursesResult.appliedCourses.forEach((course: any) => {
  const courseId = course._id;
  courseIdsList.push(courseId);

  const trackingData = trackingDataMap.get(courseId);

  coursesMap[courseId] = {
    courseId: courseId,
    applicationStatus: trackingData?.applicationStatus || 1,
    isConfirmed: trackingData?.isConfirmed || false, // ✅ NEW: Added isConfirmed

    createdAt: trackingData?.createdAt,
    updatedAt: trackingData?.updatedAt,
    courseDetails: {
      _id: course._id,
      course_title: course.course_title,
      universityData: course.universityData,
      countryname: course.countryname,
      intake: course.intake || "",
      duration: course.duration || "",
      annual_tuition_fee: course.annual_tuition_fee || {
        amount: 0,
        currency: "USD",
      },
      application_deadline: course.application_deadline,
    },
  };
});

        console.log("Processed courses map:", coursesMap);

        set({
          appliedCourses: coursesMap,
          appliedCourseIds: courseIdsList,
          loadingAppliedCourses: false,
          error: null,
        });
      } else {
        // If detailed course fetch fails, still set the course IDs
        set({
          appliedCourseIds: courseIds,
          loadingAppliedCourses: false,
          error:
            "Failed to fetch detailed course information, but applied courses loaded",
        });
      }
    } catch (error) {
      console.error("Error fetching applied courses:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingAppliedCourses: false,
      });
    }
  },

  // ✅ FIXED: Updated fetchAppliedScholarship method in your Zustand store
  fetchAppliedScholarship: async (id: string) => {
    console.log("Fetching applied scholarship courses for userId:", id);
    const token = getAuthToken();

    if (!token) {
      set({ error: "No authentication token found" });
      return;
    }

    if (!id) {
      set({ error: "User ID is required" });
      return;
    }

    try {
      set({ loadingApplications: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedScholarshipCourses/my-applications/${id}`,
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
          `Failed to fetch applied scholarship courses: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("API Response Data:", result);

      if (result.success && result.data) {
        const applications = result.data.applications || [];
        console.log("Applications received:", applications);

        const applicationsMap: Record<string, AppliedScholarshipCourse> = {};
        const applicationIds: string[] = [];

        applications.forEach((application: any) => {
          if (application._id) {
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
              applicationStatus: application.applicationStatus || 1, // ✅ CRITICAL: Include this field
              appliedDate: application.appliedDate,
              createdAt: application.createdAt,
              updatedAt: application.updatedAt,
            };

            applicationsMap[application._id] = transformedApplication;
            applicationIds.push(application._id);
          }
        });

        console.log("✅ Processed applications with status:", {
          applicationsById: Object.keys(applicationsMap).map((id) => ({
            id,
            applicationStatus: applicationsMap[id].applicationStatus,
          })),
          applicationIds,
          count: applicationIds.length,
        });

        set({
          appliedScholarshipCourses: applicationsMap,
          appliedScholarshipCourseIds: applicationIds,
          loadingApplications: false,
          error: null,
        });
      } else {
        throw new Error(result.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applied scholarship courses:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loadingApplications: false,
        appliedScholarshipCourseIds: [],
      });
    }
  },

  toggleCourseFavorite: async (courseId: string, action: "add" | "remove") => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}courses/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course favorites");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => {
          const newFavoriteIds = result.favouriteCourse || [];

          return {
            favoriteCourseIds: newFavoriteIds,
            user: state.user
              ? {
                  ...state.user,
                  favouriteCourse: newFavoriteIds,
                }
              : null,
          };
        });

        if (action === "remove") {
          get().fetchFavoriteCourses();
        }

        return true;
      } else {
        throw new Error(result.message || "Failed to update course favorites");
      }
    } catch (error) {
      console.error("Error toggling course favorite:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },

  // Updated to only use schema fields
  addAppliedCourse: async (courseId: string, applicationStatus: number = 1) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}courses/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            action: "add",
            trackingData: {
              applicationStatus: applicationStatus,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to apply to course");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => {
          const newAppliedCourse: AppliedCourse = {
            courseId,
            applicationStatus,
            isConfirmed: false,
          };

          const updatedAppliedCourses = [
            ...(state.user?.appliedCourses || []),
            newAppliedCourse,
          ];

          return {
            user: state.user
              ? {
                  ...state.user,
                  appliedCourses: updatedAppliedCourses,
                }
              : null,
            appliedCourseIds: [...state.appliedCourseIds, courseId],
          };
        });

        // Refresh applied courses to get full details
        get().fetchAppliedCourses();
        return true;
      } else {
        throw new Error(result.message || "Failed to apply to course");
      }
    } catch (error) {
      console.error("Error adding applied course:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },

  updateAppliedCourse: async (courseId, applicationStatus) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/tracking/${courseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            applicationStatus: applicationStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update applied course");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => {
          // Update the user's appliedCourses array
          const updatedAppliedCourses =
            state.user?.appliedCourses.map((course) =>
              course.courseId === courseId
                ? {
                    ...course,
                    applicationStatus,
                    isConfirmed: course.isConfirmed,

                    updatedAt: new Date().toISOString(),
                  }
                : course
            ) || [];

          // Update the appliedCourses map with detailed information
          const updatedAppliedCoursesMap = {
            ...state.appliedCourses,
            [courseId]: {
              ...state.appliedCourses[courseId],
              applicationStatus,
              updatedAt: new Date().toISOString(),
            },
          };

          return {
            user: state.user
              ? {
                  ...state.user,
                  appliedCourses: updatedAppliedCourses,
                }
              : null,
            appliedCourses: updatedAppliedCoursesMap,
            error: null,
          };
        });

        return true;
      } else {
        throw new Error(result.message || "Failed to update applied course");
      }
    } catch (error) {
      console.error("Error updating applied course:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },
  updateCourseConfirmation: async (courseId: string, isConfirmed: boolean) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/confirm/${courseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isConfirmed: isConfirmed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course confirmation");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => {
          // Update the user's appliedCourses array
          const updatedAppliedCourses =
            state.user?.appliedCourses.map((course) =>
              course.courseId === courseId
                ? {
                    ...course,
                    isConfirmed,
                    updatedAt: new Date().toISOString(),
                  }
                : course
            ) || [];

          // Update the appliedCourses map with detailed information
          const updatedAppliedCoursesMap = {
            ...state.appliedCourses,
            [courseId]: {
              ...state.appliedCourses[courseId],
              isConfirmed,
              updatedAt: new Date().toISOString(),
            },
          };

          return {
            user: state.user
              ? {
                  ...state.user,
                  appliedCourses: updatedAppliedCourses,
                }
              : null,
            appliedCourses: updatedAppliedCoursesMap,
            error: null,
          };
        });

        return true;
      } else {
        throw new Error(
          result.message || "Failed to update course confirmation"
        );
      }
    } catch (error) {
      console.error("Error updating course confirmation:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },
  removeAppliedCourse: async (courseId) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}appliedCourses/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            courseId: courseId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove applied course");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => {
          const updatedAppliedCourses =
            state.user?.appliedCourses.filter(
              (course) => course.courseId !== courseId
            ) || [];

          return {
            user: state.user
              ? {
                  ...state.user,
                  appliedCourses: updatedAppliedCourses,
                }
              : null,
            appliedCourseIds: state.appliedCourseIds.filter(
              (id) => id !== courseId
            ),
            appliedCourses: Object.fromEntries(
              Object.entries(state.appliedCourses).filter(
                ([key]) => key !== courseId
              )
            ),
          };
        });

        return true;
      } else {
        throw new Error(result.message || "Failed to remove applied course");
      }
    } catch (error) {
      console.error("Error removing applied course:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
    }
  },

  getCourseFavoriteStatus: (courseId: string) => {
    const state = get();
    return state.favoriteCourseIds.includes(courseId);
  },

  getAppliedCourseStatus: (courseId: string) => {
    const state = get();
    return state.appliedCourseIds.includes(courseId);
  },

  getAppliedCourseDetails: (courseId: string) => {
    const state = get();
    return state.appliedCourses[courseId] || null;
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
            applicationStatus: application.applicationStatus || 1, // ✅ ADD THIS LINE

            appliedDate: application.appliedDate,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
          };

          applicationsMap[application._id] = transformedApplication;
          applicationIds.push(application._id);
        });

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

  addAppliedScholarshipCourse: async (applicationData: any) => {
    const state = get();

    // Update the user's appliedScholarshipCourses array with the new application ID
    if (applicationData._id) {
      set((currentState) => ({
        appliedScholarshipCourseIds: [
          ...currentState.appliedScholarshipCourseIds,
          applicationData._id,
        ],
        user: currentState.user
          ? {
              ...currentState.user,
              appliedScholarshipCourses: [
                ...currentState.user.appliedScholarshipCourses,
                applicationData._id,
              ],
            }
          : null,
        appliedScholarshipCourses: {
          ...currentState.appliedScholarshipCourses,
          [applicationData._id]: {
            _id: applicationData._id,
            scholarshipName: applicationData.scholarshipName,
            hostCountry: applicationData.hostCountry,
            courseName: applicationData.courseName,
            duration: applicationData.duration,
            language: applicationData.language,
            universityName: applicationData.universityName,
            scholarshipType: applicationData.scholarshipType,
            deadline: applicationData.deadline,
            status: applicationData.status || "pending",
            appliedAt: applicationData.appliedAt || new Date().toISOString(),
            createdAt: applicationData.createdAt,
            updatedAt: applicationData.updatedAt,
          },
        },
      }));
    }

    return true;
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
      favoriteCourses: {},
      favoriteCourseIds: [],
      loadingFavoriteCourses: false,
      appliedCourses: {},
      appliedCourseIds: [],
      loadingAppliedCourses: false,
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

  getApplicationProgress: (courseId: string) => {
    const state = get();
    const course = state.appliedCourses[courseId];
    if (!course) return 0;

    return Math.round((course.applicationStatus / 7) * 100);
  },
}));
