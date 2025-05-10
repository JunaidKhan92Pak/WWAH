import React, { useEffect, useState } from "react";
import Image from "next/image";

interface KeyhighlightsProps {
  key_achievements: [];
  ranking: { name: string; width: string; detail: string }[];
  notable_alumni: { name: string; profession: string; image: string }[];
}
const icons = [
  "/Corkscrew.svg",
  "/Crown-Star.svg",
  "/Crown-Line.svg",
  "/Settings.svg",
];

const Keyhighlights: React.FC<KeyhighlightsProps> = ({
  key_achievements,
  ranking,
  notable_alumni,
}) => {
  const alumniData = notable_alumni;

  const [achievement, setAchievement] = useState<
    { title: string; icon: string }[]
  >([]);

  // Update achievements when `key_achievements` changes
  useEffect(() => {
    if (!key_achievements || key_achievements.length === 0) return; // Prevent errors on empty data
    setAchievement(
      key_achievements?.map((item, index) => ({
        title: item,
        icon: icons[index % icons.length], // Assigning icons in a loop
      }))
    );

    // console.log(achievement, "Achievements updated");
  }, [key_achievements]); // Added `icons` in dependencies

  const width = ["80%", "88%", "75%", "82%"];

  return (
    <>
      <section className="md:py-4 py-2 w-[90%] sm:w-[85%] md:w-[90%] xl:w-[85%] mx-auto">
        <h2 className="mb-4 text-center sm:text-left">
          Rankings & Achievements!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[0.8fr_0.9fr_0.9fr] gap-5 sm:gap-16 md:gap-0 bg-[#FCE7D2] p-2 sm:p-8 rounded-3xl relative max-w-8xl mx-auto">
          <div className="w-[65%] md:w-[275px] flex flex-col lg:border-r border-gray-400 md:pr-9 items-stretch mx-auto ">
            <h5 className="mb-2 md:mb-4 text-center sm:text-left">Rankings:</h5>
            {ranking?.length > 0 &&
              ranking.map((item, index) => (
                <div key={index} className="md:mb-8 mb-4">
                  <p className="md:mb-2 mb-1">{item.name}</p>
                  <div className="relative bg-white rounded-md h-8 overflow-hidden w-full">
                    <div
                      className="bg-[#C7161E] text-white flex items-center justify-center h-8 rounded-r-lg"
                      style={{ width: width[index] }}
                    >
                      <p className="text-[14px]">Ranked {item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-col lg:border-r border-gray-400 md:px-5 items-stretch">
            <h5 className="mb-4 md:text-left text-center">Notable Alumni:</h5>
            <div className="grid md:grid-cols-1 grid-cols-2 gap-4 sm:gap-4">
              {alumniData.map((alumni, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:justify-start items-center justify-center md:items-start gap-4 md:mb-3"
                >
                  <img
                    src={alumni.image || "/user-dp.png"}
                    alt="alumni"
                    className="rounded-full object-cover sm:w-12 sm:h-12 w-10 h-10"
                  />
                  <div>
                    <p className="md:text-left text-center font-medium">
                      {alumni.name}
                    </p>
                    <p className="text-gray-600 md:text-left text-center text-[14px]">
                      {alumni.profession}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:pl-9 items-stretch">
            <h5 className="mb-4 text-center sm:text-left">Key Achievements</h5>
            <div className="grid grid-cols-2 md:grid-cols-1 items-center sm:items-start gap-2 md:gap-4">
              {achievement.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:items-start"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={icons[index] ? icons[index] : "/Crown-Star.svg"}
                      alt="achievement"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-gray-700 text-center sm:text-left">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Keyhighlights;
