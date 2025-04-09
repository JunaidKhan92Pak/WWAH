export async function getUserData(token: string) {
    // console.log(`🔹 Fetching user data with token: ${token}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}profile/data`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
            "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensure cookies are sent
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`❌ API Error (${response.status}):`, text);
        throw new Error("Failed to fetch user data");
    }
    // 🔹 Try to parse JSON, handle errors gracefully
    try {
        const data = await response.json();
        // console.log("🔹 User data fetched successfully:", data);
        return data.user;
    } catch (error) {
        console.error("❌ Error parsing JSON response:", error);
        throw new Error("Invalid JSON response from server");
    }
}
