import { create } from "zustand";
interface CountryState {
  search: string;
  loading: boolean;
  countries: any[];
  setSearch: (search: string) => void;
  setCountries: (countries: any[]) => void;
  fetchCountries: () => Promise<void>;
}
export const useCountry = create<CountryState>((set, get) => ({
  countries: [],
  loading: true,
  search: "",
  setSearch: (search) => {
    set({ search });
    get().fetchCountries(); // Fetch courses when search changes
  },
  setCountries: (countries) => {
    set({ countries });
  },
  fetchCountries: async () => {
    set({ loading: true });
    try {
      const { search } = get();
      const queryParams = new URLSearchParams({
        // page: currentPage.toString(),
        // limit: "12",
      });
      // if (country.length > 0) {
      //     queryParams.append("country", country.join(","));
      // }
      if (search) queryParams.append("search", search);
      const res = await fetch(`/api/getCountries?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      console.log(data, "vf");
      if (data.success) {
        set({ countries: data.country });
      } else {
        console.error("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
