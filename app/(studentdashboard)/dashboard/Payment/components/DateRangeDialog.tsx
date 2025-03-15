// "use client";

// import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { format } from "date-fns";
// import Image from "next/image";

// export function DateRangeDialog() {
//   const [startDate, setStartDate] = useState<Date>();
//   const [endDate, setEndDate] = useState<Date>();

//   const handleReset = () => {
//     setStartDate(undefined);
//     setEndDate(undefined);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="text-black px-4 border-orange-200 bg-orange-50 hover:bg-orange-100"
//         >
//           <Image
//             src="/paymentStudentDashboard/data-range.svg"
//             alt="data"
//             width={20}
//             height={20}
//             className="mr-2"
//           />
//           Date range
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[95%] md:max-w-[604px] bg-white rounded-lg shadow-md p-4 sm:p-6">
//         <DialogHeader>
//           <DialogTitle className="text-lg sm:text-xl font-semibold text-black">
//             Date range
//           </DialogTitle>
//         </DialogHeader>
//         {/* Flex container */}
//         <div className="flex flex-col lg:flex-row justify-between gap-6 mt-4">
//           {/* Left Section: Buttons and Inputs */}
//           <div className="space-y-4 sm:space-y-6 w-full lg:w-1/2">
//             <div className="space-y-3 sm:space-y-4">
//               {/* Start Date */}
//               <div className="w-full">
//                 <div className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm flex items-start gap-2">
//                   <Image
//                     src="/paymentStudentDashboard/data-range.svg"
//                     alt="data"
//                     width={20}
//                     height={20}
//                     className="mt-1 flex-shrink-0"
//                   />
//                   <div className="flex flex-col">
//                     {startDate ? (
//                       <span className="text-sm sm:text-base">
//                         {format(startDate, "PPP")}
//                       </span>
//                     ) : (
//                       <span className="font-semibold text-sm sm:text-base">
//                         Start Date
//                       </span>
//                     )}
//                     <span className="text-gray-500 font-light text-xs sm:text-sm">
//                       Add date
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {/* End Date */}
//               <div className="w-full">
//                 <div className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm flex items-start gap-2">
//                   <Image
//                     src="/paymentStudentDashboard/data-range.svg"
//                     alt="data"
//                     width={20}
//                     height={20}
//                     className="mt-1 flex-shrink-0"
//                   />
//                   <div className="flex flex-col">
//                     {endDate ? (
//                       <span className="text-sm sm:text-base">
//                         {format(endDate, "PPP")}
//                       </span>
//                     ) : (
//                       <span className="font-semibold text-sm sm:text-base">
//                         End Date
//                       </span>
//                     )}
//                     <span className="text-gray-500 font-light text-xs sm:text-sm">
//                       Add date
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Buttons */}
//             <div className="flex gap-3 sm:gap-4">
//               <Button
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm sm:text-base"
//                 onClick={() => {
//                   // apply logic will come here
//                 }}
//               >
//                 Apply
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg py-2 text-sm sm:text-base"
//                 onClick={handleReset}
//               >
//                 Reset
//               </Button>
//             </div>
//           </div>

//           {/* Right Section: Calendar */}
//           <div className="w-full lg:w-1/2">
//             <Calendar
//               mode="range"
//               selected={{
//                 from: startDate,
//                 to: endDate,
//               }}
//               onSelect={(range) => {
//                 setStartDate(range?.from);
//                 setEndDate(range?.to);
//               }}
//               numberOfMonths={1}
//               className="rounded-md border-gray-200 w-full"
//               classNames={{
//                 nav: "flex items-center justify-between w-full mb-2",
//                 nav_button: "p-2",
//                 day_selected: "bg-orange-500 text-white hover:bg-orange-400",
//                 day_today: "bg-orange-100 text-orange-900",
//                 day_range_middle: "bg-orange-100 text-orange-900",
//                 day_range_end: "bg-orange-500 text-white hover:bg-orange-400",
//                 day_range_start: "bg-orange-500 text-white hover:bg-orange-400",
//                 months: "w-full",
//                 month: "w-full text-center",
//                 table: "w-full",
//                 head_cell: "text-xs sm:text-sm",
//                 cell: "text-center text-sm sm:text-base h-8 w-8 sm:h-9 sm:w-9 p-0",
//                 day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal",
//               }}
//             />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
