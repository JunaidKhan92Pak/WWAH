
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
interface user {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  dob: string;
  country: string;
  nationality: string;
  gender: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
}
interface workExp {
  hasWorkExperience: boolean;
  jobTitle: string;
  organizationName: string;
  employmentType: string;
  endDate: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: (token: string) => Promise<void>;
  setUser: (user: User) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUserProfile: async (token) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}profile`,
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
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      // Map API response to match the updated User interface
      const user: User = {
        ...userData,
      };

      set({ user, loading: false });
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  setUser: (user) => set({ user }),
}));
