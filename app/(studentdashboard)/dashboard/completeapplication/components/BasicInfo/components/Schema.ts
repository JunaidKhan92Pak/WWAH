import { z } from "zod";

export const formSchema = z
  .object({
    // Personal Information
    familyName: z
      .string()
      .max(50, { message: "Family name must be under 50 characters." }),
    givenName: z
      .string()
      .min(1, { message: "Given name is required." })
      .max(50, { message: "Given name must be under 50 characters." }),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
      required_error: "Please select your gender.",
    }),

    DOB: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z
        .date({ required_error: "Date of Birth is required." })
        .refine((date) => !!date, { message: "Date of Birth is required." })
    ),

    nationality: z
      .string()
      .min(1, { message: "Please select your nationality." })
      .max(100, { message: "Nationality must be under 100 characters." })
      .nonempty({ message: "Please select your nationality." }),

    countryOfResidence: z
      .string()
      .min(1, { message: "Please select your country of residence." })
      .max(100, {
        message: "Country of residence must be under 100 characters.",
      })
      .nonempty({ message: "Please select your country of residence." }),
    maritalStatus: z.enum(
      ["Single", "Married", "Divorced", "Widowed", "Separated", "Other"],
      { required_error: "Please select your marital status." }
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
      .nonempty({ message: "Home address is required." })
      .min(5, { message: "Home address must be at least 5 characters." })
      .max(100, { message: "Home address must be under 100 characters." }),

    permanentAddress: z
      .string()
      .nonempty({ message: "Detailed address is required." })
      .min(5, { message: "Detailed address must be at least 5 characters." })
      .max(200, { message: "Detailed address must be under 200 characters." }),

    country: z
      .string()
      .nonempty({ message: "Country is required." })
      .min(2, { message: "Country must be at least 2 characters." })
      .max(100, { message: "Country must be under 100 characters." }),

    city: z
      .string()
      .nonempty({ message: "City is required." })
      .min(2, { message: "City must be at least 2 characters." })
      .max(100, { message: "City must be under 100 characters." }),

    zipCode: z
      .string()
      .nonempty({ message: "Zip code is required." })
      .regex(/^[0-9]{4,10}$/, {
        message: "Zip code must be numeric and 4–10 digits long.",
      }),

    email: z
      .string()
      .nonempty({ message: "Email is required." })
      .email("Please enter a valid email address."),

    countryCode: z.string().optional(),

    phoneNo: z
      .string()
      .nonempty({ message: "Phone number is required." })
      .regex(/^[0-9]{6,15}$/, {
        message: "Phone number must be numeric and 6–15 digits long.",
      }),

    // Current Address
    currentCountryCode: z.string().optional(),
    currentPhoneNo: z.string().optional(),

    // Passport Information
    hasPassport: z.boolean().optional(),
    noPassport: z.boolean().optional(),
    passportNumber: z
      .string()
      .max(20, { message: "Passport number must be under 20 characters." })
      .regex(/^[A-Za-z0-9]*$/, {
        message: "Passport number can only contain letters and numbers.",
      })
      .optional(),
    passportExpiryDate: z.date().optional(),
    oldPassportNumber: z.string().optional(),
    oldPassportExpiryDate: z.any().optional(),

    // Study Abroad
    hasStudiedAbroad: z.boolean(),
    visitedCountry: z.string().optional(),
    institution: z.string().optional(),
    visaType: z.string().optional(),
    visaExpiryDate: z.any().optional(),
    durationOfStudyAbroad: z.string().optional(),

    // Sponsor Information (moved out of superRefine)
    sponsorName: z
      .string()
      .trim()
      .min(1, { message: "Please fill in the sponsor's name." }),
    sponsorRelationship: z
      .string()
      .trim()
      .min(1, { message: "Please fill in the sponsor's relationship." }),
    sponsorsNationality: z
      .string()
      .trim()
      .min(1, { message: "Please fill in the sponsor's nationality." }),
    sponsorsOccupation: z
      .string()
      .trim()
      .min(1, { message: "Please fill in the sponsor's occupation." }),

    sponsorsEmail: z.string().email("Please fill in a valid email address."),
    sponsorsCountryCode: z.string().optional(),
    sponsorsPhoneNo: z
      .string()
      .trim()
      .min(1, { message: "Phone number is required." })
      .regex(/^[0-9]{6,15}$/, "Please fill in a valid phone number."),

    // Family Members
    familyMembers: z
      .array(
        z.object({
          name: z.string().min(1, "Name is required"),
          relationship: z.string().min(1, "Relationship is required"),
          nationality: z.string().min(1, "Nationality is required"),
          occupation: z.string().min(1, "Occupation is required"),
          email: z.string().email("Invalid email address"),
          countryCode: z.string().optional(),
          phoneNo: z
            .string()
            .min(9, "Phone number must be at least 9 digits")
            .max(15, "Phone number cannot exceed 15 digits")
            .regex(/^\d+$/, "Only numbers allowed"),
        })
      )
      .optional(),

    // Form control flags
    isFamilyNameEmpty: z.boolean().optional(),
    isGivenNameEmpty: z.boolean().optional(),
  })
  .superRefine((values, ctx) => {
    // ✅ Conditionally require study abroad fields
    if (values.hasStudiedAbroad) {
      if (!values.visitedCountry || values.visitedCountry.trim().length === 0)
        ctx.addIssue({
          path: ["visitedCountry"],
          code: z.ZodIssueCode.custom,
          message: "Please enter the country you visited",
        });

      if (!values.institution || values.institution.trim().length === 0)
        ctx.addIssue({
          path: ["institution"],
          code: z.ZodIssueCode.custom,
          message: "Please enter the institution",
        });

      if (!values.visaType || values.visaType.trim().length === 0)
        ctx.addIssue({
          path: ["visaType"],
          code: z.ZodIssueCode.custom,
          message: "Please enter the visa type",
        });

      if (!values.visaExpiryDate)
        ctx.addIssue({
          path: ["visaExpiryDate"],
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid visa expiry date",
        });

      if (
        !values.durationOfStudyAbroad ||
        values.durationOfStudyAbroad.trim().length === 0
      )
        ctx.addIssue({
          path: ["durationOfStudyAbroad"],
          code: z.ZodIssueCode.custom,
          message: "Please enter the duration of study abroad",
        });
    }
  })
  .refine(
    (data) => {
      if (data.noPassport) return true;
      if (data.hasPassport) {
        return (
          data.passportNumber &&
          data.passportNumber.length >= 6 &&
          data.passportExpiryDate !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Passport number and expiry date are required when you have a passport",
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

export type FormValues = z.infer<typeof formSchema>;
