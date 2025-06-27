import React, { useState } from 'react';

const citiesByCountry: { [key: string]: string[] } = {
  UK: ['London', 'Manchester', 'Bristol'],
  'United States': ['New York', 'Los Angeles', 'Chicago'],
  China: ['Beijing', 'Shanghai', 'Shenzhen'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane'],
  Italy: ['Rome', 'Milan', 'Florence'],
  Canada: ['Toronto', 'Vancouver', 'Montreal'],
  Germany: ['Berlin', 'Munich', 'Hamburg'],
  France: ['Paris', 'Lyon', 'Marseille'],
  Denmark: ['Copenhagen', 'Aarhus', 'Odense'],
  Ireland: ['Dublin', 'Cork', 'Galway'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch'],
  Malaysia: ['Kuala Lumpur', 'Penang', 'Johor Bahru'],
};

const CityFilter: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [customCity, setCustomCity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCountry(value);
    setSelectedCities(new Set()); // Reset cities selection
    if (value === 'All') {
      setCustomCity('');
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCities((prevCities) => {
      const newCities = new Set(prevCities);
      if (newCities.has(city)) {
        newCities.delete(city);
      } else {
        newCities.add(city);
      }
      return newCities;
    });
  };

  const handleCustomCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCity(event.target.value);
  };

  const filteredCities = selectedCountry === 'All'
    ? [] // No predefined cities for "All"
    : citiesByCountry[selectedCountry].filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="city-filter">
      <label htmlFor="country-select" className="block text-lg mb-2">Select Study Destination</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={handleCountryChange}
        className="p-2 border border-gray-300 rounded-md mb-4"
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

      {selectedCountry !== 'All' && (
        <div className="search-cities mb-4">
          <input
            type="text"
            placeholder="Search Cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      )}

      {selectedCountry !== 'All' && (
        <div className="cities-checkbox-list mb-4">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div key={city} className="flex items-center">
                <input
                  type="checkbox"
                  id={city}
                  checked={selectedCities.has(city)}
                  onChange={() => handleCityChange(city)}
                  className="mr-2"
                />
                <label htmlFor={city}>{city}</label>
              </div>
            ))
          ) : (
            <p>No cities match your search.</p>
          )}
        </div>
      )}

      {selectedCountry === 'All' && (
        <div className="custom-city-input">
          <label htmlFor="custom-city" className="block text-lg mb-2">Enter Your Custom City</label>
          <input
            id="custom-city"
            type="text"
            value={customCity}
            onChange={handleCustomCityChange}
            placeholder="Enter a city"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-bold text-lg">Selected Cities:</h3>
        {selectedCountry === 'All'
          ? customCity || 'None'
          : Array.from(selectedCities).join(', ') || 'None'}
      </div>
    </div>
  );
};

export default CityFilter;
