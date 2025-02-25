
import mongoose, { Schema, Document } from "mongoose";

interface IVisaStep {
  title: string;
  description?: string[];
}

interface IFAQ {
  question: string;
  answer: string;
}

interface IVisaGuide extends Document {
  country_name: string;
  choose_program: string;
  register_and_apply: string;
  application_fee: string;
  track_application: string;
  accept_offer: string;
  online_interview: string;
  visa_application_process: IVisaStep[];
  submit_application: string;
  await_decision: string;
  Receive_your_visa: string;
  accommodation: string;
  prepare_for_arrival: string;
  collect_your_biometric_residence_permit: string;
  university_enrollment:string;
  faqs: IFAQ[];
}

const VisaGuideSchema = new Schema<IVisaGuide>({
  country_name: { type: String, required: true },
  choose_program: { type: String, required: true },
  register_and_apply: { type: String, required: true },
  application_fee: { type: String, required: true },
  track_application: { type: String, required: true },
  accept_offer: { type: String, required: true },
  online_interview: { type: String, required: true },
  visa_application_process: [
    {
      title: { type: String, required: true },
      description: { type: [String], required: false },
    },
  ],
  submit_application: { type: String, required: true },
  await_decision: { type: String, required: true },
  Receive_your_visa: { type: String, required: true },
  accommodation: { type: String, required: true },
  prepare_for_arrival: { type: String, required: true },
  collect_your_biometric_residence_permit: { type: String, required: true },
  university_enrollment: { type: String, required: true },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

// Ensure unique country_name to prevent duplicate entries
VisaGuideSchema.index({ country_name: 1 }, { unique: true });

// Check if the model already exists before defining
const VisaGuides =
  mongoose.models.VisaGuide ||
  mongoose.model<IVisaGuide>("VisaGuide", VisaGuideSchema);

export { VisaGuides };
