// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import { Courses } from "@/models/courses";
// import CountryData from "@/models/countryData";
// import mongoose from "mongoose";
// import { ICourse } from "@/models/courses"; // Import your ICourse interface
// import { University } from "@/models/universities";
// import clientPromise from "@/lib/mongodb"; // Adjust the import path as necessary
// import { Country } from "@/models/countries"; // Ensure this import is correct
// async function getCourseEmbedding(originalId: string) {
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     const collection = db.collection("course_embeddings");

//     const document = await collection.findOne({ originalId }); // exact match by string

//     if (document) {
//         return {
//             text: document.text,
//             embedding: document.embedding,
//             metadata: document.metadata
//         };
//     }
//     return null;
// }

// export async function GET(req: Request) {
//     try {
//         await connectToDatabase();
//         const url = new URL(req.url);
//         const id = url.searchParams.get("id");

//         if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
//         }

//         const courseData = await Courses.findById(id).lean<ICourse | null>();
//         if (!courseData || !courseData._id) {
//             return NextResponse.json({ error: "Course Not Found" }, { status: 404 });
//         }
//         // Pass the course's original _id to the embedding query
//         const courseEmbedding = await getCourseEmbedding(
//             typeof courseData._id === "string" ? courseData._id : courseData._id.toString()
//         );

//         // console.log("Course Embedding Preview:", courseEmbedding?.embedding?.slice(0, 5));
//         const countryData = await CountryData.findOne(
//             { countryname: courseData.countryname.trim() },
//             {
//                 _id: 1,
//                 countryname: 1,
//                 country_id: 1, // Ensure this field is included
//                 embassyDocuments: 1,
//                 universityDocuments: {
//                     $elemMatch: { course_level: { $regex: `${courseData?.course_level?.trim()}`, $options: "i" } },
//                 },
//             }
//         ).lean();
//         const universityData = await University.findById(courseData.university_id).select("universityImages").lean();
//         const costOfLiving = await Country.findOne(
//             { countryname: courseData.countryname.trim() },
//             { rent: 1, groceries: 1, transportation: 1, healthcare: 1, eating_out: 1, household_bills: 1, country_id: 1 }
//         ).lean();
//         if (!countryData || !universityData) {
//             return NextResponse.json({ error: "Country or University Data Not Found" }, { status: 404 });
//         }
//         return NextResponse.json({ courseData, countryData, universityData, courseEmbedding }, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching course data:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import CountryData from "@/models/countryData";
import mongoose from "mongoose";
import { ICourse } from "@/models/courses";
import { University } from "@/models/universities";
import clientPromise from "@/lib/mongodb";
import { Country } from "@/models/countries";

// --- Utility for parsing min values ---
function parseMinValue(value: string): { min: number; currency: string } | null {
    if (!value) return null;

    // Clean value (remove Annually, extra spaces)
    const cleaned = value.replace(/Annually/i, "").trim();

    // Regex: capture symbol/code + min/max numbers
    const match = cleaned.match(/(£|\$|€|[A-Z]{3})(?:\s*-?\s*[A-Za-z]*)?\s*([\d,]+)(?:-([\d,]+))?/);

    if (!match) return null;

    let currency = match[1]; // currency symbol or code
    let min = parseFloat(match[2].replace(/,/g, ""));

    // Convert annual → monthly
    if (/annually/i.test(value)) {
        min = min / 12;
    }

    // Map symbols → ISO codes
    const currencyMap: Record<string, string> = {
        "£": "GBP",
        "$": "USD",
        "€": "EUR",
        "USD": "USD",
        "GBP": "GBP",
        "EUR": "EUR",
        "CAD": "CAD",

    };
    if (currencyMap[currency]) {
        currency = currencyMap[currency];
    }

    return { min, currency };
}


function calculateMinCostOfLiving(costData: { [key: string]: string }) {
    const categories = ["rent", "groceries", "transportation", "healthcare", "eating_out", "household_bills"];

    let amount = 0;
    let currency = "";

    categories.forEach((cat) => {
        const parsed = parseMinValue(costData?.[cat]);
        if (parsed) {
            amount += parsed.min;
            currency = parsed.currency; // assume same currency across all fields
        }
    });

    return {
        amount,
        currency,
    };
}

// --- Embedding function ---
async function getCourseEmbedding(originalId: string) {
    const client = await clientPromise;
    const db = client.db("wwah");
    const collection = db.collection("course_embeddings");

    const document = await collection.findOne({ originalId });
    if (document) {
        return {
            text: document.text,
            embedding: document.embedding,
            metadata: document.metadata,
        };
    }
    return null;
}

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
        }

        const courseData = await Courses.findById(id).lean<ICourse | null>();
        if (!courseData || !courseData._id) {
            return NextResponse.json({ error: "Course Not Found" }, { status: 404 });
        }

        const courseEmbedding = await getCourseEmbedding(
            typeof courseData._id === "string" ? courseData._id : courseData._id.toString()
        );

        const countryData = await CountryData.findOne(
            { countryname: courseData.countryname.trim() },
            {
                _id: 1,
                countryname: 1,
                country_id: 1,
                embassyDocuments: 1,
                universityDocuments: {
                    $elemMatch: { course_level: { $regex: `${courseData?.course_level?.trim()}`, $options: "i" } },
                },
            }
        ).lean();

        const universityData = await University.findById(courseData.university_id)
            .select("universityImages")
            .lean();

        const costData = await Country.findOne(
            {
                $or: [
                    { country_name: courseData.countryname.trim() },
                    { short_name: courseData.countryname.trim().toLowerCase() }
                ]
            },
            { rent: 1, groceries: 1, transportation: 1, healthcare: 1, eating_out: 1, household_bills: 1, country_id: 1 }
        ).lean();
        // console.log("Cost Data:", costData);

        // ✅ Calculate cost of living
        const singleCostData = Array.isArray(costData) ? costData[0] : costData;
        const costOfLiving = singleCostData ? calculateMinCostOfLiving(singleCostData) : null;
        // console.log("Cost of Living:", costOfLiving);
        return NextResponse.json(
            { courseData, countryData, universityData, courseEmbedding, costOfLiving },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching course data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
