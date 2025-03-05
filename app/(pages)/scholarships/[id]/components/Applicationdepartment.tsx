// import React from "react";
// import Image from "next/image";
// interface ApplicationdepartmentProps {
//   applicableDepartments: string[];
// }

// const Applicationdepartment: React.FC<ApplicationdepartmentProps> = ({ applicableDepartments }) => {
//   console.log(applicableDepartments);

//   return (
//     <>
//       <section className="w-[90%] mx-auto mb-10 lg:pt-10">
//         <div className="lg:flex">
//           <div className="flex justify-center items-center md:pb-10 pb-5">
//             <h3 className="font-extrabold px-2 2xl:px-4">
//               Applicable Department!
//             </h3>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 2xl:gap-5 2xl:w-[95%]">
//             <div className="lg:p-5 p-3 border border-gray-300 rounded-3xl">
//               <Image
//                 src="/scholarshipdetail/pen.png"
//                 width={18}
//                 height={18}
//                 alt="pen"
//                 className="2xl:w-[28px]"
//               />
//               <div className="mt-2">
//                 <h5 className="font-bold">Liberal Arts and Social Sciences</h5>
//                 <p className="mt-2 text-[12px] 2xl:text-2xl">
//                   Nursing, Radiation Convergence Chemistry, Biological Science,
//                   Smart Food & Drugs (Food & Life Science, Pharmaceutical
//                   Engineering), Biomedical Engineering.
//                 </p>
//               </div>
//             </div>
//             <div className="lg:p-5 p-3 border border-gray-300 rounded-3xl">
//               <Image
//                 src="/scholarshipdetail/lamp.png"
//                 width={18}
//                 height={18}
//                 alt="pen"
//                 className="2xl:w-[28px]"
//               />
//               <div className="mt-2">
//                 <h5 className="font-bold">College of Natural Sciences</h5>
//                 <p className="mt-2 text-[12px] 2xl:text-2xl ">
//                   Mechanical Engineering, Civil and Environmental Engineering,
//                   Nanoscience & Engineering, Digital Anti-Aging Health Care
//                 </p>
//               </div>
//             </div>
//             <div className="lg:p-5 p-3 border border-gray-300 rounded-3xl">
//               <Image
//                 src="/scholarshipdetail/wheel.png"
//                 width={18}
//                 height={18}
//                 alt="pen"
//                 className="2xl:w-[28px]"
//               />
//               <div className="mt-2">
//                 <h5 className="font-bold">College of Engineering</h5>
//                 <p className="mt-2 text-[12px] 2xl:text-2xl">
//                   Computer Engineering, Architecture, Healthcare Information
//                   Technology, Industrial and Management, Energy System
//                   Engineering
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col gap-2 items-start justify-center smd:p-5 p-2 border border-gray-300 rounded-3xl">
//               <div className="border-b border-gray-300 p-3">
//                 <Image
//                   src="/scholarshipdetail/wheel.png"
//                   width={18}
//                   height={18}
//                   alt="pen"
//                   className="2xl:w-[28px]"
//                 />
//                 <div className="mt-2">
//                   <h5 className="font-bold">Medicine </h5>
//                   <p className="mt-2 text-[12px] 2xl:text-2xl">
//                     Medicine, Biomedical Sciences.
//                   </p>
//                 </div>
//               </div>
//               <div className="p-3">
//                 <Image
//                   src="/scholarshipdetail/wheel.png"
//                   width={18}
//                   height={18}
//                   alt="pen"
//                   className="2xl:w-[28px]"
//                 />
//                 <div className="mt-2">
//                   <h5 className="font-bold">College of Art </h5>
//                   <p className="mt-2 text-[12px] 2xl:text-2xl">
//                     U-Design, Music.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Applicationdepartment;
"use client";
import React from "react";
import Image from "next/image";

interface Department {
  _id?: string;
  name: string;
  details: string;
}

interface ApplicationdepartmentProps {
  applicableDepartments: Department[];
}

const Applicationdepartment: React.FC<ApplicationdepartmentProps> = ({ applicableDepartments }) => {
  return (
    <section className="w-[90%] mx-auto mb-10 lg:pt-10">
      <div className="lg:flex">
        <div className="flex justify-center items-center md:pb-10 pb-5">
          <h3 className="font-extrabold px-2 2xl:px-4">Applicable Department!</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 2xl:gap-5 2xl:w-[95%]">
          {applicableDepartments.map((dept) => (
            <div key={dept._id || dept.name} className="lg:p-5 p-3 border border-gray-300 rounded-3xl">
              {/* You can adjust the image source as needed */}
              <Image
                src="/scholarshipdetail/pen.png"
                width={18}
                height={18}
                alt="icon"
                className="2xl:w-[28px]"
              />
              <div className="mt-2">
                <h5 className="font-bold">{dept.name}</h5>
                <p className="mt-2 text-[12px] 2xl:text-2xl">{dept.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Applicationdepartment;
