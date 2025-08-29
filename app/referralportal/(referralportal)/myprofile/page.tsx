"use client";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import MyProfileInfo from "./components/MyProfileInfo";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useRefUserStore } from "@/store/useRefDataStore";
import { getAuthToken } from "@/utils/authHelper";
import { User } from "@/types/reffertypes";
const Page = () => {
  const router = useRouter();
  const {
    user,
    detailedInfo,
    fetchUserProfile,
    loading,
    error,
    setUser,
    // updateUserImages,
  } = useRefUserStore();
  const token = getAuthToken();

  console.log(token, "token from getAuthToken");
  console.log(user, "user from useRefUserStore");
  console.log(detailedInfo, "detailedInfo from useRefUserStore");

  useEffect(() => {
    console.log("=== PROFILE PAGE MOUNTED ===");
    if (token) {
      console.log("Fetching user profile with token:", token);
      fetchUserProfile(token);
    } else {
      console.log("No token found");
    }
  }, [token, fetchUserProfile]);

  // New function to handle user updates
  const handleUserUpdate = (updatedUser: User) => {
    console.log("=== PARENT: USER UPDATE RECEIVED ===");
    console.log("Updated user data:", {
      id: updatedUser?._id,
      profilePicture: updatedUser?.profilePicture,
      coverPhoto: updatedUser?.coverPhoto,
    });

    // Update the user in the store with the new data from backend
    setUser(updatedUser);

    // Alternatively, you could just update the images:
    // updateUserImages({
    //   profilePicture: updatedUser.profilePicture,
    //   coverPhoto: updatedUser.coverPhoto
    // });
  };

  // Check if user data is loaded but incomplete
  const isUserDataIncomplete = () => {
    if (!user) return false; // If user is null, we're still loading, not incomplete

    // Check if user object exists but has empty essential fields
    const hasEmptyEssentialFields =
      Object.keys(user).length === 0 ||
      !user.firstName ||
      !user.lastName ||
      !user.firstName ||
      !user.lastName;

    return hasEmptyEssentialFields;
  };

  // Show loading while fetching data
  if (loading || !user) {
    return <Loading />;
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Show incomplete profile message if data is incomplete
  if (isUserDataIncomplete()) {
    return (
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
    );
  }

  // Show complete profile
  return (
    <div>
      <HeroSection user={user} onUserUpdate={handleUserUpdate} />
      <MyProfileInfo user={user} detailInfo={detailedInfo} />
    </div>
  );
};

export default Page;
