"use client";

import Image from "next/image";
// import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import Password from "./Modals/PasswordInput";
import EditPhoneNo from "./Modals/EditPhoneNo";
import EditPersonalInfo from "./Modals/EditPersonalInfo";

// -----  NEW  -----
export interface AcademicInformation {
  currentDegree: string;
  program: string;
  uniName: string;
  currentSemester: string;
}
// -----------------
// ----- NEW ------------------------------
export interface PaymentInformation {
  preferredPaymentMethod: string;
  bankAccountTitle: string | null;
  bankName: string | null;
  accountNumberIban: string | null;
  mobileWalletNumber: string | null;
  accountHolderName: string | null;
  termsAndAgreement: boolean;
}
export interface WorkExperienceDetails {
  hasWorkExperience: boolean;
  hasBrandAmbassador: boolean;
  jobDescription: string | null;
}
interface DetailedInfo {
  studyLevel: string;

  dateOfBirth: string;
  nationality: string;
  majorSubject: string;


  workExperience: number;
    updatedAt: string;
  AcademicInformation: AcademicInformation;
}

interface UserProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  detailInfo: DetailedInfo | null;
  paymentInfo: PaymentInformation | null;
  workExpDetails: WorkExperienceDetails | null;
}

const formatLastUpdated = (updatedAt: string): string => {
  if (!updatedAt) return "Never updated";
  try {
    const date = new Date(updatedAt);
    return `Last updated on ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } catch {
    return "Invalid date";
  }
};


const MyProfileInfo = ({ user, detailInfo }: UserProps) => {
  const lastUpdated = detailInfo?.updatedAt || user?.updatedAt;

  const emptyDetails: DetailedInfo = {
    studyLevel: "",
  
 
    dateOfBirth: "",
    nationality: "",
    majorSubject: "",
    workExperience: 0,
    updatedAt: "",
    AcademicInformation: {
      currentDegree: "",
      program: "",
      uniName: "",
      currentSemester: "",
    },
  };

  return (
    <div className="w-[100%] md:w-[60%] ml-4 md:ml-8 xl:ml-72 mt-24 md:mt-56 xl:mt-10 mb-6 xl:mb-10">
      {lastUpdated && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Image src="/clock.svg" alt="Clock Icon" width={16} height={16} />
            {formatLastUpdated(lastUpdated)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 justify-between">
        <EditfirstandlastName
          firstName={user?.firstName}
          lastName={user?.lastName}
        />
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

        <EditPhoneNo
          phone={user?.phone}
          updatedAt={detailInfo?.updatedAt ?? ""}
        />
        <EditPersonalInfo data={detailInfo ?? emptyDetails} />
  
        {/* <EditAcademicInfo
          data={
            detailInfo?.AcademicInformation ?? emptyDetails.AcademicInformation
          }
        /> */}
        <EditWorkExperience
          data={{ workExperience: detailInfo?.workExperience ?? 0 }}
          updatedAt={detailInfo?.updatedAt ?? ""}
        />
      </div>
    </div>
  );
};

export default MyProfileInfo;

