import { create } from "zustand";

interface UniversitiesState {
    universities: any[];
    countryFilter: string[];
    search: string;
    loading: boolean;
    setSearch: (search: string) => void;
    setUniversities: (universities: any[]) => void;
    setCountryFilter: (countryFilter: string[]) => void;
    fetchUniversities: () => Promise<void>;

}

export const useUniversityStore = create<UniversitiesState>((set, get) => ({
    universities: [],
    countryFilter: [],
    loading: true,
    search: "",
    setSearch: (search) => {
        set({ search });
        get().fetchUniversities(); // Fetch courses when search changes
    },
    setUniversities: (universities) => {
        set({ universities })
        // console.log(universities, "Uni");
    },
    setCountryFilter: (countryFilter) => {
        set({ countryFilter: Array.isArray(countryFilter) ? countryFilter : [] });
        get().fetchUniversities(); // Fetch courses when country filter changes
    },
    fetchUniversities: async () => {
        set({ loading: true });
        try {
            const { search, countryFilter } = get();
            const queryParams = new URLSearchParams({
                // page: currentPage.toString(),
                // limit: "12",
            });
            // const { countryFilter, currentPage, } = get();
            // const queryParams = new URLSearchParams({
            //     page: currentPage.toString(),
            //     limit: "8",
            // });
            if (countryFilter.length > 0) {
                queryParams.append("countryFilter", countryFilter.join(","));
            }
            if (search) queryParams.append("search", search);
            const res = await fetch(`/api/getUniversities?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const data = await res.json();
            if (data.success && data.universities) {
                set({ universities: data.universities });
            } else {
                console.error("Unexpected API response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
        finally {
            set({ loading: false });
        }
    },
}));
