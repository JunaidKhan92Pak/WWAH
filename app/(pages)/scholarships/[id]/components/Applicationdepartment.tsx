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

const Applicationdepartment: React.FC<ApplicationdepartmentProps> = ({
  applicableDepartments,
}) => {
  const icons = [
    "/scholarshipdetail/tube.png",
    "/scholarshipdetail/lamp.png",
    "/scholarshipdetail/wheel.png",
    "/scholarshipdetail/medicine.png",
    "/scholarshipdetail/pen.png",
  ];
  return (
    <section className="w-[90%] mx-auto mb-10 lg:pt-10">
      <div className="lg:flex">
        <div className="flex justify-center items-center pb-4 pt-4 lg:pt-0">
          <h4 className="font-extrabold px-2 2xl:px-4">
            Applicable Department!
          </h4>
        </div>
        <div className="flex gap-4 2xl:gap-5 2xl:w-[95%] overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          {applicableDepartments.map((dept, index) => (
            <div
              key={dept._id || dept.name}
              className="lg:p-6 p-5 border border-gray-300 rounded-3xl min-w-[200px] lg:min-w-[230px] 2xl:min-w-[300px]"
            >
              <Image
                src={icons[index]}
                width={18}
                height={18}
                alt="icon"
                className="2xl:w-[28px]"
              />
              <div className="mt-2">
                <h6 className="font-bold">{dept.name}</h6>
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
