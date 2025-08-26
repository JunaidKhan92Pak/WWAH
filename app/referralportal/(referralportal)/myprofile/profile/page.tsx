"use client";

import HeroSection from "../components/HeroSection";
import MyProfileInfo from "../components/MyProfileInfo";

const Page = () => {
  // Mocked data (for UI only)
  const user = {
    firstName: "Mubashir",
    lastName: "Ahmad",
    email: "Avatar@example.com",
    avatar: "/avatar.png",
  };

  const detailedInfo = {
    bio: "iam a Student,Study in university of punjab",
    location: "Pakistan",
    joined: "Aug 2025",
  };

  // Example condition for incomplete profile
  const isUserDataIncomplete =
    !user?.firstName || !user?.lastName || !user?.email;

  return (
    <div>
      {isUserDataIncomplete ? (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Profile</h2>
          <p className="mb-4">Your profile information is incomplete.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
