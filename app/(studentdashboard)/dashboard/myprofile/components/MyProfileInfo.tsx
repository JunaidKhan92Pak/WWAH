"use client";

// import { useState } from "react";
import Image from "next/image";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import UpdatePassword from "./Modals/UpdatePassword";
import EditPersonalInfo from "./Modals/EditPersonalInfo";
import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditEnglishLanguageInfo from "./Modals/EditEnglishLanguageInfo";
import EditStudentPreference from "./Modals/EditStudentPreference";


interface MyProfileInfoProps {
    firstName: string;
    lastName: string;
    setFirstName: (name: string) => void;
    setLastName: (name: string) => void;
}
const MyProfileInfo: React.FC<MyProfileInfoProps> = ({ firstName, lastName, setFirstName, setLastName }) => {
    // const [open, setOpen] = useState(false);
    // const [confirmOpen, setConfirmOpen] = useState(false);
    // const [newFirstName, setNewFirstName] = useState(firstName);
    // const [newLastName, setNewLastName] = useState(lastName);

    // const handleUpdate = () => {
    //   setFirstName(newFirstName);
    //   setLastName(newLastName);
    //   setOpen(false);
    //   setTimeout(() => setConfirmOpen(true), 300);
    // };



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-14  w-[80%] md:w-[70%] mx-auto xl:ml-72 mt-24 sm:mt-56 xl:mt-10 mb-6 xl:mb-32 items-baseline justify-items-start">

            {/* First Name */}
            <EditfirstandlastName firstName={firstName} lastName={lastName} setFirstName={setFirstName} setLastName={setLastName} />



            {/* Email Address */}
            <div className="flex flex-col items-start space-y-4">
                <p className="text-gray-600 text-base">Email Address:</p>
                <div className='flex flex-row items-center gap-x-2'>
                    <Image src="/DashboardPage/letter.svg" alt="Icon" width={18} height={18} />
                    <p className="text-sm">asmakazmi@gmail.com</p>
                    {/* <Image src="/DashboardPage/email.svg" alt="Edit" width={18} height={18} className="cursor-pointer ml-8 xl:ml-0" /> */}

                </div>
            </div>

            {/* Update Password */}
            <UpdatePassword />

            {/* Personal Information */}
            <EditPersonalInfo />

            {/* Academic Information */}
            <EditAcademicInfo />

            {/* Work Experience */}
            <EditWorkExperience />

            {/* English Language Proficiency */}
            <EditEnglishLanguageInfo />

            {/* Student Preference */}
            <EditStudentPreference />
        </div>
    );
};

export default MyProfileInfo;
