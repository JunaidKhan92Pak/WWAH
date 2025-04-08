import { z } from "zod";

// ✅ Zod Schema (Validation)
export const formSchema = z.object({
  // Personal Information
  familyName: z.string().optional(),
  givenName: z.string().min(1, { message: "Please enter your given name." }),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    required_error: "Please select your gender.",
  }),
  DOB: z.date().optional(),
  nationality: z.string().nonempty("Please select your nationality."),
  countryOfResidence: z
    .string()
    .nonempty("Please select your country of residence."),
  maritalStatus: z.enum(
    ["Single", "Married", "Divorced", "Widowed", "Separated", "Other"],
    {
      required_error: "Please select your marital status.",
    }
  ),
  religion: z.string().optional(),
  nativeLanguage: z.string().optional(),
  // Contact Details
  homeAddress: z.string().optional(),
  detailedAddress: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  countryCode: z.string().optional(),
  phoneNo: z.string().optional(),

  // Current Address
  currentHomeAddress: z.string().optional(),
  currentDetailedAddress: z.string().optional(),
  currentCountry: z.string().optional(),
  currentCity: z.string().optional(),
  currentZipCode: z.string().optional(),
  currentEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  currentCountryCode: z.string().optional(),
  currentPhoneNo: z.string().optional(),

  // Passport Information
  hasPassport: z.boolean().optional(),
  noPassport: z.boolean().optional(),
  passportNumber: z.string().optional(),
  passportExpiryDate: z.date().optional(),
  oldPassportNumber: z.string().optional(),
  oldPassportExpiryDate: z.date().optional(),

  // Study Abroad
  hasStudiedAbroad: z.boolean().optional(),
  visitedCountry: z.string().optional(),
  studyDuration: z.string().optional(),
  institution: z.string().optional(),
  visaType: z.string().optional(),
  visaExpiryDate: z.date().optional(),
  durationOfStudyAbroad: z.string().optional(),

  // Sponsor Information
  sponsorName: z.string().optional(),
  sponsorRelationship: z.string().optional(),
  sponsorsNationality: z.string().optional(),
  sponsorsOccupation: z.string().optional(),
  sponsorsEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  sponsorsCountryCode: z.string().optional(),
  sponsorsPhoneNo: z.string().optional(),

  // Family Members
  familyMembers: z
    .array(
      z.object({
        name: z.string().optional(),
        relationship: z.string().optional(),
        nationality: z.string().optional(),
        occupation: z.string().optional(),
        email: z
          .string()
          .email("Please enter a valid email address")
          .optional(),
        countryCode: z.string().optional(),
        phoneNo: z.string().optional(),
      })
    )
    .optional(),

  // Form control flags
  isFamilyNameEmpty: z.boolean().optional(),
  isGivenNameEmpty: z.boolean().optional(),
});

// Type for use in components
export type FormValues = z.infer<typeof formSchema>;
