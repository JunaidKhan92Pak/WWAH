import { create } from "zustand";

interface Expense {
    university_name: string;
    lifestyles: any[];
}

interface ExpenseStore {
    expenses: Expense[] | null;
    loading: boolean;
    error: string | null;
    university: string;
    setUniversity: (university: string) => void;
    fetchExpenses: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
    expenses: null,
    loading: false,
    error: null,
    university: "",

    setUniversity: (university) => {
        console.log(university, "university")
        set({ university })
    },
    // Set the filters dynamically

    // Fetch expenses based on query parameters stored in Zustand
    fetchExpenses: async () => {
        const { university } = get();

        // Ensure both filters are set before fetching
        if (!university) {
            set({ expenses: null, error: "Please select country and university." });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch(
                `/api/getExpense?university=${encodeURIComponent(university)}`
            );

            if (!response.ok) throw new Error(`Failed to fetch expenses`);

            const data = await response.json();


            set({ expenses: data, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },
}));
