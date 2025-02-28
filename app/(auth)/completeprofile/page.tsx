"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const countries = [
  { value: "USA", label: "United States" },
  { value: "India", label: "India" },
  { value: "Australia", label: "Australia" },
  { value: "Italy", label: "Italy" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Canada", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "China", label: "China" },
  { value: "Ireland", label: "Ireland" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Germany", label: "Germany" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "France", label: "France" },
  { value: "Denmark", label: "Denmark" },
];

const cities = [
  { value: "Lahore", label: "Lahore" },
  { value: "Okara", label: "Okara" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Karachi", label: "Karachi" },
  { value: "Nepal", label: "Nepal" },
];

const Step1 = () => {
  const router = useRouter();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    dob: "",
    country: "",
    nationality: "",
    city: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}updateprofile/personal-Information`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(personalInfo),
        }
      );
      const res = await response.json();
      console.log(res);
      router.push("/completeprofile/academicinformation");
    } catch (error) {
      console.log(`There Is SOme Error ${error}`);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full">
        <form
          onSubmit={handleSubmit}
          className="w-[100%] bg-white rounded-md space-y-2 mx-auto  lg:p-8"
        >
          <div className="grid md:grid-cols-2 gap-2 w-full">
            {/* Column 1 */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={personalInfo.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={personalInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Column 1 - Second Row */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">Contact</label>
              <div className="flex space-x-2">
                <select
                  name="countryCode"
                  className="py-2 w-1/4 bg-[#F1F1F1] text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+44">+44 (UK)</option>
                  <option value="+86">+86 (China)</option>
                  <option value="+61">+61 (Australia)</option>
                  <option value="+1">+1 (Canada)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+353">+353 (Ireland)</option>
                  <option value="+64">+64 (New Zealand)</option>
                  <option value="+49">+49 (Germany)</option>
                  <option value="+39">+39 (Italy)</option>
                  <option value="+60">+60 (Malaysia)</option>
                  <option value="+33">+33 (France)</option>
                  <option value="+45">+45 (Denmark)</option>
                </select>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Phone"
                  value={personalInfo.contactNo}
                  onChange={handleChange}
                  className="w-3/4 px-4 py-2 bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Column 2 - Second Row */}
            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={personalInfo.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm">Country</label>
              <select
                name="country"
                value={personalInfo.country}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm">Nationality</label>
              <select
                name="nationality"
                value={personalInfo.nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select your nationality
                </option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm">City</label>
            <select
              name="city"
              value={personalInfo.city}
              onChange={handleChange}
              className="w-full sm:w-1/2 px-4 py-2 text-sm bg-[#F1F1F1] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <button
              type="submit"
              className="w-1/2 py-2 mt-4 bg-[#C7161E] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Step1;
