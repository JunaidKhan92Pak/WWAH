"use client";
import React, { useState } from "react";
import BasicInformation from "./components/BasicInformation/page";

import ReviewandSubmit from "./components/ReviewandSubmit/page";
// import { Button } from "@/components/ui/button";
import ApplicationInformation from "./components/ApplicationInformation/page";
import Uploaddocuments from "./components/Uploaddocuments/page";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AddApplicationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};


type Tab = {
  label: string;
  id: string;
};
export default function AddApplicationModal({ open, setOpen }: AddApplicationModalProps) {
    const tabs: Tab[] = [
    { label: "Basic Information", id: "basicinfo" },
    { label: "Application Information", id: "appinfo" },
    { label: "Upload Documents", id: "documents" },
    { label: "Review & Submit", id: "review" },
  ];
    const [activeTab, setActiveTab] = useState<string>("basicinfo");
   const goToNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextTab = tabs[currentIndex + 1];
    if (nextTab) {
      setActiveTab(nextTab.id);
    } else {
      // Optional: handle final submission here
      console.log("Reached end of tabs");
      setOpen(false); // or keep open
    }
  };

    const isLastTab = activeTab === "review";

  // const handleSubmit = () => {
  //   console.log("Submitting final application...");
  //   setOpen(false); // Optionally show a success message or modal
  // };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[300px] md:max-w-[680px] xl:max-w-[700px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        {/* <h5 className="text-center font-bold lg:mb-10">Complete your Application</h5> */}
        <div className="w-full  flex overflow-x-auto ">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition md:w-1/4 px-4 font-semibold text-sm py-4  rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
                        ${activeTab === tab.id
                  ? "bg-[#C7161E] text-white"
                  : "text-gray-600"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {activeTab === "basicinfo" && <BasicInformation /> }
        {activeTab === "appinfo" && <ApplicationInformation />}
      {activeTab === "documents" && <Uploaddocuments /> }
      {activeTab === "review" && <ReviewandSubmit  />}

        <DialogFooter>
          {/* <DialogClose> */}
            {/* <button className="text-sm px-4 py-2 bg-gray-200 rounded-lg">
              Cancel
            </button>
          </DialogClose>
          <button className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg">
            Submit
          </button> */}
            {!isLastTab && (
          <Button onClick={goToNextTab} className="mt-4 bg-red-600 hover:bg-red-500 w-[20%]">
            Next
          </Button>
            )}
        </DialogFooter>
          
      </DialogContent>
    </Dialog>
  );
}
