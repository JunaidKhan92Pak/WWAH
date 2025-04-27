// /store/userStore.ts
import { deleteAuthToken } from '@/utils/authHelper';
import { create } from 'zustand';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;

};

type UserStore = {
    user: User | null;
    isAuthenticate: boolean;
    loading: boolean;
    setUser: (u: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    loading: true,
    isAuthenticate: false,
    setUser: (user) => set({
        user,
        isAuthenticate: !!user, // ✅ Dynamically set authentication state
        loading: false,
    }),
    logout: () => {
        deleteAuthToken(); // ✅ Remove token first
        set(() => ({ user: null, isAuthenticate: false, loading: false })); // ✅ Reset store state
    },
}));
