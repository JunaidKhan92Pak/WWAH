import mongoose, { Schema, Document } from 'mongoose';

// Define interface for type safety
export interface IScholarship extends Document {
    name: string;
    hostCountry: string;
    type: string;
    deadline: string;
    numberOfScholarships: number;
    overview: string;
    programs: string[];
    duration: {
        bachelors: string;
        masters: string;
        phd: string;
    };
    benefits: string[];
    applicableDepartments: {
        name: string;
        details: string;
    }[];
    eligibilityCriteria: {
        criterion: string;
        details: string;
    }[];
    requiredDocuments: {
        document: string;
        details: string;
    }[];
    successChances: {
        academicBackground: string;
        age: string;
        englishProficiency: string;
        gradesAndCGPA: string;
        nationality: string;
        workExperience: string;
    };
    minimumRequirements: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define schema
const scholarshipSchema = new Schema({
    // Basic information
    name: {
        type: String,
        required: [true, 'Scholarship name is required'],
        trim: true,
        index: true
    },
    hostCountry: {
        type: String,
        required: [true, 'Host country is required'],
        trim: true,
        index: true
    },
    type: {
        type: String,
        trim: true,
        default: 'Not Specified'
    },
    deadline: {
        type: String,
        trim: true
    },
    numberOfScholarships: {
        type: Number,
        default: 1,
        min: [1, 'Number of scholarships must be at least 1']
    },
    overview: {
        type: String,
        trim: true
    },

    // Programs and duration
    programs: [{
        type: String,
        trim: true
    }],
    duration: {
        bachelors: {
            type: String,
            trim: true
        },
        masters: {
            type: String,
            trim: true
        },
        phd: {
            type: String,
            trim: true
        }
    },

    // Benefits
    benefits: [{
        type: String,
        trim: true
    }],

    // Applicable departments
    applicableDepartments: [{
        name: {
            type: String,
            trim: true
        },
        details: {
            type: String,
            trim: true
        }
    }],

    // Eligibility criteria
    eligibilityCriteria: [{
        criterion: {
            type: String,
            trim: true
        },
        details: {
            type: String,
            trim: true
        }
    }],

    // Required documents
    requiredDocuments: [{
        document: {
            type: String,
            trim: true
        },
        details: {
            type: String,
            trim: true
        }
    }],

    // Success chances
    successChances: {
        academicBackground: {
            type: String,
            trim: true
        },
        age: {
            type: String,
            trim: true
        },
        englishProficiency: {
            type: String,
            trim: true
        },
        gradesAndCGPA: {
            type: String,
            trim: true
        },
        nationality: {
            type: String,
            trim: true
        },
        workExperience: {
            type: String,
            trim: true
        }
    },

    // Minimum requirements
    minimumRequirements: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    // Enable schema modifications for future flexibility
    strict: false
});

// Add compound index for faster queries
scholarshipSchema.index({ name: 1, hostCountry: 1 }, { unique: true });

// Create or get the model
const Scholarship = mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', scholarshipSchema);

export default Scholarship;