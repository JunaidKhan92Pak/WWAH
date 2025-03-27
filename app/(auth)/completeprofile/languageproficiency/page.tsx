"use client";
import { getAuthToken } from "@/utils/authHelper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Step4 = () => {
  const router = useRouter();
  const [englishProficiency, setEnglishProficiency] = useState({
    proficiencyLevel: "",
    proficiencyTest: "",
    proficiencyTestScore: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEnglishProficiency({
      ...englishProficiency,
      [name]: value,
      ...(name === "proficiencyLevel" && value === "willingToTest"
        ? { proficiencyTest: "", proficiencyTestScore: "" }
        : {}),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/english-proficiency`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(englishProficiency),
        }
      );
      const res = await response.json();
      console.log(res);
      router.push("/completeprofile/studentpreference");
    } catch (error) {
      console.error(`There was an error: ${error}`);
    }
  };

  return (
    <div className="w-full mt-6">
      <section className="w-[100%]">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md space-y-3  lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                What is your English Proficiency level?
              </label>
              <select
                id="proficiencyLevel"
                name="proficiencyLevel"
                value={englishProficiency.proficiencyLevel}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="native speaker">Native Speaker</option>
                <option value="test">Completed a test</option>
                <option value="willingToTest">Willing to take a test</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Which English Proficiency test have you taken?
              </label>
              <select
                id="proficiencyTest"
                name="proficiencyTest"
                value={englishProficiency.proficiencyTest}
                onChange={handleChange}
                disabled={
                  englishProficiency.proficiencyLevel === "willingToTest"
                }
                className="w-full text-sm px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="ielts">IELTS</option>
                <option value="pte">PTE</option>
                <option value="toefl">TOEFL</option>
                <option value="duolingo">DUOLINGO</option>
                <option value="language-cert">Language Cert</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Obtained scores
              </label>
              <input
                type="text"
                name="proficiencyTestScore"
                value={englishProficiency.proficiencyTestScore}
                onChange={handleChange}
                placeholder="Write..."
                disabled={
                  englishProficiency.proficiencyLevel === "willingToTest"
                }
                className="w-full placeholder:text-sm  bg-[#F1F1F1] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 placeholder-black disabled:placeholder-gray-700 disabled:bg-gray-200"
              />
            </div>
          </div>

          <div className="text-left">
            <button
              type="submit"
              className="w-1/2 px-8 py-2 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Step4;
