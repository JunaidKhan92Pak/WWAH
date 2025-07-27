// @/lib/countries.ts
import worldCountries from "world-countries";

export const countries = worldCountries.map((country) => {
  const callingCode =
    country.idd?.root && country.idd?.suffixes?.length
      ? `${country.idd.root}${country.idd.suffixes[0]}`
      : "";
  return {
    id: country.cca3, // Unique 3-letter code
    name: country.name.common,
    code: callingCode,
    flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
  };
});
