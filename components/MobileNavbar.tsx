"use client";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../app/(auth)/auth/authProvider";
import { getAuthToken } from "@/utils/authHelper";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNavbar = () => {
  // const [isMounted, setIsMounted] = useState(false);
  // const [isDropdownOpen, setDropdownOpen] = useState(false);

  // const [isOpen, setIsOpen] = useState(false);

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const auth = useAuth();

  // useEffect(() => {
  //   const token = getAuthToken();
  //   if (token) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);
  // const toggleDropdown = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // };
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);
  // if (!isMounted) {
  //   return null;
  // }
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
        className="p-4 w-[80%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-gray-100"
      >
        <div className="mt-8 border border-gray-200 mx-auto py-3 px-4 shadow-lg rounded-xl bg-white text-black">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 ">
            <div className="w-[35%] md:w-[40%] h-1 border-3  flex justify-center items-center">
              <Image
                src="/logo.png"
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
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <Button className="text-sm w-20 sm:w-24  h-8 sm:h-10 bg-red-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <ul className="flex flex-col text-sm space-y-4">
              {[
                { href: "/countries", label: "Study Destination" },
                { href: "/Universities", label: "Universities" },
                { href: "/coursearchive", label: "Courses" },
                { href: "/scholarships", label: "Scholarships" },
              ].map((item) => (
                <li key={item.href} className="border-b pb-2">
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    <span className="block w-full hover:text-red-600">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
