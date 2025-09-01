import { Country, State, City } from "country-state-city";

export interface CityData {
  name: string;
  countryCode: string;
  stateCode?: string;
  latitude?: string;
  longitude?: string;
}

export const getCitiesByCountry = (countryName: string): CityData[] => {
  try {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      console.log(`Country not found: ${countryName}`);
      return [];
    }

    const cities = City.getCitiesOfCountry(country.isoCode) || [];

    return cities.map((city) => ({
      name: city.name,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
      latitude: city.latitude ?? undefined,
      longitude: city.longitude ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching cities for country:", countryName, error);
    return [];
  }
};

export const getCitiesByCountryAndState = (
  countryName: string,
  stateName?: string
): CityData[] => {
  try {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) return [];

    if (stateName) {
      const state = State.getStatesOfCountry(country.isoCode)?.find(
        (s) => s.name.toLowerCase() === stateName.toLowerCase()
      );

      if (state) {
        const cities =
          City.getCitiesOfState(country.isoCode, state.isoCode) || [];
        return cities.map((city) => ({
          name: city.name,
          countryCode: city.countryCode,
          stateCode: city.stateCode,
          latitude: city.latitude ?? undefined,
          longitude: city.longitude ?? undefined,
        }));
      }
    }

    return getCitiesByCountry(countryName);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const getTopCitiesByCountry = (
  countryName: string,
  limit: number = 50
): CityData[] => {
  const allCities = getCitiesByCountry(countryName);
  return allCities.sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit);
};

export const searchCitiesInCountry = (
  countryName: string,
  searchTerm: string
): CityData[] => {
  const allCities = getCitiesByCountry(countryName);

  return allCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getStatesByCountry = (countryName: string) => {
  try {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    return country ? State.getStatesOfCountry(country.isoCode) || [] : [];
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

