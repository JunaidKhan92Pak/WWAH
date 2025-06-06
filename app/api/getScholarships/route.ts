import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '9', 10) || 9));

        const search = searchParams.get("search")?.trim() || "";
        const minimumRequirements = searchParams.get("minimumRequirements")?.trim() || "";
        const minimumRequirementsArray = minimumRequirements.split(",").map((req) => req.trim()).filter((req) => req !== "");

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

        const provider = searchParams.get("scholarshipProviders")
            ?.split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t !== "") || [];

        const deadlineFilter = searchParams.get("deadlineFilter")
            ?.split(",")
            .map((d) => d.trim().toLowerCase())
            .filter((d) => d !== "") || [];

        const textSearchSupported = await Scholarship.collection.indexExists("name_text");
        const query: Record<string, unknown> = {};

        // Text search
        if (search) {
            if (textSearchSupported) {
                query.$text = { $search: search };
            } else {
                const escapeRegex = (text: string) =>
                    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, ".*");
                query.name = { $regex: new RegExp(escapeRegex(search), "i") };
            }
        }

        // Country filter
        if (countryFilter.length > 0) {
            query.hostCountry = { $in: countryFilter.map((c) => new RegExp(c, "i")) };
        }

        // Program filter
        if (programFilter.length > 0) {
            query.programs = { $in: programFilter.map(p => new RegExp(p, "i")) };
        }

        // Scholarship type filter
        if (scholarshipTypeFilter.length > 0) {
            query.type = { $in: scholarshipTypeFilter.map(t => new RegExp(`^${t}$`, "i")) };
        }

        // Provider filter - Use correct field
        if (provider.length > 0) {
            query.provider = { $in: provider.map(t => new RegExp(`^${t}$`, "i")) };
        }

        // Minimum requirements - Simplified approach using OR conditions
        if (minimumRequirementsArray.length > 0) {
            const orConditions = [];
            for (const req of minimumRequirementsArray) {
                if (req === "2.5-3.0 CGPA") {
                    orConditions.push({ minimumRequirements: { $regex: /2\.[5-9]|3\.0/i } });
                } else if (req === "3.0-3.5 CGPA") {
                    orConditions.push({ minimumRequirements: { $regex: /3\.[0-5]/i } });
                } else if (req === "3.5 & above CGPA") {
                    orConditions.push({ minimumRequirements: { $regex: /3\.[5-9]|[4-9]\./i } });
                } else if (req === "60-70%") {
                    orConditions.push({ minimumRequirements: { $regex: /6[0-9]%|70%/i } });
                } else if (req === "70-75%") {
                    orConditions.push({ minimumRequirements: { $regex: /7[0-5]%/i } });
                } else if (req === "80% or higher") {
                    orConditions.push({ minimumRequirements: { $regex: /[8-9][0-9]%|higher|above/i } });
                } else {
                    // For other cases like "Excellent Academic Achievement"
                    orConditions.push({ minimumRequirements: { $regex: new RegExp(req, "i") } });
                }
            }

            if (orConditions.length > 0) {
                query.$or = orConditions;
            }
        }

        // Deadline filter
        if (deadlineFilter.length > 0) {
            query.deadline = { $in: deadlineFilter.map(d => new RegExp(d, "i")) };
        }

        console.log('MongoDB Query:', JSON.stringify(query, null, 2)); // Debug log

        const scholarships = await Scholarship.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Scholarship.countDocuments(query);

        return NextResponse.json({
            scholarships,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            success: true
        });

    } catch (error) {
        console.error('Scholarship API Error:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}