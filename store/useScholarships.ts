import { create } from "zustand";
interface ScholarshipState {
    search: string;
    loading: boolean;
    scholarships: any[];
    country: string[];
    setCountry: (country: string[]) => void;
    setSearch: (search: string) => void;
    setscholarships: (scholarships: any[]) => void;
    fetchscholarships: () => Promise<void>;
}
export const useScholarships = create<ScholarshipState>((set, get) => ({
    scholarships: [],
    loading: true,
    search: "",
    country: [],
    setCountry: (country) => {
        set({ country: Array.isArray(country) ? country : [] });
        get().fetchscholarships();
    },
    setSearch: (search) => {
        set({ search });
        get().fetchscholarships(); // Fetch courses when search changes
    },
    setscholarships: (scholarships) => {
        set({ scholarships });
    },
    fetchscholarships: async () => {
        set({ loading: true });
        try {
            const { search, country } = get();
            const queryParams = new URLSearchParams({
                // page: currentPage.toString(),
                // limit: "12",
            });
            // if (country.length > 0) {
            //     queryParams.append("country", country.join(","));
            // }
            if (country.length > 0) {
                queryParams.append("countryFilter", country.join(","));
            }
            if (search) queryParams.append("search", search);
            const res = await fetch(`/api/getScholarships?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const data = await res.json();
            console.log(data.scholarships);

            if (data.success) {
                set({ scholarships: data.scholarships });
            } else {
                console.error("Unexpected API response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching scholarships:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
