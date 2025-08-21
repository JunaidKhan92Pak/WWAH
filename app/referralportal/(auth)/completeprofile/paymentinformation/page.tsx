"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { getAuthToken } from "@/utils/authHelper";

const Step4 = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentOptions = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "jazzcash", label: "JazzCash" },
    { value: "easypaisa", label: "Easypaisa" },
    { value: "sadapay", label: "SadaPay" },
    { value: "nayapay", label: "NayaPay" },
    { value: "none", label: "None" },
  ];

  // State for the payment information form data
  const [paymentInformation, setPaymentInformation] = useState({
    preferredPaymentMethod: "",
    // Bank Transfer Fields
    bankAccountTitle: "",
    bankName: "",
    accountNumberIban: "",
    // Mobile Wallet Fields
    mobileWalletNumber: "",
    accountHolderName: "",
  });

  // Handler for payment method selection
  const handlePaymentMethodChange = (value: string) => {
    setSelectedMethod(value);
    setPaymentInformation({
      ...paymentInformation,
      preferredPaymentMethod: value,
      // Clear fields when method changes
      bankAccountTitle: "",
      bankName: "",
      accountNumberIban: "",
      mobileWalletNumber: "",
      accountHolderName: "",
    });
  };

  // Handler for text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPaymentInformation({ ...paymentInformation, [name]: value });
  };

  // Get auth token function (assuming it exists in your app)
  // const getAuthToken = () => {
  //   // Your token retrieval logic here
  //   return localStorage.getItem("token") || "";
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("test");
    e.preventDefault();

    // Validation
    if (selectedMethod === "bank_transfer") {
      if (
        !paymentInformation.bankAccountTitle.trim() ||
        !paymentInformation.bankName.trim() ||
        !paymentInformation.accountNumberIban.trim()
      ) {
        alert("Please fill in all bank transfer details.");
        return;
      }
    } else if (selectedMethod && selectedMethod !== "none") {
      if (
        !paymentInformation.mobileWalletNumber.trim() ||
        !paymentInformation.accountHolderName.trim()
      ) {
        alert("Please fill in all mobile wallet details.");
        return;
      }
    }

    try {
      const token = getAuthToken();

      // Prepare data according to backend expectations
      const requestData = {
        preferredPaymentMethod: paymentInformation.preferredPaymentMethod,
        bankAccountTitle:
          selectedMethod === "bank_transfer" &&
          paymentInformation.bankAccountTitle.trim()
            ? paymentInformation.bankAccountTitle.trim()
            : null,
        bankName:
          selectedMethod === "bank_transfer" &&
          paymentInformation.bankName.trim()
            ? paymentInformation.bankName.trim()
            : null,
        accountNumberIban:
          selectedMethod === "bank_transfer" &&
          paymentInformation.accountNumberIban.trim()
            ? paymentInformation.accountNumberIban.trim()
            : null,
        mobileWalletNumber:
          selectedMethod !== "bank_transfer" &&
          selectedMethod !== "none" &&
          paymentInformation.mobileWalletNumber.trim()
            ? paymentInformation.mobileWalletNumber.trim()
            : null,
        accountHolderName:
          selectedMethod !== "bank_transfer" &&
          selectedMethod !== "none" &&
          paymentInformation.accountHolderName.trim()
            ? paymentInformation.accountHolderName.trim()
            : null,
      };

      console.log("Frontend - Sending payment data:", requestData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/paymentInformation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      const res = await response.json();
      console.log("Frontend - Received response:", res);

      if (res.success) {
        // Navigate to next step or completion page
        router.push("/referralportal/completeprofile/termsagreement ");
      } else {
        console.error("Error:", res.message);
        alert(res.message || "Failed to save payment information");
      }
    } catch (error) {
      console.error("Frontend - Submission error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-[90%] sm:w-[80%]">
      <div>
        <Label className="mb-2 block">Choose Preferred Payment Method:</Label>
        <Select onValueChange={handlePaymentMethodChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select:" />
          </SelectTrigger>
          <SelectContent>
            {paymentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bank Transfer Fields */}
      {selectedMethod === "bank_transfer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Bank Account Title *</Label>
              <Input
                name="bankAccountTitle"
                value={paymentInformation.bankAccountTitle}
                onChange={handleChange}
                placeholder="Enter account title..."
                required
              />
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input
                name="bankName"
                value={paymentInformation.bankName}
                onChange={handleChange}
                placeholder="Enter bank name..."
                required
              />
            </div>
            <div>
              <Label>Account Number / IBAN *</Label>
              <Input
                name="accountNumberIban"
                value={paymentInformation.accountNumberIban}
                onChange={handleChange}
                placeholder="Enter account number or IBAN..."
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Wallet Fields */}
      {selectedMethod &&
        selectedMethod !== "bank_transfer" &&
        selectedMethod !== "none" && (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <Label>Mobile Wallet Number *</Label>
              <Input
                name="mobileWalletNumber"
                value={paymentInformation.mobileWalletNumber}
                onChange={handleChange}
                placeholder="Enter wallet number..."
                required
              />
            </div>
            <div>
              <Label>Account Holder Name *</Label>
              <Input
                name="accountHolderName"
                value={paymentInformation.accountHolderName}
                onChange={handleChange}
                placeholder="Enter account holder name..."
                required
              />
            </div>
          </div>
        )}

      <Button
        type="submit"
        className="bg-red-700 hover:bg-red-800 text-white"
        size={"lg"}
      >
        Continue
      </Button>
    </form>
  );
};

export default Step4;
