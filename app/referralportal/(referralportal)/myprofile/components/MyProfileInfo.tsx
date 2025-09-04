"use client";
import { useState } from "react";
import Image from "next/image";
import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import Password from "./Modals/PasswordInput";
import EditPersonalInfo from "./Modals/EditPersonalInfo";
import EditPaymentDetails from "./Modals/EditPaymentDetails";
import { DetailedInfo, User } from "@/types/reffertypes";

interface UserProps {
  user: User;
  detailInfo: DetailedInfo | null;
}

const MyProfileInfo = ({ user, detailInfo }: UserProps) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  return (
    <div className="w-[100%] md:w-[60%] ml-4 md:ml-8 xl:ml-72 mt-24 md:mt-56 xl:mt-10 mb-6 xl:mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 justify-between">
        <EditfirstandlastName
          firstName={user?.firstName}
          lastName={user?.lastName}
        />
        {/* Email Address */}
        <div className="flex flex-col items-start space-y-2">
          <p className="text-gray-600 text-base">Email Address:</p>
          <div className="flex flex-row items-center gap-x-2">
            <Image
              src="/DashboardPage/letter.svg"
              alt="Icon"
              width={18}
              height={18}
            />
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>
        <Password data={user} />
        <EditPersonalInfo data={user} />
        {detailInfo && (
          <>
            <EditAcademicInfo data={detailInfo.AcademicInformation} />
            <EditWorkExperience data={detailInfo.workExperience} />
            <EditPaymentDetails
              open={paymentModalOpen}
              setOpen={setPaymentModalOpen}
             data={
              detailInfo.paymentInformation
             }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfileInfo;
