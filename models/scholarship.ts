import mongoose, { Schema, models } from 'mongoose';

const ScholarshipSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        hostCountry: { type: String, required: true, trim: true },
        numberOfScholarships: { type: Number, required: true, min: 1 },
        scholarshipType: { type: String, required: true, trim: true },
        deadline: { type: Date, required: true },
        overview: { type: String, required: true, trim: true },
        duration: {
            undergraduate: { type: String, trim: true },
            master: { type: String, trim: true },
            phd: { type: String, trim: true }
        },
        benefits: [{ type: String, trim: true }],
        applicableDepartments: [
            { name: { type: String, trim: true }, details: { type: String, trim: true } }
        ],
        // Now eligibilityCriteria is an array of objects with name and detail
        eligibilityCriteria: [
            {
                name: { type: String, trim: true },
                detail: { type: String, trim: true, default: "" }
            }
        ],
        ageRequirements: [{ type: String, trim: true }],
        requiredDocuments: [
            { name: { type: String, trim: true }, details: { type: String, trim: true } }
        ],
        degreeLevel: { type: String, trim: true }
    },
    { timestamps: true, versionKey: false }
);

const Scholarship = models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);
export default Scholarship;
