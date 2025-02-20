import React from 'react'
import Image from 'next/image'
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
          <div className="flex flex-col md:flex-row w-[90%] gap-5 justify-center items-center">
            <div className=" relative w-full md:w-1/2  space-y-5 p-3 text-white">
              <h3>Benefits of GKS Scholarship:</h3>
              <p className="text-[#9D9D9D]">
              The Global Korea Scholarship (GKS) is designed to foster international educational exchange and strengthen goodwill between South Korea and other countries. By offering opportunities for foreign students to pursue higher education in South Korea, GKS aims to cultivate a deeper understanding and connection across cultures, ultimately promoting mutual respect and cooperation on a global scale.
              </p>
            </div>
            <div className="flex relative w-full md:w-1/2 justify-center items-center">
              <Image
                src="/scholarshipdetail/gks.svg"
                alt="popularPrograms"
                // className="w-[90%]"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>
    
    </>
  )
}

export default GKSscholarships
