import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses";
import { University } from "@/models/universities";
interface UniqueFilterBase {
    countryname: string;
    universityname: string;
    university_id: string;
}

interface UniqueFilterByCourseId extends UniqueFilterBase {
    course_id: string;
}

interface UniqueFilterByCourseLink extends UniqueFilterBase {
    course_link: string;
}

interface UniqueFilterByCourseTitle extends UniqueFilterBase {
    course_title: string;
}

type UniqueFilter = UniqueFilterByCourseId | UniqueFilterByCourseLink | UniqueFilterByCourseTitle;
interface Course {
    course_title?: string;
    required_ielts_score?: number | null;
    required_pte_score?: number | null;
    required_toefl_score?: number | null;
    entry_requirements?: string | null;
    entry_requirement?: string | null;
    education_level?: string | null;
    course_level?: string | null;
    intake?: string | string[] | null;
    duration?: string | null;
    start_date?: string | string[] | null;
    degree_format?: string | null;
    location_campus?: string | null;
    annual_tuition_fee?: { currency: string; amount: number } | null;
    initial_deposit?: string | null;
    overview?: string | null;
    course_structure?: string | null;
    year_1?: string | null;
    year_2?: string | null;
    year_3?: string | null;
    year_4?: string | null;
    year_5?: string | null;
    career_opportunity_1?: string | null;
    career_opportunity_2?: string | null;
    career_opportunity_3?: string | null;
    career_opportunity_4?: string | null;
    career_opportunity_5?: string | null;
    application_fee?: string | null;
    scholarship_detail?: string | null;
    scholarship_link?: string | null;
    funding_link?: string | null;
    payment_method?: string | null;
    university_youtube_video?: string | null;
    city?: string | null;
    course_link?: string | null;
    course_id?: string | null;
}

interface PreparedCourseData {
    updateFields: {
        course_title?: string;
        required_ielts_score?: number | null;
        required_pte_score?: number | null;
        required_toefl_score?: number | null;
        entry_requirements?: string | null;
        education_level?: string | null;
        course_level?: string | null;
        intake: string[];
        duration?: string | null;
        start_date: string[];
        degree_format?: string | null;
        location_campus?: string | null;
        annual_tuition_fee: { currency: string; amount: number };
        initial_deposit?: string | null;
        overview?: string | null;
        course_structure?: string | null;
        year_1?: string | null;
        year_2?: string | null;
        year_3?: string | null;
        year_4?: string | null;
        year_5?: string | null;
        career_opportunity_1?: string | null;
        career_opportunity_2?: string | null;
        career_opportunity_3?: string | null;
        career_opportunity_4?: string | null;
        career_opportunity_5?: string | null;
        application_fee?: string | null;
        scholarship_detail?: string | null;
        scholarship_link?: string | null;
        funding_link?: string | null;
        payment_method?: string | null;
        university_youtube_video?: string | null;
        city?: string | null;
    };
    insertOnlyFields: {
        countryname: string;
        universityname: string;
        university_id: string;
        course_link?: string | null;
        course_id?: string | null;
    };
}
export async function POST(req: Request) {
    try {
        // Connect to database first to ensure connection is ready
        await connectToDatabase();

        // Parse and validate input data
        const data = await req.json();

        // Enhanced validation
        if (!data.country?.trim()) {
            return NextResponse.json({ message: "Country name is required" }, { status: 400 });
        }

        if (!data.university?.trim()) {
            return NextResponse.json({ message: "University name is required" }, { status: 400 });
        }

        if (!Array.isArray(data.courses) || data.courses.length === 0) {
            return NextResponse.json({ message: "At least one course is required" }, { status: 400 });
        }

        // Normalize data to prevent inconsistencies
        const normalizedCountry = data.country.trim();
        const normalizedUniversity = data.university.trim();

        // Find university with proper error handling
        const university = await University.findOne({
            country_name: normalizedCountry,
            university_name: normalizedUniversity
        });

        if (!university) {
            return NextResponse.json(
                { message: `University '${normalizedUniversity}' in '${normalizedCountry}' not found` },
                { status: 404 }
            );
        }

        interface Result {
            added: { _id: string; title: string; identifier: UniqueFilter }[];
            updated: { _id: string; title: string; identifier: UniqueFilter }[];
            skipped: { title?: string; reason: string; details?: string }[];
            failed: { course: string; error: string }[];
        }

        const result: Result = {
            added: [],
            updated: [],
            skipped: [],
            failed: []
        };

        // Process courses
        for (const course of data.courses) {
            try {
                // Validate individual course mandatory fields
                if (!course.course_title) {
                    console.warn(`Course without title skipped`);
                    result.skipped.push({ ...course, reason: "Missing course title" });
                    continue;
                }

                // Create unique identifier - prioritize course_link, then course_id, then title
                const courseIdentifier = createUniqueFilter(course, normalizedCountry, normalizedUniversity, university._id);
                // console.log(`Processing course`, courseIdentifier);

                // Prepare data for database operation
                const { updateFields, insertOnlyFields } = prepareCoursesData(course, normalizedCountry, normalizedUniversity, university._id);

                try {
                    // Use findOneAndUpdate for atomic operation
                    const updatedCourse = await Courses.findOneAndUpdate(
                        courseIdentifier,
                        {
                            $set: updateFields,
                            $setOnInsert: insertOnlyFields
                        },
                        {
                            upsert: true,
                            new: true,
                            runValidators: true
                        }
                    );

                    // Determine if this was an insert or update by checking timestamps
                    const isNewDocument = updatedCourse.created_at && updatedCourse.updated_at &&
                        Math.abs(updatedCourse.created_at.getTime() - updatedCourse.updated_at.getTime()) < 1000;

                    if (isNewDocument) {
                        console.log(`Inserted new course: ${course.course_title}`);
                        result.added.push({
                            _id: updatedCourse._id,
                            title: course.course_title,
                            identifier: courseIdentifier
                        });
                    } else {
                        console.log(`Updated existing course: ${course.annual_tuition_fee}`);
                        result.updated.push({
                            _id: updatedCourse._id,
                            title: course.course_title,
                            identifier: courseIdentifier
                        });
                    }
                } catch (dbError: unknown) {
                    if (dbError && typeof dbError === "object" && "code" in dbError) {
                        const errorObj = dbError as { code?: number; keyValue?: string[] };
                        if (errorObj.code === 11000) {
                            console.warn(`Duplicate course detected: ${course.course_title}`, errorObj.keyValue);
                            result.skipped.push({
                                title: course.course_title,
                                reason: "Duplicate course",
                                details: Array.isArray(errorObj.keyValue) ? errorObj.keyValue.join(", ") : errorObj.keyValue
                            });
                        } else {
                            throw dbError; // Re-throw for the outer catch block
                        }
                    } else {
                        throw dbError;
                    }
                }

            } catch (courseError) {
                console.error(`Error processing course: ${course.course_title || 'Unknown'}`, courseError);
                result.failed.push({
                    course: course.course_title || 'Unknown',
                    error: (courseError as Error).message
                });
            }
        }

        // Provide detailed response
        return NextResponse.json({
            message: "Courses processing completed",
            summary: {
                added: result.added.length,
                updated: result.updated.length,
                skipped: result.skipped.length,
                failed: result.failed.length,
                total: data.courses.length
            },
            details: result
        }, {
            status: result.failed.length > 0 ? 207 : 200 // 207 Multi-Status for partial success
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            {
                message: "Failed to process the request",
                error: (error as Error).message,
                stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
            },
            { status: 500 }
        );
    }
}

// Helper function to create a unique filter based on available identifiers
// Quick fix: Modified helper function to avoid null course_link conflicts
function createUniqueFilter(course: Course, country: string, university: string, universityId: string): UniqueFilter {
    const baseFilter: UniqueFilterBase = {
        countryname: country,
        universityname: university,
        university_id: universityId
    };

    // PRIORITY 1: Use course_id if available (most reliable)
    if (course.course_id && course.course_id.trim() !== '') {
        console.log(`Using course_id for uniqueness: ${course.course_id}`);
        return { ...baseFilter, course_id: course.course_id };
    }

    // PRIORITY 2: Use course_link only if it's not null/empty
    else if (course.course_link && course.course_link.trim() !== '') {
        console.log(`Using course_link for uniqueness: ${course.course_link}`);
        return { ...baseFilter, course_link: course.course_link };
    }

    // PRIORITY 3: Fallback to course_title
    else {
        console.log(`Using course_title for uniqueness: ${course.course_title}`);
        return { ...baseFilter, course_title: course.course_title || "" };
    }
}

// Helper function to prepare course data
function prepareCoursesData(
    course: Course,
    country: string,
    university: string,
    universityId: string
): PreparedCourseData {
    // Fields that will be updated even if the course exists
    const updateFields = {
        course_title: course.course_title,
        required_ielts_score: course.required_ielts_score || null,
        required_pte_score: course.required_pte_score || null,
        required_toefl_score: course.required_toefl_score || null,
        entry_requirements: course.entry_requirements || course.entry_requirement || null,
        education_level: course.education_level || null,
        course_level: course.course_level || null,
        intake: Array.isArray(course.intake) ? course.intake : course.intake ? [course.intake] : [],
        duration: course.duration || null,
        start_date: Array.isArray(course.start_date) ? course.start_date : course.start_date ? [course.start_date] : [],
        degree_format: course.degree_format || null,
        location_campus: course.location_campus || null,
        annual_tuition_fee: course.annual_tuition_fee || { currency: "$", amount: 0 },
        initial_deposit: course.initial_deposit || null,
        overview: course.overview || null,
        course_structure: course.course_structure || null,
        year_1: course.year_1 || null,
        year_2: course.year_2 || null,
        year_3: course.year_3 || null,
        year_4: course.year_4 || null,
        year_5: course.year_5 || null,
        career_opportunity_1: course.career_opportunity_1 || null,
        career_opportunity_2: course.career_opportunity_2 || null,
        career_opportunity_3: course.career_opportunity_3 || null,
        career_opportunity_4: course.career_opportunity_4 || null,
        career_opportunity_5: course.career_opportunity_5 || null,
        application_fee: course.application_fee || null,
        scholarship_detail: course.scholarship_detail || null,
        scholarship_link: course.scholarship_link || null,
        funding_link: course.funding_link || null,
        payment_method: course.payment_method || null,
        university_youtube_video: course.university_youtube_video || null,
        city: course.city || null
    };

    // Fields that will only be set on first insert
    const insertOnlyFields = {
        countryname: country,
        universityname: university,
        university_id: universityId,
        course_link: course.course_link || null,
        course_id: course.course_id || null
    };

    return { updateFields, insertOnlyFields };
}