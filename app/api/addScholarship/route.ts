import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';

// Complete type matching your JSON structure
type ScholarshipData = {
    name: string;
    hostCountry: string;
    type: string;
    provider?: string;
    deadline: string;
    numberOfScholarships: string | number;
    overview: string;
    programs: string[];
    minimumRequirements: string;
    officialLink?: string;
    duration: {
        general?: string;
        bachelors?: string;
        masters?: string;
        phd?: string;
    };
    benefits: string[];
    eligibilityCriteria: {
        criterion: string;
        details: string;
    }[];
    requiredDocuments: {
        document: string;
        details: string;
    }[];
    applicationProcess?: {
        step: string;
        details: string;
    }[];
    applicableDepartments: string[] | {
        name: string;
        details: string;
    }[];
    successChances: {
        academicBackground: string;
        age: string;
        englishProficiency: string;
        gradesAndCGPA: string;
        nationality: string;
        workExperience: string;
    };
};

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Ensure body is an array (for bulk upload)
        const scholarshipsArray = Array.isArray(body) ? body : [body];

        // Check if data is provided
        if (scholarshipsArray.length === 0) {
            return NextResponse.json(
                { error: "No scholarship data provided" },
                { status: 400 }
            );
        }

        // Enhanced validation function
        const validateScholarship = (scholarship: ScholarshipData, index: number) => {
            const errors: string[] = [];

            if (!scholarship.name || scholarship.name.trim() === '') {
                errors.push(`Scholarship ${index + 1}: Name is required`);
            }
            if (!scholarship.hostCountry || scholarship.hostCountry.trim() === '') {
                errors.push(`Scholarship ${index + 1}: Host country is required`);
            }
            if (scholarship.eligibilityCriteria && scholarship.eligibilityCriteria.length > 0) {
                scholarship.eligibilityCriteria.forEach((criterion, i) => {
                    if (!criterion.criterion || !criterion.details) {
                        errors.push(`Scholarship ${index + 1}: Eligibility criterion ${i + 1} is incomplete`);
                    }
                });
            }
            if (scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0) {
                scholarship.requiredDocuments.forEach((doc, i) => {
                    if (!doc.document || !doc.details) {
                        errors.push(`Scholarship ${index + 1}: Required document ${i + 1} is incomplete`);
                    }
                });
            }

            if (errors.length > 0) {
                throw new Error(errors.join('; '));
            }
            return true;
        };

        // Transform function to perfectly match your schema
        const transformScholarshipData = (scholarship: ScholarshipData) => {
            // Handle numberOfScholarships conversion
            let numberOfScholarships = 1;
            if (scholarship.numberOfScholarships === "N/A" || scholarship.numberOfScholarships === "") {
                numberOfScholarships = 1;
            } else if (typeof scholarship.numberOfScholarships === 'string') {
                const parsed = parseInt(scholarship.numberOfScholarships);
                numberOfScholarships = isNaN(parsed) ? 1 : parsed;
            } else {
                numberOfScholarships = scholarship.numberOfScholarships;
            }

            // Transform applicableDepartments to match schema structure
            let applicableDepartments: { name: string; details: string }[] = [];
            if (Array.isArray(scholarship.applicableDepartments)) {
                if (scholarship.applicableDepartments.length === 0) {
                    applicableDepartments = [];
                } else if (typeof scholarship.applicableDepartments[0] === 'string') {
                    applicableDepartments = (scholarship.applicableDepartments as string[]).map(dept => ({
                        name: dept,
                        details: ''
                    }));
                } else {
                    applicableDepartments = scholarship.applicableDepartments as { name: string; details: string }[];
                }
            }

            const transformed = {
                name: scholarship.name,
                hostCountry: scholarship.hostCountry,
                type: scholarship.type || 'Not Specified',
                provider: scholarship.provider || 'Not Specified',
                deadline: scholarship.deadline || '',
                numberOfScholarships,
                overview: scholarship.overview || '',
                programs: scholarship.programs || [],
                minimumRequirements: scholarship.minimumRequirements || '',
                officialLink: scholarship.officialLink || '',
                duration: {
                    general: scholarship.duration?.general || '',
                    bachelors: scholarship.duration?.bachelors || '',
                    masters: scholarship.duration?.masters || '',
                    phd: scholarship.duration?.phd || ''
                },
                benefits: scholarship.benefits || [],
                applicableDepartments,
                eligibilityCriteria: scholarship.eligibilityCriteria || [],
                requiredDocuments: scholarship.requiredDocuments || [],
                applicationProcess: scholarship.applicationProcess || [],
                successChances: scholarship.successChances || {
                    academicBackground: '',
                    age: '',
                    englishProficiency: '',
                    gradesAndCGPA: '',
                    nationality: '',
                    workExperience: ''
                }
            };

            return transformed;
        };

        // Process bulk upsert with validation and transformation
        try {
            // Validate all scholarships first
            scholarshipsArray.forEach(validateScholarship);

            // Transform and create bulk operations
            const results = [];
            let insertedCount = 0;
            let updatedCount = 0;
            let errors = [];

            for (let i = 0; i < scholarshipsArray.length; i++) {
                try {
                    const scholarship = scholarshipsArray[i];
                    const transformedScholarship = transformScholarshipData(scholarship);

                    const filter = {
                        name: transformedScholarship.name,
                        hostCountry: transformedScholarship.hostCountry
                    };

                    // Check if document exists before upsert
                    const existingDoc = await Scholarship.findOne(filter);
                    const isUpdate = !!existingDoc;

                    const options = {
                        new: true,
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    };

                    const result = await Scholarship.findOneAndUpdate(
                        filter,
                        transformedScholarship,
                        options
                    );

                    results.push(result);

                    if (isUpdate) {
                        updatedCount++;
                    } else {
                        insertedCount++;
                    }

                } catch (docError) {
                    errors.push(`Document ${i + 1}: ${(docError as Error).message}`);
                }
            }

            // Return results even if some documents failed
            return NextResponse.json({
                message: errors.length === 0
                    ? "All scholarships processed successfully"
                    : "Some scholarships processed with errors",
                summary: {
                    total: scholarshipsArray.length,
                    successful: results.length,
                    inserted: insertedCount,
                    updated: updatedCount,
                    failed: errors.length
                },
                ...(errors.length > 0 && { errors }),
                scholarships: results.map(s => ({
                    id: s._id,
                    name: s.name,
                    hostCountry: s.hostCountry,
                    type: s.type,
                    provider: s.provider,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt
                }))
            }, { status: errors.length === scholarshipsArray.length ? 400 : 200 });

        } catch (validationError) {
            console.error("Validation Error:", validationError);
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: (validationError as Error).message
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof Error) {
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

// GET method with advanced filtering and search
export async function GET(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');
        const hostCountry = searchParams.get('hostCountry');
        const type = searchParams.get('type');
        const provider = searchParams.get('provider');
        const program = searchParams.get('program');
        const search = searchParams.get('search'); // Text search
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100
        const skip = parseInt(searchParams.get('skip') || '0');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        let query: any = {};

        // Build query
        if (name) query.name = new RegExp(name, 'i');
        if (hostCountry) query.hostCountry = new RegExp(hostCountry, 'i');
        if (type) query.type = type;
        if (provider) query.provider = new RegExp(provider, 'i');
        if (program) query.programs = new RegExp(program, 'i');

        let scholarships;
        let total;

        if (search) {
            // Text search
            scholarships = await Scholarship
                .find(
                    {
                        $and: [
                            query,
                            { $text: { $search: search } }
                        ]
                    },
                    { score: { $meta: 'textScore' } }
                )
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .skip(skip);

            total = await Scholarship.countDocuments({
                $and: [
                    query,
                    { $text: { $search: search } }
                ]
            });
        } else {
            // Regular query
            const sortObject: any = {};
            sortObject[sortBy] = sortOrder;

            scholarships = await Scholarship
                .find(query)
                .sort(sortObject)
                .limit(limit)
                .skip(skip);

            total = await Scholarship.countDocuments(query);
        }

        return NextResponse.json({
            scholarships,
            pagination: {
                total,
                limit,
                skip,
                hasMore: skip + limit < total,
                currentPage: Math.floor(skip / limit) + 1,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                name,
                hostCountry,
                type,
                provider,
                program,
                search
            }
        }, { status: 200 });

    } catch (error) {
        console.error("GET API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch scholarships" },
            { status: 500 }
        );
    }
}

// DELETE method
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Scholarship ID is required" },
                { status: 400 }
            );
        }

        const deletedScholarship = await Scholarship.findByIdAndDelete(id);

        if (!deletedScholarship) {
            return NextResponse.json(
                { error: "Scholarship not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Scholarship deleted successfully",
            scholarship: {
                id: deletedScholarship._id,
                name: deletedScholarship.name,
                hostCountry: deletedScholarship.hostCountry
            }
        }, { status: 200 });

    } catch (error) {
        console.error("DELETE API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete scholarship" },
            { status: 500 }
        );
    }
}