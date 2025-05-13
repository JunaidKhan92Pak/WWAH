import Image from "next/image";

interface GKSscholarshipsProps {
  benefit: string[];
}

const GKSscholarships: React.FC<GKSscholarshipsProps> = ({ benefit }) => {
  const benefits = [
    { id: 1, title: `${benefit[0] || ""}`, position: "left" },
    { id: 2, title: `${benefit[1] || ""}`, position: "left" },
    { id: 3, title: `${benefit[2] || ""}`, position: "left" },
    { id: 4, title: `${benefit[3] || ""}`, position: "right" },
    { id: 5, title: `${benefit[4] || ""}`, position: "right" },
    { id: 6, title: `${benefit[5] || ""}`, position: "right" },
  ];

  const leftBenefits = benefits.filter((b) => b.position === "left");
  const rightBenefits = benefits.filter((b) => b.position === "right");

  return (
    <main className="bg-black text-white p-2 sm:p-4">
      <div className="mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-2 md:mb-5 pt-4 sm:pt-8">
          Benefits of Scholarship
        </h1>

        {/* Small screens (mobile): bullet list */}
        <div className="block md:hidden space-y-2">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-center gap-2">
              <span className="text-red-500 text-2xl">•</span>
              <p className="text-white text-sm sm:text-base">{benefit.title}</p>
            </div>
          ))}
        </div>

        {/* Medium screens (md): 2-column grid */}
        <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-4 lg:hidden">
          {leftBenefits.map((leftItem) => (
            <div key={leftItem.id} className="flex items-center gap-2">
              <span className="text-red-500 text-2xl">•</span>
              <p className="text-white text-base">{leftItem.title}</p>
            </div>
          ))}
          {rightBenefits.map((rightItem) => (
            <div key={rightItem.id} className="flex items-start gap-2">
              <span className="text-red-500 text-2xl">•</span>
              <p className="text-white text-base">{rightItem.title}</p>
            </div>
          ))}
        </div>

        {/* Large screens (lg): 3-column grid layout with center image */}

        <div className="hidden lg:grid grid-cols-[0.3fr_0.4fr_0.3fr] gap-2 space-x-6 space-y-4 w-full items-center 2xl:grid-cols-3">

          {leftBenefits.map((leftItem, idx) => {
            const rightItem = rightBenefits[idx];
            return (
              <div className="contents" key={idx}>
                {/* Left Text */}
                <div className="flex justify-end items-end">
                  <p className="text-white text-base text-right">{leftItem.title}</p>
                </div>

                {/* Center Image only in middle row */}
                <div className="flex justify-center items-center h-[60px]  xl:h-[85px] 2xl:h-[140px]">
                  {idx === 1 && (
                    <Image
                      src="/scholarshipdetail/BoS.svg"
                      alt="Scholarship Benefits"
                      width={300}
                      height={300}
                      className="h-auto w-auto 2xl:w-[100%]"
                    />
                  )}
                </div>

                {/* Right Text */}
                <div className="flex justify-start items-end">
                  <p className="text-white text-base text-left leading-tight">{rightItem?.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default GKSscholarships;
