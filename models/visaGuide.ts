// models/visaGuide.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const visaGuide = new mongoose.Schema({
  country_name: { type: String, required: true },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  program: { heading: String, points: [String] },
  register_apply: { heading: String, points: [String] },
  submit_application: { heading: String, points: [String] },
  applicationFee: { heading: String, points: [String] },
  track_application: { heading: String, points: [String] },
  confirmation_enrollment: { heading: String, points: [String] },
  visa_application: { heading: String, points: [String] },
  recive_visa: { heading: String, points: [String] },
  accommodation: { heading: String, points: [String] },
  prepare_arrival: { heading: String, points: [String] },
  attend_orientation: { heading: String, points: [String] },
  faqs: {
    type: [faqSchema],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.visaGuide || mongoose.model('visaGuide', visaGuide);