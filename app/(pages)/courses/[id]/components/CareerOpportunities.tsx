
import Image from 'next/image';
import React from 'react'

interface CareerOpportunitiesProps {
  data: {
    _id: string;
    countryname: string;
    universityname: string;
    course_link: string;
    course_title: string;
    required_ielts_score: string;
    required_pte_score: string;
    required_toefl_score: string;
    entry_requirement: string;
    education_level: string;
    course_level: string;
    intake: string;
    duration: string;
    start_date: string;
    degree_format: string;
    location_campus: string;
    annual_tuition_fee: {
      currency: string;
      amount: string;
    };
    initial_deposit: string;
    overview: string;
    course_structure: string;
    year_1?: string;
    year_2?: string;
    year_3?: string;
    year_4?: string;
    year_5?: string;
    year_6?: string;
    career_opportunity_1?: string;
    career_opportunity_2?: string;
    career_opportunity_3?: string;
    career_opportunity_4?: string;
    career_opportunity_5?: string;
  };
}

export const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ data }) => {
  return (
    <>
      <section className="hidden md:flex flex-col items-center bg-black text-white py-8 mt-5">
        <h4>Career Opportunities!</h4>
        {/* Timeline Image */}
        <div className="relative w-full flex justify-center mt-4">
          <Image
            src="/countrypage/scholarship.svg"
            alt="Scholarships Timeline"
            width={900}
            height={300}
            className="w-full md:w-[80%] lg:w-[70%]"
          />
        </div>

        <div className="flex w-full md:w-[95%] lg:w-[85%] mt-4">
          <p className="text-xs sm:text-sm lg:text-base text-center w-2/5">
            {data.career_opportunity_1}
          </p>
          <p className="text-xs sm:text-sm lg:text-base text-center w-2/5">
            {data.career_opportunity_2}
          </p>
          <p className="text-xs sm:text-sm lg:text-base text-center w-2/5">
            {data.career_opportunity_3}

          </p>
          <p className="text-xs sm:text-sm lg:text-base text-center w-2/5">
            {data.career_opportunity_4}

          </p>
          <p className="text-xs sm:text-sm lg:text-base text-center w-2/5">
            {data.career_opportunity_5}

          </p>
        </div>
      </section>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-start bg-black text-white py-8 px-6">
        <h4>Scholarships in {data?.course_title}!</h4>
        <div className="flex flex-col space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/countrypage/yellow.svg"
              alt="Chevening Scholarships"
              width={15}
              height={15}
            />
            <p>{data.career_opportunity_1}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Image
              src="/countrypage/orange.svg"
              alt="Rhodes Scholarships"
              width={15}
              height={15}
            />
            <p>{data.career_opportunity_2}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Image
              src="/countrypage/red.svg"
              alt="Great Scholarships"
              width={15}
              height={15}
            />
            <p>{data.career_opportunity_3}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Image
              src="/countrypage/sky.svg"
              alt="Gates Cambridge Scholarships"
              width={15}
              height={15}
            />
            <p>{data.career_opportunity_4}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Image
              src="/countrypage/blue.svg"
              alt="Rhodes Scholarships"
              width={15}
              height={15}
            />
            <p>{data.career_opportunity_5}</p>
          </div>
        </div>
      </div>
    </>
  );
}
