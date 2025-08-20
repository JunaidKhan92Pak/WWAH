"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/utils/authHelper";

interface HeroSectionProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    gender: string;
    // ONLY CHANGE: Updated field names to match database schema
    profilePicture?: string;
    coverPhoto?: string;
    createdAt: string;
    updatedAt: string;
  };
}

const HeroSection = ({ user }: HeroSectionProps) => {
  // ONLY CHANGE: Updated to use correct field names
  const [coverPhoto, setCoverPhoto] = useState<string>(
    user?.coverPhoto || "/DashboardPage/profileflow.svg"
  );
  const [profilePic, setProfilePic] = useState<string>(
    user?.profilePicture || "/DashboardPage/image.jpg"
  );
  const [isUploading, setIsUploading] = useState<{
    cover: boolean;
    profile: boolean;
  }>({
    cover: false,
    profile: false,
  });
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  // ONLY CHANGE: Updated to use correct field names
  useEffect(() => {
    setCoverPhoto(user?.coverPhoto || "/DashboardPage/profileflow.svg");
    setProfilePic(user?.profilePicture || "/DashboardPage/image.jpg");
  }, [user]);

  // Upload file to S3
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload failed:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Update user data in backend
  const updateUserInBackend = async (updateData: {
    avatarUrl?: string;
    coverUrl?: string;
  }) => {
    try {
      const token = getAuthToken(); // Adjust based on your auth setup
      // Use the correct endpoint URL that matches your backend routes
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/update-personal-infomation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Add this to match your user store
          body: JSON.stringify(updateData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend update failed:", errorData);
        throw new Error(errorData.message || "Failed to update user data");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Backend update error:", error);
      throw error;
    }
  };

  const handleCoverChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading((prev) => ({ ...prev, cover: true }));
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setCoverPhoto(previewUrl);
      // Upload to S3
      const uploadedUrl = await uploadFile(file);
      // Update in backend
      await updateUserInBackend({ coverUrl: uploadedUrl });
      // Update state with final URL
      setCoverPhoto(uploadedUrl);
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Cover photo update failed:", error);
      // ONLY CHANGE: Updated to use correct field name
      setCoverPhoto(user?.coverPhoto || "/DashboardPage/profileflow.svg");
      alert("Failed to update cover photo. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, cover: false }));
    }
  };

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading((prev) => ({ ...prev, profile: true }));
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
      // Upload to S3
      const uploadedUrl = await uploadFile(file);
      // Update in backend
      await updateUserInBackend({ avatarUrl: uploadedUrl });
      // Update state with final URL
      setProfilePic(uploadedUrl);
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Profile picture update failed:", error);
      // ONLY CHANGE: Updated to use correct field name
      setProfilePic(user?.profilePicture || "/DashboardPage/image.jpg");
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, profile: false }));
    }
  };

  return (
    <div className="relative w-full md:w-[97%] mx-auto h-44 md:h-72 lg:h-96">
      <Image
        src={coverPhoto}
        alt="Cover Photo"
        fill
        className="w-full h-full rounded-t-3xl object-cover"
      />
      <div className="absolute bottom-4 right-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={coverInputRef}
          onChange={handleCoverChange}
          disabled={isUploading.cover}
        />
        <Button
          variant="secondary"
          onClick={() => coverInputRef.current?.click()}
          disabled={isUploading.cover}
          className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center gap-x-2"
        >
          <Image
            src="/DashboardPage/camera.svg"
            alt="Edit"
            width={25}
            height={25}
          />
          <span className="hidden md:block">
            {isUploading.cover ? "Uploading..." : "Change Cover Photo"}
          </span>
        </Button>
      </div>
      <div className="absolute -bottom-32 md:-bottom-48 md:left-6 flex flex-col py-8 items-center text-start md:text-center justify-center gap-2 bg-transparent md:bg-white p-5 md:rounded-3xl md:shadow-lg">
        <div className="relative rounded-full border flex items-center justify-center overflow-hidden md:mb-4">
          <Image
            src={profilePic}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover h-28 md:h-24 w-28 md:w-24"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={profilePicInputRef}
            onChange={handleProfilePicChange}
            disabled={isUploading.profile}
          />
          <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 cursor-pointer bg-white bg-opacity-80 rounded-full p-1">
            {isUploading.profile ? (
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Image
                src="/DashboardPage/camera.svg"
                alt="Edit"
                width={30}
                height={30}
                onClick={() =>
                  !isUploading.profile && profilePicInputRef.current?.click()
                }
              />
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="flex flex-col gap-2">
            <div className="md:block hidden">
              <p className="text-base text-gray-600">{user?.email}</p>
              <div className="w-44 h-[1px] bg-[#F4D0D2]"></div>
              <p className="text-base text-gray-600">
                Member since:{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
