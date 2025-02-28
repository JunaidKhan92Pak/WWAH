"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TbEdit } from "react-icons/tb";

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
};

const Section = ({
  title,
  data,
  editLink,
}: {
  title: string;
  data: Record<string, string>;
  editLink: string;
}) => (
  <div className="mb-6">
    <button className="flex flex-row items-center whitespace-nowrap rounded-lg mb-4  px-4 bg-[#F4D0D2]">
      <p className="font-semibold">{title}</p>
      <Link href={editLink}>
        <Button className="hover:bg-[#F4D0D2]" variant="ghost" size="icon">
          <TbEdit />
        </Button>
      </Link>
    </button>
    <div>
      <div className="grid grid-cols-1  gap-4">
        {Object.entries(data).map(([key, value]) => (
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
      </div>
    </div>
  </div>
);

export default function ReviewPage() {
  return (
    <div className="mx-auto p-4">
      {/* Personal Information Section */}
      <Section
        title="Personal Information"
        data={studentData.personalInfo}
        editLink="/personal-info"
      />

      {/* Contact Details Section */}
      <Section
        title="Contact Details"
        data={studentData.contactDetails}
        editLink="/contact-details"
      />
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
