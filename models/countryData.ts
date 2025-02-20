import mongoose from 'mongoose';
const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    detail: { type: String, required: true }
});
const universityDocSchema = new mongoose.Schema({
    course_level: { type: String, required: true },
    doc: [documentSchema]  // Array of document objects
});
const countrySchema = new mongoose.Schema({
    countryname: { type: String, required: true },
    embassyDocuments: [documentSchema],  // Array of embassy documents
    universityDocuments: [universityDocSchema]  // Array of university course documents
});
// :octagonal_sign: Fix: Check if the model already exists before creating it
const Country = mongoose.models.Country || mongoose.model('Country', countrySchema);
export default Country;