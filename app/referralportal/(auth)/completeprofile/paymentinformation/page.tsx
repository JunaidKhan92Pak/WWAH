"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PaymentMethodForm() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentOptions = [
    "Bank Transfer",
    "JazzCash",
    "Easypaisa",
    "SadaPay",
    "NayaPay",
    "None",
  ];

  return (
    <div className="space-y-6 w-[90%] sm:w-[80%]">
      <div>
        <Label className="mb-2 block">Choose Preferred Payment Method:</Label>
        <Select onValueChange={(value) => setSelectedMethod(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select:" />
          </SelectTrigger>
          <SelectContent>
            {paymentOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Fields */}
      {selectedMethod === "Bank Transfer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Bank Account Title</Label>
              <Input placeholder="Write..." />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input placeholder="Write..." />
            </div>
            <div>
              <Label>Account Number / IBAN</Label>
              <Input placeholder="Write..." />
            </div>
          </div>
        </div>
      )}

      {selectedMethod &&
        selectedMethod !== "Bank Transfer" &&
        selectedMethod !== "None" && (
          <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
            <div>
              <Label>Mobile Wallet Number</Label>
              <Input placeholder="Write..." />
            </div>
            <div>
              <Label>Account Holder Name</Label>
              <Input placeholder="Write..." />
            </div>
          </div>
        )}
   
      <Button className="bg-red-700 hover:bg-red-800 text-white"
      size={"lg"}>
          Continue
        </Button>
   
    </div>
  );
}
