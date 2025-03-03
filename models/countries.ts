import mongoose, { Schema, Document } from "mongoose";

interface ICountry extends Document {
  country_name: string;
  short_name: string;
  capital: string;
  language: string;
  population: number;
  currency: string;
  international_students: number;
  academic_intakes: string;
  dialing_code: number;
  gdp: string;
  why_study: string;
  work_while_studying: string;
  work_after_study: string;
  residency: string;
  popular_programs: string[];
  rent: string;
  groceries: string;
  transportation: string;
  healthcare: string;
  eating_out: string;
  household_bills: string;
  miscellaneous: string;
  // top_universities: string[];
  visa_requirements: string[];
  accomodation_options: string[];
  teaching_and_learning_approach: string[];
  multicultural_environment: string[];
  health: { name: string; location: string }[];
  scholarships: { name: string; details: string }[];
  faqs: { question: string; answer: string }[];
}

const CountrySchema = new Schema<ICountry>({
  country_name: { type: String, required: true },
  short_name: { type: String, required: true },
  capital: { type: String, required: true },
  language: { type: String, required: true },
  population: { type: Number, required: true },
  currency: { type: String, required: true },
  international_students: { type: Number, required: true },
  academic_intakes: { type: String },
  dialing_code: { type: Number, required: true },
  gdp: { type: String, required: true },
  why_study: { type: String, required: true },
  work_while_studying: { type: String, required: true },
  work_after_study: { type: String, required: true },
  residency: { type: String, required: true },
  popular_programs: [{ type: String, required: true }],
  rent: { type: String, required: true },
  groceries: { type: String, required: true },
  transportation: { type: String, required: true },
  healthcare: { type: String, required: true },
  eating_out: { type: String, required: true },
  household_bills: { type: String, required: true },
  miscellaneous: { type: String, required: true },

  // top_universities: [{ type: String }],
  health: [
    {
      name: { type: String, required: true },
      description: [{ type: String, required: true }],
    },
  ],
  scholarships: [{ type: String, required: true }],
  visa_requirements: [{ type: String, required: true }],
  accomodation_options: [
    {
      name: { type: String, required: true },
      detail: { type: String, required: true },
    },
  ],
  teaching_and_learning_approach: [{ type: String, required: true }],
  multicultural_environment: [{ type: String, required: true }],
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

// export default mongoose.model<ICountry>("Country", CountrySchema);
const Country =
  mongoose.models.Country || mongoose.model("Country", CountrySchema);
export { Country };
