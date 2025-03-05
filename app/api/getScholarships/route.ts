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
        const countryFilter = searchParams.get("countryFilter")
            ?.split(",")
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c !== "") || [];

        const textSearchSupported = await Scholarship.collection.indexExists("name_text");
        const query: Record<string, unknown> = {};
        if (search) {
            if (textSearchSupported) {
                query.$text = { $search: search };
            } else {
                const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
                query.name = { $regex: new RegExp(escapeRegex(search), "i") };
            }
        }
        if (countryFilter.length > 0) {
            query.countryname = { $in: countryFilter.map((c) => new RegExp(`^${c}$`, "i")) };
        }

        const scholarships = await Scholarship.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Scholarship.countDocuments();
        return NextResponse.json({ scholarships, total, page, limit, success: true });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
