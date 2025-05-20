import React from "react";
import Image from "next/image";

interface GKSscholarshipsProps {
  benefit?: string[]; // made optional since it's not used
}

const cardData = [
  {
    text: "Full Tuition Coverage",
    bg: "bg-[#00ABB7]",
    image: "/scholarshipdetail/hat1.svg",
  },
  {
    text: "Free Travel and Installation Costs",
    bg: "bg-[#50B748]",
    image: "/scholarshipdetail/hat2.svg",
  },
  {
    text: "Free Visa Cost",
    bg: "bg-[#FCC82B]",
    image: "/scholarshipdetail/hat6.svg",
  },
  {
    text: "€1,400 Monthly Stipend to cover living expenses",
    bg: "bg-[#3E7B97]",
    image: "/scholarshipdetail/hat4.svg",
  },
  {
    text: "Free Exposure to International Learning",
    bg: "bg-[#A53574]",
    image: "/scholarshipdetail/hat3.svg",
  },
  {
    text: "Free Medical Insurance",
    bg: "bg-[#E23A59]",
    image: "/scholarshipdetail/hat5.svg",
  },
];

const GKSscholarships: React.FC<GKSscholarshipsProps> = () => {
  return (
    <main className="bg-black text-white py-4 md:py-10">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 md:mb-5">
        Benefits of Scholarship
      </h1>

      {/* Single-color cards */}
      <div
  className="gap-2 xl:grid xl:grid-cols-6 flex overflow-x-auto xl:max-w-6xl pl-6 xl:pl-0 mx-auto"
style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
  className={`p-[6px] rounded-xl ${card.bg} flex-shrink-0 w-[180px] lg:w-[170px] xl:w-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl m-2`}

>
            <div className="bg-white rounded-xl flex flex-col space-y-3 items-center justify-center h-40 text-center font-semibold text-black px-4 leading-1">
              <Image
                src={card.image}
                alt={card.text}
                width={40}
                height={40}
                className="w-10 h-10"
              />

              <div className="text-sm leading-tight h-[50px] flex items-start justify-center">
                {card.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GKSscholarships;
