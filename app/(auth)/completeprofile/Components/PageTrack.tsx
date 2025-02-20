"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
  {
    id: 1,
    href: "/completeprofile",
  },
  {
    id: 2,

    href: "/completeprofile/academicinformation",
  },
  {
    id: 3,

    href: "/completeprofile/workexperience",
  },
  {
    id: 4,

    href: "/completeprofile/languageproficiency",
  },
  {
    id: 5,

    href: "/completeprofile/studentpreference",
  },
];

const PageTrack = () => {
  const pathname = usePathname();
  const currentRoute = routes.find((route) => route.href === pathname);
  console.log(currentRoute);
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
