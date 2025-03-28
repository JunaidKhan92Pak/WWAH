'use client'
import { useState } from 'react';
export default function Page() {
  const [formData, setFormData] = useState({
    country: '',
    university: '',
    course: {
      name: '',
      location: '',
      courseLevel: '',
      intake: '',
      duration: '',
      startDate: '',
      format: '',
      annualFee: '',
      initialDeposit: '',
      courseOverview: '',
      advancedSpecialization: '',
      careerOpportunity1: '',
      careerOpportunity2: '',
      careerOpportunity3: '',
      careerOpportunity4: '',
      careerOpportunity5: '',
      serverFee: '',
      scholarships: '',
      scholarshipDetailLink: '',
      fundingDetailLink: '',
      ILETSOverallScore: '',
      ILETSMinimumScore: '',
      PTEOverallScore: '',
      PTEMinimumScore: '',
      TOEFLOverallScore: '',
      TOEFLMinimumScore: '',
    },
  });
  const [message, setMessage] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData.course) {
      setFormData((prev) => ({
        ...prev,
        course: { ...prev.course, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData.course);
    try {
      const response = await fetch("/api/addCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        setMessage('Form submitted successfully!');
        setFormData({
          country: '',
          university: '',
          course: {
            name: '',
            location: '',
            courseLevel: '',
            intake: '',
            duration: '',
            startDate: '',
            format: '',
            annualFee: '',
            initialDeposit: '',
            courseOverview: '',
            advancedSpecialization: '',
            careerOpportunity1: '',
            careerOpportunity2: '',
            careerOpportunity3: '',
            careerOpportunity4: '',
            careerOpportunity5: '',
            serverFee: '',
            scholarships: '',
            scholarshipDetailLink: '',
            fundingDetailLink: '',
            ILETSOverallScore: '',
            ILETSMinimumScore: '',
            PTEOverallScore: '',
            PTEMinimumScore: '',
            TOEFLOverallScore: '',
            TOEFLMinimumScore: '',
          },
        });
      } else {
        setMessage('Failed to submit the form.');
      }
    } catch (error) {
      setMessage('An error occurred.');
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Submit Your Data</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Top-level fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <input
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Course-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.course).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                {key.includes('Overview') || key.includes('Specialization') || key.includes('scholarships') ? (
                  <textarea
                    className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                ) : (
                  <input
                    className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-md"
            type="submit"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
