"use client";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import MyProfileInfo from "./components/MyProfileInfo";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";
import Loading from "@/app/loading";

const Page = () => {
  const { user, detailedInfo, fetchUserProfile } = useUserStore();
  const router = useRouter();

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/signin"); // Redirect if not authenticated
        return;
      }
      await fetchUserProfile();
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Check if user data is loaded but empty or incomplete
  const isUserDataIncomplete = () => {
    if (!user) return true;

    // Check if user object exists but has empty essential fields
    const hasEmptyEssentialFields =
      !user ||
      Object.keys(user).length === 0 ||
      !user.firstName ||
      !user.lastName;

    return hasEmptyEssentialFields;
  };
  return (
    <div>
      {!user ? (
        <Loading />
      ) : isUserDataIncomplete() ? (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Profile</h2>
          <p className="mb-4">Your profile information is incomplete.</p>
          <button
            onClick={() => router.push("/profile/edit")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Complete Your Profile
          </button>
        </div>
      ) : (
        <>
          <HeroSection user={user} />
          <MyProfileInfo user={user} detailInfo={detailedInfo} />
        </>
      )}
    </div>
  );
};

export default Page;
