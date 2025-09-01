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

    // Debounced save to sessionStorage
    const debouncedSave = useRef(
        debounce((data: any) => {
            try {
                // Transform complex data for storage
                const transformedData = transformDataForStorage(data);
                localStorage.setItem(key, JSON.stringify(transformedData));
                console.log(`Form data saved locally for key: ${key}`);
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
                const savedData = localStorage.getItem(key);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const transformedData = transformDataFromStorage(parsedData);

                    // Reset form with saved data
                    form.reset(transformedData);
                    console.log(`Form data loaded from local storage for key: ${key}`);
                }
            } catch (error) {
                console.error('Failed to load saved form data:', error);
                // Clear corrupted data
                localStorage.removeItem(key);
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
            // Only save if data has meaningful content
            if (data && Object.keys(data).some(k => {
                const value = data[k];
                // Check if field has meaningful content
                if (Array.isArray(value)) {
                    return value.length > 0 && value.some(item =>
                        item && typeof item === 'object'
                            ? Object.values(item).some(v => v !== '' && v !== null && v !== undefined)
                            : item !== '' && item !== null && item !== undefined
                    );
                }
                return value !== '' && value !== null && value !== undefined;
            })) {
                debouncedSave(data);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, debouncedSave]);

    // Clear saved data
    const clearSavedData = () => {
        localStorage.removeItem(key);
        console.log(`Form data cleared for key: ${key}`);
    };

    return {
        clearSavedData,
        isDataLoaded: isInitialized.current,
    };
};

// Enhanced helper functions for complex data transformation
const transformDataForStorage = (data: any): any => {
    if (!data || typeof data !== 'object') return data;

    const transformed = Array.isArray(data) ? [...data] : { ...data };

    // Handle different data types
    Object.keys(transformed).forEach(key => {
        const value = transformed[key];

        if (value instanceof Date) {
            // Convert Date objects to ISO strings
            transformed[key] = value.toISOString();
        } else if (Array.isArray(value)) {
            // Recursively transform array items
            transformed[key] = value.map(item => transformDataForStorage(item));
        } else if (value && typeof value === 'object') {
            // Recursively transform nested objects
            transformed[key] = transformDataForStorage(value);
        }
        // Primitive values (string, number, boolean) are kept as-is
    });

    return transformed;
};

const transformDataFromStorage = (data: any): any => {
    if (!data || typeof data !== 'object') return data;

    const transformed = Array.isArray(data) ? [...data] : { ...data };

    // Known date fields that should be converted back to Date objects
    const dateFields = [
        'DOB',
        'passportExpiryDate',
        'oldPassportExpiryDate',
        'visaExpiryDate',
        'degreeStartDate',
        'degreeEndDate',
        'from',
        'to'
    ];

    Object.keys(transformed).forEach(key => {
        const value = transformed[key];

        if (dateFields.includes(key) && typeof value === 'string' && value) {
            // Convert ISO strings back to Date objects for specific date fields
            try {
                transformed[key] = new Date(value);
            } catch (e) {
                console.warn(`Failed to parse date for field ${key}:`, value);
                transformed[key] = null;
            }
        } else if (Array.isArray(value)) {
            // Recursively transform array items
            transformed[key] = value.map(item => transformDataFromStorage(item));
        } else if (value && typeof value === 'object') {
            // Recursively transform nested objects
            transformed[key] = transformDataFromStorage(value);
        }
        // Handle other string dates that might be in the data
        else if (typeof value === 'string' && value && isISODateString(value)) {
            try {
                transformed[key] = new Date(value);
            } catch (e) {
                // If it fails, keep as string
                transformed[key] = value;
            }
        }
    });

    return transformed;
};

// Helper function to check if a string is an ISO date string
const isISODateString = (value: string): boolean => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isoDateRegex.test(value);
};