import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';
type ScholarshipData = {
    name: string;
}
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

        // Validation function
        const validateScholarship = (scholarship: ScholarshipData) => {
            // Basic validation - add more as needed
            if (!scholarship.name) {
                throw new Error("Scholarship name is required");
            }
            return true;
        };

        // Process bulk upsert with validation
        try {
            // Validate all scholarships first
            scholarshipsArray.forEach(validateScholarship);

            // Create bulk operations
            const upsertPromises = scholarshipsArray.map(async (scholarship) => {
                const filter = {
                    name: scholarship.name,
                    hostCountry: scholarship.hostCountry || "Unknown"
                };

                const options = {
                    new: true,
                    upsert: true,
                    runValidators: true
                };

                return await Scholarship.findOneAndUpdate(filter, scholarship, options);
            });

            const results = await Promise.all(upsertPromises);

            // Count successful operations
            const insertedCount = results.filter(r => r._id && !r.isModified).length;
            const updatedCount = results.filter(r => r._id && r.isModified).length;

            return NextResponse.json({
                message: "Scholarships processed successfully",
                summary: {
                    total: results.length,
                    inserted: insertedCount,
                    updated: updatedCount
                },
                scholarships: results.map(s => ({
                    id: s._id,
                    name: s.name,
                    hostCountry: s.hostCountry
                }))
            }, { status: 200 });

        } catch (validationError) {
            return NextResponse.json(
                { error: "Validation error", details: (validationError as Error).message },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
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