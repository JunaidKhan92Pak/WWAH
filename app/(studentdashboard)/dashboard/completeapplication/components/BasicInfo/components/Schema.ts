import { z } from "zod";

export const formSchema = z
  .object({
    // Personal Information
    familyName: z
      .string()
      .min(2, { message: "Family name must be at least 2 characters." })
      .max(50, { message: "Family name must be under 50 characters." })
      .or(z.literal("")), // allows empty string if not required

    givenName: z
      .string()
      .max(50, { message: "Given name must be under 50 characters." })
      .optional(),

    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
      required_error: "Please select your gender.",
    }),

    DOB: z.preprocess(
      (v) => (v === "" ? null : v),
      z.date({ required_error: "Date of Birth is" }).nullable()
    ),

    nationality: z
      .string()
      .min(1, { message: "Please select your nationality." })
      .max(100, { message: "Nationality must be under 100 characters." }),

    countryOfResidence: z
      .string()
      .min(1, { message: "Please select your country of residence." })
      .max(100, {
        message: "Country of residence must be under 100 characters.",
      }),

    maritalStatus: z.enum(
      ["Single", "Married", "Divorced", "Widowed", "Separated", "Other"],
      {
        required_error: "Please select your marital status.",
      }
    ),

    religion: z
      .string()
      .max(100, { message: "Religion must be under 100 characters." })
      .optional(),

    nativeLanguage: z
      .string()
      .max(100, { message: "Native language must be under 100 characters." })
      .optional(),

    // Contact Details
    currentAddress: z
      .string()
      .min(5, { message: "Home address must be at least 5 characters." })
      .max(100, { message: "Home address must be under 100 characters." })
      .or(z.literal("")),

    permanentAddress: z
      .string()
      .min(5, { message: "Detailed address must be at least 5 characters." })
      .max(200, { message: "Detailed address must be under 200 characters." })
      .or(z.literal("")),

    country: z
      .string()
      .min(2, { message: "Country must be at least 2 characters." })
      .max(100, { message: "Country must be under 100 characters." })
      .or(z.literal("")),

    city: z
      .string()
      .min(2, { message: "City must be at least 2 characters." })
      .max(100, { message: "City must be under 100 characters." })
      .or(z.literal("")),

    zipCode: z
      .string()
      .regex(/^[0-9]{4,10}$/, {
        message: "Zip code must be numeric and 4–10 digits long.",
      })
      .or(z.literal("")),

    email: z
      .string()
      .email("Please enter a valid email address.")
      .or(z.literal("")),

    countryCode: z.string().optional(),

    phoneNo: z
      .string()
      .regex(/^[0-9]{6,15}$/, {
        message: "Phone number must be numeric and 6–15 digits long.",
      })
      .or(z.literal("")),

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

  passportNumber: z
    .string()
    .min(6, { message: "Passport number must be at least 6 characters." })
    .max(20, { message: "Passport number must be under 20 characters." })
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Passport number can only contain letters and numbers.",
    })
    .or(z.literal("")),

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
    sponsorName: z.string().refine((val) => val === "" || val.trim() !== "", {
      message: "Please fill in the sponsor's name.",
    }),

    sponsorRelationship: z
      .string()
      .refine((val) => val === "" || val.trim() !== "", {
        message: "Please fill in the sponsor's relationship.",
      }),

    sponsorsNationality: z
      .string()
      .refine((val) => val === "" || val.trim() !== "", {
        message: "Please fill in the sponsor's nationality.",
      }),

    sponsorsOccupation: z
      .string()
      .refine((val) => val === "" || val.trim() !== "", {
        message: "Please fill in the sponsor's occupation.",
      }),

    sponsorsEmail: z.string().optional(),

    sponsorsCountryCode: z.string().optional(),

    sponsorsPhoneNo: z
      .string()
      .refine((val) => val === "" || /^[0-9]{6,15}$/.test(val), {
        message: "Please fill in a valid phone number.",
      }),

    // Family Members
    familyMembers: z
      .array(
        z.object({
          name: z.string().optional(),
          relationship: z.string().optional(),
          nationality: z.string().optional(),
          occupation: z.string().optional(),
          email: z.string().optional(),
          countryCode: z.string().optional(),
          phoneNo: z.string().optional(),
        })
      )
      .optional(),

    // Form control flags
    isFamilyNameEmpty: z.boolean().optional(),
    isGivenNameEmpty: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.hasPassport === true) {
        return (
          data.passportNumber !== "" &&
          data.passportNumber.length >= 6 &&
          data.passportExpiryDate !== undefined
        );
      }
      return true;
    },
    {
      message: "Passport number and expiry date are required when you have a passport",
      path: ["passportNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.hasPassport === true && data.passportExpiryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.passportExpiryDate >= today;
      }
      return true;
    },
    {
      message: "Passport expiry date must be in the future",
      path: ["passportExpiryDate"],
    }
  )
  .refine(
    (data) => {
      // If isGivenNameEmpty is false (unchecked), then givenName is required
      if (data.isGivenNameEmpty === false) {
        return data.givenName && data.givenName.trim().length >= 1;
      }
      return true;
    },
    {
      message: "Please enter your given name.",
      path: ["givenName"],
    }
  );

// Type for use in components
export type FormValues = z.infer<typeof formSchema>;

// Debug: Schema updated to make religion and nativeLanguage optional
