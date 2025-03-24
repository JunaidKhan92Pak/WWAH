import { getAuthToken } from "@/utils/authHelper";
export const fetchBasicInfo = async () => {
    const token = getAuthToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getBasicInformation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensure cookies are sent
      }
    );

    if (!response.ok) throw new Error("Failed to fetch data1");
    else {
      const pdata = await response.json();
      return pdata.data;
    }
  } catch (error) {
    console.error("❌ Error parsing JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

export const fetchApplicationInfo = async () => {
    const token = getAuthToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getApplicationInformation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensure cookies are sent
      }
    );
    if (!response.ok) throw new Error("Failed to fetch data1");
    else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
