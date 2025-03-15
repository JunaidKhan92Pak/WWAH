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
//           <Image src="/paymentStudentDashboard/data-range.svg" alt="data" width={20} height={20} />
//           Date range
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[604px] bg-white rounded-lg shadow-md">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold text-black">
//             Date range
//           </DialogTitle>
//         </DialogHeader>
//         {/* Flex container */}
//         <div className="flex flex-col sm:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6">
//           {/* Left Section: Buttons and Inputs */}
//           <div className=" space-y-6 w-full">
//             <div className="space-y-4">
//               {/* Start Date */}
//               <div className="flex items-center space-x-2">
//                 <div className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm flex items-start gap-2 ">
//                 <Image src="/paymentStudentDashboard/data-range.svg" alt="data" width={20} height={20} />
//                 <div className="flex flex-col">
//                 {startDate ? (
//                     <span>{format(startDate, "PPP")}</span>
//                   ) : (
//                     <span className="font-semibold">Start Date</span>
//                   )}
//                   <span className="text-gray-500 font-light ">Add date</span>
//                 </div>
                 
//                 </div>
//               </div>
//               {/* End Date */}
//               <div className="flex items-center space-x-2">
//               <div className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm flex items-start gap-2 ">
//                 <Image src="/paymentStudentDashboard/data-range.svg" alt="data" width={20} height={20} />
//                 <div className="flex flex-col">
//                 {startDate ? (
//                     <span>{format(startDate, "PPP")}</span>
//                   ) : (
//                     <span className="font-semibold">End Date</span>
//                   )}
//                   <span className="text-gray-500 font-light ">Add date</span>
//                 </div>
                 
//                 </div>
//               </div>
//             </div>
//             {/* Buttons */}
//             <div className="flex space-x-4">
//               <Button
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2"
//                 onClick={() => {
//                   // apply logic will come here
//                 }}
//               >
//                 Apply
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg py-2"
//                 onClick={handleReset}
//               >
//                 Reset
//               </Button>
//             </div>
//           </div>

//           {/* Right Section: Calendar */}
//           <div className="">
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
//               className="rounded-md border-gray-200"
//               classNames={{
//                 day_selected: "bg-orange-500 text-white hover:bg-orange-400",
//                 day_today: "bg-orange-100 text-orange-900",
//                 day_range_middle: "bg-orange-100 text-orange-900",
//                 day_range_end: "bg-orange-500 text-white hover:bg-orange-400",
//                 day_range_start: "bg-orange-500 text-white hover:bg-orange-400",
//               }}
//             />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
