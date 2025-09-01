"use client";
import React from "react";
// import AdminCommissionForm from "./components/AdminCommissionForm";
import { useRefUserStore } from "@/store/useRefDataStore"; // ✅ Correct export
import AdminCommissionForm from "./components/AdminCommissionForm";

const Page: React.FC = () => {
  const user = useRefUserStore((state) => state.user);
  console.log("useridadminpage", user);
  console.log("User data in Page component:", user?._id);
  return (
    <div>
      <AdminCommissionForm userId={user?._id || ""} />
    </div>
  );
};

export default Page;
