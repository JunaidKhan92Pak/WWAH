"use client";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../app/(auth)/auth/authProvider";
import { getAuthToken } from "@/utils/authHelper";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Home,
  Globe,
  School,
  BookOpen,
  Gift,
  Languages,
  Book,
  // Info,
  // PhoneCall,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoIosArrowForward } from "react-icons/io";

const MobileNavbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // New state for Sheet open/close
  const auth = useAuth();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-4 w-[80%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-gray-100 overflow-y-auto hide-scrollbar h-full"
      >
        <div className="mt-8 border border-gray-200 mx-auto py-3 px-4 shadow-lg rounded-xl bg-white text-black">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 ">
            <div className="w-[35%] md:w-[40%] h-1 border-3  flex justify-center items-center">
              <Image
                src="/logo.svg"
                alt="logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            {isAuthenticated ? (
              <div className="relative flex items-center space-x-3">
                <button
                  type="button"
                  className="text-sm bg-gray-800 rounded-full border-2 border-gray-200"
                  onClick={toggleDropdown}
                >
                  <FaCircleUser className="text-white  w-8 h-8 text-xl " />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 z-20 w-48 bg-white shadow-lg rounded-lg divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900">
                        Bonnie Green
                      </span>
                      <span className="block text-sm text-gray-500 truncate">
                        name@flowbite.com
                      </span>
                    </div>
                    <ul className="py-2">
                      {[
                        { href: "/completeprofile", label: "Dashboard" },
                        { href: "/chatmodel", label: "Chat with ZEUS" },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="block px-4 py-2 text-sm hover:bg-gray-100">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => auth.logout()}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                target="blank"
                href="/signin"
                onClick={() => setIsOpen(false)}
              >
                <Button className="text-sm w-20 sm:w-24  h-8 sm:h-10 bg-red-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6  ">
            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Account Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Account</h3>
                <div className="space-y-2">
                  {[
                    { href: "/", label: "Home", icon: Home },
                    {
                      href: "/countries",
                      label: "Study Destination",
                      icon: Globe,
                    },
                    {
                      href: "/Universities",
                      label: "Universities",
                      icon: School,
                    },
                    {
                      href: "/coursearchive",
                      label: "Courses",
                      icon: BookOpen,
                    },
                    {
                      href: "/scholarships",
                      label: "Scholarships",
                      icon: Gift,
                    },
                    {
                      href: "/form",
                      label: "English Proficiency Prep",
                      icon: Languages,
                    },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      target="blank"
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2  px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}

                  {/* Counseling session box with arrow */}
                  <Link
                    target="blank"
                    href="/schedulesession"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm bg-gray-100 hover:bg-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Book online counselling session
                    </span>
                    <IoIosArrowForward />
                  </Link>
                </div>
              </div>

              {/* Support Section */}
              {/* <div>
                <h3 className="text-sm font-semibold mb-2">Support</h3>
                <div className="space-y-2">
                  {[
                    { href: "/aboutUs", label: "About WWAH", icon: Info },
                    {
                      href: "/contactus",
                      label: "Contact Us",
                      icon: PhoneCall,
                    },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link target="blank"
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2  px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => auth.logout()}
              className="mt-4 w-full bg-red-700 hover:bg-red-700 text-white font-semibold py-2 rounded"
            >
              Log out
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
