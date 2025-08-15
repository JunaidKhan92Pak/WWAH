// lib/embedding-operations.ts
import {
  CountryDocumentData,
  CountryProfile,
  SuccessChance,
  UserProfile,
} from "@/scripts/types";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";

interface StepData {
  title?: string;
  heading?: string;
  description?: string;
  points?: string[];
  requirements?: string[];
  documents?: string[];
  timeline?: string;
  cost?: string;
  [key: string]: unknown;
}

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});

function truncateText(text: string, maxTokens: number = 2000): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;

  const sentences = text.split(/[.!?]+/);
  let result = "";

  for (const sentence of sentences) {
    if ((result + sentence).length > maxChars) break;
    result += sentence + ". ";
  }

  return result.trim() || text.substring(0, maxChars);
}

// Create combined text content from user data
function createTextContent(
  doc: Record<string, unknown>,
  collectionName: string
): { textContent: string; metadata: Record<string, unknown> } {
  let textContent = "";
  let metadata: Record<string, unknown> = {};

  switch (collectionName) {
    case "visaguides":
      console.log(`🔍 Processing visa guide document:`, {
        country_name: doc.country_name,
        hasSteps: !!doc.steps,
        stepsType: typeof doc.steps,
        stepsLength: Array.isArray(doc.steps) ? doc.steps.length : "Not array",
        allKeys: Object.keys(doc),
      });

      textContent += `Visa Guide: ${doc.country_name || "Unknown Country"}\n`;

      // Process the clean steps array structure
      if (doc.steps && Array.isArray(doc.steps) && doc.steps.length > 0) {
        console.log(`📝 Processing ${doc.steps.length} steps from steps array`);
        textContent += `Visa Application Process:\n`;

        doc.steps.forEach((step: StepData, index: number) => {
          console.log(`📝 Processing step ${index + 1}:`, {
            title: step.title || step.heading,
            hasPoints: !!step.points,
            pointsLength: Array.isArray(step.points) ? step.points.length : 0,
            hasRequirements: !!step.requirements,
            hasDocuments: !!step.documents,
          });

          // Use title or heading
          const stepTitle = step.title || step.heading || `Step ${index + 1}`;
          textContent += `\nStep ${index + 1}: ${stepTitle}\n`;

          // Add description if available
          if (step.description) {
            textContent += `Description: ${step.description}\n`;
          }

          // Add points
          if (step.points && Array.isArray(step.points)) {
            step.points.forEach((point: string, pointIndex: number) => {
              if (point && typeof point === "string") {
                textContent += `  ${pointIndex + 1}. ${point}\n`;
              }
            });
          }

          // Add requirements
          if (step.requirements && Array.isArray(step.requirements)) {
            textContent += `Requirements:\n`;
            step.requirements.forEach((req: string, reqIndex: number) => {
              console.log(reqIndex);
              if (req && typeof req === "string") {
                textContent += `  - ${req}\n`;
              }
            });
          }

          // Add documents
          if (step.documents && Array.isArray(step.documents)) {
            textContent += `Documents:\n`;
            step.documents.forEach((doc: string, docIndex: number) => {
              console.log(docIndex);
              if (doc && typeof doc === "string") {
                textContent += `  - ${doc}\n`;
              }
            });
          }

          // Add timeline and cost if available
          if (step.timeline) {
            textContent += `Timeline: ${step.timeline}\n`;
          }
          if (step.cost) {
            textContent += `Cost: ${step.cost}\n`;
          }
        });
      } else {
        console.log(`⚠️ No valid steps array found`);
        textContent += `No steps available\n`;
      }

      if (doc.requirements && Array.isArray(doc.requirements)) {
        textContent += `\nGeneral Requirements: ${doc.requirements.join(
          ", "
        )}\n`;
      }

      if (doc.processing_time) {
        textContent += `Processing Time: ${doc.processing_time}\n`;
      }

      if (doc.visa_fee) {
        textContent += `Visa Fee: ${doc.visa_fee}\n`;
      }

      if (doc.validity) {
        textContent += `Visa Validity: ${doc.validity}\n`;
      }

      // Log the final text content preview
      console.log(
        `📄 Generated text content (first 500 chars):`,
        textContent.substring(0, 500)
      );

      // Enhanced metadata for visa guides
      metadata = {
        title: `${doc.country_name || "Unknown Country"} Visa Guide`,
        country: doc.country_name || "",
        countryId: doc.country_id || null,
        stepCount: Array.isArray(doc.steps) ? doc.steps.length : 0,
        steps: Array.isArray(doc.steps)
          ? doc.steps.map((step: StepData, index: number) => ({
              stepNumber: index + 1,
              title: step.title || step.heading || `Step ${index + 1}`,
              description: step.description || "",
              pointCount: Array.isArray(step.points) ? step.points.length : 0,
              points: step.points || [],
              requirements: step.requirements || [],
              documents: step.documents || [],
              timeline: step.timeline || "",
              cost: step.cost || "",
            }))
          : [],
        createdAt: doc.createdAt || null,
        updatedAt: doc.updatedAt || null,
        originalDoc: doc,
      };
      break;

    case "universities":
      // ... existing universities case (keep as is)
      textContent += `University: ${doc.university_name || ""}\n`;
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `University Type: ${doc.university_type || ""}\n`;
      textContent += `Location: ${doc.location || ""}\n`;
      textContent += `Ranking: QS World University Ranking ${
        doc.qs_world_university_ranking || "N/A"
      }, Times Higher Education Ranking ${
        doc.times_higher_education_ranking || "N/A"
      }\n`;
      textContent += `Established: ${doc.establishment_year || ""}\n`;
      textContent += `Students: ${doc.national_students || ""} national, ${
        doc.international_students || ""
      } international\n`;
      textContent += `Acceptance Rate: ${doc.acceptance_rate || ""}\n`;
      textContent += `Distance From City: ${doc.distance_from_city || ""}\n`;

      if (doc.overview) {
        textContent += `Overview: ${truncateText(
          typeof doc.overview === "string" ? doc.overview : "",
          500
        )}\n`;
      }
      if (doc.modern_day_development) {
        textContent += `Modern Day Development: ${truncateText(
          typeof doc.modern_day_development === "string"
            ? doc.modern_day_development
            : "",
          500
        )}\n`;
      }
      if (doc.our_mission) {
        textContent += `Mission: ${truncateText(
          typeof doc.our_mission === "string" ? doc.our_mission : "",
          300
        )}\n`;
      }

      // Additional ranking information
      if (doc.ranking && Array.isArray(doc.ranking)) {
        const rankings = doc.ranking
          .map(
            (rank: { name: string; detail: string }) =>
              `${rank.name}: ${rank.detail}`
          )
          .join(", ");
        textContent += `Other Rankings: ${rankings}\n`;
      }

      // Notable alumni
      if (doc.notable_alumni && Array.isArray(doc.notable_alumni)) {
        const alumni = doc.notable_alumni
          .map(
            (alum: { name: string; profession: string }) =>
              `${alum.name} (${alum.profession})`
          )
          .join(", ");
        textContent += `Notable Alumni: ${alumni}\n`;
      }

      // Key achievements
      if (doc.key_achievements && Array.isArray(doc.key_achievements)) {
        textContent += `Key Achievements: ${doc.key_achievements.join(", ")}\n`;
      }

      // About city information
      if (doc.about_city && typeof doc.about_city === "object") {
        const city = doc.about_city as {
          historical_places?: string;
          food_and_cafe?: string;
          transportation?: string;
          cultures?: string;
          famous_places_to_visit?: string[];
        };
        if (city.historical_places) {
          textContent += `Historical Places: ${city.historical_places}\n`;
        }
        if (city.food_and_cafe) {
          textContent += `Food & Cafes: ${city.food_and_cafe}\n`;
        }
        if (city.transportation) {
          textContent += `City Transportation: ${city.transportation}\n`;
        }
        if (city.cultures) {
          textContent += `City Culture: ${city.cultures}\n`;
        }
        if (
          city.famous_places_to_visit &&
          Array.isArray(city.famous_places_to_visit)
        ) {
          textContent += `Famous Places to Visit: ${city.famous_places_to_visit.join(
            ", "
          )}\n`;
        }
      }

      // Enhanced metadata for universities
      metadata = {
        title: doc.university_name || "Untitled University",
        country: doc.country_name || "",
        location: doc.location || "",
        type: doc.university_type || "",
        ranking: {
          qsWorldRanking: doc.qs_world_university_ranking || null,
          timesHigherEducation: doc.times_higher_education_ranking || null,
          otherRankings: doc.ranking || [],
        },
        establishmentYear: doc.establishment_year || null,
        acceptanceRate: doc.acceptance_rate || null,
        studentCount: {
          national: doc.national_students || null,
          international: doc.international_students || null,
        },
        distanceFromCity: doc.distance_from_city || "",
        notableAlumni: doc.notable_alumni || [],
        keyAchievements: doc.key_achievements || [],
        aboutCity: doc.about_city || {},
        originalDoc: doc,
      };
      break;

    case "countries":
      // ... existing countries case (keep as is)
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `Capital: ${doc.capital || ""}\n`;
      textContent += `Language: ${doc.language || ""}\n`;
      textContent += `Population: ${doc.population || ""}\n`;
      textContent += `Currency: ${doc.currency || ""}\n`;
      textContent += `International Students: ${
        doc.international_students || ""
      }\n`;
      textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;

      if (doc.why_study) {
        textContent += `Why Study: ${truncateText(
          typeof doc.why_study === "string" ? doc.why_study : "",
          400
        )}\n`;
      }

      textContent += `Work While Studying: ${doc.work_while_studying || ""}\n`;
      textContent += `Work After Study: ${doc.work_after_study || ""}\n`;

      // Living costs breakdown
      textContent += `Living Costs - Rent: ${doc.rent || ""}, Groceries: ${
        doc.groceries || ""
      }, Transport: ${doc.transportation || ""}\n`;
      textContent += `Healthcare: ${doc.healthcare || ""}, Eating Out: ${
        doc.eating_out || ""
      }\n`;
      textContent += `Household Bills: ${
        doc.household_bills || ""
      }, Miscellaneous: ${doc.miscellaneous || ""}\n`;

      // Residency options
      if (doc.residency && Array.isArray(doc.residency)) {
        textContent += `Residency Options: ${doc.residency.join(", ")}\n`;
      }

      // Popular programs
      if (doc.popular_programs && Array.isArray(doc.popular_programs)) {
        textContent += `Popular Programs: ${doc.popular_programs.join(", ")}\n`;
      }

      // Accommodation options
      if (doc.accomodation_options && Array.isArray(doc.accomodation_options)) {
        textContent += `Accommodation Options: ${doc.accomodation_options.join(
          ", "
        )}\n`;
      }

      // Health information
      if (doc.health && Array.isArray(doc.health)) {
        const healthInfo = doc.health
          .map(
            (h: { name: string; location: string }) =>
              `${h.name} (${h.location})`
          )
          .join(", ");
        textContent += `Health Facilities: ${healthInfo}\n`;
      }

      // Scholarships
      if (doc.scholarships && Array.isArray(doc.scholarships)) {
        const scholarshipInfo = doc.scholarships
          .map(
            (s: { name: string; details: string }) => `${s.name}: ${s.details}`
          )
          .join(" | ");
        textContent += `Available Scholarships: ${scholarshipInfo}\n`;
      }

      // Enhanced metadata for countries
      metadata = {
        title: doc.country_name || "Untitled Country",
        country: doc.country_name || "",
        capital: doc.capital || "",
        language: doc.language || "",
        population: doc.population || null,
        currency: doc.currency || "",
        internationalStudents: doc.international_students || null,
        academicIntakes: doc.academic_intakes || "",
        workRights: {
          whileStudying: doc.work_while_studying || "",
          afterStudy: doc.work_after_study || "",
        },
        livingCosts: {
          rent: doc.rent || null,
          groceries: doc.groceries || null,
          transportation: doc.transportation || null,
          healthcare: doc.healthcare || null,
          eatingOut: doc.eating_out || null,
          householdBills: doc.household_bills || null,
          miscellaneous: doc.miscellaneous || null,
        },
        residency: doc.residency || [],
        popularPrograms: doc.popular_programs || [],
        visaRequirements: doc.visa_requirements || [],
        accommodationOptions: doc.accomodation_options || [],
        health: doc.health || [],
        scholarships: doc.scholarships || [],
        originalDoc: doc,
      };
      break;

    case "courses":
      // ... existing courses case (keep as is) - keeping this unchanged for brevity
      const courseTitle = Array.isArray(doc.course_title)
        ? doc.course_title.join(", ")
        : doc.course_title || "";

      textContent += `Subject: ${courseTitle}\n`;
      textContent += `University: ${doc.universityname || ""}\n`;
      textContent += `Country: ${doc.countryname || ""}\n`;
      textContent += `City: ${doc.city || ""}\n`;
      textContent += `Campus Location: ${doc.location_campus || ""}\n`;
      textContent += `Degree: ${doc.course_level || ""}\n`;
      textContent += `Education Level: ${doc.education_level || ""}\n`;
      textContent += `Duration: ${doc.duration || ""}\n`;
      textContent += `Degree Format: ${doc.degree_format || ""}\n`;
      textContent += `Application Fee: ${doc.application_fee || ""}\n`;

      // Tuition fee
      if (
        doc.annual_tuition_fee &&
        typeof doc.annual_tuition_fee === "object"
      ) {
        const fee = doc.annual_tuition_fee as {
          amount: number;
          currency: string;
        };
        textContent += `Annual Tuition Fee: ${fee.currency} ${
          fee.amount || ""
        }\n`;
      }
      textContent += `Initial Deposit: ${doc.initial_deposit || ""}\n`;

      // Test scores
      const testScores = [];
      if (doc.required_ielts_score)
        testScores.push(`IELTS: ${doc.required_ielts_score}`);
      if (doc.required_pte_score)
        testScores.push(`PTE: ${doc.required_pte_score}`);
      if (doc.required_toefl_score)
        testScores.push(`TOEFL: ${doc.required_toefl_score}`);
      if (testScores.length > 0) {
        textContent += `Required Test Scores: ${testScores.join(", ")}\n`;
      }

      if (doc.entry_requirements) {
        textContent += `Entry Requirements: ${truncateText(
          typeof doc.entry_requirements === "string"
            ? doc.entry_requirements
            : "",
          300
        )}\n`;
      }

      // Intake information
      if (doc.intake && Array.isArray(doc.intake)) {
        textContent += `Intake: ${doc.intake.join(", ")}\n`;
      }

      // Start dates
      if (doc.start_date && Array.isArray(doc.start_date)) {
        textContent += `Start Dates: ${doc.start_date.join(", ")}\n`;
      }

      // Course overview
      if (doc.overview) {
        textContent += `Course Overview: ${truncateText(
          typeof doc.overview === "string" ? doc.overview : "",
          400
        )}\n`;
      }

      // Course structure
      if (doc.course_structure) {
        textContent += `Course Structure: ${truncateText(
          typeof doc.course_structure === "string" ? doc.course_structure : "",
          300
        )}\n`;
      }

      // Year-wise curriculum
      const years = [];
      if (doc.year_1) years.push(`Year 1: ${doc.year_1}`);
      if (doc.year_2) years.push(`Year 2: ${doc.year_2}`);
      if (doc.year_3) years.push(`Year 3: ${doc.year_3}`);
      if (doc.year_4) years.push(`Year 4: ${doc.year_4}`);
      if (doc.year_5) years.push(`Year 5: ${doc.year_5}`);
      if (years.length > 0) {
        textContent += `Curriculum: ${years.join(" | ")}\n`;
      }

      // Career opportunities
      const careers = [
        doc.career_opportunity_1,
        doc.career_opportunity_2,
        doc.career_opportunity_3,
        doc.career_opportunity_4,
        doc.career_opportunity_5,
      ].filter(Boolean);
      if (careers.length > 0) {
        textContent += `Career Opportunities: ${careers.join(", ")}\n`;
      }

      // Enhanced metadata for courses
      metadata = {
        title: courseTitle,
        country: doc.countryname || "",
        city: doc.city || "",
        campusLocation: doc.location_campus || "",
        degree: doc.course_level || "",
        educationLevel: doc.education_level || "",
        subject: courseTitle,
        university: doc.universityname || "",
        duration: doc.duration || "",
        degreeFormat: doc.degree_format || "",
        applicationFee: doc.application_fee || null,
        annualTuitionFee: doc.annual_tuition_fee || null,
        initialDeposit: doc.initial_deposit || "",
        testScores: {
          ielts: doc.required_ielts_score || "",
          pte: doc.required_pte_score || "",
          toefl: doc.required_toefl_score || "",
        },
        entryRequirements: doc.entry_requirements || "",
        intake: doc.intake || [],
        startDates: doc.start_date || [],
        courseStructure: doc.course_structure || "",
        yearWiseCurriculum: {
          year1: doc.year_1 || "",
          year2: doc.year_2 || "",
          year3: doc.year_3 || "",
          year4: doc.year_4 || "",
          year5: doc.year_5 || "",
        },
        careerOpportunities: careers,
        originalDoc: doc,
      };
      break;

    case "scholarships":
      // ... existing scholarships case (keep as is) - keeping unchanged for brevity
      textContent += `Scholarship: ${doc.name || ""}\n`;
      textContent += `Host Country: ${doc.hostCountry || ""}\n`;
      textContent += `Type: ${doc.type || ""}\n`;
      textContent += `Provider: ${doc.provider || ""}\n`;
      textContent += `Deadline: ${doc.deadline || ""}\n`;
      textContent += `Number of Scholarships: ${
        doc.numberOfScholarships || ""
      }\n`;
      textContent += `Minimum Requirements: ${doc.minimumRequirements || ""}\n`;

      if (doc.overview) {
        textContent += `Overview: ${truncateText(
          typeof doc.overview === "string" ? doc.overview : "",
          400
        )}\n`;
      }

      // Duration information
      if (doc.duration && typeof doc.duration === "object") {
        const duration = doc.duration as {
          general?: string;
          bachelors?: string;
          masters?: string;
          phd?: string;
        };
        const durationInfo = [];
        if (duration.general) durationInfo.push(`General: ${duration.general}`);
        if (duration.bachelors)
          durationInfo.push(`Bachelors: ${duration.bachelors}`);
        if (duration.masters) durationInfo.push(`Masters: ${duration.masters}`);
        if (duration.phd) durationInfo.push(`PhD: ${duration.phd}`);
        if (durationInfo.length > 0) {
          textContent += `Duration: ${durationInfo.join(", ")}\n`;
        }
      } else if (doc.duration) {
        textContent += `Duration: ${doc.duration}\n`;
      }

      // Programs
      if (doc.programs && Array.isArray(doc.programs)) {
        textContent += `Programs: ${doc.programs.join(", ")}\n`;
      }

      // Benefits
      if (doc.benefits && Array.isArray(doc.benefits)) {
        textContent += `Benefits: ${doc.benefits.join(", ")}\n`;
      }

      // Applicable departments
      if (
        doc.applicableDepartments &&
        Array.isArray(doc.applicableDepartments)
      ) {
        const departments = doc.applicableDepartments
          .map(
            (dept: { name: string; details: string }) =>
              `${dept.name}${dept.details ? ` (${dept.details})` : ""}`
          )
          .join(", ");
        textContent += `Applicable Departments: ${departments}\n`;
      }

      // Eligibility criteria
      if (doc.eligibilityCriteria && Array.isArray(doc.eligibilityCriteria)) {
        const criteria = doc.eligibilityCriteria
          .map(
            (crit: { criterion: string; details: string }) =>
              `${crit.criterion}${crit.details ? `: ${crit.details}` : ""}`
          )
          .join(" | ");
        textContent += `Eligibility Criteria: ${criteria}\n`;
      }

      // Required documents
      if (doc.requiredDocuments && Array.isArray(doc.requiredDocuments)) {
        const documents = doc.requiredDocuments
          .map(
            (doc: { document: string; details: string }) =>
              `${doc.document}${doc.details ? ` (${doc.details})` : ""}`
          )
          .join(", ");
        textContent += `Required Documents: ${documents}\n`;
      }

      // Application process
      if (doc.applicationProcess && Array.isArray(doc.applicationProcess)) {
        const process = doc.applicationProcess
          .map(
            (step: { step: string; details: string }) =>
              `${step.step}${step.details ? `: ${step.details}` : ""}`
          )
          .join(" | ");
        textContent += `Application Process: ${process}\n`;
      }

      // Success chances
      if (doc.successChances && typeof doc.successChances === "object") {
        const chances = doc.successChances as {
          academicBackground?: string;
          age?: string;
          englishProficiency?: string;
          gradesAndCGPA?: string;
          nationality?: string;
          workExperience?: string;
        };
        const successInfo = [];
        if (chances.academicBackground)
          successInfo.push(`Academic: ${chances.academicBackground}`);
        if (chances.age) successInfo.push(`Age: ${chances.age}`);
        if (chances.englishProficiency)
          successInfo.push(`English: ${chances.englishProficiency}`);
        if (chances.gradesAndCGPA)
          successInfo.push(`Grades: ${chances.gradesAndCGPA}`);
        if (chances.nationality)
          successInfo.push(`Nationality: ${chances.nationality}`);
        if (chances.workExperience)
          successInfo.push(`Work Experience: ${chances.workExperience}`);
        if (successInfo.length > 0) {
          textContent += `Success Chances: ${successInfo.join(", ")}\n`;
        }
      }

      // Enhanced metadata for scholarships
      metadata = {
        title: doc.name || "Untitled Scholarship",
        country: doc.hostCountry || "",
        type: doc.type || "",
        provider: doc.provider || "",
        deadline: doc.deadline || "",
        numberOfScholarships: doc.numberOfScholarships || null,
        minimumRequirements: doc.minimumRequirements || "",
        duration: doc.duration || "",
        programs: doc.programs || [],
        benefits: doc.benefits || [],
        applicableDepartments: doc.applicableDepartments || [],
        eligibilityCriteria: doc.eligibilityCriteria || [],
        requiredDocuments: doc.requiredDocuments || [],
        applicationProcess: doc.applicationProcess || [],
        successChances: doc.successChances || {},
        originalDoc: doc,
      };
      break;

    case "expenses":
      textContent += `Country: ${doc.country_name || ""}\n`;
      textContent += `University: ${doc.university_name || ""}\n`;

      if (doc.lifestyles && Array.isArray(doc.lifestyles)) {
        doc.lifestyles.forEach((lifestyle, index) => {
          if (typeof lifestyle === "object" && lifestyle !== null) {
            const lifestyleObj = lifestyle as {
              type?: string;
              currency?: string;
              rent?: { min: number; max: number } | number;
              groceries?: { min: number; max: number } | number;
              public_transport?: { min: number; max: number } | number;
              utilities?: { min: number; max: number } | number;
              internet?: { min: number; max: number } | number;
              mobile?: { min: number; max: number } | number;
              total_estimated_cost?: { min: number; max: number } | number;
            };

            textContent += `\nLifestyle ${index + 1} - ${
              lifestyleObj.type || "Unknown"
            } (${lifestyleObj.currency || ""})\n`;

            // Helper function to format cost ranges
            const formatCost = (
              cost: { min: number; max: number } | number | undefined
            ): string => {
              if (!cost) return "0";
              if (typeof cost === "number") return cost.toString();
              if (
                typeof cost === "object" &&
                cost.min !== undefined &&
                cost.max !== undefined
              ) {
                return `${cost.min} - ${cost.max}`;
              }
              return "0";
            };

            // Cost breakdown with proper formatting
            if (lifestyleObj.rent) {
              textContent += `Rent: ${formatCost(lifestyleObj.rent)}\n`;
            }
            if (lifestyleObj.groceries) {
              textContent += `Groceries: ${formatCost(
                lifestyleObj.groceries
              )}\n`;
            }
            if (lifestyleObj.public_transport) {
              textContent += `Public Transport: ${formatCost(
                lifestyleObj.public_transport
              )}\n`;
            }
            if (lifestyleObj.utilities) {
              textContent += `Utilities: ${formatCost(
                lifestyleObj.utilities
              )}\n`;
            }
            if (lifestyleObj.internet) {
              textContent += `Internet: ${formatCost(lifestyleObj.internet)}\n`;
            }
            if (lifestyleObj.mobile) {
              textContent += `Mobile: ${formatCost(lifestyleObj.mobile)}\n`;
            }
            if (lifestyleObj.total_estimated_cost) {
              textContent += `Total Estimated Cost: ${formatCost(
                lifestyleObj.total_estimated_cost
              )}\n`;
            }
          }
        });
      }

      // Enhanced metadata for expenses with proper cost formatting
      metadata = {
        title: `${doc.country_name || "Country"} - ${
          doc.university_name || "University"
        } Expenses`,
        country: doc.country_name || "",
        university: doc.university_name || "",
        lifestyles: Array.isArray(doc.lifestyles)
          ? doc.lifestyles.map((lifestyle) => {
              if (typeof lifestyle === "object" && lifestyle !== null) {
                const lifestyleObj = lifestyle as {
                  type?: string;
                  currency?: string;
                  rent?: { min: number; max: number } | number;
                  groceries?: { min: number; max: number } | number;
                  public_transport?: { min: number; max: number } | number;
                  utilities?: { min: number; max: number } | number;
                  internet?: { min: number; max: number } | number;
                  mobile?: { min: number; max: number } | number;
                  total_estimated_cost?: { min: number; max: number } | number;
                };

                // Helper function to normalize cost data
                const normalizeCost = (
                  cost: { min: number; max: number } | number | undefined
                ) => {
                  if (!cost) return { min: 0, max: 0 };
                  if (typeof cost === "number") return { min: cost, max: cost };
                  if (
                    typeof cost === "object" &&
                    cost.min !== undefined &&
                    cost.max !== undefined
                  ) {
                    return { min: cost.min, max: cost.max };
                  }
                  return { min: 0, max: 0 };
                };

                return {
                  type: lifestyleObj.type || "",
                  currency: lifestyleObj.currency || "",
                  costs: {
                    rent: normalizeCost(lifestyleObj.rent),
                    groceries: normalizeCost(lifestyleObj.groceries),
                    publicTransport: normalizeCost(
                      lifestyleObj.public_transport
                    ),
                    utilities: normalizeCost(lifestyleObj.utilities),
                    internet: normalizeCost(lifestyleObj.internet),
                    mobile: normalizeCost(lifestyleObj.mobile),
                    totalEstimatedCost: normalizeCost(
                      lifestyleObj.total_estimated_cost
                    ),
                  },
                };
              }
              return {
                type: "",
                currency: "",
                costs: {
                  rent: { min: 0, max: 0 },
                  groceries: { min: 0, max: 0 },
                  publicTransport: { min: 0, max: 0 },
                  utilities: { min: 0, max: 0 },
                  internet: { min: 0, max: 0 },
                  mobile: { min: 0, max: 0 },
                  totalEstimatedCost: { min: 0, max: 0 },
                },
              };
            })
          : [],
        originalDoc: doc,
      };
      break;
    default:
      metadata = {
        title: "Untitled",
        originalDoc: doc,
      };
      break;
  }

  return { textContent, metadata };
}

// NEW: Create combined text content for country + countryData
function createCombinedCountryTextContent(
  country: CountryProfile,
  countryDocuments: CountryDocumentData[]
): string {
  let textContent = "";

  // Basic country profile from 'countries' collection
  textContent += `Country Profile:\n`;
  textContent += `Country: ${country.country_name || ""}\n`;
  textContent += `Capital: ${country.capital || ""}\n`;
  textContent += `Language: ${country.language || ""}\n`;
  textContent += `Population: ${country.population || ""}\n`;
  textContent += `Currency: ${country.currency || ""}\n`;
  textContent += `International Students: ${
    country.international_students || ""
  }\n`;
  textContent += `Academic Intakes: ${country.academic_intakes || ""}\n`;

  if (country.why_study) {
    textContent += `Why Study: ${truncateText(
      typeof country.why_study === "string" ? country.why_study : "",
      400
    )}\n`;
  }

  textContent += `Work While Studying: ${country.work_while_studying || ""}\n`;
  textContent += `Work After Study: ${country.work_after_study || ""}\n`;

  // Living costs breakdown
  textContent += `Living Costs - Rent: ${country.rent || ""}, Groceries: ${
    country.groceries || ""
  }, Transport: ${country.transportation || ""}\n`;
  textContent += `Healthcare: ${country.healthcare || ""}, Eating Out: ${
    country.eating_out || ""
  }\n`;
  textContent += `Household Bills: ${
    country.household_bills || ""
  }, Miscellaneous: ${country.miscellaneous || ""}\n`;

  // Residency options
  if (country.residency && Array.isArray(country.residency)) {
    textContent += `Residency Options: ${country.residency.join(", ")}\n`;
  }

  // Popular programs
  if (country.popular_programs && Array.isArray(country.popular_programs)) {
    textContent += `Popular Programs: ${country.popular_programs.join(", ")}\n`;
  }

  // Visa requirements
  if (country.visa_requirements && Array.isArray(country.visa_requirements)) {
    textContent += `Visa Requirements: ${country.visa_requirements.join(
      ", "
    )}\n`;
  }

  // Accommodation options
  if (
    country.accomodation_options &&
    Array.isArray(country.accomodation_options)
  ) {
    textContent += `Accommodation Options: ${country.accomodation_options.join(
      ", "
    )}\n`;
  }

  // Health information
  if (country.health && Array.isArray(country.health)) {
    const healthInfo = country.health
      .map(
        (h: { name: string; location: string }) => `${h.name} (${h.location})`
      )
      .join(", ");
    textContent += `Health Facilities: ${healthInfo}\n`;
  }

  // Scholarships
  if (country.scholarships && Array.isArray(country.scholarships)) {
    const scholarshipInfo = country.scholarships
      .map((s: { name: string; details: string }) => `${s.name}: ${s.details}`)
      .join(" | ");
    textContent += `Available Scholarships: ${scholarshipInfo}\n`;
  }

  // Add document requirements from 'countryData' collection
  if (countryDocuments && countryDocuments.length > 0) {
    textContent += `\nDocument Requirements:\n`;

    countryDocuments.forEach((docData, index) => {
      textContent += `\n--- Document Set ${index + 1} ---\n`;

      // Embassy documents
      if (docData.embassyDocuments && docData.embassyDocuments.length > 0) {
        textContent += `Embassy Documents Required:\n`;
        docData.embassyDocuments.forEach((doc) => {
          textContent += `- ${doc.name}`;
          if (doc.detail) {
            textContent += `: ${doc.detail}`;
          }
          textContent += `\n`;
        });
      }

      // University documents by course level
      if (
        docData.universityDocuments &&
        docData.universityDocuments.length > 0
      ) {
        textContent += `University Documents by Course Level:\n`;
        docData.universityDocuments.forEach((courseDoc) => {
          textContent += `${courseDoc.course_level} Level Documents:\n`;
          courseDoc.doc.forEach((doc) => {
            textContent += `  - ${doc.name}`;
            if (doc.detail) {
              textContent += `: ${doc.detail}`;
            }
            textContent += `\n`;
          });
        });
      }
    });
  } else {
    textContent += `\nDocument Requirements: No specific document requirements available\n`;
  }

  return textContent;
}

function createCombinedUserTextContent(
  user: UserProfile,
  successChances: SuccessChance[]
): string {
  let textContent = "";

  // Basic user profile
  textContent += `User Profile:\n`;
  textContent += `ID: ${user._id}\n`;
  textContent += `Name: ${
    user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()
  }\n`;
  textContent += `Email: ${user.email}\n`;

  // Handle both array of success chances AND embedded successChanceData
  let successChanceData = successChances;

  // If user has embedded successChanceData (from Express API), use that
  if (user.successChanceData && !successChances?.length) {
    successChanceData = [user.successChanceData];
  }

  // Academic preferences from success chances
  if (successChanceData && successChanceData.length > 0) {
    textContent += `\nAcademic Profile:\n`;

    successChanceData.forEach((record, index) => {
      textContent += `\n--- Profile ${index + 1} ---\n`;

      // User ID reference
      textContent += `User ID: ${record.userId || ""}\n`;

      // Academic Information
      textContent += `Study Level: ${record.studyLevel || ""}\n`;
      textContent += `Grade: ${record.grade || ""} (${
        record.gradeType || ""
      })\n`;
      textContent += `Nationality: ${record.nationality || ""}\n`;
      textContent += `Major Subject: ${record.majorSubject || ""}\n`;
      textContent += `Work Experience: ${record.workExperience || "0"} years\n`;

      // Financial Information
      if (record.livingCosts) {
        textContent += `Living Budget: ${record.livingCosts.amount || 0} ${
          record.livingCosts.currency || ""
        }\n`;
      }

      if (record.tuitionFee) {
        textContent += `Tuition Budget: ${record.tuitionFee.amount || 0} ${
          record.tuitionFee.currency || ""
        }\n`;
      }

      // Language Proficiency
      if (record.languageProficiency) {
        const test = record.languageProficiency.test || "";
        const score = record.languageProficiency.score || "";
        if (test || score) {
          textContent += `Language Proficiency: ${test} ${score}\n`;
        }
      }

      // Study Preferences
      if (record.studyPreferenced) {
        textContent += `Study Preferences:\n`;
        textContent += `  Preferred Country: ${
          record.studyPreferenced.country || ""
        }\n`;
        textContent += `  Preferred Degree: ${
          record.studyPreferenced.degree || ""
        }\n`;
        textContent += `  Preferred Subject: ${
          record.studyPreferenced.subject || ""
        }\n`;
      }
    });
  } else {
    textContent += `\nAcademic Profile: No success chance data available\n`;
  }

  return textContent;
}

// createEmbeddingForDocument function to handle combined country data
export async function createEmbeddingForDocument(
  document: Record<string, unknown>,
  sourceCollection: string,
  targetCollection: string
) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");
    const embeddingCollection = db.collection(targetCollection);

    let textContent: string;
    let metadata: Record<string, unknown>;
    let embeddingDoc: Record<string, unknown>;
    // Handle combined country embeddings
    // if (
    //   sourceCollection === "countries" ||
    //   sourceCollection === "combined_country_data"
    // ) {
    //   const countryName = document.country_name || document.countryname || "";
    //   const countryId = document._id?.toString() || "";

    //   let countryDocuments = [];

    //   // Check if country data already has embedded document data
    //   if (document.documentData) {
    //     countryDocuments = Array.isArray(document.documentData)
    //       ? document.documentData
    //       : [document.documentData];
    //     console.log(
    //       `📋 Using embedded document data for country ${countryName}`
    //     );
    //   } else {
    //     // Fetch country documents from countryData collection
    //     const countryDataCollection = db.collection("countrydatas");
    //     countryDocuments = await countryDataCollection
    //       .find({
    //         countryname: { $regex: new RegExp(String(countryName), "i") },
    //       })
    //       .toArray();
    //     console.log(
    //       `📋 Fetched ${countryDocuments.length} document sets for country ${countryName}`
    //     );
    //   }

    //   // Create combined text content
    //   textContent = createCombinedCountryTextContent(
    //     document,
    //     countryDocuments
    //   );

    //   console.log(
    //     `📝 Generated text content for country ${countryName}:`,
    //     textContent.substring(0, 200) + "..."
    //   );

    //   metadata = {
    //     title: countryName || "Country Profile",
    //     country: countryName,
    //     capital: document.capital || "",
    //     language: document.language || "",
    //     population: document.population || null,
    //     currency: document.currency || "",
    //     internationalStudents: document.international_students || null,
    //     academicIntakes: document.academic_intakes || "",
    //     workRights: {
    //       whileStudying: document.work_while_studying || "",
    //       afterStudy: document.work_after_study || "",
    //     },
    //     livingCosts: {
    //       rent: document.rent || null,
    //       groceries: document.groceries || null,
    //       transportation: document.transportation || null,
    //       healthcare: document.healthcare || null,
    //       eatingOut: document.eating_out || null,
    //       householdBills: document.household_bills || null,
    //       miscellaneous: document.miscellaneous || null,
    //     },
    //     residency: document.residency || [],
    //     popularPrograms: document.popular_programs || [],
    //     visaRequirements: document.visa_requirements || [],
    //     accommodationOptions: document.accomodation_options || [],
    //     health: document.health || [],
    //     scholarships: document.scholarships || [],
    //     documentRequirements: countryDocuments.map(
    //       (docData: {
    //         embassyDocuments: string;
    //         universityDocuments: string;
    //       }) => ({
    //         embassyDocuments: docData.embassyDocuments || [],
    //         universityDocuments: docData.universityDocuments || [],
    //       })
    //     ),
    //     hasDocumentData: countryDocuments.length > 0,
    //     originalDoc: document,
    //   };

    //   embeddingDoc = {
    //     text: textContent,
    //     embedding: await embeddings.embedQuery(textContent),
    //     countryName: countryName,
    //     sourceCollection: "combined_country_data",
    //     originalId: countryId,
    //     domain: "country",
    //     metadata: metadata,
    //     createdAt: new Date(),
    //     updatedAt: new Date(), // Add updatedAt for tracking
    //   };
    // }
    // Handle user embeddings
    if (
      sourceCollection === "users" ||
      sourceCollection === "combined_user_data" ||
      sourceCollection === "userdbs"
    ) {
      const userId =
        document._id?.toString() || document.userId?.toString() || "";

      let successChances = [];

      // Check if user data already has embedded success chance data
      if (document.successChanceData) {
        successChances = [document.successChanceData];
        console.log(`📊 Using embedded success chance data for user ${userId}`);
      } else {
        // Fetch success chances from database
        const successChanceCollection = db.collection("successchances");
        successChances = await successChanceCollection
          .find({ userId: userId })
          .toArray();
        console.log(
          `📊 Fetched ${successChances.length} success chances for user ${userId}`
        );
      }

      // Create combined text content
      textContent = createCombinedUserTextContent(
        { ...document, _id: userId },
        successChances
      );

      console.log(
        `📝 Generated text content for user ${userId}:`,
        textContent.substring(0, 200) + "..."
      );

      metadata = {
        title:
          `${document.firstName || ""} ${document.lastName || ""}`.trim() ||
          document.name ||
          "User Profile",
        email: document.email || "",
        userId: userId,
        userProfile: {
          firstName: document.firstName || "",
          lastName: document.lastName || "",
          name: document.name || "",
          email: document.email || "",
        },
        successChances: successChances,
        hasSuccessChanceData: successChances.length > 0,
      };

      embeddingDoc = {
        text: textContent,
        embedding: await embeddings.embedQuery(textContent),
        userId: userId,
        sourceCollection: "combined_user_data",
        originalId: userId,
        domain: "user",
        metadata: metadata,
        createdAt: new Date(),
      };
    }
    // Handle combined country embeddings
    else if (
      sourceCollection === "countries" ||
      sourceCollection === "combined_country_data"
    ) {
      const countryName = document.country_name || document.countryname || "";
      const countryId = document._id?.toString() || "";

      let countryDocuments = [];

      // Check if country data already has embedded document data
      if (document.documentData) {
        countryDocuments = Array.isArray(document.documentData)
          ? document.documentData
          : [document.documentData];
        console.log(
          `📋 Using embedded document data for country ${countryName}`
        );
      } else {
        // Fetch country documents from countryData collection
        const countryDataCollection = db.collection("countrydatas");
        countryDocuments = await countryDataCollection
          .find({
            countryname: { $regex: new RegExp(String(countryName), "i") },
          })
          .toArray();
        console.log(
          `📋 Fetched ${countryDocuments.length} document sets for country ${countryName}`
        );
      }

      // Create combined text content
      textContent = createCombinedCountryTextContent(
        document,
        countryDocuments
      );

      console.log(
        `📝 Generated text content for country ${countryName}:`,
        textContent.substring(0, 200) + "..."
      );

      metadata = {
        title: countryName || "Country Profile",
        country: countryName,
        capital: document.capital || "",
        language: document.language || "",
        population: document.population || null,
        currency: document.currency || "",
        internationalStudents: document.international_students || null,
        academicIntakes: document.academic_intakes || "",
        workRights: {
          whileStudying: document.work_while_studying || "",
          afterStudy: document.work_after_study || "",
        },
        livingCosts: {
          rent: document.rent || null,
          groceries: document.groceries || null,
          transportation: document.transportation || null,
          healthcare: document.healthcare || null,
          eatingOut: document.eating_out || null,
          householdBills: document.household_bills || null,
          miscellaneous: document.miscellaneous || null,
        },
        residency: document.residency || [],
        popularPrograms: document.popular_programs || [],
        visaRequirements: document.visa_requirements || [],
        accommodationOptions: document.accomodation_options || [],
        health: document.health || [],
        scholarships: document.scholarships || [],
        documentRequirements: countryDocuments.map(
          (docData: {
            embassyDocuments: string;
            universityDocuments: string;
          }) => ({
            embassyDocuments: docData.embassyDocuments || [],
            universityDocuments: docData.universityDocuments || [],
          })
        ),
        hasDocumentData: countryDocuments.length > 0,
        originalDoc: document,
      };

      embeddingDoc = {
        text: textContent,
        embedding: await embeddings.embedQuery(textContent),
        countryName: countryName,
        sourceCollection: "combined_country_data",
        originalId: countryId,
        domain: "country",
        metadata: metadata,
        createdAt: new Date(),
      };
    }
    // Handle scholarship embeddings with improved metadata
    else if (sourceCollection === "scholarships") {
      const result = createTextContent(document, sourceCollection);
      textContent = result.textContent;
      metadata = result.metadata;

      if (!textContent.trim()) {
        console.log(
          `No text content generated for scholarship: ${document.name}`
        );
        await client.close();
        return;
      }

      const embedding = await embeddings.embedQuery(textContent);

      // Enhanced scholarship embedding document with compound identifier
      embeddingDoc = {
        text: textContent,
        embedding: embedding,
        domain: sourceCollection,
        sourceCollection: sourceCollection,
        originalId: document._id?.toString() || "",
        // Add compound identifier fields for easier querying
        scholarshipName: document.name || "",
        hostCountry: document.hostCountry || "",
        scholarshipProvider: document.provider || "",
        ...metadata,
        metadata: {
          ...metadata,
          // Ensure these are in metadata for deletion queries
          scholarshipName: document.name || "",
          hostCountry: document.hostCountry || "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    // Handle other domain documents (existing code)
    else {
      const result = createTextContent(document, sourceCollection);
      textContent = result.textContent;
      metadata = result.metadata;

      if (!textContent.trim()) {
        console.log(
          `No text content generated for document in ${sourceCollection}`
        );
        await client.close();
        return;
      }

      const embedding = await embeddings.embedQuery(textContent);

      embeddingDoc = {
        text: textContent,
        embedding: embedding,
        domain: sourceCollection,
        sourceCollection: sourceCollection,
        originalId: document._id?.toString() || "",
        ...metadata,
        metadata: metadata,
        createdAt: new Date(),
      };
    }

    // Insert the embedding
    const result = await embeddingCollection.insertOne(embeddingDoc);
    console.log(
      `✅ Created embedding for ${sourceCollection} document:`,
      result.insertedId
    );

    await client.close();
  } catch (error) {
    console.error(
      `❌ Error creating embedding for ${sourceCollection}:`,
      error
    );
    throw error;
  }
}

// Update embedding for a document
export async function updateEmbeddingForDocument(
  documentId: string,
  document: Record<string, unknown>,
  sourceCollection: string,
  targetCollection: string
) {
  try {
    console.log(
      `🔄 Updating embedding for ${sourceCollection} document ${documentId}`
    );

    // Determine the correct ID field and value based on collection type
    let idField = "originalId";
    let idValue = documentId;

    if (
      sourceCollection === "users" ||
      sourceCollection === "combined_user_data"
    ) {
      idField = "userId";
    } else if (
      sourceCollection === "countries" ||
      sourceCollection === "combined_country_data"
    ) {
      idField = "countryName";
      // For countries, we need to use the country name instead of ID
      idValue =
        (typeof document.country_name === "string" && document.country_name) ||
        (typeof document.countryname === "string" && document.countryname) ||
        documentId;

      // Additional check to prevent duplicates for countries
      const client = await MongoClient.connect(process.env.MONGODB_URI!);
      const db = client.db("wwah");
      const embeddingCollection = db.collection(targetCollection);

      // Check if embedding already exists with exact match
      const existingEmbeddings = await embeddingCollection
        .find({
          countryName: { $regex: new RegExp(`^${idValue}$`, "i") }, // Exact match
        })
        .toArray();

      if (existingEmbeddings.length > 0) {
        console.log(
          `🔍 Found ${existingEmbeddings.length} existing embeddings for country ${idValue}, deleting all before update`
        );

        const deleteResult = await embeddingCollection.deleteMany({
          countryName: { $regex: new RegExp(`^${idValue}$`, "i") },
        });

        console.log(
          `🗑️ Deleted ${deleteResult.deletedCount} existing embeddings`
        );
      }

      await client.close();
    } else if (sourceCollection === "scholarships") {
      // For scholarships, use compound identifier (name + hostCountry)
      const scholarshipName = document.name as string;
      const hostCountry = document.hostCountry as string;

      if (scholarshipName && hostCountry) {
        // Delete using compound filter instead of single ID
        await deleteScholarshipEmbedding(
          scholarshipName,
          hostCountry,
          targetCollection
        );
      } else {
        // Fallback to original ID if compound key is not available
        await deleteEmbeddingForDocument(
          documentId,
          targetCollection,
          "originalId"
        );
      }

      // Create new embedding
      await createEmbeddingForDocument(
        document,
        sourceCollection,
        targetCollection
      );

      console.log(
        `✅ Updated scholarship embedding for ${scholarshipName} in ${hostCountry}`
      );
      return;
    }

    // For non-scholarship collections, delete existing and create new
    if (
      sourceCollection !== "countries" &&
      sourceCollection !== "combined_country_data"
    ) {
      await deleteEmbeddingForDocument(idValue, targetCollection, idField);
    }

    // Create new embedding
    await createEmbeddingForDocument(
      document,
      sourceCollection,
      targetCollection
    );

    console.log(
      `✅ Updated embedding for ${sourceCollection} document ${documentId}`
    );
  } catch (error) {
    console.error(
      `❌ Error updating embedding for ${sourceCollection} document ${documentId}:`,
      error
    );
    throw error;
  }
}
export async function deleteScholarshipEmbedding(
  scholarshipName: string,
  hostCountry: string,
  targetCollection: string
) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");
    const embeddingCollection = db.collection(targetCollection);

    // Delete using compound filter matching the scholarship's unique identifier
    const result = await embeddingCollection.deleteMany({
      "metadata.title": scholarshipName,
      "metadata.country": hostCountry,
    });

    console.log(
      `✅ Deleted ${result.deletedCount} scholarship embeddings for "${scholarshipName}" in ${hostCountry}`
    );

    await client.close();
  } catch (error) {
    console.error(
      `❌ Error deleting scholarship embedding for "${scholarshipName}" in ${hostCountry}:`,
      error
    );
    throw error;
  }
}
// Delete embedding for a document
export async function deleteEmbeddingForDocument(
  documentId: string,
  targetCollection: string,
  idField: string = "originalId"
) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");
    const embeddingCollection = db.collection(targetCollection);

    const result = await embeddingCollection.deleteMany({
      [idField]: documentId,
    });

    console.log(
      `✅ Deleted ${result.deletedCount} embeddings for ${targetCollection} document ${documentId}`
    );

    await client.close();
  } catch (error) {
    console.error(
      `❌ Error deleting embedding for ${targetCollection} document ${documentId}:`,
      error
    );
    throw error;
  }
}

// NEW: Function to create visa guide embeddings
export async function createVisaGuideEmbeddings(
  targetCollection: string = "visaguide_embeddings",
  batchSize: number = 5
) {
  console.log(`📋 Creating visa guide embeddings...`);

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");

    // Get all visa guides
    const visaGuidesCollection = db.collection("visaguides");
    const visaGuides = await visaGuidesCollection.find({}).toArray();

    console.log(`📊 Found ${visaGuides.length} visa guides to process`);

    // Process visa guides in batches
    for (let i = 0; i < visaGuides.length; i += batchSize) {
      const batch = visaGuides.slice(i, i + batchSize);

      const promises = batch.map(async (visaGuide) => {
        try {
          await createEmbeddingForDocument(
            visaGuide,
            "visaguides",
            targetCollection
          );
        } catch (error) {
          console.error(
            `❌ Error processing visa guide for ${visaGuide.country_name}:`,
            error
          );
        }
      });

      await Promise.all(promises);

      console.log(
        `✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          visaGuides.length / batchSize
        )}`
      );

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await client.close();
    console.log(`🎉 Completed creating visa guide embeddings!`);
  } catch (error) {
    console.error(`❌ Error creating visa guide embeddings:`, error);
    throw error;
  }
}

// NEW: Function to create combined country embeddings
export async function createCombinedCountryEmbeddings(
  targetCollection: string = "country_embeddings",
  batchSize: number = 5
) {
  console.log(`🌍 Creating combined country embeddings...`);

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db("wwah");

    // Get all countries
    const countriesCollection = db.collection("countries");
    const countries = await countriesCollection.find({}).toArray();

    console.log(`📊 Found ${countries.length} countries to process`);

    // Process countries in batches
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);

      const promises = batch.map(async (country) => {
        try {
          await createEmbeddingForDocument(
            country,
            "combined_country_data",
            targetCollection
          );
        } catch (error) {
          console.error(
            `❌ Error processing country ${country.country_name}:`,
            error
          );
        }
      });

      await Promise.all(promises);

      console.log(
        `✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          countries.length / batchSize
        )}`
      );

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await client.close();
    console.log(`🎉 Completed creating combined country embeddings!`);
  } catch (error) {
    console.error(`❌ Error creating combined country embeddings:`, error);
    throw error;
  }
}

// Batch operations for efficiency
export async function createEmbeddingsForDocuments(
  documents: Record<string, unknown>[],
  sourceCollection: string,
  targetCollection: string,
  batchSize: number = 10
) {
  console.log(
    `🔄 Creating embeddings for ${documents.length} documents in batches of ${batchSize}`
  );

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);

    const promises = batch.map((doc) =>
      createEmbeddingForDocument(doc, sourceCollection, targetCollection)
    );

    await Promise.all(promises);

    console.log(
      `✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        documents.length / batchSize
      )}`
    );

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// NEW: Helper function to create all visa guide embeddings at once
export async function createAllVisaGuideEmbeddings() {
  try {
    console.log(`🚀 Starting visa guide embedding creation process...`);

    // Create embeddings for all visa guides
    await createVisaGuideEmbeddings("visaguide_embeddings", 5);

    console.log(`✅ All visa guide embeddings created successfully!`);
  } catch (error) {
    console.error(`❌ Failed to create visa guide embeddings:`, error);
    throw error;
  }
}

// NEW: Helper function to update a specific visa guide embedding
export async function updateVisaGuideEmbedding(
  visaGuideId: string,
  visaGuideData: Record<string, unknown>
) {
  try {
    console.log(`🔄 Updating embedding for visa guide ${visaGuideId}...`);

    await updateEmbeddingForDocument(
      visaGuideId,
      visaGuideData,
      "visaguides",
      "visaguide_embeddings"
    );

    console.log(`✅ Visa guide embedding updated successfully!`);
  } catch (error) {
    console.error(`❌ Failed to update visa guide embedding:`, error);
    throw error;
  }
}

// NEW: Helper function to delete a specific visa guide embedding
export async function deleteVisaGuideEmbedding(visaGuideId: string) {
  try {
    console.log(`🗑️ Deleting embedding for visa guide ${visaGuideId}...`);

    await deleteEmbeddingForDocument(
      visaGuideId,
      "visaguide_embeddings",
      "originalId"
    );

    console.log(`✅ Visa guide embedding deleted successfully!`);
  } catch (error) {
    console.error(`❌ Failed to delete visa guide embedding:`, error);
    throw error;
  }
}
