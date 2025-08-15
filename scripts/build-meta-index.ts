// scripts/build-meta-index.ts
import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import clientPromise from "../lib/mongodb";
import {
  CountryDocumentData,
  CountryProfile,
  SuccessChance,
  UserProfile,
} from "./types";

// Environment validation
console.log("🔍 Validating environment...");
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set");
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is not set");
  process.exit(1);
}
console.log("✅ Environment validated");

// Updated collection mapping configuration with visa guides
const COLLECTION_MAPPING = {
  countries: { source: "countries", target: "country_embeddings" },
  universities: { source: "universities", target: "university_embeddings" },
  courses: { source: "courses", target: "course_embeddings" },
  scholarships: { source: "scholarships", target: "scholarship_embeddings" },
  expenses: { source: "expenses", target: "expense_embeddings" },
  visaGuides: { source: "visaguides", target: "visaguide_embeddings" },
};

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

// Enhanced createCombinedUserTextContent function (matching embedding-operations.ts)
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

// Create combined country text content (matching embedding-operations.ts)
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

// Create user embeddings (prioritized first)
export async function createUserEmbeddings() {
  console.log("🚀 Starting user embeddings creation...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const userEmbeddingsCollection = db.collection("user_embeddings");

    // Clear existing embeddings
    console.log("🗑️ Clearing existing user embeddings...");
    await userEmbeddingsCollection.deleteMany({});

    // Get user data
    const userDbCollection = db.collection("userdbs");
    const successChanceCollection = db.collection("successchances");

    console.log("🔍 Fetching user data...");
    const users = await userDbCollection.find({}).toArray();
    const successChances = await successChanceCollection.find({}).toArray();

    // Map success chances by userId
    const successChanceMap = new Map();
    successChances.forEach((record) => {
      const userId = record.userId?.toString();
      if (userId) {
        if (!successChanceMap.has(userId)) {
          successChanceMap.set(userId, []);
        }
        successChanceMap.get(userId).push(record);
      }
    });

    console.log(`📊 Processing ${users.length} users...`);

    const batchSize = 20;
    let totalProcessed = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchEmbeddings = [];

      for (const user of batch) {
        try {
          const userId = user._id.toString();
          const userSuccessChances = successChanceMap.get(userId) || [];
          const textContent = createCombinedUserTextContent(
            { ...user, _id: user._id.toString() },
            userSuccessChances
          );

          if (textContent.trim()) {
            const embedding = await embeddings.embedQuery(textContent);

            batchEmbeddings.push({
              text: textContent,
              embedding: embedding,
              userId: userId,
              sourceCollection: "combined_user_data",
              originalId: user._id.toString(),
              domain: "user",
              metadata: {
                title:
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.name ||
                  "User Profile",
                email: user.email || "",
                userId: userId,
                userProfile: {
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  name: user.name || "",
                  email: user.email || "",
                },
                successChances: userSuccessChances,
                hasSuccessChanceData: userSuccessChances.length > 0,
              },
              createdAt: new Date(),
            });

            totalProcessed++;

            // Rate limiting
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(`❌ Error processing user ${user._id}:`, error);
        }
      }

      // Insert batch
      if (batchEmbeddings.length > 0) {
        await userEmbeddingsCollection.insertMany(batchEmbeddings);
        console.log(`✅ Processed batch: ${totalProcessed}/${users.length}`);
      }
    }

    console.log(
      `✅ User embeddings completed: ${totalProcessed} users processed`
    );
    return { totalProcessed, collectionName: "user_embeddings" };
  } catch (error) {
    console.error("❌ Error in createUserEmbeddings:", error);
    throw error;
  }
}

// Enhanced text content creation with visa guides support
function createTextContent(
  doc: Record<string, unknown>,
  collectionName: string
): { textContent: string; metadata: Record<string, unknown> } {
  let textContent = "";
  let metadata: Record<string, unknown> = {};

  switch (collectionName) {
    case "universities":
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
          historical_places: string;
          food_and_cafe: string;
          transportation: string;
          cultures: string;
          famous_places_to_visit: string[];
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

      // Visa requirements
      if (doc.visa_requirements && Array.isArray(doc.visa_requirements)) {
        textContent += `Visa Requirements: ${doc.visa_requirements.join(
          ", "
        )}\n`;
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
          amount: string;
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
        doc.lifestyles.forEach(
          (
            lifestyle: {
              type: string;
              currency: string;
              rent: { min: number; max: number };
              groceries: { min: number; max: number };
              public_transport: { min: number; max: number };
              utilities: { min: number; max: number };
              internet: { min: number; max: number };
              mobile: { min: number; max: number };
              total_estimated_cost: { min: number; max: number };
            },
            index: number
          ) => {
            if (typeof lifestyle === "object" && lifestyle !== null) {
              textContent += `\nLifestyle ${index + 1} - ${
                lifestyle.type || "Unknown"
              } (${lifestyle.currency || ""})\n`;

              // Cost breakdown
              if (lifestyle.rent) {
                textContent += `Rent: ${lifestyle.rent.min || 0} - ${
                  lifestyle.rent.max || 0
                }\n`;
              }
              if (lifestyle.groceries) {
                textContent += `Groceries: ${lifestyle.groceries.min || 0} - ${
                  lifestyle.groceries.max || 0
                }\n`;
              }
              if (lifestyle.public_transport) {
                textContent += `Public Transport: ${
                  lifestyle.public_transport.min || 0
                } - ${lifestyle.public_transport.max || 0}\n`;
              }
              if (lifestyle.utilities) {
                textContent += `Utilities: ${lifestyle.utilities.min || 0} - ${
                  lifestyle.utilities.max || 0
                }\n`;
              }
              if (lifestyle.internet) {
                textContent += `Internet: ${lifestyle.internet.min || 0} - ${
                  lifestyle.internet.max || 0
                }\n`;
              }
              if (lifestyle.mobile) {
                textContent += `Mobile: ${lifestyle.mobile.min || 0} - ${
                  lifestyle.mobile.max || 0
                }\n`;
              }
              if (lifestyle.total_estimated_cost) {
                textContent += `Total Estimated Cost: ${
                  lifestyle.total_estimated_cost.min || 0
                } - ${lifestyle.total_estimated_cost.max || 0}\n`;
              }
            }
          }
        );
      }

      // Enhanced metadata for expenses
      metadata = {
        title: `${doc.country_name || "Country"} - ${
          doc.university_name || "University"
        } Expenses`,
        country: doc.country_name || "",
        university: doc.university_name || "",
        lifestyles: Array.isArray(doc.lifestyles)
          ? doc.lifestyles.map(
              (lifestyle: {
                type: string;
                currency: string;
                rent: { min: number; max: number };
                groceries: { min: number; max: number };
                public_transport: { min: number; max: number };
                utilities: { min: number; max: number };
                internet: { min: number; max: number };
                mobile: { min: number; max: number };
                total_estimated_cost: { min: number; max: number };
              }) => ({
                type: lifestyle?.type || "",
                currency: lifestyle?.currency || "",
                costs: {
                  rent: lifestyle?.rent || { min: 0, max: 0 },
                  groceries: lifestyle?.groceries || { min: 0, max: 0 },
                  publicTransport: lifestyle?.public_transport || {
                    min: 0,
                    max: 0,
                  },
                  utilities: lifestyle?.utilities || { min: 0, max: 0 },
                  internet: lifestyle?.internet || { min: 0, max: 0 },
                  mobile: lifestyle?.mobile || { min: 0, max: 0 },
                  totalEstimatedCost: lifestyle?.total_estimated_cost || {
                    min: 0,
                    max: 0,
                  },
                },
              })
            )
          : [],
        originalDoc: doc,
      };
      break;

    // NEW: Visa guides case
    case "visaguides":
      textContent += `Visa Guide: ${doc.country_name || ""}\n`;

      // Country reference
      if (doc.country_id) {
        textContent += `Country ID: ${doc.country_id}\n`;
      }

      // Process steps array
      if (doc.steps && Array.isArray(doc.steps)) {
        textContent += `\nVisa Application Steps:\n`;
        doc.steps.forEach(
          (step: { heading: string; points: string[] }, index: number) => {
            if (step && typeof step === "object") {
              textContent += `\nStep ${index + 1}: ${
                step.heading || "Untitled Step"
              }\n`;

              if (step.points && Array.isArray(step.points)) {
                step.points.forEach((point: string, pointIndex: number) => {
                  if (point && typeof point === "string") {
                    textContent += `  ${pointIndex + 1}. ${truncateText(
                      point,
                      200
                    )}\n`;
                  }
                });
              }
            }
          }
        );
      }

      // Enhanced metadata for visa guides
      metadata = {
        title: `${doc.country_name || "Visa Guide"}`,
        country: doc.country_name || "",
        countryId: doc.country_id || null,
        stepsCount: Array.isArray(doc.steps) ? doc.steps.length : 0,
        steps: Array.isArray(doc.steps)
          ? doc.steps.map((step: { heading: string; points: string[] }) => ({
              heading: step?.heading || "",
              pointsCount: Array.isArray(step?.points) ? step.points.length : 0,
              points: Array.isArray(step?.points) ? step.points : [],
            }))
          : [],
        hasSteps: Array.isArray(doc.steps) && doc.steps.length > 0,
        createdAt: doc.createdAt || null,
        updatedAt: doc.updatedAt || null,
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

// Combined country embeddings (NEW from embedding-operations.ts)
export async function createCombinedCountryEmbeddings(
  targetCollection: string = "country_embeddings",
  batchSize: number = 5
) {
  console.log(`🌍 Creating combined country embeddings...`);

  try {
    const client = await clientPromise;
    const db = client.db("wwah");

    // Get all countries
    const countriesCollection = db.collection("countries");
    const countries = await countriesCollection.find({}).toArray();

    console.log(`📊 Found ${countries.length} countries to process`);

    // Clear existing embeddings
    const embeddingCollection = db.collection(targetCollection);
    await embeddingCollection.deleteMany({});

    // Process countries in batches
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);
      const batchEmbeddings = [];

      for (const country of batch) {
        try {
          const countryName = country.country_name || "";
          const countryId = country._id?.toString() || "";

          // Fetch country documents from countryData collection
          const countryDataCollection = db.collection("countrydatas");
          const countryDocuments = await countryDataCollection
            .find({
              countryname: { $regex: new RegExp(countryName, "i") },
            })
            .toArray();

          console.log(
            `📋 Fetched ${countryDocuments.length} document sets for country ${countryName}`
          );

          // Create combined text content
          const textContent = createCombinedCountryTextContent(
            { ...country, _id: country._id?.toString?.() ?? "" },
            countryDocuments.map((doc) => ({
              ...doc,
              _id: doc._id?.toString?.() ?? "",
            }))
          );

          console.log(
            `📝 Generated text content for country ${countryName}:`,
            textContent.substring(0, 200) + "..."
          );

          const metadata = {
            title: countryName || "Country Profile",
            country: countryName,
            capital: country.capital || "",
            language: country.language || "",
            population: country.population || null,
            currency: country.currency || "",
            internationalStudents: country.international_students || null,
            academicIntakes: country.academic_intakes || "",
            workRights: {
              whileStudying: country.work_while_studying || "",
              afterStudy: country.work_after_study || "",
            },
            livingCosts: {
              rent: country.rent || null,
              groceries: country.groceries || null,
              transportation: country.transportation || null,
              healthcare: country.healthcare || null,
              eatingOut: country.eating_out || null,
              householdBills: country.household_bills || null,
              miscellaneous: country.miscellaneous || null,
            },
            residency: country.residency || [],
            popularPrograms: country.popular_programs || [],
            visaRequirements: country.visa_requirements || [],
            accommodationOptions: country.accomodation_options || [],
            health: country.health || [],
            scholarships: country.scholarships || [],
            documentRequirements: countryDocuments.map((docData) => ({
              embassyDocuments: docData.embassyDocuments || [],
              universityDocuments: docData.universityDocuments || [],
            })),
            hasDocumentData: countryDocuments.length > 0,
            originalDoc: country,
          };

          const embedding = await embeddings.embedQuery(textContent);

          batchEmbeddings.push({
            text: textContent,
            embedding: embedding,
            countryName: countryName,
            sourceCollection: "combined_country_data",
            originalId: countryId,
            domain: "country",
            metadata: metadata,
            createdAt: new Date(),
          });

          // Rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(
            `❌ Error processing country ${country.country_name}:`,
            error
          );
        }
      }

      // Insert batch
      if (batchEmbeddings.length > 0) {
        await embeddingCollection.insertMany(batchEmbeddings);
        console.log(
          `✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            countries.length / batchSize
          )}`
        );
      }
    }

    console.log(`🎉 Completed creating combined country embeddings!`);
    return {
      totalProcessed: countries.length,
      collectionName: targetCollection,
    };
  } catch (error) {
    console.error(`❌ Error creating combined country embeddings:`, error);
    throw error;
  }
}

// Updated createDomainEmbeddings function with enhanced metadata
export async function createDomainEmbeddings() {
  console.log("🚀 Starting domain embeddings creation...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const results: Record<
      string,
      {
        documentsProcessed: number;
        embeddingsCreated: number;
        collectionName?: string;
      }
    > = {};

    for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
      console.log(`\n🔄 Processing ${domain}...`);

      const sourceCollection = db.collection(config.source);
      const targetCollection = db.collection(config.target);

      // Clear existing embeddings
      await targetCollection.deleteMany({});

      // Get documents
      const documents = await sourceCollection.find({}).toArray();
      console.log(`📊 Found ${documents.length} ${domain} documents`);

      if (documents.length === 0) {
        results[domain] = { documentsProcessed: 0, embeddingsCreated: 0 };
        continue;
      }

      let totalProcessed = 0;
      const batchSize = 10;

      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const batchEmbeddings = [];

        for (const doc of batch) {
          try {
            // Use the enhanced createTextContent function
            const { textContent, metadata } = createTextContent(
              doc,
              config.source
            );

            if (textContent.trim()) {
              const embedding = await embeddings.embedQuery(textContent);

              batchEmbeddings.push({
                text: textContent,
                embedding: embedding,
                domain: domain,
                sourceCollection: config.source,
                originalId: doc._id.toString(),
                ...metadata, // Spread metadata at root level for compatibility
                metadata: metadata, // Also keep nested for new structure
                createdAt: new Date(),
              });

              totalProcessed++;

              // Rate limiting
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          } catch (error) {
            console.error(
              `❌ Error processing ${domain} document ${doc._id}:`,
              error
            );
          }
        }

        // Insert batch
        if (batchEmbeddings.length > 0) {
          await targetCollection.insertMany(batchEmbeddings);
          console.log(
            `✅ ${domain}: ${totalProcessed}/${documents.length} processed`
          );
        }
      }

      results[domain] = {
        documentsProcessed: totalProcessed,
        embeddingsCreated: totalProcessed,
        collectionName: config.target,
      };
    }

    console.log("✅ Domain embeddings completed");
    return results;
  } catch (error) {
    console.error("❌ Error in createDomainEmbeddings:", error);
    throw error;
  }
}

// Main function - Enhanced with combined country embeddings option
export async function createAllEmbeddings(
  includeCombinedCountries: boolean = false
) {
  console.log("🚀 Starting complete embeddings creation...");

  try {
    // Step 1: Create user embeddings first (prioritized)
    console.log("👤 Step 1: Creating user embeddings...");
    const userResults = await createUserEmbeddings();
    console.log("✅ User embeddings completed");

    // Step 2: Create domain embeddings
    console.log("\n📋 Step 2: Creating domain embeddings...");
    const domainResults = await createDomainEmbeddings();
    console.log("✅ Domain embeddings completed");

    // Step 3: Optionally create combined country embeddings
    let combinedCountryResults = null;
    if (includeCombinedCountries) {
      console.log("\n🌍 Step 3: Creating combined country embeddings...");
      combinedCountryResults = await createCombinedCountryEmbeddings();
      console.log("✅ Combined country embeddings completed");
    }
    const finalResults = {
      users: userResults,
      domains: domainResults,
      combinedCountries: combinedCountryResults,
      timestamp: new Date().toISOString(),
    };

    console.log("\n🎉 All embeddings creation completed");
    console.log("📊 Results:", JSON.stringify(finalResults, null, 2));

    return finalResults;
  } catch (error) {
    console.error("❌ Error in createAllEmbeddings:", error);
    throw error;
  }
}

// Utility function to get embedding statistics
export async function getEmbeddingStats() {
  console.log("📊 Getting embedding statistics...");

  try {
    const client = await clientPromise;
    const db = client.db("wwah");
    const stats: Record<string, { count: number; collection: string }> = {};

    // User embeddings stats
    const userCollection = db.collection("user_embeddings");
    const userCount = await userCollection.countDocuments();
    stats["users"] = { count: userCount, collection: "user_embeddings" };

    // Domain embeddings stats
    for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
      const collection = db.collection(config.target);
      const count = await collection.countDocuments();
      stats[domain] = { count, collection: config.target };
    }

    console.log("📊 Statistics:", JSON.stringify(stats, null, 2));
    return stats;
  } catch (error) {
    console.error("❌ Error getting stats:", error);
    throw error;
  }
}

// Execute main function
async function main() {
  try {
    console.log("🚀 Starting embeddings creation process...");

    // You can set this to true if you want to include combined country embeddings
    const includeCombinedCountries = process.argv.includes(
      "--combined-countries"
    );

    const results = await createAllEmbeddings(includeCombinedCountries);
    console.log("✅ Process completed successfully", results);
  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exit(1);
  } finally {
    console.log("🔄 Exiting...");
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
// // scripts/build-meta-index.ts

// import "dotenv/config";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import clientPromise from "../lib/mongodb";
// import {
//   CountryDocumentData,
//   CountryProfile,
//   SuccessChance,
//   UserProfile,
// } from "./types";

// // Environment validation
// console.log("🔍 Validating environment...");
// if (!process.env.MONGODB_URI) {
//   console.error("❌ MONGODB_URI is not set");
//   process.exit(1);
// }
// if (!process.env.OPENAI_API_KEY) {
//   console.error("❌ OPENAI_API_KEY is not set");
//   process.exit(1);
// }
// console.log("✅ Environment validated");

// // Collection mapping configuration
// const COLLECTION_MAPPING = {
//   countries: { source: "countries", target: "country_embeddings" },
//   universities: { source: "universities", target: "university_embeddings" },
//   courses: { source: "courses", target: "course_embeddings" },
//   scholarships: { source: "scholarships", target: "scholarship_embeddings" },
//   expenses: { source: "expenses", target: "expense_embeddings" },
// };

// // Initialize OpenAI embeddings
// const embeddings = new OpenAIEmbeddings({
//   modelName: "text-embedding-3-small",
// });

// function truncateText(text: string, maxTokens: number = 2000): string {
//   const maxChars = maxTokens * 4;
//   if (text.length <= maxChars) return text;

//   const sentences = text.split(/[.!?]+/);
//   let result = "";

//   for (const sentence of sentences) {
//     if ((result + sentence).length > maxChars) break;
//     result += sentence + ". ";
//   }

//   return result.trim() || text.substring(0, maxChars);
// }

// // Enhanced createCombinedUserTextContent function (matching embedding-operations.ts)
// function createCombinedUserTextContent(
//   user: UserProfile,
//   successChances: SuccessChance[]
// ): string {
//   let textContent = "";

//   // Basic user profile
//   textContent += `User Profile:\n`;
//   textContent += `ID: ${user._id}\n`;
//   textContent += `Name: ${
//     user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()
//   }\n`;
//   textContent += `Email: ${user.email}\n`;

//   // Handle both array of success chances AND embedded successChanceData
//   let successChanceData = successChances;

//   // If user has embedded successChanceData (from Express API), use that
//   if (user.successChanceData && !successChances?.length) {
//     successChanceData = [user.successChanceData];
//   }

//   // Academic preferences from success chances
//   if (successChanceData && successChanceData.length > 0) {
//     textContent += `\nAcademic Profile:\n`;

//     successChanceData.forEach((record, index) => {
//       textContent += `\n--- Profile ${index + 1} ---\n`;

//       // User ID reference
//       textContent += `User ID: ${record.userId || ""}\n`;

//       // Academic Information
//       textContent += `Study Level: ${record.studyLevel || ""}\n`;
//       textContent += `Grade: ${record.grade || ""} (${
//         record.gradeType || ""
//       })\n`;
//       textContent += `Nationality: ${record.nationality || ""}\n`;
//       textContent += `Major Subject: ${record.majorSubject || ""}\n`;
//       textContent += `Work Experience: ${record.workExperience || "0"} years\n`;

//       // Financial Information
//       if (record.livingCosts) {
//         textContent += `Living Budget: ${record.livingCosts.amount || 0} ${
//           record.livingCosts.currency || ""
//         }\n`;
//       }

//       if (record.tuitionFee) {
//         textContent += `Tuition Budget: ${record.tuitionFee.amount || 0} ${
//           record.tuitionFee.currency || ""
//         }\n`;
//       }

//       // Language Proficiency
//       if (record.languageProficiency) {
//         const test = record.languageProficiency.test || "";
//         const score = record.languageProficiency.score || "";
//         if (test || score) {
//           textContent += `Language Proficiency: ${test} ${score}\n`;
//         }
//       }

//       // Study Preferences
//       if (record.studyPreferenced) {
//         textContent += `Study Preferences:\n`;
//         textContent += `  Preferred Country: ${
//           record.studyPreferenced.country || ""
//         }\n`;
//         textContent += `  Preferred Degree: ${
//           record.studyPreferenced.degree || ""
//         }\n`;
//         textContent += `  Preferred Subject: ${
//           record.studyPreferenced.subject || ""
//         }\n`;
//       }
//     });
//   } else {
//     textContent += `\nAcademic Profile: No success chance data available\n`;
//   }

//   return textContent;
// }

// // Create combined country text content (matching embedding-operations.ts)
// function createCombinedCountryTextContent(
//   country: CountryProfile,
//   countryDocuments: CountryDocumentData[]
// ): string {
//   let textContent = "";

//   // Basic country profile from 'countries' collection
//   textContent += `Country Profile:\n`;
//   textContent += `Country: ${country.country_name || ""}\n`;
//   textContent += `Capital: ${country.capital || ""}\n`;
//   textContent += `Language: ${country.language || ""}\n`;
//   textContent += `Population: ${country.population || ""}\n`;
//   textContent += `Currency: ${country.currency || ""}\n`;
//   textContent += `International Students: ${
//     country.international_students || ""
//   }\n`;
//   textContent += `Academic Intakes: ${country.academic_intakes || ""}\n`;

//   if (country.why_study) {
//     textContent += `Why Study: ${truncateText(
//       typeof country.why_study === "string" ? country.why_study : "",
//       400
//     )}\n`;
//   }

//   textContent += `Work While Studying: ${country.work_while_studying || ""}\n`;
//   textContent += `Work After Study: ${country.work_after_study || ""}\n`;

//   // Living costs breakdown
//   textContent += `Living Costs - Rent: ${country.rent || ""}, Groceries: ${
//     country.groceries || ""
//   }, Transport: ${country.transportation || ""}\n`;
//   textContent += `Healthcare: ${country.healthcare || ""}, Eating Out: ${
//     country.eating_out || ""
//   }\n`;
//   textContent += `Household Bills: ${
//     country.household_bills || ""
//   }, Miscellaneous: ${country.miscellaneous || ""}\n`;

//   // Residency options
//   if (country.residency && Array.isArray(country.residency)) {
//     textContent += `Residency Options: ${country.residency.join(", ")}\n`;
//   }

//   // Popular programs
//   if (country.popular_programs && Array.isArray(country.popular_programs)) {
//     textContent += `Popular Programs: ${country.popular_programs.join(", ")}\n`;
//   }

//   // Visa requirements
//   if (country.visa_requirements && Array.isArray(country.visa_requirements)) {
//     textContent += `Visa Requirements: ${country.visa_requirements.join(
//       ", "
//     )}\n`;
//   }

//   // Accommodation options
//   if (
//     country.accomodation_options &&
//     Array.isArray(country.accomodation_options)
//   ) {
//     textContent += `Accommodation Options: ${country.accomodation_options.join(
//       ", "
//     )}\n`;
//   }

//   // Health information
//   if (country.health && Array.isArray(country.health)) {
//     const healthInfo = country.health
//       .map(
//         (h: { name: string; location: string }) => `${h.name} (${h.location})`
//       )
//       .join(", ");
//     textContent += `Health Facilities: ${healthInfo}\n`;
//   }

//   // Scholarships
//   if (country.scholarships && Array.isArray(country.scholarships)) {
//     const scholarshipInfo = country.scholarships
//       .map((s: { name: string; details: string }) => `${s.name}: ${s.details}`)
//       .join(" | ");
//     textContent += `Available Scholarships: ${scholarshipInfo}\n`;
//   }

//   // Add document requirements from 'countryData' collection
//   if (countryDocuments && countryDocuments.length > 0) {
//     textContent += `\nDocument Requirements:\n`;

//     countryDocuments.forEach((docData, index) => {
//       textContent += `\n--- Document Set ${index + 1} ---\n`;

//       // Embassy documents
//       if (docData.embassyDocuments && docData.embassyDocuments.length > 0) {
//         textContent += `Embassy Documents Required:\n`;
//         docData.embassyDocuments.forEach((doc) => {
//           textContent += `- ${doc.name}`;
//           if (doc.detail) {
//             textContent += `: ${doc.detail}`;
//           }
//           textContent += `\n`;
//         });
//       }

//       // University documents by course level
//       if (
//         docData.universityDocuments &&
//         docData.universityDocuments.length > 0
//       ) {
//         textContent += `University Documents by Course Level:\n`;
//         docData.universityDocuments.forEach((courseDoc) => {
//           textContent += `${courseDoc.course_level} Level Documents:\n`;
//           courseDoc.doc.forEach((doc) => {
//             textContent += `  - ${doc.name}`;
//             if (doc.detail) {
//               textContent += `: ${doc.detail}`;
//             }
//             textContent += `\n`;
//           });
//         });
//       }
//     });
//   } else {
//     textContent += `\nDocument Requirements: No specific document requirements available\n`;
//   }

//   return textContent;
// }

// // Create user embeddings (prioritized first)
// export async function createUserEmbeddings() {
//   console.log("🚀 Starting user embeddings creation...");

//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     const userEmbeddingsCollection = db.collection("user_embeddings");

//     // Clear existing embeddings
//     console.log("🗑️ Clearing existing user embeddings...");
//     await userEmbeddingsCollection.deleteMany({});

//     // Get user data
//     const userDbCollection = db.collection("userdbs");
//     const successChanceCollection = db.collection("successchances");

//     console.log("🔍 Fetching user data...");
//     const users = await userDbCollection.find({}).toArray();
//     const successChances = await successChanceCollection.find({}).toArray();

//     // Map success chances by userId
//     const successChanceMap = new Map();
//     successChances.forEach((record) => {
//       const userId = record.userId?.toString();
//       if (userId) {
//         if (!successChanceMap.has(userId)) {
//           successChanceMap.set(userId, []);
//         }
//         successChanceMap.get(userId).push(record);
//       }
//     });

//     console.log(`📊 Processing ${users.length} users...`);

//     const batchSize = 20;
//     let totalProcessed = 0;

//     for (let i = 0; i < users.length; i += batchSize) {
//       const batch = users.slice(i, i + batchSize);
//       const batchEmbeddings = [];

//       for (const user of batch) {
//         try {
//           const userId = user._id.toString();
//           const userSuccessChances = successChanceMap.get(userId) || [];
//           const textContent = createCombinedUserTextContent(
//             { ...user, _id: user._id.toString() },
//             userSuccessChances
//           );

//           if (textContent.trim()) {
//             const embedding = await embeddings.embedQuery(textContent);

//             batchEmbeddings.push({
//               text: textContent,
//               embedding: embedding,
//               userId: userId,
//               sourceCollection: "combined_user_data",
//               originalId: user._id.toString(),
//               domain: "user",
//               metadata: {
//                 title:
//                   `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
//                   user.name ||
//                   "User Profile",
//                 email: user.email || "",
//                 userId: userId,
//                 userProfile: {
//                   firstName: user.firstName || "",
//                   lastName: user.lastName || "",
//                   name: user.name || "",
//                   email: user.email || "",
//                 },
//                 successChances: userSuccessChances,
//                 hasSuccessChanceData: userSuccessChances.length > 0,
//               },
//               createdAt: new Date(),
//             });

//             totalProcessed++;

//             // Rate limiting
//             await new Promise((resolve) => setTimeout(resolve, 50));
//           }
//         } catch (error) {
//           console.error(`❌ Error processing user ${user._id}:`, error);
//         }
//       }

//       // Insert batch
//       if (batchEmbeddings.length > 0) {
//         await userEmbeddingsCollection.insertMany(batchEmbeddings);
//         console.log(`✅ Processed batch: ${totalProcessed}/${users.length}`);
//       }
//     }

//     console.log(
//       `✅ User embeddings completed: ${totalProcessed} users processed`
//     );
//     return { totalProcessed, collectionName: "user_embeddings" };
//   } catch (error) {
//     console.error("❌ Error in createUserEmbeddings:", error);
//     throw error;
//   }
// }

// // Enhanced text content creation with comprehensive field extraction (matching embedding-operations.ts exactly)
// function createTextContent(
//   doc: Record<string, unknown>,
//   collectionName: string
// ): { textContent: string; metadata: Record<string, unknown> } {
//   let textContent = "";
//   let metadata: Record<string, unknown> = {};

//   switch (collectionName) {
//     case "universities":
//       textContent += `University: ${doc.university_name || ""}\n`;
//       textContent += `Country: ${doc.country_name || ""}\n`;
//       textContent += `University Type: ${doc.university_type || ""}\n`;
//       textContent += `Location: ${doc.location || ""}\n`;
//       textContent += `Ranking: QS World University Ranking ${
//         doc.qs_world_university_ranking || "N/A"
//       }, Times Higher Education Ranking ${
//         doc.times_higher_education_ranking || "N/A"
//       }\n`;
//       textContent += `Established: ${doc.establishment_year || ""}\n`;
//       textContent += `Students: ${doc.national_students || ""} national, ${
//         doc.international_students || ""
//       } international\n`;
//       textContent += `Acceptance Rate: ${doc.acceptance_rate || ""}\n`;
//       textContent += `Distance From City: ${doc.distance_from_city || ""}\n`;

//       if (doc.overview) {
//         textContent += `Overview: ${truncateText(
//           typeof doc.overview === "string" ? doc.overview : "",
//           500
//         )}\n`;
//       }
//       if (doc.modern_day_development) {
//         textContent += `Modern Day Development: ${truncateText(
//           typeof doc.modern_day_development === "string"
//             ? doc.modern_day_development
//             : "",
//           500
//         )}\n`;
//       }
//       if (doc.our_mission) {
//         textContent += `Mission: ${truncateText(
//           typeof doc.our_mission === "string" ? doc.our_mission : "",
//           300
//         )}\n`;
//       }

//       // Additional ranking information
//       if (doc.ranking && Array.isArray(doc.ranking)) {
//         const rankings = doc.ranking
//           .map(
//             (rank: { name: string; detail: string }) =>
//               `${rank.name}: ${rank.detail}`
//           )
//           .join(", ");
//         textContent += `Other Rankings: ${rankings}\n`;
//       }

//       // Notable alumni
//       if (doc.notable_alumni && Array.isArray(doc.notable_alumni)) {
//         const alumni = doc.notable_alumni
//           .map(
//             (alum: { name: string; profession: string }) =>
//               `${alum.name} (${alum.profession})`
//           )
//           .join(", ");
//         textContent += `Notable Alumni: ${alumni}\n`;
//       }

//       // Key achievements
//       if (doc.key_achievements && Array.isArray(doc.key_achievements)) {
//         textContent += `Key Achievements: ${doc.key_achievements.join(", ")}\n`;
//       }

//       // About city information
//       if (doc.about_city && typeof doc.about_city === "object") {
//         const city = doc.about_city as {
//           historical_places: string;
//           food_and_cafe: string;
//           transportation: string;
//           cultures: string;
//           famous_places_to_visit: string[];
//         };
//         if (city.historical_places) {
//           textContent += `Historical Places: ${city.historical_places}\n`;
//         }
//         if (city.food_and_cafe) {
//           textContent += `Food & Cafes: ${city.food_and_cafe}\n`;
//         }
//         if (city.transportation) {
//           textContent += `City Transportation: ${city.transportation}\n`;
//         }
//         if (city.cultures) {
//           textContent += `City Culture: ${city.cultures}\n`;
//         }
//         if (
//           city.famous_places_to_visit &&
//           Array.isArray(city.famous_places_to_visit)
//         ) {
//           textContent += `Famous Places to Visit: ${city.famous_places_to_visit.join(
//             ", "
//           )}\n`;
//         }
//       }

//       // Enhanced metadata for universities
//       metadata = {
//         title: doc.university_name || "Untitled University",
//         country: doc.country_name || "",
//         location: doc.location || "",
//         type: doc.university_type || "",
//         ranking: {
//           qsWorldRanking: doc.qs_world_university_ranking || null,
//           timesHigherEducation: doc.times_higher_education_ranking || null,
//           otherRankings: doc.ranking || [],
//         },
//         establishmentYear: doc.establishment_year || null,
//         acceptanceRate: doc.acceptance_rate || null,
//         studentCount: {
//           national: doc.national_students || null,
//           international: doc.international_students || null,
//         },
//         distanceFromCity: doc.distance_from_city || "",
//         notableAlumni: doc.notable_alumni || [],
//         keyAchievements: doc.key_achievements || [],
//         aboutCity: doc.about_city || {},
//         originalDoc: doc,
//       };
//       break;

//     case "countries":
//       textContent += `Country: ${doc.country_name || ""}\n`;
//       textContent += `Capital: ${doc.capital || ""}\n`;
//       textContent += `Language: ${doc.language || ""}\n`;
//       textContent += `Population: ${doc.population || ""}\n`;
//       textContent += `Currency: ${doc.currency || ""}\n`;
//       textContent += `International Students: ${
//         doc.international_students || ""
//       }\n`;
//       textContent += `Academic Intakes: ${doc.academic_intakes || ""}\n`;

//       if (doc.why_study) {
//         textContent += `Why Study: ${truncateText(
//           typeof doc.why_study === "string" ? doc.why_study : "",
//           400
//         )}\n`;
//       }

//       textContent += `Work While Studying: ${doc.work_while_studying || ""}\n`;
//       textContent += `Work After Study: ${doc.work_after_study || ""}\n`;

//       // Living costs breakdown
//       textContent += `Living Costs - Rent: ${doc.rent || ""}, Groceries: ${
//         doc.groceries || ""
//       }, Transport: ${doc.transportation || ""}\n`;
//       textContent += `Healthcare: ${doc.healthcare || ""}, Eating Out: ${
//         doc.eating_out || ""
//       }\n`;
//       textContent += `Household Bills: ${
//         doc.household_bills || ""
//       }, Miscellaneous: ${doc.miscellaneous || ""}\n`;

//       // Residency options
//       if (doc.residency && Array.isArray(doc.residency)) {
//         textContent += `Residency Options: ${doc.residency.join(", ")}\n`;
//       }

//       // Popular programs
//       if (doc.popular_programs && Array.isArray(doc.popular_programs)) {
//         textContent += `Popular Programs: ${doc.popular_programs.join(", ")}\n`;
//       }

//       // Visa requirements
//       if (doc.visa_requirements && Array.isArray(doc.visa_requirements)) {
//         textContent += `Visa Requirements: ${doc.visa_requirements.join(
//           ", "
//         )}\n`;
//       }

//       // Accommodation options
//       if (doc.accomodation_options && Array.isArray(doc.accomodation_options)) {
//         textContent += `Accommodation Options: ${doc.accomodation_options.join(
//           ", "
//         )}\n`;
//       }

//       // Health information
//       if (doc.health && Array.isArray(doc.health)) {
//         const healthInfo = doc.health
//           .map(
//             (h: { name: string; location: string }) =>
//               `${h.name} (${h.location})`
//           )
//           .join(", ");
//         textContent += `Health Facilities: ${healthInfo}\n`;
//       }

//       // Scholarships
//       if (doc.scholarships && Array.isArray(doc.scholarships)) {
//         const scholarshipInfo = doc.scholarships
//           .map(
//             (s: { name: string; details: string }) => `${s.name}: ${s.details}`
//           )
//           .join(" | ");
//         textContent += `Available Scholarships: ${scholarshipInfo}\n`;
//       }

//       // Enhanced metadata for countries
//       metadata = {
//         title: doc.country_name || "Untitled Country",
//         country: doc.country_name || "",
//         capital: doc.capital || "",
//         language: doc.language || "",
//         population: doc.population || null,
//         currency: doc.currency || "",
//         internationalStudents: doc.international_students || null,
//         academicIntakes: doc.academic_intakes || "",
//         workRights: {
//           whileStudying: doc.work_while_studying || "",
//           afterStudy: doc.work_after_study || "",
//         },
//         livingCosts: {
//           rent: doc.rent || null,
//           groceries: doc.groceries || null,
//           transportation: doc.transportation || null,
//           healthcare: doc.healthcare || null,
//           eatingOut: doc.eating_out || null,
//           householdBills: doc.household_bills || null,
//           miscellaneous: doc.miscellaneous || null,
//         },
//         residency: doc.residency || [],
//         popularPrograms: doc.popular_programs || [],
//         visaRequirements: doc.visa_requirements || [],
//         accommodationOptions: doc.accomodation_options || [],
//         health: doc.health || [],
//         scholarships: doc.scholarships || [],
//         originalDoc: doc,
//       };
//       break;

//     case "courses":
//       const courseTitle = Array.isArray(doc.course_title)
//         ? doc.course_title.join(", ")
//         : doc.course_title || "";

//       textContent += `Subject: ${courseTitle}\n`;
//       textContent += `University: ${doc.universityname || ""}\n`;
//       textContent += `Country: ${doc.countryname || ""}\n`;
//       textContent += `City: ${doc.city || ""}\n`;
//       textContent += `Campus Location: ${doc.location_campus || ""}\n`;
//       textContent += `Degree: ${doc.course_level || ""}\n`;
//       textContent += `Education Level: ${doc.education_level || ""}\n`;
//       textContent += `Duration: ${doc.duration || ""}\n`;
//       textContent += `Degree Format: ${doc.degree_format || ""}\n`;
//       textContent += `Application Fee: ${doc.application_fee || ""}\n`;

//       // Tuition fee
//       if (
//         doc.annual_tuition_fee &&
//         typeof doc.annual_tuition_fee === "object"
//       ) {
//         const fee = doc.annual_tuition_fee as {
//           amount: string;
//           currency: string;
//         };
//         textContent += `Annual Tuition Fee: ${fee.currency} ${
//           fee.amount || ""
//         }\n`;
//       }
//       textContent += `Initial Deposit: ${doc.initial_deposit || ""}\n`;

//       // Test scores
//       const testScores = [];
//       if (doc.required_ielts_score)
//         testScores.push(`IELTS: ${doc.required_ielts_score}`);
//       if (doc.required_pte_score)
//         testScores.push(`PTE: ${doc.required_pte_score}`);
//       if (doc.required_toefl_score)
//         testScores.push(`TOEFL: ${doc.required_toefl_score}`);
//       if (testScores.length > 0) {
//         textContent += `Required Test Scores: ${testScores.join(", ")}\n`;
//       }

//       if (doc.entry_requirements) {
//         textContent += `Entry Requirements: ${truncateText(
//           typeof doc.entry_requirements === "string"
//             ? doc.entry_requirements
//             : "",
//           300
//         )}\n`;
//       }

//       // Intake information
//       if (doc.intake && Array.isArray(doc.intake)) {
//         textContent += `Intake: ${doc.intake.join(", ")}\n`;
//       }

//       // Start dates
//       if (doc.start_date && Array.isArray(doc.start_date)) {
//         textContent += `Start Dates: ${doc.start_date.join(", ")}\n`;
//       }

//       // Course overview
//       if (doc.overview) {
//         textContent += `Course Overview: ${truncateText(
//           typeof doc.overview === "string" ? doc.overview : "",
//           400
//         )}\n`;
//       }

//       // Course structure
//       if (doc.course_structure) {
//         textContent += `Course Structure: ${truncateText(
//           typeof doc.course_structure === "string" ? doc.course_structure : "",
//           300
//         )}\n`;
//       }

//       // Year-wise curriculum
//       const years = [];
//       if (doc.year_1) years.push(`Year 1: ${doc.year_1}`);
//       if (doc.year_2) years.push(`Year 2: ${doc.year_2}`);
//       if (doc.year_3) years.push(`Year 3: ${doc.year_3}`);
//       if (doc.year_4) years.push(`Year 4: ${doc.year_4}`);
//       if (doc.year_5) years.push(`Year 5: ${doc.year_5}`);
//       if (years.length > 0) {
//         textContent += `Curriculum: ${years.join(" | ")}\n`;
//       }

//       // Career opportunities
//       const careers = [
//         doc.career_opportunity_1,
//         doc.career_opportunity_2,
//         doc.career_opportunity_3,
//         doc.career_opportunity_4,
//         doc.career_opportunity_5,
//       ].filter(Boolean);
//       if (careers.length > 0) {
//         textContent += `Career Opportunities: ${careers.join(", ")}\n`;
//       }

//       // Enhanced metadata for courses
//       metadata = {
//         title: courseTitle,
//         country: doc.countryname || "",
//         city: doc.city || "",
//         campusLocation: doc.location_campus || "",
//         degree: doc.course_level || "",
//         educationLevel: doc.education_level || "",
//         subject: courseTitle,
//         university: doc.universityname || "",
//         duration: doc.duration || "",
//         degreeFormat: doc.degree_format || "",
//         applicationFee: doc.application_fee || null,
//         annualTuitionFee: doc.annual_tuition_fee || null,
//         initialDeposit: doc.initial_deposit || "",
//         testScores: {
//           ielts: doc.required_ielts_score || "",
//           pte: doc.required_pte_score || "",
//           toefl: doc.required_toefl_score || "",
//         },
//         entryRequirements: doc.entry_requirements || "",
//         intake: doc.intake || [],
//         startDates: doc.start_date || [],
//         courseStructure: doc.course_structure || "",
//         yearWiseCurriculum: {
//           year1: doc.year_1 || "",
//           year2: doc.year_2 || "",
//           year3: doc.year_3 || "",
//           year4: doc.year_4 || "",
//           year5: doc.year_5 || "",
//         },
//         careerOpportunities: careers,
//         originalDoc: doc,
//       };
//       break;

//     case "scholarships":
//       textContent += `Scholarship: ${doc.name || ""}\n`;
//       textContent += `Host Country: ${doc.hostCountry || ""}\n`;
//       textContent += `Type: ${doc.type || ""}\n`;
//       textContent += `Provider: ${doc.provider || ""}\n`;
//       textContent += `Deadline: ${doc.deadline || ""}\n`;
//       textContent += `Number of Scholarships: ${
//         doc.numberOfScholarships || ""
//       }\n`;
//       textContent += `Minimum Requirements: ${doc.minimumRequirements || ""}\n`;

//       if (doc.overview) {
//         textContent += `Overview: ${truncateText(
//           typeof doc.overview === "string" ? doc.overview : "",
//           400
//         )}\n`;
//       }

//       // Duration information
//       if (doc.duration && typeof doc.duration === "object") {
//         const duration = doc.duration as {
//           general?: string;
//           bachelors?: string;
//           masters?: string;
//           phd?: string;
//         };
//         const durationInfo = [];
//         if (duration.general) durationInfo.push(`General: ${duration.general}`);
//         if (duration.bachelors)
//           durationInfo.push(`Bachelors: ${duration.bachelors}`);
//         if (duration.masters) durationInfo.push(`Masters: ${duration.masters}`);
//         if (duration.phd) durationInfo.push(`PhD: ${duration.phd}`);
//         if (durationInfo.length > 0) {
//           textContent += `Duration: ${durationInfo.join(", ")}\n`;
//         }
//       } else if (doc.duration) {
//         textContent += `Duration: ${doc.duration}\n`;
//       }

//       // Programs
//       if (doc.programs && Array.isArray(doc.programs)) {
//         textContent += `Programs: ${doc.programs.join(", ")}\n`;
//       }

//       // Benefits
//       if (doc.benefits && Array.isArray(doc.benefits)) {
//         textContent += `Benefits: ${doc.benefits.join(", ")}\n`;
//       }

//       // Applicable departments
//       if (
//         doc.applicableDepartments &&
//         Array.isArray(doc.applicableDepartments)
//       ) {
//         const departments = doc.applicableDepartments
//           .map(
//             (dept: { name: string; details: string }) =>
//               `${dept.name}${dept.details ? ` (${dept.details})` : ""}`
//           )
//           .join(", ");
//         textContent += `Applicable Departments: ${departments}\n`;
//       }

//       // Eligibility criteria
//       if (doc.eligibilityCriteria && Array.isArray(doc.eligibilityCriteria)) {
//         const criteria = doc.eligibilityCriteria
//           .map(
//             (crit: { criterion: string; details: string }) =>
//               `${crit.criterion}${crit.details ? `: ${crit.details}` : ""}`
//           )
//           .join(" | ");
//         textContent += `Eligibility Criteria: ${criteria}\n`;
//       }

//       // Required documents
//       if (doc.requiredDocuments && Array.isArray(doc.requiredDocuments)) {
//         const documents = doc.requiredDocuments
//           .map(
//             (doc: { document: string; details: string }) =>
//               `${doc.document}${doc.details ? ` (${doc.details})` : ""}`
//           )
//           .join(", ");
//         textContent += `Required Documents: ${documents}\n`;
//       }

//       // Application process
//       if (doc.applicationProcess && Array.isArray(doc.applicationProcess)) {
//         const process = doc.applicationProcess
//           .map(
//             (step: { step: string; details: string }) =>
//               `${step.step}${step.details ? `: ${step.details}` : ""}`
//           )
//           .join(" | ");
//         textContent += `Application Process: ${process}\n`;
//       }

//       // Success chances
//       if (doc.successChances && typeof doc.successChances === "object") {
//         const chances = doc.successChances as {
//           academicBackground?: string;
//           age?: string;
//           englishProficiency?: string;
//           gradesAndCGPA?: string;
//           nationality?: string;
//           workExperience?: string;
//         };
//         const successInfo = [];
//         if (chances.academicBackground)
//           successInfo.push(`Academic: ${chances.academicBackground}`);
//         if (chances.age) successInfo.push(`Age: ${chances.age}`);
//         if (chances.englishProficiency)
//           successInfo.push(`English: ${chances.englishProficiency}`);
//         if (chances.gradesAndCGPA)
//           successInfo.push(`Grades: ${chances.gradesAndCGPA}`);
//         if (chances.nationality)
//           successInfo.push(`Nationality: ${chances.nationality}`);
//         if (chances.workExperience)
//           successInfo.push(`Work Experience: ${chances.workExperience}`);
//         if (successInfo.length > 0) {
//           textContent += `Success Chances: ${successInfo.join(", ")}\n`;
//         }
//       }

//       // Enhanced metadata for scholarships
//       metadata = {
//         title: doc.name || "Untitled Scholarship",
//         country: doc.hostCountry || "",
//         type: doc.type || "",
//         provider: doc.provider || "",
//         deadline: doc.deadline || "",
//         numberOfScholarships: doc.numberOfScholarships || null,
//         minimumRequirements: doc.minimumRequirements || "",
//         duration: doc.duration || "",
//         programs: doc.programs || [],
//         benefits: doc.benefits || [],
//         applicableDepartments: doc.applicableDepartments || [],
//         eligibilityCriteria: doc.eligibilityCriteria || [],
//         requiredDocuments: doc.requiredDocuments || [],
//         applicationProcess: doc.applicationProcess || [],
//         successChances: doc.successChances || {},
//         originalDoc: doc,
//       };
//       break;

//     case "expenses":
//       textContent += `Country: ${doc.country_name || ""}\n`;
//       textContent += `University: ${doc.university_name || ""}\n`;

//       if (doc.lifestyles && Array.isArray(doc.lifestyles)) {
//         doc.lifestyles.forEach(
//           (
//             lifestyle: {
//               type: string;
//               currency: string;
//               rent: { min: number; max: number };
//               groceries: { min: number; max: number };
//               public_transport: { min: number; max: number };
//               utilities: { min: number; max: number };
//               internet: { min: number; max: number };
//               mobile: { min: number; max: number };
//               total_estimated_cost: { min: number; max: number };
//             },
//             index: number
//           ) => {
//             if (typeof lifestyle === "object" && lifestyle !== null) {
//               textContent += `\nLifestyle ${index + 1} - ${
//                 lifestyle.type || "Unknown"
//               } (${lifestyle.currency || ""})\n`;

//               // Cost breakdown
//               if (lifestyle.rent) {
//                 textContent += `Rent: ${lifestyle.rent.min || 0} - ${
//                   lifestyle.rent.max || 0
//                 }\n`;
//               }
//               if (lifestyle.groceries) {
//                 textContent += `Groceries: ${lifestyle.groceries.min || 0} - ${
//                   lifestyle.groceries.max || 0
//                 }\n`;
//               }
//               if (lifestyle.public_transport) {
//                 textContent += `Public Transport: ${
//                   lifestyle.public_transport.min || 0
//                 } - ${lifestyle.public_transport.max || 0}\n`;
//               }
//               if (lifestyle.utilities) {
//                 textContent += `Utilities: ${lifestyle.utilities.min || 0} - ${
//                   lifestyle.utilities.max || 0
//                 }\n`;
//               }
//               if (lifestyle.internet) {
//                 textContent += `Internet: ${lifestyle.internet.min || 0} - ${
//                   lifestyle.internet.max || 0
//                 }\n`;
//               }
//               if (lifestyle.mobile) {
//                 textContent += `Mobile: ${lifestyle.mobile.min || 0} - ${
//                   lifestyle.mobile.max || 0
//                 }\n`;
//               }
//               if (lifestyle.total_estimated_cost) {
//                 textContent += `Total Estimated Cost: ${
//                   lifestyle.total_estimated_cost.min || 0
//                 } - ${lifestyle.total_estimated_cost.max || 0}\n`;
//               }
//             }
//           }
//         );
//       }

//       // Enhanced metadata for expenses
//       metadata = {
//         title: `${doc.country_name || "Country"} - ${
//           doc.university_name || "University"
//         } Expenses`,
//         country: doc.country_name || "",
//         university: doc.university_name || "",
//         lifestyles: Array.isArray(doc.lifestyles)
//           ? doc.lifestyles.map(
//               (lifestyle: {
//                 type: string;
//                 currency: string;
//                 rent: { min: number; max: number };
//                 groceries: { min: number; max: number };
//                 public_transport: { min: number; max: number };
//                 utilities: { min: number; max: number };
//                 internet: { min: number; max: number };
//                 mobile: { min: number; max: number };
//                 total_estimated_cost: { min: number; max: number };
//               }) => ({
//                 type: lifestyle?.type || "",
//                 currency: lifestyle?.currency || "",
//                 costs: {
//                   rent: lifestyle?.rent || { min: 0, max: 0 },
//                   groceries: lifestyle?.groceries || { min: 0, max: 0 },
//                   publicTransport: lifestyle?.public_transport || {
//                     min: 0,
//                     max: 0,
//                   },
//                   utilities: lifestyle?.utilities || { min: 0, max: 0 },
//                   internet: lifestyle?.internet || { min: 0, max: 0 },
//                   mobile: lifestyle?.mobile || { min: 0, max: 0 },
//                   totalEstimatedCost: lifestyle?.total_estimated_cost || {
//                     min: 0,
//                     max: 0,
//                   },
//                 },
//               })
//             )
//           : [],
//         originalDoc: doc,
//       };
//       break;

//     default:
//       metadata = {
//         title: "Untitled",
//         originalDoc: doc,
//       };
//       break;
//   }

//   return { textContent, metadata };
// }

// // Combined country embeddings (NEW from embedding-operations.ts)
// export async function createCombinedCountryEmbeddings(
//   targetCollection: string = "country_embeddings",
//   batchSize: number = 5
// ) {
//   console.log(`🌍 Creating combined country embeddings...`);

//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");

//     // Get all countries
//     const countriesCollection = db.collection("countries");
//     const countries = await countriesCollection.find({}).toArray();

//     console.log(`📊 Found ${countries.length} countries to process`);

//     // Clear existing embeddings
//     const embeddingCollection = db.collection(targetCollection);
//     await embeddingCollection.deleteMany({});

//     // Process countries in batches
//     for (let i = 0; i < countries.length; i += batchSize) {
//       const batch = countries.slice(i, i + batchSize);
//       const batchEmbeddings = [];

//       for (const country of batch) {
//         try {
//           const countryName = country.country_name || "";
//           const countryId = country._id?.toString() || "";

//           // Fetch country documents from countryData collection
//           const countryDataCollection = db.collection("countrydatas");
//           const countryDocuments = await countryDataCollection
//             .find({
//               countryname: { $regex: new RegExp(countryName, "i") },
//             })
//             .toArray();

//           console.log(
//             `📋 Fetched ${countryDocuments.length} document sets for country ${countryName}`
//           );

//           // Create combined text content
//           const textContent = createCombinedCountryTextContent(
//             { ...country, _id: country._id?.toString?.() ?? "" },
//             countryDocuments.map((doc) => ({
//               ...doc,
//               _id: doc._id?.toString?.() ?? "",
//             }))
//           );

//           console.log(
//             `📝 Generated text content for country ${countryName}:`,
//             textContent.substring(0, 200) + "..."
//           );

//           const metadata = {
//             title: countryName || "Country Profile",
//             country: countryName,
//             capital: country.capital || "",
//             language: country.language || "",
//             population: country.population || null,
//             currency: country.currency || "",
//             internationalStudents: country.international_students || null,
//             academicIntakes: country.academic_intakes || "",
//             workRights: {
//               whileStudying: country.work_while_studying || "",
//               afterStudy: country.work_after_study || "",
//             },
//             livingCosts: {
//               rent: country.rent || null,
//               groceries: country.groceries || null,
//               transportation: country.transportation || null,
//               healthcare: country.healthcare || null,
//               eatingOut: country.eating_out || null,
//               householdBills: country.household_bills || null,
//               miscellaneous: country.miscellaneous || null,
//             },
//             residency: country.residency || [],
//             popularPrograms: country.popular_programs || [],
//             visaRequirements: country.visa_requirements || [],
//             accommodationOptions: country.accomodation_options || [],
//             health: country.health || [],
//             scholarships: country.scholarships || [],
//             documentRequirements: countryDocuments.map((docData) => ({
//               embassyDocuments: docData.embassyDocuments || [],
//               universityDocuments: docData.universityDocuments || [],
//             })),
//             hasDocumentData: countryDocuments.length > 0,
//             originalDoc: country,
//           };

//           const embedding = await embeddings.embedQuery(textContent);

//           batchEmbeddings.push({
//             text: textContent,
//             embedding: embedding,
//             countryName: countryName,
//             sourceCollection: "combined_country_data",
//             originalId: countryId,
//             domain: "country",
//             metadata: metadata,
//             createdAt: new Date(),
//           });

//           // Rate limiting
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         } catch (error) {
//           console.error(
//             `❌ Error processing country ${country.country_name}:`,
//             error
//           );
//         }
//       }

//       // Insert batch
//       if (batchEmbeddings.length > 0) {
//         await embeddingCollection.insertMany(batchEmbeddings);
//         console.log(
//           `✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
//             countries.length / batchSize
//           )}`
//         );
//       }
//     }

//     console.log(`🎉 Completed creating combined country embeddings!`);
//     return {
//       totalProcessed: countries.length,
//       collectionName: targetCollection,
//     };
//   } catch (error) {
//     console.error(`❌ Error creating combined country embeddings:`, error);
//     throw error;
//   }
// }

// // Updated createDomainEmbeddings function with enhanced metadata
// export async function createDomainEmbeddings() {
//   console.log("🚀 Starting domain embeddings creation...");

//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     const results: Record<
//       string,
//       {
//         documentsProcessed: number;
//         embeddingsCreated: number;
//         collectionName?: string;
//       }
//     > = {};

//     for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
//       console.log(`\n🔄 Processing ${domain}...`);

//       const sourceCollection = db.collection(config.source);
//       const targetCollection = db.collection(config.target);

//       // Clear existing embeddings
//       await targetCollection.deleteMany({});

//       // Get documents
//       const documents = await sourceCollection.find({}).toArray();
//       console.log(`📊 Found ${documents.length} ${domain} documents`);

//       if (documents.length === 0) {
//         results[domain] = { documentsProcessed: 0, embeddingsCreated: 0 };
//         continue;
//       }

//       let totalProcessed = 0;
//       const batchSize = 10;

//       for (let i = 0; i < documents.length; i += batchSize) {
//         const batch = documents.slice(i, i + batchSize);
//         const batchEmbeddings = [];

//         for (const doc of batch) {
//           try {
//             // Use the enhanced createTextContent function
//             const { textContent, metadata } = createTextContent(
//               doc,
//               config.source
//             );

//             if (textContent.trim()) {
//               const embedding = await embeddings.embedQuery(textContent);

//               batchEmbeddings.push({
//                 text: textContent,
//                 embedding: embedding,
//                 domain: domain,
//                 sourceCollection: config.source,
//                 originalId: doc._id.toString(),
//                 ...metadata, // Spread metadata at root level for compatibility
//                 metadata: metadata, // Also keep nested for new structure
//                 createdAt: new Date(),
//               });

//               totalProcessed++;

//               // Rate limiting
//               await new Promise((resolve) => setTimeout(resolve, 50));
//             }
//           } catch (error) {
//             console.error(
//               `❌ Error processing ${domain} document ${doc._id}:`,
//               error
//             );
//           }
//         }

//         // Insert batch
//         if (batchEmbeddings.length > 0) {
//           await targetCollection.insertMany(batchEmbeddings);
//           console.log(
//             `✅ ${domain}: ${totalProcessed}/${documents.length} processed`
//           );
//         }
//       }

//       results[domain] = {
//         documentsProcessed: totalProcessed,
//         embeddingsCreated: totalProcessed,
//         collectionName: config.target,
//       };
//     }

//     console.log("✅ Domain embeddings completed");
//     return results;
//   } catch (error) {
//     console.error("❌ Error in createDomainEmbeddings:", error);
//     throw error;
//   }
// }

// // Main function - Enhanced with combined country embeddings option
// export async function createAllEmbeddings(
//   includeCombinedCountries: boolean = false
// ) {
//   console.log("🚀 Starting complete embeddings creation...");

//   try {
//     // Step 1: Create user embeddings first (prioritized)
//     console.log("👤 Step 1: Creating user embeddings...");
//     const userResults = await createUserEmbeddings();
//     console.log("✅ User embeddings completed");

//     // Step 2: Create domain embeddings
//     console.log("\n📋 Step 2: Creating domain embeddings...");
//     const domainResults = await createDomainEmbeddings();
//     console.log("✅ Domain embeddings completed");

//     // Step 3: Optionally create combined country embeddings
//     let combinedCountryResults = null;
//     if (includeCombinedCountries) {
//       console.log("\n🌍 Step 3: Creating combined country embeddings...");
//       combinedCountryResults = await createCombinedCountryEmbeddings();
//       console.log("✅ Combined country embeddings completed");
//     }

//     const finalResults = {
//       users: userResults,
//       domains: domainResults,
//       combinedCountries: combinedCountryResults,
//       timestamp: new Date().toISOString(),
//     };

//     console.log("\n🎉 All embeddings creation completed");
//     console.log("📊 Results:", JSON.stringify(finalResults, null, 2));

//     return finalResults;
//   } catch (error) {
//     console.error("❌ Error in createAllEmbeddings:", error);
//     throw error;
//   }
// }

// // Utility function to get embedding statistics
// export async function getEmbeddingStats() {
//   console.log("📊 Getting embedding statistics...");

//   try {
//     const client = await clientPromise;
//     const db = client.db("wwah");
//     const stats: Record<string, { count: number; collection: string }> = {};

//     // User embeddings stats
//     const userCollection = db.collection("user_embeddings");
//     const userCount = await userCollection.countDocuments();
//     stats["users"] = { count: userCount, collection: "user_embeddings" };

//     // Domain embeddings stats
//     for (const [domain, config] of Object.entries(COLLECTION_MAPPING)) {
//       const collection = db.collection(config.target);
//       const count = await collection.countDocuments();
//       stats[domain] = { count, collection: config.target };
//     }

//     console.log("📊 Statistics:", JSON.stringify(stats, null, 2));
//     return stats;
//   } catch (error) {
//     console.error("❌ Error getting stats:", error);
//     throw error;
//   }
// }

// // Execute main function
// async function main() {
//   try {
//     console.log("🚀 Starting embeddings creation process...");

//     // You can set this to true if you want to include combined country embeddings
//     const includeCombinedCountries = process.argv.includes(
//       "--combined-countries"
//     );

//     const results = await createAllEmbeddings(includeCombinedCountries);
//     console.log("✅ Process completed successfully", results);
//   } catch (error) {
//     console.error("❌ Process failed:", error);
//     process.exit(1);
//   } finally {
//     console.log("🔄 Exiting...");
//     process.exit(0);
//   }
// }

// // Run if executed directly
// if (require.main === module) {
//   main();
// }
