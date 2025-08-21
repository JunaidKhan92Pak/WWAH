"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { getAuthToken } from "@/utils/authHelper";

export default function MBAgreementPage() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isChecked) {
      alert("Please agree to the terms and conditions to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}refupdateprofile/paymentInformation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            termsAndAgreement: true,
          }),
        }
      );

      const res = await response.json();
      console.log("Terms agreement response:", res);

      if (res.success) {
        setShowModal(true);
      } else {
        console.error("Error:", res.message);
        alert(res.message || "Failed to save terms agreement");
      }
    } catch (error) {
      console.error("Error submitting terms agreement:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate to dashboard or next step after successful submission
    router.push("/referralportal/overview"); // Adjust the route as needed
  };

  return (
    <div className="p-2">
      <div className="mx-auto">
        <div className="mb-8">
          <p className="text-gray-700 text-base leading-relaxed">
            By signing up as a Mini Brand Ambassador (MBA) for WWAH, you agree
            to the following terms:
          </p>
        </div>

        <div className="space-y-8">
          {/* Role & Responsibility */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              1. Role & Responsibility
            </h2>
            <ul className=" space-y-3 ml-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I understand that I am representing WWAH as a brand promoter
                  and will act with professionalism and integrity.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I will actively share WWAHs referral link/QR code with my
                  network through ethical and honest means.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I will not engage in spamming, misrepresentation, or
                  misleading promotions to gain referrals.
                </span>
              </li>
            </ul>
          </section>

          {/* Referral Tracking */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              2. Referral Tracking
            </h2>
            <ul className=" space-y-3 ml-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I understand that all referrals must be made through my unique
                  referral code or link to be tracked and rewarded.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I acknowledge that WWAH reserves the right to reject any fake,
                  duplicate, or fraudulent referrals.
                </span>
              </li>
            </ul>
          </section>

          {/* Dashboard & Data */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              3. Dashboard & Data
            </h2>
            <ul className=" space-y-3 ml-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I agree to use the provided MBA Dashboard for accessing my
                  referral analytics, commissions, and updates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I confirm that the personal and banking details I provide are
                  accurate and up-to-date.
                </span>
              </li>
            </ul>
          </section>

          {/* Rewards & Commission */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              4. Rewards & Commission
            </h2>
            <ul className=" space-y-3 ml-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  I understand that referral commissions will be calculated
                  based on WWAHs policy and will be visible in my Commission
                  Tracker.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  Payouts will be made to the bank account or mobile wallet I
                  provide, subject to verification.
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-base leading-tight text-gray-700">
                  WWAH reserves the right to withhold or revoke payments if
                  referral guidelines are violated.
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Agreement Checkbox */}
        <form onSubmit={handleSubmit}>
          <div className="mt-8 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreement"
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
                className="mt-1"
              />
              <label
                htmlFor="agreement"
                className="text-gray-700 font-medium cursor-pointer text-base leading-relaxed"
              >
                I agree to the terms and conditions of the Mini Brand Ambassador
                Program.
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isChecked || isSubmitting}
            className="mt-4 bg-red-700 hover:bg-red-800 text-white"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {/* Success Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="flex flex-col justify-center items-center max-w-72 md:max-w-96 !rounded-3xl">
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </DialogClose>

            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className=" mx-auto items-center ">
                <Image
                  src="/DashboardPage/success.svg"
                  alt="Success"
                  width={150}
                  height={150}
                />
              </div>

              {/* Success Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your account has been
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  successfully created!
                </p>
              </div>

              {/* OK Button */}
              <Button
                onClick={handleModalClose}
                className="w-24 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                variant="outline"
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
