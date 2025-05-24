"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  File,
  Eye,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

interface UserData {
  Users: Array<{
    _id: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    contactNo: string;

    city: string;
    phone: string;
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
  documents: Array<{
    _id: string;
    user: string;
    documents: Array<{
      name: string;
      files: Array<{
        name: string;
        url: string;
        public_id?: string;
      }>;
      date: string;
      isChecked: boolean;
    }>;
  }>;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

  // Function to get file type from URL or file name
  const getFileType = (url: string, fileName: string) => {
    const extension =
      fileName.split(".").pop()?.toLowerCase() ||
      url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return "image";
    } else if (["pdf"].includes(extension || "")) {
      return "pdf";
    } else if (["doc", "docx"].includes(extension || "")) {
      return "document";
    }
    return "unknown";
  };

  // Function to handle image loading
  const handleImageLoad = (index: number) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  // Function to handle image loading start
  const handleImageLoadStart = (index: number) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Function to download file
  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  // Function to preview file
  const handlePreview = (url: string, fileName: string) => {
    const fileType = getFileType(url, fileName);
    setPreviewFile({ url, name: fileName, type: fileType });
  };

  // Close preview
  const closePreview = () => {
    setPreviewFile(null);
  };

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

  const user = data?.Users.find((u) => u._id === studentId);
  const userApplication = data?.applications.find(
    (app) => app.user === studentId
  );
  const userBasics = data?.basics.find((basic) => basic.user === studentId);

  // Get documents for the specific user
  const userDocuments = data?.documents.find((doc) => doc.user === studentId);

  // Extract file data for the specific user
  const fileData =
    userDocuments?.documents.flatMap((document) =>
      document.files.map((file) => ({
        url: file.url,
        name: file.name,
        documentName: document.name,
        date: document.date,
        isChecked: document.isChecked,
      }))
    ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Student Not Found
          </h2>
          <p className="text-gray-600">No user found with ID: {studentId}</p>
        </div>
      </div>
    );
  }

  const familyMembers = userBasics?.familyMembers;
  const workExperience = userApplication?.workExperience;
  const educationalBackground = userApplication?.educationalBackground;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Quick Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {/* {user.countryCode} {user.contactNo} */}
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents Summary */}
            {fileData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Documents Summary
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {fileData.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Files</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            {userBasics && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Family Name
                      </label>
                      <p className="text-gray-900">{userBasics.familyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Given Name
                      </label>
                      <p className="text-gray-900">{userBasics.givenName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Gender
                      </label>
                      <p className="text-gray-900">{userBasics.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Marital Status
                      </label>
                      <p className="text-gray-900">
                        {userBasics.maritalStatus}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Religion
                      </label>
                      <p className="text-gray-900">{userBasics.religion}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Country of Residence
                      </label>
                      <p className="text-gray-900">
                        {userBasics.countryOfResidence}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Home Address
                      </label>
                      <p className="text-gray-900">{userBasics.homeAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        City
                      </label>
                      <p className="text-gray-900">{userBasics.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Zip Code
                      </label>
                      <p className="text-gray-900">{userBasics.zipCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {userBasics.countryCode} {userBasics.phoneNo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passport Information */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Passport Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Has Passport
                        </label>
                        <p className="text-gray-900 flex items-center gap-2">
                          {userBasics.hasPassport ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              No
                            </>
                          )}
                        </p>
                      </div>
                      {userBasics.passportNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Passport Number
                          </label>
                          <p className="text-gray-900">
                            {userBasics.passportNumber}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {userBasics.passportExpiryDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Passport Expiry
                          </label>
                          <p className="text-gray-900">
                            {userBasics.passportExpiryDate}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Studied Abroad
                        </label>
                        <p className="text-gray-900 flex items-center gap-2">
                          {userBasics.hasStudiedAbroad ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              No
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Members */}
                {familyMembers && familyMembers.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Family Members
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {familyMembers.map((member, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {member.relationship}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.occupation}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Application Details */}
            {userApplication && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-500" />
                  Application Details
                </h2>

                {/* Language Proficiency */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Language Proficiency
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userApplication.overAllScore}
                      </div>
                      <div className="text-sm text-gray-600">Overall</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userApplication.listeningScore}
                      </div>
                      <div className="text-sm text-gray-600">Listening</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {userApplication.writingScore}
                      </div>
                      <div className="text-sm text-gray-600">Writing</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {userApplication.speakingScore}
                      </div>
                      <div className="text-sm text-gray-600">Speaking</div>
                    </div>
                  </div>
                </div>

                {/* Educational Background */}
                {educationalBackground && educationalBackground.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Educational Background
                    </h3>
                    <div className="space-y-4">
                      {educationalBackground.map((edu, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {edu.highestDegree}
                            </h4>
                            <span className="text-sm text-gray-600">
                              {edu.marks}
                            </span>
                          </div>
                          <p className="text-gray-700">{edu.subjectName}</p>
                          <p className="text-sm text-gray-600">
                            {edu.institutionAttended}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(edu.degreeStartDate).toLocaleDateString()}{" "}
                            - {new Date(edu.degreeEndDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {workExperience && workExperience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {workExperience.map((work, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {work.jobTitle}
                            </h4>
                            <span className="text-sm text-gray-600 capitalize">
                              {work.employmentType}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {work.organizationName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(work.from).toLocaleDateString()} -{" "}
                            {new Date(work.to).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documents */}
            {fileData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Documents ({fileData.length} files)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fileData.map((file, index) => {
                    const fileType = getFileType(file.url, file.name);
                    const isLoading = imageLoadingStates[index];

                    return (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {file.documentName}
                            </h4>
                            {file.isChecked ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{file.date}</p>
                        </div>

                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative mb-4">
                          {fileType === "image" ? (
                            <>
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                              )}
                              <Image
                                src={file.url}
                                alt={file.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                                onLoadStart={() => handleImageLoadStart(index)}
                                onLoad={() => handleImageLoad(index)}
                                onError={() => handleImageLoad(index)}
                                loading="lazy"
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              {fileType === "pdf" ? (
                                <FileText className="w-12 h-12 text-red-500 mb-2" />
                              ) : (
                                <File className="w-12 h-12 text-blue-500 mb-2" />
                              )}
                              <p className="text-xs text-gray-600 text-center px-2 font-medium">
                                {fileType === "pdf"
                                  ? "PDF Document"
                                  : "Document"}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(file.url, file.name)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload(file.url, file.name)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-5xl max-h-full w-full overflow-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-900">
                {previewFile.name}
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              {previewFile.type === "image" ? (
                <div className="flex justify-center">
                  <Image
                    src={previewFile.url}
                    alt={previewFile.name}
                    width={800}
                    height={600}
                    className="max-w-full h-auto object-contain rounded-lg"
                  />
                </div>
              ) : previewFile.type === "pdf" ? (
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab
                </a>
              ) : (
                <div className="text-center py-12">
                  <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Preview not available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  <button
                    onClick={() =>
                      handleDownload(previewFile.url, previewFile.name)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download to view
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() =>
                  handleDownload(previewFile.url, previewFile.name)
                }
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
              <button
                onClick={closePreview}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
