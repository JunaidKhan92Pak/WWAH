"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface CompleteApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteApplication: () => void;
}

export default function CompleteApplicationModal({ isOpen, onClose, onCompleteApplication }: CompleteApplicationModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check session storage when component mounts
  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem("applicationSubmitted");
    if (hasSubmitted) {
      setIsSubmitted(true);
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = () => {
    if (isChecked) {
      setIsSubmitted(true);
      sessionStorage.setItem("applicationSubmitted", "true"); // Store submission state in sessionStorage
      console.log("Form submitted successfully");
      onCompleteApplication();
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen && !isSubmitted} 
      onOpenChange={() => { 
        if (isSubmitted) onClose(); 
      }} 
    >
      <DialogContent 
        className="max-w-[300px] md:max-w-[550px] max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        
      >
        {/* Hide the default close button */}
        <style>{`
          [data-state="open"] button.absolute {
            display: none !important;
          }
          }
        `}</style>
        
        <DialogHeader>
          <DialogTitle className="justify-center flex">
            Student Consent & Declaration Form
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start space-y-2">
          <p className="text-base leading-4 font-medium">
            *Important: Please read this form carefully before proceeding. Your agreement is required to continue with the application process.
          </p>
          <p className="font-semibold text-base">I hereby affirm that:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className="text-sm">All the information I provide in my application is true, accurate, and complete to the best of my knowledge.</li>
            <li className="text-sm">Submitting false, misleading, or incomplete information may result in the rejection of my application or revocation of my admission.</li>
            <li className="text-sm">Any violation of laws or institutional regulations may result in disciplinary action, cancellation of my visa, and/or deportation.</li>
            <li className="text-sm">I am in good physical and mental health to undertake studies abroad and failing to disclose critical health information may affect my ability to study or remain abroad.</li>
            <li className="text-sm">I am financially responsible for Tuition fees, living expenses, travel, and other associated costs during my study abroad.</li>
            <li className="text-sm">
              I understand that World Wide Admissions Hub (WWAH) acts as a facilitator and is not responsible for:
              <ul className="list-[square] list-inside ml-4 space-y-1 my-2">
                <li className="text-sm">Final admission decisions by universities or colleges.</li>
                <li className="text-sm">Visa approvals or denials by the host country.</li>
                <li className="text-sm">Any legal, medical, or financial issues arising during my study abroad.</li>
              </ul>
            </li>
            <li className="text-sm">I understand that if I decide to withdraw my application after submission, I must inform World Wide Admissions Hub (WWAH) and the institution immediately. Any application fees paid may not be refundable.</li>
          </ul>
          <p className="font-semibold text-base">I Agree to the Terms and Conditions.</p>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              className="peer" 
              checked={isChecked} 
              onCheckedChange={handleCheckboxChange} 
            />
            <label htmlFor="terms" className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              By ticking this box, I acknowledge that I have read, understood, and accepted the terms and conditions of this consent form.
            </label>
          </div>
        </div>
        <Button disabled={!isChecked} onClick={handleSubmit} className="w-full bg-[#C7161E] hover:bg-[#C7161E]">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}