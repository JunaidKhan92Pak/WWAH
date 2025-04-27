import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for Course documents
export interface ICourse extends Document {
  countryname: string;
  universityname: string;
  university_id: Types.ObjectId;
  course_id?: string;
  course_link?: string;
  course_title: string;
  required_ielts_score?: string;
  required_pte_score?: string;
  required_toefl_score?: string;
  entry_requirements?: string;
  education_level?: string;
  course_level?: string;
  intake?: string[];
  duration?: string;
  start_date?: string[];
  degree_format?: string;
  location_campus?: string;
  annual_tuition_fee?: { currency: string; amount: number };
  initial_deposit?: string;
  overview?: string;
  course_structure?: string;
  year_1?: string;
  year_2?: string;
  year_3?: string;
  year_4?: string;
  year_5?: string;
  career_opportunity_1?: string;
  career_opportunity_2?: string;
  career_opportunity_3?: string;
  career_opportunity_4?: string;
  career_opportunity_5?: string;
  scholarship_detail?: string;
  scholarship_link?: string;
  funding_link?: string;
  payment_method?: string;
  university_youtube_video?: string;
  city?: string;
  application_fee?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Define the Course Schema
const CourseSchema = new Schema<ICourse>(
  {
    countryname: { type: String, required: true },
    universityname: { type: String, required: true },
    university_id: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
    course_id: { type: String },
    course_link: { type: String },
    course_title: { type: String, required: true },
    required_ielts_score: { type: String },
    required_pte_score: { type: String },
    required_toefl_score: { type: String },
    entry_requirements: { type: String },
    education_level: { type: String },
    course_level: { type: String },
    intake: { type: [String] },
    duration: { type: String },
    start_date: { type: [String] },
    degree_format: { type: String },
    location_campus: { type: String },
    annual_tuition_fee: {
      currency: { type: String, default: "$" },
      amount: { type: Number, default: 0 }
    },
    initial_deposit: { type: String },
    application_fee: { type: String },
    overview: { type: String },
    course_structure: { type: String },
    year_1: { type: String },
    year_2: { type: String },
    year_3: { type: String },
    year_4: { type: String },
    year_5: { type: String },
    career_opportunity_1: { type: String },
    career_opportunity_2: { type: String },
    career_opportunity_3: { type: String },
    career_opportunity_4: { type: String },
    career_opportunity_5: { type: String },
    scholarship_detail: { type: String },
    scholarship_link: { type: String },
    funding_link: { type: String },
    payment_method: { type: String },
    university_youtube_video: { type: String },
    city: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Create separate compound indexes for each uniqueness scenario
// Index for course_link uniqueness
CourseSchema.index({ universityname: 1, countryname: 1, course_link: 1 }, { unique: true, sparse: true });

// Index for course_id uniqueness
CourseSchema.index({ universityname: 1, countryname: 1, course_id: 1 }, { unique: true, sparse: true });

// Index for course_title uniqueness (fallback)
CourseSchema.index({ universityname: 1, countryname: 1, course_title: 1 }, { unique: true });

// Prevent model redefinition error
export const Courses = mongoose.models.Courses || mongoose.model<ICourse>("Courses", CourseSchema);