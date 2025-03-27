import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Courses } from "@/models/courses"; // Your Courses model
import { University } from "@/models/universities"; // Assuming you have a Universities model

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Validate input
    if (
      !data.country ||
      !data.university ||
      !Array.isArray(data.courses) ||
      data.courses.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid input. University and a non-empty courses array are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const addedCourses = [];

    // for (const course of data.courses) {
    //   const updatedCourse = await Courses.updateOne(
    //     {
    //       countryname: data.country,
    //       universityname: data.university,
    //       course_link: course.course_link, // Ensures uniqueness
    //     },
    //     {
    //       $setOnInsert: {  // This ensures only new courses are inserted
    //         countryname: data.country,
    //         universityname: data.university,
    //         course_link: course.course_link,
    //         course_title: course.course_title,
    //         required_ielts_score: course.required_ielts_score || null,
    //         required_pte_score: course.required_pte_score || null,
    //         required_toefl_score: course.required_toefl_score || null,
    //         entry_requirement: course.entry_requirement || null,
    //         education_level: course.education_level || null,
    //         course_level: course.course_level || null,
    //         intake: course.intake || null,
    //         duration: course.duration || null,
    //         start_date: course.start_date || null,
    //         degree_format: course.degree_format || null,
    //         location_campus: course.location_campus || null,
    //         annual_tuition_fee: course.annual_tuition_fee ?? { currency: "$", amount: 0 },
    //         initial_deposit: course.initial_deposit || null,
    //         overview: course.overview || null,
    //         course_structure: course.course_structure || null,
    //         year_1: course.year_1 || null,
    //         year_2: course.year_2 || null,
    //         career_opportunity_1: course.career_opportunity_1 || null,
    //         career_opportunity_2: course.career_opportunity_2 || null,
    //         career_opportunity_3: course.career_opportunity_3 || null,
    //         career_opportunity_4: course.career_opportunity_4 || null,
    //         career_opportunity_5: course.career_opportunity_5 || null,
    //       }
    //     },
    //     { upsert: true }
    //   );

    //   // ✅ Track inserted or updated courses
    //   if (updatedCourse.upsertedCount > 0) {
    //     console.log(`Inserted new course: ${course.course_title}`);
    //     addedCourses.push(course);
    //   } else if (updatedCourse.modifiedCount > 0) {
    //     console.log(`Updated existing course: ${course.course_title}`);
    //     addedCourses.push(course);
    //   }
    // }
    // Fetch the university ID based on the university name
    const university = await University.findOne({
      country_name: data.country.trim(),
      university_name: data.university.trim()

    });

    if (!university) {
      return NextResponse.json(
        { message: "University not found." },
        { status: 404 }
      );
    }
    for (const course of data.courses) {
      // Include university_id in each course object
      course.university_id = university._id;
      try {
        // Create a filter that uses course_link if available, otherwise course_title
        const filter = {
          countryname: data.country.trim(),
          universityname: data.university.trim(),
          ...(course.course_link
            ? { course_link: course.course_link }
            : { course_title: course.course_title }
          )
        };

        const updatedCourse = await Courses.updateOne(
          filter,
          {
            $setOnInsert: {  // This ensures only new courses are inserted
              countryname: data.country,
              universityname: data.university,
              university_id: course.university_id,
              course_link: course.course_link,
              course_title: course.course_title,
              required_ielts_score: course.required_ielts_score || null,
              required_pte_score: course.required_pte_score || null,
              required_toefl_score: course.required_toefl_score || null,
              entry_requirements: course.entry_requirements || null,
              education_level: course.education_level || null,
              course_level: course.course_level || null,
              intake: course.intake || null,
              duration: course.duration || null,
              start_date: course.start_date || null,
              degree_format: course.degree_format || null,
              location_campus: course.location_campus || null,
              annual_tuition_fee: course.annual_tuition_fee || { currency: "$", amount: 0 },
              initial_deposit: course.initial_deposit || null,
              overview: course.overview || null,
              course_structure: course.course_structure || null,
              year_1: course.year_1 || null,
              year_2: course.year_2 || null,
              career_opportunity_1: course.career_opportunity_1 || null,
              career_opportunity_2: course.career_opportunity_2 || null,
              career_opportunity_3: course.career_opportunity_3 || null,
              career_opportunity_4: course.career_opportunity_4 || null,
              career_opportunity_5: course.career_opportunity_5 || null,
            }
          },
          { upsert: true }
        );

        if (updatedCourse.upsertedCount > 0) {
          console.log(`Inserted new course: ${course.course_title}`);
          addedCourses.push(course);
        } else if (updatedCourse.modifiedCount > 0) {
          console.log(`Updated existing course: ${course.course_title}`);
          addedCourses.push(course);
        }
      } catch (dbError) {
        console.error(`Error updating course: ${course.course_title}`, dbError);
        return NextResponse.json(
          { message: `Failed to update course ${course.course_title}`, error: (dbError as Error).message },
          { status: 500 }
        );
      }
    }

    if (addedCourses.length === 0) {
      return NextResponse.json(
        { message: "All provided courses already exist for this university and country." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Added or updated courses.", data: addedCourses },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Failed to process the request.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
