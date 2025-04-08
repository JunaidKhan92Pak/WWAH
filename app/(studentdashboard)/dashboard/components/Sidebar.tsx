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
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CompleteApplicationModal from "../completeapplication/components/CompleteApplicationModal";
import { useUserStore } from "@/store/useUserData";
import { getAuthToken } from "@/utils/authHelper";
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
      fetchUserProfile(token);
    }
  }, []);
    const router = useRouter(); // Initialize Next.js router

    const handleLogout = async () => {
      await logout(); // Ensure logout is completed
      router.push("/"); // Redirect to home page
    };
  useEffect(() => {
    // Auto open modal when navigating to "Complete your application"
    if (pathname === "/dashboard/completeapplication") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [pathname]);
  return (
    <div className="flex flex-col ">
      {/* Profile Section */}
      <Card className="p-2 m-2 flex flex-col items-center text-center bg-white rounded-lg">
        <Image
          src="/DashboardPage/group.svg"
          alt="Profile"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full mb-2"
        />
        <h2 className="text-sm font-semibold">
          {user?.user?.firstName} {user?.user?.lastName}
        </h2>
        <p className="text-xs text-gray-500">{user?.user?.email}</p>
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
          {/* <Button className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center">
            <ArrowLeftToLine size={16} className="mr-2" /> Logout
          </Button> */}
          <Button
            className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <ArrowLeftToLine size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Complete Application Modal */}
      {isModalOpen && (
        <CompleteApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCompleteApplication={() => {}}
        />
      )}
    </div>
  );
}
