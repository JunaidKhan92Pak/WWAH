"use client";

// import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiUser } from "react-icons/ci";
import { IconType } from "react-icons";
import { FaGraduationCap } from "react-icons/fa";
import { RiMic2Line } from "react-icons/ri";
// import { SiMicrosoftacademic } from "react-icons/si";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CgWorkAlt } from "react-icons/cg";
import { PiStudent } from "react-icons/pi";
// import MobileSidebar from "./MobileSidebar";

interface RouteProps {
  href: string;
  label: string;
  icon: IconType;
}
export const routes: RouteProps[] = [
  {
    href: "/completeprofile",
    label: "Personal Information",
    icon: CiUser,
  },
  {
    href: "/completeprofile/academicinformation",
    label: "Academic Information",
    icon: FaGraduationCap,
  },
  {
    href: "/completeprofile/workexperience",
    label: "Work Experience",
    icon: CgWorkAlt,
  },
  {
    href: "/completeprofile/languageproficiency",
    label: "English Language Proficiency",
    icon: RiMic2Line,
  },

  {
    href: "/completeprofile/studentpreference",
    label: "Student Preference",
    icon: PiStudent,
  },
 
];
export const SidebarProfile = () => {
  const pathname = usePathname();
  return (
    <>
      {/* <MobileSidebar /> */}
      <div className=" px-4">
        {/* <div> */}
        <section className="space-y-4">
          <div className="space-y-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="py-4"
            />

            <h1 className="text-2xl font-bold py-2">Complete Profile!</h1>
            <p className="w-full lg:w-[60%]">
              Please provide your information below to begin your learning
              journey.
            </p>
          </div>
          <div className="">
            {routes.map((route) => (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  pathname === route.href ? "text-[#C7161E]" : "text-black"
                )}
              >
                <div className="flex my-5 items-center  ">
                  <route.icon />
                  <div className="px-3">{route.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
{
  /* <p className="flex">
            <Button variant={"ghost"} onClick={() => onNavigate("Step2")}>
              <FaGraduationCap className="mx-2" />
              Academic Information
            </Button>
          </p>
          <p className="flex">
            <Button variant={"ghost"} onClick={() => onNavigate("Step3")}>
              <RiMic2Line className="" />
              English Language Proficiency
            </Button>
          </p>
          <p className="flex">
            <Button variant={"ghost"} onClick={() => onNavigate("Step4")}>
              <SiMicrosoftacademic className="mx-2" />
              Student Preference
            </Button>
          </p> */
}
