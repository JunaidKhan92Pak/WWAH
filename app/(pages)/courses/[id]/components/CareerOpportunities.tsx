
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
    <section
      id="careerOpportunities"
      className="my-7 relative bg-black bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
    // style={{
    //   backgroundImage: "url('/bg-usa.png')",
    //   backgroundColor: "#000000",
    // }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
      <div className="flex flex-col md:flex-row w-full gap-5 m-4 justify-center items-center">
        <div className="relative w-full md:w-1/2 md:space-y-5 p-3 text-white">
          <h3>Career Opportunities</h3>
          <p className="text-[#e6e3e3] ">
            Unlock a world of career opportunities that align with your skills
            and passions. Discover industries, job roles, and professional
            growth paths that set you up for long-term success.
          </p>
        </div>
        {/* <div  className="flex relative w-full md:w-1/2 justify-center items-center">
            <Image
              src="/BSC.png"
              alt="popularPrograms"
              width={570}
              height={375}
            />
          </div> */}
        <div className="relative flex flex-col w-full md:w-1/2 justify-center  text-white ">
          <h3 className="py-2 text-left">BSC Physiology</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 place-content-between">

            <li>{data.career_opportunity_1}</li>
            <li>{data.career_opportunity_2}</li>


            <li>{data.career_opportunity_3}</li>
            <li>{data.career_opportunity_4}</li>


            <li>{data.career_opportunity_5}</li>
          </div>
        </div>
      </div>
    </section>
  )
}
