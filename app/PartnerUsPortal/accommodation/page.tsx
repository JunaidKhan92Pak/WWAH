"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AccommodationPage from "./components/AccommodationBooking/AccommodationPage";
import AirportPickupPage from './components/AirportPickup/AirportPickupPage';

type Tab = {
  label: string;
  id: string;
};

const Page = () => {
  const tabs: Tab[] = [
    { label: "Accommodation Booking", id: "accommodation" },
    { label: "Airport Pickup", id: "airport" },
  ];

  const [activeTab, setActiveTab] = useState<string>("accommodation");

  return (
    <>
      <div className="border rounded-lg p-4">
        <h5 className="font-bold mb-4">Accommodation & Airport Booking Assistance</h5>
        <div className="w-full  flex overflow-x-auto hide-scrollbar  ">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition px-6 font-semibold text-sm sm:text-base py-4 rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
                        ${activeTab === tab.id
                  ? "bg-[#C7161E] text-white"
                  : "text-gray-600"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
       {activeTab === "accommodation" && <AccommodationPage /> } 
       {activeTab === "airport" && <AirportPickupPage /> }
      </div>
    </>
  );
};

export default Page;
