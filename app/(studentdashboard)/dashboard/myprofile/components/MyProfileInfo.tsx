// "use client";
// // import { useState } from "react";
// import Image from "next/image";
// import EditfirstandlastName from "./Modals/EditfirstandlastName";
// // import UpdatePassword from "./Modals/UpdatePassword";
// import EditPersonalInfo from "./Modals/EditPersonalInfo";
// import EditAcademicInfo from "./Modals/EditAcademicInfo";
// import EditWorkExperience from "./Modals/EditWorkExperience";
// import EditEnglishLanguageInfo from "./Modals/EditEnglishLanguageInfo";
// import EditStudentPreference from "./Modals/EditStudentPreference";

// // interface MyProfileInfoProps {
// //     firstName: string;
// //     lastName: string;
// //     setFirstName: (name: string) => void;
// //     setLastName: (name: string) => void;
// // }
// interface User {
//   user: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     contactNo: string;
//     dob: string;
//     country: string;
//     nationality: string;
//     gender: string;
//     city: string;
//     updatedAt: string;
//   };
//   AcademmicInfo: {
//     highestQualification: string;
//     majorSubject: string;
//     previousGradingScale: string;
//     previousGradingScore: string;
//     standarizedTest: string;
//     standarizedTestScore: string;
//     institutionName: string;
//     startdate: Date;
//     endDate: Date;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   LanguageProf: {
//     proficiencyLevel: string;
//     proficiencyTest: string;
//     proficiencyTestScore: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   UserPref: {
//     perferredCountry: string;
//     perferredCity: string;
//     degreeLevel: string;
//     fieldOfStudy: string;
//     livingcost: string;
//     tutionfees: string;
//     studyMode: string;
//     currency: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   setUser: {
//     setFirstName: (name: string) => void;
//     setLastName: (name: string) => void;
//   };
// }

// // interface MyProfileInfoProps {
// //   user: {
// //     firstName: string;
// //     lastName: string;
// //     email: string;
// //     contactNo: string;
// //     dob: string;
// //     country: string;
// //     nationality: string;
// //     gender: string;
// //     city: string;
// //     updatedAt: string;
// //   };
// //   AcademmicInfo: {
// //     highestQualification: string;
// //     majorSubject: string;
// //     previousGradingScale: string;
// //     previousGradingScore: string;
// //     standarizedTest: string;
// //     standarizedTestScore: string;
// //     institutionName: string;
// //     startdate: Date;
// //     endDate: Date;
// //     createdAt: Date;
// //     updatedAt: Date;
// //   };
// //   LanguageProf: {
// //     proficiencyLevel: string;
// //     proficiencyTest: string;
// //     proficiencyTestScore: string;
// //     createdAt: Date;
// //     updatedAt: Date;
// //   };
// //   UserPref: {
// //     perferredCountry: string;
// //     perferredCity: string;
// //     degreeLevel: string;
// //     fieldOfStudy: string;
// //     livingcost: string;
// //     tutionfees: string;
// //     studyMode: string;
// //     currency: string;
// //     createdAt: Date;
// //     updatedAt: Date;
// //   };
// //   setUser: {
// //     setFirstName: (name: string) => void;
// //     setLastName: (name: string) => void;
// //   };
// // }

// const MyProfileInfo = ({ user, setUser }: User) => {
//   // const [open, setOpen] = useState(false);
//   // const [confirmOpen, setConfirmOpen] = useState(false);
//   // const [newFirstName, setNewFirstName] = useState(firstName);
//   // const [newLastName, setNewLastName] = useState(lastName);

//   // const handleUpdate = () => {
//   //   setFirstName(newFirstName);
//   //   setLastName(newLastName);
//   //   setOpen(false);
//   //   setTimeout(() => setConfirmOpen(true), 300);
//   // };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-14  w-[80%] md:w-[70%] mx-auto xl:ml-72 mt-24 sm:mt-56 xl:mt-10 mb-6 xl:mb-32 items-baseline justify-items-start">
//       {/* First Name */}
//       <EditfirstandlastName
//         firstName={user.user.firstName}
//         lastName={user.user.lastName}
//         setFirstName={setUser.setFirstName}
//         setLastName={setUser.setLastName}
//       />

//       {/* Email Address */}
//       <div className="flex flex-col items-start space-y-4">
//         <p className="text-gray-600 text-base">Email Address:</p>
//         <div className="flex flex-row items-center gap-x-2">
//           <Image
//             src="/DashboardPage/letter.svg"
//             alt="Icon"
//             width={18}
//             height={18}
//           />
//           <p className="text-sm">{user.user.email}</p>
//           {/* <Image src="/DashboardPage/email.svg" alt="Edit" width={18} height={18} className="cursor-pointer ml-8 xl:ml-0" /> */}
//         </div>
//       </div>

//       {/* Update Password */}
//       {/* <UpdatePassword password={user.user.password} /> */}

//       {/* Personal Information */}
//       <EditPersonalInfo data={user.user} />

//       {/* Academic Information */}
//       <EditAcademicInfo data={user.AcademmicInfo} />

//       {/* Work Experience */}
//       <EditWorkExperience />

//       {/* English Language Proficiency */}
//       <EditEnglishLanguageInfo data={user.LanguageProf} />

//       {/* Student Preference */}
//       <EditStudentPreference data={user.UserPref} />
//     </div>
//   );
// };

// export default MyProfileInfo;

"use client";

import Image from "next/image";
// import EditFirstAndLastName from "./Modals/EditFirstAndLastName";
import EditPersonalInfo from "./Modals/EditPersonalInfo";
import EditAcademicInfo from "./Modals/EditAcademicInfo";
import EditWorkExperience from "./Modals/EditWorkExperience";
import EditEnglishLanguageInfo from "./Modals/EditEnglishLanguageInfo";
import EditStudentPreference from "./Modals/EditStudentPreference";
import EditfirstandlastName from "./Modals/EditfirstandlastName";
import Password from "./Modals/PasswordInput";

interface UserProfile {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-14 w-[80%] md:w-[70%] mx-auto xl:ml-72 mt-24 sm:mt-56 xl:mt-10 mb-6 xl:mb-32 items-baseline justify-items-start">
      {/* First Name */}
      <EditfirstandlastName
        firstName={user.firstName}
        lastName={user.lastName}
        setFirstName={setUser.setFirstName}
        setLastName={setUser.setLastName}
      />

      {/* Email Address */}
      <div className="flex flex-col items-start space-y-4">
        <p className="text-gray-600 text-base">Email Address:</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/letter.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">{user.email}</p>
        </div>
      </div>
      <Password data={user} />

      {/* Personal Information */}
      <EditPersonalInfo data={user} />

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
