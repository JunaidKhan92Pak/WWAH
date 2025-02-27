import { create } from "zustand";

interface CourseState {
    courses: any[];
    search: string;
    countryFilter: string[];
    subjectAreaFilter: string[];
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
    setMinBudget: (value: number | null) => void;
    setMaxBudget: (value: number | null) => void;
    setSelectedUniversity: (uni: string) => void;
    setIntakeYear: (year: string) => void;
    setStudyMode: (mode: string) => void;
    setCourses: (courses: any[]) => void;
    setSearch: (search: string) => void;
    setCountryFilter: (countryFilter: string[]) => void;
    setSubjectAreaFilter: (subjectAreaFilter: string[]) => void;
    setSortOrder: (order: "asc" | "desc" | "") => void;
    setPriceRange: (min: string, max: string) => void;
    setPage: (page: number) => void;
    setStudyLevel: (level: string) => void;
    fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],
    countryFilter: [],
    subjectAreaFilter: [],
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

    setMinBudget: (value) => {
        console.log(value, "Min");
        set({ minBudget: value });
        get().fetchCourses();
    },
    setMaxBudget: (value) => {
        console.log(value, "Max");
        set({ maxBudget: value });
        get().fetchCourses();
    },
    setSelectedUniversity(uni) {
        set({ selectedUniversity: uni });
        get().fetchCourses();
    },
    setStudyMode: (mode) => {
        set({ studyMode: mode });
        get().fetchCourses();
    },
    setIntakeYear: (year) => {
        set({ intakeYear: year });
        get().fetchCourses();
    },
    setCourses: (courses) => set({ courses }),
    setSearch: (search) => {
        set({ search });
        get().fetchCourses();
    },
    setCountryFilter: (countryFilter) => {
        set({ countryFilter: Array.isArray(countryFilter) ? countryFilter : [] });
        get().fetchCourses();
    },
    // New setter for Subject Area filter
    setSubjectAreaFilter: (subjectAreaFilter) => {
        set({ subjectAreaFilter: Array.isArray(subjectAreaFilter) ? subjectAreaFilter : [] });
        get().fetchCourses();
    },
    setStudyLevel: (level) => {
        set({ studyLevel: level === get().studyLevel ? "" : level });
        get().fetchCourses();
    },
    setSortOrder: (order) => {
        set({ sortOrder: order });
        get().fetchCourses();
    },
    setPriceRange: (min, max) => {
        set({ minPrice: min, maxPrice: max });
        get().fetchCourses();
    },
    setPage: (page) => {
        set({ currentPage: page });
        get().fetchCourses();
    },
    fetchCourses: async () => {
        set({ loading: true });
        try {
            const {
                minBudget,
                maxBudget,
                search,
                sortOrder,
                currentPage,
                intakeYear,
                countryFilter,
                subjectAreaFilter,
                studyLevel,
                studyMode,
                selectedUniversity,
            } = get();

            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: "12",
            });
            if (search) queryParams.append("search", search);
            if (sortOrder) queryParams.append("sortOrder", sortOrder);
            if (intakeYear) queryParams.append("intakeYear", intakeYear);
            if (studyMode) queryParams.append("studyMode", studyMode);
            if (studyLevel) queryParams.append("studyLevel", studyLevel);
            if (minBudget !== null && minBudget > 0)
                queryParams.append("minBudget", minBudget.toString());
            if (maxBudget !== null && maxBudget > 0)
                queryParams.append("maxBudget", maxBudget.toString());
            if (selectedUniversity)
                queryParams.append("selectedUniversity", selectedUniversity);
            if (countryFilter.length > 0) {
                queryParams.append("countryFilter", countryFilter.join(","));
            }
            // Append subject area filter if any are selected
            if (subjectAreaFilter.length > 0) {
                queryParams.append("subjectAreaFilter", subjectAreaFilter.join(","));
            }

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
