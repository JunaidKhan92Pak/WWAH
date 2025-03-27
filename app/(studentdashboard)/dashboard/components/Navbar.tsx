"use client";


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./sd-mobile-nav";
import Link from "next/link";
// import SdMobileNav from "@/app/(studentdashboard)/dashboard/components/sd-mobile-nav"

export function Navbar() {
  return (
    <nav className=" border-b h-16 flex items-center px-2 sm:px-6 justify-between bg-white">
      <div className="flex items-center gap-4">
        <MobileNav />
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/DashboardPage/wwahframe.svg"
              alt="Worldwide Admissions Hub Logo"
              width={250}
              height={32}
              priority
              className="hidden md:block"
            />
          </Link>
          <Link href="/">
            <Image
              src="/DashboardPage/wwah.svg"
              alt="Worldwide Admissions Hub Logo for larger screens"
              width={150}
              height={32}
              priority
              className="block md:hidden h-[80px] w-[80px]"
            />
          </Link>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button className="flex items-center bg-[#F4D0D2] text-[#C7161E] border border-[#C7161E] rounded-lg hover:bg-red-50">
          <Image
            src="/DashboardPage/usericon.svg"
            alt="User Icon"
            width={20}
            height={20}
            className="w-[24px] sm:w-[20px] h-[28px] sm:h-[20px]"
          />
          <span className="hidden lg:inline">Favourites</span>
        </Button>

        {/* <Button className="relative flex items-center bg-[#F1F1F1] text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Image
            src="/DashboardPage/bell.svg"
            alt="Notifications"
            width={20}
            height={20}
            className="w-[24px] sm:w-[20px] h-[28px] sm:h-[20px]"
          />
          <span className="hidden lg:inline">Notifications</span>
          <span className="px-2 py-0.5 text-xs bg-[#FCE7D2] rounded-sm hidden lg:inline">
            2
          </span>
        </Button> */}
      </div>
    </nav>
  );
}
