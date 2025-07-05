import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities"; // Your defined University model

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);

  // --- parse params ---
  const countryParam = searchParams.get("country") || "";
  const selectedCountries = countryParam
    .split(",")
    .map(c => c.trim())
    .filter(Boolean);
  const excludeUni = searchParams.get("excludeUni")?.trim();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const skip = (page - 1) * limit;

  // --- build match query ---
  const match: Record<string, unknown> = {};

  if (searchParams.get("search")?.trim()) {
    const term = searchParams.get("search")!;
    const hasTextIndex = await University.collection.indexExists("university_name_text");
    if (hasTextIndex) {
      match.$text = { $search: term };
    } else {
      const esc = (t: string) =>
        t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\s+/g, ".*");
      match.university_name = { $regex: new RegExp(esc(term), "i") };
    }
  }

  if (selectedCountries.length) {
    // strict match or case‑insensitive anchored regex:
    match.country_name = {
      $in: selectedCountries.map(c => new RegExp(`^${c}$`, "i"))
    };
  }

  if (excludeUni) {
    match.university_name = {
      ...(match.university_name || {}),
      $ne: excludeUni
    };
  }

  // --- count and aggregate ---
  const totalCount = await University.countDocuments(match);
  const totalPages = Math.ceil(totalCount / limit);

  const universities = await University.aggregate([
    { $match: match },
    { $sample: { size: totalCount } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        university_name: 1,
        qs_world_university_ranking: 1,
        times_higher_education_ranking: 1,
        country_name: 1,
        acceptance_rate: 1,
        "universityImages.banner": 1,
        "universityImages.logo": 1,
        ranking: 1
      }
    }
  ]);

  return NextResponse.json({
    success: true,
    message: "Universities fetched successfully",
    universities,
    totalPages
  }, { status: 200 });
}
