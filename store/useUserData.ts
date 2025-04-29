
import { deleteAuthToken } from "@/utils/authHelper";
import { create } from "zustand";
interface AcademmicInfo {
  highestQualification: string;
  majorSubject: string;
  previousGradingScale: string;
  previousGradingScore: string;
  standardizedTest: string;
  standardizedTestScore: string;
  institutionName: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  otherGradingScale: string,

}
interface LanguageProf {
  proficiencyLevel: string;
  proficiencyTest: string;
  proficiencyTestScore: string;
  createdAt: Date;
  updatedAt: Date;
}
interface UserPref {
  perferredCountry: string;
  perferredCity: string;
  degreeLevel: string;
  fieldOfStudy: string;
  livingcost: string;
  tutionfees: string;
  studyMode: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
interface workExp {
  hasWorkExperience: boolean;
  jobTitle: string;
  organizationName: string;
  employmentType: string;
  duration: number;
  endDate: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface user {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactNo: string;
  phoneNo: string;
  dob: string;
  country: string;
  nationality: string;
  gender: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
}
type LanguageProficiency = {
  score: string;
  test: string;
};

type StudyPreferenced = {
  country: string;
  degree: string;
  subject: string;
};

export interface SuccessData {
  studyLevel: string;
  gradetype: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: string;
  tuitionFee: string;
  languageProficiency: LanguageProficiency;
  workExperience: string;
  studyPreferenced: StudyPreferenced;
}
interface User {
  firstName: string;
  lastName: string;
  user: user;
  AcademmicInfo: AcademmicInfo;
  LanguageProf: LanguageProf;
  UserPref: UserPref;
  workExp: workExp;
}
export interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  successChances: SuccessData | null; // :white_tick: Add this property
  isAuthenticate: boolean; // Add this property
  fetchUserProfile: (token: string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => void;
}
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  userSuccessInfo: null,
  successChances: null,
  isAuthenticate: false,
  error: null,
  fetchUserProfile: async (token) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // :white_tick: Send token in Authorization header
            "Content-Type": "application/json",
          },
          credentials: "include", // :white_tick: Ensure cookies are sent
        }
      );
      if (!response) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      // Map API response to match the updated User interface
      const user: User = {
        ...userData,
      };
      set({ user, loading: false, isAuthenticate: true });
    } catch (error) {
      console.error("Error fetching profile in wwah:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticate: !!user }),
  logout: () => {
    deleteAuthToken(); // :white_tick: Remove token first
    set(() => ({ user: null, isAuthenticate: false, loading: false })); // :white_tick: Reset store state
  },
}));
