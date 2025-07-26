import mongoose from "mongoose";
const universitySchema = new mongoose.Schema(
    {
        country_name: { type: String, required: true },
        university_type: { type: String, required: true },
        university_name: { type: String, required: true },
        location: { type: String, required: true },
        university_video: { type: String, default: null },
        virtual_tour: { type: String, default: null },
        establishment_year: { type: String, default: "Unknown" },
        national_students: { type: String, default: "Not Mention" },
        international_students: { type: String, default: "Not Mention" },
        acceptance_rate: { type: String, default: "N/A" },
        distance_from_city: { type: String, default: "N/A" },
        qs_world_university_ranking: { type: String, default: "N/A" },
        times_higher_education_ranking: { type: String, default: "N/A" },
        overview: { type: String, default: "N/A" },
        origin_and_establishment: { type: String, default: "N/A" },
        modern_day_development: { type: String, default: "N/A" },
        our_mission: { type: String, default: "N/A" },
        our_values: [String], // Array of strings for values
        universityImages: {
            banner: String,
            campus_life: String,
            city_life: String,
            logo: String,
            campus_sports_recreation: String,
            campus_accommodation: String,
            campus_transportation: String,
            campus_student_services: String,
            campus_cultural_diversity: String,
            campus_alumni_network: String,
            city_historical_places_1: String,
            city_historical_places_2: String,
            city_historical_places_3: String,
            city_food_and_cafe_1: String,
            city_food_and_cafe_2: String,
            city_food_and_cafe_3: String,
            city_transportation_1: String,
            city_transportation_2: String,
            city_transportation_3: String,
            city_cultures_1: String,
            city_cultures_2: String,
            city_cultures_3: String,
            city_famous_places_1: String,
            city_famous_places_2: String,
            city_famous_places_3: String,
        },
        ranking: [
            {
                name: { type: String },
                detail: { type: String },
            },
        ], // Array of ranking objects
        notable_alumni: [
            {
                name: { type: String },
                profession: { type: String },
                image: { type: String }
            },
        ], // Array of alumni objects
        key_achievements: [String], // Array of strings for achievements
        campus_life: {
            sports_recreation: { type: String, default: "N/A" },
            accommodation: { type: String, default: "N/A" },
            transportation: { type: String, default: "N/A" },
            student_services: { type: String, default: "N/A" },
            cultural_diversity: { type: String, default: "N/A" },
            alumni_network_support: { type: String, default: "N/A" },
        },
        about_city: {
            historical_places: { type: String, default: "N/A" },
            food_and_cafe: { type: String, default: "N/A" },
            transportation: { type: String, default: "N/A" },
            cultures: { type: String, default: "N/A" },
            famous_places_to_visit: [String], // Array of famous places
        },
        faq: [
            {
                question: { type: String },
                answer: { type: String },
            },
        ], // Array of FAQ objects
    },
    { timestamps: true }
);
// Create the model
const University = mongoose.models.University || mongoose.model("University", universitySchema);
export { University };