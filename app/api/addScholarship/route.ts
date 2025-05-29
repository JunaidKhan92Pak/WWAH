import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';

// Complete type definitions
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

// interface ScholarshipData {
//     name: string;
//     hostCountry: string;
//     type: string;
//     provider?: string;
//     deadline: string;
//     numberOfScholarships: string | number;
//     overview: string;
//     programs: string[];
//     minimumRequirements: string;
//     officialLink?: string;
//     duration: Duration;
//     benefits: string[];
//     eligibilityCriteria: EligibilityCriterion[];
//     requiredDocuments: RequiredDocument[];
//     applicationProcess?: ApplicationProcessStep[];
//     applicableDepartments: ApplicableDepartment[];
//     successChances: SuccessChances;
// }

interface TransformedScholarship {
    name: string;
    hostCountry: string;
    type: string;
    provider?: string;
    deadline: string;
    numberOfScholarships: number;
    overview: string;
    programs: string[];
    minimumRequirements: string;
    officialLink?: string;
    duration: Duration;
    benefits: string[];
    eligibilityCriteria: EligibilityCriterion[];
    requiredDocuments: RequiredDocument[];
    applicationProcess?: ApplicationProcessStep[];
    applicableDepartments: ApplicableDepartment[];
    successChances: SuccessChances;
}

interface ScholarshipInput {
    name?: unknown;
    hostCountry?: unknown;
    [key: string]: unknown;
}

interface MongooseDocument {
    _id: string;
    name: string;
    hostCountry: string;
    type: string;
    provider?: string;
    createdAt: Date;
    updatedAt: Date;
}

// interface QueryFilter {
//     name?: RegExp;
//     hostCountry?: RegExp;
//     type?: string;
//     provider?: RegExp;
//     programs?: RegExp;
// }

// interface TextSearchQuery {
//     $and: [QueryFilter, { $text: { $search: string } }];
// }

// interface RegexSearchQuery {
//     $and: [QueryFilter, { $or: Array<Record<string, RegExp>> }];
// }

// Helper functions with proper typing
const safeString = (value: unknown, defaultValue = ''): string => {
    if (value === null || value === undefined) return defaultValue;
    return String(value).trim();
};

const safeArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    if (typeof value === 'string' && value.trim() !== '') return [value];
    return [];
};

const safeNumberOfScholarships = (value: unknown): number => {
    if (value === null || value === undefined || value === '' || value === 'N/A') return 1;
    if (typeof value === 'number') return value <= 0 ? 1 : value;
    if (typeof value === 'string') {
        const parsed = parseInt(value.replace(/\D/g, ''));
        return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    }
    return 1;
};

const safeDuration = (value: unknown): Duration => {
    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        return {
            general: safeString(obj.general),
            bachelors: safeString(obj.bachelors),
            masters: safeString(obj.masters),
            phd: safeString(obj.phd)
        };
    }
    return {
        general: safeString(value),
        bachelors: '',
        masters: '',
        phd: ''
    };
};

const safeEligibilityCriteria = (value: unknown): EligibilityCriterion[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item: unknown): item is EligibilityCriterion => {
        return item !== null &&
            typeof item === 'object' &&
            item !== undefined &&
            'criterion' in item &&
            'details' in item &&
            typeof (item).criterion === 'string' &&
            typeof (item).details === 'string';
    });
};

const safeRequiredDocuments = (value: unknown): RequiredDocument[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item: unknown): item is RequiredDocument => {
        return item !== null &&
            typeof item === 'object' &&
            item !== undefined &&
            'document' in item &&
            'details' in item &&
            typeof (item).document === 'string' &&
            typeof (item).details === 'string';
    });
};

const safeApplicationProcess = (value: unknown): ApplicationProcessStep[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item: unknown): item is ApplicationProcessStep => {
        return item !== null &&
            typeof item === 'object' &&
            item !== undefined &&
            'step' in item &&
            'details' in item &&
            typeof (item).step === 'string' &&
            typeof (item).details === 'string';
    });
};

const safeApplicableDepartments = (value: unknown): ApplicableDepartment[] => {
    if (!Array.isArray(value)) return [];

    return value
        .map((item: unknown): ApplicableDepartment | null => {
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
            item !== null && typeof item.name === 'string' && item.name !== ''
        );
};

const safeSuccessChances = (value: unknown): SuccessChances => {
    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        return {
            academicBackground: safeString(obj.academicBackground),
            age: safeString(obj.age),
            englishProficiency: safeString(obj.englishProficiency),
            gradesAndCGPA: safeString(obj.gradesAndCGPA),
            nationality: safeString(obj.nationality),
            workExperience: safeString(obj.workExperience)
        };
    }
    return {
        academicBackground: '',
        age: '',
        englishProficiency: '',
        gradesAndCGPA: '',
        nationality: '',
        workExperience: ''
    };
};

const validateScholarship = (scholarship: ScholarshipInput, index: number): string[] => {
    const errors: string[] = [];

    if (typeof scholarship !== 'object' || scholarship === null) {
        errors.push(`Scholarship ${index + 1}: Invalid data format`);
        return errors;
    }

    if (!scholarship.name || (typeof scholarship.name === 'string' && scholarship.name.trim() === '')) {
        errors.push(`Scholarship ${index + 1}: Name is required`);
    }
    if (!scholarship.hostCountry || (typeof scholarship.hostCountry === 'string' && scholarship.hostCountry.trim() === '')) {
        errors.push(`Scholarship ${index + 1}: Host country is required`);
    }

    return errors;
};

const transformScholarshipData = (scholarship: unknown): TransformedScholarship => {
    try {
        const data = scholarship as Record<string, unknown>;

        const transformed: TransformedScholarship = {
            name: safeString(data.name),
            hostCountry: safeString(data.hostCountry),
            type: safeString(data.type, 'Not Specified'),
            provider: safeString(data.provider, 'Not Specified'),
            deadline: safeString(data.deadline),
            numberOfScholarships: safeNumberOfScholarships(data.numberOfScholarships),
            overview: safeString(data.overview),
            programs: safeArray(data.programs).map((p: unknown) => safeString(p)).filter((p: string) => p !== ''),
            minimumRequirements: safeString(data.minimumRequirements),
            officialLink: safeString(data.officialLink),
            duration: safeDuration(data.duration),
            benefits: safeArray(data.benefits).map((b: unknown) => safeString(b)).filter((b: string) => b !== ''),
            applicableDepartments: safeApplicableDepartments(data.applicableDepartments),
            eligibilityCriteria: safeEligibilityCriteria(data.eligibilityCriteria),
            requiredDocuments: safeRequiredDocuments(data.requiredDocuments),
            applicationProcess: safeApplicationProcess(data.applicationProcess),
            successChances: safeSuccessChances(data.successChances)
        };

        return transformed;
    } catch (transformError) {
        console.warn(`Data transformation warning: ${transformError instanceof Error ? transformError.message : 'Unknown error'}`);
        return {
            name: 'Unknown Scholarship',
            hostCountry: 'Unknown Country',
            type: 'Not Specified',
            provider: 'Not Specified',
            deadline: '',
            numberOfScholarships: 1,
            overview: '',
            programs: [],
            minimumRequirements: '',
            officialLink: '',
            duration: { general: '', bachelors: '', masters: '', phd: '' },
            benefits: [],
            applicableDepartments: [],
            eligibilityCriteria: [],
            requiredDocuments: [],
            applicationProcess: [],
            successChances: {
                academicBackground: '',
                age: '',
                englishProficiency: '',
                gradesAndCGPA: '',
                nationality: '',
                workExperience: ''
            }
        };
    }
};

export async function POST(req: Request) {
    try {
        const dbConnection = connectToDatabase();
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Database connection timeout')), 10000)
        );

        await Promise.race([dbConnection, timeoutPromise]);

        let body: unknown;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return NextResponse.json(
                { error: "Invalid JSON format" },
                { status: 400 }
            );
        }

        const scholarshipsArray: unknown[] = Array.isArray(body) ? body : [body];

        if (scholarshipsArray.length === 0) {
            return NextResponse.json(
                { error: "No scholarship data provided" },
                { status: 400 }
            );
        }

        if (scholarshipsArray.length > 100) {
            return NextResponse.json(
                { error: "Maximum 100 scholarships allowed per request" },
                { status: 400 }
            );
        }

        try {
            const allErrors: string[] = [];
            scholarshipsArray.forEach((scholarship, index) => {
                const errors = validateScholarship(scholarship as ScholarshipInput, index);
                allErrors.push(...errors);
            });

            if (allErrors.length > 0) {
                console.warn("Validation warnings:", allErrors);
            }

            const results: MongooseDocument[] = [];
            let insertedCount = 0;
            let updatedCount = 0;
            const warnings: string[] = [];

            const batchSize = 20;
            for (let batchStart = 0; batchStart < scholarshipsArray.length; batchStart += batchSize) {
                const batch = scholarshipsArray.slice(batchStart, batchStart + batchSize);

                for (let i = 0; i < batch.length; i++) {
                    try {
                        const scholarship = batch[i];
                        const transformedScholarship = transformScholarshipData(scholarship);

                        if (!transformedScholarship.name || !transformedScholarship.hostCountry) {
                            warnings.push(`Skipped scholarship ${batchStart + i + 1}: Missing required fields`);
                            continue;
                        }

                        const filter = {
                            name: transformedScholarship.name,
                            hostCountry: transformedScholarship.hostCountry
                        };

                        const existingDoc = await Scholarship.findOne(filter);
                        const isUpdate = !!existingDoc;

                        const options = {
                            new: true,
                            upsert: true,
                            runValidators: false,
                            setDefaultsOnInsert: true
                        };

                        const result = await Scholarship.findOneAndUpdate(
                            filter,
                            transformedScholarship,
                            options
                        ) as MongooseDocument;

                        if (result) {
                            results.push(result);
                            if (isUpdate) {
                                updatedCount++;
                            } else {
                                insertedCount++;
                            }
                        }

                    } catch (docError) {
                        const errorMessage = docError instanceof Error ? docError.message : 'Unknown error';
                        warnings.push(`Document ${batchStart + i + 1}: ${errorMessage}`);
                        console.warn(`Document processing warning:`, errorMessage);
                    }
                }
            }

            const statusCode = results.length === 0 ? 400 : 200;

            return NextResponse.json({
                message: results.length === scholarshipsArray.length
                    ? "All scholarships processed successfully"
                    : `${results.length} out of ${scholarshipsArray.length} scholarships processed successfully`,
                summary: {
                    total: scholarshipsArray.length,
                    successful: results.length,
                    inserted: insertedCount,
                    updated: updatedCount,
                    skipped: scholarshipsArray.length - results.length
                },
                ...(warnings.length > 0 && { warnings: warnings.slice(0, 10) }),
                scholarships: results.map(s => ({
                    id: s._id,
                    name: s.name,
                    hostCountry: s.hostCountry,
                    type: s.type,
                    provider: s.provider,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt
                }))
            }, { status: statusCode });

        } catch (processingError) {
            console.error("Processing Error:", processingError);
            return NextResponse.json(
                {
                    error: "Processing error",
                    details: processingError instanceof Error ? processingError.message : 'Unknown processing error'
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("API Error:", error);

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

// export async function GET(req: Request) {
//     try {
//         const dbConnection = connectToDatabase();
//         const timeoutPromise = new Promise<never>((_, reject) =>
//             setTimeout(() => reject(new Error('Database connection timeout')), 10000)
//         );

//         await Promise.race([dbConnection, timeoutPromise]);

//         const { searchParams } = new URL(req.url);
//         const name = searchParams.get('name');
//         const hostCountry = searchParams.get('hostCountry');
//         const type = searchParams.get('type');
//         const provider = searchParams.get('provider');
//         const program = searchParams.get('program');
//         const search = searchParams.get('search');

//         const limitParam = searchParams.get('limit');
//         const skipParam = searchParams.get('skip');
//         const limit = Math.min(Math.max(parseInt(limitParam || '10'), 1), 100);
//         const skip = Math.max(parseInt(skipParam || '0'), 0);

//         const sortBy = searchParams.get('sortBy') || 'createdAt';
//         const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

//         const allowedSortFields = ['name', 'hostCountry', 'type', 'provider', 'createdAt', 'updatedAt', 'deadline'];
//         const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

//         const query: QueryFilter = {};

//         if (name) {
//             const sanitizedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             query.name = new RegExp(sanitizedName, 'i');
//         }
//         if (hostCountry) {
//             const sanitizedCountry = hostCountry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             query.hostCountry = new RegExp(sanitizedCountry, 'i');
//         }
//         if (type) query.type = type;
//         if (provider) {
//             const sanitizedProvider = provider.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             query.provider = new RegExp(sanitizedProvider, 'i');
//         }
//         if (program) {
//             const sanitizedProgram = program.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             query.programs = new RegExp(sanitizedProgram, 'i');
//         }

//         let scholarships: MongooseDocument[];
//         let total: number;

//         if (search && search.trim() !== '') {
//             const sanitizedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//             try {
//                 const textSearchQuery: TextSearchQuery = {
//                     $and: [
//                         query,
//                         { $text: { $search: sanitizedSearch } }
//                     ]
//                 };

//                 scholarships = await Scholarship
//                     .find(textSearchQuery, { score: { $meta: 'textScore' } })
//                     .sort({ score: { $meta: 'textScore' } })
//                     .limit(limit)
//                     .skip(skip) as MongooseDocument[];

//                 total = await Scholarship.countDocuments(textSearchQuery);
//             } catch (textSearchError) {
//                 console.warn("Text search failed, falling back to regex:", textSearchError);
//                 const searchRegex = new RegExp(sanitizedSearch, 'i');
//                 const regexSearchQuery: RegexSearchQuery = {
//                     $and: [
//                         query,
//                         {
//                             $or: [
//                                 { name: searchRegex },
//                                 { overview: searchRegex },
//                                 { provider: searchRegex },
//                                 { hostCountry: searchRegex }
//                             ]
//                         }
//                     ]
//                 };

//                 scholarships = await Scholarship
//                     .find(regexSearchQuery)
//                     .sort({ [safeSortBy]: sortOrder })
//                     .limit(limit)
//                     .skip(skip) as MongooseDocument[];

//                 total = await Scholarship.countDocuments(regexSearchQuery);
//             }
//         } else {
//             const sortObject: Record<string, 1 | -1> = { [safeSortBy]: sortOrder };

//             scholarships = await Scholarship
//                 .find(query)
//                 .sort(sortObject)
//                 .limit(limit)
//                 .skip(skip) as MongooseDocument[];

//             total = await Scholarship.countDocuments(query);
//         }

//         return NextResponse.json({
//             scholarships: scholarships || [],
//             pagination: {
//                 total: total || 0,
//                 limit,
//                 skip,
//                 hasMore: skip + limit < (total || 0),
//                 currentPage: Math.floor(skip / limit) + 1,
//                 totalPages: Math.ceil((total || 0) / limit)
//             },
//             filters: {
//                 name,
//                 hostCountry,
//                 type,
//                 provider,
//                 program,
//                 search
//             }
//         }, { status: 200 });

//     } catch (error) {
//         console.error("GET API Error:", error);

//         if (error instanceof Error && error.message.includes('timeout')) {
//             return NextResponse.json(
//                 { error: "Request timeout" },
//                 { status: 408 }
//             );
//         }

//         return NextResponse.json(
//             { error: "Failed to fetch scholarships" },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(req: Request) {
//     try {
//         const dbConnection = connectToDatabase();
//         const timeoutPromise = new Promise<never>((_, reject) =>
//             setTimeout(() => reject(new Error('Database connection timeout')), 10000)
//         );

//         await Promise.race([dbConnection, timeoutPromise]);

//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');

//         if (!id || id.trim() === '') {
//             return NextResponse.json(
//                 { error: "Scholarship ID is required" },
//                 { status: 400 }
//             );
//         }

//         if (!/^[0-9a-fA-F]{24}$/.test(id)) {
//             return NextResponse.json(
//                 { error: "Invalid scholarship ID format" },
//                 { status: 400 }
//             );
//         }

//         const deletedScholarship = await Scholarship.findByIdAndDelete(id) as MongooseDocument | null;

//         if (!deletedScholarship) {
//             return NextResponse.json(
//                 { error: "Scholarship not found" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({
//             message: "Scholarship deleted successfully",
//             scholarship: {
//                 id: deletedScholarship._id,
//                 name: deletedScholarship.name,
//                 hostCountry: deletedScholarship.hostCountry
//             }
//         }, { status: 200 });

//     } catch (error) {
//         console.error("DELETE API Error:", error);

//         if (error instanceof Error && error.message.includes('timeout')) {
//             return NextResponse.json(
//                 { error: "Request timeout" },
//                 { status: 408 }
//             );
//         }

//         return NextResponse.json(
//             { error: "Failed to delete scholarship" },
//             { status: 500 }
//         );
//     }
// }