// // /store/userStore.ts

// import { create } from "zustand";



// interface UserState {
//     user: UserData | null;
//     isAuthenticate: boolean;
//     loading: boolean;
//     setUser: (user: UserData) => void;
//     logout: () => void;
//     setLoading: (loading: boolean) => void;
// }

// export const useUserStore = create<UserState>((set) => ({
//     user: null,
//     isAuthenticate: false,
//     loading: true,  // Initially true
//     setUser: (user) => set({ user, isAuthenticate: true, loading: false }),
//     logout: () => set({ user: null, isAuthenticate: false, loading: false }),
//     setLoading: (loading) => set({ loading }),
// }));
import { create } from "zustand";
import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";
import { getUserData } from "@/utils/getUser";

export interface UserData {
    majorSubject: { majorSubject: string, highestQualification: string, previousGradingScore: number, previousGradingScale: any }
    langPro: { proficiencyTest: string, proficiencyTestScore: number }
    userPreference: { tutionfees: string }
    personalInfo: { firstName: string, email: string }
}
interface UserState {
    user: UserData | null;
    isAuthenticate: boolean;
    loading: boolean;
    setUser: (user: any) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticate: false,
    loading: true,

    setUser: (user) => set({ user, isAuthenticate: true, loading: false }),

    logout: () => {
        deleteAuthToken(); // Remove token
        set({ user: null, isAuthenticate: false, loading: false });
    },
    fetchUser: async () => {
        const token = getAuthToken();
        if (!token) {
            set({ loading: false });
            return;
        }
        try {
            const userData = await getUserData(token);
            if (userData) {
                set({ user: userData, isAuthenticate: true, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            set({ loading: false });
        }
    },
}));
