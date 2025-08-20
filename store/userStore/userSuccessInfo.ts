import { getAuthToken } from '@/utils/authHelper';
import { create } from 'zustand';

type LanguageProficiency = {
    score: string | number; // allow both string and number
    test: string;
};

type StudyPreferenced = {
    country: string;
    degree: string;
    subject: string;
};
type SuccessData = {
    studyLevel: string;
    gradetype: string;
    grade: number;
    dateOfBirth: string;
    nationality: string;
    majorSubject: string;
    costofliving?: {
        amount: number;
        currency: string;
    };
    tutionfee?: {
        amount: number;
        currency: string;
    };
    languageProficiency: LanguageProficiency;
    workExperience: string;
    studyPreferenced: StudyPreferenced;
};
type Store = {
    userSuccessInfo: SuccessData | null;
    loading: boolean;
    error: string | null;
    isLoggedIn: boolean;
    hasData: boolean;
    fetchedOnce: boolean;
    fetchUserSuccessInfo: () => Promise<void>;
};

export const useUserInfo = create<Store>((set, get) => ({
    userSuccessInfo: null,
    loading: false,
    error: null,
    isLoggedIn: false,
    hasData: false,
    fetchedOnce: false,

    fetchUserSuccessInfo: async () => {
        const token = getAuthToken();
        if (!token) {
            set({
                isLoggedIn: false,
                userSuccessInfo: null,
                error: "User not logged in",
                loading: false,
                hasData: false,
                fetchedOnce: true,
            });
            return;
        }
        // Don't refetch if already fetched
        if (get().fetchedOnce) return;
        set({ loading: true, error: null, isLoggedIn: true });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}success-chance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            // console.log(result, "result from success chance api");

            if (result.success && result.data) {
                set({
                    userSuccessInfo: result.data,
                    hasData: true,
                    error: null,
                });
            } else {
                set({
                    userSuccessInfo: null,
                    hasData: false,
                    error: "No data found for this user",
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            set({ error: "Failed to fetch data", userSuccessInfo: null, hasData: false });
        } finally {
            set({ loading: false, fetchedOnce: true });
        }
    },
}));
