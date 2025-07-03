// models/visaGuide.js
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String,},
    answer: { type: String,  },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    heading: { type: String,  },
    points: [{ type: String, }],

  },
  { _id: false }
);

const visaGuide = new mongoose.Schema(
  {
    country_name: { type: String, required: true },
    country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },

    // Replace all hardcoded fields with flexible steps array
    steps: [stepSchema],

    faqs: {
      type: [faqSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.visaGuide ||
  mongoose.model("visaGuide", visaGuide);
