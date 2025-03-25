"use client";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import MyProfileInfo from "./components/MyProfileInfo";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";
const Page = () => {
  const { user, setUser, fetchUserProfile } = useUserStore();
  const router = useRouter();
  // Fetch user profile
  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/login"); // Redirect if not authenticated
        return;
      }
      fetchUserProfile(token);
    } catch (error) {
      console.error("Error fetching profile:", error );
    }
  };
  console.log(user, "user data");
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <>
          <HeroSection user={user.user} />
          <MyProfileInfo
            user={user?.user}
            academicInfo={user?.AcademmicInfo}
            languageProficiency={user?.LanguageProf}
            userPreferences={user?.UserPref}
            workExp={user?.workExp}
            setUser={{
              setFirstName: (name: string) =>
                setUser({ ...user, firstName: name }),
              setLastName: (name: string) =>
                setUser({ ...user, lastName: name }),
            }}
          />
        </>
      )}
    </div>
  );
};

export default Page;
