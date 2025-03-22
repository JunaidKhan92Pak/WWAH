
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function useUser() {
    const { user, fetchUser } = useUserStore();
    useEffect(() => {
        fetchUser(); // ✅ Only fetch once on startup
    }, [fetchUser]);

    return { user };
}
