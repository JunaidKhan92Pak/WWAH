import React from 'react'
import Image from "next/image"; // Import the Image component
import CircularProgress from "./CircularProgress"; // Import CircularProgress component
import Coursesuggestion from './Coursesuggestion';

const ApplyingSection = () => {
    return (
        <>
            <h5 className='font-semibold'>You are applying for:</h5>
            <div className='flex flex-col md:flex-row justify-between  p-3 border rounded-2xl gap-4 md:gap-0'>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-0 p-4 md:p-0">
                    <div className="relative">
                        <Image
                            src="/course1.svg"
                            alt="courseImg"
                            width={400}
                            height={250}
                            className="w-full h-auto sm:h-48 lg:h-44 sm:w-[350px] xl:w-[280px]  object-cover rounded-2xl"
                        />
                    </div>

                    <div className="p-2 md:p-3">
                        <h3 className="text-base md:text-md font-semibold text-gray-800 w-4/5">
                            Bachelor of Engineering (Honors) - BE(Hons)
                        </h3>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-3">
                            <div className="flex items-center gap-1">
                                <Image src="/location.svg" width={16} height={16} alt="Location" />
                                <p className="text-sm truncate">New Zealand</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/DashboardPage/intake.svg" width={16} height={16} alt="intake" />
                                <p className="text-sm">2024</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/clock.svg" width={16} height={16} alt="Duration" />
                                <p className="text-sm">4 Years</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/money.svg" width={16} height={16} alt="Tuition Fee" />
                                <p className="text-sm">$ 53,122</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/DashboardPage/deadline.svg" width={12} height={12} alt="Deadline" />
                                <p className="text-sm">Deadline:</p>
                            </div>
                            <p className="text-sm">February 2025</p>
                        </div>

                    </div>
                </div>
                 {/* Right Section with CircularProgress */}
                 <div className="flex flex-col items-center justify-center">
                 <p className='font-semibold text-xl'>
                Application Success
                chances
                </p>

                    <CircularProgress progress={80} /> {/* Pass dynamic progress if needed */}
                </div>
            </div>
            <Coursesuggestion />
        </>
    )
}

export default ApplyingSection
