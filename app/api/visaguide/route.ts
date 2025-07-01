// app/api/study-steps/route.js - GET and POST endpoints
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import VisaGuide from '@/models/visaGuide';
import { NextRequest } from 'next/server';
import { Country } from '@/models/countries';

// GET all study steps
export async function GET() {
    try {
        await connectToDatabase();

        const steps = await VisaGuide.find({ isActive: true })
            .sort({ order: 1, createdAt: 1 });

        return NextResponse.json({
            success: true,
            data: steps
        });

    } catch (error) {
        console.error('Error fetching study steps:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch study steps'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { country_name, faqs = [], ...visaGuideData } = body;

    try {
        await connectToDatabase();

        if (!country_name) {
            return NextResponse.json({ success: false, error: 'country_name is required.' }, { status: 400 });
        }

        const country = await Country.findOne({ country_name: country_name });
        if (!country) {
            return NextResponse.json({ success: false, error: 'Country not found.' }, { status: 404 });
        }

        const newVisaGuide = await VisaGuide.create({
            country_name,
            country_id: country._id,
            ...visaGuideData,
            faqs
        });

        return NextResponse.json({ success: true, visaGuide: newVisaGuide }, { status: 201 });
    } catch (error) {
        console.error('Error creating visa guide:', error);
        return NextResponse.json({ success: false, error: 'Failed to create visa guide' }, { status: 500 });
    }
}