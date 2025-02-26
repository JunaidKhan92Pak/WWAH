import React from "react";
interface HeroProps {
  country: string;
}

const Hero: React.FC<HeroProps> = ({ country }) => {
  return (
    <div>
      <section className="w-[90%] mx-auto">
        <div
          className="relative mt-4 h-[200px] md:h-[80vh] flex justify-center items-center text-center rounded-2xl text-white bg-cover bg-center"
          style={{
            backgroundImage: "url('/visaBg.png')",
          }}
        >
          <div className="w-4/5 ">
            <div className="flex flex-col items-start md:w-3/5">
              <h1 className="text-left">
                Your Comprehensive Guide to the {country} Visa Application
                Process!
              </h1>
              <p className="py-2">
                &quot;Step-by-Step Visa Application Process&quot;{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Hero;
