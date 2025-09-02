// hooks/useSimpleFormPersistence.ts - UPDATED VERSION WITH localStorage
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { debounce } from 'lodash';

interface UseSimpleFormPersistenceOptions {
    key: string;
    form: UseFormReturn<any>;
    debounceMs?: number;
}

export const useSimpleFormPersistence = ({
    key,
    form,
    debounceMs = 1000,
}: UseSimpleFormPersistenceOptions) => {
    const isInitialized = useRef(false);
    
    // Debounced save to localStorage (CHANGED FROM sessionStorage)
    const debouncedSave = useRef(
        debounce((data: any) => {
            try {
                // Transform dates for storage
                const transformedData = transformDatesForStorage(data);
                localStorage.setItem(key, JSON.stringify(transformedData)); // CHANGED HERE
                console.log('Form data saved locally');
            } catch (error) {
                console.error('Failed to save form data locally:', error);
            }
        }, debounceMs)
    ).current;

    // Load saved data on mount
    useEffect(() => {
        const loadSavedData = () => {
            if (isInitialized.current) return;

            try {
                const savedData = localStorage.getItem(key); // CHANGED HERE
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const transformedData = transformDatesFromStorage(parsedData);

                    // Reset form with saved data
                    form.reset(transformedData);
                    console.log('Form data loaded from local storage');
                }
            } catch (error) {
                console.error('Failed to load saved form data:', error);
            } finally {
                isInitialized.current = true;
            }
        };

        loadSavedData();
    }, [key, form]);

    // Watch form changes and auto-save
    useEffect(() => {
        if (!isInitialized.current) return;

        const subscription = form.watch((data) => {
            debouncedSave(data);
        });

        return () => subscription.unsubscribe();
    }, [form, debouncedSave]);

    // Clear saved data
    const clearSavedData = () => {
        localStorage.removeItem(key); // CHANGED HERE
        console.log('Form data cleared');
    };

    return {
        clearSavedData,
        isDataLoaded: isInitialized.current,
    };
};

// Helper functions for date transformation
const transformDatesForStorage = (data: any): any => {
    const transformed = { ...data };

    // Convert Date objects to ISO strings for storage
    Object.keys(transformed).forEach(key => {
        if (transformed[key] instanceof Date) {
            transformed[key] = transformed[key].toISOString();
        }
    });

    return transformed;
};

const transformDatesFromStorage = (data: any): any => {
    const transformed = { ...data };

    // Known date fields that should be converted back to Date objects
    const dateFields = ['DOB', 'passportExpiryDate', 'oldPassportExpiryDate', 'visaExpiryDate'];

    dateFields.forEach(field => {
        if (transformed[field] && typeof transformed[field] === 'string') {
            try {
                transformed[field] = new Date(transformed[field]);
            } catch (e) {
                console.warn(`Failed to parse date for field ${field}:`, transformed[field]);
            }
        }
    });

    return transformed;
};