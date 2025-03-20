"use client";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";
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
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="block lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-1">
          <div className="w-[90%] mt-8 border border-gray-200 mx-auto py-3 px-2 sm:px-5 shadow-md rounded-xl bg-white text-black">
            <div className="flex justify-around">
              {/* Logo */}
              <Image src="/logo.png" alt="logo" width={50} height={45} />
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
                      className="flex text-sm bg-gray-800 rounded-full"
                      onClick={toggleDropdown}
                    >
                      <span className="sr-only">Open user menu</span>
                      <FaCircleUser className="bg-white text-xl" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow">
                        <div className="px-4 py-3">
                          <span className="block text-sm text-gray-900">Bonnie Green</span>
                          <span className="block text-sm text-gray-500 truncate">
                            name@flowbite.com
                          </span>
                        </div>
                        <ul className="py-2">
                          <li>
                            <Link href="/completeprofile" onClick={() => setIsOpen(false)}>
                              <span className="block px-4 py-2 text-sm hover:bg-gray-100">
                                Dashboard
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/chatmodel" onClick={() => setIsOpen(false)}>
                              <span className="block px-4 py-2 text-sm hover:bg-gray-100">
                                Chat with ZEUS
                              </span>
                            </Link>
                          </li>
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
                  // Login/Signup Buttons for Guests
                  <div>
                    <Link href="/signin">
                      <Button className="text-[10px] w-10 h-6 px-4 bg-red-700 text-white" variant="outline">
                        Login
                      </Button>
                    </Link>

                    <Link href="/signin" onClick={() => setIsOpen(false)}>
                      <Button className="text-[10px] w-16 h-8 px-4 bg-red-700 text-white">
                        Login
                      </Button>
                    </Link>
                  </div>
                )}

              </div>
            </div>
            <div>
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col items-start gap-5 text-[14px] m-8 ">
                  <NavigationMenuItem>Study Destination</NavigationMenuItem>
                  <NavigationMenuItem>
                    Universities
                    <NavigationMenuContent>
                      <NavigationMenuLink href="#">Link</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>Programs</NavigationMenuItem>
                  <NavigationMenuItem>Scholarships</NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <nav className="w-full">
              <ul className="flex flex-col items-start text-[14px] mx-6 my-6 gap-5 w-[80%]">
                {[
                  { href: "/countries", label: "Study Destination" },
                  { href: "/Universities", label: "Universities" },
                  { href: "/coursearchive", label: "Courses" },
                  { href: "/scholarships", label: "Scholarships" },
                ].map((item) => (
                  <li
                    key={item.href}
                    className="w-full border-b border-gray-600 pb-2"
                  >
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                      <span className="block w-full">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
