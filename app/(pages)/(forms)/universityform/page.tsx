// "use client";
// import { useState } from "react";
// export default function Home() {
//   const [formData, setFormData] = useState({
//     universityname: "",
//     location: "",
//     establishmentyear: "",
//     nationalstudents: "",
//   });
//   const [message, setMessage] = useState("");
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     // try {
//     //   const response = await fetch("/api/submit", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify(formData),
//     //   });

//     //   if (response.ok) {
//     //     setMessage("Form submitted successfully!");
//     //     setFormData({
//     //       universityname: "",
//     //       location: "",
//     //       establishmentyear: "",
//     //       nationalstudents: "",
//     //     }); // Clear form
//     //   } else {
//     //     setMessage("Failed to submit the form.");
//     //   }
//     // } catch (error) {
//     //   setMessage("An error occurred.");
//     //   console.error(error);
//     // }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Submit Your Data</h1>
//       <form onSubmit={handleSubmit} className="p-2 flex items-center gap-2">
//         <div className="p-2">
//           <label htmlFor="university">University Name:</label>
//           <input
//             className="border-2 p-2"
//             type="text"
//             id="university"
//             name="universityname"
//             value={formData.universityname}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="p-2">
//           <label htmlFor="location">location:</label>
//           <input
//             className="border-2 p-2"
//             type="text"
//             id="location"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="p-2">
//           <label htmlFor="establishmentyear">Establishment year:</label>
//           <input
//             className="border-2 p-2"
//             type="text"
//             id="establishmentyear"
//             name="establishmentyear"
//             value={formData.establishmentyear}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="">
//           <label className="" htmlFor="nationalstudents">
//             National Students:
//           </label>
//           <input
//             className="border-2 p-2"
//             type="text"
//             id="nationalstudents"
//             name="nationalstudents"
//             value={formData.nationalstudents}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button
//           className=" bg-blue-800 p-2 text-[16px] text-white"
//           type="submit"
//         >
//           Add University
//         </button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }
'use client'
import { useState } from 'react';
export default function UniversityForm() {
  const [formData, setFormData] = useState({
    country: "",
    university: {
      name: "",
      location: "",
      establishmentYear: "",
      nationalStudents: "",
      internationalStudents: "",
      acceptanceRate: "",
      distanceFromCity: "",
      ukRanking: "",
      qsRanking: "",
      timesRanking: "",
      overview: "",
      history: "",
      originsAndEstablishment: "",
      mission: "",
      values: "",
      sportsAndRecreation: "",
      accommodation: "",
      transportation: "",
      studentServices: "",
      culturalDiversity: "",
      alumniNetwork: "",
      historyAndHeritage: "",
      foodAndCafe: "",
      famousPlacesToVisit: "",
      culturalDiversitycampuslife: "",
      transportationcampuslife: "",
      youtubeLink: "",
      virtualTour: "",
      ranking1: "",
      ranking2: "",
      ranking3: "",
      ranking4: "",
      alumini1: "",
      alumini1job: "",
      alumini2: "",
      alumini2job: "",
      alumini3: "",
      alumini3job: "",
      alumini4: "",
      alumini4job: "",
      alumini5: "",
      alumini5job: "",
      achievement1: "",
      achievement2: "",
      achievement3: "",
      achievement4: "",
      achievement5: "",
    },
  });
  const [message, setMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData.university) {
      setFormData((prev) => ({
        ...prev,
        university: { ...prev.university, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addUniversity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage("Form submitted successfully!");
        setFormData({
          country: "",
          university: {
            name: "",
            location: "",
            establishmentYear: "",
            nationalStudents: "",
            internationalStudents: "",
            acceptanceRate: "",
            distanceFromCity: "",
            ukRanking: "",
            qsRanking: "",
            timesRanking: "",
            overview: "",
            history: "",
            originsAndEstablishment: "",
            mission: "",
            values: "",
            sportsAndRecreation: "",
            accommodation: "",
            transportation: "",
            studentServices: "",
            culturalDiversity: "",
            alumniNetwork: "",
            historyAndHeritage: "",
            foodAndCafe: "",
            famousPlacesToVisit: "",
            culturalDiversitycampuslife: "",
            transportationcampuslife: "",
            youtubeLink: "",
            virtualTour: "",
            ranking1: "",
            ranking2: "",
            ranking3: "",
            ranking4: "",
            alumini1: "",
            alumini1job: "",
            alumini2: "",
            alumini2job: "",
            alumini3: "",
            alumini3job: "",
            alumini4: "",
            alumini4job: "",
            alumini5: "",
            alumini5job: "",
            achievement1: "",
            achievement2: "",
            achievement3: "",
            achievement4: "",
            achievement5: "",
          },
        });
      } else {
        setMessage("Failed to submit the form.");
      }
    } catch (error) {
      setMessage("An error occurred.");
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">University Information Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top-level Fields */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {/* University Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.university).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </label>
                {key.includes("overview") ||
                key.includes("history") ||
                key.includes("mission") ||
                key.includes("values") ? (
                  <textarea
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
















