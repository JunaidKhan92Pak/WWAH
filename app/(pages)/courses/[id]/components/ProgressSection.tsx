import Image from 'next/image';
import React from 'react'

export const ProgressSection = () => {
    const academicData = [
        {
            label: "Degree",
            value: 40,
            icon: (
                <Image
                    src="/degree-icon.png"
                    alt="Degree Icon"
                    width={24}
                    height={24}
                />
            ),
        },
        {
            label: "Major/Discipline",
            value: 50,
            icon: (
                <Image src="/major-icon.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
        {
            label: "Grade",
            value: 40,
            icon: (
                <Image src="/grade-icon.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
        {
            label: "Work Experience",
            value: 40,
            icon: (
                <Image src="/work-icon.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
        {
            label: "English Language Proficiency",
            value: 78,
            icon: (
                <Image src="/lang-icon.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
    ];

    const financialData = [
        {
            label: "Tuition Fee",
            value: 50,
            icon: (
                <Image src="/fee-icon.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
        {
            label: "Cost of Living",
            value: 50,
            icon: (
                <Image src="/Tea-Cup.png" alt="Degree Icon" width={24} height={24} />
            ),
        },
    ];
    return (
        <section className="md:my-4 min-h-screen flex flex-col items-center justify-cente p-4 sm:p-6">
            <h3 className=" ">Application Success Chances!</h3>
            <p className="text-gray-600 mb-2">
                Your application success chances are:
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8 w-full lg:w-[85%]">
                <div className="hidden md:flex items-center gap-4">
                    <p className="text-center">
                        Academic Results <br /> 70%
                    </p>
                    <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
                </div>
                {/* Academic Match Section */}
                <div className="w-full lg:w-1/2 bg-white shadow rounded-3xl p-4 md:p-6">
                    {academicData.map((item, index) => (
                        <div key={index} className="mb-6">
                            {/* Progress Bar */}
                            <div className="relative w-full h-[4.7rem] rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black`}
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor:
                                            item.value >= 75
                                                ? "#e5edde"
                                                : item.value >= 50
                                                    ? "#e5edde"
                                                    : "#f4d0d2",
                                    }}
                                >
                                    <p className="flex items-center gap-2 text-[14px]">
                                        {item.icon}
                                        {item.label}
                                    </p>
                                </div>
                                <p className="absolute right-4 text-black">{item.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Financial Match Section */}
                <div className="w-full lg:w-1/2 bg-white shadow rounded-3xl p-2 md:p-6">
                    {financialData.map((item, index) => (
                        <div key={index} className="mb-6">
                            {/* Progress Bar */}
                            <div className="relative w-full h-56 rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black`}
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor:
                                            item.value >= 75
                                                ? "#e5edde"
                                                : item.value >= 50
                                                    ? "#e5edde"
                                                    : "#f4d0d2",
                                    }}
                                >
                                    <p className="flex items-center gap-2 ">
                                        {item.icon}
                                        {item.label}
                                    </p>
                                </div>
                                <p className="absolute right-4 text-black">{item.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4 ">
                    <span className="vertical-line hidden md:block w-[1px] h-32 bg-gray-500"></span>
                    <p className="text-center">
                        Financial Results <br /> 70%
                    </p>
                </div>
            </div>
        </section>
    )
}
