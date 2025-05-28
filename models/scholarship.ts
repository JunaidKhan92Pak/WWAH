import mongoose, { Schema, Document } from 'mongoose';

// Define interface for type safety
export interface IScholarship extends Document {
    name: string;
    hostCountry: string;
    type: string;
    provider: string;
    deadline: string;
    numberOfScholarships: number;
    overview: string;
    programs: string[];
    minimumRequirements: string;
    officialLink: string;
    duration: {
        general: string;
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
    applicationProcess: {
        step: string;
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
    createdAt: Date;
    updatedAt: Date;
}

// Define schema
const scholarshipSchema = new Schema({
    // Basic information
    name: {
        type: String,
        trim: true,
        index: true,

    },
    hostCountry: {
        type: String,
        trim: true,
        index: true,
    },
    type: {
        type: String,
        trim: true,
        default: 'Not Specified',
        enum: {
            values: ['Fully Funded', 'Partially Funded', 'Merit-Based', 'Need-Based', 'Government-Funded', 'University-Funded', 'Private', 'Not Specified'],
            message: 'Type must be one of the specified values'
        }
    },
    provider: {
        type: String,
        trim: true,
        default: 'Not Specified',
    },
    deadline: {
        type: String,
        trim: true,

    },
    numberOfScholarships: {
        type: Number,
        default: 1,
    },
    overview: {
        type: String,
        trim: true,
    },
    minimumRequirements: {
        type: String,
        trim: true,

    },
    officialLink: {
        type: String,
        trim: true,
        validate: {
            validator: function (v: string) {
                if (!v) return true; // Allow empty
                return /^https?:\/\/.+\..+/.test(v);
            },
            message: 'Official link must be a valid URL starting with http:// or https://'
        },

    },

    // Programs and duration
    programs: [{
        type: String,
        trim: true,

    }],
    duration: {
        general: {
            type: String,
            trim: true,

        },
        bachelors: {
            type: String,
            trim: true,

        },
        masters: {
            type: String,
            trim: true,
        },
        phd: {
            type: String,
            trim: true,

        }
    },

    // Benefits
    benefits: [{
        type: String,
        trim: true,
    }],

    // Applicable departments
    applicableDepartments: [{
        name: {
            type: String,
            trim: true,
        },
        details: {
            type: String,
            trim: true,

        }
    }],

    // Eligibility criteria
    eligibilityCriteria: [{
        criterion: {
            type: String,
            trim: true,
        },
        details: {
            type: String,
            trim: true,

        }
    }],

    // Required documents
    requiredDocuments: [{
        document: {
            type: String,
            trim: true,

        },
        details: {
            type: String,
            trim: true,
        }
    }],

    // Application process
    applicationProcess: [{
        step: {
            type: String,
            trim: true,

        },
        details: {
            type: String,
            trim: true,
        }
    }],

    // Success chances
    successChances: {
        academicBackground: {
            type: String,
            trim: true,
            maxlength: [200, 'Academic background cannot exceed 200 characters']
        },
        age: {
            type: String,
            trim: true,
            maxlength: [50, 'Age requirement cannot exceed 50 characters']
        },
        englishProficiency: {
            type: String,
            trim: true,
            maxlength: [100, 'English proficiency requirement cannot exceed 100 characters']
        },
        gradesAndCGPA: {
            type: String,
            trim: true,
            maxlength: [100, 'Grades/CGPA requirement cannot exceed 100 characters']
        },
        nationality: {
            type: String,
            trim: true,
            maxlength: [200, 'Nationality requirement cannot exceed 200 characters']
        },
        workExperience: {
            type: String,
            trim: true,
            maxlength: [200, 'Work experience requirement cannot exceed 200 characters']
        }
    }
}, {
    timestamps: true,
    // Enable schema modifications for future flexibility
    strict: false,
    // Add version key for optimistic concurrency
    versionKey: '__v'
});

// Indexes for better query performance
scholarshipSchema.index({ name: 1, hostCountry: 1 }, { unique: true });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ provider: 1 });
scholarshipSchema.index({ hostCountry: 1 });
scholarshipSchema.index({ programs: 1 });
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ createdAt: -1 });

// Text index for search functionality
scholarshipSchema.index({
    name: 'text',
    overview: 'text',
    'eligibilityCriteria.details': 'text',
    'benefits': 'text'
}, {
    name: 'scholarship_text_index',
    weights: {
        name: 10,
        overview: 5,
        'eligibilityCriteria.details': 3,
        'benefits': 2
    }
});

// Virtual for formatted deadline
scholarshipSchema.virtual('formattedDeadline').get(function () {
    if (!this.deadline) return 'Not specified';
    return this.deadline;
});

// Virtual for total benefits count
scholarshipSchema.virtual('benefitsCount').get(function () {
    return this.benefits ? this.benefits.length : 0;
});

// Virtual for total eligibility criteria count
scholarshipSchema.virtual('eligibilityCriteriaCount').get(function () {
    return this.eligibilityCriteria ? this.eligibilityCriteria.length : 0;
});

// Pre-save middleware for data cleaning
scholarshipSchema.pre('save', function (next) {
    // Clean up empty strings in arrays
    if (this.programs) {
        this.programs = this.programs.filter(program => program && program.trim().length > 0);
    }
    if (this.benefits) {
        this.benefits = this.benefits.filter(benefit => benefit && benefit.trim().length > 0);
    }

    // Ensure numberOfScholarships is valid
    if (this.numberOfScholarships <= 0) {
        this.numberOfScholarships = 1;
    }

    next();
});

// Pre-update middleware
scholarshipSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

// Instance methods
scholarshipSchema.methods.isFullyFunded = function () {
    return this.type === 'Fully Funded';
};

scholarshipSchema.methods.hasDeadlinePassed = function () {
    if (!this.deadline || this.deadline === 'N/A') return false;
    // This is a simple check - you might want to implement more sophisticated date parsing
    const now = new Date();
    // You would need to implement proper date parsing based on your deadline format
    return false; // Placeholder
};

scholarshipSchema.methods.getEligiblePrograms = function () {
    return (this.programs as string[]).filter((program: string) => program && program.trim().length > 0);
};

// Static methods
scholarshipSchema.statics.findByCountry = function (country: string) {
    return this.find({ hostCountry: new RegExp(country, 'i') });
};

scholarshipSchema.statics.findByType = function (type: string) {
    return this.find({ type: type });
};

scholarshipSchema.statics.findFullyFunded = function () {
    return this.find({ type: 'Fully Funded' });
};

scholarshipSchema.statics.searchScholarships = function (searchTerm: string) {
    return this.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
};

// Ensure virtual fields are serialized
scholarshipSchema.set('toJSON', { virtuals: true });
scholarshipSchema.set('toObject', { virtuals: true });

// Create or get the model
const Scholarship = mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', scholarshipSchema);

export default Scholarship;