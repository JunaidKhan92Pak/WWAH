"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    dob: string;
    country: string;
    nationality: string;
    gender: string;
    city: string;
    createdAt: string;
    updatedAt: string;
  };
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const [coverPhoto, setCoverPhoto] = useState<string>(
    "/DashboardPage/profileflow.svg"
  );
  const [profilePic, setProfilePic] = useState<string>(
    "/DashboardPage/image.jpg"
  );
  // const [profile] = useState({
  //   name: "Asma Kazmi",
  //   email: "asmakazmi@gmail.com",
  //   membershipDate: "1st Jul, 2024",
  // });
  const [editing] = useState(false);
  // const [newName,] = useState(profile.name);
  console.log(editing);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverPhoto(imageUrl);
    }
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // const handleEdit = () => {
  //   setEditing(true);
  // };

  // const handleSave = () => {
  //   setProfile({ ...profile, name: newName });
  //   setEditing(false);
  // };

  return (
    <div className="relative w-full md:w-[97%] mx-auto h-44 md:h-72 lg:h-96">
      <Image
        src={coverPhoto}
        alt="Cover Photo"
        layout="fill"
        objectFit="cover"
        className="w-full h-full rounded-t-3xl"
      />
      <div className="absolute bottom-4 right-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={coverInputRef}
          onChange={handleCoverChange}
        />
        <Button
          variant="secondary"
          onClick={() => coverInputRef.current?.click()}
          className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center gap-x-2"
        >
          <Image
            src="/DashboardPage/camera.svg"
            alt="Edit"
            width={25}
            height={25}
          />

          {/* Show text only on md screens and above */}
          <span className="hidden md:block">Change Cover Photo</span>
        </Button>
      </div>

      <div className="absolute -bottom-32 md:-bottom-52  md:left-6 flex flex-col py-12 items-center text-start md:text-center justify-center gap-2 bg-transparent md:bg-white p-5 md:rounded-3xl md:shadow-lg ">
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
          />
          <Image
            src="/DashboardPage/camera.svg"
            alt="Edit"
            width={30}
            height={30}
            className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 cursor-pointer"
            onClick={() => profilePicInputRef.current?.click()}
          />
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
                {/* Member since: {profile.membershipDate} */}
                Member since:
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
