"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import Image from "next/image";

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div className="">
      <Sheet>
        <SheetTrigger>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="lg:hidden mt-8 mb-4 mx-4  bg-gray-100 border-2 border-gray-200"
          >
            {/* <Menu /> */}
            <div className="flex items-center w-[100px] justify-between ">
              <div className="flex gap-2">
                <Image
                  src="/filterr.svg"
                  width={18}
                  height={18}
                  alt="favourite"
                  className="2xl:w-[42px] 2xl:h-[42px]"
                />
                <p className=" font-bold">Filters</p>
              </div>
              <Image
                src="/right-arrow.png"
                alt="arrow"
                width={10}
                height={10}
              />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
          <div className="p-4 mt-4">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
