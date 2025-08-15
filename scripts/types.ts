// Enhanced interfaces matching embedding-operations.ts
export interface UserProfile {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  successChanceData?: SuccessChance; // For embedded data
}

export interface SuccessChance {
  studyLevel?: string;
  grade?: string;
  gradeType?: string;
  nationality?: string;
  majorSubject?: string;
  workExperience?: string | number;
  livingCosts?: { amount: number; currency: string };
  tuitionFee?: { amount: number; currency: string };
  languageProficiency?: { test: string; score: string | number };
  studyPreferenced?: {
    country?: string;
    degree?: string;
    subject?: string;
  };
  userId?: string;
}

// Types for country data
export interface CountryProfile {
  _id?: string;
  country_name?: string;
  capital?: string;
  language?: string;
  population?: string;
  currency?: string;
  international_students?: string;
  academic_intakes?: string;
  why_study?: string;
  work_while_studying?: string;
  work_after_study?: string;
  rent?: string;
  groceries?: string;
  transportation?: string;
  healthcare?: string;
  eating_out?: string;
  household_bills?: string;
  miscellaneous?: string;
  residency?: string[];
  popular_programs?: string[];
  visa_requirements?: string[];
  accomodation_options?: string[];
  health?: Array<{ name: string; location: string }>;
  scholarships?: Array<{ name: string; details: string }>;
}

export interface CountryDocumentData {
  _id?: string;
  countryname?: string;
  embassyDocuments?: Array<{ name: string; detail?: string }>;
  universityDocuments?: Array<{
    course_level: string;
    doc: Array<{ name: string; detail?: string }>;
  }>;
}
export interface VisaGuide {
  country_name?: string;
  country_id?: string;
  steps?: Array<{ name: string; detail?: string[] }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}
