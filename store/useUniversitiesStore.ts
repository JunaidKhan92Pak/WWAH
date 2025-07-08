import { create } from "zustand";

interface UniversitiesState {
    universities: any[];
    filterUniversities: any[]; // NEW: used only by filter dropdown
    country: string[];
    search: string;
    loading: boolean;
    currentPage: number;
    totalPages: number;
    limit: number;
    setSearch: (search: string) => void;
    setUniversities: (universities: any[]) => void;
    setCountry: (country: string[]) => void;
    setCurrentPage: (page: number) => void;
    setLimit: (limit: number) => void;
    fetchUniversities: (page?: number, limitOverride?: number) => Promise<void>;
    fetchAllUniversitiesForFilter: (page?: number, limitOverride?: number) => Promise<void>;
}

export const useUniversityStore = create<UniversitiesState>((set, get) => ({
    universities: [],
    filterUniversities: [], // NEW: used only by filter dropdown
    country: [],
    search: "",
    loading: true,
    currentPage: 1,
    totalPages: 1,
    limit: 12, // default limit

    // When the search changes, update the state, reset page, and fetch data
    setSearch: (search) => {
        set({ search, currentPage: 1 });
        // Use the store's default limit
        get().fetchUniversities(1);
    },

    setUniversities: (universities) => {
        set({ universities });
    },

    // When country filter changes, update state, reset page, and fetch data
    setCountry: (country) => {
        set({ country: Array.isArray(country) ? country : [], currentPage: 1 });
        get().fetchUniversities(1);
    },

    // Update current page and fetch data for that page
    setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchUniversities(page);
    },

    // Set a new default limit
    setLimit: (limit) => {
        set({ limit });
    },

    // Fetch universities with optional pagination and limit override.
    // If limitOverride is provided, it will be used instead of the store default.
    fetchUniversities: async (page = 1, limitOverride?: number) => {
        set({ loading: true });
        try {
            const { search, country } = get();
            const usedLimit = limitOverride ?? get().limit;
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: usedLimit.toString(),
            });
            if (country.length > 0) {
                queryParams.append("country", country.join(","));
            }
            if (search) {
                queryParams.append("search", search);
            }

            const res = await fetch(`/api/getUniversities?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

            const data = await res.json();
            if (data.success && data.universities) {
                set({ universities: data.universities, totalPages: data.totalPages || 1 });
            } else {
                console.error("Unexpected API response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching universities:", error);
        } finally {
            set({ loading: false });
        }
    },
    fetchAllUniversitiesForFilter: async () => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/getUniversities?all=true`);
            const data = await res.json();
            if (data.success && data.universities) {
                set({ filterUniversities: data.universities }); // 👈 store separately
            }
        } catch (error) {
            console.error("Error fetching universities for filter:", error);
        } finally {
            set({ loading: false });
        }
    }

}));
