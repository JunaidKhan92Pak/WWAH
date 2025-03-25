import { create } from "zustand";
import { getAuthToken, deleteAuthToken } from "@/utils/authHelper";
import { getUserData } from "@/utils/getUser";
import { usePersonalInfoStore } from "./personalInfo";

interface AuthState {
    isAuthenticate: boolean;
    loading: boolean;
    setAuth: (status: boolean) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticate: false,
    loading: true, // ✅ Initially true
    setAuth: (status) => set({ isAuthenticate: status, loading: false }),
    setLoading: (loading) => set({ loading }),
    logout: () => {
        deleteAuthToken();
        const { resetPersonalInfo } = usePersonalInfoStore.getState(); // ✅ Get reset function
        resetPersonalInfo(); // ✅ Clear personal info state
        set({ isAuthenticate: false, loading: false });
    },
    fetchUser: async () => {
        set({ loading: true }); // ✅ Start loading
        const token = getAuthToken();
        if (!token) {
            set({ isAuthenticate: false, loading: false });
            return;
        }
        try {
            const userData = await getUserData(token);
            if (userData) {
                set({ isAuthenticate: true, loading: false });
            } else {
                set({ isAuthenticate: false, loading: false });
            }
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            set({ isAuthenticate: false, loading: false });
        }
    },
}));
