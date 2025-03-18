"use client";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "../app/(auth)/auth/authProvider";
import { getAuthToken } from "@/authHelper";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNavbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [user, setUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    // Check for authToken in cookies on page load
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
    <div>
      <Sheet>
        <SheetTrigger>
          <Button variant={"ghost"} size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-1">
          <div className="w-[90%] mt-8 border border-gray-00 mx-auto py-3 px-2 sm:px-5 shadow-md rounded-xl m-4 bg-white text-black">
            <div className="flex justify-around">
              {/* Logo */}
              <Image
                src="/logo.png"
                alt="logo"
                width={600}
                height={605}
                className="w-16"
              />

              <div className="flex gap-2 md:gap-5">
                {isAuthenticated ? (
                  <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full  "
                      id="user-menu-button"
                      aria-expanded={isDropdownOpen}
                      onClick={toggleDropdown}
                    >
                      <span className="sr-only">Open user menu</span>
                      <FaCircleUser className="bg-white text-xl" />
                    </button>

                    {isDropdownOpen && (
                      <div
                        id="user-dropdown"
                        className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <div className="px-4 py-3">
                          <span className="block text-sm text-gray-900 dark:text-white">
                            {"Bonnie Green"}
                          </span>
                          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                            {"name@flowbite.com"}
                          </span>
                        </div>
                        <ul className="py-2">
                          <li>
                            <Link
                              href="/completeprofile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/chatmodel"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Chat with ZEUS
                            </Link>
                          </li>
                          <li>
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
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
                  <>
                    <div>
                      <Link href="/signin">
                        <Button
                          className="text-[10px] w-16 h-8 px-4 bg-red-700 text-white"
                          variant="outline"
                        >
                          Login
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex flex-col items-start  text-[14px] mx-8 my-6 gap-5 w-[136%]">
                <NavigationMenuItem className="w-full border-b border-gray-300 pb-2">
                  <Link href="/countries" passHref>
                    <span className="block w-full">Study Destination</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full border-b border-gray-300 pb-2">
                  <Link href="/uniarchive" passHref>
                    <span className="block w-full">Universities</span>
                  </Link>
                  <NavigationMenuContent>
                    <NavigationMenuLink href="#">Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full border-b border-gray-300 pb-2">
                  <Link href="/coursearchive" passHref>
                    <span className="block w-full">Courses</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full border-b border-gray-300 pb-2">
                  <Link href="">
                    {" "}
                    <span className="block w-full">Scholarships</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
