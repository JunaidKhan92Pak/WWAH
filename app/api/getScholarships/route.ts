import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get("search")?.trim() || "";

        // Get filters from query string and convert to lowercase arrays
        const countryFilter = searchParams.get("countryFilter")
            ?.split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== "") || [];

        const programFilter = searchParams.get("programFilter")
            ?.split(",")
            .map((p) => p.trim().toLowerCase())
            .filter((p) => p !== "") || [];

        const scholarshipTypeFilter = searchParams.get("scholarshipTypeFilter")
            ?.split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t !== "") || [];

        const deadlineFilter = searchParams.get("deadlineFilter")
            ?.split(",")
            .map((d) => d.trim().toLowerCase())
            .filter((d) => d !== "") || [];

        const textSearchSupported = await Scholarship.collection.indexExists("name_text");
        const query: Record<string, unknown> = {};

        if (search) {
            if (textSearchSupported) {
                query.$text = { $search: search };
            } else {
                const escapeRegex = (text: string) =>
                    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
                query.name = { $regex: new RegExp(escapeRegex(search), "i") };
            }
        }

        // Filter by hostCountry using "hostCountry" field from the model
        if (countryFilter.length > 0) {
            query.hostCountry = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
        }

        // Filter by degreeLevel (programs)
        if (programFilter.length > 0) {
            query.degreeLevel = { $regex: new RegExp(programFilter.join("|"), "i") };
        }

        // Filter by scholarshipType (exact match using regex)
        if (scholarshipTypeFilter.length > 0) {
            query.scholarshipType = { $in: scholarshipTypeFilter.map(t => new RegExp(`^${t}$`, "i")) };
        }

        // Filter by deadline (as a string; assumes deadline stored as string)
        if (deadlineFilter.length > 0) {
            query.deadline = { $in: deadlineFilter.map(d => new RegExp(`^${d}$`, "i")) };
        }

        const scholarships = await Scholarship.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Scholarship.countDocuments(query);
        return NextResponse.json({ scholarships, total, page, limit, success: true });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
