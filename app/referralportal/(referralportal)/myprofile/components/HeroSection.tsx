"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/utils/authHelper";
import { User } from "@/types/reffertypes";

interface HeroSectionProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

const HeroSection = ({ user, onUserUpdate }: HeroSectionProps) => {
  console.log("=== HERO SECTION RENDER ===");
  console.log("User prop received:", {
    id: user?._id,
    profilePicture: user?.profilePicture,
    coverPhoto: user?.coverPhoto,
    firstName: user?.firstName,
    lastName: user?.lastName,
  });

  // Updated to use user's actual images or fallback to defaults
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
  const [editing] = useState(false);
  console.log(editing);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  // Update state when user data changes
  useEffect(() => {
    console.log("=== USER EFFECT TRIGGERED ===");
    console.log("New user data:", {
      profilePicture: user?.profilePicture,
      coverPhoto: user?.coverPhoto,
    });

    const newCoverPhoto = user?.coverPhoto || "/DashboardPage/profileflow.svg";
    const newProfilePic = user?.profilePicture || "/DashboardPage/image.jpg";

    console.log("Setting cover photo to:", newCoverPhoto);
    console.log("Setting profile pic to:", newProfilePic);

    setCoverPhoto(newCoverPhoto);
    setProfilePic(newProfilePic);
  }, [user?.profilePicture, user?.coverPhoto]); // Add specific dependencies

  // Upload file to S3
  const uploadFile = async (file: File) => {
    console.log("=== UPLOADING FILE TO S3 ===");
    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Making request to /api/refuploadprofile");
      const res = await fetch("/api/refuploadprofile", {
        method: "POST",
        body: formData,
      });

      console.log("S3 upload response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("S3 upload failed:", errorData);
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      console.log("S3 upload successful:", data);
      return data.url;
    } catch (error) {
      console.error("S3 upload error:", error);
      throw error;
    }
  };

  // Update user data in backend
  const updateUserInBackend = async (updateData: {
    profilePictureUrl?: string;
    coverPhotoUrl?: string;
  }) => {
    console.log("=== UPDATING USER IN BACKEND ===");
    console.log("Update data:", updateData);

    try {
      const token = getAuthToken();
      console.log("Auth token:", token ? "Present" : "Missing");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const requestBody = JSON.stringify(updateData);
      console.log("Request body:", requestBody);
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/updatePersonalInfomation`
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/updatePersonalInfomation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: requestBody,
        }
      );

      console.log("Backend response status:", res.status);
      console.log(
        "Backend response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const responseText = await res.text();
      console.log("Backend raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        console.error("Backend update failed:", data);
        throw new Error(
          data.message || `Failed to update user data: ${res.status}`
        );
      }

      console.log("Backend update successful:", data);

      // Call the callback to update parent component with new user data
      if (onUserUpdate && data.data) {
        console.log("Calling onUserUpdate with:", data.data);
        onUserUpdate(data.data);
      }

      return data;
    } catch (error) {
      console.error("Backend update error:", error);
      throw error;
    }
  };

  const handleCoverChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("=== COVER PHOTO CHANGE STARTED ===");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Cover photo file selected:", file.name);

    try {
      setIsUploading((prev) => ({ ...prev, cover: true }));

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      console.log("Setting preview URL:", previewUrl);
      setCoverPhoto(previewUrl);

      // Upload to S3
      console.log("Starting S3 upload for cover photo");
      const uploadedUrl = await uploadFile(file);
      console.log("Cover photo uploaded to:", uploadedUrl);

      // Update in backend
      console.log("Updating backend with cover photo URL");
      await updateUserInBackend({ coverPhotoUrl: uploadedUrl });

      // Update state with final URL
      console.log("Setting final cover photo URL:", uploadedUrl);
      setCoverPhoto(uploadedUrl);

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      console.log("Cover photo update completed successfully");
    } catch (error) {
      console.error("Cover photo update failed:", error);

      // Revert to original on error
      const originalUrl = user?.coverPhoto || "/DashboardPage/profileflow.svg";
      console.log("Reverting cover photo to:", originalUrl);
      setCoverPhoto(originalUrl);

      alert("Failed to update cover photo. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, cover: false }));
      console.log("Cover photo upload process completed");
    }
  };

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("=== PROFILE PICTURE CHANGE STARTED ===");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Profile picture file selected:", file.name);

    try {
      setIsUploading((prev) => ({ ...prev, profile: true }));

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      console.log("Setting preview URL:", previewUrl);
      setProfilePic(previewUrl);

      // Upload to S3
      console.log("Starting S3 upload for profile picture");
      const uploadedUrl = await uploadFile(file);
      console.log("Profile picture uploaded to:", uploadedUrl);

      // Update in backend
      console.log("Updating backend with profile picture URL");
      await updateUserInBackend({ profilePictureUrl: uploadedUrl });

      // Update state with final URL
      console.log("Setting final profile picture URL:", uploadedUrl);
      setProfilePic(uploadedUrl);

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      console.log("Profile picture update completed successfully");
    } catch (error) {
      console.error("Profile picture update failed:", error);

      // Revert to original on error
      const originalUrl = user?.profilePicture || "/DashboardPage/image.jpg";
      console.log("Reverting profile picture to:", originalUrl);
      setProfilePic(originalUrl);

      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, profile: false }));
      console.log("Profile picture upload process completed");
    }
  };

  return (
    <div className="relative w-full md:w-[97%] mx-auto h-44 md:h-72 lg:h-96">
      <Image
        src={coverPhoto}
        alt="Cover Photo"
        fill
        className="w-full h-full rounded-t-3xl object-cover"
        onLoad={() => console.log("Cover photo loaded:", coverPhoto)}
        onError={(e) =>
          console.error("Cover photo failed to load:", coverPhoto, e)
        }
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

      <div className="absolute -bottom-32 md:-bottom-48  md:left-6 flex flex-col py-8 items-center text-start md:text-center justify-center gap-2 bg-transparent md:bg-white p-5 md:rounded-3xl md:shadow-lg ">
        <div className="relative rounded-full border flex items-center justify-center overflow-hidden md:mb-4">
          <Image
            src={profilePic}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover h-28 md:h-24 w-28 md:w-24"
            onLoad={() => console.log("Profile picture loaded:", profilePic)}
            onError={(e) =>
              console.error("Profile picture failed to load:", profilePic, e)
            }
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

          <div className="flex flex-col  gap-2 ">
            <div className="md:block hidden">
              <p className="text-base text-gray-600">{user?.email}</p>

              {/* Red Line Divider */}
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
