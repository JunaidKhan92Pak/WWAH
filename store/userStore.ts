import { create } from "zustand";
import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";
import { getUserData } from "@/utils/getUser";

export interface UserData {
    majorSubject: { majorSubject: string, highestQualification: string, previousGradingScore: number, previousGradingScale: any };
    langPro: { proficiencyTest: string, proficiencyTestScore: number };
    userPreference: { tutionfees: string };
    personalInfo: { firstName: string, email: string };
}

interface UserState {
    user: UserData | null;
    isAuthenticate: boolean;
    loading: boolean;
    setUser: (user: UserData | null) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticate: false,
    loading: true,

    setUser: (user) => {
        set({
            user,
            isAuthenticate: !!user, // ✅ Dynamically set authentication state
            loading: false,
        });
    },

    logout: () => {
        deleteAuthToken(); // ✅ Remove token first
        set(() => ({ user: null, isAuthenticate: false, loading: false })); // ✅ Reset store state
    },

    fetchUser: async () => {
        const token = getAuthToken();
        if (!token) {
            set({ loading: false });
            return;
        }

        try {
            const userData = await getUserData(token);
            set({
                user: userData || null,
                isAuthenticate: !!userData,
                loading: false,
            });
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            set({ loading: false });
        }
    },
}));
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";
// import { getUserData } from "@/utils/getUser";

// export interface UserData {
//     majorSubject: { majorSubject: string, highestQualification: string, previousGradingScore: number, previousGradingScale: any };
//     langPro: { proficiencyTest: string, proficiencyTestScore: number };
//     userPreference: { tutionfees: string };
//     personalInfo: { firstName: string; email: string };
// }

// interface UserState {
//     user: UserData | null;
//     isAuthenticate: boolean;
//     loading: boolean;
//     setUser: (user: UserData | null) => void;
//     logout: () => void;
//     fetchUser: () => Promise<void>;
// }

// export const useUserStore = create<UserState>()(
//     persist(
//         (set) => ({
//             user: null,
//             isAuthenticate: false,
//             loading: true,

//             setUser: (user) => {
//                 set({
//                     user,
//                     isAuthenticate: !!user,
//                     loading: false,
//                 });
//             },

//             logout: () => {
//                 deleteAuthToken();
//                 set({ user: null, isAuthenticate: false, loading: false });
//             },

//             fetchUser: async () => {
//                 const token = getAuthToken();
//                 if (!token) {
//                     set({ loading: false });
//                     return;
//                 }
//                 try {
//                     const userData = await getUserData(token);
//                     set({
//                         user: userData || null,
//                         isAuthenticate: !!userData,
//                         loading: false,
//                     });
//                 } catch (error) {
//                     console.error("❌ Error fetching user:", error);
//                     set({ loading: false });
//                 }
//             },
//         }),
//         {
//             name: "user-data", // unique key in localStorage
//             // Optionally add serialization options here.
//         }
//     )
// );
