"use client";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import Image from "next/image";
import { getAuthToken } from "@/utils/authHelper";

const Step5 = () => {
  // const router=useRouter();
  const [formData, setFormData] = useState({
    degreeLevel: "",
    fieldOfStudy: "",
    perferredCountry: "",
    perferredCity: "",
    studyBudget: "",
    studyMode: "",
    livingcost: "",
    tutionfees: "",
    currency: "",
  });

  // Handle input change for controlled form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission and API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/userPreference`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json",

          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const res = await response.json();
      console.log(res);
      // router.push("/completeprofile/studentpreference");

      if (response.ok) {
        alert("Form submitted successfully");
      } else {
        alert("Error submitting form: " + res.message);
      }
    } catch (error) {
      console.error(`There was an error: ${error}`);
      alert("There was an error with the submission.");
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <section>
        <form
          onSubmit={handleSubmit}
          className="mx-auto lg:px-8 bg-white rounded-md space-y-6 "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label
                htmlFor="preferredCountry"
                className="block text-gray-700 text-sm mb-2"
              >
                What is your preferred country for studying abroad?
              </label>
              <select
                id="perferredCountry"
                name="perferredCountry"
                value={formData.perferredCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="USA">United States</option>
                <option value="China">China</option>
                <option value="Australia">Australia</option>
                <option value="Italy">Italy</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Ireland">Ireland</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Denmark">Denmark</option>
                <option value="France">France</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="preferredCity"
                className="block text-gray-700 text-sm mb-2"
              >
                What is your preferred city?
              </label>
              <input
                type="text"
                id="perferredCity"
                name="perferredCity"
                value={formData.perferredCity}
                onChange={handleChange}
                placeholder="Write"
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label
                htmlFor="degreeLevel"
                className="block text-gray-700 text-sm mb-2"
              >
                Which degree level are you interested in?
              </label>
              <select
                id="degreeLevel"
                name="degreeLevel"
                value={formData.degreeLevel}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="foundation">Foundation</option>
                <option value="bachelor">Bachelor</option>
                <option value="preMaster">Pre Master</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fieldOfStudy"
                className="block text-gray-700 text-sm mb-2"
              >
                Which field of study would you like to pursue?
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                placeholder="Write..."
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="studyMode"
                className="block text-gray-700 text-sm mb-2"
              >
                Which study mode would you prefer?
              </label>
              <select
                id="studyMode"
                name="studyMode"
                value={formData.studyMode}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="onCampus">On Campus</option>
                <option value="online">Online</option>
                <option value="blended">Blended</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="currency"
                className="block text-gray-700 text-sm mb-2"
              >
                Currency
              </label>
              <input
                type="text"
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="currency"
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tutionfees"
                className="block text-gray-700 text-sm mb-2"
              >
                Tution Fees
              </label>
              <input
                type="text"
                id="tutionfees"
                name="tutionfees"
                value={formData.tutionfees}
                onChange={handleChange}
                placeholder="tution fees"
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="livingcost"
                className="block text-gray-700 text-sm mb-2"
              >
                Living Cost
              </label>
              <input
                type="text"
                id="livingcost"
                name="livingcost"
                value={formData.livingcost}
                onChange={handleChange}
                placeholder="living cost"
                className="w-full placeholder:text-sm  placeholder-gray-700 bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-left">
            <button
              type="submit"
              className="w-1/2 text-[14px] py-2 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              onClick={() => setOpen(true)}
            >
              Create my Account
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="rounded-2xl shadow-lg p-6 max-w-52 sm:max-w-sm text-center bg-white">
                <DialogHeader>
                  <div className="flex flex-col items-center">
                    <div className=" flex items-center justify-center   ">
                      {/* <CheckCircle className="w-12 h-12 text-orange-500" /> */}
                      <Image
                        src="/completeprofile/Accmodal.svg"
                        alt="complete profile"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      Account Created Successfully!
                    </p>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Step5;
