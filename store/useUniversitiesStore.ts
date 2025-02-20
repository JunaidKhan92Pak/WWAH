import { create } from "zustand";

interface UniversitiesState {
    universities: any[];
    countryFilter: string[];
    loading: boolean;
    setUniversities: (universities: any[]) => void;
    setCountryFilter: (countryFilter: string[]) => void;
    fetchUniversities: () => Promise<void>;

}

export const useUniversityStore = create<UniversitiesState>((set, get) => ({
    universities: [],
    countryFilter: [],
    loading: true,
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
            // const { countryFilter, currentPage, } = get();
            // const queryParams = new URLSearchParams({
            //     page: currentPage.toString(),
            //     limit: "8",
            // });
            // if (countryFilter.length > 0) {
            //     queryParams.append("countryFilter", countryFilter.join(","));
            // }
            const res = await fetch(`/api/getUniversities`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const data = await res.json();
            if (data.success && data.universities) {
                get().setUniversities(data.universities);
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
