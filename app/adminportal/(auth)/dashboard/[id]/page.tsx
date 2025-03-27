"use client";
import { useEffect, useState } from "react";
interface UserData {
  Users: Array<{
    _id: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    contactNo: string;
    dob: string;
    nationality: string;
    country: string;
    city: string;
  }>;
  applications: Array<{
    _id: string;
    user: string;
    countryOfStudy?: string;
    createdAt?: string;
    proficiencyLevel: string;
    proficiencyTest: string;
    overAllScore: string;
    listeningScore: string;
    writingScore: string;
    readingScore: string;
    speakingScore: string;
    standardizedTest: string;
    standardizedOverallScore: string;
    standardizedSubScore: string;
    educationalBackground: Array<{
      highestDegree: string;
      subjectName: string;
      marks: string;
      institutionAttended: string;
      degreeStartDate: string;
      degreeEndDate: string;
    }>;
    workExperience: Array<{
      jobTitle: string;
      organizationName: string;
      employmentType: string;
      from: string;
      to: string;
    }>;
  }>;
  basics: Array<{
    _id: string;
    user: string;
    DOB?: string;
    country?: string;
    familyName: string;
    givenName: string;
    gender: string;
    nationality: string;
    countryOfResidence: string;
    maritalStatus: string;
    religion: string;
    homeAddress: string;
    detailedAddress: string;
    city: string;
    zipCode: string;
    email: string;
    countryCode: string;
    phoneNo: string;
    currentHomeAddress: string;
    currentDetailedAddress: string;
    currentCity: string;
    currentZipCode: string;
    currentEmail: string;
    currentCountryCode: string;
    currentPhoneNo: string;
    hasPassport: boolean;
    passportNumber: string;
    passportExpiryDate: string;
    oldPassportNumber: string;
    oldPassportExpiryDate: string;
    hasStudiedAbroad: boolean;
    visitedCountry: string;
    studyDuration: string;
    institution: string;
    visaType: string;
    visaExpiryDate: string;
    durationOfStudyAbroad: string;
    sponsorName: string;
    sponsorRelationship: string;
    sponsorsNationality: string;
    sponsorsOccupation: string;
    sponsorsEmail: string;
    sponsorsCountryCode: string;
    sponsorsPhoneNo: string;

    familyMembers: Array<{
      name: string;
      relationship: string;
      nationality: string;
      occupation: string;
      email: string;
      countryCode: string;
      phoneNo: string;
    }>;
  }>;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/studentData`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch student data: ${res.status}`);
        }

        const jsonData = (await res.json()) as UserData;
        setData(jsonData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    params.then((resolvedParams) => setStudentId(resolvedParams.id));
  }, [params]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const user = data?.Users.find((u) => u._id === studentId);
  const userApplication = data?.applications.find(
    (app) => app.user === studentId
  );
  const userBasics = data?.basics.find((basic) => basic.user === studentId);

  if (!user) {
    return (
      <div className="text-red-600">No user found with ID: {studentId}</div>
    );
  }
  const familyMembers = userBasics?.familyMembers;
  const workExperience = userApplication?.workExperience;
  const educationalBackground = userApplication?.educationalBackground;
  return (
    <div
      className="bg-[#FCE7D2] min-h-screen"
      style={{
        backgroundImage: "url('/bg-usa.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "crisp-edges",
      }}
    >
      <div className="p-6 max-w-2xl mx-auto ">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 flex justify-center">
            User Profile
          </h1>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Personal Information
              </h2>
              <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Contact No: </strong>
                {user.countryCode} {user.contactNo}
              </p>
              <p>
                <strong>dob: </strong>
                {new Date(user.dob).toLocaleDateString()}
              </p>

              <p>
                <strong>nationality: </strong> {user.nationality}
              </p>
              <p>
                <strong>country: </strong> {user.country}
              </p>
              <p>
                <strong>city: </strong> {user.city}
              </p>
            </div>

            {userBasics && (
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Basic Details
                </h2>

                <p>
                  <strong>familyName:</strong> {userBasics.familyName}
                </p>
                <p>
                  <strong>givenName:</strong> {userBasics.givenName}
                </p>
                <p>
                  <strong>gender:</strong> {userBasics.gender}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {userBasics.DOB
                    ? new Date(userBasics.DOB).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>nationality:</strong> {userBasics.nationality}
                </p>
                <p>
                  <strong>countryOfResidence:</strong>{" "}
                  {userBasics.countryOfResidence}
                </p>
                <p>
                  <strong>maritalStatus:</strong> {userBasics.maritalStatus}
                </p>
                <p>
                  <strong>religion:</strong> {userBasics.religion}
                </p>
                <p>
                  <strong>homeAddress:</strong> {userBasics.homeAddress}
                </p>
                <p>
                  <strong>detailedAddress:</strong> {userBasics.detailedAddress}
                </p>
                <p>
                  <strong>Country:</strong> {userBasics.country}
                </p>
                <p>
                  <strong>city:</strong> {userBasics.city}
                </p>
                <p>
                  <strong>zipCode:</strong> {userBasics.zipCode}
                </p>
                <p>
                  <strong>email:</strong> {userBasics.email}
                </p>
                <p>
                  <strong>countryCode:</strong> {userBasics.countryCode}{" "}
                  {userBasics.phoneNo}
                </p>
                <p>
                  <strong>currentHomeAddress:</strong>{" "}
                  {userBasics.currentHomeAddress}
                </p>
                <p>
                  <strong>currentDetailedAddress:</strong>{" "}
                  {userBasics.currentDetailedAddress}
                </p>
                <p>
                  <strong>currentCity:</strong> {userBasics.currentCity}
                </p>
                <p>
                  <strong>currentZipCode:</strong> {userBasics.currentZipCode}
                </p>
                <p>
                  <strong>currentEmail:</strong> {userBasics.currentEmail}
                </p>
                <p>
                  <strong>currentCountryCode:</strong>{" "}
                  {userBasics.currentCountryCode}
                </p>
                <p>
                  <strong>currentPhoneNo:</strong> {userBasics.currentPhoneNo}
                </p>
                <p>
                  <strong>hasPassport:</strong> {userBasics.hasPassport}
                </p>
                <p>
                  <strong>passportNumber:</strong> {userBasics.passportNumber}
                </p>
                <p>
                  <strong>passportExpiryDate:</strong>{" "}
                  {userBasics.passportExpiryDate}
                </p>
                <p>
                  <strong>oldPassportNumber:</strong>{" "}
                  {userBasics.oldPassportNumber}
                </p>
                <p>
                  <strong>oldPassportExpiryDate:</strong>{" "}
                  {userBasics.oldPassportExpiryDate}
                </p>
                <p>
                  <strong>hasStudiedAbroad:</strong>{" "}
                  {userBasics.hasStudiedAbroad}
                </p>
                <p>
                  <strong>visitedCountry:</strong> {userBasics.visitedCountry}
                </p>
                <p>
                  <strong>studyDuration:</strong> {userBasics.studyDuration}
                </p>
                <p>
                  <strong>institution:</strong> {userBasics.institution}
                </p>
                <p>
                  <strong>visaType:</strong> {userBasics.visaType}
                </p>
                <p>
                  <strong>visaExpiryDate:</strong> {userBasics.visaExpiryDate}
                </p>
                <p>
                  <strong>durationOfStudyAbroad:</strong>{" "}
                  {userBasics.durationOfStudyAbroad}
                </p>
                <p>
                  <strong>sponsorName:</strong> {userBasics.sponsorName}
                </p>
                <p>
                  <strong>sponsorRelationship:</strong>{" "}
                  {userBasics.sponsorRelationship}
                </p>
                <p>
                  <strong>sponsorsNationality:</strong>{" "}
                  {userBasics.sponsorsNationality}
                </p>
                <p>
                  <strong>sponsorsOccupation:</strong>{" "}
                  {userBasics.sponsorsOccupation}
                </p>
                <p>
                  <strong>sponsorsEmail:</strong> {userBasics.sponsorsEmail}
                </p>
                <p>
                  <strong>sponsorsCountryCode:</strong>{" "}
                  {userBasics.sponsorsCountryCode}
                </p>
                <p>
                  <strong>sponsorsPhoneNo:</strong> {userBasics.sponsorsPhoneNo}
                </p>
                <strong>Family Members:</strong>
                {(familyMembers ?? []).map((familyMember, i) => (
                  <div key={i}>
                    <p>
                      <strong>Name:</strong> {familyMember.name}
                    </p>
                    <p key={i}>
                      <strong>relationship:</strong> {familyMember.relationship}
                    </p>
                    <p key={i}>
                      <strong>nationality:</strong> {familyMember.nationality}
                    </p>
                    <p key={i}>
                      <strong>occupation:</strong> {familyMember.occupation}
                    </p>
                    <p key={i}>
                      <strong>email:</strong> {familyMember.email}
                    </p>
                    <p key={i}>
                      <strong>phoneNo:</strong> {familyMember.countryCode}{" "}
                      {familyMember.phoneNo}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {userApplication && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Application Details
                </h2>
                <p>
                  <strong>Country of Study:</strong>{" "}
                  {userApplication.countryOfStudy}
                </p>
                <p>
                  <strong>proficiencyLevel:</strong>{" "}
                  {userApplication.proficiencyLevel}
                </p>
                <p>
                  <strong>proficiencyTest:</strong>{" "}
                  {userApplication.proficiencyTest}
                </p>
                <p>
                  <strong>overAllScore:</strong> {userApplication.overAllScore}
                </p>
                <p>
                  <strong>listeningScore:</strong>{" "}
                  {userApplication.listeningScore}
                </p>
                <p>
                  <strong>writingScore:</strong> {userApplication.writingScore}
                </p>
                <p>
                  <strong>readingScore:</strong> {userApplication.readingScore}
                </p>
                <p>
                  <strong>speakingScore:</strong>{" "}
                  {userApplication.speakingScore}
                </p>
                <p>
                  <strong>standardizedTest:</strong>{" "}
                  {userApplication.standardizedTest}
                </p>
                <p>
                  <strong>standardizedOverallScore:</strong>{" "}
                  {userApplication.standardizedOverallScore}
                </p>
                <p>
                  <strong>standardizedSubScore:</strong>{" "}
                  {userApplication.standardizedSubScore}
                </p>
                {(educationalBackground ?? []).map((edubg, i) => (
                  <div key={i}>
                    <p>
                      <strong>highestDegree:</strong> {edubg.highestDegree}
                    </p>
                    <p>
                      <strong>subjectName:</strong> {edubg.subjectName}
                    </p>
                    <p>
                      <strong>marks:</strong> {edubg.marks}
                    </p>
                    <p>
                      <strong>institutionAttended:</strong>{" "}
                      {edubg.institutionAttended}
                    </p>
                    <p>
                      <strong>degreeStartDate:</strong>
                      {new Date(edubg.degreeStartDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>degreeEndDate:</strong>
                      {new Date(edubg.degreeEndDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(workExperience ?? []).map((workExperience, i) => (
                  <div key={i}>
                    <p>
                      <strong>jobTitle:</strong> {workExperience.jobTitle}
                    </p>
                    <p>
                      <strong>organizationName:</strong>{" "}
                      {workExperience.organizationName}
                    </p>
                    <p>
                      <strong>employmentType:</strong>{" "}
                      {workExperience.employmentType}
                    </p>
                    <p>
                      <strong>from:</strong>{" "}
                      {new Date(workExperience.from).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>to:</strong>
                      {new Date(workExperience.to).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
