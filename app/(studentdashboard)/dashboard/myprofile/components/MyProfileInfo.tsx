"use client";

import Image from "next/image";
// import EditPersonalInfo from "./Modals/EditPhone.jsx";
import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditEnglishLanguageInfo from "./Modals/EditEnglishLanguageInfo";
import EditStudentPreference from "./Modals/EditStudentPreference";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import Password from "./Modals/PasswordInput";
import EditPhoneNo from "./Modals/EditPhoneNo";
import EditPersonalInfo from "./Modals/EditPersonalInfo";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  contactNo:string;
  dob: string;
  country: string;
  nationality: string;
  gender: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
}

interface AcademicInfo {
  highestQualification: string;
  majorSubject: string;
  previousGradingScale: string;
  previousGradingScore: string;
  standardizedTest: string;
  standardizedTestScore: string;
  institutionName: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LanguageProficiency {
  proficiencyLevel: string;
  proficiencyTest: string;
  proficiencyTestScore: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  perferredCountry: string;
  perferredCity: string;
  degreeLevel: string;
  fieldOfStudy: string;
  livingcost: string;
  tutionfees: string;
  studyMode: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

interface workExperience {
  hasWorkExperience: boolean;
  jobTitle: string;
  organizationName: string;
  employmentType: string;
  duration:number;
  endDate: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
interface setUse {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
}

interface UserProps {
  user: UserProfile;
  academicInfo: AcademicInfo;
  languageProficiency: LanguageProficiency;
  userPreferences: UserPreferences;
  workExp: workExperience;
  setUser: setUse;
}

const MyProfileInfo = ({
  user,
  academicInfo,
  languageProficiency,
  userPreferences,
  workExp,
  setUser,
}: UserProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 w-[80%] md:w-[60%] ml-4 md:ml-8 xl:ml-72 mt-24 sm:mt-56 xl:mt-10 mb-6 xl:mb-10 ">
      {/* First Name */}
      <EditfirstandlastName
        firstName={user?.firstName}
        lastName={user?.lastName}
        setFirstName={setUser?.setFirstName}
        setLastName={setUser?.setLastName}
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

      {/* Personal Information */}
      <EditPhoneNo data={user} />

      <EditPersonalInfo data={user}/>

      {/* Academic Information */}
      <EditAcademicInfo data={academicInfo} />

      {/* Work Experience */}
      <EditWorkExperience data={workExp} />

      {/* English Language Proficiency */}
      <EditEnglishLanguageInfo data={languageProficiency} />

      {/* Student Preferences */}
      <EditStudentPreference data={userPreferences} />
    </div>
  );
};

export default MyProfileInfo;
