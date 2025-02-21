import React from 'react'
import Image from "next/image"; // Import the Image component
import CircularProgress from "./CircularProgress"; // Import CircularProgress component

const ApplyingSection = () => {
    return (
        <>

        <div>
        <p className='font-semibold text-lg md:text-2xl'>You are applying for:</p>

            <div className='flex flex-col md:flex-row items-center justify-between  p-4 border rounded-2xl gap-4 md:gap-0'>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-0 ">
                    <div className="relative">
                        <Image
                            src="/course1.svg"
                            alt="courseImg"
                            width={600}
                            height={500}
                            className="w-[470px] h-auto md:h-44 xl:h-48 md:w-[345px] xl:w-[360px]  object-cover rounded-2xl"
/>
                    </div>

                    <div className="p-2 md:p-4">
                        <p className="font-medium text-lg">
                            Bachelor of Engineering (Honors) - BE(Hons)
                        </p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-3">
                            <div className="flex items-center gap-1">
                                <Image src="/location.svg" width={20} height={20} alt="Location" />
                                <p className="text-lg md:text-base  truncate">New Zealand</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/DashboardPage/intake.svg" width={20} height={20} alt="intake" />
                                <p className="text-lg md:text-base">2024</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/clock.svg" width={20} height={20} alt="Duration" />
                                <p className="text-lg md:text-base">4 Years</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/money.svg" width={20} height={20} alt="Tuition Fee" />
                                <p className="text-lg md:text-base">$ 53,122</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/DashboardPage/deadline.svg" width={14} height={14} alt="Deadline" />
                                <p className="text-lg md:text-base">Deadline:</p>
                            </div>
                            <p className="text-lg md:text-base">February 2025</p>
                        </div>

                    </div>
                </div>
                 {/* Right Section with CircularProgress */}
                 <div className="flex flex-col items-center justify-center">
                 <p className='font-semibold text-lg md:text-2xl mb-2 md:mb-0'>
                Application Success
                chances
                </p>

                    <CircularProgress progress={80} /> {/* Pass dynamic progress if needed */}
                </div>
            </div>
            </div>
        </>
    )
}

export default ApplyingSection
