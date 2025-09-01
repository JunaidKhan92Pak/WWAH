import { User, AcademicInfo, PaymentInfo, WorkExp } from "@/types/reffertypes";
import { deleteAuthToken, getAuthToken } from "@/utils/authHelper";
import { create } from "zustand";

export interface Commission {
  _id: string;
  user: string;
  month: string;
  referrals: number;
  amount: number;
  status: "Paid" | "Pending" | "Requested";
  createdAt: string;
  updatedAt: string;
}

export interface DetailedInfo {
  AcademicInformation: AcademicInfo;
  paymentInformation: PaymentInfo;
  workExperience: WorkExp;
}

export interface UserStore {
  user: User | null;
  detailedInfo: DetailedInfo | null;
  commissions: Commission[];
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

  // Commission actions
  fetchCommissions: (userId: string) => Promise<void>;
  createCommission: (
    userId: string,
    commissionData: Omit<Commission, "_id" | "user" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateCommission: (
    userId: string,
    commissionId: string,
    updateData: Partial<Commission>
  ) => Promise<boolean>;
  deleteCommission: (userId: string, commissionId: string) => Promise<boolean>;
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
  commissions: [],
  loading: false,
  isAuthenticate: false,
  error: null,
  lastUpdated: undefined,
  embeddingUpdateStatus: undefined,
  lastEmbeddingUpdate: null,

  fetchUserProfile: async (token) => {
    console.log("Fetching user profile with token:", token);
    if (!token) {
      set({ error: "No authentication token provided", isAuthenticate: false });
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refProfile`,
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

      const userData = await response.json();

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
        Commission: userData.user?.Commissions || [],
      };

      console.log(user, "user from store");
      set({
        user,
        loading: false,
        detailedInfo: transformedDetailedInfo,
        isAuthenticate: true,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
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

  fetchCommissions: async (userId: string) => {
    if (!userId) {
      set({ error: "User ID is required to fetch commissions" });
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/commission/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch commissions: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        set({ commissions: result.data, loading: false });
      } else {
        set({ commissions: [], loading: false });
      }
    } catch (error) {
      console.error("Error fetching commissions:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch commissions",
        loading: false,
        commissions: [],
      });
    }
  },

  createCommission: async (
    userId: string,
    commissionData: Omit<Commission, "_id" | "user" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    if (!userId) {
      set({ error: "User ID is required to create commission" });
      return false;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/commission/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create commission");
      }

      const result = await response.json();

      if (result.success && result.data) {
        set((state) => ({
          commissions: [result.data, ...state.commissions],
          loading: false,
        }));
        return true;
      } else {
        throw new Error(result.message || "Failed to create commission");
      }
    } catch (error) {
      console.error("Error creating commission:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create commission",
        loading: false,
      });
      return false;
    }
  },

  updateCommission: async (
    userId: string,
    commissionId: string,
    updateData: Partial<Commission>
  ): Promise<boolean> => {
    if (!userId || !commissionId) {
      set({ error: "User ID and Commission ID are required" });
      return false;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/commission/${userId}/${commissionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update commission");
      }

      const result = await response.json();

      if (result.success && result.data) {
        set((state) => ({
          commissions: state.commissions.map((commission) =>
            commission._id === commissionId
              ? {
                  ...commission,
                  ...updateData,
                  updatedAt: new Date().toISOString(),
                }
              : commission
          ),
          loading: false,
        }));
        return true;
      } else {
        throw new Error(result.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update commission",
        loading: false,
      });
      return false;
    }
  },

  deleteCommission: async (
    userId: string,
    commissionId: string
  ): Promise<boolean> => {
    if (!userId || !commissionId) {
      set({ error: "User ID and Commission ID are required" });
      return false;
    }

    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refportal/commission/${userId}/${commissionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete commission");
      }

      const result = await response.json();

      if (result.success) {
        set((state) => ({
          commissions: state.commissions.filter(
            (commission) => commission._id !== commissionId
          ),
          loading: false,
        }));
        return true;
      } else {
        throw new Error(result.message || "Failed to delete commission");
      }
    } catch (error) {
      console.error("Error deleting commission:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete commission",
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
    const token = getAuthToken();
    if (!token) {
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

  setUser: (user) =>
    set({
      user,
      isAuthenticate: !!user,
      error: null,
    }),

  logout: () => {
    deleteAuthToken();
    set({
      user: null,
      detailedInfo: null,
      commissions: [],
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
