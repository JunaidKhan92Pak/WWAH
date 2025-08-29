import { User, AcademicInfo, PaymentInfo, WorkExp } from "@/types/reffertypes";
import { deleteAuthToken, getAuthToken } from "@/utils/authHelper";
import { create } from "zustand";

export interface DetailedInfo {
  AcademicInformation: AcademicInfo;
  paymentInformation: PaymentInfo;
  workExperience: WorkExp;
}

export interface UserStore {
  user: User | null;
  detailedInfo: DetailedInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticate: boolean;
  lastUpdated?: string;
  embeddingUpdateStatus?: "success" | "error";
  lastEmbeddingUpdate?: string | null;

  // Actions
  fetchUserProfile: (token: string | null) => Promise<void>;
  updateDetailedInfo: (updateData: Partial<DetailedInfo>) => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  setUser: (user: User) => void;
  logout: () => void;
  clearError: () => void;
  getLastUpdatedDate: () => string | null;
  // Add new method for updating user images
  updateUserImages: (imageData: {
    profilePicture?: string;
    coverPhoto?: string;
  }) => void;
}

const defaultDetailedInfo: DetailedInfo = {
  AcademicInformation: {
    currentDegree: "",
    program: "",
    uniName: "",
    currentSemester: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  paymentInformation: {
    preferredPaymentMethod: "",
    bankAccountTitle: "",
    bankName: "",
    accountNumberIban: "",
    mobileWalletNumber: "",
    accountHolderName: "",
    termsAndAgreement: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  workExperience: {
    hasWorkExperience: false,
    hasBrandAmbassador: false,
    jobDescription: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const useRefUserStore = create<UserStore>((set, get) => ({
  user: null,
  detailedInfo: null,
  loading: false,
  isAuthenticate: false,
  error: null,
  lastUpdated: undefined,
  embeddingUpdateStatus: undefined,
  lastEmbeddingUpdate: null,

  fetchUserProfile: async (token) => {
    console.log("=== ZUSTAND: FETCHING USER PROFILE ===");
    console.log("Token provided:", token ? "Yes" : "No");

    if (!token) {
      console.log("No token provided, setting unauthorized");
      set({ error: "No authentication token provided", isAuthenticate: false });
      return;
    }

    try {
      set({ loading: true, error: null });

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}refProfile`;
      console.log("Making request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Profile fetch response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`
        );
      }

      const userData = await response.json();
      console.log("Raw user data from API:", userData);

      // Validate response structure
      if (!userData || typeof userData !== "object") {
        throw new Error("Invalid user data received from server");
      }

      // Transform backend response to match frontend expectations
      const transformedDetailedInfo: DetailedInfo = {
        AcademicInformation: userData.AcademmicInfo || {
          currentDegree: "",
          program: "",
          uniName: "",
          currentSemester: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        paymentInformation: userData.paymentInfo || {
          preferredPaymentMethod: "",
          bankAccountTitle: "",
          bankName: "",
          accountNumberIban: "",
          mobileWalletNumber: "",
          accountHolderName: "",
          termsAndAgreement: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        workExperience: userData.workExp || {
          hasWorkExperience: false,
          hasBrandAmbassador: false,
          jobDescription: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const user: User = {
        _id: userData.user?._id || "",
        firstName: userData.user?.firstName || "",
        lastName: userData.user?.lastName || "",
        email: userData.user?.email || "",
        phone: userData.user?.phone || 0,
        facebook: userData.user?.facebook || "",
        instagram: userData.user?.instagram || "",
        linkedin: userData.user?.linkedin || "",
        contactNo: userData.user?.contactNo || "",
        dob: userData.user?.dob || "",
        country: userData.user?.country || "",
        nationality: userData.user?.nationality || "",
        gender: userData.user?.gender || "",
        city: userData.user?.city || "",
        createdAt: userData.user?.createdAt || "",
        updatedAt: userData.user?.updatedAt || "",
        countryCode: userData.user?.countryCode || "",
        // Fixed field names to match database
        profilePicture: userData.user?.profilePicture || "",
        coverPhoto: userData.user?.coverPhoto || "",
      };

      console.log("Transformed user data:", {
        id: user._id,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      set({
        user,
        loading: false,
        detailedInfo: transformedDetailedInfo,
        isAuthenticate: true,
        error: null,
      });

      console.log("User profile set in store successfully");
    } catch (error) {
      console.error("=== ZUSTAND: PROFILE FETCH ERROR ===");
      console.error("Error details:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile",
        loading: false,
        isAuthenticate: false,
        user: null,
        detailedInfo: null,
      });
    }
  },

  updateDetailedInfo: async (
    updateData: Partial<DetailedInfo>
  ): Promise<boolean> => {
    console.log("=== ZUSTAND: UPDATING DETAILED INFO ===");
    console.log("Update data:", updateData);

    const token = getAuthToken();
    if (!token) {
      console.log("No auth token found");
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refProfile/update`,
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
              // Update timestamps for modified sections
              ...(updateData.AcademicInformation && {
                AcademicInformation: {
                  ...state.detailedInfo.AcademicInformation,
                  ...updateData.AcademicInformation,
                  updatedAt: new Date(),
                },
              }),
              ...(updateData.paymentInformation && {
                paymentInformation: {
                  ...state.detailedInfo.paymentInformation,
                  ...updateData.paymentInformation,
                  updatedAt: new Date(),
                },
              }),
              ...(updateData.workExperience && {
                workExperience: {
                  ...state.detailedInfo.workExperience,
                  ...updateData.workExperience,
                  updatedAt: new Date(),
                },
              }),
            }
          : {
              ...defaultDetailedInfo,
              ...updateData,
            },
        loading: false,
        lastUpdated: currentTimestamp,
        error: null,
        embeddingUpdateStatus:
          result.embeddingUpdate === "success" ? "success" : "error",
        lastEmbeddingUpdate:
          result.embeddingUpdate === "success" ? currentTimestamp : null,
      }));

      return true;
    } catch (error) {
      console.error("Error updating detailed info:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
        embeddingUpdateStatus: "error",
      });
      return false;
    }
  },

  updateUserProfile: async (userData: Partial<User>): Promise<boolean> => {
    console.log("=== ZUSTAND: UPDATING USER PROFILE ===");
    console.log("User data to update:", userData);

    const token = getAuthToken();
    if (!token) {
      console.log("No auth token found");
      set({ error: "No authentication token found" });
      return false;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refProfile/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ user: userData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update user profile: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update user profile");
      }

      const currentTimestamp = new Date().toISOString();

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              ...userData,
              updatedAt: currentTimestamp,
            }
          : null,
        loading: false,
        lastUpdated: currentTimestamp,
        error: null,
      }));

      console.log("User profile updated successfully in store");
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      });
      return false;
    }
  },

  // New method to update user images in store
  updateUserImages: (imageData: {
    profilePicture?: string;
    coverPhoto?: string;
  }) => {
    console.log("=== ZUSTAND: UPDATING USER IMAGES IN STORE ===");
    console.log("Image data:", imageData);

    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...imageData,
            updatedAt: new Date().toISOString(),
          }
        : null,
    }));
  },

  getLastUpdatedDate: () => {
    const state = get();
    if (state.lastUpdated) {
      return new Date(state.lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return null;
  },

  setUser: (user) => {
    console.log("=== ZUSTAND: SETTING USER ===");
    console.log("User data:", {
      id: user?._id,
      profilePicture: user?.profilePicture,
      coverPhoto: user?.coverPhoto,
    });

    set({
      user,
      isAuthenticate: !!user,
      error: null,
    });
  },

  logout: () => {
    console.log("=== ZUSTAND: LOGGING OUT ===");
    deleteAuthToken();
    set({
      user: null,
      detailedInfo: null,
      isAuthenticate: false,
      loading: false,
      error: null,
      lastUpdated: undefined,
      embeddingUpdateStatus: undefined,
      lastEmbeddingUpdate: null,
    });
  },

  clearError: () => set({ error: null }),
}));
