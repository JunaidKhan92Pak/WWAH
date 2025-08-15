// app/api/addScholarship/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Scholarship from "@/models/scholarship";
import { MongoClient } from "mongodb";
import { DatabaseHooks } from "@/lib/databseHook";

// Complete type definitions
interface Duration {
  general?: string;
  bachelors?: string;
  masters?: string;
  phd?: string;
}

interface EligibilityCriterion {
  criterion: string;
  details: string;
}

interface RequiredDocument {
  document: string;
  details: string;
}

interface ApplicationProcessStep {
  step: string;
  details: string;
}

interface ApplicableDepartment {
  name: string;
  details: string;
}

interface SuccessChances {
  academicBackground: string;
  age: string;
  englishProficiency: string;
  gradesAndCGPA: string;
  nationality: string;
  workExperience: string;
}

interface Table {
  course: string[];
  create_application: string[];
  deadline: string[];
  duration: string[];
  entry_requirements: string[];
  faculty_department: string[];
  scholarship_type: string[];
  teaching_language: string[];
  university: string[];
}

interface TransformedScholarship {
  name: string;
  hostCountry: string;
  type: string;
  provider?: string;
  deadline: string;
  numberOfScholarships: number;
  overview: string;
  programs: string[];
  minimumRequirements: string;
  officialLink?: string;
  duration: Duration;
  benefits: string[];
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: RequiredDocument[];
  applicationProcess?: ApplicationProcessStep[];
  applicableDepartments: ApplicableDepartment[];
  successChances: SuccessChances;
  table?: Table;
  [key: string]: unknown;
}

interface ScholarshipInput {
  name?: unknown;
  hostCountry?: unknown;
  table?: Table;
  [key: string]: unknown;
}

interface MongooseDocument {
  _id: string;
  name: string;
  hostCountry: string;
  type: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions with proper typing (keeping your existing helper functions)
const safeString = (value: unknown, defaultValue = ""): string => {
  if (value === null || value === undefined) return defaultValue;
  return String(value).trim();
};

const safeArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
};

const safeNumberOfScholarships = (value: unknown): number => {
  if (value === null || value === undefined || value === "" || value === "N/A")
    return 1;
  if (typeof value === "number") return value <= 0 ? 1 : value;
  if (typeof value === "string") {
    const parsed = parseInt(value.replace(/\D/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  }
  return 1;
};

const safeDuration = (value: unknown): Duration => {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return {
      general: safeString(obj.general),
      bachelors: safeString(obj.bachelors),
      masters: safeString(obj.masters),
      phd: safeString(obj.phd),
    };
  }
  return {
    general: safeString(value),
    bachelors: "",
    masters: "",
    phd: "",
  };
};

const safeEligibilityCriteria = (value: unknown): EligibilityCriterion[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item: unknown): item is EligibilityCriterion => {
    return (
      item !== null &&
      typeof item === "object" &&
      item !== undefined &&
      "criterion" in item &&
      "details" in item &&
      typeof item.criterion === "string" &&
      typeof item.details === "string"
    );
  });
};

const safeRequiredDocuments = (value: unknown): RequiredDocument[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item: unknown): item is RequiredDocument => {
    return (
      item !== null &&
      typeof item === "object" &&
      item !== undefined &&
      "document" in item &&
      "details" in item &&
      typeof item.document === "string" &&
      typeof item.details === "string"
    );
  });
};

const safeApplicationProcess = (value: unknown): ApplicationProcessStep[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item: unknown): item is ApplicationProcessStep => {
    return (
      item !== null &&
      typeof item === "object" &&
      item !== undefined &&
      "step" in item &&
      "details" in item &&
      typeof item.step === "string" &&
      typeof item.details === "string"
    );
  });
};

const safeApplicableDepartments = (value: unknown): ApplicableDepartment[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item: unknown): ApplicableDepartment | null => {
      if (typeof item === "string") {
        return { name: item.trim(), details: "" };
      }
      if (typeof item === "object" && item !== null && "name" in item) {
        const obj = item as Record<string, unknown>;
        return {
          name: safeString(obj.name),
          details: safeString(obj.details),
        };
      }
      return null;
    })
    .filter(
      (item): item is ApplicableDepartment =>
        item !== null && typeof item.name === "string" && item.name !== ""
    );
};

const safeSuccessChances = (value: unknown): SuccessChances => {
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return {
      academicBackground: safeString(obj.academicBackground),
      age: safeString(obj.age),
      englishProficiency: safeString(obj.englishProficiency),
      gradesAndCGPA: safeString(obj.gradesAndCGPA),
      nationality: safeString(obj.nationality),
      workExperience: safeString(obj.workExperience),
    };
  }
  return {
    academicBackground: "",
    age: "",
    englishProficiency: "",
    gradesAndCGPA: "",
    nationality: "",
    workExperience: "",
  };
};

const validateScholarship = (
  scholarship: ScholarshipInput,
  index: number
): string[] => {
  const errors: string[] = [];

  if (typeof scholarship !== "object" || scholarship === null) {
    errors.push(`Scholarship ${index + 1}: Invalid data format`);
    return errors;
  }

  if (
    !scholarship.name ||
    (typeof scholarship.name === "string" && scholarship.name.trim() === "")
  ) {
    errors.push(`Scholarship ${index + 1}: Name is required`);
  }
  if (
    !scholarship.hostCountry ||
    (typeof scholarship.hostCountry === "string" &&
      scholarship.hostCountry.trim() === "")
  ) {
    errors.push(`Scholarship ${index + 1}: Host country is required`);
  }

  return errors;
};

const transformScholarshipData = (
  scholarship: unknown
): TransformedScholarship => {
  try {
    const data = scholarship as Record<string, unknown>;

    const transformed: TransformedScholarship = {
      name: safeString(data.name),
      hostCountry: safeString(data.hostCountry),
      type: safeString(data.type, "Not Specified"),
      provider: safeString(data.provider, "Not Specified"),
      deadline: safeString(data.deadline),
      numberOfScholarships: safeNumberOfScholarships(data.numberOfScholarships),
      overview: safeString(data.overview),
      programs: safeArray(data.programs)
        .map((p: unknown) => safeString(p))
        .filter((p: string) => p !== ""),
      minimumRequirements: safeString(data.minimumRequirements),
      officialLink: safeString(data.officialLink),
      duration: safeDuration(data.duration),
      benefits: safeArray(data.benefits)
        .map((b: unknown) => safeString(b))
        .filter((b: string) => b !== ""),
      applicableDepartments: safeApplicableDepartments(
        data.applicableDepartments
      ),
      eligibilityCriteria: safeEligibilityCriteria(data.eligibilityCriteria),
      requiredDocuments: safeRequiredDocuments(data.requiredDocuments),
      applicationProcess: safeApplicationProcess(data.applicationProcess),
      successChances: safeSuccessChances(data.successChances),
    };

    // Handle table data
    if (data.table && typeof data.table === "object") {
      const tableData = (data.table as Partial<Table>) || {};
      transformed.table = {
        course: Array.isArray(tableData.course) ? tableData.course : [],
        create_application: Array.isArray(tableData.create_application)
          ? tableData.create_application
          : [],
        deadline: Array.isArray(tableData.deadline) ? tableData.deadline : [],
        duration: Array.isArray(tableData.duration) ? tableData.duration : [],
        entry_requirements: Array.isArray(tableData.entry_requirements)
          ? tableData.entry_requirements
          : [],
        faculty_department: Array.isArray(tableData.faculty_department)
          ? tableData.faculty_department
          : [],
        scholarship_type: Array.isArray(tableData.scholarship_type)
          ? tableData.scholarship_type
          : [],
        teaching_language: Array.isArray(tableData.teaching_language)
          ? tableData.teaching_language
          : [],
        university: Array.isArray(tableData.university)
          ? tableData.university
          : [],
      };

      if (
        tableData.course &&
        Array.isArray(tableData.course) &&
        transformed.programs.length === 0
      ) {
        transformed.programs = tableData.course.filter(
          (course: string) => course && String(course).trim() !== ""
        );
      }
    }

    return transformed;
  } catch (transformError) {
    console.warn(
      `Data transformation warning: ${
        transformError instanceof Error
          ? transformError.message
          : "Unknown error"
      }`
    );
    return {
      name: "Unknown Scholarship",
      hostCountry: "Unknown Country",
      type: "Not Specified",
      provider: "Not Specified",
      deadline: "",
      numberOfScholarships: 1,
      overview: "",
      programs: [],
      minimumRequirements: "",
      officialLink: "",
      duration: { general: "", bachelors: "", masters: "", phd: "" },
      benefits: [],
      applicableDepartments: [],
      eligibilityCriteria: [],
      requiredDocuments: [],
      applicationProcess: [],
      successChances: {
        academicBackground: "",
        age: "",
        englishProficiency: "",
        gradesAndCGPA: "",
        nationality: "",
        workExperience: "",
      },
    };
  }
};

export async function POST(req: Request) {
  let mongoClient: MongoClient | null = null;

  try {
    // Connect to database
    const dbConnection = connectToDatabase();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout")), 10000)
    );

    await Promise.race([dbConnection, timeoutPromise]);

    // Get MongoDB client for embeddings
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log("📡 Connected to MongoDB for embeddings");

    // Initialize DatabaseHooks
    const dbHooks = new DatabaseHooks(mongoClient, "wwah");

    let body: unknown;
    try {
      body = await req.json();
      console.log("Request body received");
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const scholarshipsArray: unknown[] = Array.isArray(body) ? body : [body];

    if (scholarshipsArray.length === 0) {
      return NextResponse.json(
        { error: "No scholarship data provided" },
        { status: 400 }
      );
    }

    if (scholarshipsArray.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 scholarships allowed per request" },
        { status: 400 }
      );
    }

    try {
      const allErrors: string[] = [];
      scholarshipsArray.forEach((scholarship, index) => {
        const errors = validateScholarship(
          scholarship as ScholarshipInput,
          index
        );
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        console.warn("Validation warnings:", allErrors);
      }

      const results: MongooseDocument[] = [];
      let insertedCount = 0;
      let updatedCount = 0;
      let embeddingSuccessCount = 0;
      let embeddingErrorCount = 0;
      const warnings: string[] = [];
      const embeddingWarnings: string[] = [];

      // Transform scholarships
      const transformedScholarships: TransformedScholarship[] = [];
      for (const scholarship of scholarshipsArray) {
        const transformed = transformScholarshipData(scholarship);
        transformedScholarships.push(transformed);
      }

      console.log(
        `📊 Processing ${scholarshipsArray.length} scholarships with automatic embeddings`
      );

      const batchSize = 20;
      for (
        let batchStart = 0;
        batchStart < transformedScholarships.length;
        batchStart += batchSize
      ) {
        const batch = transformedScholarships.slice(
          batchStart,
          batchStart + batchSize
        );

        for (let i = 0; i < batch.length; i++) {
          try {
            const transformedScholarship = batch[i];

            if (
              !transformedScholarship.name ||
              !transformedScholarship.hostCountry
            ) {
              warnings.push(
                `Skipped scholarship ${
                  batchStart + i + 1
                }: Missing required fields`
              );
              continue;
            }

            const filter = {
              name: transformedScholarship.name,
              hostCountry: transformedScholarship.hostCountry,
            };

            const existingDoc = await Scholarship.findOne(filter);
            const isUpdate = !!existingDoc;

            // Use DatabaseHooks for automatic embedding generation
            let result: MongooseDocument | null = null;

            if (isUpdate) {
              console.log(
                `🔄 Updating scholarship: ${transformedScholarship.name}`
              );

              // Update using DatabaseHooks (this will automatically trigger embedding update)
              await dbHooks.updateDocument("scholarships", filter, {
                $set: transformedScholarship,
              });

              // Get the updated document for response
              result = (await Scholarship.findOne(filter)) as MongooseDocument;
              updatedCount++;
              embeddingSuccessCount++;
            } else {
              console.log(
                `📝 Creating scholarship: ${transformedScholarship.name}`
              );

              // Create using DatabaseHooks (this will automatically trigger embedding creation)
              const createResult = await dbHooks.createDocument(
                "scholarships",
                transformedScholarship
              );

              // Get the created document for response
              result = (await Scholarship.findById(
                createResult.insertedId
              )) as MongooseDocument;
              insertedCount++;
              embeddingSuccessCount++;
            }

            if (result) {
              results.push(result);
              console.log(
                `✅ ${
                  isUpdate ? "Updated" : "Created"
                } scholarship with embeddings: ${result.name}`
              );
            }
          } catch (docError) {
            const errorMessage =
              docError instanceof Error ? docError.message : "Unknown error";

            // Check if it's an embedding-related error
            if (
              errorMessage.includes("embedding") ||
              errorMessage.includes("webhook")
            ) {
              embeddingWarnings.push(
                `Scholarship ${
                  batchStart + i + 1
                }: Embedding error - ${errorMessage}`
              );
              embeddingErrorCount++;

              // Try to save the document without embeddings as fallback
              try {
                const transformedScholarship = batch[i];
                const filter = {
                  name: transformedScholarship.name,
                  hostCountry: transformedScholarship.hostCountry,
                };

                const fallbackResult = (await Scholarship.findOneAndUpdate(
                  filter,
                  transformedScholarship,
                  { new: true, upsert: true, runValidators: false }
                )) as MongooseDocument;

                if (fallbackResult) {
                  results.push(fallbackResult);
                  if (await Scholarship.findOne(filter)) {
                    updatedCount++;
                  } else {
                    insertedCount++;
                  }
                  console.log(
                    `⚠️ Saved scholarship without embeddings: ${fallbackResult.name}`
                  );
                }
              } catch {
                warnings.push(
                  `Document ${
                    batchStart + i + 1
                  }: Complete failure - ${errorMessage}`
                );
              }
            } else {
              warnings.push(`Document ${batchStart + i + 1}: ${errorMessage}`);
            }

            console.warn(`Document processing warning:`, errorMessage);
          }
        }

        // Add small delay between batches to avoid overwhelming the embedding service
        if (batchStart + batchSize < transformedScholarships.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      const statusCode = results.length === 0 ? 400 : 200;

      interface ScholarshipsResponse {
        message: string;
        summary: {
          input: number;
          processed: number;
          inserted: number;
          updated: number;
          skipped: number;
          embeddings: {
            successful: number;
            failed: number;
            total: number;
          };
        };
        scholarships: {
          id: string;
          name: string;
          hostCountry: string;
          type: string;
          provider?: string;
          createdAt: Date;
          updatedAt: Date;
        }[];
        warnings?: string[];
        embeddingWarnings?: string[];
      }

      const response: ScholarshipsResponse = {
        message:
          results.length === transformedScholarships.length
            ? "All scholarships processed successfully with embeddings"
            : `${results.length} out of ${transformedScholarships.length} scholarships processed`,
        summary: {
          input: scholarshipsArray.length,
          processed: results.length,
          inserted: insertedCount,
          updated: updatedCount,
          skipped: transformedScholarships.length - results.length,
          embeddings: {
            successful: embeddingSuccessCount,
            failed: embeddingErrorCount,
            total: embeddingSuccessCount + embeddingErrorCount,
          },
        },
        scholarships: results.map((s) => ({
          id: s._id,
          name: s.name,
          hostCountry: s.hostCountry,
          type: s.type,
          provider: s.provider,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        })),
      };

      // Add warnings if any
      if (warnings.length > 0) {
        response.warnings = warnings.slice(0, 10);
      }

      if (embeddingWarnings.length > 0) {
        response.embeddingWarnings = embeddingWarnings.slice(0, 5);
      }

      return NextResponse.json(response, { status: statusCode });
    } catch (processingError) {
      console.error("Processing Error:", processingError);
      return NextResponse.json(
        {
          error: "Processing error",
          details:
            processingError instanceof Error
              ? processingError.message
              : "Unknown processing error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timeout - please try with fewer records" },
          { status: 408 }
        );
      }
      if (error.message.includes("JSON")) {
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  } finally {
    // Clean up MongoDB connection
    if (mongoClient) {
      try {
        await mongoClient.close();
        console.log("📡 MongoDB connection closed");
      } catch (closeError) {
        console.warn(
          "Warning: Failed to close MongoDB connection:",
          closeError
        );
      }
    }
  }
}
