import { create } from "zustand";

interface MajorSubject {
    majorSubject: string;
    highestQualification: string;
    previousGradingScore: number;
    previousGradingScale: any;
}

interface MajorSubjectState {
    majorSubject: MajorSubject | null;
    setMajorSubject: (data: MajorSubject) => void;
}

export const useMajorSubjectStore = create<MajorSubjectState>((set) => ({
    majorSubject: null,

    setMajorSubject: (data) => set({ majorSubject: data }),
}));
