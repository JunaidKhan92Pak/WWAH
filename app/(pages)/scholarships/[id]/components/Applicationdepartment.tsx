
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
