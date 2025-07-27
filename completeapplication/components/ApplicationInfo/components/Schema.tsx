import { z } from "zod";

// ✅ Zod Schema (Validation)
export const formSchema = z.object({
  countryOfStudy: z.string().optional(),
  proficiencyLevel: z.string().optional(),
  overAllScore: z.string().optional(),
  proficiencyTest: z.string().optional(),
  listeningScore: z.string().optional(),
  writingScore: z.string().optional(),
  readingScore: z.string().optional(),
  speakingScore: z.string().optional(),
  standardizedTest: z.string().min(1, "Required"),
  standardizedOverallScore: z.string().optional(),
  standardizedSubScore: z.array(z.string()).optional(),
  educationalBackground: z
    .array(
      z.object({
        highestDegree: z.string().min(1, "Required").optional(),
        subjectName: z.string().optional(),
        institutionAttended: z.string().optional(),
        marks: z.string().optional(),
        degreeStartDate: z.coerce.date().optional(),
        degreeEndDate: z.coerce.date().optional(),
      })
    )
    .optional(),
  workExperience: z
    .array(
      z.object({
        jobTitle: z.string().optional(),
        organizationName: z.string().optional(),
        isFullTime: z.boolean().optional(),
        isPartTime: z.boolean().optional(),
        employmentType: z.enum(["fullTime", "partTime"]).optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      })
    )
    .optional(),
});

// Type for use in components
export type FormValues = z.infer<typeof formSchema>;
