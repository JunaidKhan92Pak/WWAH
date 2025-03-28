"use client";
import { useState } from "react";
export default function Home() {
  const [formData, setFormData] = useState({
    countryname: "",
    description: "",
    capital: "",
    language: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          countryname: "",
          description: "",
          capital: "",
          language: "",
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
    <div style={{ padding: "20px" }}>
      <h1>Submit Your Data</h1>
      <form onSubmit={handleSubmit} className="p-2 flex items-center gap-2">
        <div className="p-2">
          <label htmlFor="country">country Name:</label>
          <input
            className="border-2 p-2"
            type="text"
            id="country"
            name="countryname"
            value={formData.countryname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="p-2">
          <label htmlFor="description">Description:</label>
          <input
            className="border-2 p-2"
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="p-2">
          <label htmlFor="capital">Capital:</label>
          <input
            className="border-2 p-2"
            type="text"
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
            required
          />
        </div>
        <div className="">
          <label className="" htmlFor="language">
            Language:
          </label>
          <input
            className="border-2 p-2"
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className=" bg-blue-800 p-2 text-[16px] text-white"
          type="submit"
        >
          Add University
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
