"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getAuthToken } from "@/utils/authHelper";
import { getUserData } from "../utils/getUser";

export default function useUser() {
    const { user, setUser } = useUserStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getAuthToken();
            console.log(token, "🔹 Token Retrieved");

            if (!token) {
                console.log("❌ No token found, stopping fetch.");
                setLoading(false);
                return;
            }

            try {
                console.log("🔹 Fetching user data...");
                const data = await getUserData(token);
                console.log(data, "✅ User data fetched!");

                if (data) {
                    setUser(data);
                }
            } catch (err) {
                setError("Failed to fetch user data");
                console.error("❌ Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!user) { // ✅ Fetch user only if user is null
            console.log("🔹 No user found in Zustand, fetching...");
            fetchUser();
        } else {
            console.log("✅ User already exists in Zustand:", user);
            setLoading(false);
        }
    }, [user, setUser]);

    return { user, loading, error };
}
