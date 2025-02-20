// "use client";

// import React, { useState } from "react";
// const UniversityForm: React.FC = () => {
//   const [message, setMessage] = useState("");
//   const [formData, setFormData] = useState({
//     country: "",
//     name: "",
//     location: "",
//     establishmentYear: "",
//     nationalStudents: "",
//     internationalStudents: "",
//     acceptanceRate: "",
//     distanceFromCity: "",
//     ukRanking: "",
//     qsRanking: "",
//     timesRanking: "",
//     overview: "",
//     history: "",
//     originsAndEstablishment: "",
//     mission: "",
//     values: "",
//     sportsAndRecreation: "",
//     accommodation: "",
//     transportation: "",
//     studentServices: "",
//     culturalDiversity: "",
//     alumniNetwork: "",
//     historyAndHeritage: "",
//     foodAndCafe: "",
//     famousPlacesToVisit: "",
//     culturalDiversitycampuslife: "",
//     transportationcampuslife: "",
//     youtubeLink: "",
//     virtualTour: "",
//     ranking1: "",
//     ranking2: "",
//     ranking3: "",
//     ranking4: "",
//     alumini1: "",
//     alumini1job: "",
//     alumini2: "",
//     alumini2job: "",
//     alumini3: "",
//     alumini3job: "",
//     alumini4: "",
//     alumini4job: "",
//     alumini5: "",
//     alumini5job: "",
//     achievement1: "",
//     achievement2: "",
//     achievement3: "",
//     achievement4: "",
//     achievement5: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/addUniversity", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setMessage("Form submitted successfully!");
//         setFormData({
//           country: "",
//           name: "",
//           location: "",
//           establishmentYear: "",
//           nationalStudents: "",
//           internationalStudents: "",
//           acceptanceRate: "",
//           distanceFromCity: "",
//           ukRanking: "",
//           qsRanking: "",
//           timesRanking: "",
//           overview: "",
//           history: "",
//           originsAndEstablishment: "",
//           mission: "",
//           values: "",
//           sportsAndRecreation: "",
//           accommodation: "",
//           transportation: "",
//           studentServices: "",
//           culturalDiversity: "",
//           alumniNetwork: "",
//           historyAndHeritage: "",
//           foodAndCafe: "",
//           famousPlacesToVisit: "",
//           culturalDiversitycampuslife: "",
//           transportationcampuslife: "",
//           youtubeLink: "",
//           virtualTour: "",
//           ranking1: "",
//           ranking2: "",
//           ranking3: "",
//           ranking4: "",
//           alumini1: "",
//           alumini1job: "",
//           alumini2: "",
//           alumini2job: "",
//           alumini3: "",
//           alumini3job: "",
//           alumini4: "",
//           alumini4job: "",
//           alumini5: "",
//           alumini5job: "",
//           achievement1: "",
//           achievement2: "",
//           achievement3: "",
//           achievement4: "",
//           achievement5: "",
//         }); // Clear form
//       } else {
//         setMessage("Failed to submit the form.");
//       }
//     } catch (error) {
//       setMessage("An error occurred.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
//       <h1 className="text-2xl font-bold mb-4">University Information Form</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <label htmlFor="country">Country:</label>
//         <input
//           className="w-full p-2 border rounded"
//           type="text"
//           id="country"
//           name="country"
//           placeholder="Country Name"
//           value={formData.country}
//           onChange={handleChange}
//           required
//         />

//         <label htmlFor="name">University Name:</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           placeholder="University Name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <label htmlFor="location">Location:</label>
//         <input
//           type="text"
//           id="location"
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <label htmlFor="youtubeLink">YouTube Video Link:</label>
//         <input
//           type="text"
//           id="youtubeLink"
//           name="youtubeLink"
//           placeholder="YouTube Video Link"
//           value={formData.youtubeLink}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="virtualTour">Virtual Tour Link:</label>
//         <input
//           type="text"
//           id="virtualTour"
//           name="virtualTour"
//           placeholder="Virtual Tour Link"
//           value={formData.virtualTour}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="establishmentYear">Establishment Year:</label>
//         <input
//           type="text"
//           id="establishmentYear"
//           name="establishmentYear"
//           placeholder="Establishment Year"
//           value={formData.establishmentYear}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <label htmlFor="nationalStudents">National Students:</label>
//         <input
//           type="text"
//           id="nationalStudents"
//           name="nationalStudents"
//           placeholder="National Students"
//           value={formData.nationalStudents}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="internationalStudents">International Students:</label>
//         <input
//           type="text"
//           id="internationalStudents"
//           name="internationalStudents"
//           placeholder="International Students"
//           value={formData.internationalStudents}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="acceptanceRate">Acceptance Rate (%):</label>
//         <input
//           type="text"
//           id="acceptanceRate"
//           name="acceptanceRate"
//           placeholder="Acceptance Rate (%)"
//           value={formData.acceptanceRate}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="distanceFromCity">Distance from City (km):</label>
//         <input
//           type="text"
//           id="distanceFromCity"
//           name="distanceFromCity"
//           placeholder="Distance from City (km)"
//           value={formData.distanceFromCity}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="ukRanking">UK University Ranking:</label>
//         <input
//           type="text"
//           id="ukRanking"
//           name="ukRanking"
//           placeholder="UK University Ranking"
//           value={formData.ukRanking}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="qsRanking">QS World University Ranking:</label>
//         <input
//           type="text"
//           id="qsRanking"
//           name="qsRanking"
//           placeholder="QS World University Ranking"
//           value={formData.qsRanking}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="timesRanking">Times Higher Education Ranking:</label>
//         <input
//           type="text"
//           id="timesRanking"
//           name="timesRanking"
//           placeholder="Times Higher Education Ranking"
//           value={formData.timesRanking}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="overview">Overview:</label>
//         <textarea
//           id="overview"
//           name="overview"
//           placeholder="Overview"
//           value={formData.overview}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         ></textarea>

//         <label htmlFor="history">History:</label>
//         <textarea
//           id="history"
//           name="history"
//           placeholder="History"
//           value={formData.history}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         ></textarea>

//         <label htmlFor="originsAndEstablishment">
//           Origins and Establishment:
//         </label>
//         <input
//           type="text"
//           id="originsAndEstablishment"
//           name="originsAndEstablishment"
//           placeholder="Origins and Establishment"
//           value={formData.originsAndEstablishment}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <label htmlFor="mission">Mission:</label>
//         <textarea
//           id="mission"
//           name="mission"
//           placeholder="Mission"
//           value={formData.mission}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         ></textarea>

//         <label htmlFor="values">Values:</label>
//         <textarea
//           id="values"
//           name="values"
//           placeholder="Values"
//           value={formData.values}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         ></textarea>

//         <input
//           type="text"
//           name="ranking1"
//           placeholder="ranking 1"
//           value={formData.ranking1}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="ranking2"
//           placeholder="ranking 2"
//           value={formData.ranking2}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="ranking3"
//           placeholder="ranking 3"
//           value={formData.ranking3}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="ranking4"
//           placeholder="ranking 4"
//           value={formData.ranking4}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini1"
//           placeholder="alumini 1"
//           value={formData.alumini1}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini1job"
//           placeholder="alumini 1 profession"
//           value={formData.alumini1job}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini2"
//           placeholder="alumini 2"
//           value={formData.alumini2}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini2job"
//           placeholder="alumini 2 profession"
//           value={formData.alumini2job}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini3"
//           placeholder="alumini 3"
//           value={formData.alumini3}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini3job"
//           placeholder="alumini 3 profession"
//           value={formData.alumini3job}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini4"
//           placeholder="alumini 4"
//           value={formData.alumini4}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini4job"
//           placeholder="alumini 4 profession"
//           value={formData.alumini4job}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini5"
//           placeholder="alumini 5"
//           value={formData.alumini5}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="alumini5job"
//           placeholder="alumini 5 profession"
//           value={formData.alumini5job}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="achievement1"
//           placeholder="achievement 1"
//           value={formData.achievement1}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="achievement2"
//           placeholder="achievement 2"
//           value={formData.achievement2}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="achievement3"
//           placeholder="achievement 3"
//           value={formData.achievement3}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="achievement4"
//           placeholder="achievement 4"
//           value={formData.achievement4}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="achievement5"
//           placeholder="achievement 5"
//           value={formData.achievement5}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="sportsAndRecreation"
//           placeholder="Sports and Recreation"
//           value={formData.sportsAndRecreation}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="accommodation"
//           placeholder="Accommodation"
//           value={formData.accommodation}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="transportationcampuslife"
//           placeholder="Transportation campus life"
//           value={formData.transportationcampuslife}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="studentServices"
//           placeholder="Student Services"
//           value={formData.studentServices}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="culturalDiversitycampuslife"
//           placeholder="Cultural Diversity campus life"
//           value={formData.culturalDiversitycampuslife}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="alumniNetwork"
//           placeholder="Alumni Network & Support"
//           value={formData.alumniNetwork}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="historyAndHeritage"
//           placeholder="History and Heritage"
//           value={formData.historyAndHeritage}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="foodAndCafe"
//           placeholder="Food and Cafe"
//           value={formData.foodAndCafe}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="famousPlacesToVisit"
//           placeholder="Famous Places to Visit"
//           value={formData.famousPlacesToVisit}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="culturalDiversity"
//           placeholder="Cultural Diversity "
//           value={formData.culturalDiversity}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="transportation"
//           placeholder="Transportation"
//           value={formData.transportation}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         {message && <p>{message}</p>}
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UniversityForm;

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h3 className="font-bold text-center mb-6">University Information Form</h3>
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
















