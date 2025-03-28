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
    <section className="w-[95%] mx-auto mb-10 lg:pt-10">
      <div className="lg:flex">
        <div className="flex justify-center items-center pb-4 pt-4 lg:pt-0">
          <h4 className="font-extrabold px-2 2xl:px-4">
            Applicable Departments!
          </h4>
        </div>

        {/* Scrollable Container */}
        <div
          className="flex gap-4 2xl:gap-5 w-full overflow-x-auto scrollbar-hide scroll-smooth px-2"
          style={{
            scrollbarWidth: "none", // Ensures scrollbar exists
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch", // Smooth scrolling on touch devices
          }}
        >
          {applicableDepartments.map((dept, index) => (
            <div
              key={dept._id || dept.name}
              className="p-5 border border-gray-300 rounded-3xl 
                         w-[220px] sm:w-[250px] md:w-[280px] lg:w-[300px] 2xl:w-[320px] flex-shrink-0"
            >
              <Image
                src={icons[index % icons.length]} // Prevent index errors
                width={24}
                height={24}
                alt="icon"
                className="2xl:w-[28px]"
              />
              <div className="mt-2">
                <h6 className="font-bold">{dept.name}</h6>
                <p className="mt-2 text-[12px] sm:text-[14px] md:text-[16px] 2xl:text-[18px]">
                  {dept.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Applicationdepartment;
