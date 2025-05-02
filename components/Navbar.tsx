"use client";
import { useEffect, useState } from "react";
// import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useUserStore } from "@/store/userStore";
import Loading from "@/app/loading";
import { usePathname, useRouter } from "next/navigation";
const Navbar = () => {
  const { isAuthenticate, loading, logout, user, fetchUser } = useUserStore();
  useEffect(() => {
    fetchUser(); // Fetch user data when the component mounts
  }, []);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const router = useRouter();
  const pathname = usePathname(); // current page path
  const handleLoginClick = () => {
    router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  };
  if (loading) return <Loading />;
  return (
    <header className="h-0 md:h-[50px] lg:mb-10">
      <div className="fixed z-20 w-full mb-2 p-2 bg-white top-0 hidden md:block ">
        <div className=" w-[95%]  mx-auto py-3 px-5 shadow-md rounded-xl bg-white text-black">
          <div className="flex justify-between gap-3 items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/wwah-textb.svg"
                alt="logo"
                width={150}
                height={60}
              // className="2xl:w-[150px] 2xl:h-[60px]"
              />
            </Link>
            {/* Navigation Menu */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-3 lg:gap-12 items-center">
                  {/* Link to Study Destination Page */}
                  <NavigationMenuItem>
                    <Link href="/countries" passHref>
                      <NavigationMenuLink className="hover:underline font-normal">
                        Study Destinations
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/Universities" passHref>
                      <NavigationMenuLink className="hover:underline font-normal">
                        Universities
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {/* Link to Programs Page */}
                  <NavigationMenuItem>
                    <Link href="/coursearchive" passHref>
                      <NavigationMenuLink className="hover:underline font-normal">
                        Courses
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {/* Link to Scholarships Page */}
                  <NavigationMenuItem>
                    <Link href="/scholarships" passHref>
                      <NavigationMenuLink className="hover:underline font-normal">
                        Scholarships
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            {/* Conditional Rendering */}
            <div className="flex gap-3 lg:gap-5">
              {isAuthenticate ? (
                // Profile Dropdown for Logged-in Users
                <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                  <button
                    type="button"
                    className="flex text-sm bg-white  rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    {/* <FaCircleUser className="text-gray-800  w-8 h-8 text-xl " /> */}
                    <Image
                      src="/icons/userred.svg"
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full w-8 h-8 "
                    />{" "}
                  </button>
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      id="user-dropdown"
                      className="absolute right-1 top-10 z-20 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    >
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">
                          {user?.firstName || "Loading"}
                        </span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          {user?.email || "user12gmail.com"}
                        </span>
                      </div>
                      <ul className="py-2">
                        <li>
                          <Link
                            href="/dashboard/overview"
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
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            onClick={logout}
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
                <>
                  {/* <Link href="/signin"> */}
                  <Button
                    className="bg-[#C7161E] text-white text-base"
                    variant="outline"
                    size="lg"
                    onClick={handleLoginClick}>
                    Login
                  </Button>
                  {/* </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
