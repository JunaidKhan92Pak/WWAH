"use client";

import Image from "next/image";
import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditEnglishLanguageInfo from "./Modals/EditEnglishLanguageInfo";
import EditStudentPreference from "./Modals/EditStudentPreference";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import Password from "./Modals/PasswordInput";
import EditPhoneNo from "./Modals/EditPhoneNo";
import EditPersonalInfo from "./Modals/EditPersonalInfo";

interface LanguageProficiency {
  test: string;
  score: string;
}
interface StudyPreference {
  country: string;
  degree: string;
  subject: string;
}

interface DetailedInfo {
  studyLevel: string;
  gradeType: string;
  grade: number;
  dateOfBirth: string;
  nationality: string;
  majorSubject: string;
  livingCosts: {
    amount: number;
    currency: string;
  };
  tuitionFee: {
    amount: number;
    currency: string;
  };
  languageProficiency: LanguageProficiency;
  studyPreferenced: StudyPreference;
  workExperience: number;
  updatedAt: string;
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
}
const MyProfileInfo = ({ user, detailInfo }: UserProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 w-[80%] md:w-[60%] ml-4 md:ml-8 xl:ml-72 mt-24 sm:mt-56 xl:mt-10 mb-6 xl:mb-10 ">
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
      {detailInfo && (
        <>
          <EditPhoneNo phone={user?.phone} updatedAt={detailInfo.updatedAt} />
          <EditPersonalInfo data={detailInfo} />
          <EditAcademicInfo data={detailInfo} />
          <EditWorkExperience
            data={{ workExperience: detailInfo.workExperience }}
            updatedAt={detailInfo.updatedAt}
          />
          <EditEnglishLanguageInfo
            data={detailInfo.languageProficiency}
            updatedAt={detailInfo.updatedAt}
          />
          <EditStudentPreference data={detailInfo} />
        </>
      )}
    </div>
  );
};

export default MyProfileInfo;
