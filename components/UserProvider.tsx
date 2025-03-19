"use client";
import useUser from "@/hooks/useUser";

export default function UserProvider() {
    useUser(); // ✅ This ensures the user is fetched globally
    return null; // No need to render anything
}
