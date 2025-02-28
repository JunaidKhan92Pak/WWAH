import Image from "next/image";
import React from "react";
// import StudyInUk from "/StudyInUK.png";
// import StudyInUk from "../../../../public/StudyInUK.png";
// import StudyInUk from "./StudyInUk";
import { Button } from "@/components/ui/button";


type Tab = {
    label: string;
    id: string;
};

const Page = () => {
    const tabs: Tab[] = [
        { label: "Active Application", id: "activeapplication" },
        { label: "Completed Application", id: "completedapplication" },

    ];

    const [activeTab, setActiveTab] = useState<string>("activeapplication");

    return (
        <>
            <div className="border rounded-xl w-[97%] mx-auto p-2">
                <h5 className="text-center mb-4 lg:mb-6">Application Status Tracker</h5>
                <div className="grid grid-cols-2 gap-4  sm:w-[85%] xl:w-[50%]">


                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`transition px-4 font-semibold text-[0.8rem] sm:text-lg py-4 rounded-t-xl rounded-b-none bg-transparent hover:bg-transaprent
                                ${activeTab === tab.id
                                    ? "bg-[#C7161E] text-white" : "text-gray-600"
                                }`}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>


              </div>

              {/* Right Section with Reduced Border Height */}
              <div className="relative w-full pl-2 flex flex-col justify-center items-start">
                <div className="block md:hidden absolute left-0 top-1/2 transform -translate-y-1/2 h-[70px] w-[1px] bg-white"></div>
                <div className="flex h-[50%] items-center  border-b md:border-b-0 pb-3">
                  <p>Healthcare Management</p>
                </div>
                <p className="flex h-[50%] items-center  md:pl-6 pt-4">Healthcare Policy</p>
              </div>
            </div>







          </div>
        </div>
      </section>
      <section
        className="relative mt-10 text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",

          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:flex-row w-full py-9 md:px-12 lg:gap-10 sm:gap-0 gap-5">
          <div className="relative w-full lg:w-1/2">
            <h4 className="md:w-full text-gray-900 leading-6 text-center lg:text-left">
              Discover Scholarship Opportunities on our Scholarships Page!
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Link href="/scholarships">
              <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                Explore Scholarship Options
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

