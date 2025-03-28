"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CiLocationOn } from "react-icons/ci";
interface CourseData {
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
}

const Herosection = ({ data, uniData }: { data: CourseData; uniData: { banner: string } }) => {
  const arr1 = [
    {
      Image: "/CourseDetailPage/Notebook.svg",
      Heading: "Course Level",
      Name: `${data.course_level}`,
    },
    {
      Image: "/CourseDetailPage/iletsbook.svg",
      Heading: "Intake",
      Name: `${data.intake}`,
    },
    {
      Image: "/CourseDetailPage/Clock-Circle.svg",
      Heading: "Duration",
      Name: `${data.duration}`,
    },
    {
      Image: "/CourseDetailPage/Calendar-Mark.svg",
      Heading: "Start Date",
      Name: `${data.start_date}`,
    },
    {
      Image: "/CourseDetailPage/Posts-Carousel-Horizontal.svg",
      Heading: "Formate",
      Name: `${data.degree_format}`,
    },
    {
      Image: "/CourseDetailPage/Money-Bag.svg",
      Heading: "Annual Fee",
      Name: ` ${data.annual_tuition_fee.currency} ${data.annual_tuition_fee.amount}`,
    },
    {
      Image: "/CourseDetailPage/Wallet.svg",
      Heading: "Initial Deposit",
      Name: `${data.initial_deposit}`,
    },
  ];
  console.log(uniData.banner, "uniData.banner");
  return (
    <div>
      {/* Hero section */}
      <section className="mt-4 ">
        <div className="w-full mx-auto ">
          {/* Hero Section */}
          <div
            className="relative w-[95%] mx-auto rounded-3xl overflow-hidden py-2 px-2 sm:px-0 min-h-[250px] sm:min-h-[400px] flex items-center justify-center"
            // style={{ backgroundImage: `url("/dcu-hero-img.png")` }}
            style={{ backgroundImage: `url(${uniData.banner}  ) `, backgroundSize: "cover" }}
          >
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center justify-items-center sm:px-6 md:py-12 py-2 relative z-10">
              {/* Left Section */}
              <div className="w-[90%] flex flex-col items-center md:items-start text-center md:text-left space-y-2 pl-0 lg:pl-12">
                <Image
                  src="/CourseDetailPage/dcu.svg"
                  alt="Dcu Logo"
                  width={130}
                  height={130}
                  className="object-contain w-[80px] h-[80px]"
                />
                <h2 className="text-white text-center md:text-start font-semibold">
                  {data.course_title}
                </h2>
                <p className="text-white ">{data.universityname}</p>
                <div className="bg-white bg-opacity-10 rounded-lg text-white inline-block text-left px-2 md:py-2">
                  <div className="flex items-center gap-1 py-1">
                    <CiLocationOn className="h-4  w-4 sm:h-5  sm:w-5 lg:h-5 lg:w-8" />

                    <p className="ml-2 text-base">
                      {data.location_campus
                        ? data.location_campus
                        : "Not Avialable"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-[90%] md:w-full lg:w-[75%] bg-white bg-opacity-30 backdrop-blur-sm  rounded-3xl py-2  md:p-4 2xl:p-12 flex flex-col items-center text-center">
                <Link
                  href="/schedulesession"
                  className="[text-align:-webkit-center]"
                >
                  <p className="text-white w-4/5 hover:underline">
                    Book Your Online Video Counselling Session with WWAH
                    Advisor!
                  </p>
                </Link>
                <div className="flex items-center w-[50%] my-2">
                  <div className="flex-1 border-t border-gray-100"></div>
                  <p className="mx-4 text-white">Or</p>
                  <div className="flex-1 border-t border-gray-100"></div>
                </div>
                <Link href="/contactus">
                  <Button className="w-full px-14 py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md  text-white rounded-lg hover:bg-gray-300 transition duration-300 ">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-2 lg:-mt-10 flex justify-center">
          <div
            className="flex overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal bg-white text-black py-3 md:py-8 md:px-4  rounded-2xl shadow-lg mx-auto w-[95%] lg:w-[70%] lg:grid lg:grid-cols-7"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr1.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center md:space-y-2 min-w-[100px] lg:min-w-0"
              >
                <Image
                  src={item.Image}
                  alt={item.Heading}
                  width={40}
                  height={40}
                  className="w-16 h-16"
                />

                {/* Heading with Tooltip */}
                <div className="relative group w-[100px]">
                  <p className="font-semibold text-sm truncate max-w-[100px]">
                    {item.Heading}
                  </p>
                </div>

                {/* Name with Tooltip */}
                <div className="relative group w-[100px]">
                  <p className="text-xs truncate max-w-[100px] overflow-hidden">
                    {item.Name}
                  </p>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-200 text-black text-xs p-2 rounded-md w-[200px] text-center shadow-lg">
                    {item.Name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Herosection;
