"use client";
import { useEffect, useState } from "react";
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
    fetchUser();
  }, [fetchUser]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const router = useRouter();
  const pathname = usePathname();
  const handleLoginClick = () =>
    router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);

  if (loading) return <Loading />;

  // helper to apply active styles
  const linkClasses = (path: string) => {
    const base = "font-normal hover:underline";
    const active = "font-bold underline decoration-black-500";
    return pathname === path ? `${base} ${active}` : base;
  };

  return (
    <header className="h-0 md:h-[50px] lg:mb-10">
      <div className="fixed z-20 w-full p-2 bg-white top-0 hidden md:block">
        <div className="w-[95%] mx-auto py-3 px-5 shadow-md rounded-xl bg-white text-black">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/wwah-textb.svg" alt="logo" width={150} height={60} />
            </Link>

            <nav className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-6">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/countries"
                        target={
                          pathname !== "/countries" ? "_blank" : undefined
                        }
                        rel={
                          pathname !== "/countries"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={linkClasses("/countries")}
                      >
                        Study Destinations
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/Universities"
                        target={
                          pathname !== "/Universities" ? "_blank" : undefined
                        }
                        rel={
                          pathname !== "/Universities"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={linkClasses("/Universities")}
                      >
                        Universities
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/coursearchive"
                        target={
                          pathname !== "/coursearchive" ? "_blank" : undefined
                        }
                        rel={
                          pathname !== "/coursearchive"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={linkClasses("/coursearchive")}
                      >
                        Courses
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/scholarships"
                        target={
                          pathname !== "/scholarships" ? "_blank" : undefined
                        }
                        rel={
                          pathname !== "/scholarships"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={linkClasses("/scholarships")}
                      >
                        Scholarships
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticate ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-300"
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      src={user?.profilePicture || "/default-profile.png"}
                      // src="/icons/userred.svg"
                      alt="user"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                      <div className="px-4 py-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <ul>
                        <li>
                          <Link
                            href="/dashboard/overview"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/chatmodel"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Chat with ZEUS
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoginClick}
                  className="bg-[#C7161E] text-white"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
