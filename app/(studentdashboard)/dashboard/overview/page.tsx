"use client";
import React, { useEffect } from "react";

import Herosection from "./components/Herosection";
import CounsellorSection from "./components/CounsellorSection";
import ApplyingSection from "./components/ApplyingSection";
import Coursesuggestion from "./components/Coursesuggestion";
// import { StatusProgressBar } from "../components/StatusProgressBar";
import { useUserStore } from "@/store/useUserData";
import { getAuthToken } from "@/utils/authHelper";
// import AppliedScholarships from "./components/AppliedScholarships";
import AppliedScholarships from "./components/AppliedScholarship";
// interface CounsellorSectionProps {
//   userEmail: {
//     email: string;
//   };
// }
const Page = () => {
  const { user, fetchUserProfile } = useUserStore();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUserProfile();
    }
  }, []);
  // console.log(user)
  return (
    <>
      <div className="w-[94%] xl:w-[98%] mx-auto overflow-hidden">
        {user && <Herosection user={user} />}
        <div className="w-full mx-auto flex flex-col xl:flex-row gap-4  items-center md:items-stretch  my-6 justify-center">
          <div className="w-full xl:w-[72%] rounded-xl border p-3 flex flex-col space-y-4">
            <ApplyingSection />
            <div id="applied-scholarships" className="mt-1">
              <AppliedScholarships />
            </div>
            {/* <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <StatusProgressBar progress={70} />
              </div>
              </div> */}
            <Coursesuggestion />
          </div>

          <div className="w-full xl:w-[30%] rounded-xl border p-4">
            <CounsellorSection userEmail={{ email: user?.email ?? "" }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
