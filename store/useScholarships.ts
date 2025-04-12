import { create } from "zustand";

interface ScholarshipState {
    search: string;
    loading: boolean;
    scholarships: any[];
    country: string[];
    programs: string[];
    scholarshipType: string[];
    deadlineFilters: string[];
    page: number;
    limit: number;
    totalPages: number;
    minimumRequirements: string[]
    setMinimumRequirements: (requirements: string[]) => void;
    setCountry: (country: string[]) => void;
    setSearch: (search: string) => void;
    setPrograms: (programs: string[]) => void;
    setScholarshipType: (types: string[]) => void;
    setDeadlineFilters: (deadlines: string[]) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setScholarships: (scholarships: any[]) => void;
    setTotalPages: (totalPages: number) => void;
    fetchScholarships: () => Promise<void>;
}

export const useScholarships = create<ScholarshipState>((set, get) => ({
    scholarships: [],
    loading: true,
    search: "",
    country: [],
    programs: [],
    scholarshipType: [],
    deadlineFilters: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    minimumRequirements: [],
    setMinimumRequirements: (requirements) => {
        set({ minimumRequirements: Array.isArray(requirements) ? requirements : [] });
        get().fetchScholarships();
    },
    setCountry: (country) => {
        set({ country: Array.isArray(country) ? country : [] });
        get().fetchScholarships();
    },
    setSearch: (search) => {
        set({ search });
        get().fetchScholarships();
    },
    setPrograms: (programs) => {
        set({ programs: Array.isArray(programs) ? programs : [] });
        get().fetchScholarships();
    },
    setScholarshipType: (types) => {
        set({ scholarshipType: Array.isArray(types) ? types : [] });
        get().fetchScholarships();
    },
    setDeadlineFilters: (deadlines) => {
        set({ deadlineFilters: Array.isArray(deadlines) ? deadlines : [] });
        get().fetchScholarships();
    },
    setPage: (page) => {
        set({ page });
        get().fetchScholarships();
    },
    setLimit: (limit) => {
        set({ limit });
        get().fetchScholarships();
    },
    setScholarships: (scholarships) => {
        set({ scholarships });
    },
    setTotalPages: (totalPages) => {
        set({ totalPages });
    },
    fetchScholarships: async () => {
        set({ loading: true });
        try {
            const { search, country, programs, scholarshipType, minimumRequirements, deadlineFilters, page, limit } = get();
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
            if (minimumRequirements.length > 0) {
                queryParams.append("minimumRequirements", minimumRequirements.join(","));
            }
            if (search) queryParams.append("search", search);
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());
            const res = await fetch(`/api/getScholarships?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const data = await res.json();
            console.log(data.scholarships);
            if (data.success) {
                set({ scholarships: data.scholarships });
                set({ totalPages: data.totalPages });
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
