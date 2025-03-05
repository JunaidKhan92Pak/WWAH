import React from "react";
// import Image from "next/image";
interface GKSscholarshipsProps {
  benefits: string[]; // Replace 'any' with the appropriate type if known
}

const GKSscholarships: React.FC<GKSscholarshipsProps> = ({ benefits }) => {
  return (
    <>
      <section>
        <div
          className="relative bg-cover lg:mt-10 bg-center bg-black  flex flex-col items-center justify-center  p-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: "url('/bg-usa.png')",
          }}
        >
          <div className=" absolute inset-0 bg-black opacity-90 z-0"></div>
          <div className="flex flex-col xl:flex-row w-full justify-center items-center">
            <div className=" relative w-full md:w-1/2  space-y-5 p-3 text-white">
              <h3>Benefits of GKS Scholarship:</h3>
              {/* <p className="text-[#9D9D9D]">
                The Global Korea Scholarship (GKS) is designed to foster
                international educational exchange and strengthen goodwill
                between South Korea and other countries. By offering
                opportunities for foreign students to pursue higher education in
                South Korea, GKS aims to cultivate a deeper understanding and
                connection across cultures, ultimately promoting mutual respect
                and cooperation on a global scale.
              </p> */}
            </div>
            <div
              className=" relative w-full xl:w-1/2 justify-center items-center"
              style={{
                backgroundImage: "url('/scholarshipdetail/benefit.svg')",
                backgroundSize: "270px 270px", // Maintain original size
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "270px", // Ensure the container has enough height
              }}
            >
              <div className="border border-yellow-300 w-[100%] flex justify-end  ">
                <div className="flex flex-row xl:w-[85%] justify-between py-8 items-end">
                  <p className="text-white text-[16px] border border-red-700">

                    {benefits[0]}
                  </p>
                  <div className="w-[40%]">

                    <p className="text-white text-[16px] border border-blue-600">
                      {benefits[1]}
                    </p>
                  </div>
                </div>

              </div>
              <div className="border border-yellow-300 w-[100%] flex justify-end  ">
                <div className="flex flex-row xl:w-[93%] justify-between  items-start">
                  <div className="w-[30%] items-end">

                    <p className="text-white text-[16px] border border-red-700">
                      {" "}
                      {benefits[2]}
                    </p>
                  </div>
                  <div className="w-[30%]">
                    {" "}
                    <p className="text-white text-[16px] border border-blue-600">
                      {benefits[3]}
                    </p>
                  </div>{" "}
                </div>
              </div>{" "}
              <div className="border border-yellow-300 w-[100%] flex justify-end  pt-4">
                <div className="flex flex-row xl:w-[88%] justify-between  items-start">
                  <div className="w-[25%] items-end">

                    <p className="text-white text-[16px] border border-red-700">
                      {" "}
                      {benefits[4]}
                    </p>
                  </div>
                  <div className="w-[40%]">
                    {" "}
                    <p className="text-white text-[16px] border border-blue-600">
                      {benefits[5]}
                    </p>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GKSscholarships;
