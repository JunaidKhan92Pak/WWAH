// "use client"
// import React, { useState, } from 'react'
// import Coursesection from './Coursesection';
// import Overviewsection from './Overviewsec';
// import Standsection from './Standsection';
// import Keyhighlights from './Keyhighlights';
// import GalwayCampuslife from './GalwayCampuslife';
// import AboutGalway from './AboutGalway';
// import Exploresection from './Exploresection';
// import Herosec from './Herosec';

// type Tab = {
//     label: string;
//     id: string;
// };

// export const Children = ({ data }) => {
//     const dataMemoized = React.useMemo(() => data, [data]);
//     const [activeTab, setActiveTab] = useState<string>("Programs");
//     const tabs: Tab[] = [
//         { label: "Programs", id: "courses" },
//         { label: "Overview", id: "overview" },
//         { label: "Rankings & Achievements", id: "key-highlights" },
//         { label: "Campus Life", id: "campus-life" },
//         { label: "About City", id: "about-city" },
//     ];
//     const handleTabClick = (tab: Tab) => {
//         setActiveTab(tab.label);
//         const section = document.getElementById(tab.id);
//         if (section) {
//             section.scrollIntoView({ behavior: "smooth", block: "start" });
//         }
//     };
//     console.log("parent");

//     return (
//         <div>
//             {/* <Herosection /> */}
//             <Herosec data={dataMemoized} />
//             <div>
//                 <div className="bg-white my-6 md:mt-12 md:mb-12">
//                     <div className="w-[90%] mx-auto px-6">
//                         {/* Navigation Tabs */}
//                         <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-evenly items-center border-b border-gray-200">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.label}
//                                     onClick={() => handleTabClick(tab)} // Navigate to the section on click
//                                     className={` transition px-10 py-2 rounded-t-xl ${activeTab === tab.label
//                                         ? "bg-[#C7161E] text-white"
//                                         : "text-gray-600"
//                                         }`}
//                                 >
//                                     {tab.label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Coursesection />
//             <div id="overview" className="scroll-mt-24">
//                 {/* When "Overview" is clicked, it navigates here */}
//                 {/* <Overviewsection /> */}
//                 <Overviewsection name={dataMemoized.university_name}
//                     overview={dataMemoized.overview}
//                     origin_and_establishment={dataMemoized.origin_and_establishment}
//                     year={dataMemoized.establishment_year}
//                     modrenday={dataMemoized.modern_day_development}
//                     univideo={dataMemoized.university_video} image={data.universityImages?.banner} />
//             </div>
//             <Standsection our_mission={dataMemoized.our_mission} values={dataMemoized.our_values} />
//             <div id="key-highlights" className="scroll-mt-24">
//                 {/* When "Key Highlights" is clicked, it navigates here */}
//                 <Keyhighlights ranking={dataMemoized.ranking} notable_alumni={dataMemoized.notable_alumni} key_achievements={dataMemoized.key_achievements} />
//             </div>
//             <div id="campus-life" className="scroll-mt-24">
//                 {/* When "Campus Life" is clicked, it navigates here */}
//                 <GalwayCampuslife images={data?.universityImages} data={dataMemoized.campus_life} uniname={dataMemoized.university_name} />
//             </div>
//             <div id="about-city" className="scroll-mt-24">
//                 <AboutGalway city={dataMemoized.about_city} images={data?.universityImages ? data?.universityImages : null} />
//             </div>
//             <Exploresection data={dataMemoized} />
//         </div>
//     )
// }
