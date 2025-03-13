import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import Scholarship from '@/models/scholarship';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Ensure body is an array (for bulk upload)
        const scholarshipsArray = Array.isArray(body) ? body : [body];

        // Transform and map data dynamically, capturing all provided fields
        const scholarships = scholarshipsArray.map(scholarship => {
            const numScholarships = Number(scholarship["Number of Scholarships"]);
            return {
                name: scholarship["Name of Scholarship"]?.trim() || "Unnamed Scholarship",
                hostCountry: scholarship["Host Country"]?.trim() || "Unknown",
                numberOfScholarships: (numScholarships >= 1 ? numScholarships : 1),
                scholarshipType: scholarship["Scholarship Type"]?.trim() || "Not Specified",
                // Store Deadline as a string
                deadline: scholarship["Deadline"] ? String(scholarship["Deadline"]).trim() : "",
                overview: scholarship["Scholarship Overview"]?.trim() || "No overview available",
                duration: {
                    undergraduate: scholarship["Duration of the Scholarship 1"]?.trim() || "",
                    master: scholarship["Duration of the Scholarship 2"]?.trim() || "",
                    phd: scholarship["Duration of the Scholarship 3"]?.trim() || ""
                },
                benefits: Object.keys(scholarship)
                    .filter(key => key.toLowerCase().startsWith("benefits of scholarship"))
                    .map(key => scholarship[key]?.trim())
                    .filter(Boolean),
                applicableDepartments: Object.keys(scholarship)
                    .filter(key => key.toLowerCase().startsWith("applicable departments"))
                    .map(key => ({
                        name: scholarship[key]?.trim() || "Unknown Department",
                        details: scholarship[`Detail ${key.split(' ')[2]}`]?.trim() || "No details available"
                    }))
                    .filter(dep => dep.name !== "Unknown Department"),
                eligibilityCriteria: Object.keys(scholarship)
                    .filter(key => key.toLowerCase().startsWith("eligibility criteria") && !key.toLowerCase().includes("detail"))
                    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                    .map(key => {
                        const criterion = scholarship[key]?.trim() || "";
                        const numMatch = key.match(/Eligibility Criteria (\d+)/i);
                        let detail = "";
                        if (numMatch) {
                            const detailKey = `Eligibility Criteria ${numMatch[1]} Detail`;
                            detail = scholarship[detailKey]?.trim() || "";
                        }
                        return { name: criterion, detail: detail };
                    })
                    .filter(item => item.name),
                ageRequirements: Object.keys(scholarship)
                    .filter(key => key.toLowerCase().startsWith("age requirement"))
                    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                    .map(key => scholarship[key]?.trim())
                    .filter(Boolean),
                requiredDocuments: Object.keys(scholarship)
                    .filter(key => key.toLowerCase().startsWith("required document") && !key.toLowerCase().includes("detail"))
                    .map(key => {
                        const detailKey = Object.keys(scholarship).find(
                            k => k.toLowerCase() === `${key.toLowerCase()} detail`
                        );
                        return {
                            name: scholarship[key]?.trim(),
                            details: detailKey ? scholarship[detailKey]?.trim() : ""
                        };
                    })
                    .filter(doc => doc.name),
                degreeLevel: scholarship["Degree Level"]?.trim() || "",
                // New field Min Requirement
                minRequirement: scholarship["Min Requirement"]?.trim() || ""
            };
        });

        // Upsert each scholarship. Using a combination of "name" and "hostCountry" as unique keys.
        const upsertPromises = scholarships.map(async (scholarshipData) => {
            const filter = {
                name: scholarshipData.name,
                hostCountry: scholarshipData.hostCountry
            };
            const options = { new: true, upsert: true };
            return await Scholarship.findOneAndUpdate(filter, scholarshipData, options);
        });

        const upsertedScholarships = await Promise.all(upsertPromises);
        return NextResponse.json(
            { message: "Scholarships upserted successfully", data: upsertedScholarships },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}
