"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;

}

export default function SubmissionSuccessModal({
  isOpen,
  onClose,
}: SubmissionSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="justify-center flex">
            <Image
              src="/modalImg.svg"
              alt="Modal"
              width={32}
              height={32}
              className="w-2/5 mb-3"
            />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-2 text-center py-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Your application has been submitted successfully
          </h3>
          <Button
            onClick={onClose}
            className="mt-2  text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
