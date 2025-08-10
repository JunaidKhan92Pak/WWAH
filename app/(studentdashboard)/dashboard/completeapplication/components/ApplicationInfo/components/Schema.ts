import { z } from "zod";

// ✅ Zod Schema (Validation)
const proficiencyMap = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  fluent: "Fluent",
  native: "Native Speaker",
} as const;
const proficiencyTestMap = {
  ielts: "IELTS",
  toefl: "TOEFL",
  pte: "PTE",
  duolingo: "Duolingo",
  other: "Other"
} as const;

export const formSchema = z.object({
  countryOfStudy: z.string().optional(),
  proficiencyLevel: z
    .string()
    .toLowerCase()
    .refine(val => val in proficiencyMap, {
      message: "Invalid proficiency level",
    })
    .transform(val => proficiencyMap[val as keyof typeof proficiencyMap])
    .optional(),

  proficiencyTest: z
    .string()
    .toLowerCase()
    .refine(val => val in proficiencyTestMap, {
      message: "Invalid proficiency test",
    })
    .transform(val => proficiencyTestMap[val as keyof typeof proficiencyTestMap])
    .optional(),
  overAllScore: z.string()

    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Overall score must be a number between 0 and 999"
    ),
  // proficiencyTest: z.enum(["IELTS", "TOEFL", "PTE", "Duolingo", "Other"]).optional(),

  listeningScore: z.string()
    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Listening score must be a number between 0 and 999"
    ),
  writingScore: z.string()

    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Writing score must be a number between 0 and 999"
    ),
  readingScore: z.string()

    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Reading score must be a number between 0 and 999"
    ),
  speakingScore: z.string()

    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Speaking score must be a number between 0 and 999"
    ),
  standardizedTest: z.string().min(1, "Required"),
  standardizedOverallScore: z.string()

    .refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Overall score must be a number between 0 and 999"
    ),
  standardizedSubScore: z.array(
    z.string().refine(
      val => !val || /^\d{1,3}$/.test(val),
      "Sub-score must be a number between 0 and 999"
    )
  ).optional(),
  educationalBackground: z
    .array(
      z.object({
        highestDegree: z.string().min(1, "Required").optional(),
        subjectName: z
          .string()
          .min(3, {
            message: `Subject name is required & must be at least 3 characters.`,
          }),
        institutionAttended: z
          .string()
          .min(2, { message: `Institution name is required.` }),
        marks: z
          .string()
          .min(1, { message: "Marks/grade is required." })
          .regex(/^\d{1,3}(\.\d{1,2})?$|^A*B*C*D*E*F*$/i, {
            message: "Enter valid marks (number 0-100, or letter A-F).",
          }),
        degreeStartDate: z.coerce.date().optional().nullable(),
        degreeEndDate: z.coerce.date().optional().nullable(),
      })
    )
    .optional(),
  workExperience: z
    .array(
      z.object({
        jobTitle: z.string()
          .min(2, "Job title must be at least 2 characters")
          .max(100, "Job title must not exceed 100 characters")
          .optional(),
        organizationName: z.string()
          .min(2, "Organization name must be at least 2 characters")
          .max(100, "Organization name must not exceed 100 characters")
          .optional(),
        isFullTime: z.boolean().optional(),
        isPartTime: z.boolean().optional(),
        employmentType: z.enum(["fullTime", "partTime"]).optional(),
        from: z.coerce.date()
          .refine(date => date <= new Date(), "Start date cannot be in the future")
          .optional(),
        to: z.coerce.date()
          .refine(date => date <= new Date(), "End date cannot be in the future")
          .optional(),
      })
    )
    .optional(),
});

// Type for use in components
export type FormValues = z.infer<typeof formSchema>;
