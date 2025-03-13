import { create } from "zustand";

interface ScholarshipState {
    search: string;
    loading: boolean;
    scholarships: any[];
    country: string[];
    programs: string[];
    scholarshipType: string[]; // New state for scholarship type filters
    deadlineFilters: string[]; // New state for deadline filters
    setCountry: (country: string[]) => void;
    setSearch: (search: string) => void;
    setPrograms: (programs: string[]) => void;
    setScholarshipType: (types: string[]) => void; // New setter for scholarship types
    setDeadlineFilters: (deadlines: string[]) => void; // New setter for deadline filters
    setscholarships: (scholarships: any[]) => void;
    fetchscholarships: () => Promise<void>;
}

export const useScholarships = create<ScholarshipState>((set, get) => ({
    scholarships: [],
    loading: true,
    search: "",
    country: [],
    programs: [],
    scholarshipType: [],
    deadlineFilters: [],
    setCountry: (country) => {
        set({ country: Array.isArray(country) ? country : [] });
        get().fetchscholarships();
    },
    setSearch: (search) => {
        set({ search });
        get().fetchscholarships();
    },
    setPrograms: (programs) => {
        set({ programs: Array.isArray(programs) ? programs : [] });
        get().fetchscholarships();
    },
    setScholarshipType: (types) => {
        set({ scholarshipType: Array.isArray(types) ? types : [] });
        get().fetchscholarships();
    },
    setDeadlineFilters: (deadlines) => {
        set({ deadlineFilters: Array.isArray(deadlines) ? deadlines : [] });
        get().fetchscholarships();
    },
    setscholarships: (scholarships) => {
        set({ scholarships });
    },
    fetchscholarships: async () => {
        set({ loading: true });
        try {
            const { search, country, programs, scholarshipType, deadlineFilters } = get();
            const queryParams = new URLSearchParams();
            if (country.length > 0) {
                queryParams.append("countryFilter", country.join(","));
            }
            if (programs.length > 0) {
                queryParams.append("programFilter", programs.join(","));
            }
            if (scholarshipType.length > 0) {
                queryParams.append("scholarshipTypeFilter", scholarshipType.join(","));
            }
            if (deadlineFilters.length > 0) {
                queryParams.append("deadlineFilter", deadlineFilters.join(","));
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
