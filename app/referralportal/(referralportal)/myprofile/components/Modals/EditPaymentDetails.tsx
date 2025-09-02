"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface PaymentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  updatedAt?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  setOpen,
  updatedAt,
}) => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

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
    setIsSubmitting(true);

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
          setOpen(false); // Close edit modal
          setSuccessOpen(true); // Show success modal
          // Auto close success modal after 2 seconds
          setTimeout(() => {
            setSuccessOpen(false);
            router.push("/referralportal/completeprofile/termsagreement ");
          }, 2000);
        } else {
          console.error("Error:", res.message);
          alert(res.message || "Failed to save payment information");
        }
      } catch (error) {
        console.error("Frontend - Submission error:", error);
        alert("There was an error submitting the form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
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
        // Close edit modal and show success modal
        setOpen(false);
        setSuccessOpen(true);
        // Auto close success modal after 2 seconds
        setTimeout(() => {
          setSuccessOpen(false);
          router.push("/referralportal/completeprofile/termsagreement ");
        }, 2000);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      // Reset form state when modal closes
      setSelectedMethod("");
      setErrors({});
      setPaymentInformation({
        preferredPaymentMethod: "",
        bankAccountTitle: "",
        bankName: "",
        accountNumberIban: "",
        mobileWalletNumber: "",
        accountHolderName: "",
      });
    }
    setOpen(openState);
  };

  return (
    <>
      {/* Payment Information Display */}
      <div className="flex flex-col space-y-2">
        <p className="text-gray-600 text-base">Payment Information</p>
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/DashboardPage/User.svg"
            alt="Icon"
            width={18}
            height={18}
          />
          <p className="text-sm">
            {updatedAt
              ? `last updated on ${new Date(updatedAt).toLocaleDateString(
                  "en-GB"
                )}`
              : "Not set"}
          </p>
          <Image
            src="/DashboardPage/pen.svg"
            alt="Edit"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Edit Payment Info Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="!rounded-2xl max-w-[300px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment Information</DialogTitle>
            <p className="text-sm text-gray-500">
              You can change this information once in 20 days.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Choose Preferred Payment Method:
              </Label>
              <Select onValueChange={handlePaymentMethodChange}>
                <SelectTrigger className="w-full rounded-lg bg-[#f1f1f1]">
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
                      className={`rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm ${
                        errors.bankAccountTitle ? "border-red-500" : ""
                      }`}
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
                      className={`rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm ${
                        errors.bankName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.bankName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bankName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Account Number / IBAN *</Label>
                    <Input
                      name="accountNumberIban"
                      value={paymentInformation.accountNumberIban}
                      onChange={handleChange}
                      placeholder="Enter account number or IBAN..."
                      className={`rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm ${
                        errors.accountNumberIban ? "border-red-500" : ""
                      }`}
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <Image
                          src="/DashboardPage/User.svg"
                          alt="user"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <Input
                        name="mobileWalletNumber"
                        value={paymentInformation.mobileWalletNumber}
                        onChange={handleChange}
                        placeholder="Enter wallet number (e.g., 03xxxxxxxxx)..."
                        className={`pl-10 rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm ${
                          errors.mobileWalletNumber ? "border-red-500" : ""
                        }`}
                        type="number"
                      />
                    </div>
                    {errors.mobileWalletNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobileWalletNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Account Holder Name *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <Image
                          src="/DashboardPage/User.svg"
                          alt="user"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <Input
                        name="accountHolderName"
                        value={paymentInformation.accountHolderName}
                        onChange={handleChange}
                        placeholder="Enter account holder name..."
                        className={`pl-10 rounded-lg bg-[#f1f1f1] placeholder-[#313131] placeholder:text-sm text-sm ${
                          errors.accountHolderName ? "border-red-500" : ""
                        }`}
                      />
                    </div>
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
              className="w-full md:w-[40%] bg-[#C7161E] hover:bg-[#A01419]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Payment Information"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
          <Image
            src="/DashboardPage/success.svg"
            alt="Success"
            width={150}
            height={150}
          />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Payment Information Updated Successfully!
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentModal;
