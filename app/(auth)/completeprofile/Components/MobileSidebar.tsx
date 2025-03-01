"use client";

import {  Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { SidebarProfile } from "./SidebarProfile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
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
          <Button variant={"ghost"} size="icon" className="lg:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
          <SidebarProfile />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
