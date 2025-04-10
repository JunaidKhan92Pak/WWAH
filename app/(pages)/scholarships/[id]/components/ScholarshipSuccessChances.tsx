
import Image from "next/image";
import Link from "next/link";
export const ScholarshipSuccessChances = () => {
  const academicFactors = [
    { label: " Academic Background", value: 30, icon: "/degree-icon.svg" },
    // { label: "Major/Discipline", value: 80, icon: "/major-icon.svg" },
    { label: "Grades/CGPA", value: 45, icon: "/grade-icon.svg" },
    { label: "Work Experience", value: 50, icon: "/work-icon.svg" },
    { label: "English Proficiency", value: 60, icon: "/lang-icon.svg" },
  ];
  const financialFactors = [
    { label: "Nationality", value: 40, icon: "/icons/nationality_icon.svg" },
    { label: "Age", value: 50, icon: "/icons/age-icon.svg" },
  ];
  const getProgressBarColor = (value: number): string => {
    return value >= 75 ? "#E5EDDE" : value >= 50 ? "#E5EDDE" : "#F4D0D2";
  };
  return (
    <section className="md:my-4  flex flex-col items-center justify-center p-4 sm:p-6">
      <h3 className="">Scholarship Success Chances!</h3>
      <p className="text-gray-600 mb-2">
        Your scholarship success chances are:
      </p>
      <div className="text-center py-2 lg:px-4">
        <div
          className="p-2 bg-blue-400 items-center text-white leading-none lg:rounded-full flex lg:inline-flex rounded-lg"
          role="alert"
        >
          <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
            New
          </span>
          <span className="font-semibold mr-2 text-left flex-auto">
            <Link href={"/completeprofile"} className="underline">
              Complete
            </Link>{" "}
            your profile to get your success chance
          </span>
          <svg
            className="fill-current opacity-75 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-5 w-full lg:w-[85%]">
        {/* Academic Results Section */}
        <div className="hidden md:flex items-center gap-4">
          <p className="text-center">
            Academic Results <br /> 78%
          </p>
          <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
        </div>
        {/* Academic Progress Bars */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white shadow rounded-3xl p-4 md:px-6">
          {academicFactors.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative w-full h-[3.8rem] rounded-2xl bg-[#F7F7F7] overflow-hidden flex items-center px-4">
                <div
                  className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: getProgressBarColor(item.value),
                  }}
                >
                  <p className="flex items-center gap-2 text-[14px]">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={24}
                      height={24}
                      className="md:w-6 md:h-6 w-5 h-5"
                    />
                    {item.label}
                  </p>
                </div>
                <p className="absolute right-4 text-black">{item.value}%</p>
              </div>
              {/* Add spacing between bars */}
              {index !== academicFactors.length - 1 && (
                <div className="h-4 rounded-md"></div>
              )}
            </div>
          ))}
        </div>
        {/* Financial Progress Bars */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white shadow rounded-3xl p-2 md:px-6">
          {financialFactors.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="relative w-full h-44 rounded-2xl bg-[#F7F7F7] overflow-hidden flex items-center px-4">
                <div
                  className="absolute top-0 left-0 h-full rounded-2xl transition-all duration-300 flex items-center px-4 text-black"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: getProgressBarColor(item.value),
                  }}
                >
                  <p className="flex items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={24}
                      height={24}
                      className="md:w-6 md:h-6 h-5 w-5"
                    />
                    {item.label}
                  </p>
                </div>
                <p className="absolute right-4 text-black">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
        {/* Financial Results Section */}
        <div className="hidden md:flex items-center gap-4">
          <span className="vertical-line w-[1px] h-32 bg-gray-500"></span>
          <p className="text-center">
            Financial Results <br /> 60%
          </p>
        </div>
      </div>
    </section>
  );
};
export default ScholarshipSuccessChances;
