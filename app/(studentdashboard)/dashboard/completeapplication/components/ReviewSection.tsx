"use client";
import { Button } from "@/components/ui/button";
import { fetchApplicationInfo, fetchBasicInfo } from "@/utils/stdDashboard";
import { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

const Section = ({
  title,
  data,
  children,
}: {
  title: string;
  data?: Record<string, string>;
  children?: React.ReactNode;
}) => (
  <div className="mb-6 w-full">
    <button className="flex flex-row items-center whitespace-nowrap rounded-lg mb-4 p-2 bg-[#F4D0D2]">
      <p className="font-semibold">{title}</p>
    </button>
    <div>
      <div className="grid grid-cols-1 gap-4">
        {data &&
          Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
            >
              <p className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="font-medium">{value || ""}</p>
            </div>
          ))}
        {children}
      </div>
    </div>
  </div>
);

// Helper function to safely format dates
const formatDate = (dateString?: string): string => {
  if (!dateString || dateString === "undefined" || dateString === "null") {
    return "";
  }
  try {
    return new Date(dateString).toLocaleDateString("en-GB");
  } catch {
    return "";
  }
};

// Helper function to safely get string values
const safeString = (value?: string): string => {
  if (!value || value === "undefined" || value === "null") {
    return "";
  }
  return value;
};

// Helper function to safely combine phone numbers
const formatPhoneNumber = (countryCode?: string, phoneNo?: string): string => {
  const code = safeString(countryCode);
  const number = safeString(phoneNo);
  
  if (!code && !number) return "";
  if (!code) return number;
  if (!number) return code;
  return `${code}-${number}`;
};

export default function ReviewPage() {
  const router = useRouter();
  
  interface Data1Type {
    familyName?: string;
    givenName?: string;
    nationality?: string;
    DOB?: string;
    countryOfResidence?: string;
    gender?: string;
    maritalStatus?: string;
    religion?: string;
    permanentAddress?: string;
    country?: string;
    city?: string;
    currentZipCode?: string;
    zipCode?: string;
    countryCode?: string;
    phoneNo?: string;
    currentAddress?: string;
    currentCountry?: string;
    currentCity?: string;
    currentEmail?: string;
    currentPhoneNo?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
    oldPassportNumber?: string;
    oldPassportExpiryDate?: string;
    visitedCountry?: string;
    institution?: string;
    visaType?: string;
    visaExpiryDate?: string;
    durationOfStudyAbroad?: string;
    sponsorName?: string;
    sponsorRelationship?: string;
    sponsorsNationality?: string;
    sponsorsOccupation?: string;
    sponsorsEmail?: string;
    sponsorsPhoneNo?: string;
    familyMembers?: Array<{
      name: string;
      relationship: string;
      nationality: string;
      occupation: string;
      email: string;
      phoneNo: string;
    }>;
  }

  const [data1, setData1] = useState<Data1Type | null>(null);
  
  interface Data2Type {
    countryOfStudy?: string;
    proficiencyLevel?: string;
    proficiencyTest?: string;
    overAllScore?: string;
    listeningScore?: string;
    readingScore?: string;
    writingScore?: string;
    speakingScore?: string;
    educationalBackground?: Array<{
      highestDegree: string;
      subjectName: string;
      institutionAttended: string;
      marks: string;
      degreeStartDate: string;
      degreeEndDate: string;
    }>;
    workExperience?: Array<{
      jobTitle: string;
      organizationName: string;
      employmentType: string;
      from: string;
      to: string;
    }>;
    standardizedTest?: string;
    standardizedOverallScore?: string;
    standardizedSubScore?: string[];
  }

  const [data2, setData2] = useState<Data2Type | null>(null);
  
  useEffect(() => {
    const getData = async () => {
      const result1 = await fetchBasicInfo();
      const result2 = await fetchApplicationInfo();
      setData1(result1);
      setData2(result2);
    };

    getData();
  }, []);

  const studentData = {
    personalInfo: {
      familyName: safeString(data1?.familyName),
      givenName: safeString(data1?.givenName),
      nationality: safeString(data1?.nationality),
      dateOfBirth: formatDate(data1?.DOB),
      countryOfResidence: safeString(data1?.countryOfResidence),
      gender: safeString(data1?.gender),
      maritalStatus: safeString(data1?.maritalStatus),
      religion: safeString(data1?.religion),
    },
    contactDetails: {
      currentAddress: safeString(data1?.permanentAddress),
      permanentAddress: safeString(data1?.currentAddress),
      city: safeString(data1?.city),
      zipCode: safeString(data1?.zipCode),
      phoneNumber: formatPhoneNumber(data1?.countryCode, data1?.phoneNo),
    },
    passportInfo: {
      passportNumber: safeString(data1?.passportNumber),
      passportExpiryDate: formatDate(data1?.passportExpiryDate),
      oldPassportNumber: safeString(data1?.oldPassportNumber),
      oldPassportExpiryDate: formatDate(data1?.oldPassportExpiryDate),
    },
    learningExperienceAbroad: {
      countryName: safeString(data1?.visitedCountry),
      institutionAttended: safeString(data1?.institution),
      visaType: safeString(data1?.visaType),
      visaExpiryDate: formatDate(data1?.visaExpiryDate),
      durationOfStudy: safeString(data1?.durationOfStudyAbroad),
    },
    financialSponsorInfo: {
      name: safeString(data1?.sponsorName),
      relationshipWithStudent: safeString(data1?.sponsorRelationship),
      nationality: safeString(data1?.sponsorsNationality),
      occupation: safeString(data1?.sponsorsOccupation),
      email: safeString(data1?.sponsorsEmail),
      phoneNumber: formatPhoneNumber(data1?.countryCode, data1?.sponsorsPhoneNo),
    },
    familyMembers: data1?.familyMembers || [],
    languageProficiency: {
      // countryOfStudy: safeString(data2?.countryOfStudy),
      // proficiencyLevel: safeString(data2?.proficiencyLevel),
      testTaken: safeString(data2?.proficiencyTest),
      overallScore: safeString(data2?.overAllScore),
      listeningScore: safeString(data2?.listeningScore),
      readingScore: safeString(data2?.readingScore),
      writingScore: safeString(data2?.writingScore),
      speakingScore: safeString(data2?.speakingScore),
    },
    educationalBackground: data2?.educationalBackground || [],
    workExperience: data2?.workExperience || [],
    standardizedTests: {
      testName: safeString(data2?.standardizedTest),
      overallScore: safeString(data2?.standardizedOverallScore),
      subScores: data2?.standardizedSubScore?.join(", ") || "",
    },
  };

  if (!data1 || !data2) {
    return <div className="text-center py-10">Loading your application...</div>;
  }

  return (
    <div className="mx-auto p-4">
      {/* Personal Information Section */}
      <div className="flex justify-between">
        <Section title="Personal Information" data={studentData.personalInfo} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=1")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Contact Details Section */}
      <div className="flex justify-between">
        <Section title="Contact Details" data={studentData.contactDetails} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=2")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Passport Information Section */}
      <div className="flex justify-between">
        <Section title="Passport Information" data={studentData.passportInfo} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=3")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Learning Experience Abroad Section */}
      <div className="flex justify-between">
        <Section
          title="Learning Experience Abroad"
          data={studentData.learningExperienceAbroad}
        />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=4")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Financial Sponsor Information Section */}
      <div className="flex justify-between">
        <Section
          title="Financial Sponsor Information"
          data={studentData.financialSponsorInfo}
        />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=5")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Family Members Section */}
      <div className="flex justify-between">
        <Section title="Family Members">
          {studentData.familyMembers.length === 0 ? (
            <p className="text-muted-foreground italic">No family members added yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {studentData.familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
                >
                  {/* Index Number */}
                  <p className="font-medium">{index + 1}</p>
                  <p className="text-sm text-muted-foreground">-</p>

                  {/* Name */}
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{safeString(member.name)}</p>

                  {/* Relationship */}
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{safeString(member.relationship)}</p>

                  {/* Nationality */}
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{safeString(member.nationality)}</p>

                  {/* Occupation */}
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{safeString(member.occupation)}</p>

                  {/* Email */}
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{safeString(member.email)}</p>

                  {/* Phone */}
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{safeString(member.phoneNo)}</p>

                  {/* Divider */}
                  <hr className="col-span-2" />
                </div>
              ))}
            </div>
          )}
        </Section>
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=basicinfo&step=6")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Educational Background Section */}
      <div className="flex justify-between">
        <Section title="Educational Background">
          {studentData.educationalBackground.length === 0 ? (
            <p className="text-muted-foreground italic">No educational background added yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {studentData.educationalBackground.map((education, index) => (
                <div
                  key={index}
                  className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
                >
                  {/* Index Number */}
                  <p className="font-medium">{index + 1}</p>
                  <p className="text-sm text-muted-foreground">-</p>

                  {/* Highest Degree */}
                  <p className="text-sm text-muted-foreground">Highest Degree</p>
                  <p className="font-medium">{safeString(education.highestDegree)}</p>

                  {/* Subject Name */}
                  <p className="text-sm text-muted-foreground">Subject Name</p>
                  <p className="font-medium">{safeString(education.subjectName)}</p>

                  {/* Institution Attended */}
                  <p className="text-sm text-muted-foreground">Institution Attended</p>
                  <p className="font-medium">{safeString(education.institutionAttended)}</p>

                  {/* CGPA/Marks */}
                  <p className="text-sm text-muted-foreground">CGPA/Marks</p>
                  <p className="font-medium">{safeString(education.marks)}</p>

                  {/* Degree Start Date */}
                  <p className="text-sm text-muted-foreground">Degree Start Date</p>
                  <p className="font-medium">{formatDate(education.degreeStartDate)}</p>

                  {/* Degree Completion Date */}
                  <p className="text-sm text-muted-foreground">Degree Completion Date</p>
                  <p className="font-medium">{formatDate(education.degreeEndDate)}</p>

                  {/* Divider */}
                  <hr className="col-span-2" />
                </div>
              ))}
            </div>
          )}
        </Section>
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=appinfo&step=1")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Work Experience Section */}
      <div className="flex justify-between">
        <Section title="Work Experience">
          {studentData.workExperience.length === 0 ? (
            <p className="text-muted-foreground italic">No work experience added yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {studentData.workExperience.map((experience, index) => (
                <div
                  key={index}
                  className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
                >
                  {/* Index Number */}
                  <p className="font-medium">{index + 1}</p>
                  <p className="text-sm text-muted-foreground">-</p>

                  {/* Job Title */}
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{safeString(experience.jobTitle)}</p>

                  {/* Organization Name */}
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{safeString(experience.organizationName)}</p>

                  {/* Employment Type */}
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <p className="font-medium">{safeString(experience.employmentType)}</p>

                  {/* Date From */}
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(experience.from)}</p>

                  {/* Date To */}
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(experience.to)}</p>

                  {/* Divider */}
                  <hr className="col-span-2" />
                </div>
              ))}
            </div>
          )}
        </Section>
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=appinfo&step=2")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Language Proficiency Section */}
      <div className="flex justify-between">
        <Section title="Language Proficiency" data={studentData.languageProficiency} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=appinfo&step=3")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Standardized Test Section */}
      <div className="flex justify-between">
        <Section title="Standardized Test" data={studentData.standardizedTests} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=appinfo&step=4")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>
    </div>
  );
}