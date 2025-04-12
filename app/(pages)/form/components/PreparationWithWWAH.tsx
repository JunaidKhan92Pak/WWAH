import React from 'react'
import Image from 'next/image';

interface ExpenseItem {
  title: string;
  image: string;
  bgColor: string;
}

const expenseData: ExpenseItem[] = [
  {
    image: "/Frame.png",  // You can use local image paths (from the `public` folder) or remote URLs
    title: "Experienced Instructors",
    bgColor: "bg-[#FCE7D2]",
  },
  {
    image: "/Book.png",  // You can use local image paths (from the `public` folder) or remote URLs
    title: "Comprehensive Study Materials",
    bgColor: "bg-[#F4D0D2]",
  },
  {
    image: "/Monitor-Camera.png",  // You can use local image paths (from the `public` folder) or remote URLs
    title: "Online / In Person Sessions",
    bgColor: "bg-[#FCE7D2]",
  },
  {
    image: "/Medal-Star.png",  // You can use local image paths (from the `public` folder) or remote URLs
    title: "Proven Results",
    bgColor: "bg-[#F4D0D2]",
  },
];
const PreparationWithWWAH = () => {
  return (
    <>
      <div className="mx-auto w-[90%] overflow-hidden">

        <div className="flex items-center justify-center mt-4 md:mt-6">
          <div className="text-center w-full sm:w-full md:w-[70%] lg:w-[60%]">
            <h3 className="text-[#313131] leading-6 md:leading-10">
              Why choose WWAH for IELTS/PTE/TOEFL Preparation?
            </h3>
            <p className="md:mt-2 text-[#313131] px-6 sm:px-0 text-justify sm:text-center ">
              Choose WWAH for your IELTS, PTE and TOEFL preparation and experience
              a tailored, results-driven approach. With expert instructors,
              flexible schedules, and a wealth of resources, WWAH ensures you&apos;re
              fully equipped to reach your target score.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border-transparent w-full mx-auto p-4 md:my-8 md:w-[90%] xl:w-[65%]">
          {/* 4 Divs in a Row */}
          <div className="grid  grid-cols-2 lg:grid-cols-4 gap-4">
            {expenseData.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center h-[100px] md:h-[200px] lg:h-[250px] gap-2  rounded-3xl ${item.bgColor}`}
              >
                {/* Image */}
                <div className="flex items-center justify-center w-full overflow-hidden">
                  <Image
                    src={item.image} // Image URL (it could be a local or remote image)
                    alt={item.title}  // Alt text for accessibility
                    width={40}         // Width of the image
                    height={40}        // Height of the image
                    className="object-cover w-[20px] h-[20px] md:h-[30px] md:w-[30px]"  // Ensures the image covers the space properly
                  />
                </div>

                {/* Title Below Image */}
                <p className="text-center px-2 md:px-0 md:w-4/6 text-[12px] md:text-[14px] font-medium leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PreparationWithWWAH
