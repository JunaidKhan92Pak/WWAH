import mongoose, { Schema, Document } from "mongoose";

interface ICountry extends Document {
  country_name: string;
  short_name: string;
  capital: string;
  language: string;
  population: number;
  currency: string;
  international_students: string;
  academic_intakes: string;
  dialing_code: number;
  gdp: string;
  why_study: string;
  work_while_studying: string;
  work_after_study: string;
  residency: string[];
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
  country_name: { type: String, },
  short_name: { type: String, },
  capital: { type: String, },
  language: { type: String, },
  population: { type: Number, },
  currency: { type: String, },
  international_students: { type: String },
  academic_intakes: { type: String },
  dialing_code: { type: Number, },
  gdp: { type: String, },
  why_study: { type: String, },
  work_while_studying: { type: String, },
  work_after_study: { type: String, },
  residency: [{ type: String }],
  popular_programs: [{ type: String, }],
  rent: { type: String, },
  groceries: { type: String, },
  transportation: { type: String, },
  healthcare: { type: String, },
  eating_out: { type: String, },
  household_bills: { type: String, },
  miscellaneous: { type: String },

  health: [
    {
      name: { type: String, },
      description: [{ type: String, }],
    },
  ],
  scholarships: [{ type: String, }],
  visa_requirements: [{ type: String, }],
  accomodation_options: [
    {
      name: { type: String, },
      detail: { type: String, },
    },
  ],
  teaching_and_learning_approach: [{ type: String, }],
  multicultural_environment: [{ type: String, }],
  faqs: [
    {
      question: { type: String, },
      answer: { type: String, },
    },
  ],
});

// export default mongoose.model<ICountry>("Country", CountrySchema);
const Country =
  mongoose.models.Country || mongoose.model("Country", CountrySchema);
export { Country };
