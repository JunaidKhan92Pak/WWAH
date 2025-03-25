import { create } from "zustand";

interface LanguageProficiency {
    proficiencyTest: string;
    proficiencyTestScore: number;
}

interface LanguageProficiencyState {
    langPro: LanguageProficiency | null;
    setLangPro: (data: LanguageProficiency) => void;
}

export const useLangProStore = create<LanguageProficiencyState>((set) => ({
    langPro: null,

    setLangPro: (data) => set({ langPro: data }),
}));
