"use client";
// import { useState } from 'react';
// export default function Home() {
//   const [formData, setFormData] = useState({ name:'', capital:'' });
//   const [message, setMessage] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     try {
//       const response = await fetch('/api/submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setMessage('Form submitted successfully!');
//         setFormData({ name:'', capital:'' }); // Clear form
//       } else {
//         setMessage('Failed to submit the form.');
//       }
//     } catch (error) {
//       setMessage('An error occurred.');
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Submit Your Data</h1>
//       <form onSubmit={handleSubmit} className='p-2 flex items-center gap-2'>
//         <div className='p-2'>
//           <label htmlFor="country">country:</label>
//           <input
//           className='border-2 p-2'
//             type="text"
//             id="country"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className='p-2'>
//           <label htmlFor="capital">capital:</label>
//           <input
//           className='border-2 p-2'
//             type="text"
//             id="capital"
//             name="capital"
//             value={formData.capital}
//             onChange={handleChange}

//           />
//         </div>
//         <button className=' bg-blue-800 p-2 text-[16px] text-white' type="submit">Add University</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

import { useState } from "react";

const CountryForm = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    countryName: "",
    description: "",
    capital: "",
    language: "",
    population: "",
    currency: "",
    internationalStudents: "",
    academicIntakes: "",
    dialingCode: "",
    gdp: "",
    overview: "",
    workWhileStudying: "",
    postStudyWorkVisa: "",
    permanentResidency: "",
    scholarships: "",
    healthcareTitle: "",
    healthcareDescription: "",
    howItWorks: "",
  });

  const countryCodes = [
    { label: "+1", value: "US" },
    { label: "+44", value: "GB" },
    { label: "+91", value: "IN" },
    // Add more country codes as needed
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setMessage("Form submitted successfully!");
        setFormData({
          countryName: "",
          description: "",
          capital: "",
          language: "",
          population: "",
          currency: "",
          internationalStudents: "",
          academicIntakes: "",
          dialingCode: "",
          gdp: "",
          overview: "",
          workWhileStudying: "",
          postStudyWorkVisa: "",
          permanentResidency: "",
          scholarships: "",
          healthcareTitle: "",
          healthcareDescription: "",
          howItWorks: "",
        }); // Clear form
      } else {
        setMessage("Failed to submit the form.");
      }
    } catch (error) {
      setMessage("An error occurred.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div>
        <label className="block font-semibold">Country Name</label>
        <input
          type="text"
          name="countryName"
          value={formData.countryName}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]

"
          placeholder="Enter country name"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter country description"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Capital</label>
        <input
          type="text"
          name="capital"
          value={formData.capital}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter capital city"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Language</label>
        <input
          type="text"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter official language"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Population</label>
        <input
          type="number"
          name="population"
          value={formData.population}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter population"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Currency</label>
        <input
          type="text"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter currency"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">International Students</label>
        <input
          type="number"
          name="internationalStudents"
          value={formData.internationalStudents}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter number of international students"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Academic Intakes</label>
        <input
          type="text"
          name="academicIntakes"
          value={formData.academicIntakes}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter academic intakes"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Dialing Code</label>
        <select
          name="dialingCode"
          value={formData.dialingCode}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {countryCodes.map((code) => (
            <option key={code.value} value={code.value}>
              {code.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">GDP</label>
        <input
          type="text"
          name="gdp"
          value={formData.gdp}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter GDP"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Overview</label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter country overview"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Work While Studying</label>
        <textarea
          name="workWhileStudying"
          value={formData.workWhileStudying}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter information about working while studying"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Post Study Work Visa</label>
        <textarea
          name="postStudyWorkVisa"
          value={formData.postStudyWorkVisa}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter information about post-study work visa"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Permanent Residency</label>
        <textarea
          name="permanentResidency"
          value={formData.permanentResidency}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px]  placeholder:md:text-[13px]  placeholder:lg:text-[14px]"
          placeholder="Enter permanent residency details"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Scholarships</label>
        <textarea
          name="scholarships"
          value={formData.scholarships}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter scholarship opportunities"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Healthcare Title</label>
        <input
          type="text"
          name="healthcareTitle"
          value={formData.healthcareTitle}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter healthcare title"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Healthcare Description</label>
        <textarea
          name="healthcareDescription"
          value={formData.healthcareDescription}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter healthcare description"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">How It Works</label>
        <textarea
          name="howItWorks"
          value={formData.howItWorks}
          onChange={handleChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[12px] placeholder:md:text-[13px] placeholder:lg:text-[14px]"
          placeholder="Enter how it works"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
        <p> {message && <p>{message}</p>}</p>
      </div>
    </form>
  );
};

export default CountryForm;
