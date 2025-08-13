"use client";

// import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";


// import { SiMicrosoftacademic } from "react-icons/si";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import MobileSidebar from "./MobileSidebar";


// import MobileSidebar from "./MobileSidebar";

interface RouteProps {
  href: string;
  label: string;

}
export const routes: RouteProps[] = [
  {
    href: "/referralportal/completeprofile",
    label: "Basic Details",
 
  },
  {
    href: "/referralportal/completeprofile/academicinformation",
    label: "Academic Information",

  },
  {
    href: "/referralportal/completeprofile/workexperience",
    label: "Work Experience",
   
  },

    {
    href: "/referralportal/completeprofile/paymentinformation",
    label: "Payment Information",
  
  },
  {
    href: "/referralportal/completeprofile/termsagreement",
    label: "Terms and Agreement",

  },
];
export const SidebarProfile = () => {
  const pathname = usePathname();
  return (
    <>
      <MobileSidebar />
      <div className="px-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <Image
              src="/logo.svg"
              alt="logo"
              width={200}
              height={200}
              className="py-4"
            />
            <h1 className="text-2xl font-bold py-2">Complete Profile!</h1>
            <p className="w-full lg:w-[60%]">
              Please provide your information below to begin your learning
              journey.
            </p>
          </div>

          <div>
            {routes.map((route) => (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  "relative block", // ensure clickable area is block-level
                  pathname === route.href
                    ? "text-[#C7161E] before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-[#C7161E]"
                    : "text-black"
                )}
              >
                <div className="flex my-5 items-center">
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
