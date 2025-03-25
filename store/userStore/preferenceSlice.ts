import { create } from "zustand";

interface UserPreference {
    tuitionFees: string;
}

interface PreferenceState {
    userPreference: UserPreference | null;
    setUserPreference: (data: UserPreference) => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
    userPreference: null,

    setUserPreference: (data) => set({ userPreference: data }),
}));
