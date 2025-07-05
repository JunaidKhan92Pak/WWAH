import React from "react";
import Image from "next/image";

interface GKSscholarshipsProps {
  benefit: string[];
}

const bgColors = [
  "bg-[#00ABB7]",
  "bg-[#50B748]",
  "bg-[#FCC82B]",
  "bg-[#3E7B97]",
  "bg-[#A53574]",
  "bg-[#E23A59]",
];

const images = [
  "/scholarshipdetail/hat1.svg",
  "/scholarshipdetail/hat2.svg",
  "/scholarshipdetail/hat6.svg",
  "/scholarshipdetail/hat4.svg",
  "/scholarshipdetail/hat3.svg",
  "/scholarshipdetail/hat5.svg",
];

const GKSscholarships: React.FC<GKSscholarshipsProps> = ({ benefit }) => {
  return (
    <main className="bg-black text-white py-4 md:py-10">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 md:mb-5">
        Benefits of Scholarship
      </h1>

      <div
        className="gap-2 xl:grid xl:grid-cols-6 flex overflow-x-auto xl:max-w-6xl pl-6 xl:pl-0 mx-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {benefit.map((text, index) => (
          <div
            key={index}
            className={`p-[6px] rounded-xl ${bgColors[index % bgColors.length]} flex-shrink-0 w-[180px] lg:w-[170px] xl:w-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl m-2`}
          >
            <div className="bg-white rounded-xl flex flex-col space-y-3 items-center justify-center h-40 text-center font-semibold text-black px-4 leading-1">
              <Image
                src={images[index % images.length]}
                alt={text}
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div className="text-sm leading-tight h-[50px] flex items-start justify-center">
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GKSscholarships;
