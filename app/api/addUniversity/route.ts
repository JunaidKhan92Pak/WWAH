"use server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { University } from "@/models/universities";
import clientPromise from "@/lib/mongodb";
import { createUniversity, updateUniversity } from "../../../lib/databseHook";
export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    if (!University) {
      return NextResponse.json(
        { message: "Database model not found.", success: false },
        { status: 500 }
      );
    }

    // Parse JSON request
    const data = await req.json();
    console.log("Received Data:", data);

    // Validate input: ensure 'university' is present (as an object or an array)
    if (
    
      !data.university ||
      (typeof data.university !== "object" && !Array.isArray(data.university))
    ) {
      return NextResponse.json(
        {
          message: "Invalid input. University details are required.",
          success: false,
        },
        { status: 400 }
      );
    }

    // If 'university' is an array, extract the first element; otherwise, use the object
    const uni = Array.isArray(data.university)
      ? data.university[0]
      : data.university;
    const universityImages = data.universityImages || {};
    // Prepare university data for insertion/updating
    const universityData = {
      country_name: uni.country_name || "Not specified",
      university_name: uni.university_name || "Not specified",
      location: uni.location || "Not specified",
      university_video: uni.university_video || null,
      virtual_tour: uni.virtual_tour || null,
      establishment_year: uni.establishment_year || "Unknown",
      national_students: uni.national_students || 0,
      international_students: uni.international_students || 0,
      acceptance_rate: uni.acceptance_rate || "N/A",
      distance_from_city: uni.distance_from_city || "N/A",
      qs_world_university_ranking: uni.qs_world_university_ranking || "N/A",
      times_higher_education_ranking:
        uni.times_higher_education_ranking || "N/A",
      overview: uni.overview || "N/A",
      origin_and_establishment: uni.origin_and_establishment || "N/A",
      modern_day_development: uni.modern_day_development || "N/A",
      our_mission: uni.our_mission || "N/A",
      our_values: [
        uni.our_values_1,
        uni.our_values_2,
        uni.our_values_3,
        uni.our_values_4,
      ].filter(Boolean),
      ranking: [
        { name: uni.ranking_1, detail: uni.ranking_1_detail },
        { name: uni.ranking_2, detail: uni.ranking_2_detail },
        { name: uni.ranking_3, detail: uni.ranking_3_detail },
        { name: uni.ranking_4, detail: uni.ranking_4_detail },
      ].filter((rank) => rank.name && rank.detail),
      notable_alumni: [
        uni.notable_alumni_1 && {
          name: uni.notable_alumni_1,
          profession: uni.profession_1,
          image: uni.notable_alumni_1_image,
        },
        uni.notable_alumni_2 && {
          name: uni.notable_alumni_2,
          profession: uni.profession_2,
          image: uni.notable_alumni_2_image,
        },
        uni.notable_alumni_3 && {
          name: uni.notable_alumni_3,
          profession: uni.profession_3,
          image: uni.notable_alumni_3_image,
        },
        uni.notable_alumni_4 && {
          name: uni.notable_alumni_4,
          profession: uni.profession_4,
          image: uni.notable_alumni_4_image,
        },
        uni.notable_alumni_5 && {
          name: uni.notable_alumni_5,
          profession: uni.profession_5,
          image: uni.notable_alumni_5_image,
        },
      ].filter(Boolean),
      key_achievements: [
        uni.key_achievement_1,
        uni.key_achievement_2,
        uni.key_achievement_3,
        uni.key_achievement_4,
        uni.key_achievement_5,
      ].filter(Boolean),
      campus_life: {
        sports_recreation: uni.sports_recreation || "N/A",
        accommodation: uni.accommodation || "N/A",
        transportation: uni.transportation || "N/A",
        student_services: uni.student_services || "N/A",
        cultural_diversity: uni.cultural_diversity || "N/A",
        alumni_network_support: uni.alumni_network_support || "N/A",
      },
      about_city: {
        historical_places: uni.historical_places || "N/A",
        food_and_cafe: uni.food_and_cafe || "N/A",
        transportation: uni.transportation_1 || "N/A",
        cultures: uni.cultures || "N/A",
        famous_places_to_visit: [
          uni.famous_places_to_visit_1,
          uni.famous_places_to_visit_2,
          uni.famous_places_to_visit_3,
        ].filter(Boolean),
      },
      faq: [
        { question: uni.faq_1, answer: uni.faq_1_answer },
        { question: uni.faq_2, answer: uni.faq_2_answer },
        { question: uni.faq_3, answer: uni.faq_3_answer },
        { question: uni.faq_4, answer: uni.faq_4_answer },
        { question: uni.faq_5, answer: uni.faq_5_answer },
        { question: uni.faq_6, answer: uni.faq_6_answer },
      ].filter((faq) => faq.question && faq.answer),
      universityImages,
    };
    // 🆕 GET CLIENT FOR HOOK FUNCTIONS
    const client = await clientPromise;
    // Check if the university already exists (using unique fields: country_name and university_name)
    const existingUniversity = await University.findOne({
      country_name: universityData.country_name,
      university_name: universityData.university_name,
    });

    if (existingUniversity) {
      console.log("Updating existing university with auto-embedding...");
      // Update using Mongoose
      const updatedDoc = await University.findOneAndUpdate(
        {
          country_name: universityData.country_name,
          university_name: universityData.university_name,
        },
        { $set: universityData },
        { new: true }
      );
      // 🆕 TRIGGER EMBEDDING UPDATE using the hook function
      if (updatedDoc) {
        await updateUniversity(
          client,
          updatedDoc._id.toString(),
          universityData
        );
        console.log("✅ University embedding updated automatically");
      }
      // Update the existing university document
      // await University.findOneAndUpdate(
      //   {
      //     country_name: universityData.country_name,
      //     university_name: universityData.university_name,
      //   },
      //   { $set: universityData },
      //   { new: true }
      // );
    } else {
      console.log("Creating new university with auto-embedding...");
      // Create using Mongoose (for your app logic)
      const newUniversity = await University.create(universityData);
      console.log("New university created:", newUniversity._id);

      // 🆕 TRIGGER EMBEDDING CREATION using the hook function
      await createUniversity(client, {
        ...universityData,
        _id: newUniversity._id,
      });
      console.log("✅ University embedding created automatically");
      // Create a new university record
      // await University.create(universityData);
      // console.log("New university created:");
    }

    return NextResponse.json(
      { message: "University data added/updated successfully.", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Failed to process request.",
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}
