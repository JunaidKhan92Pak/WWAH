import React from "react";
// import Image from "next/image";
const GKSscholarships = () => {
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
              <p className="text-[#9D9D9D]">
                The Global Korea Scholarship (GKS) is designed to foster
                international educational exchange and strengthen goodwill
                between South Korea and other countries. By offering
                opportunities for foreign students to pursue higher education in
                South Korea, GKS aims to cultivate a deeper understanding and
                connection across cultures, ultimately promoting mutual respect
                and cooperation on a global scale.
              </p>
            </div>
            {/* <div className="flex relative w-full xl:w-[70%] justify-center items-center">
              <div className='space-y-12 items-end justify-end flex flex-col'>
                <div className="flex h-[50px] items-start justify-left">

                  <p className='text-white text-base h-[40px] border'> Full Tuition Coverage</p>
                </div>

                <p className='text-white text-base h-[30px] border leading-tight pr-1'>Free Travel and Installation Costs</p>
                <p className='text-white text-base h-[40px] border'>Free Visa Cost</p>

              </div>

              <div className='relative'>
                <Image
                  src="/scholarshipdetail/benefit.svg"
                  alt="popularPrograms"
                  // className="w-[90%]"
                  width={400}
                  height={400}
                />
                <div className="md:absolute md:inset-0  flex items-center justify-center">
                  <p className="w-[90px] text-center  text-white md:text-black font-semibold"> BSC Physiology</p>
                </div>
              </div>
              <div className='space-y-12 items-start justify-end flex flex-col'>
                <div className="flex  items-center">
                  <p className='text-white text-base leading-tight h-[40px] border'>€1,400 Monthly Stipend
                    to cover living expenses</p>
                </div>
                <div className="flex  items-start  ">

                  <p className='text-white text-base pl-2 border h-[30px] '>Free Medical Insurance</p>
                </div>
                <div className="flex  items-start  ">

                  <p className='text-white text-base border h-[40px] leading-tight'>Free Exposure to
                    International Learning</p>
                </div>

              </div>
            </div> */}

            <div
              className=" relative w-full md:w-1/2 justify-center items-center"
              style={{
                backgroundImage: "url('/scholarshipdetail/benefit.svg')",
                backgroundSize: "270px 270px", // Maintain original size
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "270px", // Ensure the container has enough height
              }}
            >
              <div className="border border-yellow-300 w-[100%] flex justify-end  ">
                <div className="flex flex-row w-[85%] justify-between py-8 items-end">
                  <p className="text-white text-[16px] border border-red-700">
                    {" "}
                    Full Tuition Coverage
                  </p>
                  <div className="w-[40%]">
                    {" "}
                    <p className="text-white text-[16px] border border-blue-600">
                      €1,400 Monthly Stipend to cover living expenses
                    </p>
                  </div>{" "}
                </div>
                
              </div>
              <div className="w-full justify-end">
                <div className="flex flex-row w-full justify-between ">
                  <div className="w-[30%] items-end">

                  <p className="text-white text-[16px] border border-red-700">
                    {" "}
                    Full Tuition Coverage
                  </p>
                  </div>
                  <div className="w-[30%]">
                    {" "}
                    <p className="text-white text-[16px] border border-blue-600">
                      €1,400 Monthly Stipend to cover living expenses
                    </p>
                  </div>{" "}
                </div>
              </div>{" "}
              {/* <div className="w-full">
                <div className="flex flex-row w-full justify-between">
                  <p className="text-white text-[16px] border border-red-700">
                    {" "}
                    Full Tuition Coverage
                  </p>
                  <div className="w-[45%]">
                    {" "}
                    <p className="text-white text-[16px] border border-blue-600">
                      €1,400 Monthly Stipend to cover living expenses
                    </p>
                  </div>{" "}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GKSscholarships;
