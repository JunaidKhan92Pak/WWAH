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
      <div className="grid grid-cols-1  gap-4">
        {data &&
          Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
            >
              <p className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        {children}
      </div>
    </div>
  </div>
);
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
    currentZipCode?: string;
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
  // console.log(data1, "data 1");
  // console.log(data2, "data 2");
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
      familyName: `${data1?.familyName}`,
      givenName: `${data1?.givenName}`,
      nationality: `${data1?.nationality}`,
      // dateOfBirth: `${data1?.DOB}`,
      dateOfBirth: data1?.DOB
        ? new Date(data1.DOB).toLocaleDateString("en-GB")
        : "N/A",
      countryOfResidence: `${data1?.countryOfResidence}`,
      gender: `${data1?.gender}`,
      maritalStatus: `${data1?.maritalStatus}`,
      religion: `${data1?.religion}`,
    },
    contactDetails: {
      currentAddress: `${data1?.permanentAddress}`,
      permanentAddress: `${data1?.currentAddress}`,
      country: `${data1?.country}`,
      // cityProvince: `${data1?.religion}`,
      zipCode: `${data1?.currentZipCode}`,
      phoneNumber: `${data1?.countryCode}-${data1?.phoneNo}`,
      // email: `${data1?.religion}`,
    },
    currentDetails: {
      currentAddress: `${data1?.permanentAddress}`,
      permanentAddress: `${data1?.currentAddress}`,
      country: `${data1?.currentCountry}`,
      cityProvince: `${data1?.currentCity}`,
      zipCode: `${data1?.currentZipCode}`,
      phoneNumber: `${data1?.countryCode}-${data1?.currentPhoneNo}`,
      email: `${data1?.currentEmail}`,
    },
    passportInfo: {
      passportNumber: `${data1?.passportNumber}`,
      passportExpiryDate: data1?.passportExpiryDate
        ? new Date(data1.passportExpiryDate).toLocaleDateString("en-GB")
        : "N/A",
      oldPassportNumber: `${data1?.oldPassportNumber}`,
      oldPassportExpiryDate: data1?.oldPassportExpiryDate
        ? new Date(data1.oldPassportExpiryDate).toLocaleDateString("en-GB")
        : "N/A",
    },
    learningExperienceAbroad: {
      countryName: `${data1?.visitedCountry}`,
      institutionAttended: `${data1?.institution}`,
      visaType: `${data1?.visaType}`,
      visaExpiryDate: data1?.visaExpiryDate
        ? new Date(data1.visaExpiryDate).toLocaleDateString("en-GB")
        : "N/A",
      durationOfStudy: `${data1?.durationOfStudyAbroad}`,
    },
    financialSponsorInfo: {
      name: `${data1?.sponsorName}`,
      relationshipWithStudent: `${data1?.sponsorRelationship}`,
      nationality: `${data1?.sponsorsNationality}`,
      occupation: `${data1?.sponsorsOccupation}`,
      email: `${data1?.sponsorsEmail}`,
      phoneNumber: `${data1?.countryCode}-${data1?.sponsorsPhoneNo}`,
    },
    familyMembers: data1?.familyMembers,
    languageProficiency: {
      countryOfStudy: `${data2?.countryOfStudy}`,
      proficiencyLevel: `${data2?.proficiencyLevel}`,
      testTaken: `${data2?.proficiencyTest}`,
      overallScore: `${data2?.overAllScore}`,
      listeningScore: `${data2?.listeningScore}`,
      readingScore: `${data2?.readingScore}`,
      writingScore: `${data2?.writingScore}`,
      speakingScore: `${data2?.speakingScore}`,
    },
    educationalBackground: data2?.educationalBackground,
    workExperience: data2?.workExperience,
    standardizedTests: {
      testName: `${data2?.standardizedTest}`,
      overallScore: `${data2?.standardizedOverallScore}`,
      subScores: data2?.standardizedSubScore?.join(", ") || "",
    },
  };
  const fdataMap = studentData?.familyMembers;
  const wdataMap = studentData?.workExperience;
  const edataMap = studentData?.educationalBackground;

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

      {/* Current Details Section */}
      {/* <div className="flex justify-between">
        <Section title="Current Details" data={studentData.currentDetails} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() => router.push("/dashboard/completeapplication?tab=basicinfo&step=3")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div> */}

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
      {/* Language Proficiency Section */}
      {/* <div>
        <Section title="Language Proficiency" data={studentData.languageProficiency} />
      </div> */}
      {/* Family Members Section */}
      <div className="flex justify-between">
        <Section title="Family Members">
          <div className="grid grid-cols-1 gap-4">
            {fdataMap?.map((member, index) => (
              <div
                key={index}
                className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
              >
                {/* Index Number */}
                <p className="font-medium">{index + 1}</p>
                <p className="text-sm text-muted-foreground">-</p>

                {/* Name */}
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{member.name}</p>

                {/* Relationship */}
                <p className="text-sm text-muted-foreground">Relationship</p>
                <p className="font-medium">{member.relationship}</p>

                {/* Nationality */}
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{member.nationality}</p>

                {/* Occupation */}
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{member.occupation}</p>

                {/* Email */}
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{member.email}</p>

                {/* Phone */}
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{member.phoneNo}</p>

                {/* Divider */}
                <hr className="col-span-2" />
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 gap-4">
            {edataMap?.map((education, index) => (
              <div
                key={index}
                className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
              >
                {/* Index Number */}
                <p className="font-medium">{index + 1}</p>
                <p className="text-sm text-muted-foreground">-</p>

                {/* Highest Degree */}
                <p className="text-sm text-muted-foreground">Highest Degree</p>
                <p className="font-medium">{education.highestDegree}</p>

                {/* Subject Name */}
                <p className="text-sm text-muted-foreground">Subject Name</p>
                <p className="font-medium">{education.subjectName}</p>

                {/* Institution Attended */}
                <p className="text-sm text-muted-foreground">
                  Institution Attended
                </p>
                <p className="font-medium">{education.institutionAttended}</p>

                {/* CGPA/Marks */}
                <p className="text-sm text-muted-foreground">CGPA/Marks</p>
                <p className="font-medium">{education.marks}</p>

                {/* Degree Start Date */}
                <p className="text-sm text-muted-foreground">
                  Degree Start Date
                </p>

                <p className="font-medium">
                  {new Date(education.degreeStartDate).toLocaleDateString()}
                </p>

                {/* Degree Completion Date */}
                <p className="text-sm text-muted-foreground">
                  Degree Completion Date
                </p>
                <p className="font-medium">
                  {new Date(education.degreeEndDate).toLocaleDateString()}
                </p>

                {/* Divider */}
                <hr className="col-span-2" />
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 gap-4">
            {wdataMap?.map((experience, index) => (
              <div
                key={index}
                className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
              >
                {/* Index Number */}
                <p className="font-medium">{index + 1}</p>
                <p className="text-sm text-muted-foreground">-</p>

                {/* Job Title */}
                <p className="text-sm text-muted-foreground">Job Title</p>
                <p className="font-medium">{experience.jobTitle}</p>

                {/* Organization Name */}
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-medium">{experience.organizationName}</p>

                {/* Employment Type */}
                <p className="text-sm text-muted-foreground">Employment Type</p>
                <p className="font-medium">{experience.employmentType}</p>

                {/* Date From */}
                <p className="text-sm text-muted-foreground">Start Date</p>

                <p className="font-medium">
                  {new Date(experience.from).toLocaleDateString()}
                </p>

                {/* Date To */}
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {new Date(experience.to).toLocaleDateString()}
                </p>

                {/* Divider */}
                <hr className="col-span-2" />
              </div>
            ))}
          </div>
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
      {/* Standardized Test Section */}
      <div className="flex justify-between">
        <Section title="Standardized Test" data={studentData.standardizedTests}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]">
              {/* Divider */}
              <hr className="col-span-2" />
            </div>
          </div>
        </Section>
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() =>
            router.push("/dashboard/completeapplication?tab=appinfo&step=4")
          }
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>
      {/* <div className="text-right my-4">
        <Button
          type="submit"
          className="w-1/3 sm:w-[17%] bg-red-600 hover:bg-red-700"
        >
          Submit
        </Button>
      </div> */}
    </div>
  );
}
