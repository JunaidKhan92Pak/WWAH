import Image from "next/image";
import { useEffect } from "react";
import { useScholarships } from "@/store/useScholarships";

const ExploreScholarships = () => {
  const {
    scholarships,
    fetchScholarships,
    // New setter
  } = useScholarships();
  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);
  return (
    <div>
      <section className="relative flex flex-col lg:flex-row gap-2 items-center text-white bg-black bg-cover bg-center mt-6 p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

        <div className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center md:space-y-2 sm:px-4 text-left">
          <h4 className="">Explore More Scholarships!</h4>
          <p className="text-[#9D9D9D] leading-relaxed">
            Discover a range of scholarship opportunities from across the globe!
            Whether you&apos;re aiming to study in the United States, Europe, or
            beyond, there are countless scholarships designed to support your
            academic journey. These scholarships can help you access world-class
            education without financial barriers.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
          <div className="relative w-full flex justify-center overflow-hidden">
            <div
              className="flex overflow-x-auto space-x-2 md:space-x-5 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {scholarships.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={"/uniar.svg"}
                    alt="University Image"
                    width={380}
                    height={350}
                    objectFit="cover"
                    // className="rounded-xl w-full h-full"
                    className="rounded-3xl w-[235px] md:w-[400px] xl:w-[430px] xl:h-[274px] h-[220px] "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 "></div>
                  <div className="absolute bottom-0 left-8 w-[235px] md:w-[400px] xl:w-[390px]  text-white px-4 py-3">
                    <p className="font-semibold mb-2"> {item.name}</p>
                    <p className=" flex items-center gap-1">
                      <Image
                        src="/location-white.svg"
                        alt="locationwhite"
                        width={100}
                        height={100}
                        className="w-4 h-4"
                      />
                      {/* {item.universityName} */}
                      {item.hostCountry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreScholarships;
