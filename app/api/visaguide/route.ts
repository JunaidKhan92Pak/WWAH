// app/api/study-steps/route.js - GET and POST endpoints
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import VisaGuide from '@/models/visaGuide';
import { NextRequest } from 'next/server';
import { Country } from '@/models/countries';
import mongoose from 'mongoose';

// GET all study steps
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid university ID" }, { status: 400 });
    }

     const visaguide = await VisaGuide.findById(id).lean();
    return NextResponse.json({
      success: true,
      visaguide,
    });
  } catch (error) {
    console.error("Error fetching study steps:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch study steps",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    
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
      console.log('Error creating visa guide:', error);
      
        console.error('Error creating visa guide:', error);
        return NextResponse.json({ success: false, error: 'Failed to create visa guide' }, { status: 500 });
    }
}