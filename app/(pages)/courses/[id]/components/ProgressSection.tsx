import Image from 'next/image';
import { useEffect, useState } from "react";
import useSynonyms from "@/hooks/useSynonyms";
import { extractMajorFromTitle } from "@/utils/extractMajor";
import { calculateMajorSuccess } from "@/utils/calculateMajorSuccess";
import { extractOverallScore } from "@/utils/extractEnglishScores";
import { calculateEnglishSuccess } from "@/utils/calculateEnglishSuccess";
import { ReactNode } from 'react';
interface Factor {
    label: string;
    value: number;
    icon?: ReactNode;
}
interface progressProps {
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

// Helper for Degree: calculates success percentage based on student's degree and required degree.
const calculateDegreeSuccess = (studentDegree: string, requiredDegree: string): number => {
    const eligibilityMap: { [key: string]: string[] } = {
        "Bachelor": ["Intermediate", "IB Diploma", "GCSE", "Bachelor"],
        "Master": ["Bachelor", "Master", "PhD"],
        "PhD": ["Master", "PhD"],
    };
    const allowedDegrees = eligibilityMap[requiredDegree];
    if (!allowedDegrees) return 10;
    const isEligible = allowedDegrees.some(deg => studentDegree.toLowerCase().includes(deg.toLowerCase()));
    return isEligible ? 100 : 10;
};

// Helper for Grades: calculates success percentage based on the gap between student's grade and required grade.
const calculateGradeSuccess = (studentGrade: number, requiredGrade: number): number => {
    const gap = requiredGrade - studentGrade;
    if (gap <= 0) return 99;
    if (gap > 0 && gap <= 10) return 90;
    if (gap > 10 && gap <= 20) return 75;
    if (gap > 20 && gap <= 30) return 50;
    return 10;
};
const calculateWorkExperienceSuccess = (experienceYears: number): number => {
    if (experienceYears >= 1) return 100; // ✅ Full match
    if (experienceYears >= 0.5) return 75; // 🔹 6+ months
    if (experienceYears >= 0.25) return 50; // 🔹 3+ months
    return 10; // ❌ Less than 3 months
};

const extractGrades = (input: string) => {
    // Regex pattern to extract the first percentage found in entry requirements (e.g., "55%")
    const percentMatch = input.match(/(\d+)%/);
    return {
        percentage: parseInt(percentMatch ? percentMatch[1] : "60"),
    };
};
// const extractMajorFromTitle = (courseTitle: string): string => {
//     // Remove degree prefixes like "BA", "BSc", "MA", "MSc", "Honours"
//     return courseTitle
//         .replace(/^(BA Honours|BSc Honours|MA|MSc|PhD|Honours|BA|BSc)\s+/i, "")
//         .replace(/\(Hons\)/i, "") // Remove "(Hons)"
//         .trim(); // Remove extra spaces
// };
export const ProgressSection = ({ data }: { data: progressProps['data'] }) => {
    const { synonyms, loading, error } = useSynonyms();
    const [academicFactors, setAcademicFactors] = useState<Factor[]>([]);
    const [financialFactors, setFinancialFactors] = useState<Factor[]>([]);
    const [overallAcademic, setOverallAcademic] = useState<number>(0);
    const [overallFinancial, setOverallFinancial] = useState<number>(0);
    const [overallSuccess, setOverallSuccess] = useState<number | null>(null);
    console.log(overallSuccess);

    // Function to determine progress bar background color (kept per your design)
    const getProgressBarColor = (value: number) => {
        return value >= 75 ? "#87CE8B" : value >= 50 ? "#fff75e" : "#FE4343";
    };
    const userExperienceYears = 0.1; // Example: 8 months (0.67 years)

    // 🔹 Calculate work experience success percentage
    const workExperienceSuccess = calculateWorkExperienceSuccess(userExperienceYears);
    const requiredMajor = extractMajorFromTitle(String(data.course_title || "").trim());
    const userMajor = "Game"; // Replace with real user major from profile
    const majorSuccess = calculateMajorSuccess(userMajor, requiredMajor, synonyms);
    const userTest = "IELTS"; // "IELTS" | "PTE" | "TOEFL"
    const userScore = 5.0; // Example user's overall score

    // 🔹 Extract required overall score from text data
    const requiredScore =
        userTest === "IELTS"
            ? extractOverallScore(data.required_ielts_score)
            : userTest === "PTE"
                ? extractOverallScore(data.required_pte_score)
                : extractOverallScore(data.required_toefl_score);

    // 🔹 Calculate success percentage
    const englishSuccess = calculateEnglishSuccess(userScore, requiredScore);

    useEffect(() => {
        // Dummy values for demonstration:
        const studentDegree = "Bachelor"; // Example: student's degree
        const requiredDegree = data.course_level; // e.g., from course data (could also be data.degree_format)
        const degreeSuccess = calculateDegreeSuccess(studentDegree, requiredDegree);

        const studentGrade = 90; // Example: student's grade score
        const requiredGrade = extractGrades(data.entry_requirement); // Extract required grade percentage from entry requirement paragraph
        const gradeSuccess = calculateGradeSuccess(studentGrade, requiredGrade.percentage);

        // Dummy academic and financial factors data
        const dummyData = {
            academicFactors: [
                {
                    label: "Degree",
                    value: degreeSuccess,
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
                    value: majorSuccess,
                    icon: (
                        <Image
                            src="/major-icon.png"
                            alt="Major Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
                {
                    label: "Grades",
                    value: gradeSuccess,
                    icon: (
                        <Image
                            src="/grade-icon.png"
                            alt="Grade Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
                {
                    label: "Work Experience",
                    value: workExperienceSuccess,
                    icon: (
                        <Image
                            src="/work-icon.png"
                            alt="Work Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
                {
                    label: "English Proficiency",
                    value: englishSuccess,
                    icon: (
                        <Image
                            src="/lang-icon.png"
                            alt="Language Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
            ],
            financialFactors: [
                {
                    label: "Tuition Fee",
                    value: 10,
                    icon: (
                        <Image
                            src="/fee-icon.png"
                            alt="Fee Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
                {
                    label: "Cost of Living",
                    value: 50,
                    icon: (
                        <Image
                            src="/Tea-Cup.png"
                            alt="Cost of Living Icon"
                            width={24}
                            height={24}
                        />
                    ),
                },
            ],
        };

        // Simulate an API delay for demonstration
        setTimeout(() => {
            setAcademicFactors(dummyData.academicFactors);
            setFinancialFactors(dummyData.financialFactors);

            const academicAvg =
                dummyData.academicFactors.reduce((acc, cur) => acc + cur.value, 0) /
                dummyData.academicFactors.length;
            const financialAvg =
                dummyData.financialFactors.reduce((acc, cur) => acc + cur.value, 0) /
                dummyData.financialFactors.length;

            setOverallAcademic(academicAvg);
            setOverallFinancial(financialAvg);

            // Overall success chance using a weighted average (70% academic, 30% financial)
            const overall = academicAvg * 0.7 + financialAvg * 0.3;
            setOverallSuccess(Number(overall.toFixed(2)));
        }, 1000);
    }, [data, calculateMajorSuccess]);

    if (loading) return <p>Loading synonyms...</p>;
    if (error) return <p>Error loading synonyms: {error}</p>;

    return (
        <section className="md:my-4 min-h-screen flex flex-col items-center justify-cente p-4 sm:p-6">
            <h3 className="">Application Success Chances!</h3>
            <p className="text-gray-600 mb-2">
                Your application success chances are:
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8 w-full lg:w-[85%]">
                {/* Left side Academic Results */}
                <div className="hidden md:flex items-center gap-4">
                    <p className="text-center">
                        Academic Results <br /> {overallAcademic ? overallAcademic + "%" : "70%"}
                    </p>
                    <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
                </div>

                {/* Academic Match Section */}
                <div className="w-full lg:w-1/2 bg-white shadow rounded-3xl p-4 md:p-6">
                    {academicFactors.map((item, index) => (
                        <div key={index} className="mb-6">
                            {/* Progress Bar */}
                            <div className="relative w-full h-[4.7rem] rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor: getProgressBarColor(item.value),
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
                    {financialFactors.map((item, index) => (
                        <div key={index} className="mb-6">
                            {/* Progress Bar */}
                            <div className="relative w-full h-56 rounded-2xl bg-[#f7f7f7] overflow-hidden flex items-center px-4">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                                    style={{
                                        width: `${item.value}%`,
                                        backgroundColor: getProgressBarColor(item.value),
                                    }}
                                >
                                    <p className="flex items-center gap-2">
                                        {item.icon}
                                        {item.label}
                                    </p>
                                </div>
                                <p className="absolute right-4 text-black">{item.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side Financial Results */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="vertical-line hidden md:block w-[1px] h-32 bg-gray-500"></span>
                    <p className="text-center">
                        Financial Results <br /> {overallFinancial ? overallFinancial + "%" : "70%"}
                    </p>
                </div>
            </div>
        </section>
    );
};
