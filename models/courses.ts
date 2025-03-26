import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for Course documents
export interface ICourse extends Document {
  countryname: string;
  universityname: string;
  university_id: Types.ObjectId;
  course_link: string;
  course_title: string;
  required_ielts_score?: string;
  required_pte_score?: string;
  required_toefl_score?: string;
  entry_requirement?: string;
  education_level?: string;
  course_level?: string;
  intake?: [string];
  duration?: string;
  start_date?: [string];
  degree_format?: string;
  location_campus?: string;
  annual_tuition_fee?: { currency: string; amount: number };
  initial_deposit?: string;
  overview?: string;
  course_structure?: string;
  year_1?: string;
  year_2?: string;
  career_opportunity_1?: string;
  career_opportunity_2?: string;
  career_opportunity_3?: string;
  career_opportunity_4?: string;
  career_opportunity_5?: string;
}

// Define the Course Schema
const CourseSchema = new Schema<ICourse>({
  countryname: { type: String, required: true },
  universityname: { type: String, required: true },
  university_id: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  course_link: { type: String, required: true },
  course_title: { type: String, required: true },
  required_ielts_score: { type: String },
  required_pte_score: { type: String },
  required_toefl_score: { type: String },
  entry_requirement: { type: String },
  education_level: { type: String },
  course_level: { type: String },
  intake: { type: Array },
  duration: { type: String },
  start_date: { type: Array },
  degree_format: { type: String },
  location_campus: { type: String },
  annual_tuition_fee: {
    currency: { type: String },
    amount: { type: Number }
  },
  initial_deposit: { type: String },
  overview: { type: String },
  course_structure: { type: String },
  year_1: { type: String },
  year_2: { type: String },
  career_opportunity_1: { type: String },
  career_opportunity_2: { type: String },
  career_opportunity_3: { type: String },
  career_opportunity_4: { type: String },
  career_opportunity_5: { type: String },
});

// Add an index for uniqueness
CourseSchema.index({ course_link: 1, universityname: 1, countryname: 1 }, { unique: true });

// Prevent model redefinition error
const Courses = mongoose.models.Courses || mongoose.model<ICourse>("Courses", CourseSchema);

// ✅ Use `export type` to avoid isolatedModules issue
export { Courses };
