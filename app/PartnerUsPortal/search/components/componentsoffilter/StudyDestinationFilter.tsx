import React, { useState } from 'react';

const StudyDestinationFilter: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [customCountry, setCustomCountry] = useState<string>('');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCountry(value);
    if (value === 'All') {
      setCustomCountry('');
    }
  };

  const handleCustomCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCountry(event.target.value);
  };

  return (
    <div className="study-destination-filter">
      <label htmlFor="country-select" className="block text-lg mb-2">Select Study Destination</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={handleCountryChange}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="All">All</option>
        <option value="UK">UK</option>
        <option value="United States">United States</option>
        <option value="China">China</option>
        <option value="Australia">Australia</option>
        <option value="Italy">Italy</option>
        <option value="Canada">Canada</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
        <option value="Denmark">Denmark</option>
        <option value="Ireland">Ireland</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Malaysia">Malaysia</option>
      </select>

      {selectedCountry === 'All' && (
        <div className="custom-country-input mt-4">
          <label htmlFor="custom-country" className="block text-lg mb-2">Enter Your Custom Study Destination</label>
          <input
            id="custom-country"
            type="text"
            value={customCountry}
            onChange={handleCustomCountryChange}
            placeholder="Enter a country"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-bold text-lg">Selected Country: {selectedCountry === 'All' ? customCountry || 'None' : selectedCountry}</h3>
      </div>
    </div>
  );
};

export default StudyDestinationFilter;
