"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
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

// Zod validation schemas
const bankTransferSchema = z.object({
  preferredPaymentMethod: z.literal("bank_transfer"),
  bankAccountTitle: z.string().min(1, "Bank account title is required").trim(),
  bankName: z.string().min(1, "Bank name is required").trim(),
  accountNumberIban: z
    .string()
    .min(1, "Account number/IBAN is required")
    .trim(),
  mobileWalletNumber: z.null().optional(),
  accountHolderName: z.null().optional(),
});

const mobileWalletSchema = z.object({
  preferredPaymentMethod: z.enum([
    "jazzcash",
    "easypaisa",
    "sadapay",
    "nayapay",
  ]),
  mobileWalletNumber: z
    .string()
    .min(11, "Mobile number must be at least 11 digits")
    .trim(),
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .trim(),
  bankAccountTitle: z.null().optional(),
  bankName: z.null().optional(),
  accountNumberIban: z.null().optional(),
});

const noneSchema = z.object({
  preferredPaymentMethod: z.literal("none"),
  bankAccountTitle: z.null().optional(),
  bankName: z.null().optional(),
  accountNumberIban: z.null().optional(),
  mobileWalletNumber: z.null().optional(),
  accountHolderName: z.null().optional(),
});

// Union schema for all payment methods
const paymentSchema = z.discriminatedUnion("preferredPaymentMethod", [
  bankTransferSchema,
  mobileWalletSchema,
  noneSchema,
]);

const Step4 = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({}); // Clear errors when method changes
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

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    console.log("Selected Method:", selectedMethod);
    console.log("Payment Information:", paymentInformation);

    // Skip validation entirely if "none" is selected
    if (selectedMethod === "none") {
      try {
        const token = getAuthToken();

        const requestData = {
          preferredPaymentMethod: "none",
          bankAccountTitle: null,
          bankName: null,
          accountNumberIban: null,
          mobileWalletNumber: null,
          accountHolderName: null,
        };

        console.log("Frontend - Sending payment data (none):", requestData);

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
          router.push("/referralportal/completeprofile/termsagreement ");
        } else {
          console.error("Error:", res.message);
          alert(res.message || "Failed to save payment information");
        }
        return;
      } catch (error) {
        console.error("Frontend - Submission error:", error);
        alert("There was an error submitting the form. Please try again.");
        return;
      }
    }

    try {
      // Prepare data for validation
      const validationData = {
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

      console.log("Validation Data:", validationData);

      // Validate the data with Zod
      paymentSchema.parse(validationData);
      console.log("Frontend - Validation passed!");

      const token = getAuthToken();

      // Debug: Check token details
      console.log("Raw token:", token);
      console.log("Token length:", token?.length);
      console.log("Token type:", typeof token);

      // Debug: Check API URL
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/paymentInformation`
      );
      console.log("Token:", token ? "Present" : "Missing");

      // Keep the original requestData structure for backend compatibility
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path.join(".");
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
        console.log("Validation errors:", fieldErrors);
      } else {
        console.error("Frontend - Submission error:", error);
        alert("There was an error submitting the form. Please try again.");
      }
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
        {errors.preferredPaymentMethod && (
          <p className="text-red-500 text-sm mt-1">
            {errors.preferredPaymentMethod}
          </p>
        )}
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
                className={errors.bankAccountTitle ? "border-red-500" : ""}
              />
              {errors.bankAccountTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankAccountTitle}
                </p>
              )}
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input
                name="bankName"
                value={paymentInformation.bankName}
                onChange={handleChange}
                placeholder="Enter bank name..."
                className={errors.bankName ? "border-red-500" : ""}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>
            <div>
              <Label>Account Number / IBAN *</Label>
              <Input
                name="accountNumberIban"
                value={paymentInformation.accountNumberIban}
                onChange={handleChange}
                placeholder="Enter account number or IBAN..."
                className={errors.accountNumberIban ? "border-red-500" : ""}
              />
              {errors.accountNumberIban && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumberIban}
                </p>
              )}
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
                placeholder="Enter wallet number (e.g., 03xxxxxxxxx)..."
                className={errors.mobileWalletNumber ? "border-red-500" : ""}
              />
              {errors.mobileWalletNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileWalletNumber}
                </p>
              )}
            </div>
            <div>
              <Label>Account Holder Name *</Label>
              <Input
                name="accountHolderName"
                value={paymentInformation.accountHolderName}
                onChange={handleChange}
                placeholder="Enter account holder name..."
                className={errors.accountHolderName ? "border-red-500" : ""}
              />
              {errors.accountHolderName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountHolderName}
                </p>
              )}
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
