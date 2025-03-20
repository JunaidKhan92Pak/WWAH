"use client";

import { Button } from "@/components/ui/button";
import { MdModeEditOutline } from "react-icons/md";
// Mock data - replace this with your actual data fetching logic
const studentData = {
  personalInfo: {
    familyName: "Muhammad Ahmad",
    givenName: "Muhammad Ahmad Haseen",
    nationality: "Pakistan",
    nativeLanguage: "Urdu",
    dateOfBirth: "25-06-2005",
    countryOfResidence: "Pakistan",
    gender: "Female",
    maritalStatus: "Single",
    religion: "Islam",
  },
  contactDetails: {
    homeAddress: "Johar Town Lahore",
    detailedAddress: "street-no13 ,block no.230 johar town lahore",
    country: "Pakistan",
    cityProvince: "Lahore/Punjab",
    zipCode: "Pakistan",
    phoneNumber: "03334487969",
    email: "muhammadahmad903@gmail.com",
  },
  currentDetails: {
    homeAddress: "Johar Town Lahore",
    detailedAddress: "street-no13 ,block no.230 johar town lahore",
    country: "Pakistan",
    cityProvince: "Lahore/Punjab",
    zipCode: "Pakistan",
    phoneNumber: "03334487969",
    email: "muhammadahmad903@gmail.com",
  },
  passportInfo: {
    passportNumber: "12345",
    passportExpiryDate: "23/25",
    oldPassportNumber: "34567",
    oldPassportExpiryDate: "11/11",
  },
  learningExperienceAbroad: {
    countryName: "United Kingdom",
    institutionAttended: "Oxford University",
    visaType: "Student Visa",
    visaExpiryDate: "12/31/2026",
    durationOfStudy: "2 years",
  },
  financialSponsorInfo: {
    name: "Ahmed Khan",
    relationshipWithStudent: "Father",
    nationality: "Pakistan",
    occupation: "Businessman",
    email: "ahmed.khan@example.com",
    phoneNumber: "+92 300 1234567",
  },
  familyMembers: [
    {
      name: "Fatima Khan",
      relationshipWithStudent: "Mother",
      nationality: "Pakistan",
      occupation: "Doctor",
      email: "fatima.khan@example.com",
      phoneNumber: "+92 321 9876543",
    },
    {
      name: "Ali Khan",
      relationshipWithStudent: "Mother",
      nationality: "Pakistan",
      occupation: "Doctor",
      email: "fatima.khan@example.com",
      phoneNumber: "+92 321 9876543",
    },
  ],
  languageProficiency: {
    countryOfStudy: "United States",
    proficiencyLevel: "Advanced",
    testTaken: "IELTS",
    overallScore: "8.0",
    listeningScore: "8.5",
    readingScore: "7.5",
    writingScore: "7.0",
    speakingScore: "8.0",
  },

  educationalBackground: [
    {
      highestDegree: "Bachelor's in Computer Science",
      subjectName: "Software Engineering",
      institutionAttended: "COMSATS University",
      cgpaOrMarks: "3.8/4.0",
      degreeStartDate: "09/01/2019",
      degreeCompletionDate: "06/30/2023",
    },
    {
      highestDegree: "High School",
      subjectName: "Pre-Engineering",
      institutionAttended: "Punjab College",
      cgpaOrMarks: "85%",
      degreeStartDate: "09/01/2017",
      degreeCompletionDate: "06/30/2019",
    },
  ],
  workExperience: [
    {
      jobTitle: "Frontend Developer",
      organizationName: "SYN DEV AI",
      employmentType: "Full Time",
      dateFrom: "12/01/2023",
      dateTo: "Present",
    },
    {
      jobTitle: "Frontend Developer Intern",
      organizationName: "Software House XYZ",
      employmentType: "Part Time",
      dateFrom: "06/01/2023",
      dateTo: "11/30/2023",
    },
  ],
  standardizedTests: [
    {
      testName: "IELTS",
      overallScore: "7.5",
      subScores: {
        listening: "8.0",
        reading: "7.0",
        writing: "6.5",
        speaking: "7.5",
      },
    },
    {
      testName: "TOEFL",
      overallScore: "100",
      subScores: {
        listening: "25",
        reading: "24",
        writing: "26",
        speaking: "25",
      },
    },
  ],
};

const fdataMap = studentData.familyMembers;
const wdataMap = studentData.workExperience;
const edataMap = studentData.educationalBackground;
const sdataMap = studentData.standardizedTests;
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
  return (
    <div className="mx-auto p-4">
      {/* Personal Information Section */}
      <div className="flex justify-between">
        <Section title="Personal Information" data={studentData.personalInfo} />
        <Button
          className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1"
          onClick={() => window.location.reload()}
        >
          Edit <MdModeEditOutline />
        </Button>
      </div>

      {/* Contact Details Section */}
      <Section title="Contact Details" data={studentData.contactDetails} />
      {/* Current Details Section */}
      <Section title="Current Details" data={studentData.currentDetails} />
      {/* Passport Information Section */}
      <Section title="Passport Information" data={studentData.passportInfo} />
      {/* Learning Experience Abroad Section */}
      <Section
        title="Learning Experience Abroad"
        data={studentData.learningExperienceAbroad}
      />
      {/* Financial Sponsor Information Section */}
      <Section
        title="Financial Sponsor Information"
        data={studentData.financialSponsorInfo}
      />
      {/* Language Proficiency Section */}
      <Section
        title="Language Proficiency"
        data={studentData.languageProficiency}
      />
      {/* Family Members Section */}
      <Section title="Family Members">
        <div className="grid grid-cols-1 gap-4">
          {fdataMap.map((member, index) => (
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
              <p className="font-medium">{member.relationshipWithStudent}</p>

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
              <p className="font-medium">{member.phoneNumber}</p>

              {/* Divider */}
              <hr className="col-span-2" />
            </div>
          ))}
        </div>
      </Section>
      {/* Educational Background Section */}
      <Section title="Educational Background">
        <div className="grid grid-cols-1 gap-4">
          {edataMap.map((education, index) => (
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
              <p className="font-medium">{education.cgpaOrMarks}</p>

              {/* Degree Start Date */}
              <p className="text-sm text-muted-foreground">Degree Start Date</p>
              <p className="font-medium">{education.degreeStartDate}</p>

              {/* Degree Completion Date */}
              <p className="text-sm text-muted-foreground">
                Degree Completion Date
              </p>
              <p className="font-medium">{education.degreeCompletionDate}</p>

              {/* Divider */}
              <hr className="col-span-2" />
            </div>
          ))}
        </div>
      </Section>
      {/* Work Experience Section */}
      <Section title="Work Experience">
        <div className="grid grid-cols-1 gap-4">
          {wdataMap.map((experience, index) => (
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
              <p className="font-medium">{experience.dateFrom}</p>

              {/* Date To */}
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{experience.dateTo}</p>

              {/* Divider */}
              <hr className="col-span-2" />
            </div>
          ))}
        </div>
      </Section>
      {/* Standardized Test Section */}
      <Section title="Standardized Test">
        <div className="grid grid-cols-1 gap-4">
          {sdataMap.map((test, index) => (
            <div
              key={index}
              className="space-y-1 grid grid-cols-1 sm:grid-cols-[30%,70%]"
            >
              {/* Index Number */}
              <p className="font-medium">{index + 1}</p>
              <p className="text-sm text-muted-foreground">-</p>

              {/* Test Name */}
              <p className="text-sm text-muted-foreground">Test Name</p>
              <p className="font-medium">{test.testName}</p>

              {/* Overall Score */}
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="font-medium">{test.overallScore}</p>

              {/* Sub Scores */}
              <p className="text-sm text-muted-foreground">Sub Scores</p>
              <div className="font-medium space-y-1">
                {Object.entries(test.subScores).map(([subject, score], i) => (
                  <p key={i}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}:{" "}
                    {score}
                  </p>
                ))}
              </div>

              {/* Divider */}
              <hr className="col-span-2" />
            </div>
          ))}
        </div>
      </Section>
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
