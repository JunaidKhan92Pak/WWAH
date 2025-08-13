"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SidebarProfile } from "./SidebarProfile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const MobileSidebar= () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 overflow-y-scroll">
          <SidebarProfile />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
