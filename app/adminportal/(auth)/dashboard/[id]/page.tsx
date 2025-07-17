// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// import {
//   Download,
//   FileText,
//   File,
//   Eye,
//   User,
//   Mail,
//   Phone,
//   GraduationCap,
//   Briefcase,
//   Users,
//   ChevronDown,
//   CheckCircle,
//   Clock,
//   X,
//   MapPin,
//   Calendar,
//   DollarSign,
//   Share2,
//   Heart,
//   AlertCircle,
//   Save,
// } from "lucide-react";

// import { getAuthToken } from "@/utils/authHelper";

// interface UserData {
//   Users: Array<{
//     _id: string;
//     role: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     countryCode: string;
//     contactNo: string;
//     city: string;
//     phone: string;
//   }>;
//   applications: Array<{
//     _id: string;
//     user: string;
//     countryOfStudy?: string;
//     courseName: string;
//     courseFee: string;
//     courseDuration: string;
//     applicationDeadline: string;
//     applicationStatus: number;
//     createdAt?: string;
//     proficiencyLevel: string;
//     proficiencyTest: string;
//     overAllScore: string;
//     listeningScore: string;
//     writingScore: string;
//     readingScore: string;
//     speakingScore: string;
//     standardizedTest: string;
//     standardizedOverallScore: string;
//     standardizedSubScore: string;
//     educationalBackground: Array<{
//       highestDegree: string;
//       subjectName: string;
//       marks: string;
//       institutionAttended: string;
//       degreeStartDate: string;
//       degreeEndDate: string;
//     }>;
//     workExperience: Array<{
//       jobTitle: string;
//       organizationName: string;
//       employmentType: string;
//       from: string;
//       to: string;
//     }>;
//   }>;
//   basics: Array<{
//     _id: string;
//     user: string;
//     DOB?: string;
//     country?: string;
//     familyName: string;
//     givenName: string;
//     gender: string;
//     nationality: string;
//     countryOfResidence: string;
//     maritalStatus: string;
//     religion: string;
//     currentAddress: string;
//     permanentAddress: string;
//     city: string;
//     zipCode: string;
//     email: string;
//     countryCode: string;
//     phoneNo: string;
//     currentcurrentAddress: string;
//     currentpermanentAddress: string;
//     currentCity: string;
//     currentZipCode: string;
//     currentEmail: string;
//     currentCountryCode: string;
//     currentPhoneNo: string;
//     hasPassport: boolean;
//     passportNumber: string;
//     passportExpiryDate: string;
//     oldPassportNumber: string;
//     oldPassportExpiryDate: string;
//     hasStudiedAbroad: boolean;
//     visitedCountry: string;
//     studyDuration: string;
//     institution: string;
//     visaType: string;
//     visaExpiryDate: string;
//     durationOfStudyAbroad: string;
//     sponsorName: string;
//     sponsorRelationship: string;
//     sponsorsNationality: string;
//     sponsorsOccupation: string;
//     sponsorsEmail: string;
//     sponsorsCountryCode: string;
//     sponsorsPhoneNo: string;
//     familyMembers: Array<{
//       name: string;
//       relationship: string;
//       nationality: string;
//       occupation: string;
//       email: string;
//       countryCode: string;
//       phoneNo: string;
//     }>;
//   }>;
//   documents: Array<{
//     _id: string;
//     user: string;
//     documents: Array<{
//       name: string;
//       files: Array<{
//         name: string;
//         url: string;
//         public_id?: string;
//       }>;
//       date: string;
//       isChecked: boolean;
//     }>;
//   }>;
// }

// const APPLICATION_STEPS = [
//   { id: 1, label: "Complete Application", status: "complete" },
//   { id: 2, label: "Applied", status: "applied" },
//   { id: 3, label: "Offer Letter Received", status: "offer" },
//   { id: 4, label: "Confirm Enrollment", status: "enrollment" },
//   { id: 5, label: "Visa Granted", status: "visa" },
//   { id: 6, label: "Accommodation Booked", status: "accommodation" },
//   { id: 7, label: "Airport Pickup Booked", status: "pickup" },
// ];
// export default function Page({ params }: { params: Promise<{ id: string }> }) {
//   const [data, setData] = useState<UserData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [studentId, setStudentId] = useState<string | null>(null);
//   const [imageLoadingStates, setImageLoadingStates] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [previewFile, setPreviewFile] = useState<{
//     url: string;
//     name: string;
//     type: string;
//   } | null>(null);
//   // Application status management
//   const [currentStatus, setCurrentStatus] = useState<number>(1);
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
//   const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
//   const [animatedStatus, setAnimatedStatus] = useState(1);
//   // Smooth animation effect when status changes
//   useEffect(() => {
//     if (currentStatus !== animatedStatus) {
//       const timer = setTimeout(() => {
//         if (currentStatus > animatedStatus) {
//           setAnimatedStatus((prev) =>
//             Math.min(prev + 1, APPLICATION_STEPS.length)
//           );
//         } else if (currentStatus < animatedStatus) {
//           setAnimatedStatus((prev) => Math.max(prev - 1, 1));
//         }
//       }, 300); // Single timing for smooth animation

//       return () => clearTimeout(timer);
//     }
//   }, [currentStatus, animatedStatus]);

//   // ALL useEffect hooks must be called before any conditional returns
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_API}adminDashboard/studentData`
//         );

//         if (!res.ok) {
//           throw new Error(`Failed to fetch student data: ${res.status}`);
//         }

//         const jsonData = (await res.json()) as UserData;
//         setData(jsonData);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "An unknown error occurred"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     params.then((resolvedParams) => setStudentId(resolvedParams.id));
//   }, [params]);

//   // Move the status fetch useEffect here as well
//   useEffect(() => {
//     console.log("Fetching status data for studentId:", studentId);
//     const fetchStatusData = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/getStatusUpdate/${params.id}`
//         );

//         if (!res.ok) {
//           throw new Error(`Failed to fetch status data: ${res.status}`);
//         }

//         const jsonData = await res.json();
//         console.log(jsonData, "res from status update api");
//         setCurrentStatus(jsonData.data.applicationStatus || 1);
//       } catch (err) {
//         console.error("Failed to fetch status:", err);
//         // Don't set error state here as it's not critical
//       }
//     };
//     fetchStatusData();
//   }, []);

//   // Function to get file type from URL or file name
//   const getFileType = (url: string, fileName: string) => {
//     const extension =
//       fileName.split(".").pop()?.toLowerCase() ||
//       url.split(".").pop()?.toLowerCase();

//     if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
//       return "image";
//     } else if (["pdf"].includes(extension || "")) {
//       return "pdf";
//     } else if (["doc", "docx"].includes(extension || "")) {
//       return "document";
//     }
//     return "unknown";
//   };

//   // Function to handle image loading
//   const handleImageLoad = (index: number) => {
//     setImageLoadingStates((prev) => ({
//       ...prev,
//       [index]: false,
//     }));
//   };

//   // Function to handle image loading start
//   const handleImageLoadStart = (index: number) => {
//     setImageLoadingStates((prev) => ({
//       ...prev,
//       [index]: true,
//     }));
//   };

//   // Function to download file
//   const handleDownload = async (url: string, fileName: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error("Download failed:", error);
//       window.open(url, "_blank");
//     }
//   };

//   // Function to preview file
//   const handlePreview = (url: string, fileName: string) => {
//     const fileType = getFileType(url, fileName);
//     setPreviewFile({ url, name: fileName, type: fileType });
//   };

//   // Close preview
//   const closePreview = () => {
//     setPreviewFile(null);
//   };

//   const handleStatusUpdate = async () => {
//     if (!studentId) return;
//     const token = getAuthToken();
//     setIsUpdatingStatus(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API}studentDashboard/completeApplication/createStatusUpdate`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             userId: studentId,
//             applicationStatus: currentStatus,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to update status: ${response.status}`);
//       }

//       // Update local data
//       if (data) {
//         const updatedData = { ...data };
//         const applicationIndex = updatedData.applications.findIndex(
//           (app) => app.user === studentId
//         );
//         if (applicationIndex !== -1) {
//           updatedData.applications[applicationIndex].applicationStatus =
//             currentStatus;
//           setData(updatedData);
//         }
//       }

//       setStatusUpdateSuccess(true);
//       setTimeout(() => setStatusUpdateSuccess(false), 3000);
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       alert("Failed to update application status. Please try again.");
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   };

//   // Add this useEffect for smooth animation (add this to your component)
//   // useEffect(() => {
//   //   if (currentStatus > animatedStatus) {
//   //     const timer = setTimeout(() => {
//   //       setAnimatedStatus((prev) => prev + 1);
//   //     }, 300); // 300ms delay between each step animation

//   //     return () => clearTimeout(timer);
//   //   } else if (currentStatus < animatedStatus) {
//   //     // Handle backwards animation
//   //     setAnimatedStatus(currentStatus);
//   //   }
//   // }, [currentStatus, animatedStatus]);

//   // NOW the conditional returns can happen after all hooks are called
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-lg font-medium text-gray-600">
//             Loading student profile...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             Error Loading Profile
//           </h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const user = data?.Users.find((u) => u._id === studentId);
//   const userApplication = data?.applications.find(
//     (app) => app.user === studentId
//   );
//   const userBasics = data?.basics.find((basic) => basic.user === studentId);

//   // Get documents for the specific user
//   const userDocuments = data?.documents.find((doc) => doc.user === studentId);

//   // Extract file data for the specific user
//   const fileData =
//     userDocuments?.documents.flatMap((document) =>
//       document.files.map((file) => ({
//         url: file.url,
//         name: file.name,
//         documentName: document.name,
//         date: document.date,
//         isChecked: document.isChecked,
//       }))
//     ) || [];

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-red-500" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             Student Not Found
//           </h2>
//           <p className="text-gray-600">No user found with ID: {studentId}</p>
//         </div>
//       </div>
//     );
//   }

//   const familyMembers = userBasics?.familyMembers;
//   const workExperience = userApplication?.workExperience;
//   const educationalBackground = userApplication?.educationalBackground;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center space-x-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
//               <User className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {user.firstName} {user.lastName}
//               </h1>
//               <p className="text-gray-600 flex items-center gap-2 mt-1">
//                 <Mail className="w-4 h-4" />
//                 {user.email}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Application Status Tracker */}
//         <div className="mb-6">
//           <div className="bg-white rounded-lg shadow-sm border p-4">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Application Status
//               </h2>
//               {statusUpdateSuccess && (
//                 <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse">
//                   <CheckCircle className="w-4 h-4" />
//                   Updated!
//                 </div>
//               )}
//             </div>

//             {/* Course Info - Compact */}
//             {userApplication && (
//               <div className="bg-red-50 rounded-lg p-4 mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <GraduationCap className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 mb-1">
//                       {userApplication.courseName}
//                     </h3>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <span>{userApplication.countryOfStudy}</span>
//                       <span>{userApplication.courseDuration}</span>
//                       <span>{userApplication.courseFee}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Progress Steps - Sequential Transition */}
//             <div className="mb-4">
//               <div className="flex items-center justify-between relative">
//                 {/* Background Progress Line */}
//                 <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 rounded-full"></div>

//                 {/* Animated Progress Line */}
//                 <div
//                   className="absolute top-4 left-4 h-0.5 bg-red-500 rounded-full transition-all duration-500 ease-out"
//                   style={{
//                     width:
//                       animatedStatus <= 1
//                         ? "0%"
//                         : `${
//                             (Math.min(
//                               animatedStatus - 1,
//                               APPLICATION_STEPS.length - 1
//                             ) /
//                               (APPLICATION_STEPS.length - 1)) *
//                             100
//                           }%`,
//                   }}
//                 />

//                 {APPLICATION_STEPS.map((step, index) => {
//                   const stepNumber = index + 1;
//                   const status =
//                     stepNumber <= animatedStatus
//                       ? "completed"
//                       : stepNumber === animatedStatus + 1 &&
//                         stepNumber <= currentStatus
//                       ? "current"
//                       : "pending";

//                   return (
//                     <div
//                       key={step.id}
//                       className="flex flex-col items-center relative"
//                     >
//                       {/* Step Circle with Sequential Transitions */}
//                       <div
//                         className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-all duration-300 ease-out transform ${
//                           status === "completed"
//                             ? "bg-red-500 text-white scale-110 shadow-lg"
//                             : status === "current"
//                             ? "bg-red-500 text-white scale-110 shadow-lg animate-pulse ring-4 ring-red-200"
//                             : "bg-gray-400 text-white scale-100"
//                         }`}
//                       >
//                         {status === "completed" ? (
//                           <svg
//                             className="w-4 h-4"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         ) : (
//                           <span className="transition-all duration-300">
//                             {stepNumber}
//                           </span>
//                         )}

//                         {/* Pulse effect for current step */}
//                         {status === "current" && (
//                           <div className="absolute inset-0 w-8 h-8 rounded-full bg-red-500 opacity-30 animate-ping" />
//                         )}
//                       </div>

//                       {/* Step Label with Sequential Fade */}
//                       <p
//                         className={`hidden md:block text-xs text-center mt-1 max-w-16 leading-tight transition-all duration-300 ${
//                           status === "completed"
//                             ? "text-red-600 font-medium"
//                             : status === "current"
//                             ? "text-red-600 font-medium"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {step.label}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Status Display */}
//             <div className="mb-4 flex items-center gap-2">
//               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//               <p className="text-sm text-gray-600">
//                 Step {animatedStatus} of {APPLICATION_STEPS.length} completed
//               </p>
//             </div>

//             {/* Admin Controls - Compact */}
//             <div className="bg-orange-50 rounded-lg p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 {/* <AlertCircle className="w-4 h-4 text-orange-500" /> */}
//                 <h5 className="font-semibold text-gray-900">Update Status </h5>
//               </div>

//               <div className="flex items-end gap-3">
//                 <div className="flex-1">
//                   <label className="block text-sm text-gray-600 mb-1">
//                     Current: Step {currentStatus}
//                   </label>
//                   <select
//                     value={currentStatus}
//                     onChange={(e) => setCurrentStatus(Number(e.target.value))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-200 text-sm transition-all duration-200"
//                   >
//                     {APPLICATION_STEPS.map((step) => (
//                       <option key={step.id} value={step.id}>
//                         Step {step.id}: {step.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button
//                   onClick={handleStatusUpdate}
//                   disabled={isUpdatingStatus}
//                   className="px-4 py-[0.75rem] bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
//                 >
//                   {isUpdatingStatus ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4" />
//                       Update
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Personal Info */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Quick Info Card */}
//             <div className="bg-white rounded-xl shadow-sm border p-6">
//               {" "}
//               <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5 text-red-500" />
//                 Quick Info{" "}
//               </h2>{" "}
//               <div className="space-y-3">
//                 {" "}
//                 <div className="flex items-center gap-3">
//                   <Phone className="w-4 h-4 text-gray-400" />{" "}
//                   <span className="text-sm text-gray-600">
//                     {/* {user.countryCode} {user.contactNo} */}
//                     {user.phone}{" "}
//                   </span>{" "}
//                 </div>{" "}
//               </div>
//             </div>
//             {/* Documents Summary */}
//             {fileData.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <FileText className="w-5 h-5 text-green-500" />
//                   Documents Summary
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-red-600">
//                       {fileData.length}
//                     </div>
//                     <div className="text-sm text-gray-600">Total Files</div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Detailed Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Details */}
//             {userBasics && (
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <User className="w-5 h-5 text-red-500" />
//                   Personal Details
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Family Name
//                       </label>
//                       <p className="text-gray-900">{userBasics.familyName}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Given Name
//                       </label>
//                       <p className="text-gray-900">{userBasics.givenName}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Gender
//                       </label>
//                       <p className="text-gray-900">{userBasics.gender}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Marital Status
//                       </label>
//                       <p className="text-gray-900">
//                         {userBasics.maritalStatus}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Religion
//                       </label>
//                       <p className="text-gray-900">{userBasics.religion}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Country of Residence
//                       </label>
//                       <p className="text-gray-900">
//                         {userBasics.countryOfResidence}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Current Address
//                       </label>
//                       <p className="text-gray-900">{userBasics.currentAddress}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         City
//                       </label>
//                       <p className="text-gray-900">{userBasics.city}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Zip Code
//                       </label>
//                       <p className="text-gray-900">{userBasics.zipCode}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">
//                         Phone
//                       </label>
//                       <p className="text-gray-900">
//                         {userBasics.countryCode} {userBasics.phoneNo}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Passport Information */}
//                 <div className="mt-6 pt-6 border-t">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Passport Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">
//                           Has Passport
//                         </label>
//                         <p className="text-gray-900 flex items-center gap-2">
//                           {userBasics.hasPassport ? (
//                             <>
//                               <CheckCircle className="w-4 h-4 text-green-500" />
//                               Yes
//                             </>
//                           ) : (
//                             <>
//                               <X className="w-4 h-4 text-red-500" />
//                               No
//                             </>
//                           )}
//                         </p>
//                       </div>
//                       {userBasics.passportNumber && (
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">
//                             Passport Number
//                           </label>
//                           <p className="text-gray-900">
//                             {userBasics.passportNumber}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="space-y-4">
//                       {userBasics.passportExpiryDate && (
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">
//                             Passport Expiry
//                           </label>
//                           <p className="text-gray-900">
//                             {userBasics.passportExpiryDate}
//                           </p>
//                         </div>
//                       )}
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">
//                           Studied Abroad
//                         </label>
//                         <p className="text-gray-900 flex items-center gap-2">
//                           {userBasics.hasStudiedAbroad ? (
//                             <>
//                               <CheckCircle className="w-4 h-4 text-green-500" />
//                               Yes
//                             </>
//                           ) : (
//                             <>
//                               <X className="w-4 h-4 text-red-500" />
//                               No
//                             </>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Family Members */}
//                 {familyMembers && familyMembers.length > 0 && (
//                   <div className="mt-6 pt-6 border-t">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <Users className="w-5 h-5 text-red-500" />
//                       Family Members
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {familyMembers.map((member, index) => (
//                         <div key={index} className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium text-gray-900">
//                             {member.name}
//                           </h4>
//                           <p className="text-sm text-gray-600">
//                             {member.relationship}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {member.occupation}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {member.email}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Application Details */}
//             {userApplication && (
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <GraduationCap className="w-5 h-5 text-green-500" />
//                   Application Details
//                 </h2>

//                 {/* Language Proficiency */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Language Proficiency
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="bg-red-50 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold text-red-600">
//                         {userApplication.overAllScore}
//                       </div>
//                       <div className="text-sm text-gray-600">Overall</div>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold text-green-600">
//                         {userApplication.listeningScore}
//                       </div>
//                       <div className="text-sm text-gray-600">Listening</div>
//                     </div>
//                     <div className="bg-red-50 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold text-red-600">
//                         {userApplication.writingScore}
//                       </div>
//                       <div className="text-sm text-gray-600">Writing</div>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold text-orange-600">
//                         {userApplication.speakingScore}
//                       </div>
//                       <div className="text-sm text-gray-600">Speaking</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Educational Background */}
//                 {educationalBackground && educationalBackground.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       Educational Background
//                     </h3>
//                     <div className="space-y-4">
//                       {educationalBackground.map((edu, index) => (
//                         <div key={index} className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-medium text-gray-900">
//                               {edu.highestDegree}
//                             </h4>
//                             <span className="text-sm text-gray-600">
//                               {edu.marks}
//                             </span>
//                           </div>
//                           <p className="text-gray-700">{edu.subjectName}</p>
//                           <p className="text-sm text-gray-600">
//                             {edu.institutionAttended}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(edu.degreeStartDate).toLocaleDateString()}{" "}
//                             - {new Date(edu.degreeEndDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Work Experience */}
//                 {workExperience && workExperience.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <Briefcase className="w-5 h-5 text-red-500" />
//                       Work Experience
//                     </h3>
//                     <div className="space-y-4">
//                       {workExperience.map((work, index) => (
//                         <div key={index} className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-medium text-gray-900">
//                               {work.jobTitle}
//                             </h4>
//                             <span className="text-sm text-gray-600 capitalize">
//                               {work.employmentType}
//                             </span>
//                           </div>
//                           <p className="text-gray-700">
//                             {work.organizationName}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(work.from).toLocaleDateString()} -{" "}
//                             {new Date(work.to).toLocaleDateString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Documents */}
//             {fileData.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm border p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <FileText className="w-5 h-5 text-green-500" />
//                   Documents ({fileData.length} files)
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {fileData.map((file, index) => {
//                     const fileType = getFileType(file.url, file.name);
//                     const isLoading = imageLoadingStates[index];

//                     return (
//                       <div
//                         key={index}
//                         className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
//                       >
//                         <div className="mb-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <h4 className="font-medium text-gray-900 text-sm truncate">
//                               {file.documentName}
//                             </h4>
//                             {file.isChecked ? (
//                               <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                             ) : (
//                               <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-600 truncate">
//                             {file.name}
//                           </p>
//                           <p className="text-xs text-gray-500">{file.date}</p>
//                         </div>

//                         <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 relative mb-4">
//                           {fileType === "image" ? (
//                             <>
//                               {isLoading && (
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                   <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
//                                 </div>
//                               )}
//                               <Image
//                                 src={file.url}
//                                 alt={file.name}
//                                 width={300}
//                                 height={300}
//                                 className="w-full h-full object-cover"
//                                 onLoadStart={() => handleImageLoadStart(index)}
//                                 onLoad={() => handleImageLoad(index)}
//                                 onError={() => handleImageLoad(index)}
//                                 loading="lazy"
//                               />
//                             </>
//                           ) : (
//                             <div className="w-full h-full flex flex-col items-center justify-center">
//                               {fileType === "pdf" ? (
//                                 <FileText className="w-12 h-12 text-red-500 mb-2" />
//                               ) : (
//                                 <File className="w-12 h-12 text-red-500 mb-2" />
//                               )}
//                               <p className="text-xs text-gray-600 text-center px-2 font-medium">
//                                 {fileType === "pdf"
//                                   ? "PDF Document"
//                                   : "Document"}
//                               </p>
//                             </div>
//                           )}
//                         </div>

//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handlePreview(file.url, file.name)}
//                             className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
//                           >
//                             <Eye className="w-4 h-4" />
//                             Preview
//                           </button>
//                           <button
//                             onClick={() => handleDownload(file.url, file.name)}
//                             className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
//                           >
//                             <Download className="w-4 h-4" />
//                             Download
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {previewFile && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-5xl max-h-full w-full overflow-auto shadow-2xl">
//             <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {previewFile.name}
//               </h3>
//               <button
//                 onClick={closePreview}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 <X className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>
//             <div className="p-6">
//               {previewFile.type === "image" ? (
//                 <div className="flex justify-center">
//                   <Image
//                     src={previewFile.url}
//                     alt={previewFile.name}
//                     width={800}
//                     height={600}
//                     className="max-w-full h-auto object-contain rounded-lg"
//                   />
//                 </div>
//               ) : previewFile.type === "pdf" ? (
//                 <a
//                   href={previewFile.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Open in new tab
//                 </a>
//               ) : (
//                 <div className="text-center py-12">
//                   <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     Preview not available
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     This file type cannot be previewed in the browser.
//                   </p>
//                   <button
//                     onClick={() =>
//                       handleDownload(previewFile.url, previewFile.name)
//                     }
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                   >
//                     <Download className="w-4 h-4" />
//                     Download to view
//                   </button>
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
//               <button
//                 onClick={() =>
//                   handleDownload(previewFile.url, previewFile.name)
//                 }
//                 className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
//               >
//                 <Download className="w-4 h-4" />
//                 Download File
//               </button>
//               <button
//                 onClick={closePreview}
//                 className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
import { StatusTracker } from "../components/StatusTracker";
import { PaymentTracker } from "../components/PaymentTracker";

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
    courseName: string;
    courseFee: string;
    courseDuration: string;
    applicationDeadline: string;
    applicationStatus: number;
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
    currentAddress: string;
    permanentAddress: string;
    city: string;
    zipCode: string;
    email: string;
    countryCode: string;
    phoneNo: string;
    currentcurrentAddress: string;
    currentpermanentAddress: string;
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
  payments: Array<{
    _id: string;
    user: string;
    transactionName: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: "pending" | "approved" | "rejected" | "completed";
    createdAt: string;
    updatedAt: string;
    description?: string;
    paymentMethod?: string;
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

  //get student data
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

  // const handlePaymentUpdate = (
  //   paymentId: string,
  //   updatedPayment: Partial<Payment>
  // ) => {
  //   setData((prevData) => {
  //     if (!prevData) return prevData;

  //     const updatedPayments = prevData.payments.map((payment) =>
  //       payment._id === paymentId ? { ...payment, ...updatedPayment } : payment
  //     );

  //     return {
  //       ...prevData,
  //       payments: updatedPayments,
  //     };
  //   });
  // };

  const handlePaymentDelete = (paymentId: string) => {
    setData((prevData) => {
      if (!prevData) return prevData;

      const updatedPayments = prevData.payments.filter(
        (payment) => payment._id !== paymentId
      );

      return {
        ...prevData,
        payments: updatedPayments,
      };
    });
  };

  // Close preview
  const closePreview = () => {
    setPreviewFile(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
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
        {/* Application Status Tracker */}
        <StatusTracker
          studentId={studentId ?? ""}
          params={{ id: studentId ?? "" }}
        />
        <PaymentTracker
          studentId={studentId ?? ""}
          params={{ id: studentId ?? "" }}
          onPaymentDelete={handlePaymentDelete}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {" "}
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                Quick Info{" "}
              </h2>{" "}
              <div className="space-y-3">
                {" "}
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />{" "}
                  <span className="text-sm text-gray-600">{user.phone} </span>{" "}
                </div>{" "}
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
                    <div className="text-2xl font-bold text-red-600">
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
                  <User className="w-5 h-5 text-red-500" />
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
                        Current Address
                      </label>
                      <p className="text-gray-900">
                        {userBasics.currentAddress}
                      </p>
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
                      <Users className="w-5 h-5 text-red-500" />
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
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
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
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
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
                      <Briefcase className="w-5 h-5 text-red-500" />
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
                              <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
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
                                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
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
                                <File className="w-12 h-12 text-red-500 mb-2" />
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
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
