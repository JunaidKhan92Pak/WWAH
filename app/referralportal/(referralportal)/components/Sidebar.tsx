// "use client";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { LayoutDashboard, ArrowLeftToLine } from "lucide-react";
// import { TbCurrentLocation } from "react-icons/tb";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";
// import { getAuthToken } from "@/utils/authHelper";
// import { IoPodiumOutline } from "react-icons/io5";
// import { TfiHeadphoneAlt } from "react-icons/tfi";
// import { useRefUserStore } from "@/store/useRefDataStore";
// const sidebarItems = [
//   {
//     href: "/referralportal/overview",
//     icon: LayoutDashboard,
//     title: "Dashboard Overview",
//   },
//   {
//     href: "/referralportal/commissiontracker",
//     icon: TbCurrentLocation,
//     title: "Commission Tracker",
//   },
//   {
//     href: "/referralportal/referralcontest",
//     icon: IoPodiumOutline,
//     title: "Referral Contest",
//   },
//   {
//     href: "/referralportal/contactandsupport",
//     icon: TfiHeadphoneAlt,
//     title: "Contact & Support",
//   },
// ];

// export function Sidebar() {
//   const { user, fetchUserProfile, logout } = useRefUserStore();
//   const pathname = usePathname();
//   useEffect(() => {
//     const token = getAuthToken();
//     if (token) {
//       fetchUserProfile(token);
//     }
//   }, []);

//   const handlelogout = () => {
//     logout();
//     window.location.href = "/referralportal/signin";
//   };

//   return (
//     <div className="flex flex-col h-[93%] ">
//       {/* Profile Section */}
//       <Card className="p-2 m-2 flex flex-col items-center text-center bg-white rounded-lg">
//         <Image
//           src={user?.profilePicture || "/icons/userred.svg"}
//           alt="user"
//           width={54}
//           height={54}
//           className="w-12 h-12 rounded-full mb-2"
//         />
//         <h2 className="text-sm font-semibold">
//           {user?.firstName} {user?.lastName}
//         </h2>
//         <p className="text-xs text-gray-500">{user?.email}</p>
//         <div className="w-full">
//           <Link href="/referralportal/myprofile">
//             <Button className="mt-1 bg-red-700 hover:bg-red-600 text-white w-full">
//               My Profile
//             </Button>
//           </Link>
//         </div>
//       </Card>
//       <div className="flex flex-1 flex-col gap-2 p-4 ">
//         {sidebarItems.map((item, index) => (
//           <Link
//             key={index}
//             href={item.href}
//             className={cn(
//               "flex items-center p-2 rounded-lg cursor-pointer gap-2 text-sm transition-colors",
//               pathname === item.href
//                 ? "bg-red-200 text-red-700"
//                 : "hover:bg-gray-200 text-gray-600"
//             )}
//           >
//             <item.icon className="h-5 w-5" />
//             {item.title}
//           </Link>
//         ))}
//       </div>
//       {/* Logout Button */}
//       <div className="w-5/6 pt-4 mx-auto">
//         <Button
//           className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center"
//           onClick={handlelogout}
//         >
//           <ArrowLeftToLine size={16} className="mr-2" />
//           Logout
//         </Button>
//       </div>
//     </div>
//   );
// }
"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ArrowLeftToLine } from "lucide-react";
import { TbCurrentLocation } from "react-icons/tb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getAuthToken } from "@/utils/authHelper";
import { IoPodiumOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { useRefUserStore } from "@/store/useRefDataStore";

const sidebarItems = [
  {
    href: "/referralportal/overview",
    icon: LayoutDashboard,
    title: "Dashboard Overview",
  },
  {
    href: "/referralportal/commissiontracker",
    icon: TbCurrentLocation,
    title: "Commission Tracker",
  },
  {
    href: "/referralportal/referralcontest",
    icon: IoPodiumOutline,
    title: "Referral Contest",
  },
  {
    href: "/referralportal/contactandsupport",
    icon: TfiHeadphoneAlt,
    title: "Contact & Support",
  },
];

export function Sidebar() {
  const { user, detailedInfo, fetchUserProfile, logout } = useRefUserStore();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const handlelogout = () => {
    logout();
    // Use window.location.href for a full page reload instead of client-side navigation
    window.location.href = "/referralportal/signin";
  };

  // Function to check if user profile is complete
  const isProfileComplete = () => {
    if (!user || !detailedInfo) return false;

    // Check essential user fields
    const userFieldsComplete =
      user.firstName &&
      user.lastName &&
      user.email &&
      user.phone &&
      user.city &&
      user.country;

    // Check if at least one section of detailedInfo has meaningful data
    const academicInfoComplete =
      detailedInfo.AcademicInformation &&
      (detailedInfo.AcademicInformation.currentDegree ||
        detailedInfo.AcademicInformation.program ||
        detailedInfo.AcademicInformation.uniName);

    const paymentInfoComplete =
      detailedInfo.paymentInformation &&
      (detailedInfo.paymentInformation.preferredPaymentMethod ||
        detailedInfo.paymentInformation.bankName ||
        detailedInfo.paymentInformation.accountNumberIban);

    const workExpComplete =
      detailedInfo.workExperience &&
      (detailedInfo.workExperience.hasWorkExperience ||
        detailedInfo.workExperience.hasBrandAmbassador ||
        detailedInfo.workExperience.jobDescription);

    // Profile is complete if user fields are complete AND at least one detailed info section has data
    return (
      userFieldsComplete &&
      (academicInfoComplete || paymentInfoComplete || workExpComplete)
    );
  };

  const profileComplete = isProfileComplete();

  return (
    <div className="flex flex-col h-[93%] ">
      {/* Profile Section */}
      <Card className="p-2 m-2 flex flex-col items-center text-center bg-white rounded-lg">
        <Image
          src={user?.profilePicture || "/icons/userred.svg"}
          alt="user"
          width={54}
          height={54}
          className="w-12 h-12 rounded-full mb-2"
        />
        <h2 className="text-sm font-semibold">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
        <div className="w-full">
          <Link
            href={
              profileComplete
                ? "/referralportal/myprofile"
                : "/referralportal/completeprofile"
            }
          >
            <Button
              className={cn(
                "mt-1 text-white w-full",
                profileComplete
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-red-50 text-[#C7161E] border border-[#C7161E] rounded-lg px-4 py-2 hover:bg-red-600 hover:text-white transition-colors duration-200"
              )}
            >
              {profileComplete ? "My Profile" : "Complete Profile"}
            </Button>
          </Link>
        </div>
      </Card>

      <div className="flex flex-1 flex-col gap-2 p-4 ">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center p-2 rounded-lg cursor-pointer gap-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-red-200 text-red-700"
                : "hover:bg-gray-200 text-gray-600"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="w-5/6 pt-4 mx-auto">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center"
          onClick={handlelogout}
        >
          <ArrowLeftToLine size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}