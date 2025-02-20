// "use client";
// import React, { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// const accommodations = [
//   {
//     id: 1,
//     name: "GST Hostel, New York United States",
//     rent: "$1200/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 2,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 3,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 4,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 5,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 6,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 7,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 8,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 9,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
//   {
//     id: 10,
//     name: "GST Hostel, New York United States",
//     rent: "$1300/mo",
//     amenities: ["One Besdroom", "WiFi", "Air Conditioner"],
//     image: "/AccommodationBooking/hostel1.svg",
//   },
// ];

// const HomePage: React.FC = () => {
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

//   return (
//     <div className="px-4 rounded-lg ml-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center">
//         <div className="flex flex-col leading-tight">
//           <h6>Accommodation Booking!</h6>
//           <p className="text-base text-gray-600 ">
//             Find the best accommodation to stay abroad.
//           </p>
//         </div>

//         {/* Country Selector */}
//         <div className="mb-6">
//           <Select onValueChange={(value) => setSelectedCountry(value)}>
//             <SelectTrigger className="w-64">
//               <Image
//                 src="/AccommodationBooking/country.svg"
//                 alt="country"
//                 width={25}
//                 height={25}
//               />
//               <SelectValue placeholder="Select Country" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="usa">United States</SelectItem>
//               <SelectItem value="uk">United Kingdom</SelectItem>
//               <SelectItem value="canada">Canada</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Display Selected Country */}
//         {selectedCountry && (
//           <p className="text-gray-600 mt-4">
//             Selected Country: {selectedCountry}
//           </p>
//         )}
//       </div>

//       {/* Accommodation Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
//         {accommodations.map((accommodation) => (
//           <div
//             key={accommodation.id}
//             className="border rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row"
//           >
//             {/* Image */}
//             <div className="w-full sm:w-1/3 p-3 rounded-lg">
//               <Image
//                 src={accommodation.image}
//                 alt={accommodation.name}
//                 className="w-full h-full object-cover rounded-lg"
//                 width={300}
//                 height={300}
//               />
//             </div>
//             {/* Card Content */}
//             <div className="p-4 flex-1">
//               {/* Title */}
//               <p className="text-gray-800 font-bold text-lg">
//                 {accommodation.name}
//               </p>
//               {/* Monthly Rent */}
//               <div className="flex justify-between items-center mt-2">
//                 <p className="text-sm text-gray-600">Monthly Rent:</p>
//                 <p className="text-orange-500 font-semibold text-sm">
//                   {accommodation.rent}
//                 </p>
//               </div>
//               {/* Amenities */}
//               <div className="flex flex-wrap gap-2 mt-4">
//                 {accommodation.amenities.map((amenity, index) => (
//                   <span
//                     key={index}
//                     className="text-xs text-gray-700 border border-gray-300 px-3 py-1 rounded-full"
//                   >
//                     {amenity}
//                   </span>
//                 ))}
//               </div>
//               {/* Book Now Button */}
//               <Button className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
//                 Book Now
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
'use client';

import { StatusProgressBar } from '@/app/(studentdashboard)/dashboard/components/StatusProgressBar';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StatusProgressBar progress={70} />
      </div>
    </div>
  );
}