"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Plane,
  ClipboardList,
  CreditCard,
  Home,
  LocateFixed,
  ArrowLeftToLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CompleteApplicationModal from "../completeapplication/components/CompleteApplicationModal";
import { getAuthToken } from "@/utils/authHelper";
import { useUserStore } from "@/store/useUserData";

const sidebarItems = [
  {
    href: "/dashboard/overview",
    icon: LayoutDashboard,
    title: "Dashboard Overview",
  },
  {
    href: "/dashboard/completeapplication",
    icon: ClipboardList,
    title: "Complete your application",
  },
  {
    href: "/dashboard/applicationstatustracker",
    icon: LocateFixed,
    title: "Application Status Tracker",
  },
  {
    href: "/dashboard/Payment",
    icon: CreditCard,
    title: "Payment Tracker & History",
  },
  {
    href: "/dashboard/AccomodationBooking",
    icon: Home,
    title: "Accommodation Booking",
  },
  {
    href: "/dashboard/airportPickup",
    icon: Plane,
    title: "Airport Pickup",
  },
];
export function Sidebar() {
  const { user, fetchUserProfile, logout } = useUserStore();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const handlelogout = () => {
    logout();
    // Use window.location.href for a full page reload instead of client-side navigation
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col ">
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
          <Link href="/dashboard/myprofile">
            <Button className="mt-1 bg-red-700 hover:bg-red-600 text-white w-full">
              My Profile
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
        {/* Logout Button */}
        <div className="w-full pt-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center"
            onClick={handlelogout}
          >
            <ArrowLeftToLine size={16} className="mr-2" />
            Logout
          </Button>
        </div>
        <Link href="/chatmodel" className="w-full">
          <div>
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center">
              Chat with Zeus{" "}
              <Image
                src="/littlezeus.png"
                alt="chat"
                width={24}
                height={24}
                className="ml-2"
              />
            </Button>
          </div>
        </Link>
      </div>

      {/* Complete Application Modal */}
      {isModalOpen && (
        <CompleteApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCompleteApplication={() => { }}
        />
      )}
    </div>
  );
}