"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, ClipboardList, CreditCard, Home, Plane, ArrowLeftToLine, LocateFixed } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
// interface SidebarItemProps {
//   icon: ReactNode;
//   text: string;
//   active: boolean;
//   href: string;
// }

import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  href: string;
}

function SidebarItem({ icon, text, active, href }: SidebarItemProps) {
  return (
    <Link href={href} className="w-full">
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer w-full text-sm ${active ? "bg-red-200 text-red-700" : "hover:bg-gray-200"
          }`}
      >
        {icon}
        <span className="ml-2">{text}</span>
      </div>
    </Link>
  );
}



export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/overview", icon: <LayoutDashboard size={16} />, label: "Dashboard Overview" },
    { href: "#", icon: <ClipboardList size={16} />, label: "Complete your application" },
    { href: "#", icon: <LocateFixed size={16} />, label: "Application Status Tracker" },
    { href: "/dashboard/Payment", icon: <CreditCard size={16} />, label: "Payment Tracker & History" },
    { href: "/dashboard/AccomodationBooking", icon: <Home size={16} />, label: "Accommodation Booking" },
    { href: "#", icon: <Plane size={16} />, label: "Airport Pickup" },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0  z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-16  z-40 h-[110vh] lg:h-[85vh] bg-[#FCE7D2] transition-all duration-300
          lg:translate-x-0 rounded-lg m-0 lg:m-4 lg:w-[260px] ${isOpen ? "w-[260px]" : "w-0"} ${!isOpen && "!overflow-hidden"}`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-lg lg:hidden">
          <X size={20} />
        </button>

        {/* Sidebar Container */}
        <div className="bg-[#FCE8DA] w-64 h-full p-4 flex flex-col  rounded-lg">
          {/* Profile Section */}
          <Card className="p-2 flex flex-col items-center text-center bg-white rounded-lg">
            <Image
              src="/DashboardPage/group.svg"
              alt="Profile"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mb-2"
            />
            <h2 className="text-sm font-semibold">Asma Kazmi</h2>
            <p className="text-xs text-gray-500">asmaikazmi@gmail.com</p>
            <Button className="mt-1 bg-red-700 hover:bg-red-600 text-white w-full">My Profile</Button>
          </Card>

          {/* Navigation */}
          <nav className="mt-2 w-full flex flex-col gap-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>

          {/* Logout Button */}
          <div className="w-full pt-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center">
              < ArrowLeftToLine size={16} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
