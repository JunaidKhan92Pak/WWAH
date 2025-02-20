import { create } from "zustand";

interface CourseState {
    courses: any[];
    search: string;
    countryFilter: string[];
    sortOrder: "asc" | "desc" | "";
    minPrice: string;
    maxPrice: string;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    studyLevel: string;
    intakeYear: string;
    studyMode: string;
    universities: any[];
    selectedUniversity: string;
    minBudget: number | null;
    maxBudget: number | null;
    // selectedRange: string;
    setMinBudget: (value: number | null) => void;
    setMaxBudget: (value: number | null) => void;
    // setSelectedRange: (value: string) => void;
    setSelectedUniversity: (uni: string) => void;
    setIntakeYear: (year: string) => void;
    setStudyMode: (mode: string) => void;
    setCourses: (courses: any[]) => void;
    setSearch: (search: string) => void;
    setCountryFilter: (countryFilter: string[]) => void;
    setSortOrder: (order: "asc" | "desc" | "") => void;
    setPriceRange: (min: string, max: string) => void;
    setPage: (page: number) => void;
    setStudyLevel: (level: string) => void;
    fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],
    countryFilter: [],
    universities: [],
    selectedUniversity: "",
    search: "",
    studyLevel: "",
    sortOrder: "",
    minPrice: "",
    maxPrice: "",
    currentPage: 1,
    totalPages: 1,
    loading: true, // Fixed initial loading state
    intakeYear: "",
    studyMode: "",
    minBudget: null,
    maxBudget: null,
    // selectedRange: "",
    setMinBudget: (value) => {
        console.log(value, "MIn");
        set({ minBudget: value })
        get().fetchCourses();
    },
    setMaxBudget: (value) => {
        console.log(value, "Max");
        set({ maxBudget: value })
        get().fetchCourses();
    },
    // setSelectedRange: (value) => {
    //     console.log(value, "total");
    //     set({ selectedRange: value })
    //     get().fetchCourses();
    // },
    setSelectedUniversity(uni) {
        set({ selectedUniversity: uni })
        get().fetchCourses();
    },
    setStudyMode: (mode) => {
        set({ studyMode: mode });
        // console.log(mode, "mode");
        get().fetchCourses(); //  Fetch courses when intake year changes
    },
    setIntakeYear: (year) => {
        set({ intakeYear: year });
        get().fetchCourses(); //  Fetch courses when intake year changes
    },
    setCourses: (courses) => set({ courses }),
    setSearch: (search) => {
        set({ search });
        get().fetchCourses(); // Fetch courses when search changes
    },
    setCountryFilter: (countryFilter) => {
        set({ countryFilter: Array.isArray(countryFilter) ? countryFilter : [] });
        get().fetchCourses(); // Fetch courses when country filter changes
    },
    setStudyLevel: (level) => {
        set({ studyLevel: level === get().studyLevel ? "" : level });
        get().fetchCourses();
    },
    setSortOrder: (order) => {
        set({ sortOrder: order });
        get().fetchCourses(); // Fetch courses when sort order changes
    },
    setPriceRange: (min, max) => {
        set({ minPrice: min, maxPrice: max });
        get().fetchCourses(); // Fetch courses when price range changes
    },
    setPage: (page) => {
        set({ currentPage: page });
        get().fetchCourses(); // Fetch courses when pagination changes
    },
    fetchCourses: async () => {
        set({ loading: true });
        try {
            const { minBudget, maxBudget, search, sortOrder, currentPage, intakeYear, countryFilter, studyLevel, studyMode, selectedUniversity } = get();
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: "12",
            });
            if (search) queryParams.append("search", search);

            if (sortOrder) queryParams.append("sortOrder", sortOrder);
            if (intakeYear) queryParams.append("intakeYear", intakeYear);
            if (studyMode) queryParams.append("studyMode", studyMode)
            if (studyLevel) queryParams.append("studyLevel", studyLevel);
            if (minBudget !== null) queryParams.append("minBudget", minBudget.toString());
            if (maxBudget !== null) queryParams.append("maxBudget", maxBudget.toString());
            if (selectedUniversity) queryParams.append("selectedUniversity", selectedUniversity) //  Apply filter if selected
            // if (uni) queryParams.append("uni", uni);
            // if (subject) queryParams.append("subject", subject);
            // if (level) queryParams.append("level", level);
            // if (searchCourse) queryParams.append("searchCourse", searchCourse);
            if (countryFilter.length > 0) {
                queryParams.append("countryFilter", countryFilter.join(","));
            }
            console.log(search, "ok");

            const res = await fetch(`/api/getCourses?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const data = await res.json();
            if (data.success) {
                set({ courses: data.courses, totalPages: data.totalPages });
            } else {
                console.error("Unexpected API response:", data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            set({ loading: false });
        }
    },

}));
