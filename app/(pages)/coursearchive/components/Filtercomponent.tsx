// "use client";

// import {  Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";

// import { useEffect, useState } from "react";
// // import { SidebarProfile } from "./SidebarProfile";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import FilterContent from "./FilterContent";

// const FilterComponent = ({ onDestinationChange }: { onDestinationChange: (selected: string[]) => void }) => {
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   if (!isMounted) {
//     return null;
//   }
//   return (
//     <div>
//       <Sheet>
//         <SheetTrigger>
//           <Button variant={"ghost"} size="icon" className="">
//             <Menu />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side={"left"} className="p-0">
//         <FilterContent />
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// };

// export default FilterComponent;
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
          <Button className="bg-[#F1F1F1]" variant="ghost" size="icon">
            <Menu />
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
