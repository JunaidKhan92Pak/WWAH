import Image from "next/image";
export default function Home() {
  const benefits = [
    {
      id: 1,
      title: "Full Tuition Coverage",
      position: "left",
    },
    {
      id: 2,
      title: "Free Travel and Installation Costs",
      position: "left",
    },
    {
      id: 3,
      title: "Free Visa Cost",
      position: "left",
    },
    {
      id: 4,
      title: "€1,400 Monthly Stipend to cover living expenses",
      position: "right",
    },
    {
      id: 5,
      title: "Free Medical Insurance",
      position: "right",
    },
    {
      id: 6,
      title: "Free Exposure to International Learning",
      position: "right",
    },
  ];

  return (
    <main className=" bg-black text-white p-2 sm:p-4">
      <div className=" mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 sm:mb-12 pt-4 sm:pt-8">
          Benefits of Scholarship
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {/* Left column */}
          <div className=" flex flex-col justify-stretch ">
            {benefits
              .filter((benefit) => benefit.position === "left")
              .map((benefit) => (
                <div
                  key={benefit.id}
                  className="text-right flex lg:block items-center gap-2 lg:gap-0"
                >
                  <span className="text-red-500 text-4xl block lg:hidden">
                    •
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg  text-white font-medium">
                    {benefit.title}
                  </p>
                </div>
              ))}
          </div>

          {/* Center column with image */}
          <div className="hidden lg:flex items-center w-full   ">
            <Image
              src="./scholarshipdetail/BoS.svg"
              alt="Scholarship Benefits"
              className="min-w-full h-fit "
              width={100}
              height={100}
            />
          </div>

          {/* Right column */}
          <div className=" flex flex-col justify-stretch ">
            {benefits
              .filter((benefit) => benefit.position === "right")
              .map((benefit) => (
                <div
                  key={benefit.id}
                  className="text-left flex items-center gap-2 lg:gap-0 "
                >
                  <span className="text-red-500 text-4xl block lg:hidden">
                    •
                  </span>

                  <p className="text-sm sm:text-base lg:text-lg text-white font-medium">
                    {benefit.title}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
