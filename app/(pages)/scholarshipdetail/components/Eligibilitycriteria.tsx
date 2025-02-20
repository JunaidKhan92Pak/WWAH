import React from 'react'
import Image from 'next/image'
const Eligibilitycriteria = () => {
  return (
    <div>
        <section className="w-[90%] mx-auto pb-5">
        <div className="text-center md:w-3/5 mx-auto">
          <h3>Eligibility Criteria!</h3>
          <p className="md:py-4">
            To be eligible for the Global Korea Scholarship, applicants must
            meet specific academic, age, and residency requirements.{" "}
          </p>
        </div>
        <div className="lg:flex md:py-5">
          <div className="w-[90%] mx-auto md:space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/scholarshipdetail/ellipse.png"
                width={12}
                height={1}
                alt="ellipse"
                className="2xl:w-[28px]"

              />
              <p>
                <strong>Applicants</strong> and their parents must not hold
                Korean citizenship.
              </p>
            </div>
            <div className="flex items-center space-x-2 md:space-y-2">
              <Image
                src="/scholarshipdetail/ellipse.png"
                width={12}
                height={1}
                alt="ellipse"
                className="hidden md:block 2xl:w-[28px]"

              />
              <p className="font-bold text-center pt-2 md:pt-0 md:text-left">Applicants Requirements</p>
            </div>
            <div className="flex pl-8 md:py-3">
              {/* <div className="">
                <Image
                  src="/scholarshipdetail/border.png"
                  width={12}
                  height={1}
                  alt="ellipse"
                className="hidden md:block 2xl:w-[28px]"

                />
              </div> */}
              <div className="flex flex-col justify-between md:gap-9 pl-2">
                <li>
                  <strong>Undergraduate:</strong> High school graduates or
                  equivalent qualification.
                </li>
                <li>
                  <strong>Graduate:</strong> Bachelor&#39;s degree or equivalent
                  qualification.
                </li>
              </div>
            </div>
          </div>
          <div className="w-[90%] mx-auto md:space-y-4">
            <div className="flex md:items-center items-start space-x-2">
              <Image
                src="/scholarshipdetail/ellipse.png"
                width={12}
                height={1}
                alt="ellipse"
                className="hidden md:block 2xl:w-[28px]"

              />
              <p className="font-bold pt-2 md:pt-0">Age</p>
            </div>
            <div className="flex pl-8 md:py-3">
              {/* <div className="">
                <Image
                  src="/scholarshipdetail/border.png"
                  width={12}
                  height={1}
                  alt="ellipse"
                className="hidden md:block 2xl:w-[28px]"

                />
              </div> */}
              <div className="flex flex-col md:gap-9 justify-between pl-2">
                <li>
                  <strong>Undergraduate:</strong> High school graduates or
                  equivalent qualification.
                </li>
                <li>
                  <strong>Graduate:</strong> Bachelor&#39;s degree or equivalent
                  qualification.
                </li>
              </div>
            </div>
            <div className="flex md:items-center items-start space-x-2">
              <Image
                src="/scholarshipdetail/ellipse.png"
                width={12}
                height={1}
                alt="ellipse"
                className="2xl:w-[28px]"

              />
              <p>
                <strong>Language Proficiency:</strong> While not mandatory,
                Korean or English language proficiency may be required by
                certain programs or universities.
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex items-center space-x-2">
            <Image
              src="/scholarshipdetail/ellipse.png"
              width={12}
              height={1}
              alt="ellipse"
              className="2xl:w-[28px]"

            />
            <p>
              <strong>Health: </strong>Applicants must be in good health, both
              mentally and physically.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Eligibilitycriteria
