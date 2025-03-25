import { create } from "zustand";

interface PersonalInfo {
    firstName: string;
    email: string;
}

interface PersonalInfoState {
    personalInfo: PersonalInfo | null;
    setPersonalInfo: (info: PersonalInfo) => void;
    resetPersonalInfo: () => void;
}

export const usePersonalInfoStore = create<PersonalInfoState>((set) => ({
    personalInfo: null,
    setPersonalInfo: (info) => set({ personalInfo: info }),
    resetPersonalInfo: () => set({ personalInfo: null }), // ✅ Reset function
}));
