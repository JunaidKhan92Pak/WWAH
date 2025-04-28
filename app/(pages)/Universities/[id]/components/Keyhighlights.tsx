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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-16 md:gap-10 bg-[#FCE7D2] p-2 sm:p-8 rounded-3xl justify-items-center items-start relative">
          <div className="relative">
            <h5 className="mb-4 text-center sm:text-left">Rankings:</h5>
            {ranking?.length > 0 &&
              ranking.map((item, index) => (
                <div key={index} className="md:mb-4 mb-1 md:space-y-5">
                  <p className="md:mb-0 mb-1 ">{item.name}</p>
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
            <div className="absolute top-0 bottom-0 -right-20 md:-right-10 mt-6 w-px bg-gray-300 hidden xl:block"></div>
          </div>

          <div className="relative">
            <h5 className="mb-4 md:text-left text-center">Notable Alumni:</h5>
            <div className="grid md:grid-cols-1 grid-cols-2 gap-4 sm:gap-4">
              {alumniData.map((alumni, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:justify-start items-center justify-center md:flex md:items-start gap-4 md:mb-3"
                >
                  <div className="sm:w-12 sm:h-12 w-10 h-10 relative">
                    <img
                      src={alumni.image || "/user-dp.png"}
                      alt="alumini"
                      // layout="fill"
                      // objectFit="cover"
                      className="rounded-full border object-fit sm:w-12 sm:h-12 w-10 h-10 "
                    />
                  </div>
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
            <div className="absolute top-0 bottom-0 -right-20 md:-right-10 mt-6 w-px bg-gray-300 hidden xl:block"></div>
          </div>

          <div>
            <h5 className="mb-4 text-center sm:text-left">Key Achievements</h5>
            <div className="grid grid-cols-2 md:grid-cols-1 items-center sm:items-start gap-2 md:gap-4">
              {achievement.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:items-start"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={icons[index] ? icons[index] : "/Crown-Star.svg"} // fallback to default icon
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
