"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
  {
    id: 1,
    href: "/referralportal/completeprofile",
  },
  {
    id: 2,

    href: "/referralportal/completeprofile/academicinformation",
  },
  {
    id: 3,

    href: "/referralportal/completeprofile/workexperience",
  },

  {
    id: 4,

    href: "/referralportal/completeprofile/paymentinformation",
  },
  {
    id: 5,

    href: "/referralportal/completeprofile/termsagreement",
  },

];

const PageTrack = () => {
  const pathname = usePathname();
  const currentRoute = routes.find((route) => route.href === pathname);
  // console.log(currentRoute);
  return (
    <div className="">
      Step:
      <span className={cn(currentRoute ? "text-[#F0851D] text-[16px]" : "text-black text-[16px]")}>
        {" "}
        {currentRoute?.id ?? "Not found"}
      </span>
      &nbsp;/ 5
    </div>
  );
};

export default PageTrack;
