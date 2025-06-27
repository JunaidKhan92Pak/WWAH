/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ApplicationStatusTracker from "./components/ApplicationStatusTracker";
import PerformanceChart from "./components/PerformanceChart";
import RevenueChart from "./components/RevenueChart";
import UpcomingWebinars from "./components/UpcomingWebinars";
import ZeusChatBox from "./components/ZeusChatBox";
import AccountManager from "./components/AccountManager";
import AddNewStudentModal from "./components/AddNewStudentForms/AddNewStudentModal";
import AddApplicationModal from "./components/AddApplicationForms/AddApplicationModal";


const page = () => {
  const statusData = [
    {
      label: "Total Applications",
      count: 1,
      bg: "bg-[#29B7C10F]",
      icon: "/partnersportal/totalapplication.svg",
      countBg: "bg-[#00ABB74D]",
    },
    {
      label: "In Process Applications",
      count: 1,
      bg: "bg-[#FCC82B24]",
      icon: "/partnersportal/inprocess.svg",
      countBg: "bg-[#FCC82B4F]",
    },
    {
      label: "Visa Approved",
      count: 1,
      bg: "bg-[#E23A5924]",
      icon: "/partnersportal/visaapplication.svg",
      countBg: "bg-[#A535744D]",
    },
    {
      label: "Rejected Application",
      count: 1,
      bg: "bg-[#3E7B9726]",
      icon: "/partnersportal/rejectapplication.svg",
      countBg: "bg-[#3E7B974D]",
    },
    {
      label: "Completed Application",
      count: 1,
      bg: "bg-[#50B74824]",
      icon: "/partnersportal/completeapplication.svg",
      countBg: "bg-[#50B7484D]",
    },
  ];
 

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  const formatted = now.toLocaleString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  return (
    <div className="space-y-4 overflow-hidden">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start  border p-4 rounded-xl">
        {/* Left Side: Greeting */}
        <div className="flex flex-col items-start">
          <div className="bg-[#D9D9D940] h-[40px] w-[40px] border rounded-lg flex items-center justify-center mt-2">
            <Image
              src="/partnersportal/hand.svg"
              alt="Hand Icon"
              width={16}
              height={16}
            />
          </div>
          <div>
            <h3>Welcome, WAQAR ALI!</h3>
            <p className="text-sm">{formatted}</p>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-col md:flex-row gap-2 items-start mt-2 md:mt-0">
            <button
          onClick={() => setIsStudentModalOpen(true)}
          className="bg-[#FCE7D2] hover:bg-[#f7dec6] text-red-600 px-4 py-2 rounded-lg text-sm"
        >
          + Add New Student
        </button>
          <button   
          onClick={() => setIsApplicationModalOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
            + Add Application
          </button>
        </div>
        
           {/* Modal rendered separately but controlled here */}
      <AddNewStudentModal
        open={isStudentModalOpen}
        onOpenChange={setIsStudentModalOpen}
      />
        <AddApplicationModal
        open={isApplicationModalOpen}
        setOpen={setIsApplicationModalOpen}
      />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statusData.map((item, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-4 flex items-center justify-between shadow-sm ${item.bg}`}
          >
            <div className="flex flex-row lg:flex-row items-center space-x-2">
              <Image
                src={item.icon}
                alt={item.label}
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div className="text-sm font-medium text-black w-1/2">
                {item.label}
              </div>
            </div>
            <div
              className={`w-[30px] h-[25px] shrink-0 flex items-center justify-center rounded-md text-sm font-semibold text-black ${item.countBg}`}
            >
              {item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1  xl:grid-cols-3 gap-2">
        {/* Main Content - takes 2 columns instead of 3 */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          {/* Application status */}
         <ApplicationStatusTracker />

          {/* Performance Chart */}
          <PerformanceChart />

          {/* Revenue Chart */}
         <RevenueChart />

        
          {/* Upcomig webinars */}
          <UpcomingWebinars />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Box */}
          <ZeusChatBox />
         

          {/* Account Manager */}
          <AccountManager />

        </div>
      </div>
    </div>
  );
};

export default page;
