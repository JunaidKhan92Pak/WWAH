import React from "react";
import Image from "next/image";
const Requireddocs = () => {
  return (
    <div>
      <section className="flex flex-col items-center justify-center py-2 lg:py-5 px-4  lg:w-[90%] mx-auto">
        <h3 className="lg:mb-4">Required Documents!</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 items-stretch">
          {/* Text Section */}
          <div className="bg-white p-2 md:p-6 rounded-2xl shadow-lg h-full">
            {/* <h4 className="lg:mb-2 mb-1">University Application Docs:</h4> */}
            <h5 className="lg:mb-2 mb-1">Required Document list:</h5>
            <ul className="grid grid-cols-2 lg:gap-4 md:gap-2 gap-1 text-gray-700 leading-snug ">
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Passport Images</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Bank Statement</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Any Bill (Electricity, Water, Gas, etc.)</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Proof of Enrollment</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>University Acceptance Letter</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Passport-Sized Photos</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Scholarship Proof (if applicable)</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 text-4xl">•</span>
                <p>Medical Clearance</p>
              </li>
            </ul>
          </div>

          {/* Image Section */}
          <div className="hidden items-center justify-center rounded-3xl shadow-lg h-full lg:block">
            <Image
              src="/scholarshipdetail/illustration.png"
              alt="Illustration"
              className="w-full h-full object-cover rounded-3xl"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Requireddocs;
