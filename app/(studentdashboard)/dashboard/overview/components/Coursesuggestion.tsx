import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";

const courses = [
    {
        id: 1,
        title: "Bachelor of Engineering (Honors) - BE(Hons)",
        location: "New Zealand",
        intake: "2024",
        duration: "4 Years",
        fee: "$ 53,122",
        image: "/course1.svg"
    },
    {
        id: 2,
        title: "Bachelor of Engineering (Honors) - BE(Hons)",
        location: "New Zealand",
        intake: "2024",
        duration: "4 Years",
        fee: "$ 53,122",
        image: "/course2.svg"
    },
    {
        id: 3,
        title: "MBA - Master of Business Administration",
        location: "Canada",
        intake: "2024",
        duration: "1.5 Years",
        fee: "$ 53,122",
        image: "/course3.svg"
    }
];

const Coursesuggestion = () => {
    return (
        <>   <div className="w-full rounded-xl border p-4 mt-4">

            <h5 className='font-semibold'>Suggested Courses</h5>
            <div className="relative w-full flex justify-center overflow-hidden">
          <div
            className="flex overflow-x-auto space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
                {courses.map((course) => (
                    <div key={course.id} 
                    className="relative w-[70%] md:w-[70%] flex flex-col md:flex-row space-x-4 space-y-4 flex-shrink-0 rounded-3xl border p-4 overflow-hidden"
>
                            <Image
                                                       src="/course1.svg"
                                                       alt="courseImg"
                                                       width={400}
                                                       height={250}
                                                       className="w-full h-auto md:h-44 md:w-[250px] xl:w-[230px]  object-cover rounded-2xl"
                                                   />
                        <div>
                            <h3 className="text-base md:text-sm font-semibold text-gray-800">
                                {course.title}
                            </h3>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-3">
                                <div className="flex items-center gap-1">
                                    <Image src="/location.svg" width={16} height={16} alt="Location" />
                                    <p className="text-sm truncate">{course.location}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Image src="/DashboardPage/intake.svg" width={16} height={16} alt="intake" />
                                    <p className="text-sm truncate">{course.intake}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Image src="/clock.svg" width={16} height={16} alt="Duration" />
                                    <p className="text-sm truncate">{course.duration}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Image src="/money.svg" width={16} height={16} alt="Tuition Fee" />
                                    <p className="text-sm truncate">{course.fee}</p>
                                </div>

                        
                                
                            </div>
                            <Button className='text-white bg-[#C7161E] w-full mt-2'>
                            Course Details</Button>
                        </div>
                     
                    </div>
                ))}
            </div>
            </div>
            </div>
        </>
    );
}

export default Coursesuggestion;
