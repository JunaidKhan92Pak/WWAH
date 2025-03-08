import Image from "next/image";
interface GKSscholarshipsProps {
  benefit: string[]; // Replace 'any' with the appropriate type if known
}

const GKSscholarships: React.FC<GKSscholarshipsProps> = ({ benefit }) => {
  const benefits = [
    {
      id: 1,
      title: `${benefit[0] ? benefit[0] : ""}`,
      position: "left",
    },
    {
      id: 2,
      title: `${benefit[1] ? benefit[1] : ""}`,
      position: "left",
    },
    {
      id: 3,
      title: `${benefit[2] ? benefit[2] : ""}`,
      position: "left",
    },
    {
      id: 4,
      title: `${benefit[3] ? benefit[3] : ""}`,
      position: "right",
    },
    {
      id: 5,
      title: `${benefit[4] ? benefit[4] : ""}`,
      position: "right",
    },
    {
      id: 6,
      title: ` ${benefit[5] ? benefit[5] : ""}`,
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
                  className="text-right flex lg:block items-center gap-2 lg:gap-0 flex-1"
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
              src="/scholarshipdetail/BoS.svg"
              alt="Scholarship Benefits"
              className="min-w-full h-fit "
              width={100}
              height={100}
            />
          </div>

          {/* Right column */}
          <div className=" flex flex-col  justify-stretch">
            {benefits
              .filter((benefit) => benefit.position === "right")
              .map((benefit) => (
                <div
                  key={benefit.id}
                  className="text-left flex items-center md:items-start  gap-2 lg:gap-0 flex-1"
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

export default GKSscholarships;