"use client";

import React, { useState } from "react";
import FavoriteCourse from "./component/FavoriteCourse";
import FavoriteScholarship from "./component/FavoriteScholarship";
import FavoriteUniversities from "./component/FavoriteUniversities";

const Page = () => {
  const [activeTab, setActiveTab] = useState("universities");

  const renderComponent = () => {
    switch (activeTab) {
      case "courses":
        return <FavoriteCourse />;
      case "scholarships":
        return <FavoriteScholarship />;
      case "universities":
      default:
        return <FavoriteUniversities />;
    }
  };

  return (
    <div className="px-6 pt-4">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("universities")}
          className={`py-2 px-12 text-md font-semibold rounded-t-2xl ${
            activeTab === "universities"
              ? "border-b-2 bg-red-600 text-white"
              : "text-gray-600"
          }`}
        >
          Universities
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`py-2 px-16 text-md font-semibold rounded-t-2xl  ${
            activeTab === "courses"
              ? "border-b-2 bg-red-600 text-white"
              : "text-gray-600"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("scholarships")}
          className={`py-2 px-12 text-md font-semibold rounded-t-2xl ${
            activeTab === "scholarships"
              ? "border-b-2 bg-red-600 text-white"
              : "text-gray-600"
          }`}
        >
          Scholarships
        </button>
      </div>

      {/* Component based on active tab */}
      {renderComponent()}
    </div>
  );
};

export default Page;
