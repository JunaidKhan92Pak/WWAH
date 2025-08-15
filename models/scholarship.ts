// /app/models/scholarship.ts
import mongoose, { Schema, Document } from "mongoose";

// Define interface for type safety
export interface IScholarship extends Document {
  name: string;
  hostCountry: string;
  type?: string;
  provider?: string;
  deadline?: string;
  numberOfScholarships?: number;
  overview?: string;
  programs?: string[];
  minimumRequirements?: string;
  officialLink?: string;
  duration?: {
    general?: string;
    bachelors?: string;
    masters?: string;
    phd?: string;
  };
  benefits?: string[];
  applicableDepartments?: {
    name: string;
    details?: string;
  }[];
  eligibilityCriteria?: {
    criterion: string;
    details?: string;
  }[];
  requiredDocuments?: {
    document: string;
    details?: string;
  }[];
  applicationProcess?: {
    step: string;
    details?: string;
  }[];
  successChances?: {
    academicBackground?: string;
    age?: string;
    englishProficiency?: string;
    gradesAndCGPA?: string;
    nationality?: string;
    workExperience?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define schema with minimal validation
const scholarshipSchema = new Schema(
  {
    // Only essential fields are required
    name: {
      type: String,
      required: [true, "Scholarship name is required"],
      trim: true,
      index: true,
    },
    hostCountry: {
      type: String,
      required: [true, "Host country is required"],
      trim: true,
      index: true,
    },

    // All other fields are optional with minimal constraints
    type: {
      type: String,
      trim: true,
      default: "Not Specified",
    },
    provider: {
      type: String,
      trim: true,
      default: "Not Specified",
    },
    deadline: {
      type: String,
      trim: true,
      default: "",
    },
    numberOfScholarships: {
      type: Number,
      default: 1,
      min: [0, "Number of scholarships cannot be negative"],
    },
    overview: {
      type: String,
      trim: true,
      default: "",
    },
    minimumRequirements: {
      type: String,
      trim: true,
      default: "",
    },
    officialLink: {
      type: String,
      trim: true,
      default: "",
      // Removed URL validation to allow flexible formats
    },

    // Programs and duration - completely flexible
    programs: {
      type: [String],
      default: [],
    },
    duration: {
      general: { type: String, trim: true, default: "" },
      bachelors: { type: String, trim: true, default: "" },
      masters: { type: String, trim: true, default: "" },
      phd: { type: String, trim: true, default: "" },
    },

    // Benefits - flexible array
    benefits: {
      type: [String],
      default: [],
    },

    // Applicable departments - flexible structure
    applicableDepartments: [
      {
        name: { type: String, trim: true },
        details: { type: String, trim: true, default: "" },
      },
    ],

    // Eligibility criteria - flexible structure
    eligibilityCriteria: [
      {
        criterion: { type: String, trim: true },
        details: { type: String, trim: true, default: "" },
      },
    ],

    // Required documents - flexible structure
    requiredDocuments: [
      {
        document: { type: String, trim: true },
        details: { type: String, trim: true, default: "" },
      },
    ],

    // Application process - flexible structure
    applicationProcess: [
      {
        step: { type: String, trim: true },
        details: { type: String, trim: true, default: "" },
      },
    ],
    // Success chances - all optional with no length limits
    successChances: {
      academicBackground: { type: String, trim: true, default: "" },
      age: { type: String, trim: true, default: "" },
      englishProficiency: { type: String, trim: true, default: "" },
      gradesAndCGPA: { type: String, trim: true, default: "" },
      nationality: { type: String, trim: true, default: "" },
      workExperience: { type: String, trim: true, default: "" },
    },
    table: {
      course: [String],
      create_application: [String],
      deadline: [String],
      duration: [String],
      entry_requirements: [String],
      faculty_department: [String],
      scholarship_type: [String],
      teaching_language: [String],
      university: [String],
      countries: [String], // Added for eligible countries
    },
  },
  {
    timestamps: true,
    // Allow additional fields that aren't in schema
    strict: false,
    // Keep version key for optimistic concurrency
    versionKey: "__v",
  }
);

// Essential indexes only
scholarshipSchema.index({ name: 1, hostCountry: 1 }, { unique: true });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ hostCountry: 1 });
scholarshipSchema.index({ createdAt: -1 });

// Simple text index for basic search (optional - won't break if it fails)
try {
  scholarshipSchema.index(
    {
      name: "text",
      overview: "text",
      provider: "text",
    },
    {
      name: "scholarship_text_index",
      background: true, // Create in background to avoid blocking
    }
  );
} catch (error) {
  console.log(
    error,
    "Text index creation skipped - will use regex search fallback"
  );
}

// Minimal pre-save middleware - only clean up critical issues
scholarshipSchema.pre("save", function (next) {
  // Ensure numberOfScholarships is valid
  if (
    this.numberOfScholarships === null ||
    this.numberOfScholarships === undefined ||
    this.numberOfScholarships < 0
  ) {
    this.numberOfScholarships = 1;
  }

  // Clean up empty arrays (optional)
  if (this.programs && Array.isArray(this.programs)) {
    this.programs = this.programs.filter(
      (program) => program && program.toString().trim().length > 0
    );
  }
  if (this.benefits && Array.isArray(this.benefits)) {
    this.benefits = this.benefits.filter(
      (benefit) => benefit && benefit.toString().trim().length > 0
    );
  }

  next();
});

// Simplified pre-update middleware
scholarshipSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ updatedAt: new Date() });
    next();
  }
);

// Simple static methods without complex validation
scholarshipSchema.statics.findByCountry = function (country: string) {
  const regex = new RegExp(country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return this.find({ hostCountry: regex });
};

scholarshipSchema.statics.findByType = function (type: string) {
  return this.find({ type: type });
};

scholarshipSchema.statics.searchScholarships = function (searchTerm: string) {
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedTerm, "i");

  // Try text search first, fallback to regex
  return this.find({
    $or: [
      { name: regex },
      { overview: regex },
      { provider: regex },
      { hostCountry: regex },
    ],
  });
};

// Ensure virtual fields are serialized
scholarshipSchema.set("toJSON", { virtuals: true });
scholarshipSchema.set("toObject", { virtuals: true });

// Handle mongoose model compilation issues
let Scholarship: mongoose.Model<IScholarship>;

try {
  // Try to get existing model
  Scholarship = mongoose.model<IScholarship>("Scholarship");
} catch (error) {
  // Create new model if it doesn't exist
  console.log(error);
  Scholarship = mongoose.model<IScholarship>("Scholarship", scholarshipSchema);
}

export default Scholarship;
