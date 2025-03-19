"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PersonalInfoForm from "@/app/(studentdashboard)/dashboard/completeapplication/components/BasicInfo/page";

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
  standardizedTest: {
    testTaken: "SAT",
    overallScore: "1400",
    subScores: "Math: 720, Reading: 350, Writing: 330, Science: N/A",
  },
};

interface SectionProps {
  title: string;
  data: Record<string, string>;
  editLink: string;
  formComponent?: React.ReactNode; // Component to render in modal
}

const Section = ({ title, data, editLink, formComponent }: SectionProps) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Link href={editLink}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="space-y-1 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedField(key);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedField?.replace(/([A-Z])/g, " $1").trim()}
            </DialogTitle>
          </DialogHeader>
          {/* This is where you'll render your form component */}
          {formComponent || (
            <div className="py-6">
              <p className="text-muted-foreground">
                Form component will be rendered here
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function ReviewPage() {
  return (
    <div className="mx-auto p-4">
      {/* Personal Information Section */}
      <Section
        title="Personal Information"
        data={studentData.personalInfo}
        editLink="/personal-info"
        formComponent={<PersonalInfoForm />}
      />

      {/* Contact Details Section */}
      <Section
        title="Contact Details"
        data={studentData.contactDetails}
        editLink="/contact-details"
        formComponent={<PersonalInfoForm />}
      />

      {/* Current Details Section */}
      <Section
        title="Current Details"
        data={studentData.currentDetails}
        editLink="/currentdetails"
      />
      {/* Passport Information Section */}
      <Section
        title="Passport Information"
        data={studentData.passportInfo}
        editLink="/passportInfo"
      />
      {/* Learning Experience Abroad Section */}
      <Section
        title="Learning Experience Abroad"
        data={studentData.learningExperienceAbroad}
        editLink="/learningExperienceAbroad"
      />
      {/* Financial Sponsor Information Section */}
      <Section
        title="Financial Sponsor Information"
        data={studentData.financialSponsorInfo}
        editLink="/financialSponsorInfo"
      />
      {/* Language Proficiency Section */}
      <Section
        title="Language Proficiency"
        data={studentData.languageProficiency}
        editLink="/languageProficiency"
      />
      {/* Standardized Test Section */}
      {/* <Section
        title="Standardized Test"
        data={{
          ...studentData.standardizedTest,
          subScores: Object.entries(studentData.standardizedTest.subScores)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
        }}
        editLink="/standardizedTest"
      /> */}

      <div className="text-right my-4">
        <Button
          type="submit"
          className="w-1/3 sm:w-[17%] bg-red-600 hover:bg-red-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
