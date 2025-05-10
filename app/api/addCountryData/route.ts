import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CountryData from "@/models/countryData";

export async function POST(req: Request) {
    try {
        // Parse incoming request data

        const data = await req.json();
        console.log(data, "countrydata")
        // Validate input
        if (!data || !data.countryname) {
            return NextResponse.json(
                { message: "Invalid input. 'countryname' is required." },
                { status: 400 }
            );
        }
        // Connect to the database
        await connectToDatabase();

        // Find if the country already exists
        const existingCountry = await CountryData.findOne({
            countryname: data.countryname,
        });

        if (existingCountry) {
            // Update the existing country data
            const updatedCountry = await CountryData.findOneAndUpdate(
                { countryname: data.countryname }, // Find the document
                { $set: data }, // Update with new data
                { new: true } // Return updated document
            );
            return NextResponse.json(
                { message: "Country data updated successfully.", updatedCountry },
                { status: 200 }
            );
        } else {
            // Create a new Country document
            const newCountry = new CountryData(data);
            const savedCountry = await newCountry.save();
            console.log(savedCountry, "New Country Added");
            return NextResponse.json(
                { message: "Added new country.", savedCountry },
                { status: 201 }
            );
        }
    }
    catch (error) {
        console.error("Error processing request:", error);
        // Handle server errors
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Failed to process the request.", error: errorMessage },
            { status: 500 }
        );
    }
}
