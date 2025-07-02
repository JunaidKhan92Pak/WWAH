import { IoFunnelOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import FilterContent from "./FilterContent";

// const FilterComponent = ({ onDestinationChange }: { onDestinationChange: (selected: string[]) => void }) => {
const FilterComponent = () => {
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
          <Button className="bg-[#F1F1F1] w-full px-8" variant="ghost" size="icon">
          <IoFunnelOutline/> Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {/* ✅ Add a hidden title for accessibility */}
          <SheetTitle className="sr-only">Filter Options</SheetTitle>
          <FilterContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterComponent;
