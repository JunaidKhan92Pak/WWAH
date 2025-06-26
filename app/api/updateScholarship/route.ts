import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';
import { Types } from 'mongoose';

// Complete type definitions (same as your existing types)
interface Duration {
    general?: string;
    bachelors?: string;
    masters?: string;
    phd?: string;
}

interface EligibilityCriterion {
    criterion: string;
    details: string;
}

interface RequiredDocument {
    document: string;
    details: string;
}

interface ApplicationProcessStep {
    step: string;
    details: string;
}

interface ApplicableDepartment {
    name: string;
    details: string;
}

interface SuccessChances {
    academicBackground: string;
    age: string;
    englishProficiency: string;
    gradesAndCGPA: string;
    nationality: string;
    workExperience: string;
}

interface Table {
    course: string[];
    create_application: string[];
    deadline: string[];
    duration: string[];
    entry_requirements: string[];
    faculty_department: string[];
    scholarship_type: string[];
    teaching_language: string[];
    university: string[];
}

interface UpdateScholarshipInput {
    id?: string; // MongoDB _id for identification
    name?: string; // Alternative identification
    hostCountry?: string; // Alternative identification
    type?: string;
    provider?: string;
    deadline?: string;
    numberOfScholarships?: number;
    overview?: string;
    programs?: string[];
    minimumRequirements?: string;
    officialLink?: string;
    duration?: Duration;
    benefits?: string[];
    eligibilityCriteria?: EligibilityCriterion[];
    requiredDocuments?: RequiredDocument[];
    applicationProcess?: ApplicationProcessStep[];
    applicableDepartments?: ApplicableDepartment[];
    successChances?: SuccessChances;
    table?: Table;
}

// Helper functions for safe data handling
const safeString = (value: unknown, existingValue?: string): string => {
    if (value === null || value === undefined || value === '') {
        return existingValue || '';
    }
    return String(value).trim();
};

const safeArray = (value: unknown, existingValue?: unknown[]): unknown[] => {
    if (value === null || value === undefined) {
        return existingValue || [];
    }
    if (Array.isArray(value)) {
        return value.length > 0 ? value : (existingValue || []);
    }
    if (typeof value === 'string' && value.trim() !== '') {
        return [value];
    }
    return existingValue || [];
};

const safeNumber = (value: unknown, existingValue?: number): number => {
    if (value === null || value === undefined || value === '') {
        return existingValue || 1;
    }
    if (typeof value === 'number') {
        return value <= 0 ? (existingValue || 1) : value;
    }
    if (typeof value === 'string') {
        const parsed = parseInt(value.replace(/\D/g, ''));
        return isNaN(parsed) || parsed <= 0 ? (existingValue || 1) : parsed;
    }
    return existingValue || 1;
};

const safeDuration = (value: unknown, existingValue?: Duration): Duration => {
    const existing = existingValue || { general: '', bachelors: '', masters: '', phd: '' };

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        return {
            general: safeString(obj.general, existing.general),
            bachelors: safeString(obj.bachelors, existing.bachelors),
            masters: safeString(obj.masters, existing.masters),
            phd: safeString(obj.phd, existing.phd)
        };
    }

    if (typeof value === 'string' && value.trim() !== '') {
        return {
            ...existing,
            general: value.trim()
        };
    }

    return existing;
};

const safeObjectArray = <T>(
    value: unknown,
    existingValue: T[],
    validator: (item: unknown) => item is T
): T[] => {
    if (value === null || value === undefined) {
        return existingValue;
    }
    if (!Array.isArray(value)) {
        return existingValue;
    }

    const validItems = value.filter(validator);
    return validItems.length > 0 ? validItems : existingValue;
};

const safeSuccessChances = (value: unknown, existingValue?: SuccessChances): SuccessChances => {
    const existing = existingValue || {
        academicBackground: '',
        age: '',
        englishProficiency: '',
        gradesAndCGPA: '',
        nationality: '',
        workExperience: ''
    };

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        return {
            academicBackground: safeString(obj.academicBackground, existing.academicBackground),
            age: safeString(obj.age, existing.age),
            englishProficiency: safeString(obj.englishProficiency, existing.englishProficiency),
            gradesAndCGPA: safeString(obj.gradesAndCGPA, existing.gradesAndCGPA),
            nationality: safeString(obj.nationality, existing.nationality),
            workExperience: safeString(obj.workExperience, existing.workExperience)
        };
    }

    return existing;
};

const safeTable = (value: unknown, existingValue?: Table): Table => {
    const existing = existingValue || {
        course: [],
        create_application: [],
        deadline: [],
        duration: [],
        entry_requirements: [],
        faculty_department: [],
        scholarship_type: [],
        teaching_language: [],
        university: []
    };

    if (typeof value === 'object' && value !== null) {
        const tableData = value as Partial<Table>;
        return {
            course: Array.isArray(tableData.course) && tableData.course.length > 0 ? tableData.course : existing.course,
            create_application: Array.isArray(tableData.create_application) && tableData.create_application.length > 0 ? tableData.create_application : existing.create_application,
            deadline: Array.isArray(tableData.deadline) && tableData.deadline.length > 0 ? tableData.deadline : existing.deadline,
            duration: Array.isArray(tableData.duration) && tableData.duration.length > 0 ? tableData.duration : existing.duration,
            entry_requirements: Array.isArray(tableData.entry_requirements) && tableData.entry_requirements.length > 0 ? tableData.entry_requirements : existing.entry_requirements,
            faculty_department: Array.isArray(tableData.faculty_department) && tableData.faculty_department.length > 0 ? tableData.faculty_department : existing.faculty_department,
            scholarship_type: Array.isArray(tableData.scholarship_type) && tableData.scholarship_type.length > 0 ? tableData.scholarship_type : existing.scholarship_type,
            teaching_language: Array.isArray(tableData.teaching_language) && tableData.teaching_language.length > 0 ? tableData.teaching_language : existing.teaching_language,
            university: Array.isArray(tableData.university) && tableData.university.length > 0 ? tableData.university : existing.university
        };
    }

    return existing;
};

// Validation functions
const isEligibilityCriterion = (item: unknown): item is EligibilityCriterion => {
    return item !== null &&
        typeof item === 'object' &&
        item !== undefined &&
        'criterion' in item &&
        'details' in item &&
        typeof (item as EligibilityCriterion).criterion === 'string' &&
        typeof (item as EligibilityCriterion).details === 'string';
};

const isRequiredDocument = (item: unknown): item is RequiredDocument => {
    return item !== null &&
        typeof item === 'object' &&
        item !== undefined &&
        'document' in item &&
        'details' in item &&
        typeof (item as RequiredDocument).document === 'string' &&
        typeof (item as RequiredDocument).details === 'string';
};

const isApplicationProcessStep = (item: unknown): item is ApplicationProcessStep => {
    return item !== null &&
        typeof item === 'object' &&
        item !== undefined &&
        'step' in item &&
        'details' in item &&
        typeof (item as ApplicationProcessStep).step === 'string' &&
        typeof (item as ApplicationProcessStep).details === 'string';
};

const isApplicableDepartment = (item: unknown): item is ApplicableDepartment => {
    if (typeof item === 'string') {
        return item.trim() !== '';
    }
    return item !== null &&
        typeof item === 'object' &&
        item !== undefined &&
        'name' in item &&
        typeof (item as ApplicableDepartment).name === 'string' &&
        (item as ApplicableDepartment).name.trim() !== '';
};

const normalizeApplicableDepartments = (items: unknown[]): ApplicableDepartment[] => {
    return items
        .map((item): ApplicableDepartment | null => {
            if (typeof item === 'string') {
                return { name: item.trim(), details: '' };
            }
            if (typeof item === 'object' && item !== null && 'name' in item) {
                const obj = item as Record<string, unknown>;
                return {
                    name: safeString(obj.name),
                    details: safeString(obj.details)
                };
            }
            return null;
        })
        .filter((item): item is ApplicableDepartment =>
            item !== null && item.name !== ''
        );
};

// Main update function
interface ScholarshipDocument {
    [key: string]: unknown;
}

// Define filter type for database queries
interface ScholarshipFilter {
    _id?: Types.ObjectId;
    name?: string;
    hostCountry?: string;
}

// Define a more flexible type for existing scholarship from MongoDB
type MongoScholarship = {
    toObject(): ScholarshipDocument;
    type?: string;
    provider?: string;
    deadline?: string;
    numberOfScholarships?: number;
    overview?: string;
    minimumRequirements?: string;
    officialLink?: string;
    programs?: string[];
    benefits?: string[];
    duration?: Duration;
    successChances?: SuccessChances;
    table?: Table;
    eligibilityCriteria?: EligibilityCriterion[];
    requiredDocuments?: RequiredDocument[];
    applicationProcess?: ApplicationProcessStep[];
    applicableDepartments?: ApplicableDepartment[];
} & Record<string, unknown>;

const mergeScholarshipData = (
    existing: MongoScholarship,
    updates: UpdateScholarshipInput
): ScholarshipDocument => {
    const merged: ScholarshipDocument = { ...existing.toObject() };

    // Update basic fields only if provided and not empty
    if (updates.type !== undefined) merged.type = safeString(updates.type, existing.type);
    if (updates.provider !== undefined) merged.provider = safeString(updates.provider, existing.provider);
    if (updates.deadline !== undefined) merged.deadline = safeString(updates.deadline, existing.deadline);
    if (updates.numberOfScholarships !== undefined) merged.numberOfScholarships = safeNumber(updates.numberOfScholarships, existing.numberOfScholarships);
    if (updates.overview !== undefined) merged.overview = safeString(updates.overview, existing.overview);
    if (updates.minimumRequirements !== undefined) merged.minimumRequirements = safeString(updates.minimumRequirements, existing.minimumRequirements);
    if (updates.officialLink !== undefined) merged.officialLink = safeString(updates.officialLink, existing.officialLink);

    // Update arrays only if provided and not empty
    if (updates.programs !== undefined) {
        const updatedPrograms: string[] = safeArray(updates.programs, existing.programs)
            .map((p: unknown) => safeString(p))
            .filter((p: string) => p !== '');
        if (updatedPrograms.length > 0) merged.programs = updatedPrograms;
    }

    if (updates.benefits !== undefined) {
        const updatedBenefits: string[] = safeArray(updates.benefits, existing.benefits)
            .map((b: unknown) => safeString(b))
            .filter((b: string) => b !== '');
        if (updatedBenefits.length > 0) merged.benefits = updatedBenefits;
    }

    // Update complex objects
    if (updates.duration !== undefined) {
        merged.duration = safeDuration(updates.duration, existing.duration);
    }

    // Always normalize successChances to ensure all fields are defined strings
    merged.successChances = safeSuccessChances(
        updates.successChances !== undefined
            ? updates.successChances
            : existing.successChances,
        existing.successChances
    );

    if (updates.table !== undefined) {
        merged.table = safeTable(updates.table, existing.table);
    }

    // Update object arrays
    if (updates.eligibilityCriteria !== undefined) {
        merged.eligibilityCriteria = safeObjectArray<EligibilityCriterion>(
            updates.eligibilityCriteria,
            existing.eligibilityCriteria || [],
            isEligibilityCriterion
        );
    }

    if (updates.requiredDocuments !== undefined) {
        merged.requiredDocuments = safeObjectArray<RequiredDocument>(
            updates.requiredDocuments,
            existing.requiredDocuments || [],
            isRequiredDocument
        );
    }

    if (updates.applicationProcess !== undefined) {
        merged.applicationProcess = safeObjectArray<ApplicationProcessStep>(
            updates.applicationProcess,
            existing.applicationProcess || [],
            isApplicationProcessStep
        );
    }

    if (updates.applicableDepartments !== undefined) {
        const validDepartments: unknown[] = safeArray(updates.applicableDepartments, existing.applicableDepartments || [])
            .filter(isApplicableDepartment);
        if (validDepartments.length > 0) {
            merged.applicableDepartments = normalizeApplicableDepartments(validDepartments);
        }
    }

    return merged;
};

// PUT method for updating scholarships
export async function PUT(req: Request) {
    try {
        const dbConnection = connectToDatabase();
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Database connection timeout')), 10000)
        );

        await Promise.race([dbConnection, timeoutPromise]);

        let body: unknown;
        try {
            body = await req.json();
            console.log("Update request body received:", body);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return NextResponse.json(
                { error: "Invalid JSON format" },
                { status: 400 }
            );
        }

        const updatesArray: UpdateScholarshipInput[] = Array.isArray(body) ? body : [body];

        if (updatesArray.length === 0) {
            return NextResponse.json(
                { error: "No update data provided" },
                { status: 400 }
            );
        }

        if (updatesArray.length > 50) {
            return NextResponse.json(
                { error: "Maximum 50 scholarships allowed per update request" },
                { status: 400 }
            );
        }

        const results = [];
        const warnings: string[] = [];
        let updatedCount = 0;
        let notFoundCount = 0;

        for (let i = 0; i < updatesArray.length; i++) {
            try {
                const updateData = updatesArray[i];

                // Find scholarship by ID or by name+hostCountry
                let filter: ScholarshipFilter = {};
                if (updateData.id) {
                    if (!Types.ObjectId.isValid(updateData.id)) {
                        warnings.push(`Update ${i + 1}: Invalid ID format`);
                        continue;
                    }
                    filter._id = new Types.ObjectId(updateData.id);
                } else if (updateData.name && updateData.hostCountry) {
                    filter = {
                        name: updateData.name,
                        hostCountry: updateData.hostCountry
                    };
                } else {
                    warnings.push(`Update ${i + 1}: Either ID or name+hostCountry is required for identification`);
                    continue;
                }

                const existingScholarship = await Scholarship.findOne(filter);

                if (!existingScholarship) {
                    warnings.push(`Update ${i + 1}: Scholarship not found`);
                    notFoundCount++;
                    continue;
                }

                // Normalize successChances to ensure all fields are strings
                if (existingScholarship.successChances) {
                    existingScholarship.successChances = {
                        academicBackground: existingScholarship.successChances.academicBackground ?? '',
                        age: existingScholarship.successChances.age ?? '',
                        englishProficiency: existingScholarship.successChances.englishProficiency ?? '',
                        gradesAndCGPA: existingScholarship.successChances.gradesAndCGPA ?? '',
                        nationality: existingScholarship.successChances.nationality ?? '',
                        workExperience: existingScholarship.successChances.workExperience ?? ''
                    } as SuccessChances;
                } else {
                    existingScholarship.successChances = {
                        academicBackground: '',
                        age: '',
                        englishProficiency: '',
                        gradesAndCGPA: '',
                        nationality: '',
                        workExperience: ''
                    };
                }
                // Merge existing data with updates
                const mergedData = mergeScholarshipData(existingScholarship as unknown as MongoScholarship, updateData);

                // Update the scholarship
                const updatedScholarship = await Scholarship.findOneAndUpdate(
                    filter,
                    mergedData,
                    {
                        new: true,
                        runValidators: true
                    }
                );

                if (updatedScholarship) {
                    results.push({
                        id: updatedScholarship._id,
                        name: updatedScholarship.name,
                        hostCountry: updatedScholarship.hostCountry,
                        type: updatedScholarship.type,
                        provider: updatedScholarship.provider,
                        updatedAt: updatedScholarship.updatedAt
                    });
                    updatedCount++;
                }

            } catch (docError) {
                const errorMessage = docError instanceof Error ? docError.message : 'Unknown error';
                warnings.push(`Update ${i + 1}: ${errorMessage}`);
                console.warn(`Document update warning:`, errorMessage);
            }
        }

        const statusCode = results.length === 0 ? 400 : 200;

        return NextResponse.json({
            message: results.length === updatesArray.length
                ? "All scholarships updated successfully"
                : `${results.length} out of ${updatesArray.length} scholarships updated successfully`,
            summary: {
                requested: updatesArray.length,
                updated: updatedCount,
                notFound: notFoundCount,
                failed: updatesArray.length - updatedCount - notFoundCount
            },
            ...(warnings.length > 0 && { warnings: warnings.slice(0, 10) }),
            scholarships: results
        }, { status: statusCode });

    } catch (error) {
        console.error("Update API Error:", error);

        if (error instanceof Error) {
            if (error.message.includes('timeout')) {
                return NextResponse.json(
                    { error: "Request timeout - please try with fewer records" },
                    { status: 408 }
                );
            }
            if (error.message.includes('JSON')) {
                return NextResponse.json(
                    { error: "Invalid JSON format" },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                {
                    error: "Database error",
                    details: error.message
                },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}

// PATCH method for partial updates (alternative approach)
export async function PATCH(req: Request) {
    return PUT(req); // Use the same logic for PATCH
}