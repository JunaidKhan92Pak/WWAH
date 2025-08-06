"use client";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoIosArrowForward } from "react-icons/io";
import { useUserStore } from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";

const MobileNavbar = () => {
  const { isAuthenticate, logout, user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname(); // current page path
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLoginClick = () => {
    router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  };
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
        <div className="mt-8 py-8 border border-gray-200 mx-auto  px-4 shadow-lg rounded-xl bg-white text-black">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="w-[35%] md:w-[40%] flex justify-center items-center">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </Link>
            </div>

            {isAuthenticate ? (
              <div className="relative flex items-center space-x-3">
                <button
                  type="button"
                  className="flex text-sm bg-white rounded-full focus:ring-4 focus:ring-gray-300"
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src="/icons/userred.svg"
                    alt="user"
                    width={40}
                    height={40}
                    className="rounded-full w-8 h-8"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900">
                        {user?.firstName || "Loading"}
                      </span>
                      <span className="block text-sm text-gray-500 truncate">
                        {user?.email || "user12@gmail.com"}
                      </span>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/dashboard/overview"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/chatmodel"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Chat with ZEUS
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // <Link href="/signin" onClick={() => setIsOpen(false)}>
              <Button
                className="text-sm w-20 sm:w-24 h-8 sm:h-10 bg-red-700 text-white "
                onClick={handleLoginClick}
              >
                Login
              </Button>
              // </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="space-y-6">
                  {[
                    { href: "/", label: "Homekjnknk", icon: Home },
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
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-md hover:bg-gray-100  border-b border-gray-200 "
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}

                  <Link
                    href="/schedulesession"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    <span className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Book online counselling session
                    </span>
                    <IoIosArrowForward />
                  </Link>
                </div>
              </div>
            </div>

            {isAuthenticate && (
              <button
                onClick={logout}
                className="mt-4 w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
