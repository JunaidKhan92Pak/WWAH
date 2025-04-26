// "use client"
// import React, { useState } from 'react'
// import Herosection from './Herosection'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import Link from 'next/link'
// import { CareerOpportunities } from './CareerOpportunities'
// import { FeeAndScholarships } from './FeeAndScholarships'
// import { ProgressSection } from './ProgressSection'
// import { EnglishRequirement } from './EnglishRequirement'
// import { RequiredDocuments } from './RequiredDocuments'
// import { ApplicationProcess } from './ApplicationProcess'
// import { ExploreSection } from './ExploreSection'

// interface ChildrenProps {
//     data: {
//         overview: string;
//         year_1?: string;
//         year_2?: string;
//         year_3?: string;
//         year_4?: string;
//         year_5?: string;
//         year_6?: string;
//         universityname: string;
//         countryname: string;
//         countryData?: Record<string, any>; // Defines it as an object
//     };
// }

// export const Children = ({ data }: ChildrenProps) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [activeTabPro, setActiveTabPro] = useState("");
//     const toggleReadMore = () => {
//         setIsExpanded((prev) => !prev);
//     };
//     const tabs = [
//         { name: "Course Overview", id: "courseOverview" },
//         { name: "Career Opportunities", id: "careerOpportunities" },
//         { name: "Fee & Scholarships", id: "feeScholarships" },
//         { name: "Entry Requirements", id: "entryRequirements" },
//         { name: "Application Process", id: "applicationProcess" },
//     ];
//     const handleTabClick = (id: string) => {
//         setActiveTabPro(id);
//         const element = document.getElementById(id);
//         if (element) {
//             const yOffset = -100;
//             const yPosition =
//                 element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//             window.scrollTo({ top: yPosition, behavior: "smooth" });
//         }
//     };
//     return (
//         <div>
//             <Herosection data={data.courseData} />
//             {/* Course Overview & Navigation Tabs */}
//             <section className="bg-white md:mt-6 lg:mt-12 mb-6">
//                 <div className=" mx-auto w-[92%]">
//                     {/* Navigation Tabs */}
//                     <div className="w-full lg:w-[90%] flex flex-col lg:flex-row justify-center lg:justify-start items-center border-b border-gray-200">
//                         {tabs.map((tab) => (
//                             <Button
//                                 key={tab.id}
//                                 onClick={() => handleTabClick(tab.id)}
//                                 className={`font-medium transition text-sm md:text-lg hover:bg-[#FCE7D2] hover:text-black px-2 py-2 md:rounded-t-xl w-full border-b border-gray-400 md:border-none ${activeTabPro === tab.id
//                                     ? "bg-[#C7161E] text-white"
//                                     : "bg-transparent text-gray-800"
//                                     }`}
//                             >
//                                 {tab.name}
//                             </Button>
//                         ))}
//                     </div>
//                     {/* Course Overview */}
//                     <div
//                         id="courseOverview"
//                         className="CourseOverview flex flex-col gap-8 lg:flex-row items-center lg:items-start mt-5 md:mt-10"
//                     >
//                         {/* Content side */}
//                         <div className="bg-white pb-4 md:w-[70%]">
//                             <div>
//                                 <div className="lg:w-[90%]">
//                                     <h4 className="">Course Overview!</h4>
//                                     <p className="text-gray-700 md:mb-4 leading-snug w-[110%] text-justify">
//                                         {data.overview}
//                                     </p>
//                                 </div>

//                                 {/* Expanded content */}
//                                 {isExpanded && (
//                                     <div className="w-full">
//                                         {data.courseData.year_1 && (
//                                             <div>
//                                                 <h4>Year 1</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_1}</p>
//                                             </div>
//                                         )}
//                                         {data.courseData.year_2 && (
//                                             <div>
//                                                 <h4>Year 2</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_2}</p>
//                                             </div>
//                                         )}
//                                         {data.courseData.year_3 && (
//                                             <div>
//                                                 <h4>Year 3</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_3}</p>
//                                             </div>
//                                         )}
//                                         {data.courseData.year_4 && (
//                                             <div>
//                                                 <h4>Year 4</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_4}</p>
//                                             </div>
//                                         )}
//                                         {data.courseData.year_5 && (
//                                             <div>
//                                                 <h4>Year 5</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_5}</p>
//                                             </div>
//                                         )}
//                                         {data.courseData.year_6 && (
//                                             <div>
//                                                 <h4>Year 6</h4>
//                                                 <p className="text-gray-700 leading-snug text-justify">{data.courseData.year_6}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* Read More Toggle */}
//                                 <div className="mt-4">
//                                     <p
//                                         className="font-bold underline cursor-pointer"
//                                         onClick={toggleReadMore}
//                                     >
//                                         {isExpanded ? "Show less" : "Read more..."}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Media side */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto w-full md:w-[90%] lg:w-[69%] lg:items-stretch">
//                             {/* First Column: Card 1 and Card 2 */}
//                             <div className="flex lg:flex-col gap-2 lg:space-y-3">
//                                 {/* Card 1 */}
//                                 <div className="relative rounded-3xl shadow-lg w-full h-[180px] lg:h-[275px]">
//                                     <Image
//                                         src="/dublin.jpg"
//                                         alt="Zeus Guide"
//                                         layout="fill"
//                                         objectFit="cover"
//                                         className="object-cover rounded-3xl"
//                                     />
//                                     <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 py-4 md:p-6 rounded-3xl">
//                                         <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[100%]">
//                                             <p className="text-white xl:px-4 mb-3">
//                                                 NEED MORE INFO ABOUT {data.universityname}?
//                                             </p>
//                                             <Link target="blank" href="/universityarchievepage">
//                                                 <Button className="bg-white text-[#C7161E] px-2 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition w-full">
//                                                     Explore Here
//                                                 </Button>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Card 2 */}
//                                 <div className="relative rounded-3xl shadow-lg w-full h-[180px] lg:h-[275px]">
//                                     <Image
//                                         src="/dcu.jpg"
//                                         alt="Future at DCU"
//                                         layout="fill"
//                                         objectFit="cover"
//                                         className="object-cover rounded-3xl"
//                                     />
//                                     <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 px-1 py-4 md:px-4 md:py-6 xl:p-6 rounded-3xl">
//                                         <div className="w-full">
//                                             <p className="text-white md:px-2  mb-3">
//                                                 Get a glimpse of your future at {data.courseData.universityname}!
//                                             </p>
//                                             <Link target="blank" href="/universityarchievepage">
//                                                 <Button className="bg-white text-[#C7161E] font-normal px-1 md:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition ">
//                                                     Watch? Discover More
//                                                 </Button>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Second Column: Card 3 */}
//                             <div className="relative text-white rounded-lg w-full flex items-center h-[200px] lg:h-[550px] lg:min-h-full">
//                                 <Image
//                                     src="/Hero_Robot.png"
//                                     alt="AI Assistant"
//                                     layout="fill"
//                                     objectFit="none"
//                                     className="rounded-3xl"
//                                 />
//                                 <div className="absolute inset-0 flex justify-center items-end text-center bg-black/60 p-4 md:p-6 rounded-3xl "></div>
//                                 <div className="absolute bottom-0 w-full px-4 md:px-2 py-6 text-center">
//                                     <p>
//                                         Use our{" "}
//                                         <span className="text-[#F0851D]">AI - Powered </span>
//                                         platform Zeus to find your dream university in 3 minutes.
//                                     </p>
//                                     <Link target="blank" href="/universityarchievepage">
//                                         <Button className="mt-4 bg-white text-red-700 hover:bg-gray-300 w-4/5">
//                                             Start your Abroad Journey
//                                         </Button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </section>

//             {/* Career Opportunities Section */}
//             <div id="careerOpportunities" >
//                 <CareerOpportunities data={data.courseData} />
//             </div>
//             {/* fee and scholarship     */}
//             <div id="feeScholarships">
//                 <FeeAndScholarships data={data.courseData} />
//             </div>

//             {/* progress bar  */}
//             <ProgressSection data={data.courseData} />

//             {/* English Requirnment Section      */}
//             <EnglishRequirement data={data.courseData} />

//             {/* Required Documents! */}
//             <div id="entryRequirements">
//                 <RequiredDocuments data={data.countryData} />
//             </div>
//             {/* application process */}
//             <div id="applicationProcess ">
//                 <ApplicationProcess countryname={data.courseData.countryname} uniname={data.courseData.universityname} />
//             </div>
//             {/* explore section */}
//             <ExploreSection data={data.courseData} />
//         </div>
//     )
// }
