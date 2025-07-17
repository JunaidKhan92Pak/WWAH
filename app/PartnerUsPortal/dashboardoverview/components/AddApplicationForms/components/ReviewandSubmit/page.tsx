"use client";

import { Button } from "@/components/ui/button";
import { MdModeEditOutline } from "react-icons/md";
// type ReviewandSubmitProps = {
//   onSubmit: () => void;
// };
const Section = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="mb-6 w-full">
    <button className="flex flex-row items-center whitespace-nowrap rounded-lg mb-4 p-2 bg-[#F4D0D2]">
      <p className="font-semibold">{title}</p>
    </button>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </div>
);

export default function ReviewandSubmit() {
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="w-full space-y-2">
          <Field label="Student ID" value="#65453221" />
          <Field label="Application ID" value="#745678" />
        </div>

        <Button className="bg-[#F4D0D2] hover:bg-[#F4D0D2] text-black flex items-center gap-1">
          Edit <MdModeEditOutline />
        </Button>
      </div>
      <div className="flex justify-between">
        <Section title="Personal Information">
          <div className="w-full space-y-2">
            <Field label="Family Name" value="Doe" />
            <Field label="Given Name" value="John" />
            <Field label="Gender" value="Male" />
            <Field label="Date of Birth" value="01/01/2000" />
            <Field label="Nationality" value="Pakistani" />
            <Field label="Country of Residence" value="Pakistan" />
            <Field label="Marital Status" value="Single" />
            <Field label="Religious" value="Islam " />
            <Field label="Email" value="user@example.com" />
          </div>
        </Section>
      </div>

      <Section title="Contact Details">
        <div className="w-full space-y-2">
          <Field
            label="Current Permanent Address"
            value="123 Maple Street, Model Town"
          />
          <Field
            label="Permanent Address"
            value="House #45, Block A, Model Town"
          />
          <Field label="Country" value="Pakistan" />
          <Field label="City/Province" value="Lahore, Punjab" />
          <Field label="Zip Code" value="54000" />
          <Field label="Email" value="john.doe@example.com" />
          <Field label="Phone No." value="+92-300-1234567" />
        </div>
      </Section>
      <Section title="Current Address">
        <div className="w-full space-y-2">
          <Field
            label="Current Permanent Address"
            value="123 Maple Street, Model Town"
          />
          <Field
            label="Permanent Address"
            value="House #45, Block A, Model Town"
          />
          <Field label="Country" value="Pakistan" />
          <Field label="City/Province" value="Lahore, Punjab" />
          <Field label="Zip Code" value="54000" />
          <Field label="Email" value="john.doe@example.com" />
          <Field label="Phone No." value="+92-300-1234567" />
        </div>
      </Section>

      <Section title="Passport & Visa Information">
        <div className="w-full space-y-2">
          <Field label="Passport No" value="A12345678" />
          <Field label="Passport Expiry Date" value="01/01/2030" />
          <Field label="Old Passport No" value="B98765432" />
          <Field label="Old Passport Expiry Date" value="01/01/2020" />
        </div>
      </Section>

      <Section title="Learning Experience Abroad">
        <div className="w-full space-y-2">
          <Field label="Country Name" value="Canada" />
          <Field
            label="Institution You have Attended"
            value="University of Toronto"
          />
          <Field label="Visa Type" value="Student Visa" />
          <Field label="Expiry Date" value="30/06/2025" />
          <Field label="Duration of Studying in Abroad" value="2 Years" />
        </div>
      </Section>

      <Section title="Financial Sponsor Information">
        <div className="w-full space-y-2">
          <Field label="Name" value="Mr. Ahmed Khan" />
          <Field label="Nationality" value="Pakistani" />
          <Field label="Industry Type" value="Banking" />
          <Field label="Institute/Employer" value="Habib Bank Limited" />
          <Field label="Relationship with the Student" value="Father" />
          <Field label="Occupation" value="Branch Manager" />
          <Field label="Phone No." value="+92-300-1234567" />
          <Field label="Email" value="ahmed.khan@example.com" />
        </div>
      </Section>

      <Section title="Educational Background">
        <Repeater index={1}>
          <Field label="Highest Degree" value="BSc Computer Science" />
          <Field label="Subject Name" value="Computer Science" />
          <Field label="Institution Attended" value="University of Example" />
          <Field label="Degree Start Date" value="01/09/2018" />
          <Field label="Degree Completion Date" value="30/06/2022" />
          <Field label="CGPA/Marks" value="3.9 GPA" />
          <Field
            label="How many years did you study this qualification for?"
            value="4 Years"
          />
        </Repeater>
      </Section>

      <Section title="Work Experience">
        <Repeater index={1}>
          <Field label="Job Title" value="Software Engineer" />
          <Field label="Organization Name" value="Tech Corp Pvt Ltd" />
          <Field label="Date From" value="01/06/2020" />
          <Field label="Date To" value="01/06/2022" />
        </Repeater>
      </Section>
      <Section title="Language Proficiency">
        <div className="w-full space-y-2">
          <Field
            label="What is your English proficiency level?"
            value="Advanced"
          />
          <Field
            label="Which English proficiency test have you taken?"
            value="IELTS"
          />
          <Field label="Country of study" value="Pakistan" />
          <Field label="Score in Speaking" value="7.0" />
          <Field label="Score in Writing" value="7.0" />
          <Field label="Score in Listening" value="8.0" />
          <Field label="Score in Reading" value="7.5" />
          <Field label="Overall Score" value="7.5" />
        </div>
      </Section>

      <Section title="Standardized Test">
        <div className="w-full space-y-2">
          <Field label="Which standardized test have you taken?" value="SAT" />
          <Field label="Overall Score" value="1400" />
          <Field label="Sub Scores" value="56, 98, 78, 88" />
        </div>
      </Section>

      {/*Submit Button */}
      <div className="flex justify-end mt-6">
        <Button className="bg-red-600 hover:bg-red-500 text-white px-12">
          Submit
        </Button>
      </div>
    </div>
  );
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 space-y-1 items-start">
    <p className="text-sm text-muted-foreground capitalize">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Repeater = ({
  //   index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    {/* <p className="font-medium">{index}</p>
    <p className="text-sm text-muted-foreground">-</p> */}
    {children}
  </div>
);
