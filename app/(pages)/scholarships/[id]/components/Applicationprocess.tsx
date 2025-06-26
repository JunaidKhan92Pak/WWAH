import React, { Key, ReactNode } from "react";

import Banner from "@/components/ui/enrollment/Banner";
// interface ReadMoreProps {
//   children: React.ReactNode;
// }

interface ApplicationProcessStep {
  details: ReactNode;
  step: ReactNode;
  _id: Key | null | undefined;
  title: ReactNode;
  description: ReactNode;
}

interface ApplicationprocessProps {
  applicationProcess: ApplicationProcessStep[];
}

const Applicationprocess: React.FC<ApplicationprocessProps> = ({
  applicationProcess,
}) => {
  return (
    <div>
      <section className=" mx-auto p-2 md:p-6 w-[90%]">
        <h2 className="md:mb-6 my-2 text-center font-bold">
          Application Process!
        </h2>

        <div className="">
          {applicationProcess.map((item) => {
            const withLinks = String(item.details ?? "")
              .replace(
                /(Apply Now)/gi,
                '<a href="/dashboard/overview" class="text-red-600 font-semibold underline">$1</a>'
              )
              .replace(
                /(Click Here|Register here)/gi,
                '<a href="/signin" class="text-red-600 font-semibold underline">$1</a>'
              );

            return (
              <div key={item._id} className="mb-4">
                <p className="font-bold md:text-lg leading-tight md:leading-normal">
                  {item.step}
                </p>
                <p
                  className="leading-tight md:leading-normal"
                  dangerouslySetInnerHTML={{ __html: withLinks }}
                />
              </div>
            );
          })}
        </div>
      </section>

      <Banner
        title=" Schedules a free session with WWAH advisor to discuss eligibility
              or applications."
        buttonText="Book a Free counselling session!"
        buttonLink="/schedulesession"
        backgroundImage="/bg-usa.png"
      />
    </div>
  );
};
export default Applicationprocess;
