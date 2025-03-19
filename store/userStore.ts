// /store/userStore.ts
import { create } from "zustand";

export interface UserData {
    majorSubject: { majorSubject: string, highestQualification: string, previousGradingScore: number, previousGradingScale: any }
    langPro: { proficiencyTest: string, proficiencyTestScore: number }
    userPreference: { tutionfees: string }
}

interface UserState {
    user: UserData | null;
    setUser: (user: UserData) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: UserData) => set({ user }),
    logout: () => set({ user: null }),
}));
