import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String },
});
const universityDocSchema = new mongoose.Schema({
  course_level: { type: String, required: true },
  doc: [documentSchema], // Array of document objects
});
const countrySchema = new mongoose.Schema({
  countryname: { type: String, required: true },
  embassyDocuments: [documentSchema], // Array of embassy documents
  universityDocuments: [universityDocSchema], // Array of university course documents
});
// :octagonal_sign: Fix: Check if the model already exists before creating it
const CountryData =
  mongoose.models.CountryData || mongoose.model("CountryData", countrySchema);
export default CountryData;
